# binary_search.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: Basic Binary Search
    problems.append(make_prob(
        "binary-search", "Binary Search", "Easy", "Binary Search", "Basic Binary Search",
        "Search a target in a sorted ascending integer array in O(log n) time.",
        "Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>. You must write an algorithm with <code>O(log n)</code> runtime complexity.",
        "A sorted integer array <code>nums</code> and an integer <code>target</code>.", "The 0-based index of target, or <code>-1</code> if not found.",
        ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique.", "nums is sorted in ascending order."],
        "nums = [-1,0,3,5,9,12], target = 9", "4", "9 exists in nums and its index is 4.",
        "nums = [-1,0,3,5,9,12], target = 2", "-1", "2 does not exist in nums so return -1.",
        "Because the array is sorted, comparing the target against the middle element lets you eliminate half the search space.",
        "Calculate mid using left + (right - left) / 2 to prevent 32-bit integer overflow.",
        "If nums[mid] == target, return mid. If nums[mid] < target, search right half (left = mid + 1). If nums[mid] > target, search left half (right = mid - 1).",
        "int search(int[] nums, int target)", "-1", "56.4%", 26400
    ))

    problems.append(make_prob(
        "guess-number-higher-or-lower", "Guess Number Higher or Lower", "Easy", "Binary Search", "Basic Binary Search",
        "Guess the picked number between 1 and n using the pre-defined guess API.",
        "We are playing the Guess Game. The game will pick a number from <code>1</code> to <code>n</code>. You have to guess which number was picked. Every time you guess wrong, the API will tell you whether the number picked is higher or lower than your guess. Return the number that was picked.",
        "An integer <code>n</code>.", "The picked number.",
        ["1 <= n <= 2^31 - 1"],
        "n = 10, pick = 6", "6", "Binary search finds 6 in log2(10) guesses.",
        "n = 1, pick = 1", "1", "Single choice.",
        "Binary search the range [1, n].",
        "Compute mid = left + (right - left) / 2.",
        "Call guess(mid). If guess returns 0, return mid. If -1, right = mid - 1. If 1, left = mid + 1.",
        "int guessNumber(int n)", "1", "53.2%", 18700
    ))

    # Pattern: Lower and Upper Bound
    problems.append(make_prob(
        "search-insert-position", "Search Insert Position", "Easy", "Binary Search", "Lower and Upper Bound",
        "Return the index if the target is found, or the index where it would be if inserted in order.",
        "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with <code>O(log n)</code> runtime complexity.",
        "A sorted integer array <code>nums</code> and an integer <code>target</code>.", "Index where target is found or should be inserted.",
        ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums contains distinct values sorted in ascending order."],
        "nums = [1,3,5,6], target = 5", "2", "5 is found at index 2.",
        "nums = [1,3,5,6], target = 2", "1", "2 should be inserted at index 1.",
        "This is finding the lower bound (the first position where nums[i] >= target).",
        "Maintain left = 0 and right = nums.length - 1.",
        "If nums[mid] >= target, narrow right to mid - 1. Otherwise left = mid + 1. When loop terminates, left is the exact insertion index.",
        "int searchInsert(int[] nums, int target)", "0", "45.8%", 28900
    ))

    problems.append(make_prob(
        "find-first-and-last-position", "Find First and Last Position of Element in Sorted Array", "Medium", "Binary Search", "Lower and Upper Bound",
        "Find the starting and ending position of a given target value in a sorted array.",
        "Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value. If <code>target</code> is not found in the array, return <code>[-1, -1]</code>. You must write an algorithm with <code>O(log n)</code> runtime complexity.",
        "A sorted integer array <code>nums</code> and an integer <code>target</code>.", "Integer array [firstIndex, lastIndex].",
        ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "nums is a non-decreasing array."],
        "nums = [5,7,7,8,8,10], target = 8", "[3,4]", "8 first appears at index 3 and last at index 4.",
        "nums = [5,7,7,8,8,10], target = 6", "[-1,-1]", "6 does not exist in nums.",
        "Run binary search twice: once to find the leftmost (first) occurrence, and once to find the rightmost (last) occurrence.",
        "To find the leftmost index, when nums[mid] == target, continue searching left by setting right = mid - 1 while recording mid.",
        "To find the rightmost index, when nums[mid] == target, continue searching right by setting left = mid + 1 while recording mid.",
        "int[] searchRange(int[] nums, int target)", "new int[]{-1, -1}", "43.1%", 19400
    ))

    # Pattern: Search in Rotated Arrays
    problems.append(make_prob(
        "search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "Medium", "Binary Search", "Search in Rotated Arrays",
        "Search a target in a sorted array that was rotated at an unknown pivot in O(log n) time.",
        "There is an integer array <code>nums</code> sorted in ascending order (with distinct values). Prior to being passed to your function, <code>nums</code> is possibly rotated at an unknown pivot index <code>k</code>. Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.",
        "A rotated sorted integer array <code>nums</code> and target integer.", "Index of target or -1.",
        ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique."],
        "nums = [4,5,6,7,0,1,2], target = 0", "4", "0 is at index 4 in rotated array.",
        "nums = [4,5,6,7,0,1,2], target = 3", "-1", "3 does not exist.",
        "Notice that if you split a rotated sorted array in half, at least one of the two halves is always normally sorted!",
        "Check which half is sorted: if nums[left] <= nums[mid], the left half is sorted. Otherwise the right half is sorted.",
        "Check if target lies within the boundaries of the sorted half. If yes, search that half; otherwise search the other half.",
        "int search(int[] nums, int target)", "-1", "40.1%", 22800
    ))

    problems.append(make_prob(
        "find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", "Medium", "Binary Search", "Search in Rotated Arrays",
        "Find the minimum element in a sorted rotated array in O(log n) time.",
        "Suppose an array of length <code>n</code> sorted in ascending order is rotated between <code>1</code> and <code>n</code> times. Given the sorted rotated array <code>nums</code> of unique elements, return the minimum element of this array. You must write an algorithm that runs in <code>O(log n)</code> time.",
        "A rotated sorted array <code>nums</code>.", "The minimum integer in the array.",
        ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All the integers of nums are unique."],
        "nums = [3,4,5,1,2]", "1", "The original array was [1,2,3,4,5] rotated 3 times.",
        "nums = [4,5,6,7,0,1,2]", "0", "0 is the minimum element.",
        "Compare nums[mid] with the last element nums[right].",
        "If nums[mid] > nums[right], the minimum must be in the right half (left = mid + 1).",
        "If nums[mid] <= nums[right], mid could be the minimum, so set right = mid. When left == right, nums[left] is the minimum.",
        "int findMin(int[] nums)", "0", "49.8%", 18300
    ))

    # Pattern: Binary Search on Answer
    problems.append(make_prob(
        "koko-eating-bananas", "Koko Eating Bananas", "Medium", "Binary Search", "Binary Search on Answer",
        "Find the minimum integer eating speed k such that Koko can eat all bananas within h hours.",
        "Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>i</code>-th pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours. Koko can decide her bananas-per-hour eating speed of <code>k</code>. Each hour, she chooses some pile of bananas and eats <code>k</code> bananas from that pile. If the pile has less than <code>k</code> bananas, she eats all of them instead and will not eat any more bananas during this hour. Return the minimum integer <code>k</code> such that she can eat all the bananas within <code>h</code> hours.",
        "An integer array <code>piles</code> and integer <code>h</code>.", "Minimum integer eating speed k.",
        ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"],
        "piles = [3,6,7,11], h = 8", "4", "At speed 4, hours required is ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8.",
        "piles = [30,11,23,4,20], h = 5", "30", "Speed must equal max pile to finish in 5 hours.",
        "The eating speed k ranges from 1 to max(piles). Notice that the hours required is monotonically decreasing with speed k.",
        "Binary search the speed k in the range [1, max(piles)].",
        "For a candidate speed mid, compute total hours = sum(ceil(pile / (double)mid)). If total <= h, try smaller speed (right = mid); otherwise left = mid + 1.",
        "int minEatingSpeed(int[] piles, int h)", "1", "51.8%", 16400
    ))

    problems.append(make_prob(
        "capacity-to-ship-packages", "Capacity To Ship Packages Within D Days", "Medium", "Binary Search", "Binary Search on Answer",
        "Find the least weight capacity of the boat to ship all packages within days.",
        "A conveyor belt has packages that must be shipped from one port to another within <code>days</code> days. The <code>i</code>-th package on the conveyor belt has a weight of <code>weights[i]</code>. Each day, we load the ship with packages on the conveyor belt (in the order given by <code>weights</code>). We may not load more weight than the maximum weight capacity of the ship. Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within <code>days</code> days.",
        "An integer array <code>weights</code> and integer <code>days</code>.", "Minimum weight capacity.",
        ["1 <= days <= weights.length <= 5 * 10^4", "1 <= weights[i] <= 500"],
        "weights = [1,2,3,4,5,6,7,8,9,10], days = 5", "15", "A ship capacity of 15 allows shipping within 5 days.",
        "weights = [3,2,2,4,1,4], days = 3", "6", "Capacity of 6 ships in 3 days.",
        "The minimum possible capacity is max(weights) (can ship the heaviest item). The maximum is sum(weights) (ships everything in 1 day).",
        "Binary search the capacity in [max(weights), sum(weights)].",
        "Test if a capacity mid can ship within days: greedily accumulate weights until exceeding mid, then increment days. Adjust left/right accordingly.",
        "int shipWithinDays(int[] weights, int days)", "0", "69.1%", 13200
    ))

    problems.append(make_prob(
        "split-array-largest-sum", "Split Array Largest Sum", "Hard", "Binary Search", "Binary Search on Answer",
        "Split nums into k non-empty subarrays to minimize the largest sum among these subarrays.",
        "Given an integer array <code>nums</code> and an integer <code>k</code>, split <code>nums</code> into <code>k</code> non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum of the split. A subarray is a contiguous part of the array.",
        "An integer array <code>nums</code> and integer <code>k</code>.", "Minimized largest subarray sum.",
        ["1 <= nums.length <= 1000", "0 <= nums[i] <= 10^6", "1 <= k <= min(50, nums.length)"],
        "nums = [7,2,5,10,8], k = 2", "18", "Best split is [7,2,5] and [10,8], largest sum is 18.",
        "nums = [1,2,3,4,5], k = 2", "9", "Best split is [1,2,3] and [4,5], max sum 9.",
        "The answer must be between max(nums) and sum(nums). Can we binary search on the answer?",
        "If we guess that the maximum subarray sum is mid, we can count how many subarrays are required using a greedy pass.",
        "If count <= k, mid is achievable—try smaller (right = mid). If count > k, mid is too small (left = mid + 1). Return left.",
        "int splitArray(int[] nums, int k)", "0", "54.9%", 8900
    ))

    return problems

