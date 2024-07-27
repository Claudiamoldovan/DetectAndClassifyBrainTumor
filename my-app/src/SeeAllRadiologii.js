import React, { Component } from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import './App.css';
import './AdminPage.css';
import HeaderDoctor from "./HeaderDoctor";
import { withRouter } from './withRouter';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import './Doctor.css';


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

    handleStatusChange = (e) => {
        this.setState({ selectedStatus: e.target.value });
    }
    getFilteredRadiologii = () => {
        const { radiologii, filterCNP, selectedStatus } = this.state;
        return radiologii.filter(radiologie =>
            radiologie.pacient.cnp.includes(filterCNP) &&
            (!selectedStatus || radiologie.status === selectedStatus)
        );
    }

    generatePdf = (radiologieId) => {
        const selectedRadiologie = this.state.radiologii.find(r => r.id === radiologieId);

        if (!selectedRadiologie) {
            console.error('Radiologie selectată nu există.');
            return;
        }

        const { pacient, radiolog, doctor, rezultat, radiologieFinala, dimensiune } = selectedRadiologie;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        pdf.setFont("helvetica");

        pdf.setFontSize(10);
        pdf.text('Clinica Imaginarium', 105, 10, { align: 'center' });

        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Raport Radiologie', 105, 30, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Nume Pacient: ${pacient.nume} ${pacient.prenume}`, 20, 50);
        pdf.text(`Sex: ${pacient.sex}`, 20, 60);
        pdf.text(`Vârsta: ${pacient.varsta}`, 20, 70);
        pdf.text(`CNP: ${pacient.cnp}`, 20, 80);

        pdf.text(`Nume Radiolog: ${radiolog.nume} ${radiolog.prenume}`, 20, 90);
        pdf.text(`Nume Medic: ${doctor.nume} ${doctor.prenume}`, 20, 100);

        pdf.autoTable({
            startY: 110,
            head: [['Rezultat']],
            body: [[rezultat + " - " + dimensiune + " mm"]],
            theme: 'grid',
            styles: { fillColor: [220, 220, 220] },
            headStyles: { fillColor: [100, 100, 100], textColor: [255, 255, 255], fontStyle: 'bold' }
        });
        pdf.text('Radiologie:', 20, 140);
        const imagePath = `${process.env.PUBLIC_URL}/${pacient.cnp}.jpg`;
        pdf.addImage(imagePath, 'JPG', 20, 150, 70, 70);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setDrawColor(0);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(pageWidth - 80, pageHeight - 40, 70, 20);
        pdf.setFontSize(10);
        pdf.text(`Dr. ${doctor.nume} ${doctor.prenume}`, pageWidth - 75, pageHeight - 30, { align: 'left' });
        pdf.text(doctor.parafa, pageWidth - 60, pageHeight - 25, { align: 'left' });
        pdf.setFontSize(10);
        pdf.text('Clinica Imaginarium - Strada Fictiva Nr. 123, 0123456789, contact@imaginarium.ro', 105, pageHeight - 10, { align: 'center' });

        pdf.save('raport-radiologie.pdf');

        return new Promise((resolve, reject) => {
            pdf.output('blob', {
                success: resolve,
                error: reject
            });
        });
    }

    generatePdfBlob = (radiologieId) => {
        return new Promise((resolve, reject) => {
            const selectedRadiologie = this.state.radiologii.find(r => r.id === radiologieId);

            if (!selectedRadiologie) {
                console.error('Radiologie selectată nu există.');
                reject(new Error('Radiologie selectată nu există.'));
                return;
            }

            const {pacient, radiolog, doctor, rezultat,dimensiune} = selectedRadiologie;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            pdf.setFont("helvetica");

            pdf.setFontSize(10);
            pdf.text('Clinica Imaginarium', 105, 10, { align: 'center' });

            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Raport Radiologie', 105, 30, {align: 'center'});

            pdf.setFontSize(12);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Nume Pacient: ${pacient.nume} ${pacient.prenume}`, 20, 50);
            pdf.text(`Sex: ${pacient.sex}`, 20, 60);
            pdf.text(`Vârsta: ${pacient.varsta}`, 20, 70);
            pdf.text(`CNP: ${pacient.cnp}`, 20, 80);

            pdf.text(`Nume Radiolog: ${radiolog.nume} ${radiolog.prenume}`, 20, 90);
            pdf.text(`Nume Medic: ${doctor.nume} ${doctor.prenume}`, 20, 100);

            pdf.autoTable({
                startY: 110,
                head: [['Rezultat']],
                body: [[rezultat + " - " +dimensiune+ " mm"]],
                theme: 'grid',
                styles: {fillColor: [220, 220, 220]},
                headStyles: {fillColor: [100, 100, 100], textColor: [255, 255, 255], fontStyle: 'bold'}
            });

            pdf.text('Radiologie:', 20, 140);
            const imagePath = `${process.env.PUBLIC_URL}/${pacient.cnp}.jpg`;
            pdf.addImage(imagePath, 'JPG', 20, 150, 70, 70);

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            pdf.setDrawColor(0);
            pdf.setFillColor(255, 255, 255);
            pdf.rect(pageWidth - 80, pageHeight - 40, 70, 20);
            pdf.setFontSize(10);
            pdf.text(`Dr. ${doctor.nume} ${doctor.prenume}`, pageWidth - 75, pageHeight - 30, { align: 'left' });
            pdf.text(doctor.parafa, pageWidth - 60, pageHeight - 25, { align: 'left' });
            pdf.setFontSize(10);
            pdf.text('Clinica Imaginarium - Strada Fictiva Nr. 123, 0123456789, contact@imaginarium.ro', 105, pageHeight - 10, { align: 'center' });

            const pdfBlob = pdf.output('blob');
            resolve(pdfBlob);
        });
    }

    sendPdfByEmail = (radiologieId) => {
        console.log("trimit mail la ");

        this.generatePdfBlob(radiologieId).then(pdfBlob => {
            const formData = new FormData();
            formData.append('pdf', pdfBlob);
            formData.append('email', this.state.radiologii.find(r => r.id === radiologieId).pacient.email);
            fetch('http://localhost:8080/radiologies/send-pdf', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (response.ok) {
                        alert('Email-ul a fost trimis cu succes!');
                    } else {
                        alert('A apărut o eroare la trimiterea email-ului.');
                    }
                })
                .catch(error => {
                    console.error('Eroare la trimiterea email-ului:', error);
                });
        });
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

    addParafa = (radiologieId) => {
        console.log(`Adding parafa for radiologieId: ${radiologieId}`);

        const username = localStorage.getItem('username');

        fetch('http://localhost:8080/radiologies/addParafa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                radiologieId: radiologieId
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Parafa adăugată cu succes!');
                    this.reloadRadiologiiList();
                } else {
                    console.error('Eroare la adăugarea parafăi!');
                }
            })
            .catch(error => {
                console.error('Eroare la adăugarea parafăi:', error);
            });
    };

    reloadRadiologiiList = () => {
        this.setState({ isLoading: true });

        fetch('http://localhost:8080/radiologies')
            .then(response => response.json())
            .then(data => {
                const updatedRadiologii = data.map(radiologie => ({
                    ...radiologie,
                    radiologieFinala: this.convertToLocalURL(radiologie.radiologieFinala)
                }));

                this.setState({ radiologii: updatedRadiologii, isLoading: false });
            })
            .catch(error => {
                console.error("Eroare la reîncărcarea listei de radiologii:", error);
                this.setState({ isLoading: false });
            });
    };
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
                <td className="image-cell">
                    <img
                        src={(radiologie.status === "trimisa" || !radiologie.pacient.cnp) ? `${process.env.PUBLIC_URL}/pending.jpg` : `${process.env.PUBLIC_URL}/${radiologie.pacient.cnp}.jpg`}
                        alt="Radiologie"
                        style={{width: '150px', height: 'auto'}}
                        onClick={() => this.selectImage(`${process.env.PUBLIC_URL}/${radiologie.pacient.cnp}.jpg`)}
                    />
                </td>


                <td>{this.getValueOrDash(radiologie.rezultat)}</td>
                <td>{this.getValueOrDash(radiologie.status)}</td>
                <td>{this.getValueOrDash(radiologie.dimensiune) + ' mm'}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" className="action-button edit-button" onClick={() => {
                            this.props.navigate(`/radiologie/${radiologie.id}`);
                            window.location.reload();
                        }}>Edit</Button>
                        {radiologie.status === 'finalizata' && (
                            <Button size="sm" className="action-button pdf-button"
                                    onClick={() => this.generatePdf(radiologie.id)}>
                                PDF
                            </Button>
                        )}
                        {radiologie.status === 'finalizata' && (
                            <Button size="sm" className="action-button send-email-button"
                                    onClick={() => this.sendPdfByEmail(radiologie.id)}>
                                Send Email
                            </Button>
                        )}
                        {radiologie.status === 'asteptare' && (
                            <Button size="sm" className="action-button edit-parafa"
                                    onClick={() => this.addParafa(radiologie.id)}>
                                Adaugă Parafa
                            </Button>

                        )}
                    </ButtonGroup>

                </td>
            </tr>
        )
            })
        ;

        return (
            <div className='main-content-container-radiologii-doctor'>
                <HeaderDoctor/>
                <div className='see-radiologii-container-doctor'>
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
                    <div className="ml-auto custom-button-container">
                        <Button color="success" className="action-button" onClick={() => {
                            this.props.navigate('/radiologie/new');
                            window.location.reload();
                        }}>Cerere Radiologie</Button>
                    </div>
                    <div className="status-filter">
                        <div>
                            <input
                                type="radio"
                                name="statusFilter"
                                value="finalizata"
                                checked={this.state.selectedStatus === 'finalizata'}
                                onChange={this.handleStatusChange}
                            /> Finalizată
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="statusFilter"
                                value="asteptare"
                                checked={this.state.selectedStatus === 'asteptare'}
                                onChange={this.handleStatusChange}
                            /> În așteptare
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="statusFilter"
                                value="trimisa"
                                checked={this.state.selectedStatus === 'trimisa'}
                                onChange={this.handleStatusChange}
                            /> Trimisă
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="statusFilter"
                                value=""
                                checked={this.state.selectedStatus === ''}
                                onChange={this.handleStatusChange}
                            /> Toate
                        </div>
                    </div>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="10%">Nume Pacient</th>
                            <th width="10%">Prenume Pacient</th>
                            <th width="10%">CNP Pacient</th>
                            <th width="10%">Nume Radiolog</th>
                            <th width="5%">Prenume Radiolog</th>
                            <th width="15%">Radiologie finala</th>
                            <th width="10%">Rezultat</th>
                            <th width="10%">Status</th>
                            <th width="5%">Dimensiune</th>
                            <th width="40%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {radiologiiList}
                        </tbody>
                    </Table>
                    {selectedImage && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1050
                        }} onClick={this.closeImage}>
                            <img src={selectedImage} alt="Mărit" style={{maxWidth: '90%', maxHeight: '90%'}}/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(SeeAllRadiologii);
