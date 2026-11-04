"use client"
import clsx from "clsx"
import styles from "./inputs.module.css"
export default function Input({placeholder, variant, onChange, value, name}){
    return(
        <input className={clsx(styles.input,{
            [styles.inputBuscar]: variant === "Buscar",
            [styles.inputEscribir]: variant === "Escribir",
        })} placeholder={placeholder} onChange={onChange} value={value} name={name}>

        </input>
    )
}