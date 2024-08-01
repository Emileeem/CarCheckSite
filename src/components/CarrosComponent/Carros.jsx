import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./style.module.scss";

export default function Carros() {
    const [carros, setCarros] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [filteredFuncionarios, setFilteredFuncionarios] = useState([]);
    const [formValues, setFormValues] = useState({
        cor: "",
        placa: "",
        modelo: "",
        ano: "",
        edv: "", // Alterado de funcionarioID para edv
    });

    useEffect(() => {
        fetchCarros();
        fetchFuncionarios();
    }, []);

    const fetchCarros = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/carro');
            if (response.ok) {
                const data = await response.json();
                setCarros(data.data); // Supondo que o array de carros esteja em 'data.data'
            } else {
                console.error('Erro ao buscar carros:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar carros:', error);
        }
    };

    const fetchFuncionarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/funcionario');
            if (response.ok) {
                const data = await response.json();
                setFuncionarios(data.data); // Supondo que o array de funcionários esteja em 'data.data'
            } else {
                console.error('Erro ao buscar funcionários:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));

        if (name === "edv") {
            searchFuncionarioByEDV(value);
        }
    };

    const searchFuncionarioByEDV = (edv) => {
        if (edv) {
            const funcionario = funcionarios.find(f => f.edv && f.edv.toLowerCase() === edv.toLowerCase());
            if (funcionario) {
                setFilteredFuncionarios([]);
                // No longer need to set funcionarioID since we are using edv directly
            } else {
                setFilteredFuncionarios(funcionarios.filter(f => 
                    f.edv && f.edv.toLowerCase().includes(edv.toLowerCase()) ||
                    f.nome && f.nome.toLowerCase().includes(edv.toLowerCase())
                ));
            }
        } else {
            setFilteredFuncionarios([]);
        }
    };

    const handleFuncionarioSelect = (funcionario) => {
        setFormValues(prevValues => ({
            ...prevValues,
            edv: funcionario.edv
        }));
        setFilteredFuncionarios([]);
    };

    const handleSaveCarro = async () => {
        try {
            // Verifica se o edv está presente no formValues
            if (!formValues.edv) {
                toast.error('Digite o EDV do funcionário antes de salvar o carro.');
                return;
            }

            // Verifica se todos os campos obrigatórios estão preenchidos
            const { cor, placa, modelo, ano, edv } = formValues;
            if (!cor || !placa || !modelo || !ano || !edv) {
                toast.error('Todos os campos são obrigatórios.');
                return;
            }

            const response = await fetch('http://localhost:3000/api/carro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cor: formValues.cor,
                    placa: formValues.placa,
                    modelo: formValues.modelo,
                    ano: formValues.ano,
                    edv: formValues.edv,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Carro cadastrado com sucesso!');
                fetchCarros(); 
                setFormValues({
                    cor: "",
                    placa: "",
                    modelo: "",
                    ano: "",
                    edv: "",
                });
                console.log(result);
            } else {
                const errorData = await response.json();
                toast.error(`Erro ao cadastrar carro: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar carro:', error);
            toast.error('Erro ao cadastrar carro');
        }
    };

    return (
        <div className={styles.carros}>
            <form>
                <input
                    type="text"
                    name="placa"
                    value={formValues.placa}
                    onChange={handleInputChange}
                    placeholder="Placa"
                />
                <input
                    type="text"
                    name="cor"
                    value={formValues.cor}
                    onChange={handleInputChange}
                    placeholder="Cor"
                />
                <input
                    type="text"
                    name="modelo"
                    value={formValues.modelo}
                    onChange={handleInputChange}
                    placeholder="Modelo"
                />
                <input
                    type="text"
                    name="ano"
                    value={formValues.ano}
                    onChange={handleInputChange}
                    placeholder="Ano"
                />
                <input
                    type="text"
                    name="edv"
                    value={formValues.edv}
                    onChange={handleInputChange}
                    placeholder="Digite o EDV do Funcionário"
                />
                {filteredFuncionarios.length > 0 && (
                    <ul className={styles.suggestions}>
                        {filteredFuncionarios.map(funcionario => (
                            <li
                                key={funcionario.id}
                                onClick={() => handleFuncionarioSelect(funcionario)}
                            >
                                {funcionario.nome} - {funcionario.edv}
                            </li>
                        ))}
                    </ul>
                )}
            </form>
            <button className={styles.salvar} onClick={handleSaveCarro}>
                Salvar
            </button>
            <ToastContainer />
        </div>
    );
}
