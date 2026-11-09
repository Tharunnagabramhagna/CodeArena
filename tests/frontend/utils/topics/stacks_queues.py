# stacks_queues.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: Monotonic Stack
    problems.append(make_prob(
        "daily-temperatures", "Daily Temperatures", "Medium", "Stacks and Queues", "Monotonic Stack",
        "Return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
        "Given an array of integers <code>temperatures</code> represents the daily temperatures, return an array <code>answer</code> such that <code>answer[i]</code> is the number of days you have to wait after the <code>i</code>-th day to get a warmer temperature. If there is no future day for which this is possible, keep <code>answer[i] == 0</code> instead.",
        "An integer array <code>temperatures</code>.", "An integer array of wait days.",
        ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
        "temperatures = [73,74,75,71,69,72,76,73]", "[1,1,4,2,1,1,0,0]", "Days until a warmer temperature occurs.",
        "temperatures = [30,40,50,60]", "[1,1,1,0]", "Each day is followed immediately by a warmer temperature except the last.",
        "A monotonic decreasing stack keeps track of indices of temperatures that haven't found a warmer day yet.",
        "Store indices in a stack. When a temperature higher than stack.peek() arrives, you found the warmer day for the peeked index!",
        "Iterate i from 0 to n - 1. While !stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]: int prev = stack.pop(); ans[prev] = i - prev. Then stack.push(i).",
        "int[] dailyTemperatures(int[] temperatures)", "new int[]{}", "66.3%", 20100
    ))

    problems.append(make_prob(
        "next-greater-element-i", "Next Greater Element I", "Easy", "Stacks and Queues", "Monotonic Stack",
        "Find the next greater element for each value in nums1 within nums2.",
        "The next greater element of some element <code>x</code> in an array is the first greater element that is to the right of <code>x</code> in the same array. You are given two distinct 0-indexed integer arrays <code>nums1</code> and <code>nums2</code>, where <code>nums1</code> is a subset of <code>nums2</code>. For each <code>0 <= i < nums1.length</code>, find the index <code>j</code> such that <code>nums1[i] == nums2[j]</code> and determine the next greater element of <code>nums2[j]</code> in <code>nums2</code>.",
        "Two integer arrays <code>nums1</code> and <code>nums2</code>.", "Integer array of next greater elements.",
        ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 10^4", "All integers in nums1 and nums2 are unique."],
        "nums1 = [4,1,2], nums2 = [1,3,4,2]", "[-1,3,-1]", "For 4, no greater element (-1). For 1, next greater is 3. For 2, no greater (-1).",
        "nums1 = [2,4], nums2 = [1,2,3,4]", "[3,-1]", "Next greater for 2 is 3, for 4 is -1.",
        "Precompute the next greater element for all elements in nums2 first.",
        "Use a monotonic stack and a HashMap<Integer, Integer> to map each element in nums2 to its next greater element.",
        "Traverse nums2. While !stack.isEmpty() && num > stack.peek(): map.put(stack.pop(), num). Then push num. For remaining elements in stack, map to -1. Finally lookup nums1 in map.",
        "int[] nextGreaterElement(int[] nums1, int[] nums2)", "new int[]{}", "71.4%", 17400
    ))

    problems.append(make_prob(
        "largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "Hard", "Stacks and Queues", "Monotonic Stack",
        "Find the area of the largest rectangle in the histogram.",
        "Given an array of integers <code>heights</code> representing the histogram's bar height where the width of each bar is <code>1</code>, return the area of the largest rectangle in the histogram.",
        "An integer array <code>heights</code>.", "The maximum rectangle area.",
        ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
        "heights = [2,1,5,6,2,3]", "10", "The largest rectangle has height 5 and width 2 (bars at index 2 and 3), giving area 10.",
        "heights = [2,4]", "4", "Largest rectangle has height 4 width 1 or height 2 width 2.",
        "For each bar of height h, how far can it extend to the left and to the right before hitting a shorter bar?",
        "A monotonic increasing stack can find the left and right boundaries for every bar in O(N) total time.",
        "Maintain a stack of indices with increasing heights. When a shorter bar is encountered, pop from stack: popped height * (i - stack.peek() - 1) is the rectangle area.",
        "int largestRectangleArea(int[] heights)", "0", "43.1%", 12500
    ))

    # Pattern: Balanced Parentheses
    problems.append(make_prob(
        "valid-parentheses", "Valid Parentheses", "Easy", "Stacks and Queues", "Balanced Parentheses",
        "Determine if the input string containing brackets is valid.",
        "Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and in the correct order, and every close bracket has a corresponding open bracket of the same type.",
        "A string <code>s</code> containing bracket characters.", "Boolean <code>true</code> if valid, <code>false</code> otherwise.",
        ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        "s = '()[]{}'", "true", "All bracket pairs open and close correctly.",
        "s = '(]'", "false", "Mismatched bracket types.",
        "A stack (LIFO) is the ideal data structure because the most recently opened bracket must be the first one closed.",
        "When encountering an opening bracket, push its expected closing bracket onto the stack.",
        "When encountering a closing bracket, check if stack is empty or if stack.pop() doesn't match the current character. At the end, stack must be empty.",
        "boolean isValid(String s)", "false", "40.3%", 35400
    ))

    problems.append(make_prob(
        "generate-parentheses", "Generate Parentheses", "Medium", "Stacks and Queues", "Balanced Parentheses",
        "Generate all combinations of well-formed parentheses for n pairs.",
        "Given <code>n</code> pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
        "An integer <code>n</code>.", "A list of valid parentheses combinations.",
        ["1 <= n <= 8"],
        "n = 3", "['((()))','(()())','(())()','()(())','()()()']", "All 5 well-formed combinations of 3 pairs.",
        "n = 1", "['()']", "Only one valid pair.",
        "Think recursively: at each step, you can either add '(' or ')'.",
        "You can add '(' as long as count(open) < n. You can add ')' only if count(close) < count(open).",
        "Use backtracking with a StringBuilder. Base case: when string length == 2 * n, add to results. Backtrack after each recursive call.",
        "java.util.List<String> generateParenthesis(int n)", "new java.util.ArrayList<>()", "73.2%", 22800
    ))

    problems.append(make_prob(
        "minimum-remove-to-make-valid-parentheses", "Minimum Remove to Make Valid Parentheses", "Medium", "Stacks and Queues", "Balanced Parentheses",
        "Remove the minimum number of parentheses to make string valid.",
        "Given a string <code>s</code> of <code>'('</code> , <code>')'</code> and lowercase English characters. Your task is to remove the minimum number of parentheses (<code>'('</code> or <code>')'</code>, in any positions) so that the resulting parentheses string is valid and return any valid string.",
        "A string <code>s</code>.", "A valid parentheses string.",
        ["1 <= s.length <= 10^5", "s[i] is either '(', ')', or lowercase English letter."],
        "s = 'lee(t(c)o)de)'", "'lee(t(c)o)de'", "The last ')' is removed.",
        "s = 'a)b(c)d'", "'ab(c)d'", "First ')' removed.",
        "Keep track of the indices of invalid parentheses.",
        "Use a stack to record indices of unmatched '(' brackets. If a ')' has no matching '(' on the stack, mark its index for deletion.",
        "At the end of traversal, any '(' indices remaining in the stack must also be removed. Build the final string excluding marked indices.",
        "String minRemoveToMakeValid(String s)", "s", "66.5%", 13900
    ))

    # Pattern: Next Greater Element
    problems.append(make_prob(
        "next-greater-element-ii", "Next Greater Element II", "Medium", "Stacks and Queues", "Next Greater Element",
        "Find the next greater element for each element in a circular array.",
        "Given a circular integer array <code>nums</code> (i.e., the next element of <code>nums[nums.length - 1]</code> is <code>nums[0]</code>), return the next greater number for every element in <code>nums</code>. The next greater number of a number <code>x</code> is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number.",
        "An integer array <code>nums</code>.", "Integer array of next greater elements in circular order.",
        ["1 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
        "nums = [1,2,1]", "[2,-1,2]", "For 1, next is 2. For 2, no greater (-1). For circular 1, next is 2.",
        "nums = [1,2,3,4,3]", "[2,3,4,-1,4]", "Circular search resolves remaining elements.",
        "To simulate a circular array without actual concatenation, loop up to 2 * n - 1 and access elements using i % n.",
        "Maintain a monotonic decreasing stack of indices.",
        "Loop i from 0 to 2 * n - 1. While !stack.isEmpty() && nums[i % n] > nums[stack.peek()]: res[stack.pop()] = nums[i % n]. If i < n, push i to stack.",
        "int[] nextGreaterElements(int[] nums)", "new int[]{}", "63.4%", 15100
    ))

    problems.append(make_prob(
        "online-stock-span", "Online Stock Span", "Medium", "Stacks and Queues", "Next Greater Element",
        "Calculate the span of stock prices for consecutive days less than or equal to today.",
        "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span of the stock's price in one day is the maximum number of consecutive days (starting from today and going backward) for which the stock price was less than or equal to the price of that day.",
        "Method calls to <code>next(int price)</code>.", "Span integer for today's price.",
        ["1 <= price <= 10^5", "At most 10^4 calls will be made to next."],
        "prices = [100, 80, 60, 70, 60, 75, 85]", "[1, 1, 1, 2, 1, 4, 6]", "Spans computed per day.",
        "prices = [31, 41, 48, 59, 79]", "[1, 2, 3, 4, 5]", "Each strictly increasing day accumulates previous spans.",
        "Instead of storing raw prices and scanning back, can you store price and accumulated span together?",
        "Use a monotonic decreasing stack where each entry is an [price, span] pair.",
        "When next(price) is called, initialize span = 1. While !stack.isEmpty() && stack.peek()[0] <= price: span += stack.pop()[1]. Push [price, span] and return span.",
        "int next(int price)", "1", "65.1%", 11200
    ))

    # Pattern: Queue Simulation
    problems.append(make_prob(
        "implement-queue-using-stacks", "Implement Queue using Stacks", "Easy", "Stacks and Queues", "Queue Simulation",
        "Implement a first in first out (FIFO) queue using only two stacks.",
        "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (<code>push</code>, <code>peek</code>, <code>pop</code>, and <code>empty</code>).",
        "Operations on MyQueue.", "Results of peek, pop, empty.",
        ["1 <= x <= 9", "At most 100 calls will be made to push, pop, peek, and empty."],
        "operations = ['push 1', 'push 2', 'peek', 'pop', 'empty']", "[null, null, 1, 1, false]", "FIFO behavior demonstrated.",
        "operations = ['push 5', 'empty']", "[null, false]", "Queue not empty after push.",
        "One stack is used for incoming pushes, and the second stack is used for outgoing pops.",
        "Keep pushStack for incoming elements and popStack for outgoing elements.",
        "In pop/peek: if popStack is empty, transfer all elements from pushStack to popStack (reversing their order to FIFO!). Then pop/peek from popStack.",
        "int pop()", "0", "64.1%", 23800
    ))

    problems.append(make_prob(
        "number-of-recent-calls", "Number of Recent Calls", "Easy", "Stacks and Queues", "Queue Simulation",
        "Count the number of recent requests within a 3000 milliseconds time frame.",
        "You have a <code>RecentCounter</code> class which counts the number of recent requests within a certain time frame. Implement the <code>RecentCounter</code> class: <code>int ping(int t)</code> adds a new request at time <code>t</code>, where <code>t</code> represents some time in milliseconds, and returns the number of requests that have happened in the past <code>3000</code> milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range <code>[t - 3000, t]</code>.",
        "Calls to <code>ping(int t)</code>.", "Number of pings in [t - 3000, t].",
        ["1 <= t <= 10^9", "Each test case will call ping with strictly increasing values of t."],
        "inputs = [1, 100, 3001, 3002]", "[1, 2, 3, 3]", "At t=3002, t=1 is older than 3002 - 3000 = 2, so it is evicted, leaving 3 pings.",
        "inputs = [1, 2, 3]", "[1, 2, 3]", "All pings within 3000ms window.",
        "Because timestamps t are strictly increasing, a Queue (FIFO) is the natural fit.",
        "Add incoming timestamp t to the end of a Queue<Integer>.",
        "While queue.peek() < t - 3000, pop/poll elements from the front of the queue. Return queue.size().",
        "int ping(int t)", "0", "73.9%", 18700
    ))

    # Pattern: Deque Applications
    problems.append(make_prob(
        "sliding-window-maximum", "Sliding Window Maximum", "Hard", "Stacks and Queues", "Deque Applications",
        "Return the max sliding window of size k moving from very left to very right.",
        "You are given an array of integers <code>nums</code>, there is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
        "An integer array <code>nums</code> and window size <code>k</code>.", "An array of the maximum value in each window.",
        ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
        "nums = [1,3,-1,-3,5,3,6,7], k = 3", "[3,3,5,5,6,7]", "Max values observed per window of size 3.",
        "nums = [1], k = 1", "[1]", "Single element window.",
        "We need an O(1) way to find the maximum in the window while elements are added and removed.",
        "A monotonic decreasing Deque storing indices can maintain the maximum element at deque.peekFirst().",
        "For each i: remove indices out of window (deque.peekFirst() <= i - k). Pop from back while nums[deque.peekLast()] <= nums[i]. Push i to back. If i >= k - 1, record nums[deque.peekFirst()].",
        "int[] maxSlidingWindow(int[] nums, int k)", "new int[]{}", "46.5%", 14900
    ))

    problems.append(make_prob(
        "design-circular-deque", "Design Circular Deque", "Medium", "Stacks and Queues", "Deque Applications",
        "Design your implementation of the circular double-ended queue (deque).",
        "Design your implementation of the circular double-ended queue (deque). Implement the <code>MyCircularDeque</code> class with <code>insertFront</code>, <code>insertLast</code>, <code>deleteFront</code>, <code>deleteLast</code>, <code>getFront</code>, <code>getRear</code>, <code>isEmpty</code>, and <code>isFull</code>.",
        "Operations on MyCircularDeque of size k.", "Return values per operation.",
        ["1 <= k <= 1000", "0 <= value <= 1000", "At most 2000 calls will be made."],
        "ops = ['insertLast 1', 'insertLast 2', 'insertFront 3', 'getRear']", "[true, true, true, 2]", "Double ended queue operations.",
        "ops = ['isEmpty', 'isFull']", "[true, false]", "Initial empty state.",
        "Use a fixed-size array of size k and maintain front and rear pointers.",
        "To handle circular wrapping, update indices using modulo arithmetic: (front - 1 + k) % k for front insertion and (rear + 1) % k for rear insertion.",
        "Track current size to differentiate between completely empty and completely full states.",
        "boolean insertFront(int value)", "false", "56.8%", 8700
    ))

    return problems

