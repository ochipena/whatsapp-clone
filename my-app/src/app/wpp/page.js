"use client"
import styles from "./page.module.css"
import Input from "../components/inputs";
import Image from "next/image";
import MessageButton from "../components/messageButton";
import Button from "../components/button";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useEffect } from "react";
import Chatbutton from "../components/chatButton";
import { useContacts } from "../context/ContactContext";

export default function home({}) {
    const { socket, isConnected } = useSocket();
    const { activeContacts} = useContacts();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        if (!socket || !isConnected) {
            console.log("Socket no está disponible aún.");
            return;
        }
    
        console.log("Socket conectado:", socket);
        /*
        socket.on('newMessage', (data) => {
            console.log("HOLALALDS")
            console.log("Nuevo mensaje recibido en la sala:", data);
            // setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        */
        socket.on('newMessage', data => {
            console.log("ASDASDAS");
        });

        return () => {
            console.log("Limpiando evento 'newMessage'");
            socket.off('newMessage');
        };
    }, [socket, isConnected]);
    
    useEffect(() =>{
        if (!messages){
            console.log("No se mando ningun mensaje");
            return;
        }

        console.log(messages);



    },[messages]);

    useEffect(() =>{
        if (!messages){
            console.log("No se mando ningun mensaje");
            return;
        }

        console.log(messages);



    },[messages]);

    function handleSendMessage() {
        const roomName = "boca"; // El nombre de la sala debe coincidir con el del componente de contactos
        if (message.trim() === "") return;
        
        // Enviar el mensaje a la sala "chat-room"
        socket.emit('sendMessage', { room: roomName, message: message });

        // Añadir el mensaje al estado local para mostrarlo en la interfaz
        setMessages((prevMessages) => [...prevMessages, message]);
        setMessage(""); // Limpiar el input después de enviar
        console.log(messages);
    }

    function handleChangeInput(event) {
        setMessage(event.target.value);
    }
    //<Button onClick={()=>socket.emit('joinRoom',{room:"boca"})} text="Conectar/ Unirse a la sala"/>

    return (
        <div className={styles.div_child}>
            <section className={styles.barraContactos}>
                {activeContacts.map((contact) => (
                    <Chatbutton
                        key={contact.telefono} // Añadir una clave única
                        srcImg={contact.imagenContacto}
                        alt={contact.nombre}
                        contacto={contact.usuarioContacto}
                        variant="barra"  // Variante para la barra de contactos
                    /> 
                ))}
            </section>
            <section className={styles.seccionMensajes}>
                {messages.map((message, index) => (
                    <MessageButton key={index} text={message} /> // Renderizar componente Mensaje para cada mensaje
                ))}
            </section>
            <section className={styles.barraDeEscribir}>
                <div className={styles.escribirDiv}>
                    <Input variant="Escribir" placeholder="Escribir" value={message} onChange={handleChangeInput} />
                </div>
                <div>

                    <Image className={styles.iconoEnviar} onClick={handleSendMessage}
                        src="/images/icono_Enviar.png"
                        width={35}
                        height={35}
                        alt="iconoEnviar"
                    />
                </div>
            </section>
        </div>
    )
}