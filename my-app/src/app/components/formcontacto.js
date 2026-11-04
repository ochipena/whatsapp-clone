import Input from "./inputs";
import Titulo from "./title";
import styles from "./formcontacto.module.css"
import { useState } from 'react';

export default function FormContacto({isOpen, onClose}){
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        usuarioContacto: '',
        urlImagen: '',
      });
      const [error, setError] = useState('');
      const [noti, setNoti] = useState('');
    
      function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value }); // Mantiene los otros campos.
      };
    
      async function handleSubmit(event){
        event.preventDefault();
        const { nombre, telefono, usuarioContacto, urlImagen } = formData;

        if (telefono.length !== 10) {
          setError('El número de teléfono debe tener 10 dígitos.');
          return;
        }
    
        if (!nombre || !telefono || !usuarioContacto || !urlImagen) {
          setError('Todos los campos son obligatorios.');
          return;
        }
        
        setError('');
        setNoti('Tu contacto se agrego correctamente');

        await envioPost();

        // Limpiamos el formulario
        setFormData({ nombre: '', telefono: '', usuarioContacto: '', urlImagen: '' });
      };
      
      async function envioPost() {
        // Armo un objeto para mandarlo como formato JSON
        const data = formData;
        console.log(data)
    
        //Envio un pedido POST con un JSON en el body 
        const response = await fetch('http://localhost:7000/InsertarContactos', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log(response);
      }

      if (!isOpen) return null;  
      return (
        <div className={styles.form}>
          <form onSubmit={handleSubmit} className={styles.formContent}>
            <span className={styles.close} onClick={onClose}>&times;</span>
            <h1>Agregar Contactos</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {noti && <p style={{ color: 'green' }}>{noti}</p>}
            <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
            <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
            <input name="usuarioContacto" placeholder="Nombre del Contacto" value={formData.usuarioContacto} onChange={handleChange} />
            <select name="urlImagen" value={formData.urlImagen} onChange={handleChange}>
              <option value="">Selecciona una imagen</option>
              <option value="fotoDePerfilWoody.jpg">Woody</option>
              <option value="fotoDePerfilCaradepapa.jpg">Caradepapa</option>
              <option value="fotoDePerfilMike.jpg">Mike Wazowski</option>
              <option value="fotoDePerfilSulley.jpg">Sulley</option>
              <option value="fotoDePerfilGusteau.jpg">Gusteau</option>
            </select>
            <button type="submit">Agregar Contacto</button>
          </form>
        </div>
      );
    };
