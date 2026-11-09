"""
CodeArena — Automated Test Suite: Guided Java Learning Roadmap
Tests data integrity, prerequisite DAG validity, problem mapping authenticity,
state service mechanics, responsive layout structure, and zero emoji compliance.
"""

import os
import re
import unittest

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
FRONTEND_DIR = os.path.join(WORKSPACE_ROOT, 'frontend')


class TestGuidedJavaRoadmap(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.data_path = os.path.join(FRONTEND_DIR, 'js', 'roadmap_data.js')
        cls.service_path = os.path.join(FRONTEND_DIR, 'js', 'roadmap_service.js')
        cls.controller_path = os.path.join(FRONTEND_DIR, 'js', 'roadmap.js')
        cls.html_path = os.path.join(FRONTEND_DIR, 'pages', 'roadmap.html')
        cls.css_path = os.path.join(FRONTEND_DIR, 'css', 'roadmap.css')
        cls.basic_data_path = os.path.join(FRONTEND_DIR, 'js', 'basic_problems_data.js')
        cls.api_path = os.path.join(FRONTEND_DIR, 'js', 'api.js')

        with open(cls.data_path, 'r', encoding='utf-8') as f:
            cls.data_content = f.read()
        with open(cls.service_path, 'r', encoding='utf-8') as f:
            cls.service_content = f.read()
        with open(cls.controller_path, 'r', encoding='utf-8') as f:
            cls.controller_content = f.read()
        with open(cls.html_path, 'r', encoding='utf-8') as f:
            cls.html_content = f.read()
        with open(cls.css_path, 'r', encoding='utf-8') as f:
            cls.css_content = f.read()

    def test_file_existence(self):
        """Verify all roadmap core files exist on disk."""
        self.assertTrue(os.path.isfile(self.data_path), "roadmap_data.js must exist")
        self.assertTrue(os.path.isfile(self.service_path), "roadmap_service.js must exist")
        self.assertTrue(os.path.isfile(self.controller_path), "roadmap.js must exist")
        self.assertTrue(os.path.isfile(self.html_path), "roadmap.html must exist")
        self.assertTrue(os.path.isfile(self.css_path), "roadmap.css must exist")

    def test_levels_and_topics_count(self):
        """Verify 3 major levels and exactly 30 topics are defined."""
        # Levels check
        level_ids = re.findall(r'id:\s*([1-3]),\s*title:\s*[\'"]Level\s*([1-3]):', self.data_content)
        self.assertEqual(len(level_ids), 3, "Roadmap must define exactly 3 levels")

        # Topics check
        topic_matches = re.findall(r'id:\s*[\'"]([a-z0-9\-]+)[\'"],\s*number:\s*(\d+),\s*levelId:\s*([1-3])', self.data_content)
        self.assertEqual(len(topic_matches), 30, "Roadmap must contain exactly 30 topics")

        # Check level distribution: Level 1 (8), Level 2 (9), Level 3 (13)
        l1 = [t for t in topic_matches if t[2] == '1']
        l2 = [t for t in topic_matches if t[2] == '2']
        l3 = [t for t in topic_matches if t[2] == '3']
        self.assertEqual(len(l1), 8, "Level 1 must have 8 topics")
        self.assertEqual(len(l2), 9, "Level 2 must have 9 topics")
        self.assertEqual(len(l3), 13, "Level 3 must have 13 topics")

    def test_topic_ids_uniqueness(self):
        """Verify all topic IDs are unique strings."""
        topic_ids = re.findall(r'id:\s*[\'"]([a-z0-9\-]+)[\'"],\s*number:\s*\d+', self.data_content)
        self.assertEqual(len(topic_ids), len(set(topic_ids)), "All 30 topic IDs must be unique")

    def test_prerequisite_references_and_dag_validity(self):
        """Verify prerequisite references point to valid topics and form a DAG with 0 cycles."""
        topic_pattern = r'id:\s*[\'"]([a-z0-9\-]+)[\'"],\s*number:\s*\d+.*?prerequisites:\s*\[([^\]]*)\]'
        matches = re.findall(topic_pattern, self.data_content, re.DOTALL)
        self.assertEqual(len(matches), 30)

        all_ids = set([m[0] for m in matches])
        graph = {}

        for tid, prereqs_str in matches:
            prereqs = [p.strip().strip('\'"') for p in prereqs_str.split(',') if p.strip().strip('\'"')]
            for p in prereqs:
                self.assertIn(p, all_ids, f"Topic {tid} has unknown prerequisite: {p}")
            graph[tid] = prereqs

        # Cycle detection
        visited = {node: 0 for node in graph}

        def dfs(node):
            visited[node] = 1
            for neighbor in graph.get(node, []):
                if visited.get(neighbor) == 1:
                    return True
                if visited.get(neighbor) == 0:
                    if dfs(neighbor):
                        return True
            visited[node] = 2
            return False

        has_cycle = False
        for node in graph:
            if visited[node] == 0:
                if dfs(node):
                    has_cycle = True
                    break

        self.assertFalse(has_cycle, "Prerequisite graph must not contain circular dependencies")

    def test_topic_content_completeness(self):
        """Verify each topic includes objectives, coreConcepts, codeExample, expectedOutput, and commonMistakes."""
        self.assertIn('objectives:', self.data_content)
        self.assertIn('coreConcepts:', self.data_content)
        self.assertIn('codeExample:', self.data_content)
        self.assertIn('expectedOutput:', self.data_content)
        self.assertIn('commonMistakes:', self.data_content)

        # Count occurrences
        self.assertEqual(len(re.findall(r'codeExample:', self.data_content)), 30)
        self.assertEqual(len(re.findall(r'expectedOutput:', self.data_content)), 30)
        self.assertEqual(len(re.findall(r'commonMistakes:', self.data_content)), 30)

    def test_problem_mappings_authenticity(self):
        """Verify every mapped basic and DSA problem ID exists in canonical datasets."""
        with open(self.basic_data_path, 'r', encoding='utf-8') as f:
            basic_text = f.read()
        with open(self.api_path, 'r', encoding='utf-8') as f:
            api_text = f.read()

        valid_basic_ids = set(re.findall(r'id:\s*[\'"]([a-z0-9\-]+)[\'"],\s*number:', basic_text))
        valid_dsa_ids = set(re.findall(r'"id":\s*"([^"]+)",\s*"title":', api_text))

        self.assertEqual(len(valid_basic_ids), 50, "Expected 50 basic problems in basic_problems_data.js")
        self.assertEqual(len(valid_dsa_ids), 200, "Expected 200 DSA problems in api.js")

        # Check basicProblemIds
        basic_matches = re.findall(r'basicProblemIds:\s*\[([^\]]*)\]', self.data_content)
        all_basic_mapped = []
        for m in basic_matches:
            for item in m.split(','):
                clean = item.strip().strip('\'"')
                if clean:
                    all_basic_mapped.append(clean)

        self.assertTrue(len(all_basic_mapped) > 0, "Roadmap should map basic problems")
        for pid in all_basic_mapped:
            self.assertIn(pid, valid_basic_ids, f"Referenced basic problem ID does not exist: {pid}")

        # Check dsaProblemIds
        dsa_matches = re.findall(r'dsaProblemIds:\s*\[([^\]]*)\]', self.data_content)
        all_dsa_mapped = []
        for m in dsa_matches:
            for item in m.split(','):
                clean = item.strip().strip('\'"')
                if clean:
                    all_dsa_mapped.append(clean)

        self.assertTrue(len(all_dsa_mapped) > 0, "Roadmap should map DSA problems")
        for pid in all_dsa_mapped:
            self.assertIn(pid, valid_dsa_ids, f"Referenced DSA problem ID does not exist: {pid}")

    def test_service_architecture(self):
        """Verify service layer functions and local storage key."""
        self.assertIn('codearena_roadmap_progress', self.service_content)
        self.assertIn('getCompletedTopicIds:', self.service_content)
        self.assertIn('isTopicCompleted:', self.service_content)
        self.assertIn('isTopicUnlocked:', self.service_content)
        self.assertIn('getTopicStatus:', self.service_content)
        self.assertIn('markTopicCompleted:', self.service_content)
        self.assertIn('unmarkTopicCompleted:', self.service_content)
        self.assertIn('toggleTopicCompleted:', self.service_content)
        self.assertIn('resetProgress:', self.service_content)
        self.assertIn('getLevelStats:', self.service_content)
        self.assertIn('getOverallStats:', self.service_content)
        self.assertIn('getRecommendedNextTopic:', self.service_content)

    def test_html_structure_and_tokens(self):
        """Verify roadmap.html contains standard secondary header, stat cards, search, filters, drawer, and modal."""
        # Header and branding
        self.assertIn('secondary-header', self.html_content)
        self.assertIn('codearena-full-icon.png', self.html_content)
        self.assertIn('Java Learning Roadmap', self.html_content)
        self.assertIn('theme-toggle', self.html_content)

        # Stat cards
        self.assertIn('id="statOverallProgress"', self.html_content)
        self.assertIn('id="statCompletedCount"', self.html_content)
        self.assertIn('id="statCurrentLevelBadge"', self.html_content)
        self.assertIn('id="recTopicContainer"', self.html_content)

        # Search and filters
        self.assertIn('id="roadmapSearchInput"', self.html_content)
        self.assertIn('id="searchClearBtn"', self.html_content)
        self.assertIn('data-level="all"', self.html_content)
        self.assertIn('data-level="1"', self.html_content)
        self.assertIn('data-level="2"', self.html_content)
        self.assertIn('data-level="3"', self.html_content)
        self.assertIn('id="statusFilterSelect"', self.html_content)
        self.assertIn('id="btnResetProgress"', self.html_content)

        # Drawer and Modal
        self.assertIn('id="roadmapDetailOverlay"', self.html_content)
        self.assertIn('id="roadmapDetailDrawer"', self.html_content)
        self.assertIn('id="drawerToggleCompleteBtn"', self.html_content)
        self.assertIn('id="resetModal"', self.html_content)
        self.assertIn('id="btnConfirmReset"', self.html_content)

        # Scripts inclusion
        self.assertIn('roadmap_data.js', self.html_content)
        self.assertIn('roadmap_service.js', self.html_content)
        self.assertIn('roadmap.js', self.html_content)

    def test_zero_emojis(self):
        """Verify strict rule: no emojis anywhere in roadmap files."""
        emoji_pattern = re.compile(
            r'[\U00010000-\U0010ffff]|[\u2600-\u26ff]|[\u2700-\u27bf]'
        )
        for name, content in [
            ('roadmap_data.js', self.data_content),
            ('roadmap_service.js', self.service_content),
            ('roadmap.js', self.controller_content),
            ('roadmap.html', self.html_content),
            ('roadmap.css', self.css_content),
        ]:
            matches = emoji_pattern.findall(content)
            self.assertEqual(len(matches), 0, f"Found {len(matches)} emojis in {name}: {matches[:5]}")

    def test_css_responsive_viewports_and_themes(self):
        """Verify css supports light theme and responsive breakpoints."""
        self.assertIn('[data-theme="light"]', self.css_content)
        self.assertIn('@media (max-width: 1200px)', self.css_content)
        self.assertIn('@media (max-width: 768px)', self.css_content)
        self.assertIn('@media (max-width: 480px)', self.css_content)


if __name__ == '__main__':
    unittest.main()

