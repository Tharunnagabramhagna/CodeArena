
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
    public ResponseEntity<Submission> getSubmissionById(
            @PathVariable int id) {

        Submission submission = submissionService.getSubmissionById(id);

        if (submission == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(submission);
    }

    // 3. Get submissions by user ID
    @GetMapping("/user/{userId}")
    public List<Submission> getSubmissionsByUserId(
            @PathVariable int userId) {

        return submissionService.getSubmissionsByUserId(userId);
    }

    // 4. Get submissions by problem ID
    @GetMapping("/problem/{problemId}")
    public List<Submission> getSubmissionsByProblemId(
            @PathVariable int problemId) {

        return submissionService.getSubmissionsByProblemId(problemId);
    }
}
