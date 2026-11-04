# tests/frontend/utils/topics/extensions.py
"""
Extension module to bring every single DSA pattern to 3-5 problems.
Provides 38 distinct, classic DSA problems with full Java specs, test cases, and progressive hints.
"""

from .common import make_prob

def get_extension_problems():
    probs = []

    # =========================================================================
    # ARRAYS
    # =========================================================================
    # 1. Traversal and basic operations -> richest-customer-wealth
    probs.append(make_prob(
        "richest-customer-wealth", "Richest Customer Wealth", "Easy", "Arrays", "Traversal and basic operations",
        "You are given an m x n integer grid accounts where accounts[i][j] is the money customer i has in bank j. Return the wealth of the richest customer.",
        "You are given an <code>m x n</code> integer grid <code>accounts</code> where <code>accounts[i][j]</code> is the amount of money the <code>i-th</code> customer has in the <code>j-th</code> bank. Return the wealth that the richest customer has. A customer's wealth is the amount of money they have in all their bank accounts.",
        "A 2D integer array accounts.", "A single integer representing the maximum wealth.",
        ["m == accounts.length", "n == accounts[i].length", "1 <= m, n <= 50", "1 <= accounts[i][j] <= 100"],
        "[[1,2,3],[3,2,1]]", "6", "Customer 1 has wealth 6, customer 2 has wealth 6.",
        "[[1,5],[7,3],[3,5]]", "10", "Customer 2 has wealth 10, which is the maximum.",
        "The problem requires iterating through each customer (each row) and finding the maximum row sum.",
        "Use a nested loop. The outer loop traverses customers, and the inner loop sums up the accounts for that customer.",
        "Maintain a maxWealth variable initialized to 0. After summing each row, update maxWealth = Math.max(maxWealth, currentSum).",
        "int maximumWealth(int[][] accounts)", "0", "88.2%", 1540
    ))

    # 2. Sliding Window -> fruit-into-baskets
    probs.append(make_prob(
        "fruit-into-baskets", "Fruit Into Baskets", "Medium", "Arrays", "Sliding Window",
        "You are visiting a farm that has a single row of fruit trees. You have two baskets, and each basket can only hold a single type of fruit.",
        "You are visiting a farm that has a single row of fruit trees arranged from left to right. You are given an integer array <code>fruits</code> where <code>fruits[i]</code> is the type of fruit the <code>i-th</code> tree produces. You have two baskets, and each basket can only hold a single type of fruit. Return the maximum number of fruits you can pick.",
        "An integer array fruits.", "An integer representing the maximum number of fruits.",
        ["1 <= fruits.length <= 10^5", "0 <= fruits[i] < fruits.length"],
        "[1,2,1]", "3", "We can pick from all 3 trees since there are only 2 distinct types [1, 2].",
        "[0,1,2,2]", "3", "We can pick from [1,2,2]. If we started at 0, we'd stop at 2.",
        "This is equivalent to finding the length of the longest contiguous subarray that contains at most 2 distinct integers.",
        "Use a sliding window with a HashMap tracking the frequency of each fruit type in the current window.",
        "Expand right pointer adding fruits[right]. While map.size() > 2, shrink left pointer decrementing frequency and removing types with count 0. Update maxFruits = Math.max(maxFruits, right - left + 1).",
        "int totalFruit(int[] fruits)", "0", "44.6%", 1350
    ))

    # 3. Prefix Sum -> contiguous-array
    probs.append(make_prob(
        "contiguous-array", "Contiguous Array", "Medium", "Arrays", "Prefix Sum",
        "Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.",
        "Given a binary array <code>nums</code>, return the maximum length of a contiguous subarray with an equal number of <code>0</code> and <code>1</code>.",
        "A binary array nums containing only 0s and 1s.", "An integer representing the maximum length.",
        ["1 <= nums.length <= 10^5", "nums[i] is either 0 or 1"],
        "[0,1]", "2", "[0, 1] is the longest contiguous subarray with an equal number of 0 and 1.",
        "[0,1,0]", "2", "[0, 1] (or [1, 0]) is a longest contiguous subarray with equal number.",
        "Transform the array: treat 0 as -1 and 1 as +1. The problem then becomes finding the longest subarray with sum 0.",
        "Use prefix sum with a Hash Map storing the first occurrence index of each prefix sum.",
        "Initialize map with {0: -1}. If the current prefix sum has been seen before at index prevIndex, the subarray from prevIndex + 1 to i sums to 0. Length is i - prevIndex.",
        "int findMaxLength(int[] nums)", "0", "47.5%", 1150
    ))

    # 4. Kadane's Algorithm -> maximum-product-subarray
    probs.append(make_prob(
        "maximum-product-subarray", "Maximum Product Subarray", "Medium", "Arrays", "Kadane's Algorithm",
        "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
        "Given an integer array <code>nums</code>, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer.",
        "An integer array nums.", "A 32-bit signed integer representing the maximum product.",
        ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10"],
        "[2,3,-2,4]", "6", "[2,3] has the largest product 6.",
        "[-2,0,-1]", "0", "The result cannot be 2, because [-2,-1] is not a contiguous subarray.",
        "Unlike addition, multiplying two negative numbers yields a positive number. A negative current value can flip the minimum product into a maximum.",
        "At each index, track both the maximum product and the minimum product ending at that position.",
        "If nums[i] < 0, swap maxProd and minProd. Then update maxProd = Math.max(nums[i], maxProd * nums[i]) and minProd = Math.min(nums[i], minProd * nums[i]). Accumulate global max.",
        "int maxProduct(int[] nums)", "0", "34.9%", 1620
    ))

    # 5. Frequency Counting -> majority-element-ii
    probs.append(make_prob(
        "majority-element-ii", "Majority Element II", "Medium", "Arrays", "Frequency Counting",
        "Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times.",
        "Given an integer array of size <code>n</code>, find all elements that appear more than <code>⌊ n/3 ⌋</code> times. Solve in linear time and O(1) space.",
        "An integer array nums.", "A list of integers that appear more than n/3 times.",
        ["1 <= nums.length <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
        "[3,2,3]", "[3]", "3 appears 2 times, which is more than 3/3 = 1.",
        "[1]", "[1]", "1 appears once, which is more than 1/3 = 0.",
        "Notice that there can be at most 2 elements that appear strictly more than n / 3 times.",
        "Use Boyer-Moore Voting Algorithm extended to two candidates (cand1, cand2) with two counters (count1, count2).",
        "First pass finds the two most frequent candidates. Second pass verifies whether their actual counts strictly exceed n / 3.",
        "java.util.List<Integer> majorityElement(int[] nums)", "new java.util.ArrayList<>()", "47.1%", 1420
    ))

    # 6. Sorting and Searching -> merge-intervals
    probs.append(make_prob(
        "merge-intervals", "Merge Intervals", "Medium", "Arrays", "Sorting and Searching",
        "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.",
        "Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        "A 2D integer array intervals.", "A 2D integer array of merged intervals.",
        ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i <= end_i <= 10^4"],
        "[[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]", "Since [1,3] and [2,6] overlap, merge them into [1,6].",
        "[[1,4],[4,5]]", "[[1,5]]", "Intervals [1,4] and [4,5] are considered overlapping.",
        "Sorting the intervals by their start times ensures overlapping intervals are placed next to each other.",
        "Sort intervals using Arrays.sort with a comparator comparing interval[0].",
        "Iterate through sorted intervals: if current interval overlaps with the last added interval (current.start <= last.end), merge by updating last.end = Math.max(last.end, current.end). Otherwise, append current.",
        "int[][] merge(int[][] intervals)", "new int[0][0]", "47.2%", 1980
    ))

    # =========================================================================
    # STRINGS
    # =========================================================================
    # 7. String Traversal -> jewels-and-stones
    probs.append(make_prob(
        "jewels-and-stones", "Jewels and Stones", "Easy", "Strings", "String Traversal",
        "You're given strings jewels representing the types of stones that are jewels, and stones representing the stones you have. Find how many stones are jewels.",
        "You're given strings <code>jewels</code> representing the types of stones that are jewels, and <code>stones</code> representing the stones you have. Each character in <code>stones</code> is a type of stone you have. You want to know how many of the stones you have are also jewels. Letters are case sensitive.",
        "Two strings jewels and stones.", "An integer count of jewels in stones.",
        ["1 <= jewels.length, stones.length <= 50", "jewels and stones consist of only English letters.", "All the characters of jewels are unique."],
        "jewels = \"aA\", stones = \"aAAbbbb\"", "3", "The jewels are 'a' and 'A'. stones contains one 'a' and two 'A's. Total 3.",
        "jewels = \"z\", stones = \"ZZ\"", "0", "Case-sensitive, no 'z' present in stones.",
        "We need to test membership of each stone character in the set of jewel characters.",
        "Use a boolean array boolean[128] or a HashSet<Character> to store jewel characters in O(1) lookup.",
        "Traverse stones: for each character c in stones, if isJewel[c] is true, increment the counter. Return count.",
        "int numJewelsInStones(String jewels, String stones)", "0", "88.5%", 2400
    ))

    # 8. String Manipulation -> reverse-words-in-a-string
    probs.append(make_prob(
        "reverse-words-in-a-string", "Reverse Words in a String", "Medium", "Strings", "String Manipulation",
        "Given an input string s, reverse the order of the words.",
        "Given an input string <code>s</code>, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in <code>s</code> will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space, with no leading or trailing spaces.",
        "A string s consisting of English letters, digits, and spaces.", "A formatted string with words in reverse order.",
        ["1 <= s.length <= 10^4", "s contains English letters, digits, and spaces ' '.", "There is at least one word in s."],
        "\"the sky is blue\"", "\"blue is sky the\"", "Words reversed in sequence.",
        "\"  hello world  \"", "\"world hello\"", "Redundant spaces reduced to single spaces.",
        "Split words or iterate backwards from the end of the string to prepend words.",
        "Using StringBuilder: trim leading/trailing spaces, parse words by reading contiguous non-space substrings.",
        "Iterate from right to left: find the end of a word, find its beginning, extract word, append to StringBuilder followed by a space. Return sb.toString().trim().",
        "String reverseWords(String s)", "\"\"", "38.7%", 1850
    ))

    # 9. String Matching -> repeated-substring-pattern
    probs.append(make_prob(
        "repeated-substring-pattern", "Repeated Substring Pattern", "Easy", "Strings", "String Matching",
        "Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.",
        "Given a string <code>s</code>, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.",
        "A string s consisting of lowercase English letters.", "true if s can be constructed by repeating a substring, false otherwise.",
        ["1 <= s.length <= 10^4", "s consists of lowercase English letters."],
        "\"abab\"", "true", "It is the substring 'ab' twice.",
        "\"aba\"", "false", "Cannot be formed by repeating a substring.",
        "Consider concatenating s with itself: (s + s). If s has a repeating period, removing the first and last characters of (s + s) will still contain s.",
        "Or check potential pattern lengths L from 1 up to s.length() / 2 where s.length() % L == 0.",
        "Elegant one-liner: String doubled = (s + s).substring(1, 2 * s.length() - 1); return doubled.contains(s);",
        "boolean repeatedSubstringPattern(String s)", "false", "46.2%", 1120
    ))

    # =========================================================================
    # HASHING
    # =========================================================================
    # 10. HashSet -> intersection-of-two-arrays
    probs.append(make_prob(
        "intersection-of-two-arrays", "Intersection of Two Arrays", "Easy", "Hashing", "HashSet",
        "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.",
        "Given two integer arrays <code>nums1</code> and <code>nums2</code>, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
        "Two integer arrays nums1 and nums2.", "An integer array containing unique intersecting elements.",
        ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 1000"],
        "nums1 = [1,2,2,1], nums2 = [2,2]", "[2]", "2 is the only common unique element.",
        "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", "[4,9]", "4 and 9 are the common elements.",
        "A HashSet provides O(1) average lookup and automatically enforces uniqueness.",
        "Add all elements of nums1 into a set1. Then iterate through nums2 and check set1.contains(x).",
        "Store matches in a resultSet to avoid duplicates. Convert resultSet to int[] and return.",
        "int[] intersection(int[] nums1, int[] nums2)", "new int[0]", "73.4%", 1560
    ))

    # 11. Duplicate Detection -> single-number
    probs.append(make_prob(
        "single-number", "Single Number", "Easy", "Hashing", "Duplicate Detection",
        "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
        "Given a non-empty array of integers <code>nums</code>, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
        "An integer array nums.", "The unique single integer.",
        ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element appears twice except for one element which appears once."],
        "[2,2,1]", "1", "1 appears once.",
        "[4,1,2,1,2]", "4", "4 appears once.",
        "While a HashSet can detect duplicates by tracking seen elements, XOR bitwise operation achieves O(1) space.",
        "Properties of XOR: a ^ a = 0 and a ^ 0 = a. XOR is commutative and associative.",
        "XOR all numbers in the array into an accumulator initialized to 0. All pairs cancel out to 0, leaving only the unique element.",
        "int singleNumber(int[] nums)", "0", "72.8%", 2800
    ))

    # 12. Pair and Complement Lookup -> subarray-sums-divisible-by-k
    probs.append(make_prob(
        "subarray-sums-divisible-by-k", "Subarray Sums Divisible by K", "Medium", "Hashing", "Pair and Complement Lookup",
        "Given an integer array nums and an integer k, return the number of non-empty subarrays that have a sum divisible by k.",
        "Given an integer array <code>nums</code> and an integer <code>k</code>, return the number of non-empty subarrays that have a sum divisible by <code>k</code>. A subarray is a contiguous part of an array.",
        "An integer array nums and an integer k.", "An integer representing the count of valid subarrays.",
        ["1 <= nums.length <= 3 * 10^4", "-10^4 <= nums[i] <= 10^4", "2 <= k <= 10^4"],
        "nums = [4,5,0,-2,-3,1], k = 5", "7", "There are 7 subarrays with sum divisible by 5.",
        "nums = [5], k = 9", "0", "No subarray sum is divisible by 9.",
        "If two prefix sums have the same remainder when divided by k, the subarray between them is divisible by k.",
        "Use a hash map or an array of size k to count remainder frequencies.",
        "Compute running remainder: (prefixSum % k + k) % k (handling negative modulo in Java). Add current remainder's frequency to count, then increment frequency.",
        "int subarraysDivByK(int[] nums, int k)", "0", "54.1%", 1190
    ))

    # 13. Frequency Maps -> custom-sort-string
    probs.append(make_prob(
        "custom-sort-string", "Custom Sort String", "Medium", "Hashing", "Frequency Maps",
        "You are given two strings order and s. Permute the characters of s so that they match the order that order was sorted.",
        "You are given two strings <code>order</code> and <code>s</code>. All the characters of order are unique and were sorted in some custom order previously. Permute the characters of <code>s</code> so that they match the order that <code>order</code> was sorted. More specifically, if a character x occurs before a character y in order, then x should occur before y in the permuted string.",
        "Two strings order and s.", "A permuted string.",
        ["1 <= order.length <= 26", "1 <= s.length <= 200", "order and s consist of lowercase English letters.", "All characters of order are unique."],
        "order = \"cba\", s = \"abcd\"", "\"cbad\"", "'c', 'b', and 'a' appear in order specified by order. 'd' is appended.",
        "order = \"bcafg\", s = \"abcd\"", "\"bcad\"", "Matching characters appear first in specified order.",
        "Count the frequency of each character in s, then reconstruct the string following the sequence in order.",
        "Use an int[26] frequency array to count all characters in s.",
        "Iterate through order: for each character c, append it to a StringBuilder count[c - 'a'] times, and reset count[c - 'a'] = 0. Finally, append any remaining characters from the frequency array.",
        "String customSortString(String order, String s)", "\"\"", "70.2%", 1150
    ))

    # =========================================================================
    # LINKED LISTS
    # =========================================================================
    # 14. Cycle Detection -> circular-array-loop
    probs.append(make_prob(
        "circular-array-loop", "Circular Array Loop", "Medium", "Linked Lists", "Cycle Detection",
        "An array of non-zero integers nums represents a circular sequence. Determine if there is a loop in nums.",
        "An array of non-zero integers <code>nums</code> represents a circular sequence. Movement from index i jumps by nums[i] steps (modulo n). Determine if there is a cycle where every jump moves in the SAME direction (all positive or all negative) and the cycle length is strictly greater than 1.",
        "An integer array nums.", "true if there is a valid unidirectional cycle, false otherwise.",
        ["1 <= nums.length <= 5000", "-1000 <= nums[i] <= 1000", "nums[i] != 0"],
        "[2,-1,1,2,2]", "true", "Loop 0 -> 2 -> 3 -> 0 has length 3 and moves purely forward.",
        "[-1,2]", "false", "Moves forward then backward, invalid direction change.",
        "This is an implicit linked list cycle detection problem. Each index points to nextIndex = ((i + nums[i]) % n + n) % n.",
        "Use Floyd's Cycle-Finding Algorithm (slow and fast pointers).",
        "For each starting index: verify that direction does not flip (nums[slow] * nums[next] > 0). If slow == next, cycle length is 1 (self-loop), which is invalid.",
        "boolean circularArrayLoop(int[] nums)", "false", "33.4%", 960
    ))

    # 15. Merging Lists -> partition-list
    probs.append(make_prob(
        "partition-list", "Partition List", "Medium", "Linked Lists", "Merging Lists",
        "Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.",
        "Given the head of a linked list and a value <code>x</code>, partition it such that all nodes less than <code>x</code> come before nodes greater than or equal to <code>x</code>. You should preserve the original relative order of the nodes in each of the two partitions.",
        "The head of a ListNode and an integer x.", "The head of the partitioned linked list.",
        ["The number of nodes in the list is in the range [0, 200].", "-100 <= Node.val <= 100", "-200 <= x <= 200"],
        "head = [1,4,3,2,5,2], x = 3", "[1,2,2,4,3,5]", "Nodes < 3 come first, followed by nodes >= 3, preserving relative order.",
        "head = [2,1], x = 2", "[1,2]", "1 comes before 2.",
        "Decompose the list into two separate linked lists: one for nodes < x and one for nodes >= x.",
        "Use two dummy nodes: beforeHead and afterHead, with pointers before and after.",
        "Iterate through original list, appending nodes to before or after. Crucially, set after.next = null to avoid cycles, then connect before.next = afterHead.next.",
        "ListNode partition(ListNode head, int x)", "null", "56.2%", 1340
    ))

    # 16. Node Manipulation -> copy-list-with-random-pointer
    probs.append(make_prob(
        "copy-list-with-random-pointer", "Copy List with Random Pointer", "Medium", "Linked Lists", "Node Manipulation",
        "A linked list of length n is given such that each node contains an additional random pointer. Construct a deep copy of the list.",
        "Construct a deep copy of a linked list where each node has a <code>next</code> pointer and a <code>random</code> pointer pointing to any node in the list, or <code>null</code>.",
        "The head of a Node with next and random references.", "The head of the cloned list.",
        ["0 <= n <= 1000", "-10^4 <= Node.val <= 10^4", "Node.random is null or is pointing to some node in the linked list."],
        "[[7,null],[13,0],[11,4],[10,2],[1,0]]", "[[7,null],[13,0],[11,4],[10,2],[1,0]]", "Deep copy with identical values and pointers.",
        "[[1,1],[2,1]]", "[[1,1],[2,1]]", "Random points to self or other nodes.",
        "Map original nodes to new nodes, or weave copied nodes directly beside original nodes.",
        "A HashMap<Node, Node> maps each original node to its clone. Pass 1 creates copies, Pass 2 sets next and random.",
        "For O(1) space: weave clones as cur.next = new Node(cur.val); set cur.next.random = cur.random != null ? cur.random.next : null; then unweave lists.",
        "Node copyRandomList(Node head)", "null", "55.8%", 1750
    ))

    # =========================================================================
    # STACKS AND QUEUES
    # =========================================================================
    # 17. Queue Simulation -> implement-stack-using-queues
    probs.append(make_prob(
        "implement-stack-using-queues", "Implement Stack using Queues", "Easy", "Stacks and Queues", "Queue Simulation",
        "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support push, top, pop, and empty.",
        "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (<code>push</code>, <code>top</code>, <code>pop</code>, and <code>empty</code>).",
        "Sequence of stack operations.", "Return values corresponding to top, pop, and empty operations.",
        ["1 <= x <= 9", "At most 100 calls will be made to push, pop, top, and empty.", "All the calls to pop and top are valid."],
        "[\"MyStack\", \"push\", \"push\", \"top\", \"pop\", \"empty\"]", "[null, null, null, 2, 2, false]", "Demonstrates LIFO behavior using FIFO primitives.",
        "[\"MyStack\", \"push\", \"pop\", \"empty\"]", "[null, 1, 1, true]", "Basic push and pop.",
        "In a queue, the newest element is at the back. To make it behave like a stack, the newest element must be moved to the front.",
        "You can use a single java.util.Queue (LinkedList or ArrayDeque).",
        "When push(x) is called: enqueue x. Then rotate the queue by taking queue.poll() and re-offering it size - 1 times. This puts x at the head of the queue!",
        "void push(int x)", "// in-place queue simulation", "61.2%", 1850
    ))

    # 18. Next Greater Element -> final-prices-with-a-special-discount
    probs.append(make_prob(
        "final-prices-with-a-special-discount", "Final Prices With a Special Discount", "Easy", "Stacks and Queues", "Next Greater Element",
        "Given an integer array prices, apply a special discount from the next smaller or equal item.",
        "You are given an integer array <code>prices</code> where <code>prices[i]</code> is the price of the <code>i-th</code> item in a shop. There is a special discount: you will receive a discount equivalent to <code>prices[j]</code> where <code>j</code> is the minimum index such that <code>j > i</code> and <code>prices[j] <= prices[i]</code>. Return an integer array of the final prices.",
        "An integer array prices.", "An integer array of final prices after discount.",
        ["1 <= prices.length <= 500", "1 <= prices[i] <= 1000"],
        "[8,4,6,2,3]", "[4,2,4,2,3]", "8 - 4 = 4; 4 - 2 = 2; 6 - 2 = 4; 2 has no discount = 2; 3 has no discount = 3.",
        "[1,2,3,4,5]", "[1,2,3,4,5]", "No item receives a discount.",
        "This is the Next Smaller or Equal Element problem.",
        "Use a monotonic stack storing indices of items waiting for a discount.",
        "Traverse prices with index i: while stack is not empty and prices[stack.peek()] >= prices[i], idx = stack.pop(); prices[idx] -= prices[i]. Then push i. Return prices.",
        "int[] finalPrices(int[] prices)", "new int[0]", "76.4%", 1250
    ))

    # 19. Deque Applications -> shortest-subarray-with-sum-at-least-k
    probs.append(make_prob(
        "shortest-subarray-with-sum-at-least-k", "Shortest Subarray with Sum at Least K", "Hard", "Stacks and Queues", "Deque Applications",
        "Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k.",
        "Given an integer array <code>nums</code> and an integer <code>k</code>, return the length of the shortest non-empty subarray of <code>nums</code> with a sum of at least <code>k</code>. If there is no such subarray, return <code>-1</code>.",
        "An integer array nums and an integer k.", "An integer length or -1.",
        ["1 <= nums.length <= 10^5", "-10^5 <= nums[i] <= 10^5", "1 <= k <= 10^9"],
        "nums = [1], k = 1", "1", "Subarray [1] has sum 1 >= 1.",
        "nums = [1,2], k = 4", "-1", "No subarray has sum >= 4.",
        "Because nums contains negative values, standard two-pointer sliding window does NOT work monotonically. Prefix sum is required: P[j] - P[i] >= k.",
        "Use a Monotonic Deque storing prefix sum indices.",
        "1. While deque not empty and P[i] - P[deque.peekFirst()] >= k: update minLen = Math.min(minLen, i - deque.pollFirst()). 2. While deque not empty and P[i] <= P[deque.peekLast()]: deque.pollLast(). 3. deque.addLast(i).",
        "int shortestSubarray(int[] nums, int k)", "-1", "26.3%", 950
    ))

    # =========================================================================
    # BINARY SEARCH
    # =========================================================================
    # 20. Basic Binary Search -> first-bad-version
    probs.append(make_prob(
        "first-bad-version", "First Bad Version", "Easy", "Binary Search", "Basic Binary Search",
        "You are a product manager and currently leading a team to develop a new product. Find the first bad version using the isBadVersion API.",
        "You have <code>n</code> versions <code>[1, 2, ..., n]</code> and you want to find out the first bad one, which causes all the following ones to be bad. You are given an API <code>bool isBadVersion(version)</code> which returns whether version is bad. Implement a function to find the first bad version with the fewest API calls.",
        "An integer n.", "The version number of the first bad version.",
        ["1 <= k <= n <= 2^31 - 1"],
        "n = 5, bad = 4", "4", "call isBadVersion(3) -> false, isBadVersion(5) -> true, isBadVersion(4) -> true. First bad is 4.",
        "n = 1, bad = 1", "1", "First bad is 1.",
        "Since versions are ordered [good, good, ..., good, bad, bad, ..., bad], this is a monotonic boolean search space.",
        "Use binary search. Calculate mid = left + (right - left) / 2 to prevent integer overflow.",
        "If isBadVersion(mid) is true, the first bad version is at mid or to the left (right = mid). Otherwise, it is strictly to the right (left = mid + 1). Return left when left == right.",
        "int firstBadVersion(int n)", "0", "44.2%", 2600
    ))

    # 21. Lower and Upper Bound -> find-peak-element
    probs.append(make_prob(
        "find-peak-element", "Find Peak Element", "Medium", "Binary Search", "Lower and Upper Bound",
        "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element.",
        "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array <code>nums</code>, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. You must write an algorithm that runs in O(log n) time.",
        "An integer array nums.", "The index of any peak element.",
        ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i + 1] for all valid i."],
        "[1,2,3,1]", "2", "3 is a peak element and your function should return the index number 2.",
        "[1,2,1,3,5,6,4]", "5", "Index 1 (value 2) or index 5 (value 6) are valid peaks.",
        "If an element nums[mid] < nums[mid + 1], an increasing slope guarantees that at least one peak exists to the right.",
        "Binary search: set left = 0, right = nums.length - 1.",
        "If nums[mid] > nums[mid + 1], we are on a descending slope (or at a peak); search left: right = mid. Otherwise search right: left = mid + 1. Return left.",
        "int findPeakElement(int[] nums)", "0", "46.1%", 1720
    ))

    # 22. Search in Rotated Arrays -> search-in-rotated-sorted-array-ii
    probs.append(make_prob(
        "search-in-rotated-sorted-array-ii", "Search in Rotated Sorted Array II", "Medium", "Binary Search", "Search in Rotated Arrays",
        "Given the array nums after being rotated at an unknown pivot and an integer target, return true if target is in nums, or false if not.",
        "There is an integer array <code>nums</code> sorted in non-decreasing order (not necessarily with distinct values). Given the array <code>nums</code> after being rotated and an integer <code>target</code>, return <code>true</code> if <code>target</code> is in <code>nums</code>, or <code>false</code> if it is not in <code>nums</code>.",
        "An integer array nums with duplicates and an integer target.", "A boolean true or false.",
        ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "-10^4 <= target <= 10^4"],
        "nums = [2,5,6,0,0,1,2], target = 0", "true", "0 is present in the rotated array.",
        "nums = [2,5,6,0,0,1,2], target = 3", "false", "3 is not present.",
        "Duplicates create ambiguity when nums[left] == nums[mid] == nums[right], making it impossible to determine which half is sorted.",
        "When nums[left] == nums[mid] == nums[right], simply shrink the search window: left++ and right--.",
        "Otherwise, determine whether the left half or right half is normally sorted, check if target falls inside that sorted range, and adjust bounds accordingly.",
        "boolean search(int[] nums, int target)", "false", "37.5%", 1080
    ))

    # =========================================================================
    # RECURSION AND BACKTRACKING
    # =========================================================================
    # 23. Basic Recursion -> power-of-four
    probs.append(make_prob(
        "power-of-four", "Power of Four", "Easy", "Recursion and Backtracking", "Basic Recursion",
        "Given an integer n, return true if it is a power of four. Otherwise, return false.",
        "Given an integer <code>n</code>, return <code>true</code> if it is a power of four. Otherwise, return <code>false</code>. An integer n is a power of four if there exists an integer x such that n == 4^x.",
        "An integer n.", "true if n is a power of four, false otherwise.",
        ["-2^31 <= n <= 2^31 - 1"],
        "16", "true", "16 = 4^2.",
        "5", "false", "5 is not a power of four.",
        "Base cases: n <= 0 is false, n == 1 is true.",
        "If n % 4 != 0, it cannot be a power of four.",
        "Recursion: return isPowerOfFour(n / 4). Alternatively, check (n > 0) && ((n & (n - 1)) == 0) && ((n & 0x55555555) != 0).",
        "boolean isPowerOfFour(int n)", "false", "48.2%", 1320
    ))

    # 24. Subsets -> letter-case-permutation
    probs.append(make_prob(
        "letter-case-permutation", "Letter Case Permutation", "Medium", "Recursion and Backtracking", "Subsets",
        "Given a string s, you can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings.",
        "Given a string <code>s</code>, you can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings we could create. Return the output in any order.",
        "A string s consisting of English letters and digits.", "A list of all generated strings.",
        ["1 <= s.length <= 12", "s consists of lowercase English letters, uppercase English letters, and digits."],
        "\"a1b2\"", "[\"a1b2\",\"a1B2\",\"A1b2\",\"A1B2\"]", "All 4 combinations of letter cases.",
        "\"3z4\"", "[\"3z4\",\"3Z4\"]", "Digits remain unchanged.",
        "At each character, if it is a digit, you have 1 choice. If it is a letter, you have 2 branching choices: lowercase or uppercase.",
        "Use backtracking or BFS to build strings index by index.",
        "Base case: index == s.length(), add current char[] converted to String to results. If Character.isLetter, branch with Character.toLowerCase and Character.toUpperCase.",
        "java.util.List<String> letterCasePermutation(String s)", "new java.util.ArrayList<>()", "74.2%", 1250
    ))

    # 25. Permutations -> next-permutation
    probs.append(make_prob(
        "next-permutation", "Next Permutation", "Medium", "Recursion and Backtracking", "Permutations",
        "A permutation of an array of integers is an arrangement of its members into a sequence. Find the next lexicographically greater permutation.",
        "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. The next permutation of an array of integers is the next lexicographically greater permutation of its integer. If no greater permutation is possible, rearrange as the lowest possible order (sorted in ascending order). Must be solved in-place.",
        "An integer array nums.", "None (modifies nums in-place).",
        ["1 <= nums.length <= 100", "0 <= nums[i] <= 100"],
        "[1,2,3]", "[1,3,2]", "The next lexicographical permutation is [1,3,2].",
        "[3,2,1]", "[1,2,3]", "Highest permutation wraps around to lowest sorted order.",
        "Find the first decreasing element from the right: nums[i] < nums[i + 1].",
        "From the right, find the smallest element nums[j] that is strictly greater than nums[i].",
        "Swap nums[i] and nums[j]. Reverse the entire suffix from i + 1 to the end of the array to make it the smallest possible lexicographical tail.",
        "void nextPermutation(int[] nums)", "// in-place", "39.5%", 2100
    ))

    # 26. Combination Generation -> combination-sum-ii
    probs.append(make_prob(
        "combination-sum-ii", "Combination Sum II", "Medium", "Recursion and Backtracking", "Combination Generation",
        "Given a collection of candidate numbers and a target number, find all unique combinations in candidates where the candidate numbers sum to target.",
        "Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code> where the candidate numbers sum to <code>target</code>. Each number in candidates may only be used once in the combination. The solution set must not contain duplicate combinations.",
        "An integer array candidates and an integer target.", "A list of lists containing unique combinations.",
        ["1 <= candidates.length <= 100", "1 <= candidates[i] <= 50", "1 <= target <= 30"],
        "candidates = [10,1,2,7,6,1,5], target = 8", "[[1,1,6],[1,2,5],[1,7],[2,6]]", "Duplicate combinations are excluded.",
        "candidates = [2,5,2,1,2], target = 5", "[[1,2,2],[5]]", "Each candidate number is used at most once per branch.",
        "Sort the candidates first so that duplicates are adjacent and we can prune duplicate branches.",
        "Backtracking: pass remaining target and start index. Advance index to i + 1 since each element is used at most once.",
        "Skip duplicates at the same decision level: if (i > start && candidates[i] == candidates[i - 1]) continue. If target < candidates[i], break early.",
        "java.util.List<java.util.List<Integer>> combinationSum2(int[] candidates, int target)", "new java.util.ArrayList<>()", "54.6%", 1600
    ))

    # =========================================================================
    # TREES
    # =========================================================================
    # 27. Lowest Common Ancestor -> lowest-common-ancestor-of-deepest-leaves
    probs.append(make_prob(
        "lowest-common-ancestor-of-deepest-leaves", "Lowest Common Ancestor of Deepest Leaves", "Medium", "Trees", "Lowest Common Ancestor",
        "Given the root of a binary tree, return the lowest common ancestor of its deepest leaves.",
        "Given the root of a binary tree, return the lowest common ancestor of its deepest leaves. A leaf is called deepest if it has the largest depth possible among any leaf in the entire tree.",
        "The root of a TreeNode.", "The TreeNode that is the lowest common ancestor of deepest leaves.",
        ["The number of nodes in the tree will be in the range [1, 1000].", "0 <= Node.val <= 1000"],
        "[3,5,1,6,2,0,8,null,null,7,4]", "[2,7,4]", "7 and 4 are the deepest leaves, their LCA is node 2.",
        "[1]", "[1]", "The root is the only leaf, so it is its own LCA.",
        "Notice that if the left and right subtrees of a node have equal maximum depth, that node is the LCA of the deepest leaves in its subtree.",
        "Perform a post-order traversal returning both the subtree depth and the LCA node candidate (Pair<TreeNode, Integer>).",
        "If leftDepth == rightDepth, return (node, leftDepth + 1). If leftDepth > rightDepth, return (leftLCA, leftDepth + 1). Otherwise return (rightLCA, rightDepth + 1).",
        "TreeNode lcaDeepestLeaves(TreeNode root)", "null", "72.4%", 980
    ))

    # =========================================================================
    # HEAPS AND PRIORITY QUEUES
    # =========================================================================
    # 28. Top K Elements -> k-closest-points-to-origin
    probs.append(make_prob(
        "k-closest-points-to-origin", "K Closest Points to Origin", "Medium", "Heaps and Priority Queues", "Top K Elements",
        "Given an array of points where points[i] = [x_i, y_i] and an integer k, return the k closest points to the origin (0, 0).",
        "Given an array of <code>points</code> where <code>points[i] = [x_i, y_i]</code> represents a point on the X-Y plane and an integer <code>k</code>, return the <code>k</code> closest points to the origin <code>(0, 0)</code>. Distance is calculated via Euclidean distance: x^2 + y^2.",
        "A 2D integer array points and an integer k.", "A 2D integer array of the k closest points.",
        ["1 <= k <= points.length <= 10^4", "-10^4 <= x_i, y_i <= 10^4"],
        "points = [[1,3],[-2,2]], k = 1", "[[-2,2]]", "(-2,2) has distance sqrt(8) while (1,3) has distance sqrt(10).",
        "points = [[3,3],[5,-1],[-2,4]], k = 2", "[[3,3],[-2,4]]", "Both have smaller squared distances than [5,-1].",
        "We want to retain the k smallest distances. A Max-Heap of size k is the standard pattern.",
        "Compute squared distance dist = p[0]*p[0] + p[1]*p[1] (no need for Math.sqrt).",
        "Maintain a PriorityQueue sorted descending by distance. For each point, add it; if heap size > k, poll() the furthest point. At the end, dump heap contents.",
        "int[][] kClosest(int[][] points, int k)", "new int[0][0]", "66.5%", 1650
    ))

    # 29. Kth Largest/Smallest -> kth-smallest-element-in-a-bst
    probs.append(make_prob(
        "kth-smallest-element-in-a-bst", "Kth Smallest Value in a BST", "Medium", "Heaps and Priority Queues", "Kth Largest/Smallest",
        "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
        "Given the root of a binary search tree, and an integer <code>k</code>, return the <code>k-th</code> smallest value (1-indexed) of all the values of the nodes in the tree.",
        "The root of a TreeNode and an integer k.", "An integer representing the kth smallest value.",
        ["The number of nodes in the tree is n.", "1 <= k <= n <= 10^4", "0 <= Node.val <= 10^4"],
        "root = [3,1,4,null,2], k = 1", "1", "1 is the smallest element.",
        "root = [5,3,6,2,4,null,null,1], k = 3", "3", "The elements in sorted order are [1, 2, 3, 4, 5, 6]. 3rd is 3.",
        "An inorder traversal of a Binary Search Tree produces elements in strictly ascending sorted order.",
        "You can use an iterative stack or recursive traversal, decrementing k on visiting each node.",
        "When k reaches 0, the current node's value is the kth smallest. Stop traversal immediately and return it.",
        "int kthSmallest(TreeNode root, int k)", "0", "71.9%", 2100
    ))

    # 30. Two Heaps -> ipo-project-selection
    probs.append(make_prob(
        "ipo-project-selection", "IPO Project Capital Selection", "Hard", "Heaps and Priority Queues", "Two Heaps",
        "Given n projects with profits and capitals, pick at most k distinct projects to maximize your final capital.",
        "Suppose LeetCode will start its IPO soon. To generate capital, you are given <code>k</code> projects. You are given <code>n</code> projects where the <code>i-th</code> project has a pure profit <code>profits[i]</code> and a minimum capital <code>capital[i]</code> needed to start it. Initially, you have <code>w</code> capital. Choose at most <code>k</code> distinct projects to maximize your total capital.",
        "Integers k, w, and integer arrays profits and capital.", "An integer representing the maximum possible final capital.",
        ["1 <= k <= 10^5", "0 <= w <= 10^9", "n == profits.length == capital.length", "1 <= n <= 10^5", "0 <= profits[i] <= 10^4", "0 <= capital[i] <= 10^9"],
        "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]", "4", "Pick project 0 (capital 0, profit 1) -> w=1. Then pick project 2 (capital 1, profit 3) -> w=4.",
        "k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]", "6", "Sequentially pick projects to reach total 6.",
        "Sort all projects by required capital ascending. Then among all currently affordable projects, greedily pick the one with maximum profit.",
        "Use a Min-Heap (or sorted list) for projects by capital, and a Max-Heap for affordable projects by profit.",
        "Repeat k times: transfer all projects whose capital <= w into the Max-Heap. If Max-Heap is empty, break. Otherwise w += maxHeap.poll().",
        "int findMaximizedCapital(int k, int w, int[] profits, int[] capital)", "0", "50.8%", 920
    ))

    # 31. Merge K Sorted Structures -> kth-smallest-element-in-a-sorted-matrix
    probs.append(make_prob(
        "kth-smallest-element-in-a-sorted-matrix", "Kth Smallest Element in a Sorted Matrix", "Medium", "Heaps and Priority Queues", "Merge K Sorted Structures",
        "Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.",
        "Given an <code>n x n</code> matrix where each of the rows and columns is sorted in ascending order, return the <code>k-th</code> smallest element in the matrix. Note that it is the kth smallest element in the sorted order, not the kth distinct element.",
        "An n x n 2D integer array matrix and an integer k.", "The kth smallest integer.",
        ["n == matrix.length == matrix[i].length", "1 <= n <= 300", "-10^9 <= matrix[i][j] <= 10^9", "All the rows and columns of matrix are guaranteed to be sorted in non-decreasing order.", "1 <= k <= n^2"],
        "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8", "13", "The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13.",
        "matrix = [[-5]], k = 1", "-5", "Single element matrix.",
        "Since each row is sorted, this problem is directly analogous to merging n sorted lists.",
        "Use a Min-Heap initialized with the first element of each row: (matrix[r][0], r, 0).",
        "Extract the minimum element k - 1 times. Each time an element (val, r, c) is polled, insert its right neighbor (matrix[r][c+1], r, c+1) if c + 1 < n. The k-th polled value is the answer.",
        "int kthSmallest(int[][] matrix, int k)", "0", "62.1%", 1450
    ))

    # =========================================================================
    # GRAPHS
    # =========================================================================
    # 32. Connected Components -> count-sub-islands
    probs.append(make_prob(
        "count-sub-islands", "Count Sub Islands", "Medium", "Graphs", "Connected Components",
        "You are given two m x n binary matrices grid1 and grid2. An island in grid2 is considered a sub-island if there is an island in grid1 that contains all the cells that make up this island in grid2.",
        "You are given two <code>m x n</code> binary matrices <code>grid1</code> and <code>grid2</code> containing only <code>0</code>'s (water) and <code>1</code>'s (land). Return the number of islands in <code>grid2</code> that are considered sub-islands.",
        "Two 2D integer arrays grid1 and grid2.", "An integer count of sub-islands.",
        ["m == grid1.length == grid2.length", "n == grid1[i].length == grid2[i].length", "1 <= m, n <= 500", "grid1[i][j] and grid2[i][j] are either 0 or 1."],
        "grid1 = [[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,0,0,0,0],[1,1,0,1,1]], grid2 = [[1,1,1,0,0],[0,0,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]", "3", "3 islands in grid2 are completely covered by land in grid1.",
        "grid1 = [[1,0,1,0,1],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[1,0,1,0,1]], grid2 = [[0,0,0,0,0],[1,1,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]", "2", "2 valid sub-islands.",
        "Traverse each connected component (island) in grid2 using DFS/BFS. Check whether every cell in that island is also land (1) in grid1.",
        "Launch DFS from every unvisited 1 in grid2. Sinking cells in grid2 (grid2[r][c] = 0) prevents re-visiting.",
        "Let isSub = (grid1[r][c] == 1). Traverse all 4 neighbors: isSub &= dfs(nr, nc). Only increment count if the entire component returned true.",
        "int countSubIslands(int[][] grid1, int[][] grid2)", "0", "69.1%", 1200
    ))

    # 33. Cycle Detection -> graph-valid-tree
    probs.append(make_prob(
        "graph-valid-tree", "Graph Valid Tree", "Medium", "Graphs", "Cycle Detection",
        "Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if these edges make up a valid tree.",
        "Given <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code> and a list of undirected edges (each edge is a pair of nodes), write a function to check whether these edges make up a valid tree.",
        "An integer n and a 2D integer array edges.", "true if the graph forms a valid tree, false otherwise.",
        ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= a_i, b_i < n"],
        "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", "true", "Forms a connected graph with no cycles.",
        "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", "false", "Contains a cycle: 1-2-3-1.",
        "A graph is a valid tree if and only if: 1. It has exactly n - 1 edges. 2. It is fully connected (no cycles).",
        "If edges.length != n - 1, return false immediately. Then use Union-Find or BFS/DFS.",
        "With Union-Find: for each edge [u, v], if find(u) == find(v), a cycle exists, return false. Union them. If loop completes, return true.",
        "boolean validTree(int n, int[][] edges)", "false", "48.2%", 1120
    ))

    # 34. Topological Sorting -> all-ancestors-of-a-node-in-a-dag
    probs.append(make_prob(
        "all-ancestors-of-a-node-in-a-dag", "All Ancestors of a Node in a Directed Acyclic Graph", "Medium", "Graphs", "Topological Sorting",
        "You are given a positive integer n representing the number of nodes of a Directed Acyclic Graph (DAG). Return a list where res[i] is the list of ancestors of node i.",
        "You are given a positive integer <code>n</code> representing the number of nodes of a Directed Acyclic Graph (DAG). Given a 2D integer array <code>edges</code> where <code>edges[i] = [from_i, to_i]</code>, return a list <code>res</code> where <code>res[i]</code> is the list of ancestors of the <code>i-th</code> node, sorted in ascending order.",
        "An integer n and a 2D integer array edges.", "A list of lists of sorted integers.",
        ["1 <= n <= 1000", "0 <= edges.length <= Math.min(2000, n * (n - 1) / 2)", "edges[i].length == 2", "0 <= from_i, to_i < n", "All pairs [from_i, to_i] are distinct.", "The graph is a DAG."],
        "n = 8, edges = [[0,3],[0,4],[1,3],[2,4],[2,7],[3,5],[3,6],[3,7],[4,6]]", "[[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]", "Ancestors for each node sorted ascending.",
        "n = 5, edges = [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]", "[[],[0],[0,1],[0,1,2],[0,1,2,3]]", "Linear dependency cascade.",
        "Instead of searching backwards for ancestors of each node, consider reversing the perspective: DFS from each parent node i to find all descendants it can reach.",
        "Build adjacency list: parent -> children. If you start DFS from node u, every node v visited during this DFS has u as an ancestor.",
        "Iterate u from 0 to n - 1. Run DFS from u: for each reachable v != u, add u to v's ancestor list. Because u is looped in increasing order, ancestors are automatically sorted!",
        "java.util.List<java.util.List<Integer>> getAncestors(int n, int[][] edges)", "new java.util.ArrayList<>()", "57.3%", 870
    ))

    # 35. Shortest Paths -> path-with-minimum-effort
    probs.append(make_prob(
        "path-with-minimum-effort", "Path With Minimum Effort", "Medium", "Graphs", "Shortest Paths",
        "You are a hiker preparing for an upcoming hike. A route's effort is the maximum absolute difference in heights between two consecutive cells. Find the minimum effort route.",
        "You are a hiker preparing for an upcoming hike. You are given <code>heights</code>, a 2D array of size <code>rows x columns</code>. A route's effort is the maximum absolute difference in heights between two consecutive cells of the route. Return the minimum effort required to travel from the top-left cell (0, 0) to the bottom-right cell (rows - 1, columns - 1).",
        "A 2D integer array heights.", "An integer representing the minimum effort.",
        ["rows == heights.length", "columns == heights[i].length", "1 <= rows, columns <= 100", "1 <= heights[i][j] <= 10^6"],
        "heights = [[1,2,2],[3,8,2],[5,3,5]]", "2", "Route [1,1] -> [1,2] -> [2,2] -> [3,2] -> [3,3] has maximum consecutive difference of 2.",
        "heights = [[1,2,3],[3,8,4],[5,3,5]]", "1", "Route has maximum consecutive difference of 1.",
        "This is a shortest path problem where path cost is defined as max(edge_weights) rather than sum(edge_weights).",
        "Use Dijkstra's algorithm with a Min-Heap storing [effort, row, col].",
        "Initialize dist matrix with infinity, dist[0][0] = 0. Extract min-effort cell, relax 4 neighbors: nextEffort = Math.max(effort, Math.abs(heights[nr][nc] - heights[r][c])). Push if nextEffort < dist[nr][nc].",
        "int minimumEffortPath(int[][] heights)", "0", "59.2%", 1340
    ))

    # =========================================================================
    # GREEDY ALGORITHMS
    # =========================================================================
    # 36. Local Optimal Choices -> maximum-units-on-a-truck
    probs.append(make_prob(
        "maximum-units-on-a-truck", "Maximum Units on a Truck", "Easy", "Greedy Algorithms", "Local Optimal Choices",
        "You are assigned to put some amount of boxes onto one truck. Find the maximum total number of units that can be put on the truck.",
        "You are assigned to put some amount of boxes onto one truck. You are given a 2D array <code>boxTypes</code>, where <code>boxTypes[i] = [numberOfBoxes_i, numberOfUnitsPerBox_i]</code>. You are also given an integer <code>truckSize</code>, which is the maximum number of boxes that can be put on the truck. Return the maximum total number of units that can be put on the truck.",
        "A 2D integer array boxTypes and an integer truckSize.", "An integer representing the maximum total units.",
        ["1 <= boxTypes.length <= 1000", "1 <= numberOfBoxes_i, numberOfUnitsPerBox_i <= 1000", "1 <= truckSize <= 10^6"],
        "boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4", "8", "Pick 1 box of 3 units, 2 boxes of 2 units, and 1 box of 1 unit. Total = 3 + 4 + 1 = 8.",
        "boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10", "91", "Greedily take the highest-unit boxes first.",
        "To maximize total units, prioritize boxes that contain the greatest number of units per box (Fractional Knapsack greedy principle).",
        "Sort boxTypes descending by numberOfUnitsPerBox.",
        "Iterate through sorted box types: take takeBoxes = Math.min(truckSize, box[0]). Add takeBoxes * box[1] to totalUnits and decrement truckSize -= takeBoxes. Stop when truckSize == 0.",
        "int maximumUnits(int[][] boxTypes, int truckSize)", "0", "74.1%", 1560
    ))

    # =========================================================================
    # DYNAMIC PROGRAMMING
    # =========================================================================
    # 37. Grid DP -> triangle
    probs.append(make_prob(
        "triangle", "Triangle", "Medium", "Dynamic Programming", "Grid DP",
        "Given a triangle array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below.",
        "Given a <code>triangle</code> array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below. More formally, if you are on index <code>i</code> on the current row, you may move to either index <code>i</code> or index <code>i + 1</code> on the next row.",
        "A list of lists of integers representing a triangle.", "An integer representing the minimum path sum.",
        ["1 <= triangle.length <= 200", "triangle[0].length == 1", "triangle[i].length == triangle[i - 1].length + 1", "-10^4 <= triangle[i][j] <= 10^4"],
        "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]", "11", "Path: 2 -> 3 -> 5 -> 1. Sum = 11.",
        "triangle = [[-10]]", "-10", "Single element triangle.",
        "Bottom-up DP is cleaner than top-down because the answer naturally converges to the top cell (0, 0) without needing a min across the base.",
        "Start from the second to last row and work upwards to row 0.",
        "Recurrence: dp[j] = triangle.get(row).get(j) + Math.min(dp[j], dp[j + 1]). Using a 1D array of size N gives O(N) auxiliary space.",
        "int minimumTotal(java.util.List<java.util.List<Integer>> triangle)", "0", "56.4%", 1520
    ))

    # 38. Memoization and Tabulation -> n-th-tribonacci-number
    probs.append(make_prob(
        "n-th-tribonacci-number", "N-th Tribonacci Number", "Easy", "Dynamic Programming", "Memoization and Tabulation",
        "The Tribonacci sequence Tn is defined as: T0 = 0, T1 = 1, T2 = 1, and Tn+3 = Tn + Tn+1 + Tn+2 for n >= 0. Given n, return the value of Tn.",
        "The Tribonacci sequence Tn is defined as: <code>T0 = 0, T1 = 1, T2 = 1</code>, and <code>Tn+3 = Tn + Tn+1 + Tn+2</code> for <code>n >= 0</code>. Given <code>n</code>, return the value of <code>Tn</code>.",
        "An integer n.", "The n-th Tribonacci number.",
        ["0 <= n <= 37", "The answer is guaranteed to fit within a 32-bit integer, ie. answer <= 2^31 - 1."],
        "n = 4", "4", "T_3 = 0 + 1 + 1 = 2, T_4 = 1 + 1 + 2 = 4.",
        "n = 25", "1389537", "Value calculated by 25 iterations.",
        "This is an extension of Fibonacci with three recurrence terms: T(n) = T(n-1) + T(n-2) + T(n-3).",
        "Base cases: n == 0 return 0; n == 1 or n == 2 return 1.",
        "Use three accumulator variables: a = 0, b = 1, c = 1. In a loop from 3 to n, next = a + b + c, shift a = b, b = c, c = next. Return c. Space complexity is O(1).",
        "int tribonacci(int n)", "0", "64.3%", 1750
    ))

    # =========================================================================
    # PHASE 8 EXPANSIONS (8 ADVANCED DSA PROBLEMS TO REACH EXACTLY 200)
    # =========================================================================

    # 39. Segment Trees & Range Queries -> Range Sum Query - Mutable
    probs.append(make_prob(
        "segment-tree-range-sum", "Range Sum Query - Mutable", "Hard", "Arrays", "Prefix Sum",
        "Given an integer array nums, handle multiple queries of updating array elements and calculating the sum of elements between indices left and right.",
        "Given an integer array <code>nums</code>, design a data structure that can handle multiple queries of updating an element at index <code>i</code> to a new value <code>val</code>, and querying the sum of elements between indices <code>left</code> and <code>right</code> inclusive. Both update and range sum queries must run in logarithmic time.",
        "An array of integers nums and query operations.", "Results of range sum queries.",
        ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100", "0 <= index < nums.length", "0 <= left <= right < nums.length", "At most 3 * 10^4 calls will be made to update and sumRange."],
        "nums = [1, 3, 5], sumRange(0, 2), update(1, 2), sumRange(0, 2)", "[9, 8]", "Initial sum of [1, 3, 5] is 9. After updating index 1 to 2, array is [1, 2, 5], sum is 8.",
        "nums = [7, 2, 7, 2, 0], update(4, 6), update(0, 2), update(0, 9), sumRange(4, 4)", "[6]", "After updates, element at index 4 is 6.",
        "A naive prefix sum array allows O(1) queries but requires O(N) time for every point update. A standard array allows O(1) updates but O(N) queries.",
        "Use a Segment Tree or a Binary Indexed Tree (Fenwick Tree) to achieve both O(log N) point updates and O(log N) range queries.",
        "Construct a tree array of size 4*N. For sumRange, query overlapping intervals. For update, recursively traverse to leaf node, update value, and re-sum internal parents.",
        "int[] processRangeQueries(int[] nums, int[][] queries)", "new int[0]", "40.8%", 2450
    ))

    # 40. Trie & Advanced Backtracking -> Word Search II
    probs.append(make_prob(
        "word-search-ii", "Word Search II", "Hard", "Recursion and Backtracking", "Constraint-Based Backtracking",
        "Given an m x n board of characters and a list of strings words, return all words on the board.",
        "Given an <code>m x n</code> <code>board</code> of characters and a list of strings <code>words</code>, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a word.",
        "A 2D char array board and an array of String words.", "A List of all matching words found on the board.",
        ["m == board.length", "n == board[i].length", "1 <= m, n <= 12", "board[i][j] is a lowercase English letter", "1 <= words.length <= 3 * 10^4", "1 <= words[i].length <= 10"],
        "board = [['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']], words = ['oath','pea','eat','rain']", "['eat','oath']", "Both 'eat' and 'oath' can be formed by adjacent cells.",
        "board = [['a','b'],['c','d']], words = ['abcb']", "[]", "No valid path forms 'abcb' without reusing cell 'b'.",
        "Searching each word individually across the entire grid leads to excessive repeated traversals. Instead, search all words simultaneously.",
        "Build a Prefix Tree (Trie) containing all words in the dictionary. Then perform DFS starting from each board cell, advancing through the Trie nodes simultaneously.",
        "When a Trie node marks the end of a word, add it to the result set and clear the word mark to prevent duplicate additions. Backtrack cell visits using an in-place character mask (e.g. board[r][c] = '#'). Prune exhausted Trie branches to optimize runtime.",
        "java.util.List<String> findWords(char[][] board, String[] words)", "new java.util.ArrayList<>()", "36.2%", 3120
    ))

    # 41. Rolling Hash & Suffix Techniques -> Longest Duplicate Substring
    probs.append(make_prob(
        "longest-duplicate-substring", "Longest Duplicate Substring", "Hard", "Strings", "String Matching",
        "Given a string s, consider all duplicated substrings: substrings of s that occur 2 or more times. Return any duplicated substring that has the longest possible length.",
        "Given a string <code>s</code>, consider all duplicated substrings: substrings of <code>s</code> that occur 2 or more times. The occurrences may overlap. Return any duplicated substring that has the longest possible length. If <code>s</code> does not have a duplicated substring, return <code>\"\"</code>.",
        "A string s consisting of lowercase English letters.", "A string representing the longest duplicate substring.",
        ["2 <= s.length <= 3 * 10^4", "s consists of lowercase English letters."],
        "s = 'banana'", "'ana'", "'ana' appears at index 1 and index 3.",
        "s = 'abcd'", "''", "No duplicate substrings exist in s.",
        "If a duplicate substring of length L exists, duplicate substrings of any length less than L must also exist. This monotonic property allows binary search on the length.",
        "Binary search for the length L between 1 and s.length - 1. For a fixed length L, use Rabin-Karp rolling hash to detect whether any substring of length L appears at least twice in O(N) time.",
        "Compute hash of window using polynomial rolling hash modulo a large prime (e.g., 2^63 - 1 or dual modulos 10^9+7 and 10^9+9) to minimize hash collisions. Maintain a HashSet of computed hashes. Return the longest candidate found.",
        "String longestDupSubstring(String s)", "\"\"", "31.4%", 2890
    ))

    # 42. Fenwick Tree / Inversion Counting -> Count of Smaller Numbers After Self
    probs.append(make_prob(
        "count-of-smaller-numbers-after-self", "Count of Smaller Numbers After Self", "Hard", "Binary Search", "Binary Search on Answer",
        "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
        "Given an integer array <code>nums</code>, return an integer array <code>counts</code> where <code>counts[i]</code> is the number of smaller elements to the right of <code>nums[i]</code>.",
        "An integer array nums.", "A List of integers representing counts of smaller elements to the right.",
        ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        "nums = [5,2,6,1]", "[2,1,1,0]", "To the right of 5: 2 and 1 (2 smaller). Right of 2: 1 (1 smaller). Right of 6: 1 (1 smaller). Right of 1: none (0 smaller).",
        "nums = [-1]", "[0]", "Single element array has 0 elements to its right.",
        "Traverse the array from right to left. At each element nums[i], count how many numbers previously processed are strictly smaller than nums[i].",
        "Coordinate compress the numbers and maintain a Fenwick Tree (Binary Indexed Tree) or use Merge Sort with index tracking to count inversions.",
        "Using BIT: rank each unique value from 1 to K. For each number from right to left, query prefix sum in BIT up to rank(nums[i]) - 1, record the count, then update BIT at rank(nums[i]) with +1.",
        "java.util.List<Integer> countSmaller(int[] nums)", "new java.util.ArrayList<>()", "42.5%", 3410
    ))

    # 43. Tarjan's Bridge Algorithm -> Critical Connections in a Network
    probs.append(make_prob(
        "critical-connections-in-a-network", "Critical Connections in a Network", "Hard", "Graphs", "DFS",
        "There are n servers numbered from 0 to n - 1 connected by undirected server-to-server connections. Return all critical connections in the network.",
        "There are <code>n</code> servers numbered from <code>0</code> to <code>n - 1</code> connected by undirected server-to-server <code>connections</code> forming a network. A critical connection is a connection that, if removed, will make some servers unable to reach some other server. Return all critical connections in the network in any order.",
        "An integer n and a List of undirected edges connections.", "A List of edges [u, v] representing bridges.",
        ["2 <= n <= 10^5", "n - 1 <= connections.length <= 10^5", "0 <= u, v <= n - 1", "u != v", "There are no repeated connections.", "The network is connected."],
        "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]", "[[1,3]]", "[[1,3]] is the only critical connection because removing [0,1], [1,2], or [2,0] still leaves the triangle 0-1-2 connected.",
        "n = 2, connections = [[0,1]]", "[[0,1]]", "Removing [0,1] disconnects servers 0 and 1.",
        "A critical connection in an undirected connected graph is also known as a 'bridge'. Bridges are edges that do not belong to any cycle.",
        "Use Tarjan's Bridge-Finding Algorithm based on Depth-First Search with discovery time and lowest reachable timestamp arrays (tin and low).",
        "Track timer during DFS. For edge (u, v): if v is parent, continue; if v is already visited, low[u] = Math.min(low[u], tin[v]); if unvisited, recurse on v, low[u] = Math.min(low[u], low[v]). If low[v] > tin[u], then edge (u, v) is a bridge.",
        "java.util.List<java.util.List<Integer>> criticalConnections(int n, java.util.List<java.util.List<Integer>> connections)", "new java.util.ArrayList<>()", "55.3%", 3890
    ))

    # 44. Interval DP -> Burst Balloons
    probs.append(make_prob(
        "burst-balloons", "Burst Balloons", "Hard", "Dynamic Programming", "2D DP",
        "You are given n balloons, indexed from 0 to n - 1. Return the maximum coins you can collect by bursting the balloons wisely.",
        "You are given <code>n</code> balloons, indexed from <code>0</code> to <code>n - 1</code>. Each balloon is painted with a number on it represented by an array <code>nums</code>. You are asked to burst all the balloons. If you burst balloon <code>i</code>, you will get <code>nums[i - 1] * nums[i] * nums[i + 1]</code> coins. Return the maximum coins you can collect by bursting the balloons wisely.",
        "An integer array nums.", "A 32-bit integer representing the maximum collected coins.",
        ["n == nums.length", "1 <= n <= 300", "0 <= nums[i] <= 100"],
        "nums = [3,1,5,8]", "167", "Optimal order: burst 1, then 5, then 3, then 8. Coins: (3*1*5) + (3*5*8) + (1*3*8) + (1*8*1) = 15 + 120 + 24 + 8 = 167.",
        "nums = [1,5]", "10", "Burst 1 then 5: (1*1*5) + (1*5*1) = 5 + 5 = 10.",
        "Thinking about which balloon to burst FIRST divides the remaining array into dependent subarrays because adjacent neighbors shift. Instead, think about which balloon to burst LAST in an interval.",
        "If balloon k is burst LAST in interval [i, j], then its neighbors when it bursts are guaranteed to be nums[i-1] and nums[j+1]. This decouples the subproblems [i, k-1] and [k+1, j].",
        "Pad nums with 1 at both boundaries: padded = [1, ...nums, 1]. Define dp[i][j] as max coins from bursting all balloons strictly between i and j. Recurrence: dp[i][j] = max(dp[i][k] + dp[k][j] + padded[i] * padded[k] * padded[j]) for k from i+1 to j-1.",
        "int maxCoins(int[] nums)", "0", "58.1%", 4120
    ))

    # 45. Bit Manipulation & Modulo -> Single Number II
    probs.append(make_prob(
        "single-number-ii", "Single Number II", "Medium", "Hashing", "Duplicate Detection",
        "Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element.",
        "Given an integer array <code>nums</code> where every element appears three times except for one, which appears exactly once. Find the single element and return it. You must implement a solution with a linear runtime complexity and use only constant extra space.",
        "An integer array nums.", "The single integer appearing exactly once.",
        ["1 <= nums.length <= 3 * 10^4", "-2^31 <= nums[i] <= 2^31 - 1", "Each element in nums appears exactly three times except for one element which appears once."],
        "nums = [2,2,3,2]", "3", "3 appears once, 2 appears three times.",
        "nums = [0,1,0,1,0,1,99]", "99", "99 appears once, 0 and 1 appear three times.",
        "If every element appears 3 times, summing the i-th bit across all numbers will yield a multiple of 3 if the single number has bit 0, or (3*k + 1) if it has bit 1.",
        "Iterate through all 32 bit positions (0 to 31). Count the number of set bits at position i across all numbers. If bitCount % 3 != 0, set the i-th bit in the result.",
        "Alternatively, design a 2-bit finite state machine using bitwise operations: ones = (ones ^ num) & ~twos; twos = (twos ^ num) & ~ones. Returns ones in O(N) time and O(1) space.",
        "int singleNumber(int[] nums)", "0", "60.4%", 2950
    ))

    # 46. Advanced 2D DP -> Regular Expression Matching
    probs.append(make_prob(
        "regular-expression-matching", "Regular Expression Matching", "Hard", "Dynamic Programming", "2D DP",
        "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
        "Given an input string <code>s</code> and a pattern <code>p</code>, implement regular expression matching with support for <code>'.'</code> and <code>'*'</code> where <code>'.'</code> matches any single character and <code>'*'</code> matches zero or more of the preceding element. The matching should cover the entire input string (not partial).",
        "Two strings s and p.", "A boolean: true if pattern matches s, false otherwise.",
        ["1 <= s.length <= 20", "1 <= p.length <= 20", "s contains only lowercase English letters.", "p contains only lowercase English letters, '.', and '*'.", "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match."],
        "s = 'aa', p = 'a*'", "true", "'*' means zero or more of the preceding element 'a'. Therefore, by repeating 'a' once, it becomes 'aa'.",
        "s = 'ab', p = '.*'", "true", "'.*' means 'zero or more (*) of any character (.)'.",
        "A character followed by '*' provides two branching possibilities: match 0 times (ignore preceding character and '*') or match 1 or more times (if preceding character matches s[i]).",
        "Use 2D Dynamic Programming. Let dp[i][j] represent whether s[0...i-1] matches p[0...j-1].",
        "Base case: dp[0][0] = true. If p[j-1] == '*', dp[i][j] = dp[i][j-2] (zero occurrences) || (matches(s[i-1], p[j-2]) && dp[i-1][j]). If characters match or p[j-1] == '.', dp[i][j] = dp[i-1][j-1].",
        "boolean isMatch(String s, String p)", "false", "28.3%", 4850
    ))

    return probs
