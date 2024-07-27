package com.example.licenta.services;

import com.example.licenta.exceptions.ResourcesNotFoundException;
import com.example.licenta.model.User;
import com.example.licenta.repositories.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.FileWriter;
import java.io.IOException;
import java.security.Key;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService{
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepo userRepository;
    @Autowired
    public UserService(UserRepo userRepository) {
        this.userRepository = userRepository;
    }
    private static final Random RANDOM = new SecureRandom();
    private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int PASSWORD_LENGTH = 12;

    public String generateRandomPassword() {
        StringBuilder returnValue = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            returnValue.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return returnValue.toString();
    }
    public List<User> findPersons() {
        List<User> personList = userRepository.findAll();
        return personList;
    }

    public Long insertUser(User user) {
        user.setState("activ");
        user.setPassword(this.generateRandomPassword());
        user = userRepository.save(user);

        return user.getId();
    }


    public void updateUser(Long id, User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            System.out.println("user negasit");
        }

        User userToUpdate = userOptional.get();
        userToUpdate.setNume(userDetails.getNume());
        userToUpdate.setPrenume(userDetails.getPrenume());
        userToUpdate.setUsername(userDetails.getUsername());
        userToUpdate.setPassword(userDetails.getPassword());
        userToUpdate.setRol(userDetails.getRol());
        userToUpdate.setParafa(userDetails.getParafa());

        userRepository.save(userToUpdate);
    }

    public User findPersonById(Long id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            System.out.println("user negasit");
        }
        return prosumerOptional.get();
    }
     public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourcesNotFoundException("User with id: " + id));
        user.setState("dezactivat");
        userRepository.save(user);
    }

    public User login(String username, String pass) {
        List<User> personList = userRepository.findAll();
        for (User person : personList) {
            if (person.getUsername().equals(username) && person.getPassword().equals(pass) && person.getState().equals("activ")) {
                return person;
            }
        }

        throw new RuntimeException("Autentificare eșuată: Nume de utilizator sau parolă incorecte");

    }
}
