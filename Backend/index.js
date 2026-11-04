const express = require('express');
const bodyParser = require('body-parser');
const MySQL = require('./modulos/mysql');
const session = require('express-session');
const cors = require('cors'); 

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true 
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const LISTEN_PORT = 7000;

const server = app.listen(LISTEN_PORT, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

const sessionMiddleware = session({
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


app.get('/Contactos', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT * FROM Contactos;
    `)
    res.send(respuesta)
})

app.get('/DEPORTISTAS', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT * FROM DEPORTISTAS;
    `)
    res.send(respuesta)
})

app.get('/usuarios', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT nombre_usuario, contraseña, telefono FROM usuarios;
    `)
    res.send(respuesta)
})

app.get('/Chats', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT * FROM Chats;
    `)
    res.send(respuesta)
})

app.get('/Mensajes', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT * FROM Mensajes;
    `)
    res.send(respuesta)
})


app.post('/InsertarContactos', async function(req,res) {
    console.log(req.body) 
    result = await MySQL.realizarQuery(`SELECT * FROM Contactos WHERE nombre = '${req.body.nombre}' AND telefono = '${req.body.telefono}' AND usuarioContacto = '${req.body.usuarioContacto}' AND imagenContacto = '${req.body.urlImagen}'`);
    if (result.length > 0) {
        res.send("Ya existe")
    } else {
        await MySQL.realizarQuery(`INSERT INTO Contactos (nombre, telefono, usuarioContacto, imagenContacto) VALUES ('${req.body.nombre}', '${req.body.telefono}','${req.body.usuarioContacto}', '${req.body.urlImagen}')`);
        res.send("ok")
    }
})

app.post('/InsertarUsuarios', async function(req,res) {
    console.log(req.body) 
    result = await MySQL.realizarQuery(`SELECT * FROM usuarios WHERE nombre_usuario = '${req.body.nombre_usuario}' AND contraseña = '${req.body.contraseña}' AND telefono = '${req.body.telefono}'`);
    if (result.length > 0) {
        res.send("Ya existe")
    } else {
        await MySQL.realizarQuery(`INSERT INTO usuarios (nombre_usuario, contraseña, telefono) VALUES ('${req.body.nombre_usuario}','${req.body.contraseña}', '${req.body.telefono}')`);
        res.send("ok")
    }
})

/*app.post('/validarUsuario', (req, res) => {
    const resultado=0
    // Busca el usuario en la base de datos
    if(nombre_usuario === req.body.nombre_usuario && contraseña && req.body.contraseña && telefono === req.body.telefono){
        resultado=1;
        res.send(resultado)
    }

    // Si el usuario no existe o la contraseña o el teléfono no coinciden
    if (!usuario || usuario.contraseña !== contraseña || usuario.telefono !== telefono) {
        resultado=-1;
        res.send(resultado)
    }

    // Si las credenciales son correctas
    return resultado;
});*/


app.post('/validarUsuario', async (req, res) => {
    const { username, phone, password } = req.body; // Captura los datos del frontend
    console.log({username, phone, password});
    try {
      // Consulta sin WHERE, seleccionando todos los usuarios
      const query = 'SELECT * FROM usuarios';
      const usuarios = await MySQL.realizarQuery(query); // Ejecuta la consulta sin filtros
  
      // Busca manualmente si existe un usuario con el nombre de usuario y teléfono proporcionados
      const usuario = usuarios.find(
        (u) => u.nombre_usuario === username && u.telefono === phone
      );

      console.log(usuario)
  
      if (!usuario) {
        return res.json({ validation: -1 }); // Usuario no encontrado
      }
  
      // Verifica si la contraseña es correcta
      if (usuario.contraseña !== password) {
        return res.json({ validation: -1 }); // Contraseña incorrecta
      }
      
      ID_USER = usuario.id_usuario
      console.log(ID_USER)
      // Si pasa todas las validaciones
      return res.json({usuario, validation : 1})
    } catch (error) {
      console.error('Error en la validación del login:', error);
      return res.status(500).json({ validation: 0 }); // Error en la validación
    }
  });




  io.on("connection", (socket) => {
    const req = socket.request;

    socket.on('joinRoom', data => {
        if (existeSala(data.room)) {
            if (req.session.room != undefined && req.session.room.length > 0)
                socket.leave(req.session.room);
            req.session.room = data.room;
            socket.join(req.session.room);
            console.log("entraste ", req.session.room)
            io.to(req.session.room).emit('entroSala', { room: req.session.room, success: true });
        }
        else {
            codigos.push(data.room)
            req.session.room = data.room;
            socket.join(req.session.room);
            console.log("se creo ", req.session.room)
            io.to(req.session.room).emit('salaCreada', { room: req.session.room, success: true });
        }

    });

    socket.on('pingAll', data => {
        console.log("PING ALL: ", data);
        io.emit('pingAll', { event: "Ping to all", message: data });
    });

    socket.on('sendMessage', data => {
        console.log("sala: ", data.room)
        console.log("sala: ", data.message)
        io.to(data.room).emit('newMessage', {message: data.message});
        console.log("mandaste este mensaje: ", data.message)
    });

    socket.on('disconnect', () => {
        console.log("Disconnect");
    })

    socket.on('leaveRoom', () => {
        socket.leave(req.session.room);
        console.log("Disconnect");
    })

});


function existeSala(room) {
    for (let index = 0; index < codigos.length; index++) {
        if (room == codigos[index]) {
            return true
        }
    }
    return false
}

const codigos = []