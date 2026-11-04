"use client"
export default function Deportista({nombre, apellido, deporte, src}){
    console.log(src)
    return(
        <div>
            <img src={`/images/${src}`}></img>
            <h2>{nombre}</h2>
            <h2>{apellido}</h2>
            <h3>{deporte}</h3>
        </div>
    )
}