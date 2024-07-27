package com.example.licenta.services;

import com.example.licenta.exceptions.ResourcesNotFoundException;
import com.example.licenta.model.Pacient;
import com.example.licenta.model.User;
import com.example.licenta.repositories.PacientRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.FileWriter;
import java.io.IOException;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PacientService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PacientService.class);
    private final PacientRepo PacientRepository;

    @Autowired
    public PacientService(PacientRepo PacientRepository) {
        this.PacientRepository = PacientRepository;
    }

    public List<Pacient> findPersons() {
        List<Pacient> personList = PacientRepository.findAll();
        return personList;
    }

    public Long insertPacient(Pacient Pacient) {
        Pacient = PacientRepository.save(Pacient);
        return Pacient.getId();
    }


    public void updatePacient(Long id, Pacient pacientDetails) {
        Optional<Pacient> pacientOptional = PacientRepository.findById(id);
        if (!pacientOptional.isPresent()) {
            System.out.println("pacient negasit");
        }

        Pacient pacientToUpdate = pacientOptional.get();
        pacientToUpdate.setNume(pacientDetails.getNume());
        pacientToUpdate.setPrenume(pacientDetails.getPrenume());
        pacientToUpdate.setEmail(pacientDetails.getEmail());
        pacientToUpdate.setVarsta(pacientDetails.getVarsta());
        pacientToUpdate.setDoctor(pacientDetails.getDoctor());

        PacientRepository.save(pacientToUpdate);
    }

    public Pacient findPersonById(Long id) {
        Optional<Pacient> prosumerOptional =PacientRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            System.out.println("pacient negasit");

        }
        return prosumerOptional.get();
    }


    public void deletePacientById(Long id) {
        Pacient pacient = PacientRepository.findById(id)
                .orElseThrow(() -> new ResourcesNotFoundException("Pacient with id: " + id));
        PacientRepository.delete(pacient);
    }

    public List<Pacient> findPacientsByDoctorId(Long doctorId) {
        List<Pacient> allPacients = PacientRepository.findAll();
        return allPacients.stream()
                .filter(pacient -> pacient.getDoctor() != null && pacient.getDoctor().getId().equals(doctorId))
                .collect(Collectors.toList());
    }


}
