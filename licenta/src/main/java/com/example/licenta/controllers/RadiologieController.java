package com.example.licenta.controllers;

import com.example.licenta.exceptions.ResourcesNotFoundException;
import com.example.licenta.model.Radiologie;
import com.example.licenta.model.User;
import com.example.licenta.services.RadiologieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.licenta.mail.EmailSender;


import java.io.File;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/radiologies")
public class RadiologieController {

    private final RadiologieService radiologieService;

    @Autowired
    public RadiologieController(RadiologieService radiologieService) {
        this.radiologieService = radiologieService;
    }

    @GetMapping
    public ResponseEntity<List<Radiologie>> getAllRadiologies() {
        List<Radiologie> radiologies = radiologieService.findRadiologii();
        return ResponseEntity.ok(radiologies);
    }

    @PostMapping
    public ResponseEntity<Radiologie> createRadiologie(@RequestBody Radiologie radiologie) {
        Long id = radiologieService.insertRadiologie(radiologie);
        return ResponseEntity.ok().body(radiologie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRadiologie(@PathVariable Long id, @RequestBody Radiologie radiologieDetails) {
        try {
            radiologieService.updateRadiologieSimplu(id, radiologieDetails);
            return ResponseEntity.ok().build();
        } catch (ResourcesNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/addRadiologie/{id}")
    public ResponseEntity<?> updateRadiologie(@PathVariable Long id,@RequestParam String username, @RequestParam String inputPath) {
        try {
            radiologieService.updateRadiologie(id, username, inputPath);
            return ResponseEntity.ok().build();
        } catch (ResourcesNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/addParafa")
    public ResponseEntity<?> addParafa(@RequestBody ParafaRequest request) {
        radiologieService.addParafa(request.getUsername(), request.getRadiologieId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Radiologie> getRadiologieById(@PathVariable Long id) {
        Radiologie radiologie = radiologieService.findRadiologieById(id);
        if (radiologie != null) {
            return ResponseEntity.ok(radiologie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/byDoctor/{doctorId}")
    public ResponseEntity<List<Radiologie>> findRadiologiesByDoctorId(@PathVariable Long doctorId) {
        List<Radiologie> radiologies = radiologieService.findRadiologiesByDoctorId(doctorId);
        return ResponseEntity.ok(radiologies);
    }

    @GetMapping("/byStatus")
    public ResponseEntity<List<Radiologie>> findRadiologiesByStatus() {
        List<Radiologie> radiologies = radiologieService.findRadiologiesByStatus();
        return ResponseEntity.ok(radiologies);
    }

    public static class ParafaRequest {
        private String username;
        private Long radiologieId;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public Long getRadiologieId() {
            return radiologieId;
        }

        public void setRadiologieId(Long radiologieId) {
            this.radiologieId = radiologieId;
        }

    }

    @PostMapping("/send-pdf")
    public ResponseEntity<?> handlePdfSend(@RequestParam("pdf") MultipartFile pdf,
                                           @RequestParam("email") String email) {
        try {
            File tempFile = File.createTempFile("radiologie-", ".pdf");
            pdf.transferTo(tempFile);

            EmailSender.getInstance().sendEmailWithAttachment(email, "Rezultat radiologie", "Rezultatul radiologiei este atașat acestui e-mail.", tempFile);

            tempFile.delete();

            return ResponseEntity.ok("Email sent successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email.");
        }
    }



}
