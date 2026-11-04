
import styles from "./chatButton.module.css"
import clsx from "clsx"
export default function Chatbutton({contacto,srcImg,alt,variant,onClick}) {
    return(
        <div className={clsx((styles.chatButton),{
            [styles.barraButton]: variant === "barra"
        })} onClick={onClick}>
            <div>
                <img
                    src={`/images/${srcImg}`}
                    width={50}
                    height={50}
                    alt={alt}
                    className={clsx((styles.img),{
                        [styles.imgBarra]: variant === "barra"
                    })}
                />
            </div>
            <div className={styles.div}>
                <h2 className={styles.h2}>{contacto}</h2>
            </div>
        </div>
    )
}