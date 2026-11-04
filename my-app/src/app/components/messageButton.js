import styles from "./messageButton.module.css"
export default function MessageButton({text}) {
    return(
        <section className={styles.mensaje}>
            <div className={styles.texto}>
                {text}
            </div>
        </section>
    )
}