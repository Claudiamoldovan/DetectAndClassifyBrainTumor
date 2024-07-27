import React, { Component } from 'react';
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader} from 'reactstrap';
import HeaderAdmin from "./HeaderAdmin";
import { withRouter } from './withRouter';
import './ModalStyle.css';

class EditRadiolog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radiologie: {
                pacient: null,
                radiolog: null,
                doctor: null,
                radiologieInitiala: null,
                rezultat: '',
                status: ''
            },
            pacients: [],
            radiologists: [],
            isLoading: true,
            showModal: false,
        };
    }

    async componentDidMount() {
        try {
            const [pacientsRes, usersRes] = await Promise.all([
                fetch('http://localhost:8080/pacients'),
                fetch('http://localhost:8080/users')
            ]);
            const [pacients, users] = await Promise.all([pacientsRes.json(), usersRes.json()]);

            const radiologists = users.filter(user => user.rol === 'Radiolog');

            const doctorUsername = localStorage.getItem('username');
            const doctor = users.find(user => user.username === doctorUsername);

            this.setState({
                pacients,
                radiologists,
                radiologie: { ...this.state.radiologie, doctor },
                isLoading: false
            });

            const { id } = this.props.params;
            if (id && id !== 'new') {
                const response = await fetch(`http://localhost:8080/radiologies/${id}`);
                const radiologie = await response.json();
                this.setState({ radiologie: { ...radiologie, doctor } });
            }
        } catch (error) {
            console.error('A apărut o eroare:', error);
            this.setState({ isLoading: false });
        }
    }

    handleChange = (event) => {
        const { name, value, files } = event.target;
        let item = { ...this.state.radiologie };

        if (name === 'pacient' || name === 'radiolog') {
            const collection = name === 'pacient' ? this.state.pacients : this.state.radiologists;
            const selectedObj = collection.find(obj => obj.id.toString() === value);
            item[name] = selectedObj;
        } else if (name === 'radiologieInitiala') {
            item[name] = files[0];
        } else {
            item[name] = value;
        }

        this.setState({ radiologie: item });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ showModal: true });

        const { radiologie } = this.state;
        const username = localStorage.getItem('username');
        const formData = new FormData();
        formData.append('radiologieInitiala', radiologie.radiologieInitiala);

        const url = `http://localhost:8080/radiologies/addRadiologie/${radiologie.id}?username=${encodeURIComponent(username)}&inputPath=${encodeURIComponent(radiologie.radiologieInitiala.name)}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error during the classification and detection process:', error);
        } finally {
            this.setState({ showModal: false });
            this.props.navigate('/radiolog');
        }
    };




    render() {
        const { radiologie, pacients, radiologists, isLoading } = this.state;
        const isNew = radiologie.id === 'new';

        if (isLoading) {
            return <p>Încărcare...</p>;
        }

        return (
            <div>
                <HeaderAdmin />
                <div className="form-container">
                    <h2>{radiologie.id === 'new' ? 'Adăugare Radiologie' : 'Editare Radiologie'}</h2>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="radiologieInitiala">Radiologie Inițială</Label>
                            <Input type="file" name="radiologieInitiala" id="radiologieInitiala" onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit">Salvează</Button>
                            <Button color="secondary" onClick={() => this.props.navigate('/radiolog')}>Anulează</Button>
                        </FormGroup>
                    </Form>
                </div>
                <Modal isOpen={this.state.showModal} toggle={() => this.setState({ showModal: false })} className="modal-custom">
                    <ModalHeader toggle={() => this.setState({ showModal: false })} className="modal-custom-header">
                        Procesare în Curs
                    </ModalHeader>
                    <ModalBody className="modal-custom-body">
                        Detectie și Clasificare în progres...
                    </ModalBody>
                </Modal>


            </div>
        );
    }

}

export default withRouter(EditRadiolog);
