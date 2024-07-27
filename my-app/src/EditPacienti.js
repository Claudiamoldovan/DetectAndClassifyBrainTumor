import React, { Component } from 'react';
import { Alert, Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { withRouter } from './withRouter';
import HeaderAdmin from "./HeaderAdmin";

class EditUsers extends Component {
    state={
        item: {
            nume: '',
            prenume: '',
            email: '',
            varsta: '',
            doctor:'',
            dataNasterii:'',
            cnp:'',
            sex:''
        },
    doctors :[],

    };

    constructor(props) {
        super(props);
        this.state = {
            item: {
                nume: '',
                prenume: '',
                email: '',
                varsta: '',
                doctor: '',
                dataNasterii:'',
                cnp:'',
                sex:''
            },
            doctors: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    async componentDidMount() {
        const {id} =this.props.params
        if (id !== 'new') {

            const user = await (await fetch(`http://localhost:8080/pacients/${this.props.params.id}`)).json();
            this.setState({ item: user });
        }
        const response = await fetch('http://localhost:8080/users');
        const data = await response.json();
        const doctors = data.filter(user => user.rol === 'Doctor');
        this.setState({ doctors });
    }

    handleChange(event) {
        const { name, value } = event.target;
        let item = { ...this.state.item };

        if (name === "doctor") {
            const doctorSelected = this.state.doctors.find(doctor => doctor.id.toString() === value);
            if (doctorSelected) {
                item[name] = doctorSelected;
            }
        } else {
            item[name] = value;
        }

        this.setState({ item });
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const { item } = this.state;
        let emptyFields = Object.entries(item).filter(([key, value]) => {
            if (typeof value === 'string') {
                return value.trim() === '';
            }
            return false;
        });

        if (emptyFields.length > 0) {
            alert('Toate câmpurile trebuie completate!');
            return;
        }


        if (isNaN(item.varsta)) {
            alert('Varsta trebuie sa fie un număr!');
            return;
        }

        if (item.cnp.length !== 13 || isNaN(item.cnp)) {
            alert('CNP-ul trebuie să conțină exact 13 cifre numerice!');
            return;
        }

        const emailPattern = /\S+@\S+\.\S+/;
        if (!emailPattern.test(item.email)) {
            alert('Adresa de email nu este validă!');
            return;
        }


        if (item.dataNasterii && item.dataNasterii.includes('.')) {
            const parts = item.dataNasterii.split('.');
            if (parts.length === 3) {
                item.dataNasterii = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        fetch(`http://localhost:8080/pacients/${item.id ? item.id : ''}`, {
            method: item.id ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                this.props.navigate('/doctor');
                return response.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }



    render() {
        const { item, isEmailValid, isAvailable } = this.state;
        const { id } = this.props.params;
        const isNew = id === 'new';
        const title = <h2>{item.id ? 'Editare Pacient' : 'Adaugare Pacient'}</h2>;

        return (
            <div>
                <HeaderAdmin/>
                <div className="form-container">
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="nume">Nume</Label>
                            <Input type="text" name="nume" id="nume" value={item.nume || ''} onChange={this.handleChange} autoComplete="nume" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="prenume">Prenume</Label>
                            <Input type="text" name="prenume" id="prenume" value={item.prenume || ''} onChange={this.handleChange} autoComplete="prenume" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="text" name="email" id="email" value={item.email|| ''} onChange={this.handleChange} autoComplete="email" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="varsta">Varsta</Label>
                            <Input type="text" name="varsta" id="varsta" value={item.varsta || ''} onChange={this.handleChange} autoComplete="varsta" />
                        </FormGroup>
                        {isNew && (
                            <>
                                <FormGroup>
                                    <Label for="dataNasterii">Data Nașterii</Label>
                                    <Input type="date" name="dataNasterii" id="dataNasterii" value={item.dataNasterii || ''} onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="cnp">CNP</Label>
                                    <Input type="text" name="cnp" id="cnp" value={item.cnp || ''} onChange={this.handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="sex">Sex</Label>
                                    <Input type="select" name="sex" id="sex" value={item.sex || ''} onChange={this.handleChange}>
                                        <option value="">Selectează</option>
                                        <option value="Masculin">Masculin</option>
                                        <option value="Feminin">Feminin</option>
                                    </Input>
                                </FormGroup>
                            </>
                        )}
                        <FormGroup>
                            <Label for="doctor">Medic</Label>
                            <Input type="select" name="doctor" id="doctor" value={this.state.item.doctor} onChange={this.handleChange}>
                                {this.state.doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.nume} {doctor.prenume}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <div className="ml-auto custom-add-button">
                                <Button color="primary" type="submit">Save</Button>{' '}
                                <Button color="secondary" onClick={() => { this.props.navigate('/doctor');  window.location.reload();}}>Cancel</Button>
                            </div>
                        </FormGroup>
                    </Form>
                </div>            </div>
        );
    }
}

export default withRouter(EditUsers);