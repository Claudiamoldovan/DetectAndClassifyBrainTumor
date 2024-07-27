package com.example.licenta.model;


import java.io.Serializable;
import java.time.LocalDate;
import com.example.licenta.model.User;

import javax.persistence.*;

@Entity
public class Pacient implements Serializable {

    private static final long serialVersionUID=1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name="nume")
    private String nume;

    @JoinColumn(name="prenume")
    private String prenume;

    @Column(name="cnp", unique = true) private String cnp;

    @JoinColumn(name="data_nastere")
    private LocalDate dataNasterii;

    @JoinColumn(name="email")
    private String email;

    @JoinColumn(name="varsta")
    private Integer varsta;

    @JoinColumn(name="sex")
    private String sex;
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor;

    public Pacient(String nume, String prenume, String cnp, LocalDate dataNasterii, String email, Integer varsta, String sex, User doctor) {
        this.nume = nume;
        this.prenume = prenume;
        this.cnp = cnp;
        this.dataNasterii = dataNasterii;
        this.email = email;
        this.varsta = varsta;
        this.sex = sex;
        this.doctor = doctor;
    }

    public User getDoctor() {
        return doctor;
    }

    public void setDoctor(User doctor) {
        this.doctor = doctor;
    }

    public Pacient() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getPrenume() {
        return prenume;
    }

    public void setPrenume(String prenume) {
        this.prenume = prenume;
    }

    public String getCnp() {
        return cnp;
    }

    public void setCnp(String cnp) {
        this.cnp = cnp;
    }

    public LocalDate getDataNasterii() {
        return dataNasterii;
    }

    public void setDataNasterii(LocalDate dataNasterii) {
        this.dataNasterii = dataNasterii;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getVarsta() {
        return varsta;
    }

    public void setVarsta(Integer varsta) {
        this.varsta = varsta;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
