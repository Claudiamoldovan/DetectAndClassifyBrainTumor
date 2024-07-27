import React, { Component } from 'react';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import {useNavigate} from "react-router-dom";
import { withRouter } from './withRouter';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: null,

        };
    }


    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;

        const loginRequest = {
            username,
            password
        };

        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginRequest),
            });


            if (response.ok) {
                localStorage.setItem('username',username);
                const data=await response.json();
                const role=data.rol;
                const id=data.id;

                if(role === 'Admin'){
                    this.props.navigate('/admin');
                }
                else if(role === 'Doctor'){
                    this.props.navigate('/doctor');

                }
                if(role === 'Radiolog'){
                    this.props.navigate('/radiolog');

                }

            } else {
                this.setState({ error: `Eroare la autentificare: ${response.status} - ${response.statusText}` });
            }
        } catch (error) {
            console.error('Eroare la autentificare:', error);
            this.setState({ error: 'Eroare la autentificare' });
        }
    }

    render() {
        return (
            <div className="body-login">
                <div className="login-card">
                    <div className="user-image"></div>
                    <h2 className="login-header">Sign In</h2>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                value={this.state.username}
                                onChange={this.handleChange}
                                autoComplete="username"
                                placeholder="Username"
                                className="input-field"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                autoComplete="current-password"
                                placeholder="Password"
                                className="input-field"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button type="submit" className="signin-button">SIGN IN</Button>
                        </FormGroup>
                        {this.state.error && <p className="text-danger">{this.state.error}</p>}
                    </Form>
                </div>
            </div>

        );
    }
}

export default withRouter(Login);
