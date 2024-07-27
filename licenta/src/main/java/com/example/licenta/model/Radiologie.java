package com.example.licenta.model;

import java.time.LocalDate;

import com.example.licenta.model.Pacient;
import com.example.licenta.model.User;
import javax.persistence.*;

@Entity
public class Radiologie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pacient_id")
    private Pacient pacient;

    @ManyToOne
    @JoinColumn(name = "radiolog_id")
    private User radiolog;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor;

    private LocalDate dataRealizare;
    private String radiologieInitiala;
    private String radiologieFinala;
    private String rezultat;
    private String parafaMedic;
    private String status;

    private float dimensiune;

    public Radiologie(Pacient pacient, User radiolog, User doctor, LocalDate dataRealizare, String radiologieInitiala, String radiologieFinala, String rezultat, String parafaMedic, String status,float dimensiune) {
        this.pacient = pacient;
        this.radiolog = radiolog;
        this.doctor = doctor;
        this.dataRealizare = dataRealizare;
        this.radiologieInitiala = radiologieInitiala;
        this.radiologieFinala = radiologieFinala;
        this.rezultat = rezultat;
        this.parafaMedic = parafaMedic;
        this.status = status;
        this.dimensiune=dimensiune;
    }

    public Radiologie() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pacient getPacient() {
        return pacient;
    }

    public void setPacient(Pacient pacient) {
        this.pacient = pacient;
    }

    public User getRadiolog() {
        return radiolog;
    }

    public void setRadiolog(User radiolog) {
        this.radiolog = radiolog;
    }

    public User getDoctor() {
        return doctor;
    }

    public float getDimensiune() {
        return dimensiune;
    }

    public void setDimensiune(float dimensiune) {
        this.dimensiune = dimensiune;
    }

    public void setDoctor(User doctor) {
        this.doctor = doctor;
    }

    public LocalDate getDataRealizare() {
        return dataRealizare;
    }

    public void setDataRealizare(LocalDate dataRealizare) {
        this.dataRealizare = dataRealizare;
    }

    public String getRadiologieInitiala() {
        return radiologieInitiala;
    }

    public void setRadiologieInitiala(String radiologieInitiala) {
        this.radiologieInitiala = radiologieInitiala;
    }

    public String getRadiologieFinala() {
        return radiologieFinala;
    }

    public void setRadiologieFinala(String radiologieFinala) {
        this.radiologieFinala = radiologieFinala;
    }

    public String getRezultat() {
        return rezultat;
    }

    public void setRezultat(String rezultat) {
        this.rezultat = rezultat;
    }

    public String getParafaMedic() {
        return parafaMedic;
    }

    public void setParafaMedic(String parafaMedic) {
        this.parafaMedic = parafaMedic;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
