import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./style.module.scss";
import axios from 'axios';
import { api } from '../../services/api';

export default function Carros(props) {
    const [carros, setCarros] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [filteredFuncionarios, setFilteredFuncionarios] = useState([]);
    const [updateGet, setUpdateGet] = useState(true)
    const [updatePut, setUpdatePut] = useState(false)
    const [formValues, setFormValues] = useState({
        cor: "",
        placa: "",
        modelo: "",
        ano: "",
        edv: ""
    });

    useEffect(() => {
        fetchCarros();
        fetchFuncionarios();
        if(props.id && updateGet){
            getCar();
            setUpdatePut(true);
            setUpdateGet(false);
        }
    }, []);

    async function getCar(){
        try {
            const response = await api.get(`/api/carro/${props.id}`);
            const response2 = await api.get(`/api/funcionario/id/${response.data.FuncionarioID}`)
            console.log(response, "ZZZZZZZZZZZZZZZZZZZ")
            setFormValues({
                cor: response.data.Cor,
                placa: response.data.Placa,
                modelo: response.data.Modelo,
                ano: response.data.Ano,
                edv: response2.data.EDV
            })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCarros = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/carro');
            if (response.ok) {
                const data = await response.json();
                setCarros(data.data);
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
                setFuncionarios(data.data);
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
            if (!formValues.edv) {
                toast.error('Digite o EDV do funcionário antes de salvar o carro.');
                return;
            }

            const { cor, placa, modelo, ano, edv } = formValues;
            if (!cor || !placa || !modelo || !ano || !edv) {
                toast.error('Todos os campos são obrigatórios.');
                return;
            }

            let newCar = {
                cor: formValues.cor,
                placa: formValues.placa,
                modelo: formValues.modelo,
                ano: formValues.ano,
                edv: formValues.edv,
            }

            var response
            if(!updatePut)
                response = await api.post('/api/carro', newCar)
            else
                response = await api.put(`/api/carro/${props.id}`, newCar)

            console.log(response, "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")

            if (response.status === 200 || response.status === 201) {
                if(response.status === 200)
                    toast.success('Carro atualizado com sucesso!');
                if(response.status === 201)
                    toast.success('Carro cadastrado com sucesso!');
                fetchCarros(); 
                setFormValues({
                    cor: "",
                    placa: "",
                    modelo: "",
                    ano: "",
                    edv: "",
                });
            } else {
                console.log(response, "VVVVVVVVVVVVVVVVVVVVVVVV")
                toast.error(`Erro ao cadastrar carro: ${response.data || 'Erro desconhecido'}`);
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
