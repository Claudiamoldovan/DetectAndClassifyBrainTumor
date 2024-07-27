package com.example.licenta.services;

import com.example.licenta.DetectTumorMain;
import com.example.licenta.TumorClassifier;
import com.example.licenta.exceptions.ResourcesNotFoundException;
import com.example.licenta.mail.EmailSender;
import com.example.licenta.model.Pacient;
import com.example.licenta.model.Radiologie;
import com.example.licenta.model.User;
import com.example.licenta.repositories.RadiologieRepo;
import com.example.licenta.repositories.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.FileWriter;
import java.io.IOException;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RadiologieService {
    private static final Logger LOGGER = LoggerFactory.getLogger(RadiologieService.class);
    private final RadiologieRepo RadiologieRepository;
    private final UserRepo userRepo;

    @Autowired
    public RadiologieService(RadiologieRepo RadiologieRepository, UserRepo userRepo) {
        this.RadiologieRepository = RadiologieRepository;
        this.userRepo = userRepo;
    }

    public List<Radiologie> findRadiologii() {
        List<Radiologie> radiologiesList = RadiologieRepository.findAll();
        return radiologiesList;
    }

    public Long insertRadiologie(Radiologie radiologie) {
        radiologie.setStatus("trimisa");
        if(radiologie.getRadiologieFinala()==null)
            radiologie.setRadiologieFinala("C://Users/Claud/OneDrive/Desktop/front-licenta/my-app/public/pending.jpg");
        radiologie = RadiologieRepository.save(radiologie);
        return radiologie.getId();
    }


    public void updateRadiologie(Long id,String username,String inputPath) {
        Optional<Radiologie> RadiologieOptional = RadiologieRepository.findById(id);
        if (!RadiologieOptional.isPresent()) {
            System.out.println("radiologie negasita");
        }
        Radiologie RadiologieToUpdate = RadiologieOptional.get();
        List<User> user=userRepo.findByUsername(username);
        User userRadiolog=user.get(0);
        System.out.println(inputPath);
        String input= "C:/Users/Claud/OneDrive/Desktop/front-licenta/my-app/public/"+inputPath;
        System.out.println(input);
        List<String> paths = DetectTumorMain.detectTumor(input,RadiologieToUpdate.getPacient().getCnp());
        String result= TumorClassifier.classifier(input);
        RadiologieToUpdate.setRadiolog(userRadiolog);
        RadiologieToUpdate.setRadiologieInitiala(paths.get(0));
        if(result.equals("tumora prezenta"))
        {
            RadiologieToUpdate.setRadiologieFinala(paths.get(1));
            RadiologieToUpdate.setDimensiune(Float.parseFloat(paths.get(2)));
        }
        else {
            RadiologieToUpdate.setRadiologieFinala(paths.get(0));
            RadiologieToUpdate.setDimensiune(0);
        }
        RadiologieToUpdate.setRezultat(result);
        RadiologieToUpdate.setStatus("asteptare");
        RadiologieToUpdate.setDimensiune(Float.parseFloat(paths.get(2)));
        RadiologieRepository.save(RadiologieToUpdate);
    }

    public void updateRadiologieSimplu(Long id, Radiologie RadiologieDetails) {
        Optional<Radiologie> RadiologieOptional = RadiologieRepository.findById(id);
        if (!RadiologieOptional.isPresent()) {
            System.out.println("radiologie negasita");
        }

        Radiologie RadiologieToUpdate = RadiologieOptional.get();
        RadiologieToUpdate.setPacient(RadiologieDetails.getPacient());
        RadiologieToUpdate.setRadiolog(RadiologieDetails.getRadiolog());
        RadiologieToUpdate.setDoctor(RadiologieDetails.getDoctor());
        RadiologieToUpdate.setDataRealizare(RadiologieDetails.getDataRealizare());
        RadiologieToUpdate.setRezultat(RadiologieDetails.getRezultat());
        RadiologieToUpdate.setStatus(RadiologieDetails.getStatus());
        RadiologieToUpdate.setDimensiune(RadiologieDetails.getDimensiune());

        RadiologieRepository.save(RadiologieToUpdate);
    }
    public Radiologie findRadiologieById(Long id) {
        Optional<Radiologie> prosumerOptional =RadiologieRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            System.out.println("radiologie negasita");
        }
        return prosumerOptional.get();
    }

    public void addParafa(String username, Long radiologieId) {
        Optional<Radiologie> radiologieOptional = RadiologieRepository.findById(radiologieId);

        if (radiologieOptional.isPresent()) {
            Radiologie radiologie = radiologieOptional.get();
            List<User> userList = userRepo.findByUsername(username);

            if (!userList.isEmpty()) {
                User user = userList.get(0);
                radiologie.setParafaMedic(user.getParafa());
                radiologie.setStatus("finalizata");
                RadiologieRepository.save(radiologie);
                System.out.println(radiologie.getParafaMedic());
            } else {
                System.out.println("user negasit");
            }
        } else {
            System.out.println("radiologie negasita");
        }
    }

    public List<Radiologie> findRadiologiesByDoctorId(Long doctorId) {
        List<Radiologie> allRadiologies = RadiologieRepository.findAll();
        return allRadiologies.stream()
                .filter(Radiologie -> Radiologie.getDoctor() != null && Radiologie.getDoctor().getId().equals(doctorId))
                .collect(Collectors.toList());
    }

    public List<Radiologie> findRadiologiesByStatus() {
        List<Radiologie> allRadiologies = RadiologieRepository.findAll();
        return allRadiologies.stream()
                .filter(Radiologie -> Radiologie.getStatus().equals("trimisa"))
                .collect(Collectors.toList());
    }

}
