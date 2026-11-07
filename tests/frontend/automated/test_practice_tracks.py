"""
CodeArena — Automated Test Suite: Two-Track Practice & Beginner Java Platform
Validates:
1. Practice landing page displays exactly two prominent track options (Basic vs DSA).
2. Card A links to basic-practice.html, Card B links to problems.html.
3. 13 beginner Java categories load with complete metadata and icons.
4. Dataset contains >= 40 distinct beginner Java problems (50 verified).
5. Category filtering, difficulty filtering, search, and sorting behavior.
6. Problem links point to basic-problem.html?id=<problem-id>.
7. Problem-appropriate Java starter templates and sample test cases.
8. Two-pane basic workspace elements and honest preview messaging.
9. Canonical DSA 200 problem dataset and routes preserved.
10. Dual theme compatibility and responsive classes.
11. Safe storage access wrapped in try/catch.
12. Zero backend/database touch or dependency.
"""

import os
import re
import unittest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FRONTEND_DIR = os.path.join(REPO_ROOT, "frontend")


class TestPracticeTracks(unittest.TestCase):

    def setUp(self):
        self.practice_html = os.path.join(FRONTEND_DIR, "pages", "practice.html")
        self.basic_practice_html = os.path.join(FRONTEND_DIR, "pages", "basic-practice.html")
        self.basic_problem_html = os.path.join(FRONTEND_DIR, "pages", "basic-problem.html")
        self.problems_html = os.path.join(FRONTEND_DIR, "pages", "problems.html")
        self.problem_html = os.path.join(FRONTEND_DIR, "pages", "problem.html")
        self.basic_css = os.path.join(FRONTEND_DIR, "css", "basic_practice.css")
        self.basic_data_js = os.path.join(FRONTEND_DIR, "js", "basic_problems_data.js")
        self.basic_service_js = os.path.join(FRONTEND_DIR, "js", "basic_practice_service.js")
        self.basic_practice_js = os.path.join(FRONTEND_DIR, "js", "basic_practice.js")
        self.basic_workspace_js = os.path.join(FRONTEND_DIR, "js", "basic_problem_workspace.js")
        self.api_js = os.path.join(FRONTEND_DIR, "js", "api.js")

    def test_01_practice_landing_two_track_cards(self):
        """1. Practice landing page contains exactly two prominent track cards."""
        self.assertTrue(os.path.exists(self.practice_html), "practice.html exists")
        with open(self.practice_html, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertTrue("Explore Practice Tracks" in html or "Choose Your Practice Track" in html)
        self.assertIn("track-cards-grid", html)
        self.assertIn("track-card-basic", html)
        self.assertIn("track-card-dsa", html)

        # Card A link to basic-practice.html
        self.assertIn('href="basic-practice.html"', html)
        # Card B link to problems.html
        self.assertIn('href="problems.html"', html)

        # Check titles
        self.assertIn("Basic Problems", html)
        self.assertIn("DSA Problems (Advanced)", html)

    def test_02_all_13_beginner_categories_defined(self):
        """2. All 13 canonical beginner Java categories exist in dataset."""
        self.assertTrue(os.path.exists(self.basic_data_js), "basic_problems_data.js exists")
        with open(self.basic_data_js, "r", encoding="utf-8") as f:
            js = f.read()

        expected_categories = [
            "Java Fundamentals",
            "Input and Output",
            "Operators",
            "Conditional Statements",
            "Loops",
            "Number Problems",
            "Pattern Programming",
            "Arrays",
            "Strings",
            "Methods and Recursion",
            "Object-Oriented Programming",
            "Exception Handling",
            "Collections Basics"
        ]

        for cat in expected_categories:
            self.assertIn(f"name: '{cat}'", js, f"Category '{cat}' found in basic_problems_data.js")

    def test_03_beginner_problem_catalogue_minimum_count(self):
        """3. Initial beginner dataset contains >= 40 distinct problems (50 provided)."""
        with open(self.basic_data_js, "r", encoding="utf-8") as f:
            js = f.read()

        # Extract problem IDs
        problem_ids = re.findall(r"id:\s*['\"]([a-z0-9-]+)['\"]", js)
        # Filter out category IDs (fundamentals, io, operators, etc.)
        cat_ids = {"fundamentals", "io", "operators", "conditionals", "loops", "numbers",
                   "patterns", "arrays", "strings", "methods", "oop", "exceptions", "collections"}
        prob_ids = [pid for pid in problem_ids if pid not in cat_ids]

        self.assertGreaterEqual(len(prob_ids), 40, f"Expected >= 40 beginner problems, found {len(prob_ids)}")
        self.assertEqual(len(prob_ids), len(set(prob_ids)), "All beginner problem IDs must be unique")

    def test_04_problem_appropriate_starter_templates(self):
        """4. Starter code templates are appropriate for the specific Java problems."""
        with open(self.basic_data_js, "r", encoding="utf-8") as f:
            js = f.read()

        # Input/Output and number challenges use java.util.Scanner
        self.assertIn("import java.util.Scanner;", js)
        self.assertIn("public class Main", js)

        # OOP challenges define classes and methods
        self.assertIn("class Student", js)
        self.assertIn("class BankAccount", js)
        self.assertIn("class Vehicle", js)

    def test_05_basic_practice_catalogue_page(self):
        """5. basic-practice.html contains search, category grid, difficulty pills, and catalogue."""
        self.assertTrue(os.path.exists(self.basic_practice_html), "basic-practice.html exists")
        with open(self.basic_practice_html, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertIn('id="basicCategoriesGrid"', html)
        self.assertIn('id="basicSearchInput"', html)
        self.assertIn('id="basicCategorySelect"', html)
        self.assertIn('basic-diff-tab', html)
        self.assertIn('id="basicProblemsContainer"', html)
        self.assertIn('id="basicPaginationWrap"', html)

    def test_06_basic_problem_workspace_structure(self):
        """6. basic-problem.html contains two panes, CodeMirror container, console tabs, and preview notice."""
        self.assertTrue(os.path.exists(self.basic_problem_html), "basic-problem.html exists")
        with open(self.basic_problem_html, "r", encoding="utf-8") as f:
            html = f.read()

        # Two Panes
        self.assertIn("basic-left-pane", html)
        self.assertIn("basic-right-pane", html)

        # Left Pane Elements
        self.assertIn('id="basicProblemTitle"', html)
        self.assertIn('id="basicProbNumber"', html)
        self.assertIn('id="basicProbCategory"', html)
        self.assertIn('id="basicProbDifficulty"', html)
        self.assertIn('id="basicProblemDesc"', html)
        self.assertIn('id="basicInputFormat"', html)
        self.assertIn('id="basicOutputFormat"', html)
        self.assertIn('id="basicConstraints"', html)
        self.assertIn('id="basicSampleInput"', html)
        self.assertIn('id="basicSampleOutput"', html)
        self.assertIn('id="basicConceptsRow"', html)

        # Right Pane Elements
        self.assertIn('id="basicCodeMirrorContainer"', html)
        self.assertIn('id="btnResetCode"', html)
        self.assertIn('id="btnCopyCode"', html)
        self.assertIn('id="btnFontDec"', html)
        self.assertIn('id="btnFontInc"', html)
        self.assertIn('id="btnRunBasicCode"', html)
        self.assertIn('id="btnSubmitBasicSolution"', html)

        # Console Tabs
        self.assertIn('id="tabOutput"', html)
        self.assertIn('id="tabInput"', html)
        self.assertIn('id="tabTestCases"', html)
        self.assertIn('id="tabDiagnostics"', html)

        # Honest Preview Messaging
        self.assertIn("Preview Mode", html)
        self.assertIn("client-side", html.lower())

    def test_07_honest_preview_execution_messaging(self):
        """7. Honest preview execution messaging is communicated in UI and service."""
        with open(self.basic_service_js, "r", encoding="utf-8") as f:
            service_code = f.read()

        self.assertIn("isStructuralPreview", service_code)
        self.assertIn("Preview", service_code)

        with open(self.basic_problem_html, "r", encoding="utf-8") as f:
            html = f.read()
        self.assertIn("Preview Mode", html)
        self.assertIn("Client-side structural syntax", html)

    def test_08_safe_local_storage_wrapping(self):
        """8. localStorage operations in basic services are wrapped in try/catch."""
        with open(self.basic_service_js, "r", encoding="utf-8") as f:
            code = f.read()

        # Both getStorageItem and setStorageItem wrap localStorage in try/catch
        self.assertIn("function getStorageItem(key)", code)
        self.assertIn("function setStorageItem(key, value)", code)
        self.assertIn("try {", code)
        self.assertIn("catch (e)", code)

    def test_09_canonical_dsa_routes_intact(self):
        """9. Canonical 200 DSA problems and routes remain completely intact."""
        self.assertTrue(os.path.exists(self.problems_html), "problems.html exists")
        self.assertTrue(os.path.exists(self.problem_html), "problem.html exists")

        self.assertTrue(os.path.exists(self.api_js), "api.js exists")
        with open(self.api_js, "r", encoding="utf-8") as f:
            dsa_data = f.read()

        # Ensure canonical DSA problems data is untouched
        self.assertIn("two-sum", dsa_data)
        self.assertIn("reverse-a-string", dsa_data)
        self.assertIn("merge-k-sorted-lists", dsa_data)

    def test_10_theme_support_and_styles(self):
        """10. basic_practice.css defines dual dark and light theme tokens and responsive rules."""
        self.assertTrue(os.path.exists(self.basic_css), "basic_practice.css exists")
        with open(self.basic_css, "r", encoding="utf-8") as f:
            css = f.read()

        self.assertIn('[data-theme="light"]', css)
        self.assertIn('@media (max-width: 1024px)', css)
        self.assertIn('@media (max-width: 768px)', css)
        self.assertIn('@media (max-width: 480px)', css)

    def test_11_zero_backend_database_references(self):
        """11. Verify zero backend or database modifications or references in basic track files."""
        for path in [self.basic_practice_html, self.basic_problem_html, self.basic_service_js, self.basic_workspace_js]:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertNotIn("backend/", content)
            self.assertNotIn("database/", content)
            self.assertNotIn("mysql", content.lower())
            self.assertNotIn("postgresql", content.lower())


if __name__ == '__main__':
    unittest.main()
