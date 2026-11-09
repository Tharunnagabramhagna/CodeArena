
package com.codearena.controller;

import com.codearena.model.TestCase;
import com.codearena.service.TestCaseService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems/{problemId}/testcases")
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController() {
        this.testCaseService = new TestCaseService();
    }

    // 1. Get all test cases for a problem
    @GetMapping
    public ResponseEntity<?> getTestCases(
            @PathVariable int problemId) {

        if (problemId <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid problem ID!");
        }

        List<TestCase> testCases =
                testCaseService.getTestCasesByProblemId(problemId);

        return ResponseEntity.ok(testCases);
    }

    // 2. Add a test case to a problem
    @PostMapping
    public ResponseEntity<String> addTestCase(
            @PathVariable int problemId,
            @RequestBody TestCase testCase) {

        if (problemId <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid problem ID!");
        }

        if (testCase == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Test case cannot be empty!");
        }

        testCase.setProblemId(problemId);

        boolean added = testCaseService.addTestCase(testCase);

        if (added) {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Test case added successfully!");
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Unable to add test case. Please check the details.");
    }
}
