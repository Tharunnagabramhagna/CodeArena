# tests/frontend/utils/topics/greedy.py
"""Greedy Algorithms topic problem generator: 11 problems across 4 patterns."""

from .common import make_problem

def get_problems():
    problems = []

    # --- 1. Interval Scheduling (3 problems) ---
    problems.append(make_problem(
        id="non-overlapping-intervals",
        title="Non-overlapping Intervals",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Interval Scheduling",
        acceptance="54.2%",
        desc="Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
        examples=[
            {"input": "intervals = [[1,2],[2,3],[3,4],[1,3]]", "output": "1", "explanation": "[1,3] can be removed and the rest of the intervals are non-overlapping."},
            {"input": "intervals = [[1,2],[1,2],[1,2]]", "output": "2", "explanation": "You need to remove two [1,2] to model non-overlapping intervals."}
        ],
        constraints=["1 <= intervals.length <= 10^5", "intervals[i].length == 2", "-5 * 10^4 <= start_i < end_i <= 5 * 10^4"],
        starter_code="""class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[[1,2],[2,3],[3,4],[1,3]]", "expected": "1"},
            {"input": "[[1,2],[1,2],[1,2]]", "expected": "2"},
            {"input": "[[1,2],[2,3]]", "expected": "0"}
        ],
        hints=[
            "This problem is equivalent to finding the maximum number of mutually compatible intervals (classic Interval Scheduling).",
            "Sort intervals by their ending times in ascending order. When choosing intervals greedily, picking the one that finishes earliest leaves the most room for subsequent intervals.",
            "Maintain the end time of the last accepted interval. If the current interval starts before this end time, it overlaps and must be removed (increment counter); otherwise, update the end time."
        ],
        tags=["Greedy", "Intervals", "Sorting"]
    ))

    problems.append(make_problem(
        id="meeting-rooms-ii",
        title="Meeting Rooms II",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Interval Scheduling",
        acceptance="51.8%",
        desc="Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required to accommodate all meetings.",
        examples=[
            {"input": "intervals = [[0,30],[5,10],[15,20]]", "output": "2", "explanation": "Room 1: [0,30]; Room 2: [5,10], [15,20]."},
            {"input": "intervals = [[7,10],[2,4]]", "output": "1", "explanation": "Only one room is needed as intervals do not overlap."}
        ],
        constraints=["1 <= intervals.length <= 10^4", "0 <= start_i < end_i <= 10^6"],
        starter_code="""class Solution {
    public int minMeetingRooms(int[][] intervals) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[[0,30],[5,10],[15,20]]", "expected": "2"},
            {"input": "[[7,10],[2,4]]", "expected": "1"},
            {"input": "[[1,5],[8,9],[8,9]]", "expected": "2"}
        ],
        hints=[
            "Consider the timeline of events: each meeting start increases the required rooms by 1, and each meeting end frees up a room.",
            "You can extract and sort all start times and end times separately, or use a min-heap to keep track of end times of active meetings.",
            "Iterate through sorted start times. If the earliest ending meeting (heap top) has ended before the current start time, reuse that room (poll from heap). Otherwise, allocate a new room."
        ],
        tags=["Greedy", "Intervals", "Heap", "Sorting"]
    ))

    problems.append(make_problem(
        id="minimum-number-of-arrows-to-burst-balloons",
        title="Minimum Number of Arrows to Burst Balloons",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Interval Scheduling",
        acceptance="57.5%",
        desc="There are spherical balloons taped to a flat wall. You are given a 2D integer array `points` where `points[i] = [x_start, x_end]`. An arrow shot vertically upwards from x bursts all balloons with `x_start <= x <= x_end`. Return the minimum number of arrows that must be shot to burst all balloons.",
        examples=[
            {"input": "points = [[10,16],[2,8],[1,6],[7,12]]", "output": "2", "explanation": "Shoot arrow at x=6 (bursts [2,8] and [1,6]) and x=11 (bursts [10,16] and [7,12])."},
            {"input": "points = [[1,2],[3,4],[5,6],[7,8]]", "output": "4", "explanation": "One arrow is needed for each balloon."}
        ],
        constraints=["1 <= points.length <= 10^5", "points[i].length == 2", "-2^31 <= x_start < x_end <= 2^31 - 1"],
        starter_code="""class Solution {
    public int findMinArrowShots(int[][] points) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[[10,16],[2,8],[1,6],[7,12]]", "expected": "2"},
            {"input": "[[1,2],[3,4],[5,6],[7,8]]", "expected": "4"},
            {"input": "[[1,2],[2,3],[3,4],[4,5]]", "expected": "2"}
        ],
        hints=[
            "Every arrow should hit as many overlapping balloons as possible. Greedily shooting at the end coordinate of the balloon that ends earliest maximizes chances of hitting others.",
            "Sort balloons by their end coordinate `x_end` in ascending order. Be cautious of integer overflow during comparison (`Integer.compare`).",
            "Initialize arrows = 1 and set arrowPos = points[0][1]. Iterate through points: if points[i][0] > arrowPos, increment arrows and set arrowPos = points[i][1]."
        ],
        tags=["Greedy", "Intervals", "Sorting"]
    ))

    # --- 2. Activity Selection (3 problems) ---
    problems.append(make_problem(
        id="assign-cookies",
        title="Assign Cookies",
        difficulty="Easy",
        topic="Greedy Algorithms",
        pattern="Activity Selection",
        acceptance="53.4%",
        desc="Assume you are an awesome parent and want to give your children some cookies. Each child `i` has a greed factor `g[i]`, and each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, the child is content. Your goal is to maximize the number of your content children and output the maximum number.",
        examples=[
            {"input": "g = [1,2,3], s = [1,1]", "output": "1", "explanation": "You can only make child 1 content with cookie of size 1."},
            {"input": "g = [1,2], s = [1,2,3]", "output": "2", "explanation": "You have 3 cookies and their sizes are big enough to gratify all 2 children."}
        ],
        constraints=["1 <= g.length <= 3 * 10^4", "0 <= s.length <= 3 * 10^4", "1 <= g[i], s[j] <= 2^31 - 1"],
        starter_code="""class Solution {
    public int findContentChildren(int[] g, int[] s) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "g = [1,2,3], s = [1,1]", "expected": "1"},
            {"input": "g = [1,2], s = [1,2,3]", "expected": "2"},
            {"input": "g = [3,4], s = [1,2,5]", "expected": "1"}
        ],
        hints=[
            "To satisfy the maximum number of children, satisfy the least greedy children first using the smallest possible cookie that meets their threshold.",
            "Sort both the children's greed array `g` and the cookie sizes array `s` in ascending order.",
            "Use two pointers: childPtr and cookiePtr. If `s[cookiePtr] >= g[childPtr]`, increment childPtr. Always increment cookiePtr. Return childPtr."
        ],
        tags=["Greedy", "Two Pointers", "Sorting"]
    ))

    problems.append(make_problem(
        id="lemonade-change",
        title="Lemonade Change",
        difficulty="Easy",
        topic="Greedy Algorithms",
        pattern="Activity Selection",
        acceptance="54.8%",
        desc="At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue and order one at a time. Each customer will only buy one lemonade and pay with either a `$5`, `$10`, or `$20` bill. You must provide the correct change to each customer, starting with no change in hand. Return `true` if and only if you can provide every customer with correct change.",
        examples=[
            {"input": "bills = [5,5,5,10,20]", "output": "true", "explanation": "From the first 3 customers, we collect three $5 bills. For the 4th, we collect $10 and give $5 change. For the 5th, we give a $10 and a $5."},
            {"input": "bills = [5,5,10,10,20]", "output": "false", "explanation": "For the last customer, we can't give change of $15 because we only have two $10 bills."}
        ],
        constraints=["1 <= bills.length <= 10^5", "bills[i] is either 5, 10, or 20"],
        starter_code="""class Solution {
    public boolean lemonadeChange(int[] bills) {
        // Write your solution here
        return true;
    }
}""",
        test_cases=[
            {"input": "[5,5,5,10,20]", "expected": "true"},
            {"input": "[5,5,10,10,20]", "expected": "false"},
            {"input": "[5,5,5,5,10,5,10,10,20,20]", "expected": "false"}
        ],
        hints=[
            "Track the count of $5 and $10 bills in hand. $20 bills are never given out as change, so counting them is unnecessary.",
            "When given a $10 bill, you must return a $5 bill. If you don't have one, return false.",
            "When given a $20 bill, you need $15 in change. Greedily prioritize giving one $10 and one $5 first, because $5 bills are more versatile than $10 bills."
        ],
        tags=["Greedy", "Simulation", "Array"]
    ))

    problems.append(make_problem(
        id="gas-station",
        title="Gas Station",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Activity Selection",
        acceptance="45.6%",
        desc="There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. Traveling from station `i` to `i + 1` costs `cost[i]` of gas. Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is guaranteed to be unique.",
        examples=[
            {"input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", "output": "3", "explanation": "Start at station 3 (index 3). Tank = 4 - 1 + 5 - 2 + 1 - 3 + 2 - 4 + 3 - 5 = 0. Completed trip."},
            {"input": "gas = [2,3,4], cost = [3,4,3]", "output": "-1", "explanation": "Total gas = 9 < total cost = 10, impossible to complete a full lap."}
        ],
        constraints=["n == gas.length == cost.length", "1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
        starter_code="""class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        // Write your solution here
        return -1;
    }
}""",
        test_cases=[
            {"input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", "expected": "3"},
            {"input": "gas = [2,3,4], cost = [3,4,3]", "expected": "-1"},
            {"input": "gas = [5,1,2,3,4], cost = [4,4,1,5,1]", "expected": "4"}
        ],
        hints=[
            "If the total sum of gas is less than the total sum of cost, completing the circuit is fundamentally impossible; return -1.",
            "If you start at station A and run out of gas before station B, no station between A and B can reach B either. The next potential starting point must be B + 1.",
            "Keep track of `totalGas - totalCost` and `currentTank`. When `currentTank < 0`, reset `currentTank = 0` and set `startStation = i + 1`."
        ],
        tags=["Greedy", "Array"]
    ))

    # --- 3. Sorting-Based Greedy (3 problems) ---
    problems.append(make_problem(
        id="queue-reconstruction-by-height",
        title="Queue Reconstruction by Height",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Sorting-Based Greedy",
        acceptance="73.1%",
        desc="You are given an array of people, `people`, where `people[i] = [h_i, k_i]` represents the `i-th` person of height `h_i` with exactly `k_i` other people in front who have a height greater than or equal to `h_i`. Reconstruct and return the queue that meets these attributes.",
        examples=[
            {"input": "people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]", "output": "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]", "explanation": "Person 0 has height 5 with no taller people in front. Person 1 has height 7 with 0 taller, etc."},
            {"input": "people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]", "output": "[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]", "explanation": "Reconstructed queue matching all criteria."}
        ],
        constraints=["1 <= people.length <= 2000", "0 <= h_i <= 10^6", "0 <= k_i < people.length"],
        starter_code="""class Solution {
    public int[][] reconstructQueue(int[][] people) {
        // Write your solution here
        return new int[0][0];
    }
}""",
        test_cases=[
            {"input": "[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]", "expected": "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]"},
            {"input": "[[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]", "expected": "[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]"}
        ],
        hints=[
            "Taller people do not care about shorter people in front of them because shorter people do not affect their `k` count.",
            "Sort people primarily by height descending. For ties in height, sort by `k` ascending.",
            "Insert each person into a dynamic list at index `k`. Since all previously inserted people are taller, inserting person `p` at index `p[1]` ensures exactly `p[1]` taller people precede them."
        ],
        tags=["Greedy", "Sorting", "Array"]
    ))

    problems.append(make_problem(
        id="task-scheduler",
        title="Task Scheduler",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Sorting-Based Greedy",
        acceptance="59.3%",
        desc="Given a characters array `tasks`, representing the tasks a CPU needs to do, and an integer `n` representing the cooldown interval between two identical tasks. Return the minimum number of units of times that the CPU will take to finish all the given tasks.",
        examples=[
            {"input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2", "output": "8", "explanation": "A -> B -> idle -> A -> B -> idle -> A -> B. Total units = 8."},
            {"input": "tasks = [\"A\",\"C\",\"A\",\"B\",\"D\",\"B\"], n = 1", "output": "6", "explanation": "A -> B -> C -> D -> A -> B. No idle slots needed."}
        ],
        constraints=["1 <= tasks.length <= 10^4", "tasks[i] is uppercase English letter", "0 <= n <= 100"],
        starter_code="""class Solution {
    public int leastInterval(char[] tasks, int n) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2", "expected": "8"},
            {"input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 0", "expected": "6"},
            {"input": "tasks = [\"A\",\"A\",\"A\",\"A\",\"A\",\"A\",\"B\",\"C\",\"D\",\"E\",\"F\",\"G\"], n = 2", "expected": "16"}
        ],
        hints=[
            "The execution time is bottlenecked by the task with the maximum frequency.",
            "Let `maxFreq` be the highest count of any single task, and `maxCount` be the number of distinct tasks having that exact maximum frequency.",
            "The formula for slots bounded by idle time is `(maxFreq - 1) * (n + 1) + maxCount`. The final answer is `Math.max(tasks.length, emptySlotsFormula)`."
        ],
        tags=["Greedy", "Array", "Hash Table", "Counting"]
    ))

    problems.append(make_problem(
        id="candy",
        title="Candy",
        difficulty="Hard",
        topic="Greedy Algorithms",
        pattern="Sorting-Based Greedy",
        acceptance="43.2%",
        desc="There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`. You must give each child at least 1 candy, and children with a higher rating than their immediate neighbors must get more candies than their neighbor. Return the minimum number of candies you need to have to distribute the candies to the children.",
        examples=[
            {"input": "ratings = [1,0,2]", "output": "5", "explanation": "You can allocate 2, 1, 2 candies respectively."},
            {"input": "ratings = [1,2,2]", "output": "4", "explanation": "You can allocate 1, 2, 1 candies respectively. The third child gets 1 candy because it satisfies above conditions."}
        ],
        constraints=["n == ratings.length", "1 <= n <= 2 * 10^4", "0 <= ratings[i] <= 2 * 10^4"],
        starter_code="""class Solution {
    public int candy(int[] ratings) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[1,0,2]", "expected": "5"},
            {"input": "[1,2,2]", "expected": "4"},
            {"input": "[1,3,2,2,1]", "expected": "7"}
        ],
        hints=[
            "Each child has two neighbors: left and right. Consider decomposing the problem into two passes: left-to-right and right-to-left.",
            "Initialize an array `candies` filled with 1s. In the left-to-right pass, if `ratings[i] > ratings[i-1]`, set `candies[i] = candies[i-1] + 1`.",
            "In the right-to-left pass, if `ratings[i] > ratings[i+1]`, set `candies[i] = Math.max(candies[i], candies[i+1] + 1)`. The sum of `candies` is the optimal answer."
        ],
        tags=["Greedy", "Array"]
    ))

    # --- 4. Local Optimal Choices (2 problems) ---
    problems.append(make_problem(
        id="jump-game",
        title="Jump Game",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Local Optimal Choices",
        acceptance="38.7%",
        desc="You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
        examples=[
            {"input": "nums = [2,3,1,1,4]", "output": "true", "explanation": "Jump 1 step from index 0 to 1, then 3 steps to the last index."},
            {"input": "nums = [3,2,1,0,4]", "output": "false", "explanation": "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index."}
        ],
        constraints=["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
        starter_code="""class Solution {
    public boolean canJump(int[] nums) {
        // Write your solution here
        return false;
    }
}""",
        test_cases=[
            {"input": "[2,3,1,1,4]", "expected": "true"},
            {"input": "[3,2,1,0,4]", "expected": "false"},
            {"input": "[0]", "expected": "true"}
        ],
        hints=[
            "Think about the maximum reach you can achieve as you iterate across the array.",
            "Maintain `maxReach = 0`. At each index `i`, if `i > maxReach`, you are stranded and cannot proceed; return false.",
            "Update `maxReach = Math.max(maxReach, i + nums[i])`. If `maxReach >= nums.length - 1`, return true."
        ],
        tags=["Greedy", "Array", "Dynamic Programming"]
    ))

    problems.append(make_problem(
        id="jump-game-ii",
        title="Jump Game II",
        difficulty="Medium",
        topic="Greedy Algorithms",
        pattern="Local Optimal Choices",
        acceptance="45.1%",
        desc="You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`. Each element `nums[i]` represents the maximum length of a forward jump from index `i`. Return the minimum number of jumps to reach `nums[n - 1]`. The test cases are generated such that you can reach `nums[n - 1]`.",
        examples=[
            {"input": "nums = [2,3,1,1,4]", "output": "2", "explanation": "The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index."},
            {"input": "nums = [2,3,0,1,4]", "output": "2", "explanation": "Jump to index 1, then jump 3 steps to index 4."}
        ],
        constraints=["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000"],
        starter_code="""class Solution {
    public int jump(int[] nums) {
        // Write your solution here
        return 0;
    }
}""",
        test_cases=[
            {"input": "[2,3,1,1,4]", "expected": "2"},
            {"input": "[2,3,0,1,4]", "expected": "2"},
            {"input": "[1,2,3]", "expected": "2"}
        ],
        hints=[
            "This can be modeled as finding BFS levels on an implicit graph of reachable jump ranges.",
            "Maintain `curEnd` (the boundary of the current jump) and `farthest` (the furthest index reachable from any index in the current jump window).",
            "Iterate up to `nums.length - 2`. Update `farthest = Math.max(farthest, i + nums[i])`. When `i == curEnd`, increment jumps and set `curEnd = farthest`."
        ],
        tags=["Greedy", "Array", "Dynamic Programming"]
    ))

    return problems

