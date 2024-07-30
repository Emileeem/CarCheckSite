import styles from "./style.module.scss";
import logo from "../../../public/logo.png"
import hexa from "../../../public/hexagono.png"

export default function LoginPage() {
    return (
        <>
            <div className={styles.principal}>
                <div className={styles.esquerdo}>
                    <img src={logo} alt="logo sistema fiep" className={styles.logo}/>
                    <p className={styles.bordao}> TECNOLOGIA PARA VIDA </p>
                    <img src={hexa} alt="logo sistema fiep" className={styles.hexa}/>
                </div>
                <div className={styles.direito}>
                    <div className={styles.login}>
                        <h1> Login </h1>

                        <div className={styles.form__group}>
                            <input type="text" className={styles.form__field} placeholder="EDV" required />
                            <label  className={styles.form__label}>EDV</label>
                        </div>

                        <div className={styles.form__group}>
                            <input type="password" className={styles.form__field} placeholder="Senha" required />
                            <label  className={styles.form__label}>Senha</label>
                        </div>

                        <button className={styles.entrar}>
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}