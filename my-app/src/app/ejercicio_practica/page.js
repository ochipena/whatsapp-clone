"use client"
import { useState } from "react";
import { useEffect } from "react";
import Deportista from "../components/deportista";
export default function EjercicioPractica() {
    const [deportistas, setDeportistas] = useState([]);
    useEffect(()=>{
        async function traerDeportistas() {
            const response = await fetch('http://localhost:7000/DEPORTISTAS' , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            console.log(result)
            setDeportistas(result);
            console.log(deportistas);   
        }
        traerDeportistas();
    },[])

    /*OTRA FORMA DE HACERLO(MAS DIFICIL):
    useEffect(() => {
        const fetchDeportistas = async () => {
            try {
                const result = await traerDeportistas(); // Esperamos a que la función traerDeportistas resuelva
                setDeportistas(result); // Actualizamos el estado con el resultado
            } catch (error) {
                console.error("Error al traer deportistas:", error);
            }
        };
        
        fetchDeportistas(); // Llamamos a la función que maneja el fetch
    }, []); // [] hace que el useEffect solo se ejecute una vez cuando el componente monta

    async function traerDeportistas() {
        const response = await fetch('http://localhost:7000/DEPORTISTAS', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json(); // Aseguramos que se resuelva como JSON
        console.log(result);
        return result; // Devolvemos el resultado
    }
    */

    return(
        <div>
            <h1>EJERCICIO PRACTICA</h1>
            <div>
                {deportistas.map((deportista) => (
                    <Deportista
                    key={deportista.idDEPORTISTA} 
                    src={deportista.imagen}
                    nombre={deportista.nombre}
                    apellido={deportista.apellido}
                    deporte={deportista.deporte}
                    />
                ))}
            </div>
        </div>
    )
}