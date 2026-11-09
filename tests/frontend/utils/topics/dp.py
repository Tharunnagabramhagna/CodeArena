# tests/frontend/utils/topics/dp.py
"""Dynamic Programming topic problem generator: 18 problems across 6 patterns."""

from .common import make_problem

def get_problems():
    problems = []

    # --- 1. 1D DP (4 problems, including original climbing-stairs) ---
    problems.append(make_problem(
        id="climbing-stairs",
        title="Climbing Stairs",
        difficulty="Easy",
        topic="Dynamic Programming",
        pattern="1D DP",
        acceptance="52.4%",
        desc="You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        examples=[
            {"input": "n = 2", "output": "2", "explanation": "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps."},
            {"input": "n = 3", "output": "3", "explanation": "There are three ways: 1. 1 + 1 + 1, 2. 1 + 2, 3. 2 + 1."}
        ],
        constraints=["1 <= n <= 45"],
        starter_code="""class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "2", "expected": "2"},
            {"input": "3", "expected": "3"},
            {"input": "5", "expected": "8"}
        ],
        hints=[
            "To reach step `i`, you must come from either step `i - 1` or step `i - 2`.",
            "This leads directly to the recurrence relation: `ways[i] = ways[i - 1] + ways[i - 2]` with base cases `ways[1] = 1` and `ways[2] = 2`.",
            "Notice this is the Fibonacci sequence. You only need two variables to store previous results in O(1) space."
        ],
        tags=["Dynamic Programming", "Math", "Memoization"]
    ))

    problems.append(make_problem(
        id="house-robber",
        title="House Robber",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="1D DP",
        acceptance="51.1%",
        desc="You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.",
        examples=[
            {"input": "nums = [1,2,3,1]", "output": "4", "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4."},
            {"input": "nums = [2,7,9,3,1]", "output": "12", "explanation": "Rob house 1 (money = 2), house 3 (money = 9) and house 5 (money = 1). Total = 12."}
        ],
        constraints=["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
        starter_code="""class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[1,2,3,1]", "expected": "4"},
            {"input": "[2,7,9,3,1]", "expected": "12"},
            {"input": "[2,1,1,2]", "expected": "4"}
        ],
        hints=[
            "For each house, you have two choices: rob it, or skip it.",
            "If you rob house `i`, you cannot rob house `i-1`, so your total is `nums[i] + dp[i-2]`. If you skip house `i`, your total is `dp[i-1]`.",
            "Recurrence: `dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i])`. You can optimize space to O(1) using two rolling variables `prev1` and `prev2`."
        ],
        tags=["Dynamic Programming", "Array"]
    ))

    problems.append(make_problem(
        id="house-robber-ii",
        title="House Robber II",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="1D DP",
        acceptance="42.0%",
        desc="You are a professional robber planning to rob houses along a street. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Adjacent houses have security systems connected. Return the maximum amount of money you can rob tonight without alerting the police.",
        examples=[
            {"input": "nums = [2,3,2]", "output": "3", "explanation": "You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses."},
            {"input": "nums = [1,2,3,1]", "output": "4", "explanation": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."}
        ],
        constraints=["1 <= nums.length <= 100", "0 <= nums[i] <= 1000"],
        starter_code="""class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[2,3,2]", "expected": "3"},
            {"input": "[1,2,3,1]", "expected": "4"},
            {"input": "[1,2,3]", "expected": "3"}
        ],
        hints=[
            "Since the houses are in a circle, house 0 and house `n - 1` are adjacent. You cannot rob both.",
            "Break the circular dependency into two linear House Robber subproblems: houses `0` to `n - 2`, and houses `1` to `n - 1`.",
            "Run the standard House Robber 1 algorithm on both slices and return `Math.max(robSlice(0, n-2), robSlice(1, n-1))` (handling `n == 1` as a base case)."
        ],
        tags=["Dynamic Programming", "Array"]
    ))

    problems.append(make_problem(
        id="decode-ways",
        title="Decode Ways",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="1D DP",
        acceptance="34.6%",
        desc="A message containing letters from A-Z can be encoded into numbers using 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. Given a string `s` containing only digits, return the number of ways to decode it.",
        examples=[
            {"input": "s = \"12\"", "output": "2", "explanation": "\"12\" could be decoded as \"AB\" (1 2) or \"L\" (12)."},
            {"input": "s = \"226\"", "output": "3", "explanation": "\"226\" could be decoded as \"BZ\" (2 26), \"VF\" (22 6), or \"BBF\" (2 2 6)."},
            {"input": "s = \"06\"", "output": "0", "explanation": "\"06\" cannot be mapped to \"F\" because \"6\" is different from \"06\"."}
        ],
        constraints=["1 <= s.length <= 100", "s contains only digits and may contain leading zero(s)"],
        starter_code="""class Solution {
    public int numDecodings(String s) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "\"12\"", "expected": "2"},
            {"input": "\"226\"", "expected": "3"},
            {"input": "\"06\"", "expected": "0"}
        ],
        hints=[
            "At each index `i`, we can either decode a single digit `s[i-1]` or a two-digit number `s[i-2...i-1]`.",
            "A single digit is valid if `s[i-1] != '0'`. A two-digit prefix is valid if it lies between `10` and `26`.",
            "Recurrence: `dp[i] = (valid single digit ? dp[i-1] : 0) + (valid two digits ? dp[i-2] : 0)`. Base cases: `dp[0] = 1`."
        ],
        tags=["Dynamic Programming", "String"]
    ))

    # --- 2. 2D DP (3 problems) ---
    problems.append(make_problem(
        id="unique-paths",
        title="Unique Paths",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="2D DP",
        acceptance="64.1%",
        desc="There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
        examples=[
            {"input": "m = 3, n = 7", "output": "28", "explanation": "28 paths to reach bottom-right corner."},
            {"input": "m = 3, n = 2", "output": "3", "explanation": "1. Right -> Down -> Down; 2. Down -> Down -> Right; 3. Down -> Right -> Down."}
        ],
        constraints=["1 <= m, n <= 100"],
        starter_code="""class Solution {
    public int uniquePaths(int m, int n) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "m = 3, n = 7", "expected": "28"},
            {"input": "m = 3, n = 2", "expected": "3"},
            {"input": "m = 1, n = 1", "expected": "1"}
        ],
        hints=[
            "To reach cell `(r, c)`, the robot must come from either cell `(r - 1, c)` or `(r, c - 1)`.",
            "Recurrence: `dp[r][c] = dp[r - 1][c] + dp[r][c - 1]`. Any cell in the first row or first column has only 1 unique path.",
            "You can optimize the 2D matrix into a 1D array of size `n`, iteratively accumulating columns."
        ],
        tags=["Dynamic Programming", "Math", "Combinatorics"]
    ))

    problems.append(make_problem(
        id="unique-paths-ii",
        title="Unique Paths II",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="2D DP",
        acceptance="41.5%",
        desc="You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. An obstacle and space are marked as `1` or `0` respectively in `grid`. A path that the robot takes cannot include any square that is an obstacle. Return the number of possible unique paths.",
        examples=[
            {"input": "obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]", "output": "2", "explanation": "There is one obstacle in the middle of the 3x3 grid. 2 unique paths."},
            {"input": "obstacleGrid = [[0,1],[0,0]]", "output": "1", "explanation": "1 path around the obstacle."}
        ],
        constraints=["m == obstacleGrid.length", "n == obstacleGrid[i].length", "1 <= m, n <= 100", "obstacleGrid[i][j] is 0 or 1"],
        starter_code="""class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[[0,0,0],[0,1,0],[0,0,0]]", "expected": "2"},
            {"input": "[[0,1],[0,0]]", "expected": "1"},
            {"input": "[[1]]", "expected": "0"}
        ],
        hints=[
            "Similar to Unique Paths, but whenever `obstacleGrid[r][c] == 1`, no paths can pass through it, so `dp[r][c] = 0`.",
            "If the starting cell `(0, 0)` or ending cell has an obstacle, return 0 immediately.",
            "Iterate row by row. If `grid[i][j] == 0`, `dp[j] += dp[j-1]`; otherwise, `dp[j] = 0`."
        ],
        tags=["Dynamic Programming", "Array", "Matrix"]
    ))

    problems.append(make_problem(
        id="edit-distance",
        title="Edit Distance",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="2D DP",
        acceptance="56.2%",
        desc="Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
        examples=[
            {"input": "word1 = \"horse\", word2 = \"ros\"", "output": "3", "explanation": "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')."},
            {"input": "word1 = \"intention\", word2 = \"execution\"", "output": "5", "explanation": "intention -> inention -> enention -> exention -> exection -> execution."}
        ],
        constraints=["0 <= word1.length, word2.length <= 500", "word1 and word2 consist of lowercase English letters"],
        starter_code="""class Solution {
    public int minDistance(String word1, String word2) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "word1 = \"horse\", word2 = \"ros\"", "expected": "3"},
            {"input": "word1 = \"intention\", word2 = \"execution\"", "expected": "5"},
            {"input": "word1 = \"\", word2 = \"a\"", "expected": "1"}
        ],
        hints=[
            "Let `dp[i][j]` be the minimum operations to convert `word1[0...i-1]` to `word2[0...j-1]`.",
            "If `word1[i-1] == word2[j-1]`, no operation is needed: `dp[i][j] = dp[i-1][j-1]`.",
            "Otherwise, consider the 3 operations: insert (`dp[i][j-1]`), delete (`dp[i-1][j]`), or replace (`dp[i-1][j-1]`). Take `1 + min` of these three."
        ],
        tags=["Dynamic Programming", "String"]
    ))

    # --- 3. Knapsack Patterns (4 problems) ---
    problems.append(make_problem(
        id="partition-equal-subset-sum",
        title="Partition Equal Subset Sum",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Knapsack Patterns",
        acceptance="47.3%",
        desc="Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.",
        examples=[
            {"input": "nums = [1,5,11,5]", "output": "true", "explanation": "The array can be partitioned as [1, 5, 5] and [11]."},
            {"input": "nums = [1,2,3,5]", "output": "false", "explanation": "The array cannot be partitioned into equal sum subsets."}
        ],
        constraints=["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
        starter_code="""class Solution {
    public boolean canPartition(int[] nums) {
        // Write your solution here
        return false;
    }
}""",
        test_cases=[
            {"input": "[1,5,11,5]", "expected": "true"},
            {"input": "[1,2,3,5]", "expected": "false"},
            {"input": "[2,2,3,5]", "expected": "false"}
        ],
        hints=[
            "If the total sum of `nums` is odd, it cannot be divided into two equal integers; return false immediately.",
            "This transforms into the 0/1 Knapsack problem: can we find a subset of numbers that sum up to `target = sum / 2`?",
            "Use a 1D boolean array `dp` of size `target + 1` with `dp[0] = true`. Iterate numbers and update backwards from `target` down to `num` to ensure each item is used at most once."
        ],
        tags=["Dynamic Programming", "Array"]
    ))

    problems.append(make_problem(
        id="target-sum",
        title="Target Sum",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Knapsack Patterns",
        acceptance="46.5%",
        desc="You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers. Return the number of different expressions that you can build, which evaluates to `target`.",
        examples=[
            {"input": "nums = [1,1,1,1,1], target = 3", "output": "5", "explanation": "-1+1+1+1+1=3, +1-1+1+1+1=3, +1+1-1+1+1=3, +1+1+1-1+1=3, +1+1+1+1-1=3. 5 ways."},
            {"input": "nums = [1], target = 1", "output": "1", "explanation": "+1 = 1."}
        ],
        constraints=["1 <= nums.length <= 20", "0 <= nums[i] <= 1000", "0 <= sum(nums[i]) <= 1000", "-1000 <= target <= 1000"],
        starter_code="""class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "nums = [1,1,1,1,1], target = 3", "expected": "5"},
            {"input": "nums = [1], target = 1", "expected": "1"},
            {"input": "nums = [1,2,1], target = 0", "expected": "2"}
        ],
        hints=[
            "Divide the elements into two subsets: P (positive signs) and N (negative signs). Then `sum(P) - sum(N) = target`.",
            "Adding `sum(P) + sum(N) = totalSum` gives `2 * sum(P) = target + totalSum`, meaning `sum(P) = (target + totalSum) / 2`.",
            "If `target + totalSum` is odd or negative, return 0. The problem is now equivalent to finding the number of subsets with sum `sum(P)` (Subset Sum DP)."
        ],
        tags=["Dynamic Programming", "Array", "Backtracking"]
    ))

    problems.append(make_problem(
        id="coin-change",
        title="Coin Change",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Knapsack Patterns",
        acceptance="44.2%",
        desc="You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`. You may assume that you have an infinite number of each kind of coin.",
        examples=[
            {"input": "coins = [1,2,5], amount = 11", "output": "3", "explanation": "11 = 5 + 5 + 1"},
            {"input": "coins = [2], amount = 3", "output": "-1", "explanation": "Cannot make 3 with 2."},
            {"input": "coins = [1], amount = 0", "output": "0", "explanation": "0 coins for amount 0."}
        ],
        constraints=["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
        starter_code="""class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}""",
        test_cases=[
            {"input": "coins = [1,2,5], amount = 11", "expected": "3"},
            {"input": "coins = [2], amount = 3", "expected": "-1"},
            {"input": "coins = [1], amount = 0", "expected": "0"}
        ],
        hints=[
            "This is an unbounded knapsack problem. What is the subproblem?",
            "Let `dp[i]` be the minimum coins needed to make amount `i`.",
            "Recurrence: `dp[i] = min(dp[i], dp[i - coin] + 1)` for each coin in `coins` where `coin <= i`. Initialize `dp` with `amount + 1`."
        ],
        tags=["Dynamic Programming", "Breadth-First Search"]
    ))

    problems.append(make_problem(
        id="coin-change-ii",
        title="Coin Change II",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Knapsack Patterns",
        acceptance="63.2%",
        desc="You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return `0`. You may assume that you have an infinite number of each kind of coin.",
        examples=[
            {"input": "amount = 5, coins = [1,2,5]", "output": "4", "explanation": "Four ways: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1."},
            {"input": "amount = 3, coins = [2]", "output": "0", "explanation": "Cannot make 3 using only 2s."}
        ],
        constraints=["1 <= coins.length <= 300", "1 <= coins[i] <= 5000", "0 <= amount <= 5000"],
        starter_code="""class Solution {
    public int change(int amount, int[] coins) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "amount = 5, coins = [1,2,5]", "expected": "4"},
            {"input": "amount = 3, coins = [2]", "expected": "0"},
            {"input": "amount = 10, coins = [10]", "expected": "1"}
        ],
        hints=[
            "Distinguish between combinations and permutations: here order of coins does not matter, so `[1, 2]` is the same as `[2, 1]`.",
            "To count unique combinations without permutations, loop through the coins outer-most, and amounts inner-most.",
            "Create `dp` array of size `amount + 1` with `dp[0] = 1`. For each coin: for `x` from `coin` to `amount`: `dp[x] += dp[x - coin]`."
        ],
        tags=["Dynamic Programming", "Array"]
    ))

    # --- 4. Subsequence DP (3 problems) ---
    problems.append(make_problem(
        id="longest-increasing-subsequence",
        title="Longest Increasing Subsequence",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Subsequence DP",
        acceptance="54.8%",
        desc="Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
        examples=[
            {"input": "nums = [10,9,2,5,3,7,101,18]", "output": "4", "explanation": "The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4."},
            {"input": "nums = [0,1,0,3,2,3]", "output": "4", "explanation": "[0, 1, 2, 3] is an LIS of length 4."},
            {"input": "nums = [7,7,7,7,7,7,7]", "output": "1", "explanation": "Only single elements can form strictly increasing subsequences."}
        ],
        constraints=["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
        starter_code="""class Solution {
    public int lengthOfLIS(int[] nums) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[10,9,2,5,3,7,101,18]", "expected": "4"},
            {"input": "[0,1,0,3,2,3]", "expected": "4"},
            {"input": "[7,7,7,7,7,7,7]", "expected": "1"}
        ],
        hints=[
            "A standard O(n^2) approach uses `dp[i]` as the length of the longest increasing subsequence ending at index `i`.",
            "`dp[i] = 1 + max(dp[j])` for all `j < i` where `nums[j] < nums[i]`.",
            "An optimal O(n log n) approach maintains an array `tails` where `tails[len]` is the smallest tail of all increasing subsequences of length `len+1`, found via binary search (`Arrays.binarySearch`)."
        ],
        tags=["Dynamic Programming", "Binary Search", "Array"]
    ))

    problems.append(make_problem(
        id="longest-common-subsequence",
        title="Longest Common Subsequence",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Subsequence DP",
        acceptance="58.2%",
        desc="Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
        examples=[
            {"input": "text1 = \"abcde\", text2 = \"ace\"", "output": "3", "explanation": "The longest common subsequence is \"ace\" and its length is 3."},
            {"input": "text1 = \"abc\", text2 = \"abc\"", "output": "3", "explanation": "\"abc\" has length 3."},
            {"input": "text1 = \"abc\", text2 = \"def\"", "output": "0", "explanation": "No common subsequence."}
        ],
        constraints=["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters"],
        starter_code="""class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "text1 = \"abcde\", text2 = \"ace\"", "expected": "3"},
            {"input": "text1 = \"abc\", text2 = \"abc\"", "expected": "3"},
            {"input": "text1 = \"abc\", text2 = \"def\"", "expected": "0"}
        ],
        hints=[
            "Let `dp[i][j]` be the length of the longest common subsequence of prefixes `text1[0...i-1]` and `text2[0...j-1]`.",
            "If `text1[i-1] == text2[j-1]`, this character contributes to the LCS: `dp[i][j] = 1 + dp[i-1][j-1]`.",
            "If they do not match, the character might come from one string or the other: `dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`."
        ],
        tags=["Dynamic Programming", "String"]
    ))

    problems.append(make_problem(
        id="word-break",
        title="Word Break",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Subsequence DP",
        acceptance="46.7%",
        desc="Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.",
        examples=[
            {"input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", "output": "true", "explanation": "Return true because \"leetcode\" can be segmented as \"leet code\"."},
            {"input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", "output": "true", "explanation": "Segmented as \"apple pen apple\"."},
            {"input": "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", "output": "false", "explanation": "Cannot segment successfully."}
        ],
        constraints=["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20", "s and wordDict[i] consist of only lowercase English letters"],
        starter_code="""import java.util.List;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        return false;
    }
}""",
        test_cases=[
            {"input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", "expected": "true"},
            {"input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", "expected": "true"},
            {"input": "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", "expected": "false"}
        ],
        hints=[
            "Let `dp[i]` denote whether the prefix `s[0...i-1]` can be segmented into valid words from `wordDict`.",
            "Base case: `dp[0] = true` (empty string is always valid).",
            "For each `i` from 1 to `s.length()`, check every `j` from 0 to `i - 1`. If `dp[j] && wordDict.contains(s.substring(j, i))`, then `dp[i] = true`."
        ],
        tags=["Dynamic Programming", "Trie", "Hash Table", "String"]
    ))

    # --- 5. Grid DP (2 problems) ---
    problems.append(make_problem(
        id="minimum-path-sum",
        title="Minimum Path Sum",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Grid DP",
        acceptance="63.7%",
        desc="Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. Note: You can only move either down or right at any point in time.",
        examples=[
            {"input": "grid = [[1,3,1],[1,5,1],[4,2,1]]", "output": "7", "explanation": "Because the path 1 -> 3 -> 1 -> 1 -> 1 minimizes the sum."},
            {"input": "grid = [[1,2,3],[4,5,6]]", "output": "12", "explanation": "Path 1 -> 2 -> 3 -> 6 = 12."}
        ],
        constraints=["m == grid.length", "n == grid[i].length", "1 <= m, n <= 200", "0 <= grid[i][j] <= 200"],
        starter_code="""class Solution {
    public int minPathSum(int[][] grid) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[[1,3,1],[1,5,1],[4,2,1]]", "expected": "7"},
            {"input": "[[1,2,3],[4,5,6]]", "expected": "12"},
            {"input": "[[5]]", "expected": "5"}
        ],
        hints=[
            "To reach cell `(i, j)`, we must come from `(i - 1, j)` (above) or `(i, j - 1)` (left).",
            "Recurrence relation: `dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1])`.",
            "Initialize the first row and first column with cumulative sums, or solve in-place on `grid` to achieve O(1) extra space."
        ],
        tags=["Dynamic Programming", "Array", "Matrix"]
    ))

    problems.append(make_problem(
        id="maximal-square",
        title="Maximal Square",
        difficulty="Medium",
        topic="Dynamic Programming",
        pattern="Grid DP",
        acceptance="46.0%",
        desc="Given an `m x n` binary matrix filled with '0's and '1's, find the largest square containing only 1's and return its area.",
        examples=[
            {"input": "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", "output": "4", "explanation": "The maximum square has side length 2, area = 4."},
            {"input": "matrix = [[\"0\",\"1\"],[\"1\",\"0\"]]", "output": "1", "explanation": "Maximum square area is 1."},
            {"input": "matrix = [[\"0\"]]", "output": "0", "explanation": "No 1s, area is 0."}
        ],
        constraints=["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 300", "matrix[i][j] is '0' or '1'"],
        starter_code="""class Solution {
    public int maximalSquare(char[][] matrix) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", "expected": "4"},
            {"input": "[[\"0\",\"1\"],[\"1\",\"0\"]]", "expected": "1"},
            {"input": "[[\"0\"]]", "expected": "0"}
        ],
        hints=[
            "Let `dp[i][j]` represent the side length of the maximum square whose bottom-right corner is `(i, j)`.",
            "If `matrix[i][j] == '1'`, it forms a square bounded by its top, left, and top-left neighbors: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`.",
            "Maintain `maxSide` across all cells and return `maxSide * maxSide`."
        ],
        tags=["Dynamic Programming", "Array", "Matrix"]
    ))

    # --- 6. Memoization and Tabulation (2 problems) ---
    problems.append(make_problem(
        id="min-cost-climbing-stairs",
        title="Min Cost Climbing Stairs",
        difficulty="Easy",
        topic="Dynamic Programming",
        pattern="Memoization and Tabulation",
        acceptance="66.5%",
        desc="You are given an integer array `cost` where `cost[i]` is the cost of `i-th` step on a staircase. Once you pay the cost, you can either climb one or two steps. You can either start from the step with index 0, or the step with index 1. Return the minimum cost to reach the top of the floor.",
        examples=[
            {"input": "cost = [10,15,20]", "output": "15", "explanation": "You will start at index 1. Pay 15 and climb two steps to reach the top. Total cost is 15."},
            {"input": "cost = [1,100,1,1,1,100,1,1,100,1]", "output": "6", "explanation": "Start at index 0. Pick index 0 -> 2 -> 4 -> 6 -> 7 -> 9 -> top. Cost = 6."}
        ],
        constraints=["2 <= cost.length <= 1000", "0 <= cost[i] <= 999"],
        starter_code="""class Solution {
    public int minCostClimbingStairs(int[] cost) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[10,15,20]", "expected": "15"},
            {"input": "[1,100,1,1,1,100,1,1,100,1]", "expected": "6"},
            {"input": "[0,0,0,0]", "expected": "0"}
        ],
        hints=[
            "To reach step `i`, you could have jumped from `i - 1` or `i - 2`.",
            "Recurrence relation: `minCost[i] = cost[i] + Math.min(minCost[i - 1], minCost[i - 2])`.",
            "The top of the floor is at index `n`. Thus, the answer is `Math.min(minCost[n - 1], minCost[n - 2])` with O(1) rolling space."
        ],
        tags=["Dynamic Programming", "Array"]
    ))

    problems.append(make_problem(
        id="counting-bits",
        title="Counting Bits",
        difficulty="Easy",
        topic="Dynamic Programming",
        pattern="Memoization and Tabulation",
        acceptance="77.9%",
        desc="Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the number of 1's in the binary representation of `i`.",
        examples=[
            {"input": "n = 2", "output": "[0,1,1]", "explanation": "0 --> 0 (0 ones), 1 --> 1 (1 one), 2 --> 10 (1 one)."},
            {"input": "n = 5", "output": "[0,1,1,2,1,2]", "explanation": "0: 0, 1: 1, 2: 1, 3: 2, 4: 1, 5: 2."}
        ],
        constraints=["0 <= n <= 10^5"],
        starter_code="""class Solution {
    public int[] countBits(int n) {
        // Write your solution here
        return new int[n + 1];
    }
}""",
        test_cases=[
            {"input": "2", "expected": "[0,1,1]"},
            {"input": "5", "expected": "[0,1,1,2,1,2]"},
            {"input": "0", "expected": "[0]"}
        ],
        hints=[
            "Notice how bit patterns repeat. Dividing an integer by 2 (`i >> 1`) shifts all bits right by one.",
            "The number of set bits in `i` is the number of set bits in `i >> 1` plus the lowest bit `i & 1`.",
            "Recurrence: `ans[i] = ans[i >> 1] + (i & 1)`. Calculate in a single pass from 1 to `n` in O(n) linear time."
        ],
        tags=["Dynamic Programming", "Bit Manipulation"]
    ))

    return problems
