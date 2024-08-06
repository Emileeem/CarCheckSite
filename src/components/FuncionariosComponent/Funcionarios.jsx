import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./style.module.scss";
import verifyJWT from '../../helpers/VerifyJWT';

export default function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formValues, setFormValues] = useState({
        nome: "",
        edv: "",
        senha: "",
        endereco: {
            cep: "",
            cidade: "",
            bairro: "",
            rua: "",
            complemento: "",
            uf: "",
        },
        adm: false
    });

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/funcionarios');
            if (response.ok) {
                const data = await response.json();
                setFuncionarios(data);
            } else {
                console.error('Erro ao buscar funcionários:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleEnderecoChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            endereco: {
                ...prevValues.endereco,
                [name]: value
            }
        }));
    };

    const handleSaveFuncionario = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/funcionario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });
            if (response.ok) {
                const result = await response.json();
                if (result) {
                    toast.success('Funcionário cadastrado com sucesso!');
                    fetchFuncionarios();
                    handleCloseModal();
                } else {
                    toast.error('Erro ao cadastrar funcionário');
                }
            } else {
                toast.error('Erro ao cadastrar funcionário');
            }
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            toast.error('Erro ao cadastrar funcionário');
        }
    };

    const handleCepBlur = async () => {
        const cep = formValues.endereco.cep;
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (data && !data.erro) {
                    setFormValues(prevValues => ({
                        ...prevValues,
                        endereco: {
                            ...prevValues.endereco,
                            cidade: data.localidade,
                            bairro: data.bairro,
                            rua: data.logradouro,
                            uf: data.uf,
                            complemento: data.complemento || ""
                        }
                    }));
                } else {
                    console.error('Erro ao buscar CEP:', data);
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    return (
        <div className={styles.funcionarios}>
            <div className={styles.table}>
                {funcionarios.map(funcionario => (
                    <div key={funcionario.edv} className={styles.funcionarioItem}>
                        <h3>{funcionario.nome}</h3>
                        <p>EDV: {funcionario.edv}</p>
                        <p>Endereço: {funcionario.endereco.rua}, {funcionario.endereco.bairro}, {funcionario.endereco.cidade} - {funcionario.endereco.uf}</p>
                        <p>Complemento: {funcionario.endereco.complemento}</p>
                        <p>Administrador: {funcionario.adm ? 'Sim' : 'Não'}</p>
                    </div>
                ))}
            </div>
                    <form>
                        <input
                            type="text"
                            name="nome"
                            value={formValues.nome}
                            onChange={handleInputChange}
                            placeholder="Nome"
                        />
                        <input
                            type="text"
                            name="edv"
                            value={formValues.edv}
                            onChange={handleInputChange}
                            placeholder="EDV"
                        />
                        <input
                            type="password"
                            name="senha"
                            value={formValues.senha}
                            onChange={handleInputChange}
                            placeholder="Senha"
                        />
                        <input
                            type="text"
                            name="cep"
                            value={formValues.endereco.cep}
                            onChange={handleEnderecoChange}
                            onBlur={handleCepBlur}
                            placeholder="CEP"
                        />
                        <input
                            type="text"
                            name="cidade"
                            value={formValues.endereco.cidade}
                            onChange={handleEnderecoChange}
                            placeholder="Cidade"
                        />
                        <input
                            type="text"
                            name="bairro"
                            value={formValues.endereco.bairro}
                            onChange={handleEnderecoChange}
                            placeholder="Bairro"
                        />
                        <input
                            type="text"
                            name="rua"
                            value={formValues.endereco.rua}
                            onChange={handleEnderecoChange}
                            placeholder="Rua"
                        />
                        <input
                            type="text"
                            name="complemento"
                            value={formValues.endereco.complemento}
                            onChange={handleEnderecoChange}
                            placeholder="Complemento"
                        />
                        <input
                            type="text"
                            name="uf"
                            value={formValues.endereco.uf}
                            onChange={handleEnderecoChange}
                            placeholder="UF"
                        />
                        <label  className={styles.adm}>
                            <input
                                type="checkbox"
                                name="adm"
                                checked={formValues.adm}
                                onChange={event => setFormValues(prevValues => ({
                                    ...prevValues,
                                    adm: event.target.checked
                                }))}
                            />
                            Administrador
                        </label>
                    </form>
                    <button  className={styles.salvar} onClick={handleSaveFuncionario}>
                        Salvar
                    </button>
            <ToastContainer />
        </div>
    );
}
