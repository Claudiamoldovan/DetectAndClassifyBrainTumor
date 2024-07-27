import React, { Component } from 'react';
import {Button, ButtonGroup, Container, Dropdown, Input, Table} from 'reactstrap';
import './App.css';
import './AdminPage.css'
import './Doctor.css';
import { Link } from 'react-router-dom';
import { Select } from 'reactstrap';
import HeaderAdmin from "./HeaderAdmin";
import { withRouter } from './withRouter';
import { format } from 'date-fns';
import HeaderDoctor from "./HeaderDoctor";



class SeeUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {pacienti: [],filterCNP: ''
        };
        this.remove = this.remove.bind(this);
    }
    componentDidMount() {
        fetch('http://localhost:8080/pacients')
            .then(response => response.json())
            .then(data => this.setState({pacienti: data}));
    }


    async remove(id) {
        const response = await fetch(`http://localhost:8080/pacients/${id}`, {
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


    handleFilterChange = (e) => {
        this.setState({ filterCNP: e.target.value });
    }

    getFilteredPacienti = () => {
        const { pacienti, filterCNP } = this.state;
        return pacienti.filter(pacient =>
            pacient.cnp.includes(filterCNP)
        );
    }


    render() {
        const {pacienti, isLoading,role,isChatOpen,filterCNP} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const filteredPacienti = this.getFilteredPacienti();


        const clientList = filteredPacienti.map(user => {
            console.log(user.dataNasterii);
            return <tr key={user.id}>
                <td style={{whiteSpace: 'nowrap'}}>{user.nume}</td>
                <td>{user.prenume}</td>
                <td>{user.cnp}</td>
                <td>{user.email}</td>
                <td>{user.sex}</td>
                <td>{user.varsta}</td>
                <td>{user.dataNasterii}</td>
                <td>{user.doctor.nume}</td>
                <td>{user.doctor.prenume}</td>

                <td>
                    <ButtonGroup>
                        <Button size="sm" className="action-button edit-button" onClick={() => {
                            this.props.navigate(`/pacienti/${user.id}`);
                            window.location.reload();
                        }}>Edit</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div className='main-content-container-pacienti'>
                <HeaderDoctor />
                <div className='see-pacienti-container'>
                    <h3 style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        fontSize: '32px'
                    }}>Pacienti</h3>
                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Filtrare dupa CNP"
                            className='filter-input'
                            value={filterCNP}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className="ml-auto custom-button-container">
                        <Button color="success" className="action-button" onClick={() => {
                            this.props.navigate('/pacienti/new');
                            window.location.reload();
                        }}>Adaugare Pacient</Button>

                    </div>

                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="15%">Nume</th>
                            <th width="15%">Prenume</th>
                            <th width="15%">CNP</th>
                            <th width="10%">Email</th>
                            <th width="1%">Sex</th>
                            <th width="1%"> Varsta</th>
                            <th width="15%"> Data nasterii</th>
                            <th width="15%">Nume Doctor</th>
                            <th width="15%">Prenume Doctor</th>


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