import { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Funcionarios from "../../components/FuncionariosComponent/Funcionarios";
import Carros from '../../components/CarrosComponent/Carros';
import verifyJWT from '../../helpers/VerifyJWT.jsx'
import { useNavigate } from 'react-router-dom';
import { api } from "../../services/api.jsx"
import transfer from "../../../public/transfer.png"

export default function HomePage() {
    const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
    const [currVisualizar, setCurrVisualizar] = useState(0)
    const [isAtualizarModalOpen, setIsAtualizarModalOpen] = useState(false);
    const [currAtualizar, setCurrAtualizar] = useState(0)
    const [isDeletarModalOpen, setIsDeletarModalOpen] = useState(false);
    const [currDeletar, setCurrDeletar] = useState(0)
    const [isNovaPlacaModalOpen, setIsNovaPlacaModalOpen] = useState(false);
    const [isNovoLoginModalOpen, setIsNovoLoginModalOpen] = useState(false);
    const [route, setRoute] = useState(false)
    const [openDetail, setOpenDetail] = useState(1)
    const [cars, setCars] = useState([]);
    const [logs, setLogs] = useState([]);
    const [func, setFunc] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Verificação do JWT e redirecionamento
        const verificarJWT = () => {
            try {
                let teste = verifyJWT();
                if (!localStorage.getItem("token") || !teste.adm) {
                    localStorage.removeItem("auth");
                    localStorage.removeItem("token");
                    navigate("/");
                }
            } catch (error) {
                console.error('Erro ao verificar JWT:', error);
                navigate("/");
            }
        };
    
        verificarJWT();
    
        // Busca dos logs
        const fetchLogs = async () => {
            if (openDetail) {
                try {
                    const response = await api.get(`/api/log/${openDetail}`);
                    setLogs(response.data);
                } catch (error) {
                    console.error('Erro ao buscar logs:', error);
                }
            }
        };
    
        fetchLogs();
        
    }, [navigate, openDetail]); // Remova logs da lista de dependências
    

    function openVisualizarModal(id){
        setIsVisualizarModalOpen(true);
        setCurrVisualizar(id)
        console.log(id)
    } 
    const closeVisualizarModal = () => setIsVisualizarModalOpen(false);

    function openAtualizarModal(id){
        setIsAtualizarModalOpen(true);
        setCurrAtualizar(id)
        console.log(id)
    } 
    const closeAtualizarModal = () => setIsAtualizarModalOpen(false);

    function openDeletarModal(id){
        setIsDeletarModalOpen(true);
        setCurrDeletar(id)
        console.log(id)
    } 
    const closeDeletarModal = () => setIsDeletarModalOpen(false);

    const openNovaPlacaModal = () => setIsNovaPlacaModalOpen(true);
    const closeNovaPlacaModal = () => setIsNovaPlacaModalOpen(false);

    const openNovoLoginModal = () => setIsNovoLoginModalOpen(true);
    const closeNovoLoginModal = () => setIsNovoLoginModalOpen(false);

    async function handleGetUsers(params) {
        params = params.replace("-", "");
        if(params){
            if(route) {
                if(params.length === 8) {
                    try {
                        const response = await api.get(`/api/funcionario/${params}`);
                        setFunc(response.data)
                        try {
                            const responseCars = await api.get(`/api/carro/funcId/${response.data.ID}`)
                            console.log(responseCars.data)
                            setCars(responseCars.data)
                            localStorage.setItem("currSearch", response.data)
                        } catch (error) {
                            console.error('Erro ao buscar carros', error);
                        }
                    }
                    catch (error) {
                        console.error('Erro ao buscar funcionario', error);
                    }
                }
            }
            else {
                if(params.length === 7){
                    console.log("A")
                    try {
                        let provArray = []
                        const response = await api.get(`/api/carro/placa/${params}`);
                        provArray.push(response.data)
                        setCars(provArray)
                        const response2 = await api.get(`/api/funcionario/id/${response.data.FuncionarioID}`);
                        setFunc(response2.data)
                    } catch (error) {
                        console.error("Erro ao buscar carros", error)
                    }
                }
            }
        }
        else{
            setFunc(localStorage.getItem("currSearch"))
        }
    }

    async function handleDeletarCarro(){
        try {
            await api.delete(`/api/carro/${currDeletar}`)
            setIsDeletarModalOpen(false);
            let aux = cars.filter(function( obj ) {
                return obj.ID !== currDeletar
            });
            console.log(aux, "DDDDDDDDDDDDDDDDDDDDDDDD")
            setCars(aux);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.principal}>
            <nav className={styles.nav}>
                <h3> Home </h3>
                <h3 onClick={openNovaPlacaModal}> Nova Placa </h3>
                <h3 onClick={openNovoLoginModal}> Novo Login </h3>
                <div style={{width: "25%", alignItems: "center", display: "flex", justifyContent: "space-between"}}>
                    <button className={styles.placaEDV} onClick={() => {setRoute(prev => !prev); console.log(route)}}>
                        {route ? "Placa" : "EDV"}
                        <img src={transfer} alt="imagem transfer" className={styles.transfer}/>
                    </button>
                    <input type='text' placeholder={route?"Buscar colaborador":"Buscar placa"} className={styles.busca} onChange={(e) => handleGetUsers(e.target.value)}/>
                </div>
            </nav>

            <section className={styles.corpo}>
                {cars && cars.map((item, index) => (
                    <>
                        <details onClick={() => setOpenDetail(item.ID)} key={index} open={() => openDetail === index}>
                            <summary>
                                <div className={styles.dados}>
                                    {func.Nome} - {item.Placa}
                                    <div className={styles.botoes}>
                                        {/* <button className={styles.entrada} onClick={() => openVisualizarModal(item.ID)}>
                                            Visualizar Entrada/Saída
                                        </button> */}
                                        <button className={styles.atualizar} onClick={() => openAtualizarModal(item.ID)}>
                                            Atualizar Dados
                                        </button>
                                        <button className={styles.deletar} onClick={() => openDeletarModal(item.ID)}>
                                            Deletar <br/> Carro
                                        </button>
                                    </div>
                                </div>
                            </summary>
                            {logs && logs.map((item, index) => {
                                return(
                                    <div key={index} className={styles.logs}>
                                        Entrada - {item.DiaEntrada} {item.HoraEntrada} / Saída - {item.DiaSaida} {item.HoraSaida}
                                    </div>
                                )
                            })}
                        </details>
                        <hr/>
                    </>
                ))}
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
                        <Carros id={currAtualizar}/>
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
                        <button onClick={() => handleDeletarCarro()} className={styles.confirmButton}>Confirmar</button>
                    </div>
                </div>
            )}

            {isNovaPlacaModalOpen && (
                <div className={styles.modalOverlay} onClick={closeNovaPlacaModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Nova Placa</h2>
                        <Carros />
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
