# heaps.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: Top K Elements
    problems.append(make_prob(
        "kth-largest-element-in-array", "Kth Largest Element in an Array", "Medium", "Heaps and Priority Queues", "Top K Elements",
        "Find the kth largest element in an unsorted array without full sorting.",
        "Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code>-th largest element in the array. Note that it is the <code>k</code>-th largest element in the sorted order, not the <code>k</code>-th distinct element. Can you solve it without sorting in O(N) average time?",
        "An integer array <code>nums</code> and integer <code>k</code>.", "The kth largest integer.",
        ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        "nums = [3,2,1,5,6,4], k = 2", "5", "Sorted order is [1,2,3,4,5,6], 2nd largest is 5.",
        "nums = [3,2,3,1,2,4,5,5,6], k = 4", "4", "4th largest element is 4.",
        "A min-heap of size k keeps the k largest elements seen so far at all times.",
        "Initialize a PriorityQueue<Integer> (min-heap by default in Java).",
        "Offer each num to heap. If heap.size() > k, heap.poll(). At the end, heap.peek() is the kth largest element in O(N log k) time. (QuickSelect achieves O(N)).",
        "int findKthLargest(int[] nums, int k)", "0", "67.1%", 25400
    ))

    problems.append(make_prob(
        "top-k-frequent-words", "Top K Frequent Words", "Medium", "Heaps and Priority Queues", "Top K Elements",
        "Return the k most frequent strings sorted by frequency from highest to lowest, breaking ties by alphabetical order.",
        "Given an array of strings <code>words</code> and an integer <code>k</code>, return the <code>k</code> most frequent strings. Return the answer sorted by the frequency from highest to lowest. Sort the words with the same frequency by their lexicographical order.",
        "An array of strings <code>words</code> and integer <code>k</code>.", "List of top k frequent strings.",
        ["1 <= words.length <= 500", "1 <= words[i].length <= 10", "words[i] consists of lowercase English letters.", "k is in the range [1, unique words]."],
        "words = ['i','love','leetcode','i','love','coding'], k = 2", "['i','love']", "'i' and 'love' are the two most frequent words.",
        "words = ['the','day','is','sunny','the','the','the','sunny','is','is'], k = 4", "['the','is','sunny','day']", "Ties broken alphabetically.",
        "Count word frequencies with a HashMap first.",
        "Use a PriorityQueue with custom comparator: lower frequency comes first (so it gets polled out); for equal frequency, lexicographically greater comes first.",
        "Maintain heap size at k. Poll excess elements. Reverse the remaining heap elements to build the final list.",
        "java.util.List<String> topKFrequent(String[] words, int k)", "new java.util.ArrayList<>()", "58.4%", 12800
    ))

    # Pattern: Kth Largest/Smallest
    problems.append(make_prob(
        "kth-largest-element-in-stream", "Kth Largest Element in a Stream", "Easy", "Heaps and Priority Queues", "Kth Largest/Smallest",
        "Design a class to find the kth largest element in a stream.",
        "Design a class to find the <code>k</code>-th largest element in a stream. Note that it is the <code>k</code>-th largest element in the sorted order, not the <code>k</code>-th distinct element. Implement <code>KthLargest</code> class: <code>KthLargest(int k, int[] nums)</code> initializes the object and <code>int add(int val)</code> appends <code>val</code> and returns the <code>k</code>-th largest element.",
        "Constructor with <code>k, nums</code> and stream calls to <code>add(val)</code>.", "Kth largest element per call.",
        ["1 <= k <= 10^4", "0 <= nums.length <= 10^4", "-10^4 <= nums[i], val <= 10^4"],
        "k = 3, nums = [4, 5, 8, 2], adds = [3, 5, 10, 9, 4]", "[4, 5, 5, 8, 8]", "Returns 3rd largest value at each step.",
        "k = 1, nums = [], adds = [-3, -2, -4, 0, 4]", "[-3, -2, -2, 0, 4]", "Returns maximum at each step.",
        "A min-heap of capacity k will always have the kth largest element right at the top (heap.peek()).",
        "In the constructor, add all elements into a min-heap PriorityQueue and poll until size is at most k.",
        "In add(val): offer val. If size > k, poll(). Return heap.peek().",
        "int add(int val)", "0", "57.8%", 17600
    ))

    problems.append(make_prob(
        "find-k-pairs-with-smallest-sums", "Find K Pairs with Smallest Sums", "Medium", "Heaps and Priority Queues", "Kth Largest/Smallest",
        "Find the k pairs with the smallest sums from two non-decreasing sorted arrays.",
        "You are given two integer arrays <code>nums1</code> and <code>nums2</code> sorted in non-decreasing order and an integer <code>k</code>. Define a pair <code>(u, v)</code> which consists of one element from the first array and one element from the second array. Return the <code>k</code> pairs <code>(u1, v1), (u2, v2), ..., (uk, vk)</code> with the smallest sums.",
        "Two sorted arrays <code>nums1, nums2</code> and integer <code>k</code>.", "List of k smallest sum pairs.",
        ["1 <= nums1.length, nums2.length <= 10^5", "-10^9 <= nums1[i], nums2[i] <= 10^9", "1 <= k <= 10^4"],
        "nums1 = [1,7,11], nums2 = [2,4,6], k = 3", "[[1,2],[1,4],[1,6]]", "The first 3 pairs are returned from the sequence.",
        "nums1 = [1,1,2], nums2 = [1,2,3], k = 2", "[[1,1],[1,1]]", "Smallest sums are 1+1=2 and 1+1=2.",
        "Since both arrays are sorted, the smallest pair is (nums1[0], nums2[0]).",
        "Use a min-heap storing tuples: [sum, indexInNums1, indexInNums2].",
        "Initialize heap with pairs (nums1[i], nums2[0]) for i in 0 to min(k, nums1.length - 1). Repeatedly poll min pair, and if indexInNums2 + 1 < nums2.length, push (nums1[i], nums2[indexInNums2 + 1]).",
        "java.util.List<java.util.List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k)", "new java.util.ArrayList<>()", "40.9%", 11200
    ))

    # Pattern: Two Heaps
    problems.append(make_prob(
        "find-median-from-data-stream", "Find Median from Data Stream", "Hard", "Heaps and Priority Queues", "Two Heaps",
        "Design a data structure that calculates the median of a stream of integers in O(log n) time.",
        "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the <code>MedianFinder</code> class: <code>addNum(int num)</code> adds the integer into the data structure, and <code>findMedian()</code> returns the median of all elements so far.",
        "Stream of <code>addNum</code> and <code>findMedian</code> calls.", "Median as double.",
        ["-10^5 <= num <= 10^5", "At most 5 * 10^4 calls will be made to addNum and findMedian."],
        "adds = [1, 2], findMedian, add 3, findMedian", "[1.5, 2.0]", "Median of [1,2] is 1.5, median of [1,2,3] is 2.0.",
        "adds = [5], findMedian", "[5.0]", "Single element median is 5.0.",
        "Divide the numbers into two halves: the smaller half and the larger half.",
        "Use a max-heap for the smaller half and a min-heap for the larger half.",
        "Balance sizes: max-heap holds either equal size or 1 more element than min-heap. If total size is odd, median is maxHeap.peek(). If even, median is (maxHeap.peek() + minHeap.peek()) / 2.0.",
        "double findMedian()", "0.0", "52.4%", 15600
    ))

    problems.append(make_prob(
        "sliding-window-median", "Sliding Window Median", "Hard", "Heaps and Priority Queues", "Two Heaps",
        "Calculate the median of each sliding window of size k moving across the array.",
        "Given an integer array <code>nums</code> and an integer <code>k</code>. There is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position. Return the median array for each window in the original array.",
        "An integer array <code>nums</code> and window size <code>k</code>.", "An array of doubles representing medians.",
        ["1 <= k <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
        "nums = [1,3,-1,-3,5,3,6,7], k = 3", "[1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]", "Medians of consecutive size 3 windows.",
        "nums = [1,2,3,4,2,3,1,4,2], k = 3", "[2.00000,3.00000,3.00000,3.00000,2.00000,3.00000,2.00000]", "Medians per window.",
        "Extend the Two Heaps approach with lazy deletion for elements falling out of the window.",
        "Maintain a max-heap for small values and a min-heap for large values, along with a hash map of delayed deletions.",
        "When removing an element out of the window, increment its count in the delayed deletion map and rebalance heaps lazily.",
        "double[] medianSlidingWindow(int[] nums, int k)", "new double[]{}", "40.9%", 7800
    ))

    # Pattern: Merge K Sorted Structures
    problems.append(make_prob(
        "merge-k-sorted-lists", "Merge K Sorted Lists", "Hard", "Heaps and Priority Queues", "Merge K Sorted Structures",
        "Merge k sorted linked lists and return it as one sorted list.",
        "You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        "An array of <code>k</code> sorted linked-list heads.", "Head of the merged single sorted linked list.",
        ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "lists[i] is sorted in ascending order."],
        "lists = [[1,4,5],[1,3,4],[2,6]]", "[1,1,2,3,4,4,5,6]", "Merged sorted sequence.",
        "lists = []", "[]", "Empty input.",
        "At any moment, the next node in the merged list must be the smallest node among the current heads of the k lists.",
        "A min-heap (PriorityQueue) holding the current head of each non-empty list provides the minimum in O(log k) time.",
        "Add all initial heads to the heap. While heap is not empty, poll the smallest node, attach it to merged list, and if smallest.next != null, offer smallest.next to the heap.",
        "ListNode mergeKLists(ListNode[] lists)", "null", "52.8%", 18300
    ))

    problems.append(make_prob(
        "smallest-range-covering-elements-from-k-lists", "Smallest Range Covering Elements from K Lists", "Hard", "Heaps and Priority Queues", "Merge K Sorted Structures",
        "Find the smallest range [a, b] that includes at least one number from each of the k lists.",
        "You have <code>k</code> lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the <code>k</code> lists. We define the range <code>[a, b]</code> is smaller than range <code>[c, d]</code> if <code>b - a < d - c</code> or <code>a < c</code> if <code>b - a == d - c</code>.",
        "A list of <code>k</code> sorted integer lists.", "Array [start, end] of smallest range.",
        ["nums.length == k", "1 <= k <= 3500", "1 <= nums[i].length <= 50", "-10^5 <= nums[i][j] <= 10^5", "nums[i] is sorted."],
        "nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", "[20,24]", "Range [20, 24] covers 24 (list 1), 20 (list 2), 22 (list 3).",
        "nums = [[1,2,3],[1,2,3],[1,2,3]]", "[1,1]", "Range [1,1] covers all three lists.",
        "Maintain one element from each of the k lists in a min-heap simultaneously.",
        "Track the current maximum value maxVal among the k elements, while heap.peek() gives the current minimum minVal. Current range is [minVal, maxVal].",
        "Poll the minimum element from the heap, update smallestRange if maxVal - minVal is smaller, and push the next element from that list. Stop when any list is exhausted.",
        "int[] smallestRange(java.util.List<java.util.List<Integer>> nums)", "new int[]{}", "62.7%", 8400
    ))

    return problems

