package com.example.licenta;

import com.example.licenta.model.Pacient;
import com.example.licenta.model.Radiologie;
import com.example.licenta.model.User;
import com.example.licenta.services.PacientService;
import com.example.licenta.services.RadiologieService;
import com.example.licenta.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class LicentaApplication {

	public static void main(String[] args) {
		SpringApplication.run(LicentaApplication.class, args);
	}




}
