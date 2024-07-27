import React, { Component } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import './App.css';
import './AdminPage.css';
import HeaderDoctor from "./HeaderDoctor";
import { withRouter } from './withRouter';
import HeaderRadiolog from "./HeaderRadiolog";
import './Radiolog.css';

class SeeAllRadiologii extends Component {
    constructor(props) {
        super(props);
        this.state = { radiologii: [], isLoading: true, filterCNP: '',
            selectedImage: null };
    }
    handleFilterChange = (e) => {
        this.setState({ filterCNP: e.target.value });
    }
    selectImage = (imagePath) => {
        this.setState({ selectedImage: imagePath });
    };

    closeImage = () => {
        this.setState({ selectedImage: null });
    };
    getFilteredRadiologii = () => {
        const { radiologii, filterCNP } = this.state;
        return radiologii.filter(radiologie =>
            radiologie.pacient.cnp.includes(filterCNP)
        );
    }
    componentDidMount() {
        fetch('http://localhost:8080/radiologies')
            .then(response => response.json())
            .then(data => {
                const updatedRadiologii = data.map(radiologie => {
                    return {
                        ...radiologie,
                        radiologieFinala: this.convertToLocalURL(radiologie.radiologieFinala)
                    };
                });
                this.setState({ radiologii: updatedRadiologii, isLoading: false });
            });
    }

    getValueOrDash(value) {
        return value == null ? '-' : value;
    }

    convertToLocalURL(path) {
        const imageName = path.split('\\').pop().split('/').pop();
        return `/images/${imageName}`;
    }


    render() {
        const { radiologii, isLoading, filterCNP,selectedImage  } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }
        const filteredRadiologii = this.getFilteredRadiologii();

        const radiologiiList = filteredRadiologii.map(radiologie => {
        const numePacient = radiologie.pacient ? this.getValueOrDash(radiologie.pacient.nume) : '-';
        const prenumePacient = radiologie.pacient ? this.getValueOrDash(radiologie.pacient.prenume) : '-';
        const cnpPacient = radiologie.pacient ? this.getValueOrDash(radiologie.pacient.cnp) : '-';
        const numeRadiolog = radiologie.radiolog ? this.getValueOrDash(radiologie.radiolog.nume) : '-';
        const prenumeRadiolog = radiologie.radiolog ? this.getValueOrDash(radiologie.radiolog.prenume) : '-';

        return(
            <tr key={radiologie.id}>
                <td>{numePacient}</td>
                <td>{prenumePacient}</td>
                <td>{cnpPacient}</td>
                <td>{numeRadiolog}</td>
                <td>{prenumeRadiolog}</td>
                <td>{this.getValueOrDash(radiologie.dataRealizare)}</td>
                            <img
                    src={(radiologie.status === "trimisa" || !radiologie.pacient.cnp) ? `${process.env.PUBLIC_URL}/pending.jpg` : `${process.env.PUBLIC_URL}/${radiologie.pacient.cnp}.jpg`}
                    alt="Radiologie"
                    style={{width: '100px', height: 'auto'}}
                    onClick={() => this.selectImage(`${process.env.PUBLIC_URL}/${radiologie.pacient.cnp}.jpg`)}
                />


                <td>{this.getValueOrDash(radiologie.rezultat)}</td>
                <td>{this.getValueOrDash(radiologie.status)}</td>
                <td>{this.getValueOrDash(radiologie.dimensiune) + ' mm'}</td>


            </tr>
        )
            })
        ;

        return (
            <div className='main-content-container-radiologii-radiolog '>
                <HeaderRadiolog/>
                <div className='see-radiologii-container-radiolog'>
                    <h3 style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        fontSize: '32px'
                    }}>Radiologii</h3>
                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Filtrare dupa CNP"
                            className='filter-input'
                            value={filterCNP}
                            onChange={this.handleFilterChange}
                        />
                    </div>

                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="15%">Nume Pacient</th>
                            <th width="15%">Prenume Pacient</th>
                            <th width="15%">CNP Pacient</th>
                            <th width="15%">Nume Radiolog</th>
                            <th width="5%">Prenume Radiolog</th>
                            <th width="5%"> Data realizare</th>
                            <th width="15%">Radiologie finala</th>
                            <th width="15%">Rezultat</th>
                            <th width="15%">Status</th>
                            <th width="15%">Dimensiune</th>

                        </tr>
                        </thead>
                        <tbody>
                        {radiologiiList}
                        </tbody>
                    </Table>
                    {selectedImage && (
                        <div style={{ position: 'fixed', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }} onClick={this.closeImage}>
                            <img src={selectedImage} alt="Mărit" style={{ maxWidth: '90%', maxHeight: '90%' }} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(SeeAllRadiologii);
