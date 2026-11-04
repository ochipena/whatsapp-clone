"use client";
import { useContacts } from "../context/ContactContext";
import Chatbutton from "../components/chatButton";
import { useEffect, useState } from "react";
import styles from "../components/contactManager.module.css";
import { useSocket } from "../hooks/useSocket";

export default function ContactManager({contactos}) {
  const {setActiveContacts } = useContacts(); // Ahora disponible dentro del contexto
  const { socket } = useSocket();
  
  function handleContactClick(contact) {
    // Evitar agregar contactos duplicados
    const roomName = "boca"
    setActiveContacts([contact]);
    console.log("Contacto seleccionado:", contact);
    socket.emit('joinRoom',{room : roomName})
    console.log(`${contact.usuarioContacto} se ha unido a la sala ${roomName}`);
  }


  return (
    <div className={styles.div_chatbuttons}>
      {contactos.map((contact) => (
        <Chatbutton
          key={contact.telefono}
          srcImg={contact.imagenContacto}
          alt={contact.nombre}
          contacto={contact.usuarioContacto}
          onClick={() => handleContactClick(contact)}
        />
      ))}
    </div>
  );
}