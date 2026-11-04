import styles from "./title.module.css"
import clsx from "clsx"
export default function Titulo({text,variant}){
    return(
        <h1 className={clsx(styles.title,{
            [styles.wpp]: variant === "wpp",
            [styles.login]: variant === "login",
        })}>{text}</h1>
    )
}