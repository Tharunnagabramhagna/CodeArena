
package com.codearena.controller;

import com.codearena.model.Problem;
import com.codearena.service.ProblemService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController() {
        this.problemService = new ProblemService();
    }

    // Get all active problems
    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    // Get one problem by ID
    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable int id) {
        return problemService.getProblemById(id);
    }
}
