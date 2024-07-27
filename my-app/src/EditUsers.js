import React, { Component } from 'react';
import { Alert, Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { withRouter } from './withRouter';
import HeaderAdmin from "./HeaderAdmin";

class EditUsers extends Component {
    emptyItem = {
        nume: '',
        prenume: '',
        rol: '',
        parafa: '',
        username: '',
        state: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    async componentDidMount() {
        const {id} =this.props.params
        if (id !== 'new') {

            const user = await (await fetch(`http://localhost:8080/users/${this.props.params.id}`)).json();
            this.setState({ item: user });
        }
    }

    handleChange = async (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = { ...this.state.item };

        item[name] = value;
        this.setState({ item });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { item } = this.state;

        fetch(`http://localhost:8080/users/${item.id ? item.id : ''}`, {
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
                this.props.navigate('/admin');

                return response.json();
            })
            .then(() => {
            })
            .then(()=>{

            })
            .catch((error) => {
                console.error('Error:', error);
            });



    }


    render() {
        const { item, isEmailValid, isAvailable } = this.state;
        const title = <h2>{item.id ? 'Edit User' : 'Add User'}</h2>;

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
                            <Label for="parafa">Parafa</Label>
                            <Input type="text" name="parafa" id="parafa" value={item.parafa|| ''} onChange={this.handleChange} autoComplete="parafa" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rol" className="labelWithSpace">Rol</Label>
                            <select name="rol" value={item.rol || ''} onChange={this.handleChange} autoComplete="rol">
                                <option value="radiolog">Radiolog</option>
                                <option value="medic">Medic</option>
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="text" name="username" id="username" value={item.username || ''} onChange={this.handleChange} autoComplete="username" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="state">State</Label>
                            <Input type="text" name="state" id="state" value={item.state || ''} onChange={this.handleChange} autoComplete="state" />
                        </FormGroup>
                        <FormGroup>
                            <div className="ml-auto custom-add-button">
                                <Button color="primary" type="submit">Save</Button>{' '}
                                <Button color="secondary" onClick={() => { this.props.navigate('/admin');  window.location.reload();}}>Cancel</Button>
                            </div>
                        </FormGroup>
                    </Form>
                </div>            </div>
        );
    }
}

export default withRouter(EditUsers);