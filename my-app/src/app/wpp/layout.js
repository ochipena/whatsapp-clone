"use client"
import styles from "./page.module.css"
import Titulo from "../components/title";
import Input from "../components/inputs";
import Button from "../components/button";
import Chatbutton from "../components/chatButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import FormContacto from "../components/formcontacto";
import { ContactProvider, useContacts } from "../context/ContactContext";
import ContactManager from "../components/contactManager";

export default function RootLayout({ children }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const [contacts, setContacts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const UsuarioId = params.get("idUsuario");
    if (UsuarioId !== userId) {
      setUserId(UsuarioId);
    }
  }, [userId]);


  useEffect(() => {

    if (userId != null) {
      console.log(userId)
    traerContactos();

    }
  }, [userId]);

  // Función para cargar contactos
  async function traerContactos() {
    let contactos = []
    const response = await fetch('http://localhost:7000/Contactos', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    for (let index = 0; index < data.length; index++) {
      if (data[index].id_usuario == userId) {
        contactos.push(data[index])
      }

    }
    console.log("data", data)
    setContacts(contactos); // Almacenar los contactos
    console.log("contactos de la persona", contactos)
  }


  function handleContactClick(contact) {
    setActiveContacts((prev) => {
      const exists = prev.some((c) => c.telefono === contact.telefono);
      if (!exists) {
        return [...prev, contact];
      }
      return prev;
    });
  }

  // useEffect(() => {
  //   async function loadContacts() {
  //     const contactData = await traerContactos(); // Fetch real de la API
  //     setContacts(contactData);
  //   };

  //   loadContacts();
  // }, [])
  return (
    <ContactProvider>
      <html lang="en">
        <body className={styles.body}>
          <main className={styles.main}>
            <seccion className={styles.seccion_emotes}>
              <Image className={styles.emoticonos}
                src="/images/icono_Chat.png"
                width={35}
                height={35}
                alt="iconochat"
              />
              <Image className={styles.emoticonos}
                src="/images/icono_Estado.png"
                width={35}
                height={35}
                alt="iconoEstado"
              />
              <Image className={styles.emoticonos}
                src="/images/icono_Comunidad.png"
                width={35}
                height={35}
                alt="iconoComunidad"
              />
              <Image className={styles.emoticonos} onClick={openForm}
                src="/images/icono_Agregar.png"
                width={35}
                height={35}
                alt="iconoAgregar"
              />
              <FormContacto isOpen={isFormOpen} onClose={closeForm} />
            </seccion>

            <seccion className={styles.seccion_chats}>
              <seccion>
                <header className={styles.header}>
                  <Titulo text="Chats" variant="wpp" />
                </header>
                <div>
                  <Input placeholder="Buscar" variant="Buscar" />
                </div>
                <div className={styles.div_botones}>
                  <Button text="Todos" />
                  <Button text="No leídos" />
                  <Button text="Grupos" />
                </div>
              </seccion>
              <seccion className={styles.contactos}>
                <ContactManager
                  contactos={contacts}
                />
              </seccion>
            </seccion>

            <seccion>
              {children}
            </seccion>
          </main>

        </body>
      </html>
    </ContactProvider>
  );
}
