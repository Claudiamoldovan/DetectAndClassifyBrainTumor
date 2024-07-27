package com.example.licenta.controllers;

import com.example.licenta.exceptions.ResourcesNotFoundException;
import com.example.licenta.model.Pacient;
import com.example.licenta.model.User;
import com.example.licenta.services.PacientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/pacients")
public class PacientController {

    @Autowired
    private PacientService pacientService;

    @GetMapping
    public List<Pacient> getAllPacients() {
        return pacientService.findPersons();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long createPacient(@RequestBody Pacient pacient) {
        return pacientService.insertPacient(pacient);
    }

    @PutMapping("/{id}")
    public ResponseEntity updatePacient(@PathVariable Long id, @RequestBody Pacient pacientDetails) {
        System.out.println(pacientDetails.getDataNasterii());
        pacientService.updatePacient(id, pacientDetails);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    public void deletePacient(@PathVariable Long id) {
        pacientService.deletePacientById(id);
    }

    @GetMapping("/byDoctor/{doctorId}")
    public List<Pacient> getPacientsByDoctorId(@PathVariable Long doctorId) {
        return pacientService.findPacientsByDoctorId(doctorId);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Pacient> getPerson(@PathVariable Long id) {
        Pacient pacient = pacientService.findPersonById(id);
        return new ResponseEntity<>(pacient, HttpStatus.OK);
    }
}
