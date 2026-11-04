"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./login.module.css";
import Titulo from "./components/title";
import Input from "./components/inputs";

const MiComponente = () => {
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [formData, setFormData] = useState({
        nombre_usuario: '',
        contraseña: '',
        telefono: '',
    });
    const [error, setError] = useState('');
    const [noti, setNoti] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginNoti, setLoginNoti] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [user_id, setUserId] = useState('') 
    const router = useRouter()

    const manejarRegistro = () => {
        setMostrarRegistro(true);
    };

    const manejarRegistroFalse = () => {
        setMostrarRegistro(false);
    };

    function handleOnChange(event) {
        const { name, value } = event.target;
        if (mostrarRegistro) {
            setFormData({ ...formData, [name]: value });
        }
    };
    //funciones para logearse

    async function handleLoginSubmit (e){
        e.preventDefault();
    
        const loginData = { username, password, phone }; // Agregamos el teléfono
    
        try {
          const res = await fetch('http://localhost:7000/validarUsuario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
          });
          console.log(loginData)
          const result = await res.json();
          console.log(result)
          
          if (result.validation === 1) {
            setLoginNoti('Te logueaste con exito'); // Mensaje en verde
            setLoginError(''); // Limpiar error si lo había
            router.push(`/wpp?idUsuario=${result.usuario.id_usuario}`);
          } else if (result.validation === -1) {
            setLoginError('Nombre de usuario, contraseña, o telefono incorrectos'); // Mensaje en rojo
            setLoginNoti(''); // Limpiar éxito si lo había
          } else {
            setLoginError('Error'); // Mensaje en rojo
            setLoginNoti(''); // Limpiar éxito si lo había
          }

        } catch (error) {
          setLoginError('Ocurrió un error mientras te logueabas'); // Mensaje en rojo
          setLoginNoti(''); // Limpiar éxito si lo había
        }
      };

    //funciones para registrase
    async function handleSubmit(event) {
        event.preventDefault();
        const {nombre_usuario, contraseña, telefono } = formData;

        if (telefono < 10) {
            setError('El telefono debe tener 10 digitos o mas')
            return;
        }
        
        if (contraseña.length < 5) {
            setError('Contraseña muy insegura');
            return;
        }

        if (!nombre_usuario || !contraseña) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setError('');
        setNoti('Te has registrado correctamente');

        await envioPost();

        // Limpiar el formulario
        setFormData({ nombre_usuario: '', contraseña: '', telefono: '' });
    };

    async function envioPost() {
        const data = formData;
        console.log(data);

        const response = await fetch('http://localhost:7000/InsertarUsuarios', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log(response);
    }

    async function validacion() {
        const data = loginData;
        console.log(data);

        const response = await fetch('http://localhost:7000/validarUsuario', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log(response);
    }

    
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={mostrarRegistro ? handleSubmit : handleLoginSubmit}>
                {mostrarRegistro ? (
                    <div className={styles.divInputs}>
                        <h2 className={styles.h3}>Formulario de Registro</h2>
                        <div className={styles.line}></div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {noti && <p style={{ color: 'green' }}>{noti}</p>}
                        <div className={styles.divInputs}>
                            <Input name="nombre_usuario" placeholder="Nombre de usuario" value={formData.nombre_usuario} onChange={handleOnChange} />
                        </div>
                        <div className={styles.divInputs}>
                            <Input name="contraseña" placeholder="Contraseña" type="password" value={formData.contraseña} onChange={handleOnChange} />
                        </div>
                        <div className={styles.divInputs}>
                            <Input name="telefono" placeholder="Telefono" value={formData.telefono} onChange={handleOnChange} />
                        </div>
                        <div className={styles.line}></div>
                        <button className={styles.button} type="submit">Registrarse</button>
                        <div className={styles.lineRes}></div>
                        <button className={styles.buttonRegistrarse} type="submit">Volver</button>
                    </div>
                ) : (
                    <div>
                        <Titulo text="Bienvenido a Whatsapp" variant="login" />
                        <div className={styles.line}></div>
                        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                        {loginNoti && <p style={{ color: 'green' }}>{loginNoti}</p>}
                        <div className={styles.divInputs}>
                            <Input name="nombre_usuario" placeholder="Nombre de Usuario" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className={styles.divInputs}>
                            <Input name="contraseña" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className={styles.divInputs}>
                            <Input name="telefono" placeholder="Numero de Telefono" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <button className={styles.button} type="submit">Ingresar</button>
                        <div className={styles.line}></div>
                        <h3 className={styles.h3}>
                            ¿No tienes cuenta?
                        </h3>
                        <button onClick={manejarRegistro} className={styles.buttonRegistrarse}>Ingresate aquí</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MiComponente;






/*
"use client"
import Input from "./components/inputs"
import Titulo from "./components/title"
import styles from "./login.module.css"
export default function Login(){
    return(
        <div className={styles.container}>
            <form className={styles.form}>
                <div>
                    <Titulo text="Bienvenido a Whatsapp" variant="login"/>
                    <div className={styles.line}></div>
                </div>
                <div>
                    <div className={styles.divInputs}>
                    <Input placeholder="Nombre de usuario"/>
                    </div>
                    <div className={styles.divInputs}>
                    <Input placeholder="Contraseña"/>
                    </div>
                    <div>
                    <button className={styles.button}>Ingresar</button>
                    </div>
                    <h3 className={styles.h3}> ¿No tienes cuenta? Resgistrate aqui</h3>
                </div>
                <div className={styles.line}></div>
            </form>
        </div>
    )
}*/