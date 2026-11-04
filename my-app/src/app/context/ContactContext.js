import React, { createContext, useContext, useState } from 'react';

// Crea el contexto
const ContactContext = createContext();

// Proveedor del contexto
export const ContactProvider = ({ children }) => {
    const [activeContacts, setActiveContacts] = useState([]);

    return (
        <ContactContext.Provider value={{ activeContacts, setActiveContacts }}>
            {children}
        </ContactContext.Provider>
    );
};

// Hook para usar el contexto
export const useContacts = () => useContext(ContactContext);