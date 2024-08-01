import React, { useState } from 'react';
import styles from "./style.module.scss";
import logo from "../../../public/logo.png"
import hexa from "../../../public/hexagono.png"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa o CSS dos toasts

export default function LoginPage() {
    const [edv, setEdv] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/login/', {
                edv,
                password
            });
            if (response.status === 200) {
                console.log("Usuário logado com sucesso!");
                navigate('/home');
            } else {
                console.error("Erro ao fazer login:", response.data.message);
                toast.error("Erro ao fazer login: " + response.data.message); // Usando o toast para mensagens de erro
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            toast.error("Credenciais erradas!"); // Usando o toast para mensagens de erro
        }
    };

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
                            <input 
                                type="text" 
                                className={styles.form__field} 
                                placeholder="EDV" 
                                required 
                                value={edv}
                                onChange={(e) => setEdv(e.target.value)}
                            />

                            <label className={styles.form__label}>EDV</label>
                        </div>

                        <div className={styles.form__group}>
                            <input 
                                type="password" 
                                className={styles.form__field} 
                                placeholder="Senha" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className={styles.form__label}>Senha</label>
                        </div>

                        <button className={styles.entrar} onClick={handleSubmit}>
                            Entrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Adicione o ToastContainer no final do seu componente */}
            <ToastContainer />
        </>
    )
}
