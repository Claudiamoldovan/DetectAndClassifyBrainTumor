package com.example.licenta.model;

import javax.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nume;
    private String prenume;
    private String rol;
    private String parafa;
    private String username;
    private String password;

    private String state;

    public User(String nume, String prenume, String rol, String parafa, String username, String password) {
        this.nume = nume;
        this.prenume = prenume;
        this.rol = rol;
        this.parafa = parafa;
        this.username = username;
        this.password = password;
    }

    public User() {

    }

    public String getState(){return state;}

    public void setState(String state){this.state=state;}

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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getParafa() {
        return parafa;
    }

    public void setParafa(String parafa) {
        this.parafa = parafa;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
