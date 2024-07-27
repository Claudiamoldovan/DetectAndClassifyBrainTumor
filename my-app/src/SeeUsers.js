import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Dropdown, Input, Table} from 'reactstrap';
import './App.css';
import './AdminPage.css'
import { Link } from 'react-router-dom';
import { Select } from 'reactstrap';
import HeaderAdmin from "./HeaderAdmin";
import { withRouter } from './withRouter';


class SeeUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {users: []
        };
        this.remove = this.remove.bind(this);
    }
    componentDidMount() {
        fetch('http://localhost:8080/users')
            .then(response => response.json())
            .then(data => this.setState({users: data}));
    }


    async remove(id) {
        const response = await fetch(`http://localhost:8080/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.reload();
        }
    }



    render() {
        const {users, isLoading,role,isChatOpen} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }



        const clientList = users.map(user => {
            return <tr key={user.id}>
                <td style={{whiteSpace: 'nowrap'}}>{user.nume}</td>
                <td>{user.prenume}</td>
                <td>{user.rol}</td>
                <td>{user.parafa}
                </td>
                <td>{user.username}</td>
                <td>{user.state}</td>

                <td>
                    <ButtonGroup>
                        <Button size="sm" className="action-button edit-button" onClick={ () =>{ this.props.navigate(`/users/${user.id}`);
                            window.location.reload();
                        }}>Edit</Button>
                        <Button size="sm" className="action-button delete-button" onClick={() => this.remove(user.id)}>Dezactivare</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div className='main-content-container'>
                <HeaderAdmin />
                <div className='see-admin-container'>
                    <h3 style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem',fontSize:'32px' }}>Users</h3>

                    <div className="ml-auto custom-button-container">
                        <Button color="success" className="action-button" onClick={() => {
                            this.props.navigate('/users/new');
                            window.location.reload();
                        }}>Adăugare utilizator</Button>

                    </div>

                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="15%">Nume</th>
                            <th width="15%">Prenume</th>
                            <th width="15%">Rol</th>
                            <th width="15%">Parafa</th>
                            <th width="15%">Username</th>
                            <th width="15%"> State</th>
                            <th width="40%">Actions</th>

                        </tr>
                        </thead>
                        <tbody>
                        {clientList}
                        </tbody>
                    </Table>

                </div>
            </div>
        );
    }
}
export default withRouter(SeeUsers);