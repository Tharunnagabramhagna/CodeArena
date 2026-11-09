# arrays.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: Traversal and basic operations
    problems.append(make_prob(
        "find-pivot-index", "Find Pivot Index", "Easy", "Arrays", "Traversal and basic operations",
        "Calculate the pivot index where the sum of items to the left equals items to the right.",
        "Given an array of integers <code>nums</code>, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right. If no such index exists, return <code>-1</code>. If there are multiple pivot indexes, return the left-most pivot index.",
        "An array of integers <code>nums</code>.", "The 0-based pivot index or <code>-1</code>.",
        ["1 <= nums.length <= 10^4", "-1000 <= nums[i] <= 1000"],
        "nums = [1,7,3,6,5,6]", "3", "The pivot index is 3. Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11.",
        "nums = [1,2,3]", "-1", "There is no index that satisfies the conditions in the problem statement.",
        "Think about computing the total sum of all elements upfront.",
        "As you traverse the array from left to right, maintain a running left sum. The right sum at any index is simply totalSum - leftSum - currentElement.",
        "Check if leftSum == totalSum - leftSum - nums[i]. If so, return index i immediately. Remember to update leftSum after checking.",
        "int pivotIndex(int[] nums)", "-1", "54.2%", 18450
    ))

    problems.append(make_prob(
        "plus-one", "Plus One", "Easy", "Arrays", "Traversal and basic operations",
        "Increment the large integer represented as an array of digits by one.",
        "You are given a large integer represented as an integer array <code>digits</code>, where each <code>digits[i]</code> is the <code>i</code>-th digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading zeros. Increment the large integer by one and return the resulting array of digits.",
        "An integer array <code>digits</code>.", "The resulting integer array after adding one.",
        ["1 <= digits.length <= 100", "0 <= digits[i] <= 9", "digits does not contain leading 0s."],
        "digits = [1,2,3]", "[1,2,4]", "The array represents the integer 123. Incrementing by one gives 124.",
        "digits = [9]", "[1,0]", "The array represents 9. Incrementing by one gives 10.",
        "Iterate from the least significant digit (end of the array) towards the beginning.",
        "If a digit is less than 9, increment it by 1 and return the array immediately.",
        "If a digit is 9, turn it into 0 and carry over 1 to the next iteration. If all digits were 9, create a new array with length + 1 and set the first digit to 1.",
        "int[] plusOne(int[] digits)", "new int[]{}", "45.1%", 22340
    ))

    # Pattern: Two Pointers
    problems.append(make_prob(
        "two-sum", "Two Sum", "Easy", "Arrays", "Two Pointers",
        "Find two numbers in an array that add up to a target.",
        "Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers such that they add up to <code>target</code>. You may assume that each input has <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.",
        "An integer array <code>nums</code> and an integer <code>target</code>.", "An integer array <code>[i, j]</code> containing the indices of the two numbers.",
        ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
        "nums = [2, 7, 11, 15], target = 9", "[0, 1]", "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].",
        "nums = [3, 2, 4], target = 6", "[1, 2]", "Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].",
        "Consider how you can look up whether the complement (target - nums[i]) has already been seen.",
        "A hash map allows checking whether the complement exists in O(1) average time, mapping values to indices. Alternatively, on a sorted copy, two pointers can converge from both ends.",
        "In a single pass with HashMap, for each element check map.containsKey(target - nums[i]). If found, return new int[]{map.get(target - nums[i]), i}; otherwise put nums[i] into the map.",
        "int[] twoSum(int[] nums, int target)", "new int[]{}", "49.2%", 15420
    ))

    problems.append(make_prob(
        "container-with-most-water", "Container With Most Water", "Medium", "Arrays", "Two Pointers",
        "Find two vertical lines that together with the x-axis form a container holding the most water.",
        "You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i</code>-th line are <code>(i, 0)</code> and <code>(i, height[i])</code>. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
        "An array of integers <code>height</code>.", "The maximum volume of water.",
        ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
        "height = [1,8,6,2,5,4,8,3,7]", "49", "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
        "height = [1,1]", "1", "The distance between the two lines is 1, and minimum height is 1, giving area 1.",
        "The area is bounded by the shorter line: area = min(height[left], height[right]) * (right - left).",
        "Start two pointers at opposite ends of the array to maximize width.",
        "Always move the pointer that points to the shorter line inward. Moving the taller line inward could only reduce or match width without increasing height.",
        "int maxArea(int[] height)", "0", "54.8%", 14200
    ))

    problems.append(make_prob(
        "trapping-rain-water", "Trapping Rain Water", "Hard", "Arrays", "Two Pointers",
        "Compute how much water an elevation map can trap after raining.",
        "Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.",
        "An array of non-negative integers <code>height</code>.", "Total volume of trapped rainwater.",
        ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
        "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "6", "The elevation map [0,1,0,2,1,0,1,3,2,1,2,1] can trap 6 units of rain water.",
        "height = [4,2,0,3,2,5]", "9", "Water trapped is 9 units between the high walls.",
        "At any index i, the water trapped above it equals max(0, min(maxLeft, maxRight) - height[i]).",
        "Instead of precomputing left and right arrays in O(N) space, use two pointers moving towards each other while maintaining leftMax and rightMax.",
        "If height[left] < height[right], process left: update leftMax and add max(0, leftMax - height[left]) to result, then left++. Otherwise process right similarly.",
        "int trap(int[] height)", "0", "60.4%", 9850
    ))

    problems.append(make_prob(
        "three-sum", "3Sum", "Medium", "Arrays", "Two Pointers",
        "Find all unique triplets in the array which gives the sum of zero.",
        "Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>. Notice that the solution set must not contain duplicate triplets.",
        "An integer array <code>nums</code>.", "A list of unique integer triplets summing to zero.",
        ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
        "nums = [-1,0,1,2,-1,-4]", "[[-1,-1,2],[-1,0,1]]", "The distinct triplets are [-1,0,1] and [-1,-1,2].",
        "nums = [0,1,1]", "[]", "The only possible triplet does not sum up to 0.",
        "Sorting the array first makes it easier to navigate sums and skip duplicates.",
        "For each element nums[i], reduce the problem to Two Sum II with target = -nums[i] using two pointers (left = i + 1, right = n - 1).",
        "When a valid triplet is found, remember to advance both left and right while skipping duplicate values to prevent duplicate triplets in the output.",
        "java.util.List<java.util.List<Integer>> threeSum(int[] nums)", "new java.util.ArrayList<>()", "33.9%", 16700
    ))

    # Pattern: Sliding Window
    problems.append(make_prob(
        "maximum-average-subarray", "Maximum Average Subarray I", "Easy", "Arrays", "Sliding Window",
        "Find a contiguous subarray whose length is equal to k that has the maximum average value.",
        "You are given an integer array <code>nums</code> consisting of <code>n</code> elements, and an integer <code>k</code>. Find a contiguous subarray whose length is equal to <code>k</code> that has the maximum average value and return this value. Any answer with a calculation error less than <code>10^-5</code> will be accepted.",
        "An integer array <code>nums</code> and integer <code>k</code>.", "Maximum average as a double.",
        ["n == nums.length", "1 <= k <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        "nums = [1,12,-5,-6,50,3], k = 4", "12.75000", "Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75.",
        "nums = [5], k = 1", "5.00000", "The single element has average 5.",
        "Since k is fixed, finding the maximum average is equivalent to finding the maximum sum of a window of size k.",
        "Calculate the sum of the first k elements as the initial window sum.",
        "Slide the window one element at a time from k to n - 1 by adding nums[i] and subtracting nums[i - k]. Track the maximum sum found and divide by (double)k at the end.",
        "double findMaxAverage(int[] nums, int k)", "0.0", "44.7%", 12100
    ))

    problems.append(make_prob(
        "minimum-size-subarray-sum", "Minimum Size Subarray Sum", "Medium", "Arrays", "Sliding Window",
        "Find the minimal length of a contiguous subarray of which the sum is greater than or equal to target.",
        "Given an array of positive integers <code>nums</code> and a positive integer <code>target</code>, return the minimal length of a contiguous subarray <code>[nums[l], nums[l+1], ..., nums[r-1], nums[r]]</code> of which the sum is greater than or equal to <code>target</code>. If there is no such subarray, return <code>0</code> instead.",
        "A positive integer <code>target</code> and positive integer array <code>nums</code>.", "Minimum length of subarray, or <code>0</code>.",
        ["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
        "target = 7, nums = [2,3,1,2,4,3]", "2", "The subarray [4,3] has the minimal length under the problem constraint.",
        "target = 4, nums = [1,4,4]", "1", "The subarray [4] satisfies the condition.",
        "Because all numbers are positive, expanding the right end always increases the sum, and shrinking the left end always decreases the sum.",
        "Use a dynamic sliding window with two pointers left and right.",
        "Expand right to add elements to currentSum. Whenever currentSum >= target, update minLen = min(minLen, right - left + 1), then subtract nums[left] and increment left until sum < target.",
        "int minSubArrayLen(int target, int[] nums)", "0", "46.2%", 11800
    ))

    # Pattern: Prefix Sum
    problems.append(make_prob(
        "range-sum-query-immutable", "Range Sum Query - Immutable", "Easy", "Arrays", "Prefix Sum",
        "Calculate the sum of the elements of nums between indices left and right inclusive.",
        "Given an integer array <code>nums</code>, handle multiple queries of the following type: calculate the sum of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> inclusive where <code>left <= right</code>. Implement the <code>NumArray</code> class with a <code>sumRange(int left, int right)</code> method that runs in <code>O(1)</code> time per query.",
        "An array of integers <code>nums</code> and query bounds <code>left, right</code>.", "Sum of elements between <code>left</code> and <code>right</code>.",
        ["1 <= nums.length <= 10^4", "-10^5 <= nums[i] <= 10^5", "0 <= left <= right < nums.length"],
        "nums = [-2, 0, 3, -5, 2, -1], left = 0, right = 2", "1", "sumRange(0, 2) -> (-2) + 0 + 3 = 1.",
        "nums = [-2, 0, 3, -5, 2, -1], left = 2, right = 5", "-1", "sumRange(2, 5) -> 3 + (-5) + 2 + (-1) = -1.",
        "Precompute prefix sums so range sums can be answered in O(1) time without iterating repeatedly.",
        "Build a prefix array of size n + 1 where prefix[i] stores the sum of elements from index 0 up to i - 1.",
        "The range sum from left to right is simply prefix[right + 1] - prefix[left].",
        "int sumRange(int[] nums, int left, int right)", "0", "61.3%", 14900
    ))

    problems.append(make_prob(
        "subarray-sum-equals-k", "Subarray Sum Equals K", "Medium", "Arrays", "Prefix Sum",
        "Find the total number of continuous subarrays whose sum equals to k.",
        "Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of subarrays whose sum equals to <code>k</code>. A subarray is a contiguous non-empty sequence of elements within an array.",
        "An integer array <code>nums</code> and target sum <code>k</code>.", "Number of continuous subarrays summing to <code>k</code>.",
        ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
        "nums = [1,1,1], k = 2", "2", "The subarrays [nums[0], nums[1]] and [nums[1], nums[2]] sum to 2.",
        "nums = [1,2,3], k = 3", "2", "Subarrays [1, 2] and [3] sum to 3.",
        "Can you express the sum of any subarray from index i to j in terms of prefix sums?",
        "subarraySum(i, j) = prefixSum[j] - prefixSum[i - 1] == k => prefixSum[i - 1] = prefixSum[j] - k.",
        "Use a HashMap to store the frequencies of prefix sums observed so far. Initialize map with (0: 1). For each element, add currentSum, check if (currentSum - k) is in map, and update count.",
        "int subarraySum(int[] nums, int k)", "0", "44.1%", 15600
    ))

    # Pattern: Kadane's Algorithm
    problems.append(make_prob(
        "maximum-subarray", "Maximum Subarray", "Medium", "Arrays", "Kadane's Algorithm",
        "Find the contiguous subarray with the largest sum.",
        "Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.",
        "An integer array <code>nums</code>.", "Maximum sum of a contiguous subarray.",
        ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        "nums = [-2,1,-3,4,-1,2,1,-5,4]", "6", "The subarray [4,-1,2,1] has the largest sum 6.",
        "nums = [5,4,-1,7,8]", "23", "The entire array has the largest sum 23.",
        "If the current running sum becomes negative, would keeping it benefit future elements?",
        "At each index i, the maximum subarray ending at i is max(nums[i], currentSum + nums[i]). This is Kadane's algorithm.",
        "Maintain currentSum = nums[0] and maxSum = nums[0]. Iterate from index 1: currentSum = Math.max(nums[i], currentSum + nums[i]) and maxSum = Math.max(maxSum, currentSum).",
        "int maxSubArray(int[] nums)", "0", "50.4%", 19800
    ))

    problems.append(make_prob(
        "maximum-sum-circular-subarray", "Maximum Sum Circular Subarray", "Medium", "Arrays", "Kadane's Algorithm",
        "Find the maximum possible sum of a non-empty subarray of the circular array.",
        "Given a circular integer array <code>nums</code> of length <code>n</code>, return the maximum possible sum of a non-empty subarray of <code>nums</code>. A circular array means the end of the array connects to the beginning.",
        "An integer array <code>nums</code>.", "Maximum subarray sum in circular array.",
        ["n == nums.length", "1 <= n <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4"],
        "nums = [1,-2,3,-2]", "3", "Subarray [3] has maximum sum 3.",
        "nums = [5,-3,5]", "10", "Subarray [5,5] has maximum sum 5 + 5 = 10.",
        "A circular maximum subarray is either non-wrapping (standard Kadane) or wrapping (totalSum minus minimum subarray).",
        "Run Kadane's algorithm once for max subarray, and once for min subarray, while calculating totalSum.",
        "If maxSubarraySum > 0, return max(maxSubarraySum, totalSum - minSubarraySum). If all elements are negative, return maxSubarraySum directly.",
        "int maxSubarraySumCircular(int[] nums)", "0", "43.8%", 9200
    ))

    # Pattern: Sorting and Searching
    problems.append(make_prob(
        "merge-sorted-array", "Merge Sorted Array", "Easy", "Arrays", "Sorting and Searching",
        "Merge two sorted integer arrays nums1 and nums2 into nums1 as one sorted array.",
        "You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in non-decreasing order, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively. Merge <code>nums1</code> and <code>nums2</code> into a single array sorted in non-decreasing order. The array <code>nums1</code> has a length of <code>m + n</code>, where the last <code>n</code> elements are set to <code>0</code>.",
        "Arrays <code>nums1</code> (size m+n), <code>nums2</code> (size n), and integers <code>m, n</code>.", "None (modify <code>nums1</code> in-place).",
        ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200", "-10^9 <= nums1[i], nums2[j] <= 10^9"],
        "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", "[1,2,2,3,5,6]", "The arrays we are merging are [1,2,3] and [2,5,6].",
        "nums1 = [1], m = 1, nums2 = [], n = 0", "[1]", "nums2 is empty, nums1 remains [1].",
        "If you fill from the front, you will overwrite existing elements in nums1. Can you fill from the back?",
        "Use three pointers: p1 = m - 1 (end of valid nums1), p2 = n - 1 (end of nums2), and p = m + n - 1 (end of buffer).",
        "Compare nums1[p1] and nums2[p2], place the larger at nums1[p] and decrement p. If elements remain in nums2, copy them over.",
        "void merge(int[] nums1, int m, int[] nums2, int n)", "", "47.9%", 21500
    ))

    problems.append(make_prob(
        "sort-colors", "Sort Colors", "Medium", "Arrays", "Sorting and Searching",
        "Sort an array with 0s, 1s, and 2s in-place without using library sort.",
        "Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue respectively. You must solve this problem without using the library's sort function.",
        "An array <code>nums</code> containing 0, 1, and 2.", "None (sort <code>nums</code> in-place).",
        ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2."],
        "nums = [2,0,2,1,1,0]", "[0,0,1,1,2,2]", "Sorted colors in-place.",
        "nums = [2,0,1]", "[0,1,2]", "Sorted colors in-place.",
        "This is the classic Dutch National Flag partitioning problem.",
        "Maintain three pointers: low = 0 (boundary for 0s), mid = 0 (current element), and high = n - 1 (boundary for 2s).",
        "While mid <= high: if nums[mid] == 0, swap(nums[low++], nums[mid++]); if nums[mid] == 1, mid++; if nums[mid] == 2, swap(nums[mid], nums[high--]).",
        "void sortColors(int[] nums)", "", "60.1%", 15400
    ))

    # Pattern: Frequency Counting
    problems.append(make_prob(
        "majority-element", "Majority Element", "Easy", "Arrays", "Frequency Counting",
        "Find the element that appears more than floor(n / 2) times in the array.",
        "Given an array <code>nums</code> of size <code>n</code>, return the majority element. The majority element is the element that appears more than <code>floor(n / 2)</code> times. You may assume that the majority element always exists in the array.",
        "An array of integers <code>nums</code>.", "The majority integer.",
        ["n == nums.length", "1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
        "nums = [3,2,3]", "3", "3 appears 2 times, which is more than 3/2 = 1.",
        "nums = [2,2,1,1,1,2,2]", "2", "2 appears 4 times, which is more than 7/2 = 3.",
        "While a HashMap can count frequencies in O(N) space, Boyer-Moore Voting Algorithm solves it in O(1) space.",
        "Maintain a candidate and a count. When count is 0, pick current element as candidate.",
        "If current element matches candidate, increment count; otherwise decrement count. Since the majority appears > n/2 times, it will survive.",
        "int majorityElement(int[] nums)", "0", "64.2%", 18900
    ))

    problems.append(make_prob(
        "find-all-duplicates-in-array", "Find All Duplicates in an Array", "Medium", "Arrays", "Frequency Counting",
        "Find all the elements that appear twice in an array with integers from 1 to n.",
        "Given an integer array <code>nums</code> of length <code>n</code> where all the integers of <code>nums</code> are in the range <code>[1, n]</code> and each integer appears once or twice, return an array of all the integers that appears twice. You must write an algorithm that runs in <code>O(n)</code> time and uses only constant extra space.",
        "An integer array <code>nums</code>.", "A list of integers that appear twice.",
        ["n == nums.length", "1 <= n <= 10^5", "1 <= nums[i] <= n"],
        "nums = [4,3,2,7,8,2,3,1]", "[2,3]", "2 and 3 both appear twice.",
        "nums = [1,1,2]", "[1]", "1 appears twice.",
        "The values range from 1 to n, which matches the valid index range 0 to n - 1.",
        "Use the array itself as a hash table by negating the value at the corresponding index (Math.abs(nums[i]) - 1).",
        "For each num, let idx = Math.abs(num) - 1. If nums[idx] < 0, then Math.abs(num) is a duplicate! Otherwise negate nums[idx].",
        "java.util.List<Integer> findDuplicates(int[] nums)", "new java.util.ArrayList<>()", "73.5%", 12800
    ))

    return problems

