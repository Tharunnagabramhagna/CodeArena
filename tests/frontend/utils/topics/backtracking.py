# backtracking.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: Basic Recursion
    problems.append(make_prob(
        "fibonacci-number", "Fibonacci Number", "Easy", "Recursion and Backtracking", "Basic Recursion",
        "Calculate the nth Fibonacci number where F(n) = F(n-1) + F(n-2).",
        "The Fibonacci numbers, commonly denoted <code>F(n)</code> form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from <code>0</code> and <code>1</code>. That is, <code>F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2)</code> for <code>n > 1</code>. Given <code>n</code>, calculate <code>F(n)</code>.",
        "An integer <code>n</code>.", "The nth Fibonacci number.",
        ["0 <= n <= 30"],
        "n = 2", "1", "F(2) = F(1) + F(0) = 1 + 0 = 1.",
        "n = 4", "3", "F(4) = F(3) + F(2) = 2 + 1 = 3.",
        "Identify base cases: if n <= 1, return n.",
        "Naive recursion recomputes states exponentially. Use memoization or two variables to compute iteratively in O(N) time.",
        "Maintain prev2 = 0, prev1 = 1. Loop from 2 to n: curr = prev1 + prev2, prev2 = prev1, prev1 = curr. Return prev1.",
        "int fib(int n)", "0", "70.2%", 27800
    ))

    problems.append(make_prob(
        "power-of-three", "Power of Three", "Easy", "Recursion and Backtracking", "Basic Recursion",
        "Determine if an integer is a power of three using recursion.",
        "Given an integer <code>n</code>, return <code>true</code> if it is a power of three. Otherwise, return <code>false</code>. An integer <code>n</code> is a power of three, if there exists an integer <code>x</code> such that <code>n == 3^x</code>.",
        "An integer <code>n</code>.", "Boolean <code>true</code> if power of three.",
        ["-2^31 <= n <= 2^31 - 1"],
        "n = 27", "true", "27 = 3^3.",
        "n = 0", "false", "0 is not a power of three.",
        "Any positive power of three must be strictly greater than 0.",
        "If n <= 0, return false. If n == 1, return true (3^0 = 1).",
        "If n % 3 == 0, recursively check isPowerOfThree(n / 3). Otherwise return false.",
        "boolean isPowerOfThree(int n)", "false", "45.9%", 19100
    ))

    # Pattern: Subsets
    problems.append(make_prob(
        "subsets", "Subsets", "Medium", "Recursion and Backtracking", "Subsets",
        "Return all possible subsets (the power set) of unique elements.",
        "Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
        "An integer array <code>nums</code>.", "List of all subsets (list of lists).",
        ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All the numbers of nums are unique."],
        "nums = [1,2,3]", "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", "All 2^3 = 8 subsets.",
        "nums = [0]", "[[],[0]]", "Two subsets for single element.",
        "For each element, you have two choices: include it in the current subset, or exclude it.",
        "Use a recursive helper backtrack(start, currentSubset, result).",
        "At each recursive call, add a copy of currentSubset to result. Then loop i from start to nums.length - 1: add nums[i], recurse with i + 1, and remove last element (backtrack).",
        "java.util.List<java.util.List<Integer>> subsets(int[] nums)", "new java.util.ArrayList<>()", "76.4%", 24500
    ))

    problems.append(make_prob(
        "subsets-ii", "Subsets II", "Medium", "Recursion and Backtracking", "Subsets",
        "Return all possible subsets of an array that may contain duplicates.",
        "Given an integer array <code>nums</code> that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
        "An integer array <code>nums</code>.", "List of all unique subsets.",
        ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10"],
        "nums = [1,2,2]", "[[],[1],[1,2],[1,2,2],[2],[2,2]]", "Unique subsets avoiding duplicates.",
        "nums = [0]", "[[],[0]]", "Power set of [0].",
        "Sort nums first so that duplicate numbers are adjacent.",
        "In the backtrack loop over index i from start to nums.length - 1: skip duplicates if i > start && nums[i] == nums[i - 1].",
        "This ensures a duplicate element is only chosen once at the current decision level.",
        "java.util.List<java.util.List<Integer>> subsetsWithDup(int[] nums)", "new java.util.ArrayList<>()", "57.1%", 15600
    ))

    # Pattern: Permutations
    problems.append(make_prob(
        "permutations", "Permutations", "Medium", "Recursion and Backtracking", "Permutations",
        "Return all possible permutations of an array of distinct integers.",
        "Given an array <code>nums</code> of distinct integers, return all the possible permutations. You can return the answer in any order.",
        "An integer array <code>nums</code>.", "List of all permutations.",
        ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All the integers of nums are unique."],
        "nums = [1,2,3]", "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", "All 3! = 6 permutations.",
        "nums = [0,1]", "[[0,1],[1,0]]", "2 permutations.",
        "Every permutation must contain all n elements in some order.",
        "Maintain a boolean[] used array (or swap in-place) to track elements already included in the current branch.",
        "When currentList.size() == nums.length, add a copy to results. In loop i from 0 to n - 1: if (!used[i]) { used[i] = true; list.add(nums[i]); recurse; list.removeLast(); used[i] = false; }",
        "java.util.List<java.util.List<Integer>> permute(int[] nums)", "new java.util.ArrayList<>()", "77.5%", 25100
    ))

    problems.append(make_prob(
        "permutations-ii", "Permutations II", "Medium", "Recursion and Backtracking", "Permutations",
        "Return all unique permutations of a collection of numbers that might contain duplicates.",
        "Given a collection of numbers, <code>nums</code>, that might contain duplicates, return all possible unique permutations in any order.",
        "An integer array <code>nums</code>.", "List of unique permutations.",
        ["1 <= nums.length <= 8", "-10 <= nums[i] <= 10"],
        "nums = [1,1,2]", "[[1,1,2],[1,2,1],[2,1,1]]", "3 unique permutations.",
        "nums = [1,2,3]", "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", "6 unique permutations.",
        "Sort the array first so identical numbers are grouped together.",
        "Use a boolean[] used array to track which elements are active in current path.",
        "Skip duplicates when i > 0 && nums[i] == nums[i - 1] && !used[i - 1]. The !used[i-1] check enforces consistent order among duplicates.",
        "java.util.List<java.util.List<Integer>> permuteUnique(int[] nums)", "new java.util.ArrayList<>()", "58.2%", 13400
    ))

    # Pattern: Combination Generation
    problems.append(make_prob(
        "combination-sum", "Combination Sum", "Medium", "Recursion and Backtracking", "Combination Generation",
        "Find all unique combinations of candidates where the numbers sum to target.",
        "Given an array of distinct integers <code>candidates</code> and a target integer <code>target</code>, return a list of all unique combinations of <code>candidates</code> where the chosen numbers sum to <code>target</code>. You may return the combinations in any order. The same number may be chosen from <code>candidates</code> an unlimited number of times.",
        "An integer array <code>candidates</code> and integer <code>target</code>.", "List of candidate combinations summing to target.",
        ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "All elements of candidates are distinct.", "1 <= target <= 40"],
        "candidates = [2,3,6,7], target = 7", "[[2,2,3],[7]]", "2 + 2 + 3 = 7 and 7 = 7.",
        "candidates = [2,3,5], target = 8", "[[2,2,2,2],[2,3,3],[3,5]]", "Three unique combinations.",
        "Sort candidates to enable early pruning when candidate > remaining target.",
        "Because an element can be reused, the recursive call keeps the same start index i instead of advancing to i + 1.",
        "Base cases: if remain == 0, add copy of current list to result. If remain < 0, return. Loop i from start to length: add, recurse with (i, remain - candidates[i]), backtrack.",
        "java.util.List<java.util.List<Integer>> combinationSum(int[] candidates, int target)", "new java.util.ArrayList<>()", "70.1%", 21200
    ))

    problems.append(make_prob(
        "letter-combinations-of-phone-number", "Letter Combinations of a Phone Number", "Medium", "Recursion and Backtracking", "Combination Generation",
        "Return all possible letter combinations that the number could represent on a phone dial pad.",
        "Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. A mapping of digits to letters (just like on the telephone buttons) is given: 2->abc, 3->def, 4->ghi, 5->jkl, 6->mno, 7->pqrs, 8->tuv, 9->wxyz.",
        "A string of digits <code>digits</code>.", "List of letter combinations.",
        ["0 <= digits.length <= 4", "digits[i] is a digit in the range ['2', '9']."],
        "digits = '23'", "['ad','ae','af','bd','be','bf','cd','ce','cf']", "All combinations from mapping '2' and '3'.",
        "digits = ''", "[]", "Empty digits produces empty list.",
        "Create an array mapping digit character to its corresponding letters: String[] map = {'', '', 'abc', 'def', ...}.",
        "If digits is empty, return an empty list immediately.",
        "Backtrack: at index idx, loop through each character mapped to digits.charAt(idx), append to path, recurse with idx + 1, and delete last char.",
        "java.util.List<String> letterCombinations(String digits)", "new java.util.ArrayList<>()", "59.4%", 22400
    ))

    # Pattern: Constraint-Based Backtracking
    problems.append(make_prob(
        "n-queens", "N-Queens", "Hard", "Recursion and Backtracking", "Constraint-Based Backtracking",
        "Place n queens on an n x n chessboard such that no two queens attack each other.",
        "The n-queens puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other. Given an integer <code>n</code>, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.",
        "An integer <code>n</code>.", "List of board configurations where 'Q' is a queen and '.' is empty.",
        ["1 <= n <= 9"],
        "n = 4", "['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']", "Two distinct 4-queens board configurations.",
        "n = 1", "[['Q']]", "Single queen.",
        "Queens attack along columns, rows, and diagonals. Place one queen per row.",
        "Use three boolean sets/arrays to check conflicts in O(1): cols[c], diag1[r + c], diag2[r - c + n].",
        "Backtrack row by row from 0 to n - 1. For each col c, if safe, place queen, update tracking arrays, recurse to row + 1, then backtrack.",
        "java.util.List<java.util.List<String>> solveNQueens(int n)", "new java.util.ArrayList<>()", "66.5%", 10800
    ))

    problems.append(make_prob(
        "word-search", "Word Search", "Medium", "Recursion and Backtracking", "Constraint-Based Backtracking",
        "Find if the word exists in the 2D grid of characters.",
        "Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if <code>word</code> exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
        "A 2D char array <code>board</code> and string <code>word</code>.", "Boolean <code>true</code> if word found.",
        ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15"],
        "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'", "true", "The word 'ABCCED' exists following adjacent cells.",
        "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCB'", "false", "Cannot reuse cell 'B'.",
        "Scan every cell (r, c) as a potential starting letter word.charAt(0).",
        "From (r, c), explore 4 neighbors (up, down, left, right) with DFS backtracking.",
        "Temporarily mark board[r][c] = '#' to prevent reuse in current path. Recurse for word.charAt(idx + 1). Restore character when backtracking.",
        "boolean exist(char[][] board, String word)", "false", "41.2%", 18700
    ))

    problems.append(make_prob(
        "sudoku-solver", "Sudoku Solver", "Hard", "Recursion and Backtracking", "Constraint-Based Backtracking",
        "Solve a Sudoku puzzle by filling the empty cells.",
        "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, each column, and each of the 9 3x3 sub-boxes of the grid. The '.' character indicates empty cells.",
        "A 9x9 char array <code>board</code>.", "None (modify <code>board</code> in-place).",
        ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit '1'-'9' or '.'."],
        "board = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],...]", "solved board", "All rows, columns, and 3x3 boxes filled validly.",
        "board = [['8','.','.','.','.','.','.','.','.'],...]", "solved board", "Puzzle completed.",
        "Find the first empty cell '.' on the board.",
        "Try placing digits '1' through '9'. Check if the placement is valid with respects to its row, column, and 3x3 subgrid.",
        "If valid, place digit and recursively call solve(). If solve() returns true, puzzle is solved! Otherwise reset cell to '.' and try next digit.",
        "void solveSudoku(char[][] board)", "", "60.4%", 9200
    ))

    return problems

