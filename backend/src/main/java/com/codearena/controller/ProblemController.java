
package com.codearena.controller;

import com.codearena.model.Problem;
import com.codearena.service.ProblemService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController() {
        this.problemService = new ProblemService();
    }

    // 1. Get all active problems
    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    // 2. Get one problem by ID
    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable int id) {
        return problemService.getProblemById(id);
    }

    // 3. Add a new problem
    @PostMapping
    public ResponseEntity<String> addProblem(
            @RequestBody Problem problem) {

        boolean added = problemService.addProblem(problem);

        if (added) {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Problem added successfully!");
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Unable to add problem. Please check the details.");
    }
}
