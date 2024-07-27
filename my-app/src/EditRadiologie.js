import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import HeaderAdmin from "./HeaderAdmin";
import { withRouter } from './withRouter';

class EditRadiologie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radiologie: {
                pacient: null,
                radiolog: null,
                doctor: null,
                rezultat: '',
                status: ''
            },
            pacients: [],
            radiologists: [],
            isLoading: true
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
        const { name, value } = event.target;
        let item = { ...this.state.radiologie };

        if (name === 'pacient' || name === 'radiolog') {
            const collection = name === 'pacient' ? this.state.pacients : this.state.radiologists;
            const selectedObj = collection.find(obj => obj.id.toString() === value);
            item[name] = selectedObj;
        } else {
            item[name] = value;
        }

        this.setState({ radiologie: item });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { radiologie } = this.state;
        const payload = {
            ...radiologie,
            pacient: radiologie.pacient,
            radiolog: radiologie.radiolog,
            doctor: radiologie.doctor,
            rezultat: radiologie.rezultat,
            status: radiologie.status
        };

        try {
            await fetch(`http://localhost:8080/radiologies/${radiologie.id ? radiologie.id : ''}`, {
                method: radiologie.id ? 'PUT' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            this.props.navigate('/radiologii');
        } catch (error) {
            console.error('Eroare la salvare:', error);
        }
    }


    render() {
        const { radiologie, pacients, radiologists, isLoading } = this.state;
        const isNew = this.props.params.id === 'new';

        if (isLoading) {
            return <p>Încărcare...</p>;
        }

        return (
            <div>
                <HeaderAdmin />
                <div className="form-container">
                    <h2>{isNew ? 'Adăugare Radiologie' : 'Editare Radiologie'}</h2>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="pacient">Pacient</Label>
                            <Input type="select" name="pacient" id="pacient" value={radiologie.pacient?.id || ''} onChange={this.handleChange}>
                                <option>Selecționează un pacient</option>
                                {pacients.map(pacient => (
                                    <option key={pacient.id} value={pacient.id}>{pacient.nume} {pacient.prenume}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        {!isNew && (
                            <>
                                <FormGroup>
                                    <Label for="rezultat">Rezultat</Label>
                                    <Input type="text" name="rezultat" id="rezultat" value={radiologie.rezultat || ''} onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="status">Status</Label>
                                    <Input type="text" name="status" id="status" value={radiologie.status || ''} onChange={this.handleChange} />
                                </FormGroup>
                            </>
                        )}
                        <FormGroup>
                            <Button color="primary" type="submit">Salvează</Button>{' '}
                            <Button color="secondary" onClick={() => this.props.navigate('/radiologii')}>Anulează</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }

}

export default withRouter(EditRadiologie);
