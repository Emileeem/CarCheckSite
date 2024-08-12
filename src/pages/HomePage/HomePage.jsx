import { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Funcionarios from "../../components/FuncionariosComponent/Funcionarios";
import Carros from '../../components/CarrosComponent/Carros';
import verifyJWT from '../../helpers/VerifyJWT.jsx'
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
    const [isAtualizarModalOpen, setIsAtualizarModalOpen] = useState(false);
    const [isDeletarModalOpen, setIsDeletarModalOpen] = useState(false);
    const [isNovaPlacaModalOpen, setIsNovaPlacaModalOpen] = useState(false);
    const [isNovoLoginModalOpen, setIsNovoLoginModalOpen] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        let teste = verifyJWT()
        console.log(teste)
        if(!localStorage.getItem("token"))
        {
            localStorage.removeItem("auth");
            localStorage.removeItem("token");
            navigate("/");
        }
    }, []);

    const openVisualizarModal = () => setIsVisualizarModalOpen(true);
    const closeVisualizarModal = () => setIsVisualizarModalOpen(false);

    const openAtualizarModal = () => setIsAtualizarModalOpen(true);
    const closeAtualizarModal = () => setIsAtualizarModalOpen(false);

    const openDeletarModal = () => setIsDeletarModalOpen(true);
    const closeDeletarModal = () => setIsDeletarModalOpen(false);

    const openNovaPlacaModal = () => setIsNovaPlacaModalOpen(true);
    const closeNovaPlacaModal = () => setIsNovaPlacaModalOpen(false);

    const openNovoLoginModal = () => setIsNovoLoginModalOpen(true);
    const closeNovoLoginModal = () => setIsNovoLoginModalOpen(false);

    return (
        <div className={styles.principal}>
            <nav className={styles.nav}>
                <h3> Home </h3>
                <h3 onClick={openNovaPlacaModal}> Nova Placa </h3>
                <h3 onClick={openNovoLoginModal}> Novo Login </h3>
                <input type='text' placeholder='Buscar Colaborador...' className={styles.busca}/>
            </nav>

            <section className={styles.corpo}>
                <div className={styles.dados}>
                    Colaborador - EDV  
                    <div className={styles.botoes}>
                        <button className={styles.entrada} onClick={openVisualizarModal}>
                            Visualizar Entrada/Saída
                        </button>
                        <button className={styles.atualizar} onClick={openAtualizarModal}>
                            Atualizar Dados
                        </button>
                        <button className={styles.deletar} onClick={openDeletarModal}>
                            Deletar <br/> Carro
                        </button>
                    </div>
                </div>
                <hr/>
            </section>

            {isVisualizarModalOpen && (
                <div className={styles.modalOverlay} onClick={closeVisualizarModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Visualizar Entrada/Saída</h2>
                        <p>Detalhes sobre entrada e saída do colaborador...</p>
                        <button onClick={closeVisualizarModal} className={styles.closeButton}>Fechar</button>
                    </div>
                </div>
            )}

            {isAtualizarModalOpen && (
                <div className={styles.modalOverlay} onClick={closeAtualizarModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Atualizar Dados</h2>
                        <p>Formulário para atualizar dados do colaborador...</p>
                        <button onClick={closeAtualizarModal} className={styles.closeButton}>Fechar</button>
                    </div>
                </div>
            )}

            {isDeletarModalOpen && (
                <div className={styles.modalOverlay} onClick={closeDeletarModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Confirmação de Deleção</h2>
                        <p>Você tem certeza que deseja deletar este carro?</p>
                        <button onClick={closeDeletarModal} className={styles.closeButton}>Cancelar</button>
                        <button onClick={verifyJWT} className={styles.confirmButton}>Confirmar</button>
                    </div>
                </div>
            )}

            {isNovaPlacaModalOpen && (
                <div className={styles.modalOverlay} onClick={closeNovaPlacaModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Nova Placa</h2>
                        <Carros/>
                        <button onClick={closeNovaPlacaModal} className={styles.closeButton}>Fechar</button>
                    </div>
                </div>
            )}

            {isNovoLoginModalOpen && (
                <div className={styles.modalOverlay} onClick={closeNovoLoginModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Novo Login</h2>
                        <Funcionarios />    
                        <button onClick={closeNovoLoginModal} className={styles.closeButton}>Fechar</button>
                    </div>
                </div>
            )}
            
        </div>
    );
}
