
package com.codearena.controller;

import com.codearena.model.Submission;
import com.codearena.service.SubmissionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController() {
        this.submissionService = new SubmissionService();
    }

    // 1. Submit source code
    @PostMapping
    public ResponseEntity<String> addSubmission(
            @RequestBody Submission submission) {

        boolean added = submissionService.addSubmission(submission);

        if (added) {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Submission created successfully!");
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Unable to create submission. Please check the details.");
    }

    // 2. Get submission by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(
            @PathVariable int id) {

        if (id <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid submission ID!");
        }

        Submission submission = submissionService.getSubmissionById(id);

        if (submission == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Submission not found!");
        }

        return ResponseEntity.ok(submission);
    }

    // 3. Get submissions by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getSubmissionsByUserId(
            @PathVariable int userId) {

        if (userId <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid user ID!");
        }

        List<Submission> submissions =
                submissionService.getSubmissionsByUserId(userId);

        return ResponseEntity.ok(submissions);
    }

    // 4. Get submissions by problem ID
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<?> getSubmissionsByProblemId(
            @PathVariable int problemId) {

        if (problemId <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid problem ID!");
        }

        List<Submission> submissions =
                submissionService.getSubmissionsByProblemId(problemId);

        return ResponseEntity.ok(submissions);
    }
}
