-- ============================================================================
-- CodeArena Seed: 03_dsa_problems_seed.sql
-- Description: Canonical 200 DSA problems, progressive 3-tier hints, sample
--              test cases, starter code, and pattern tags from frontend/js/api.js.
-- Target Engine: MySQL 8.0+ / InnoDB
-- ============================================================================

USE codearena_db;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- ----------------------------------------------------------------------------
-- 1. Insert 200 DSA Problems (IDs 101..300)
-- ----------------------------------------------------------------------------
INSERT INTO problems (
    id, track_id, category_id, difficulty_id, canonical_id, slug,
    problem_number, title, description, input_format, output_format,
    constraints, explanation, starter_code, is_premium, is_active,
    time_limit_ms, memory_limit_mb
) VALUES
(101, 2, 14, 1, 'find-pivot-index', 'find-pivot-index', 101, 'Find Pivot Index', '<p>Given an array of integers <code>nums</code>, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index''s right. If no such index exists, return <code>-1</code>. If there are multiple pivot indexes, return the left-most pivot index.</p>', 'An array of integers <code>nums</code>.', 'The 0-based pivot index or <code>-1</code>.', '["1 <= nums.length <= 10^4","-1000 <= nums[i] <= 1000"]', 'Calculate the pivot index where the sum of items to the left equals items to the right.', 'class Solution {
    public int pivotIndex(int[] nums) {
        // Write your solution below

        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(102, 2, 14, 1, 'plus-one', 'plus-one', 102, 'Plus One', '<p>You are given a large integer represented as an integer array <code>digits</code>, where each <code>digits[i]</code> is the <code>i</code>-th digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading zeros. Increment the large integer by one and return the resulting array of digits.</p>', 'An integer array <code>digits</code>.', 'The resulting integer array after adding one.', '["1 <= digits.length <= 100","0 <= digits[i] <= 9","digits does not contain leading 0s."]', 'Increment the large integer represented as an array of digits by one.', 'class Solution {
    public int[] plusOne(int[] digits) {
        // Write your solution below

        return new int[]{};
    }
}', FALSE, TRUE, 2000, 256),
(103, 2, 14, 1, 'two-sum', 'two-sum', 103, 'Two Sum', '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers such that they add up to <code>target</code>. You may assume that each input has <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.</p>', 'An integer array <code>nums</code> and an integer <code>target</code>.', 'An integer array <code>[i, j]</code> containing the indices of the two numbers.', '["2 <= nums.length <= 10^4","-10^9 <= nums[i] <= 10^9","-10^9 <= target <= 10^9","Only one valid answer exists."]', 'Find two numbers in an array that add up to a target.', 'class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution below

        return new int[]{};
    }
}', FALSE, TRUE, 2000, 256),
(104, 2, 14, 2, 'container-with-most-water', 'container-with-most-water', 104, 'Container With Most Water', '<p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i</code>-th line are <code>(i, 0)</code> and <code>(i, height[i])</code>. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.</p>', 'An array of integers <code>height</code>.', 'The maximum volume of water.', '["n == height.length","2 <= n <= 10^5","0 <= height[i] <= 10^4"]', 'Find two vertical lines that together with the x-axis form a container holding the most water.', 'class Solution {
    public int maxArea(int[] height) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(105, 2, 14, 3, 'trapping-rain-water', 'trapping-rain-water', 105, 'Trapping Rain Water', '<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>', 'An array of non-negative integers <code>height</code>.', 'Total volume of trapped rainwater.', '["n == height.length","1 <= n <= 2 * 10^4","0 <= height[i] <= 10^5"]', 'Compute how much water an elevation map can trap after raining.', 'class Solution {
    public int trap(int[] height) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(106, 2, 14, 2, 'three-sum', 'three-sum', 106, '3Sum', '<p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>. Notice that the solution set must not contain duplicate triplets.</p>', 'An integer array <code>nums</code>.', 'A list of unique integer triplets summing to zero.', '["3 <= nums.length <= 3000","-10^5 <= nums[i] <= 10^5"]', 'Find all unique triplets in the array which gives the sum of zero.', 'class Solution {
    public java.util.List<java.util.List<Integer>> threeSum(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(107, 2, 14, 1, 'maximum-average-subarray', 'maximum-average-subarray', 107, 'Maximum Average Subarray I', '<p>You are given an integer array <code>nums</code> consisting of <code>n</code> elements, and an integer <code>k</code>. Find a contiguous subarray whose length is equal to <code>k</code> that has the maximum average value and return this value. Any answer with a calculation error less than <code>10^-5</code> will be accepted.</p>', 'An integer array <code>nums</code> and integer <code>k</code>.', 'Maximum average as a double.', '["n == nums.length","1 <= k <= n <= 10^5","-10^4 <= nums[i] <= 10^4"]', 'Find a contiguous subarray whose length is equal to k that has the maximum average value.', 'class Solution {
    public double findMaxAverage(int[] nums, int k) {
        // Write your solution below

        return 0.0;
    }
}', FALSE, TRUE, 2000, 256),
(108, 2, 14, 2, 'minimum-size-subarray-sum', 'minimum-size-subarray-sum', 108, 'Minimum Size Subarray Sum', '<p>Given an array of positive integers <code>nums</code> and a positive integer <code>target</code>, return the minimal length of a contiguous subarray <code>[nums[l], nums[l+1], ..., nums[r-1], nums[r]]</code> of which the sum is greater than or equal to <code>target</code>. If there is no such subarray, return <code>0</code> instead.</p>', 'A positive integer <code>target</code> and positive integer array <code>nums</code>.', 'Minimum length of subarray, or <code>0</code>.', '["1 <= target <= 10^9","1 <= nums.length <= 10^5","1 <= nums[i] <= 10^4"]', 'Find the minimal length of a contiguous subarray of which the sum is greater than or equal to target.', 'class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(109, 2, 14, 1, 'range-sum-query-immutable', 'range-sum-query-immutable', 109, 'Range Sum Query - Immutable', '<p>Given an integer array <code>nums</code>, handle multiple queries of the following type: calculate the sum of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> inclusive where <code>left <= right</code>. Implement the <code>NumArray</code> class with a <code>sumRange(int left, int right)</code> method that runs in <code>O(1)</code> time per query.</p>', 'An array of integers <code>nums</code> and query bounds <code>left, right</code>.', 'Sum of elements between <code>left</code> and <code>right</code>.', '["1 <= nums.length <= 10^4","-10^5 <= nums[i] <= 10^5","0 <= left <= right < nums.length"]', 'Calculate the sum of the elements of nums between indices left and right inclusive.', 'class Solution {
    public int sumRange(int[] nums, int left, int right) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(110, 2, 14, 2, 'subarray-sum-equals-k', 'subarray-sum-equals-k', 110, 'Subarray Sum Equals K', '<p>Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of subarrays whose sum equals to <code>k</code>. A subarray is a contiguous non-empty sequence of elements within an array.</p>', 'An integer array <code>nums</code> and target sum <code>k</code>.', 'Number of continuous subarrays summing to <code>k</code>.', '["1 <= nums.length <= 2 * 10^4","-1000 <= nums[i] <= 1000","-10^7 <= k <= 10^7"]', 'Find the total number of continuous subarrays whose sum equals to k.', 'class Solution {
    public int subarraySum(int[] nums, int k) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(111, 2, 14, 2, 'maximum-subarray', 'maximum-subarray', 111, 'Maximum Subarray', '<p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.</p>', 'An integer array <code>nums</code>.', 'Maximum sum of a contiguous subarray.', '["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"]', 'Find the contiguous subarray with the largest sum.', 'class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(112, 2, 14, 2, 'maximum-sum-circular-subarray', 'maximum-sum-circular-subarray', 112, 'Maximum Sum Circular Subarray', '<p>Given a circular integer array <code>nums</code> of length <code>n</code>, return the maximum possible sum of a non-empty subarray of <code>nums</code>. A circular array means the end of the array connects to the beginning.</p>', 'An integer array <code>nums</code>.', 'Maximum subarray sum in circular array.', '["n == nums.length","1 <= n <= 3 * 10^4","-3 * 10^4 <= nums[i] <= 3 * 10^4"]', 'Find the maximum possible sum of a non-empty subarray of the circular array.', 'class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(113, 2, 14, 1, 'merge-sorted-array', 'merge-sorted-array', 113, 'Merge Sorted Array', '<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in non-decreasing order, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively. Merge <code>nums1</code> and <code>nums2</code> into a single array sorted in non-decreasing order. The array <code>nums1</code> has a length of <code>m + n</code>, where the last <code>n</code> elements are set to <code>0</code>.</p>', 'Arrays <code>nums1</code> (size m+n), <code>nums2</code> (size n), and integers <code>m, n</code>.', 'None (modify <code>nums1</code> in-place).', '["nums1.length == m + n","nums2.length == n","0 <= m, n <= 200","-10^9 <= nums1[i], nums2[j] <= 10^9"]', 'Merge two sorted integer arrays nums1 and nums2 into nums1 as one sorted array.', 'class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your solution below

        return ;
    }
}', FALSE, TRUE, 2000, 256),
(114, 2, 14, 2, 'sort-colors', 'sort-colors', 114, 'Sort Colors', '<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue respectively. You must solve this problem without using the library''s sort function.</p>', 'An array <code>nums</code> containing 0, 1, and 2.', 'None (sort <code>nums</code> in-place).', '["n == nums.length","1 <= n <= 300","nums[i] is either 0, 1, or 2."]', 'Sort an array with 0s, 1s, and 2s in-place without using library sort.', 'class Solution {
    public void sortColors(int[] nums) {
        // Write your solution below

        return ;
    }
}', FALSE, TRUE, 2000, 256),
(115, 2, 14, 1, 'majority-element', 'majority-element', 115, 'Majority Element', '<p>Given an array <code>nums</code> of size <code>n</code>, return the majority element. The majority element is the element that appears more than <code>floor(n / 2)</code> times. You may assume that the majority element always exists in the array.</p>', 'An array of integers <code>nums</code>.', 'The majority integer.', '["n == nums.length","1 <= n <= 5 * 10^4","-10^9 <= nums[i] <= 10^9"]', 'Find the element that appears more than floor(n / 2) times in the array.', 'class Solution {
    public int majorityElement(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(116, 2, 14, 2, 'find-all-duplicates-in-array', 'find-all-duplicates-in-array', 116, 'Find All Duplicates in an Array', '<p>Given an integer array <code>nums</code> of length <code>n</code> where all the integers of <code>nums</code> are in the range <code>[1, n]</code> and each integer appears once or twice, return an array of all the integers that appears twice. You must write an algorithm that runs in <code>O(n)</code> time and uses only constant extra space.</p>', 'An integer array <code>nums</code>.', 'A list of integers that appear twice.', '["n == nums.length","1 <= n <= 10^5","1 <= nums[i] <= n"]', 'Find all the elements that appear twice in an array with integers from 1 to n.', 'class Solution {
    public java.util.List<Integer> findDuplicates(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(117, 2, 15, 1, 'length-of-last-word', 'length-of-last-word', 117, 'Length of Last Word', '<p>Given a string <code>s</code> consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.</p>', 'A string <code>s</code>.', 'Length of the last word.', '["1 <= s.length <= 10^4","s consists of only English letters and spaces '' ''."]', 'Return the length of the last word in the string consisting of non-space characters.', 'class Solution {
    public int lengthOfLastWord(String s) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(118, 2, 15, 1, 'defanging-ip-address', 'defanging-ip-address', 118, 'Defanging an IP Address', '<p>Given a valid (IPv4) IP <code>address</code>, return a defanged version of that IP address. A defanged IP address replaces every period <code>''.''</code> with <code>''[.]''</code>.</p>', 'A valid IPv4 <code>address</code> string.', 'The defanged IP address string.', '["The given address is a valid IPv4 address."]', 'Replace every period in an IPv4 IP address with [.]', 'class Solution {
    public String defangIPaddr(String address) {
        // Write your solution below

        return address;
    }
}', FALSE, TRUE, 2000, 256),
(119, 2, 15, 1, 'reverse-a-string', 'reverse-a-string', 119, 'Reverse a String', '<p>Write a function that reverses a character array <code>s</code> in-place. You must modify the input array directly with <code>O(1)</code> extra memory without allocating a new array.</p>', 'A character array <code>s</code>.', 'None (modify <code>s</code> in-place).', '["1 <= s.length <= 10^5","s[i] is a printable ASCII character."]', 'Reverse the given character array in-place.', 'class Solution {
    public void reverseString(char[] s) {
        // Write your solution below

        return ;
    }
}', FALSE, TRUE, 2000, 256),
(120, 2, 15, 1, 'valid-palindrome', 'valid-palindrome', 120, 'Valid Palindrome', '<p>A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.</p>', 'A string <code>s</code>.', 'Boolean <code>true</code> if palindrome, <code>false</code> otherwise.', '["1 <= s.length <= 2 * 10^5","s consists only of printable ASCII characters."]', 'Check if a string is a palindrome after converting all uppercase letters to lowercase and removing non-alphanumeric characters.', 'class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(121, 2, 15, 1, 'reverse-vowels-of-a-string', 'reverse-vowels-of-a-string', 121, 'Reverse Vowels of a String', '<p>Given a string <code>s</code>, reverse only all the vowels in the string and return it. The vowels are <code>''a''</code>, <code>''e''</code>, <code>''i''</code>, <code>''o''</code>, and <code>''u''</code>, and they can appear in both lower and upper cases, more than once.</p>', 'A string <code>s</code>.', 'String with vowels reversed.', '["1 <= s.length <= 3 * 10^5","s consists of printable ASCII characters."]', 'Reverse only the vowels in a given string and return it.', 'class Solution {
    public String reverseVowels(String s) {
        // Write your solution below

        return s;
    }
}', FALSE, TRUE, 2000, 256),
(122, 2, 15, 2, 'longest-substring', 'longest-substring', 122, 'Longest Substring Without Repeating Characters', '<p>Given a string <code>s</code>, find the length of the longest substring without duplicate characters.</p>', 'A string <code>s</code>.', 'The maximum length of a substring without repeating characters.', '["0 <= s.length <= 5 * 10^4","s consists of English letters, digits, symbols and spaces."]', 'Find the length of the longest substring without repeating characters.', 'class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(123, 2, 15, 2, 'permutation-in-string', 'permutation-in-string', 123, 'Permutation in String', '<p>Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code> if <code>s2</code> contains a permutation of <code>s1</code>, or <code>false</code> otherwise. In other words, return <code>true</code> if one of <code>s1</code>''s permutations is the substring of <code>s2</code>.</p>', 'Two strings <code>s1</code> and <code>s2</code>.', 'Boolean <code>true</code> if permutation found.', '["1 <= s1.length, s2.length <= 10^4","s1 and s2 consist of lowercase English letters."]', 'Check if s2 contains a permutation of s1.', 'class Solution {
    public boolean checkInclusion(String s1, String s2) {
        // Write your solution below

        return false;
    }
}', TRUE, TRUE, 2000, 256),
(124, 2, 15, 3, 'minimum-window-substring', 'minimum-window-substring', 124, 'Minimum Window Substring', '<p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If there is no such substring, return the empty string <code>''''</code>.</p>', 'Two strings <code>s</code> and <code>t</code>.', 'Minimum window substring.', '["m == s.length","n == t.length","1 <= m, n <= 10^5","s and t consist of uppercase and lowercase English letters."]', 'Find the minimum window substring of s that contains all characters in t.', 'class Solution {
    public String minWindow(String s, String t) {
        // Write your solution below

        return '''';
    }
}', TRUE, TRUE, 2000, 256),
(125, 2, 15, 1, 'find-index-of-first-occurrence', 'find-index-of-first-occurrence', 125, 'Find Index of First Occurrence in a String', '<p>Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.</p>', 'Two strings <code>haystack</code> and <code>needle</code>.', '0-based index or -1.', '["1 <= haystack.length, needle.length <= 10^4","haystack and needle consist of only lowercase English characters."]', 'Find the first occurrence of needle in haystack, or -1 if needle is not part of haystack.', 'class Solution {
    public int strStr(String haystack, String needle) {
        // Write your solution below

        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(126, 2, 15, 2, 'repeated-dna-sequences', 'repeated-dna-sequences', 126, 'Repeated DNA Sequences', '<p>The DNA sequence is composed of a series of nucleotides abbreviated as <code>''A''</code>, <code>''C''</code>, <code>''G''</code>, and <code>''T''</code>. When studying DNA, it is useful to identify repeated sequences within the DNA. Given a string <code>s</code> that represents a DNA sequence, return all the <code>10</code>-letter-long sequences (substrings) that occur more than once in a DNA molecule.</p>', 'A DNA string <code>s</code>.', 'List of 10-letter substrings occurring more than once.', '["1 <= s.length <= 10^5","s[i] is either ''A'', ''C'', ''G'', or ''T''."]', 'Find all 10-letter-long sequences that occur more than once in a DNA molecule.', 'class Solution {
    public java.util.List<String> findRepeatedDnaSequences(String s) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(127, 2, 15, 1, 'palindrome-number', 'palindrome-number', 127, 'Palindrome Number', '<p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise. An integer is a palindrome when it reads the same forward and backward.</p>', 'An integer <code>x</code>.', 'Boolean <code>true</code> if palindrome, <code>false</code> otherwise.', '["-2^31 <= x <= 2^31 - 1"]', 'Determine whether an integer is a palindrome without converting to string.', 'class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(128, 2, 15, 2, 'longest-palindromic-substring', 'longest-palindromic-substring', 128, 'Longest Palindromic Substring', '<p>Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>.</p>', 'A string <code>s</code>.', 'The longest palindromic substring.', '["1 <= s.length <= 1000","s consist of only digits and English letters."]', 'Find the longest palindromic substring in s.', 'class Solution {
    public String longestPalindrome(String s) {
        // Write your solution below

        return s;
    }
}', FALSE, TRUE, 2000, 256),
(129, 2, 15, 2, 'palindromic-substrings', 'palindromic-substrings', 129, 'Palindromic Substrings', '<p>Given a string <code>s</code>, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string.</p>', 'A string <code>s</code>.', 'Count of palindromic substrings.', '["1 <= s.length <= 1000","s consists of lowercase English letters."]', 'Count how many palindromic substrings are in the string.', 'class Solution {
    public int countSubstrings(String s) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(130, 2, 15, 1, 'valid-anagram', 'valid-anagram', 130, 'Valid Anagram', '<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>', 'Two strings <code>s</code> and <code>t</code>.', 'Boolean <code>true</code> if anagram.', '["1 <= s.length, t.length <= 5 * 10^4","s and t consist of lowercase English letters."]', 'Determine if t is an anagram of s.', 'class Solution {
    public boolean isAnagram(String s, String t) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(131, 2, 15, 1, 'first-unique-character-in-string', 'first-unique-character-in-string', 131, 'First Unique Character in a String', '<p>Given a string <code>s</code>, find the first non-repeating character in it and return its index. If it does not exist, return <code>-1</code>.</p>', 'A string <code>s</code>.', 'Index of first unique character or -1.', '["1 <= s.length <= 10^5","s consists of only lowercase English letters."]', 'Find the first non-repeating character in a string and return its index.', 'class Solution {
    public int firstUniqChar(String s) {
        // Write your solution below

        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(132, 2, 15, 2, 'group-anagrams', 'group-anagrams', 132, 'Group Anagrams', '<p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order.</p>', 'An array of strings <code>strs</code>.', 'List of grouped anagram string lists.', '["1 <= strs.length <= 10^4","0 <= strs[i].length <= 100","strs[i] consists of lowercase English letters."]', 'Group an array of strings into anagram groups.', 'class Solution {
    public java.util.List<java.util.List<String>> groupAnagrams(String[] strs) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(133, 2, 15, 2, 'string-to-integer-atoi', 'string-to-integer-atoi', 133, 'String to Integer (atoi)', '<p>Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer. Read in and ignore any leading whitespace. Check if the next character is ''-'' or ''+''. Read in next characters until the next non-digit character or end of input. Clamp to [-2^31, 2^31 - 1] if overflow occurs.</p>', 'A string <code>s</code>.', 'Parsed 32-bit signed integer.', '["0 <= s.length <= 200","s consists of English letters, digits, '' '', ''+'', ''-'', and ''.''."]', 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.', 'class Solution {
    public int myAtoi(String s) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(134, 2, 15, 1, 'longest-common-prefix', 'longest-common-prefix', 134, 'Longest Common Prefix', '<p>Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string <code>''''</code>.</p>', 'An array of strings <code>strs</code>.', 'Longest common prefix string.', '["1 <= strs.length <= 200","0 <= strs[i].length <= 200","strs[i] consists of only lowercase English letters."]', 'Find the longest common prefix string amongst an array of strings.', 'class Solution {
    public String longestCommonPrefix(String[] strs) {
        // Write your solution below

        return '''';
    }
}', FALSE, TRUE, 2000, 256),
(135, 2, 16, 1, 'ransom-note', 'ransom-note', 135, 'Ransom Note', '<p>Given two strings <code>ransomNote</code> and <code>magazine</code>, return <code>true</code> if <code>ransomNote</code> can be constructed by using the letters from <code>magazine</code> and <code>false</code> otherwise. Each letter in <code>magazine</code> can only be used once in <code>ransomNote</code>.</p>', 'Two strings <code>ransomNote</code> and <code>magazine</code>.', 'Boolean <code>true</code> if constructible.', '["1 <= ransomNote.length, magazine.length <= 10^5","ransomNote and magazine consist of lowercase English letters."]', 'Check if ransomNote can be constructed by using the letters from magazine.', 'class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(136, 2, 16, 1, 'isomorphic-strings', 'isomorphic-strings', 136, 'Isomorphic Strings', '<p>Given two strings <code>s</code> and <code>t</code>, determine if they are isomorphic. Two strings <code>s</code> and <code>t</code> are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.</p>', 'Two strings <code>s</code> and <code>t</code>.', 'Boolean <code>true</code> if isomorphic.', '["1 <= s.length <= 5 * 10^4","t.length == s.length","s and t consist of any valid ASCII character."]', 'Determine if two strings are isomorphic (characters in s can be replaced to get t).', 'class Solution {
    public boolean isIsomorphic(String s, String t) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(137, 2, 16, 1, 'word-pattern', 'word-pattern', 137, 'Word Pattern', '<p>Given a <code>pattern</code> and a string <code>s</code>, find if <code>s</code> follows the same pattern. Here follow means a full match, such that there is a bijection between a letter in <code>pattern</code> and a non-empty word in <code>s</code>.</p>', 'A string <code>pattern</code> and a string <code>s</code>.', 'Boolean <code>true</code> if s follows pattern.', '["1 <= pattern.length <= 300","1 <= s.length <= 3000","pattern contains only lowercase letters, s contains lowercase letters and spaces."]', 'Determine if a string s follows the pattern defined by characters.', 'class Solution {
    public boolean wordPattern(String pattern, String s) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(138, 2, 16, 1, 'contains-duplicate', 'contains-duplicate', 138, 'Contains Duplicate', '<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice in the array, and return <code>false</code> if every element is distinct.</p>', 'An integer array <code>nums</code>.', 'Boolean <code>true</code> if duplicate exists.', '["1 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9"]', 'Return true if any value appears at least twice in the array.', 'class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(139, 2, 16, 2, 'longest-consecutive-sequence', 'longest-consecutive-sequence', 139, 'Longest Consecutive Sequence', '<p>Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in <code>O(n)</code> time.</p>', 'An integer array <code>nums</code>.', 'Length of the longest consecutive sequence.', '["0 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9"]', 'Find the length of the longest consecutive elements sequence in O(n) time.', 'class Solution {
    public int longestConsecutive(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(140, 2, 16, 2, 'top-k-frequent-elements', 'top-k-frequent-elements', 140, 'Top K Frequent Elements', '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements. You may return the answer in any order.</p>', 'An integer array <code>nums</code> and integer <code>k</code>.', 'An array of the k most frequent integers.', '["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4","k is in the range [1, the number of unique elements in the array]."]', 'Return the k most frequent elements in an integer array.', 'class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Write your solution below

        return new int[]{};
    }
}', FALSE, TRUE, 2000, 256),
(141, 2, 16, 2, 'sort-characters-by-frequency', 'sort-characters-by-frequency', 141, 'Sort Characters By Frequency', '<p>Given a string <code>s</code>, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string. Return the sorted string. If there are multiple answers, return any of them.</p>', 'A string <code>s</code>.', 'String sorted by character frequencies.', '["1 <= s.length <= 5 * 10^5","s consists of uppercase and lowercase English letters and digits."]', 'Sort a string in decreasing order based on the frequency of the characters.', 'class Solution {
    public String frequencySort(String s) {
        // Write your solution below

        return s;
    }
}', FALSE, TRUE, 2000, 256),
(142, 2, 16, 2, 'find-duplicate-number', 'find-duplicate-number', 142, 'Find the Duplicate Number', '<p>Given an array of integers <code>nums</code> containing <code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive. There is only one repeated number in <code>nums</code>, return this repeated number. You must solve the problem without modifying the array <code>nums</code> and uses only constant extra space.</p>', 'An integer array <code>nums</code>.', 'The duplicate integer.', '["1 <= n <= 10^5","nums.length == n + 1","1 <= nums[i] <= n","All integers in nums appear only once except for precisely one integer which appears two or more times."]', 'Find the duplicate integer in an array containing n + 1 integers where each is between 1 and n.', 'class Solution {
    public int findDuplicate(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(143, 2, 16, 1, 'contains-duplicate-ii', 'contains-duplicate-ii', 143, 'Contains Duplicate II', '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> if there are two distinct indices <code>i</code> and <code>j</code> in the array such that <code>nums[i] == nums[j]</code> and <code>abs(i - j) <= k</code>.</p>', 'An integer array <code>nums</code> and integer <code>k</code>.', 'Boolean <code>true</code> if duplicate within distance k.', '["1 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9","0 <= k <= 10^5"]', 'Check if two duplicate values exist within index distance k.', 'class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(144, 2, 16, 2, 'two-sum-ii-input-array-is-sorted', 'two-sum-ii-input-array-is-sorted', 144, 'Two Sum II - Input Array Is Sorted', '<p>Given a 1-indexed array of integers <code>numbers</code> that is already sorted in non-decreasing order, find two numbers such that they add up to a specific <code>target</code> number. Return the indices of the two numbers, <code>index1</code> and <code>index2</code>, added by one as an integer array <code>[index1, index2]</code> of length 2.</p>', 'A 1-indexed sorted array <code>numbers</code> and integer <code>target</code>.', 'Integer array [index1, index2] with 1-based indexing.', '["2 <= numbers.length <= 3 * 10^4","-1000 <= numbers[i] <= 1000","numbers is sorted in non-decreasing order."]', 'Find two numbers in a 1-indexed sorted array that add up to target.', 'class Solution {
    public int[] twoSum(int[] numbers, int target) {
        // Write your solution below

        return new int[]{};
    }
}', FALSE, TRUE, 2000, 256),
(145, 2, 16, 2, 'four-sum', 'four-sum', 145, '4Sum', '<p>Given an array <code>nums</code> of <code>n</code> integers, return an array of all the unique quadruplets <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that <code>a, b, c, and d</code> are distinct and <code>nums[a] + nums[b] + nums[c] + nums[d] == target</code>. You may return the answer in any order.</p>', 'An integer array <code>nums</code> and integer <code>target</code>.', 'List of unique quadruplets.', '["1 <= nums.length <= 200","-10^9 <= nums[i] <= 10^9","-10^9 <= target <= 10^9"]', 'Find all unique quadruplets in the array which sum to target.', 'class Solution {
    public java.util.List<java.util.List<Integer>> fourSum(int[] nums, int target) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(146, 2, 17, 1, 'reverse-linked-list', 'reverse-linked-list', 146, 'Reverse Linked List', '<p>Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.</p>', 'The head node of a singly linked list.', 'The head node of the reversed linked list.', '["The number of nodes in the list is the range [0, 5000].","-5000 <= Node.val <= 5000"]', 'Reverse a singly linked list and return the reversed list.', 'class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(147, 2, 17, 2, 'reverse-linked-list-ii', 'reverse-linked-list-ii', 147, 'Reverse Linked List II', '<p>Given the <code>head</code> of a singly linked list and two integers <code>left</code> and <code>right</code> where <code>left <= right</code>, reverse the nodes of the list from position <code>left</code> to position <code>right</code>, and return the reversed list.</p>', 'Head node of linked list and 1-based bounds <code>left, right</code>.', 'Head node of modified linked list.', '["The number of nodes in the list is n.","1 <= n <= 500","-500 <= Node.val <= 500","1 <= left <= right <= n"]', 'Reverse the nodes of the list from position left to position right.', 'class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        // Write your solution below

        return head;
    }
}', FALSE, TRUE, 2000, 256),
(148, 2, 17, 3, 'reverse-nodes-in-k-group', 'reverse-nodes-in-k-group', 148, 'Reverse Nodes in k-Group', '<p>Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return the modified list. <code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then left-out nodes, in the end, should remain as it is.</p>', 'Head of list and integer <code>k</code>.', 'Modified linked list head.', '["The number of nodes in the list is n.","1 <= k <= n <= 5000","0 <= Node.val <= 1000"]', 'Reverse the nodes of a linked list k at a time and return its modified list.', 'class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        // Write your solution below

        return head;
    }
}', TRUE, TRUE, 2000, 256),
(149, 2, 17, 1, 'linked-list-cycle', 'linked-list-cycle', 149, 'Linked List Cycle', '<p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Return <code>true</code> if there is a cycle in the linked list. Otherwise, return <code>false</code>.</p>', 'The head of a singly linked list.', 'Boolean <code>true</code> if a cycle exists, <code>false</code> otherwise.', '["The number of the nodes in the list is in the range [0, 10^4].","-10^5 <= Node.val <= 10^5"]', 'Determine if the linked list has a cycle in it.', 'class Solution {
    public boolean hasCycle(ListNode head) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(150, 2, 17, 1, 'middle-of-the-linked-list', 'middle-of-the-linked-list', 150, 'Middle of the Linked List', '<p>Given the <code>head</code> of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.</p>', 'Head of a linked list.', 'The middle ListNode.', '["The number of nodes in the list is in the range [1, 100].","1 <= Node.val <= 100"]', 'Return the middle node of the linked list. If two middle nodes, return the second.', 'class Solution {
    public ListNode middleNode(ListNode head) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(151, 2, 17, 1, 'find-middle-node', 'find-middle-node', 151, 'Palindrome Linked List', '<p>Given the <code>head</code> of a singly linked list, return <code>true</code> if it is a palindrome or <code>false</code> otherwise.</p>', 'Head of a linked list.', 'Boolean <code>true</code> if palindrome.', '["The number of nodes in the list is in the range [1, 10^5].","0 <= Node.val <= 9"]', 'Check if a singly linked list is a palindrome in O(n) time and O(1) space.', 'class Solution {
    public boolean isPalindrome(ListNode head) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(152, 2, 17, 2, 'linked-list-cycle-ii', 'linked-list-cycle-ii', 152, 'Linked List Cycle II', '<p>Given the <code>head</code> of a linked list, return the node where the cycle begins. If there is no cycle, return <code>null</code>. Do not modify the linked list.</p>', 'Head of a linked list.', 'ListNode at the start of cycle or null.', '["The number of the nodes in the list is in the range [0, 10^4].","-10^5 <= Node.val <= 10^5"]', 'Return the node where the cycle begins in a linked list, or null if no cycle.', 'class Solution {
    public ListNode detectCycle(ListNode head) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(153, 2, 17, 1, 'happy-number', 'happy-number', 153, 'Happy Number', '<p>Write an algorithm to determine if a number <code>n</code> is happy. A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1, or it loops endlessly in a cycle which does not include 1.</p>', 'A positive integer <code>n</code>.', 'Boolean <code>true</code> if happy, <code>false</code> otherwise.', '["1 <= n <= 2^31 - 1"]', 'Determine if a number n is happy (sum of squares of digits reaches 1 without cycling).', 'class Solution {
    public boolean isHappy(int n) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(154, 2, 17, 1, 'merge-two-sorted-lists', 'merge-two-sorted-lists', 154, 'Merge Two Sorted Lists', '<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.</p>', 'Heads of two sorted linked lists <code>list1</code> and <code>list2</code>.', 'Head of the merged sorted linked list.', '["The number of nodes in both lists is in the range [0, 50].","-100 <= Node.val <= 100","Both list1 and list2 are sorted in non-decreasing order."]', 'Merge two sorted linked lists and return it as a sorted list.', 'class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(155, 2, 17, 2, 'merge-in-between-linked-lists', 'merge-in-between-linked-lists', 155, 'Merge In Between Linked Lists', '<p>You are given two linked lists: <code>list1</code> and <code>list2</code> of sizes <code>n</code> and <code>m</code> respectively. Remove <code>list1</code>''s nodes from the <code>a</code>-th node to the <code>b</code>-th node, and put <code>list2</code> in their place.</p>', 'Two linked lists <code>list1, list2</code> and integers <code>a, b</code>.', 'Head of modified list1.', '["3 <= list1.length <= 10^4","1 <= a <= b < list1.length - 1","1 <= list2.length <= 10^4"]', 'Remove nodes from index a to b in list1, and put list2 in their place.', 'class Solution {
    public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {
        // Write your solution below

        return list1;
    }
}', FALSE, TRUE, 2000, 256),
(156, 2, 17, 2, 'remove-nth-node-from-end', 'remove-nth-node-from-end', 156, 'Remove Nth Node From End of List', '<p>Given the <code>head</code> of a linked list, remove the <code>n</code>-th node from the end of the list and return its head.</p>', 'Head of linked list and integer <code>n</code>.', 'Head of modified list.', '["The number of nodes in the list is sz.","1 <= sz <= 30","0 <= Node.val <= 100","1 <= n <= sz"]', 'Remove the nth node from the end of the list and return its head.', 'class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Write your solution below

        return head;
    }
}', FALSE, TRUE, 2000, 256),
(157, 2, 17, 2, 'reorder-list', 'reorder-list', 157, 'Reorder List', '<p>You are given the head of a singly linked-list. The list can be represented as: <code>L0 -> L1 -> ... -> Ln-1 -> Ln</code>. Reorder the list to be: <code>L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...</code>. You may not modify the values in the list''s nodes. Only nodes themselves may be changed.</p>', 'Head of a linked list.', 'None (modify list in-place).', '["The number of nodes in the list is in the range [1, 5 * 10^4].","1 <= Node.val <= 1000"]', 'Reorder the list to be L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2...', 'class Solution {
    public void reorderList(ListNode head) {
        // Write your solution below

        return ;
    }
}', FALSE, TRUE, 2000, 256),
(158, 2, 18, 2, 'daily-temperatures', 'daily-temperatures', 158, 'Daily Temperatures', '<p>Given an array of integers <code>temperatures</code> represents the daily temperatures, return an array <code>answer</code> such that <code>answer[i]</code> is the number of days you have to wait after the <code>i</code>-th day to get a warmer temperature. If there is no future day for which this is possible, keep <code>answer[i] == 0</code> instead.</p>', 'An integer array <code>temperatures</code>.', 'An integer array of wait days.', '["1 <= temperatures.length <= 10^5","30 <= temperatures[i] <= 100"]', 'Return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.', 'class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        // Write your solution below

        return new int[]{};
    }
}', FALSE, TRUE, 2000, 256),
(159, 2, 18, 1, 'next-greater-element-i', 'next-greater-element-i', 159, 'Next Greater Element I', '<p>The next greater element of some element <code>x</code> in an array is the first greater element that is to the right of <code>x</code> in the same array. You are given two distinct 0-indexed integer arrays <code>nums1</code> and <code>nums2</code>, where <code>nums1</code> is a subset of <code>nums2</code>. For each <code>0 <= i < nums1.length</code>, find the index <code>j</code> such that <code>nums1[i] == nums2[j]</code> and determine the next greater element of <code>nums2[j]</code> in <code>nums2</code>.</p>', 'Two integer arrays <code>nums1</code> and <code>nums2</code>.', 'Integer array of next greater elements.', '["1 <= nums1.length <= nums2.length <= 1000","0 <= nums1[i], nums2[i] <= 10^4","All integers in nums1 and nums2 are unique."]', 'Find the next greater element for each value in nums1 within nums2.', 'class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        // Write your solution below

        return new int[]{};
    }
}', FALSE, TRUE, 2000, 256),
(160, 2, 18, 3, 'largest-rectangle-in-histogram', 'largest-rectangle-in-histogram', 160, 'Largest Rectangle in Histogram', '<p>Given an array of integers <code>heights</code> representing the histogram''s bar height where the width of each bar is <code>1</code>, return the area of the largest rectangle in the histogram.</p>', 'An integer array <code>heights</code>.', 'The maximum rectangle area.', '["1 <= heights.length <= 10^5","0 <= heights[i] <= 10^4"]', 'Find the area of the largest rectangle in the histogram.', 'class Solution {
    public int largestRectangleArea(int[] heights) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(161, 2, 18, 1, 'valid-parentheses', 'valid-parentheses', 161, 'Valid Parentheses', '<p>Given a string <code>s</code> containing just the characters <code>''(''</code>, <code>'')''</code>, <code>''{''</code>, <code>''}''</code>, <code>''[''</code> and <code>'']''</code>, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and in the correct order, and every close bracket has a corresponding open bracket of the same type.</p>', 'A string <code>s</code> containing bracket characters.', 'Boolean <code>true</code> if valid, <code>false</code> otherwise.', '["1 <= s.length <= 10^4","s consists of parentheses only ''()[]{}''."]', 'Determine if the input string containing brackets is valid.', 'class Solution {
    public boolean isValid(String s) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(162, 2, 18, 2, 'generate-parentheses', 'generate-parentheses', 162, 'Generate Parentheses', '<p>Given <code>n</code> pairs of parentheses, write a function to generate all combinations of well-formed parentheses.</p>', 'An integer <code>n</code>.', 'A list of valid parentheses combinations.', '["1 <= n <= 8"]', 'Generate all combinations of well-formed parentheses for n pairs.', 'class Solution {
    public java.util.List<String> generateParenthesis(int n) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(163, 2, 18, 2, 'minimum-remove-to-make-valid-parentheses', 'minimum-remove-to-make-valid-parentheses', 163, 'Minimum Remove to Make Valid Parentheses', '<p>Given a string <code>s</code> of <code>''(''</code> , <code>'')''</code> and lowercase English characters. Your task is to remove the minimum number of parentheses (<code>''(''</code> or <code>'')''</code>, in any positions) so that the resulting parentheses string is valid and return any valid string.</p>', 'A string <code>s</code>.', 'A valid parentheses string.', '["1 <= s.length <= 10^5","s[i] is either ''('', '')'', or lowercase English letter."]', 'Remove the minimum number of parentheses to make string valid.', 'class Solution {
    public String minRemoveToMakeValid(String s) {
        // Write your solution below

        return s;
    }
}', FALSE, TRUE, 2000, 256),
(164, 2, 18, 2, 'next-greater-element-ii', 'next-greater-element-ii', 164, 'Next Greater Element II', '<p>Given a circular integer array <code>nums</code> (i.e., the next element of <code>nums[nums.length - 1]</code> is <code>nums[0]</code>), return the next greater number for every element in <code>nums</code>. The next greater number of a number <code>x</code> is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number.</p>', 'An integer array <code>nums</code>.', 'Integer array of next greater elements in circular order.', '["1 <= nums.length <= 10^4","-10^9 <= nums[i] <= 10^9"]', 'Find the next greater element for each element in a circular array.', 'class Solution {
    public int[] nextGreaterElements(int[] nums) {
        // Write your solution below

        return new int[]{};
    }
}', FALSE, TRUE, 2000, 256),
(165, 2, 18, 2, 'online-stock-span', 'online-stock-span', 165, 'Online Stock Span', '<p>Design an algorithm that collects daily price quotes for some stock and returns the span of that stock''s price for the current day. The span of the stock''s price in one day is the maximum number of consecutive days (starting from today and going backward) for which the stock price was less than or equal to the price of that day.</p>', 'Method calls to <code>next(int price)</code>.', 'Span integer for today''s price.', '["1 <= price <= 10^5","At most 10^4 calls will be made to next."]', 'Calculate the span of stock prices for consecutive days less than or equal to today.', 'class Solution {
    public int next(int price) {
        // Write your solution below

        return 1;
    }
}', FALSE, TRUE, 2000, 256),
(166, 2, 18, 1, 'implement-queue-using-stacks', 'implement-queue-using-stacks', 166, 'Implement Queue using Stacks', '<p>Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (<code>push</code>, <code>peek</code>, <code>pop</code>, and <code>empty</code>).</p>', 'Operations on MyQueue.', 'Results of peek, pop, empty.', '["1 <= x <= 9","At most 100 calls will be made to push, pop, peek, and empty."]', 'Implement a first in first out (FIFO) queue using only two stacks.', 'class Solution {
    public int pop() {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(167, 2, 18, 1, 'number-of-recent-calls', 'number-of-recent-calls', 167, 'Number of Recent Calls', '<p>You have a <code>RecentCounter</code> class which counts the number of recent requests within a certain time frame. Implement the <code>RecentCounter</code> class: <code>int ping(int t)</code> adds a new request at time <code>t</code>, where <code>t</code> represents some time in milliseconds, and returns the number of requests that have happened in the past <code>3000</code> milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range <code>[t - 3000, t]</code>.</p>', 'Calls to <code>ping(int t)</code>.', 'Number of pings in [t - 3000, t].', '["1 <= t <= 10^9","Each test case will call ping with strictly increasing values of t."]', 'Count the number of recent requests within a 3000 milliseconds time frame.', 'class Solution {
    public int ping(int t) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(168, 2, 18, 3, 'sliding-window-maximum', 'sliding-window-maximum', 168, 'Sliding Window Maximum', '<p>You are given an array of integers <code>nums</code>, there is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.</p>', 'An integer array <code>nums</code> and window size <code>k</code>.', 'An array of the maximum value in each window.', '["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4","1 <= k <= nums.length"]', 'Return the max sliding window of size k moving from very left to very right.', 'class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // Write your solution below

        return new int[]{};
    }
}', TRUE, TRUE, 2000, 256),
(169, 2, 18, 2, 'design-circular-deque', 'design-circular-deque', 169, 'Design Circular Deque', '<p>Design your implementation of the circular double-ended queue (deque). Implement the <code>MyCircularDeque</code> class with <code>insertFront</code>, <code>insertLast</code>, <code>deleteFront</code>, <code>deleteLast</code>, <code>getFront</code>, <code>getRear</code>, <code>isEmpty</code>, and <code>isFull</code>.</p>', 'Operations on MyCircularDeque of size k.', 'Return values per operation.', '["1 <= k <= 1000","0 <= value <= 1000","At most 2000 calls will be made."]', 'Design your implementation of the circular double-ended queue (deque).', 'class Solution {
    public boolean insertFront(int value) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(170, 2, 19, 1, 'binary-search', 'binary-search', 170, 'Binary Search', '<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>', 'A sorted integer array <code>nums</code> and an integer <code>target</code>.', 'The 0-based index of target, or <code>-1</code> if not found.', '["1 <= nums.length <= 10^4","-10^4 < nums[i], target < 10^4","All the integers in nums are unique.","nums is sorted in ascending order."]', 'Search a target in a sorted ascending integer array in O(log n) time.', 'class Solution {
    public int search(int[] nums, int target) {
        // Write your solution below

        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(171, 2, 19, 1, 'guess-number-higher-or-lower', 'guess-number-higher-or-lower', 171, 'Guess Number Higher or Lower', '<p>We are playing the Guess Game. The game will pick a number from <code>1</code> to <code>n</code>. You have to guess which number was picked. Every time you guess wrong, the API will tell you whether the number picked is higher or lower than your guess. Return the number that was picked.</p>', 'An integer <code>n</code>.', 'The picked number.', '["1 <= n <= 2^31 - 1"]', 'Guess the picked number between 1 and n using the pre-defined guess API.', 'class Solution {
    public int guessNumber(int n) {
        // Write your solution below

        return 1;
    }
}', FALSE, TRUE, 2000, 256),
(172, 2, 19, 1, 'search-insert-position', 'search-insert-position', 172, 'Search Insert Position', '<p>Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>', 'A sorted integer array <code>nums</code> and an integer <code>target</code>.', 'Index where target is found or should be inserted.', '["1 <= nums.length <= 10^4","-10^4 <= nums[i] <= 10^4","nums contains distinct values sorted in ascending order."]', 'Return the index if the target is found, or the index where it would be if inserted in order.', 'class Solution {
    public int searchInsert(int[] nums, int target) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(173, 2, 19, 2, 'find-first-and-last-position', 'find-first-and-last-position', 173, 'Find First and Last Position of Element in Sorted Array', '<p>Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value. If <code>target</code> is not found in the array, return <code>[-1, -1]</code>. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>', 'A sorted integer array <code>nums</code> and an integer <code>target</code>.', 'Integer array [firstIndex, lastIndex].', '["0 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9","nums is a non-decreasing array."]', 'Find the starting and ending position of a given target value in a sorted array.', 'class Solution {
    public int[] searchRange(int[] nums, int target) {
        // Write your solution below

        return new int[]{-1, -1};
    }
}', FALSE, TRUE, 2000, 256),
(174, 2, 19, 2, 'search-in-rotated-sorted-array', 'search-in-rotated-sorted-array', 174, 'Search in Rotated Sorted Array', '<p>There is an integer array <code>nums</code> sorted in ascending order (with distinct values). Prior to being passed to your function, <code>nums</code> is possibly rotated at an unknown pivot index <code>k</code>. Given the array <code>nums</code> after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not in <code>nums</code>.</p>', 'A rotated sorted integer array <code>nums</code> and target integer.', 'Index of target or -1.', '["1 <= nums.length <= 5000","-10^4 <= nums[i] <= 10^4","All values of nums are unique."]', 'Search a target in a sorted array that was rotated at an unknown pivot in O(log n) time.', 'class Solution {
    public int search(int[] nums, int target) {
        // Write your solution below

        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(175, 2, 19, 2, 'find-minimum-in-rotated-sorted-array', 'find-minimum-in-rotated-sorted-array', 175, 'Find Minimum in Rotated Sorted Array', '<p>Suppose an array of length <code>n</code> sorted in ascending order is rotated between <code>1</code> and <code>n</code> times. Given the sorted rotated array <code>nums</code> of unique elements, return the minimum element of this array. You must write an algorithm that runs in <code>O(log n)</code> time.</p>', 'A rotated sorted array <code>nums</code>.', 'The minimum integer in the array.', '["n == nums.length","1 <= n <= 5000","-5000 <= nums[i] <= 5000","All the integers of nums are unique."]', 'Find the minimum element in a sorted rotated array in O(log n) time.', 'class Solution {
    public int findMin(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(176, 2, 19, 2, 'koko-eating-bananas', 'koko-eating-bananas', 176, 'Koko Eating Bananas', '<p>Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>i</code>-th pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours. Koko can decide her bananas-per-hour eating speed of <code>k</code>. Each hour, she chooses some pile of bananas and eats <code>k</code> bananas from that pile. If the pile has less than <code>k</code> bananas, she eats all of them instead and will not eat any more bananas during this hour. Return the minimum integer <code>k</code> such that she can eat all the bananas within <code>h</code> hours.</p>', 'An integer array <code>piles</code> and integer <code>h</code>.', 'Minimum integer eating speed k.', '["1 <= piles.length <= 10^4","piles.length <= h <= 10^9","1 <= piles[i] <= 10^9"]', 'Find the minimum integer eating speed k such that Koko can eat all bananas within h hours.', 'class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        // Write your solution below

        return 1;
    }
}', FALSE, TRUE, 2000, 256),
(177, 2, 19, 2, 'capacity-to-ship-packages', 'capacity-to-ship-packages', 177, 'Capacity To Ship Packages Within D Days', '<p>A conveyor belt has packages that must be shipped from one port to another within <code>days</code> days. The <code>i</code>-th package on the conveyor belt has a weight of <code>weights[i]</code>. Each day, we load the ship with packages on the conveyor belt (in the order given by <code>weights</code>). We may not load more weight than the maximum weight capacity of the ship. Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within <code>days</code> days.</p>', 'An integer array <code>weights</code> and integer <code>days</code>.', 'Minimum weight capacity.', '["1 <= days <= weights.length <= 5 * 10^4","1 <= weights[i] <= 500"]', 'Find the least weight capacity of the boat to ship all packages within days.', 'class Solution {
    public int shipWithinDays(int[] weights, int days) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(178, 2, 19, 3, 'split-array-largest-sum', 'split-array-largest-sum', 178, 'Split Array Largest Sum', '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, split <code>nums</code> into <code>k</code> non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum of the split. A subarray is a contiguous part of the array.</p>', 'An integer array <code>nums</code> and integer <code>k</code>.', 'Minimized largest subarray sum.', '["1 <= nums.length <= 1000","0 <= nums[i] <= 10^6","1 <= k <= min(50, nums.length)"]', 'Split nums into k non-empty subarrays to minimize the largest sum among these subarrays.', 'class Solution {
    public int splitArray(int[] nums, int k) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(179, 2, 20, 1, 'fibonacci-number', 'fibonacci-number', 179, 'Fibonacci Number', '<p>The Fibonacci numbers, commonly denoted <code>F(n)</code> form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from <code>0</code> and <code>1</code>. That is, <code>F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2)</code> for <code>n > 1</code>. Given <code>n</code>, calculate <code>F(n)</code>.</p>', 'An integer <code>n</code>.', 'The nth Fibonacci number.', '["0 <= n <= 30"]', 'Calculate the nth Fibonacci number where F(n) = F(n-1) + F(n-2).', 'class Solution {
    public int fib(int n) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(180, 2, 20, 1, 'power-of-three', 'power-of-three', 180, 'Power of Three', '<p>Given an integer <code>n</code>, return <code>true</code> if it is a power of three. Otherwise, return <code>false</code>. An integer <code>n</code> is a power of three, if there exists an integer <code>x</code> such that <code>n == 3^x</code>.</p>', 'An integer <code>n</code>.', 'Boolean <code>true</code> if power of three.', '["-2^31 <= n <= 2^31 - 1"]', 'Determine if an integer is a power of three using recursion.', 'class Solution {
    public boolean isPowerOfThree(int n) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(181, 2, 20, 2, 'subsets', 'subsets', 181, 'Subsets', '<p>Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.</p>', 'An integer array <code>nums</code>.', 'List of all subsets (list of lists).', '["1 <= nums.length <= 10","-10 <= nums[i] <= 10","All the numbers of nums are unique."]', 'Return all possible subsets (the power set) of unique elements.', 'class Solution {
    public java.util.List<java.util.List<Integer>> subsets(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(182, 2, 20, 2, 'subsets-ii', 'subsets-ii', 182, 'Subsets II', '<p>Given an integer array <code>nums</code> that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.</p>', 'An integer array <code>nums</code>.', 'List of all unique subsets.', '["1 <= nums.length <= 10","-10 <= nums[i] <= 10"]', 'Return all possible subsets of an array that may contain duplicates.', 'class Solution {
    public java.util.List<java.util.List<Integer>> subsetsWithDup(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(183, 2, 20, 2, 'permutations', 'permutations', 183, 'Permutations', '<p>Given an array <code>nums</code> of distinct integers, return all the possible permutations. You can return the answer in any order.</p>', 'An integer array <code>nums</code>.', 'List of all permutations.', '["1 <= nums.length <= 6","-10 <= nums[i] <= 10","All the integers of nums are unique."]', 'Return all possible permutations of an array of distinct integers.', 'class Solution {
    public java.util.List<java.util.List<Integer>> permute(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(184, 2, 20, 2, 'permutations-ii', 'permutations-ii', 184, 'Permutations II', '<p>Given a collection of numbers, <code>nums</code>, that might contain duplicates, return all possible unique permutations in any order.</p>', 'An integer array <code>nums</code>.', 'List of unique permutations.', '["1 <= nums.length <= 8","-10 <= nums[i] <= 10"]', 'Return all unique permutations of a collection of numbers that might contain duplicates.', 'class Solution {
    public java.util.List<java.util.List<Integer>> permuteUnique(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(185, 2, 20, 2, 'combination-sum', 'combination-sum', 185, 'Combination Sum', '<p>Given an array of distinct integers <code>candidates</code> and a target integer <code>target</code>, return a list of all unique combinations of <code>candidates</code> where the chosen numbers sum to <code>target</code>. You may return the combinations in any order. The same number may be chosen from <code>candidates</code> an unlimited number of times.</p>', 'An integer array <code>candidates</code> and integer <code>target</code>.', 'List of candidate combinations summing to target.', '["1 <= candidates.length <= 30","2 <= candidates[i] <= 40","All elements of candidates are distinct.","1 <= target <= 40"]', 'Find all unique combinations of candidates where the numbers sum to target.', 'class Solution {
    public java.util.List<java.util.List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(186, 2, 20, 2, 'letter-combinations-of-phone-number', 'letter-combinations-of-phone-number', 186, 'Letter Combinations of a Phone Number', '<p>Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. A mapping of digits to letters (just like on the telephone buttons) is given: 2->abc, 3->def, 4->ghi, 5->jkl, 6->mno, 7->pqrs, 8->tuv, 9->wxyz.</p>', 'A string of digits <code>digits</code>.', 'List of letter combinations.', '["0 <= digits.length <= 4","digits[i] is a digit in the range [''2'', ''9'']."]', 'Return all possible letter combinations that the number could represent on a phone dial pad.', 'class Solution {
    public java.util.List<String> letterCombinations(String digits) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(187, 2, 20, 3, 'n-queens', 'n-queens', 187, 'N-Queens', '<p>The n-queens puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other. Given an integer <code>n</code>, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.</p>', 'An integer <code>n</code>.', 'List of board configurations where ''Q'' is a queen and ''.'' is empty.', '["1 <= n <= 9"]', 'Place n queens on an n x n chessboard such that no two queens attack each other.', 'class Solution {
    public java.util.List<java.util.List<String>> solveNQueens(int n) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(188, 2, 20, 2, 'word-search', 'word-search', 188, 'Word Search', '<p>Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if <code>word</code> exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.</p>', 'A 2D char array <code>board</code> and string <code>word</code>.', 'Boolean <code>true</code> if word found.', '["m == board.length","n = board[i].length","1 <= m, n <= 6","1 <= word.length <= 15"]', 'Find if the word exists in the 2D grid of characters.', 'class Solution {
    public boolean exist(char[][] board, String word) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(189, 2, 20, 3, 'sudoku-solver', 'sudoku-solver', 189, 'Sudoku Solver', '<p>Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, each column, and each of the 9 3x3 sub-boxes of the grid. The ''.'' character indicates empty cells.</p>', 'A 9x9 char array <code>board</code>.', 'None (modify <code>board</code> in-place).', '["board.length == 9","board[i].length == 9","board[i][j] is a digit ''1''-''9'' or ''.''."]', 'Solve a Sudoku puzzle by filling the empty cells.', 'class Solution {
    public void solveSudoku(char[][] board) {
        // Write your solution below

        return ;
    }
}', TRUE, TRUE, 2000, 256),
(190, 2, 21, 1, 'invert-binary-tree', 'invert-binary-tree', 190, 'Invert Binary Tree', '<p>Given the <code>root</code> of a binary tree, invert the tree, and return its root. Inverting a tree means swapping every left child with its right child.</p>', 'The root TreeNode of a binary tree.', 'The root TreeNode of the inverted binary tree.', '["The number of nodes in the tree is in the range [0, 100].","-100 <= Node.val <= 100"]', 'Invert a binary tree by swapping left and right subtrees recursively.', 'class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(191, 2, 21, 1, 'binary-tree-inorder-traversal', 'binary-tree-inorder-traversal', 191, 'Binary Tree Inorder Traversal', '<p>Given the <code>root</code> of a binary tree, return the inorder traversal of its nodes'' values (Left -> Root -> Right).</p>', 'The root TreeNode of a binary tree.', 'A list of integers in inorder sequence.', '["The number of nodes in the tree is in the range [0, 100].","-100 <= Node.val <= 100"]', 'Return the inorder traversal of its nodes'' values.', 'class Solution {
    public java.util.List<Integer> inorderTraversal(TreeNode root) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(192, 2, 21, 1, 'binary-tree-preorder-traversal', 'binary-tree-preorder-traversal', 192, 'Binary Tree Preorder Traversal', '<p>Given the <code>root</code> of a binary tree, return the preorder traversal of its nodes'' values (Root -> Left -> Right).</p>', 'Root TreeNode of a binary tree.', 'List of integers in preorder sequence.', '["The number of nodes in the tree is in the range [0, 100].","-100 <= Node.val <= 100"]', 'Return the preorder traversal of its nodes'' values.', 'class Solution {
    public java.util.List<Integer> preorderTraversal(TreeNode root) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(193, 2, 21, 2, 'validate-binary-search-tree', 'validate-binary-search-tree', 193, 'Validate Binary Search Tree', '<p>Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys strictly less than the node''s key. The right subtree of a node contains only nodes with keys strictly greater than the node''s key. Both the left and right subtrees must also be binary search trees.</p>', 'Root TreeNode of a binary tree.', 'Boolean <code>true</code> if valid BST, <code>false</code> otherwise.', '["The number of nodes in the tree is in the range [1, 10^4].","-2^31 <= Node.val <= 2^31 - 1"]', 'Determine if a binary tree is a valid binary search tree (BST).', 'class Solution {
    public boolean isValidBST(TreeNode root) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(194, 2, 21, 2, 'kth-smallest-element-in-bst', 'kth-smallest-element-in-bst', 194, 'Kth Smallest Element in a BST', '<p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return the <code>k</code>-th smallest value (1-indexed) of all the values of the nodes in the tree.</p>', 'Root of BST and integer <code>k</code>.', 'The kth smallest value.', '["The number of nodes in the tree is n.","1 <= k <= n <= 10^4","0 <= Node.val <= 10^4"]', 'Find the kth smallest value (1-indexed) in a binary search tree.', 'class Solution {
    public int kthSmallest(TreeNode root, int k) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(195, 2, 21, 2, 'insert-into-binary-search-tree', 'insert-into-binary-search-tree', 195, 'Insert into a Binary Search Tree', '<p>You are given the <code>root</code> node of a binary search tree (BST) and a <code>val</code> to insert into the tree. Return the root node of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.</p>', 'Root of BST and integer <code>val</code>.', 'Root of modified BST.', '["The number of nodes in the tree will be in the range [0, 10^4].","-10^8 <= Node.val <= 10^8","val does not exist in original BST."]', 'Insert a new value into a BST and return the root of the modified BST.', 'class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(196, 2, 21, 1, 'maximum-depth-of-binary-tree', 'maximum-depth-of-binary-tree', 196, 'Maximum Depth of Binary Tree', '<p>Given the <code>root</code> of a binary tree, return its maximum depth. A binary tree''s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>', 'Root TreeNode of a binary tree.', 'Maximum depth as an integer.', '["The number of nodes in the tree is in the range [0, 10^4].","-100 <= Node.val <= 100"]', 'Find the maximum depth (number of nodes along longest path from root to leaf).', 'class Solution {
    public int maxDepth(TreeNode root) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(197, 2, 21, 1, 'diameter-of-binary-tree', 'diameter-of-binary-tree', 197, 'Diameter of Binary Tree', '<p>Given the <code>root</code> of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root. The length of a path between two nodes is represented by the number of edges between them.</p>', 'Root of binary tree.', 'Integer diameter (number of edges).', '["The number of nodes in the tree is in the range [1, 10^4].","-100 <= Node.val <= 100"]', 'Return the length of the longest path between any two nodes in a tree.', 'class Solution {
    public int diameterOfBinaryTree(TreeNode root) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(198, 2, 21, 1, 'balanced-binary-tree', 'balanced-binary-tree', 198, 'Balanced Binary Tree', '<p>Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.</p>', 'Root of binary tree.', 'Boolean <code>true</code> if balanced, <code>false</code> otherwise.', '["The number of nodes in the tree is in the range [0, 5000].","-10^4 <= Node.val <= 10^4"]', 'Determine if a binary tree is height-balanced.', 'class Solution {
    public boolean isBalanced(TreeNode root) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(199, 2, 21, 2, 'lowest-common-ancestor-of-bst', 'lowest-common-ancestor-of-bst', 199, 'Lowest Common Ancestor of a BST', '<p>Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. According to the definition of LCA on Wikipedia: ''The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).''</p>', 'Root of BST, and two target nodes <code>p</code> and <code>q</code>.', 'TreeNode representing the LCA.', '["The number of nodes in the tree is in the range [2, 10^5].","-10^9 <= Node.val <= 10^9","All Node.val are unique.","p != q","p and q will exist in the BST."]', 'Find the lowest common ancestor (LCA) node of two given nodes in a BST.', 'class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(200, 2, 21, 2, 'lowest-common-ancestor-of-binary-tree', 'lowest-common-ancestor-of-binary-tree', 200, 'Lowest Common Ancestor of a Binary Tree', '<p>Given a binary tree, find the lowest common ancestor (LCA) of two given nodes <code>p</code> and <code>q</code>.</p>', 'Root of binary tree, and nodes <code>p, q</code>.', 'TreeNode representing the LCA.', '["The number of nodes in the tree is in the range [2, 10^5].","-10^9 <= Node.val <= 10^9","All Node.val are unique.","p != q","p and q exist in the tree."]', 'Find the lowest common ancestor of two nodes in a general binary tree.', 'class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(201, 2, 21, 2, 'binary-tree-level-order-traversal', 'binary-tree-level-order-traversal', 201, 'Binary Tree Level Order Traversal', '<p>Given the <code>root</code> of a binary tree, return the level order traversal of its nodes'' values. (i.e., from left to right, level by level).</p>', 'Root TreeNode of a binary tree.', 'List of lists of integers per level.', '["The number of nodes in the tree is in the range [0, 2000].","-1000 <= Node.val <= 1000"]', 'Return the level order traversal of its nodes'' values (i.e., from left to right, level by level).', 'class Solution {
    public java.util.List<java.util.List<Integer>> levelOrder(TreeNode root) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(202, 2, 21, 2, 'binary-tree-right-side-view', 'binary-tree-right-side-view', 202, 'Binary Tree Right Side View', '<p>Given the <code>root</code> of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.</p>', 'Root TreeNode of a binary tree.', 'List of integers visible from right side.', '["The number of nodes in the tree is in the range [0, 100].","-100 <= Node.val <= 100"]', 'Return the values of the nodes you can see ordered from top to bottom standing on the right side.', 'class Solution {
    public java.util.List<Integer> rightSideView(TreeNode root) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(203, 2, 21, 2, 'binary-tree-zigzag-level-order', 'binary-tree-zigzag-level-order', 203, 'Binary Tree Zigzag Level Order Traversal', '<p>Given the <code>root</code> of a binary tree, return the zigzag level order traversal of its nodes'' values. (i.e., from left to right, then right to left for the next level and alternate between).</p>', 'Root TreeNode of a binary tree.', 'List of lists of integers in zigzag order.', '["The number of nodes in the tree is in the range [0, 2000].","-1000 <= Node.val <= 1000"]', 'Return the zigzag level order traversal of its nodes'' values (alternate left-to-right and right-to-left).', 'class Solution {
    public java.util.List<java.util.List<Integer>> zigzagLevelOrder(TreeNode root) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(204, 2, 22, 2, 'kth-largest-element-in-array', 'kth-largest-element-in-array', 204, 'Kth Largest Element in an Array', '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code>-th largest element in the array. Note that it is the <code>k</code>-th largest element in the sorted order, not the <code>k</code>-th distinct element. Can you solve it without sorting in O(N) average time?</p>', 'An integer array <code>nums</code> and integer <code>k</code>.', 'The kth largest integer.', '["1 <= k <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"]', 'Find the kth largest element in an unsorted array without full sorting.', 'class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(205, 2, 22, 2, 'top-k-frequent-words', 'top-k-frequent-words', 205, 'Top K Frequent Words', '<p>Given an array of strings <code>words</code> and an integer <code>k</code>, return the <code>k</code> most frequent strings. Return the answer sorted by the frequency from highest to lowest. Sort the words with the same frequency by their lexicographical order.</p>', 'An array of strings <code>words</code> and integer <code>k</code>.', 'List of top k frequent strings.', '["1 <= words.length <= 500","1 <= words[i].length <= 10","words[i] consists of lowercase English letters.","k is in the range [1, unique words]."]', 'Return the k most frequent strings sorted by frequency from highest to lowest, breaking ties by alphabetical order.', 'class Solution {
    public java.util.List<String> topKFrequent(String[] words, int k) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(206, 2, 22, 1, 'kth-largest-element-in-stream', 'kth-largest-element-in-stream', 206, 'Kth Largest Element in a Stream', '<p>Design a class to find the <code>k</code>-th largest element in a stream. Note that it is the <code>k</code>-th largest element in the sorted order, not the <code>k</code>-th distinct element. Implement <code>KthLargest</code> class: <code>KthLargest(int k, int[] nums)</code> initializes the object and <code>int add(int val)</code> appends <code>val</code> and returns the <code>k</code>-th largest element.</p>', 'Constructor with <code>k, nums</code> and stream calls to <code>add(val)</code>.', 'Kth largest element per call.', '["1 <= k <= 10^4","0 <= nums.length <= 10^4","-10^4 <= nums[i], val <= 10^4"]', 'Design a class to find the kth largest element in a stream.', 'class Solution {
    public int add(int val) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(207, 2, 22, 2, 'find-k-pairs-with-smallest-sums', 'find-k-pairs-with-smallest-sums', 207, 'Find K Pairs with Smallest Sums', '<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code> sorted in non-decreasing order and an integer <code>k</code>. Define a pair <code>(u, v)</code> which consists of one element from the first array and one element from the second array. Return the <code>k</code> pairs <code>(u1, v1), (u2, v2), ..., (uk, vk)</code> with the smallest sums.</p>', 'Two sorted arrays <code>nums1, nums2</code> and integer <code>k</code>.', 'List of k smallest sum pairs.', '["1 <= nums1.length, nums2.length <= 10^5","-10^9 <= nums1[i], nums2[i] <= 10^9","1 <= k <= 10^4"]', 'Find the k pairs with the smallest sums from two non-decreasing sorted arrays.', 'class Solution {
    public java.util.List<java.util.List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(208, 2, 22, 3, 'find-median-from-data-stream', 'find-median-from-data-stream', 208, 'Find Median from Data Stream', '<p>The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the <code>MedianFinder</code> class: <code>addNum(int num)</code> adds the integer into the data structure, and <code>findMedian()</code> returns the median of all elements so far.</p>', 'Stream of <code>addNum</code> and <code>findMedian</code> calls.', 'Median as double.', '["-10^5 <= num <= 10^5","At most 5 * 10^4 calls will be made to addNum and findMedian."]', 'Design a data structure that calculates the median of a stream of integers in O(log n) time.', 'class Solution {
    public double findMedian() {
        // Write your solution below

        return 0.0;
    }
}', TRUE, TRUE, 2000, 256),
(209, 2, 22, 3, 'sliding-window-median', 'sliding-window-median', 209, 'Sliding Window Median', '<p>Given an integer array <code>nums</code> and an integer <code>k</code>. There is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position. Return the median array for each window in the original array.</p>', 'An integer array <code>nums</code> and window size <code>k</code>.', 'An array of doubles representing medians.', '["1 <= k <= nums.length <= 10^5","-2^31 <= nums[i] <= 2^31 - 1"]', 'Calculate the median of each sliding window of size k moving across the array.', 'class Solution {
    public double[] medianSlidingWindow(int[] nums, int k) {
        // Write your solution below

        return new double[]{};
    }
}', TRUE, TRUE, 2000, 256),
(210, 2, 22, 3, 'merge-k-sorted-lists', 'merge-k-sorted-lists', 210, 'Merge K Sorted Lists', '<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.</p>', 'An array of <code>k</code> sorted linked-list heads.', 'Head of the merged single sorted linked list.', '["k == lists.length","0 <= k <= 10^4","0 <= lists[i].length <= 500","-10^4 <= lists[i][j] <= 10^4","lists[i] is sorted in ascending order."]', 'Merge k sorted linked lists and return it as one sorted list.', 'class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(211, 2, 22, 3, 'smallest-range-covering-elements-from-k-lists', 'smallest-range-covering-elements-from-k-lists', 211, 'Smallest Range Covering Elements from K Lists', '<p>You have <code>k</code> lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the <code>k</code> lists. We define the range <code>[a, b]</code> is smaller than range <code>[c, d]</code> if <code>b - a < d - c</code> or <code>a < c</code> if <code>b - a == d - c</code>.</p>', 'A list of <code>k</code> sorted integer lists.', 'Array [start, end] of smallest range.', '["nums.length == k","1 <= k <= 3500","1 <= nums[i].length <= 50","-10^5 <= nums[i][j] <= 10^5","nums[i] is sorted."]', 'Find the smallest range [a, b] that includes at least one number from each of the k lists.', 'class Solution {
    public int[] smallestRange(java.util.List<java.util.List<Integer>> nums) {
        // Write your solution below

        return new int[]{};
    }
}', TRUE, TRUE, 2000, 256),
(212, 2, 23, 2, 'number-of-islands', 'number-of-islands', 212, 'Number of Islands', '<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>''1''</code>s (land) and <code>''0''</code>s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>', 'A 2D char array <code>grid</code>.', 'Number of islands as an integer.', '["m == grid.length","n == grid[i].length","1 <= m, n <= 300","grid[i][j] is ''0'' or ''1''."]', 'Count the number of islands in a 2D binary grid.', 'class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(213, 2, 23, 2, 'rotting-oranges', 'rotting-oranges', 213, 'Rotting Oranges', '<p>You are given an <code>m x n</code> grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return <code>-1</code>.</p>', 'An <code>m x n</code> grid of integers.', 'Minimum minutes elapsed, or -1.', '["m == grid.length","n == grid[i].length","1 <= m, n <= 10","grid[i][j] is 0, 1, or 2."]', 'Find the minimum number of minutes that must elapse until no cell has a fresh orange.', 'class Solution {
    public int orangesRotting(int[][] grid) {
        // Write your solution below

        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(214, 2, 23, 3, 'word-ladder', 'word-ladder', 214, 'Word Ladder', '<p>A transformation sequence from word <code>beginWord</code> to word <code>endWord</code> using a dictionary <code>wordList</code> is a sequence of words <code>beginWord -> s1 -> s2 -> ... -> sk</code> such that every adjacent pair of words differs by a single letter, and every <code>si</code> is in <code>wordList</code>. Given two words, <code>beginWord</code> and <code>endWord</code>, and a dictionary <code>wordList</code>, return the number of words in the shortest transformation sequence from <code>beginWord</code> to <code>endWord</code>, or <code>0</code> if no such sequence exists.</p>', 'Strings <code>beginWord, endWord</code> and list <code>wordList</code>.', 'Shortest sequence length, or 0.', '["1 <= beginWord.length <= 10","endWord.length == beginWord.length","1 <= wordList.length <= 5000"]', 'Find the length of the shortest transformation sequence from beginWord to endWord.', 'class Solution {
    public int ladderLength(String beginWord, String endWord, java.util.List<String> wordList) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(215, 2, 23, 2, 'clone-graph', 'clone-graph', 215, 'Clone Graph', '<p>Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (<code>int</code>) and a list (<code>List[Node]</code>) of its neighbors.</p>', 'A Node object.', 'Cloned deep-copy Node.', '["The number of nodes in the graph is in the range [0, 100].","1 <= Node.val <= 100","Node.val is unique for each node."]', 'Return a deep copy (clone) of a connected undirected graph.', 'class Solution {
    public Node cloneGraph(Node node) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(216, 2, 23, 2, 'max-area-of-island', 'max-area-of-island', 216, 'Max Area of Island', '<p>You are given an <code>m x n</code> binary matrix <code>grid</code>. An island is a group of <code>1</code>''s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water. The area of an island is the number of cells with a value <code>1</code> in the island. Return the maximum area of an island in <code>grid</code>. If there is no island, return <code>0</code>.</p>', 'A binary 2D integer array <code>grid</code>.', 'Maximum island area as integer.', '["m == grid.length","n == grid[i].length","1 <= m, n <= 50","grid[i][j] is either 0 or 1."]', 'Return the maximum area of an island in a 2D binary grid.', 'class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(217, 2, 23, 2, 'surrounded-regions', 'surrounded-regions', 217, 'Surrounded Regions', '<p>Given an <code>m x n</code> matrix <code>board</code> containing <code>''X''</code> and <code>''O''</code>, capture all regions that are 4-directionally surrounded by <code>''X''</code>. A region is captured by flipping all <code>''O''</code>s into <code>''X''</code>s in that surrounded region.</p>', 'An m x n char array <code>board</code>.', 'None (modify <code>board</code> in-place).', '["m == board.length","n == board[i].length","1 <= m, n <= 200","board[i][j] is ''X'' or ''O''."]', 'Capture all regions surrounded by ''X'' by converting them to ''X''.', 'class Solution {
    public void solve(char[][] board) {
        // Write your solution below

        return ;
    }
}', FALSE, TRUE, 2000, 256),
(218, 2, 23, 2, 'number-of-connected-components', 'number-of-connected-components', 218, 'Number of Connected Components in an Undirected Graph', '<p>You have a graph of <code>n</code> nodes. You are given an integer <code>n</code> and an array <code>edges</code> where <code>edges[i] = [ai, bi]</code> indicates that there is an edge between <code>ai</code> and <code>bi</code> in the graph. Return the number of connected components in the graph.</p>', 'Integer <code>n</code> and 2D integer array <code>edges</code>.', 'Number of connected components.', '["1 <= n <= 2000","0 <= edges.length <= 5000","edges[i].length == 2","0 <= ai <= bi < n"]', 'Find the number of connected components in an undirected graph.', 'class Solution {
    public int countComponents(int n, int[][] edges) {
        // Write your solution below

        return n;
    }
}', FALSE, TRUE, 2000, 256),
(219, 2, 23, 2, 'number-of-provinces', 'number-of-provinces', 219, 'Number of Provinces', '<p>There are <code>n</code> cities. Some of them are connected, while some are not. If city <code>a</code> is connected directly with city <code>b</code>, and city <code>b</code> is connected directly with city <code>c</code>, then city <code>a</code> is connected indirectly with city <code>c</code>. A province is a group of directly or indirectly connected cities and no other cities outside of the group. Given an <code>n x n</code> matrix <code>isConnected</code> where <code>isConnected[i][j] = 1</code> if the <code>i</code>-th city and the <code>j</code>-th city are directly connected, and <code>isConnected[i][j] = 0</code> otherwise, return the total number of provinces.</p>', 'An n x n binary matrix <code>isConnected</code>.', 'Total number of provinces.', '["1 <= n <= 200","n == isConnected.length","isConnected[i][j] is 1 or 0.","isConnected[i][i] == 1","isConnected[i][j] == isConnected[j][i]"]', 'Find the total number of connected provinces from an adjacency matrix.', 'class Solution {
    public int findCircleNum(int[][] isConnected) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(220, 2, 23, 2, 'course-schedule', 'course-schedule', 220, 'Course Schedule', '<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you must take course <code>bi</code> first if you want to take course <code>ai</code>. Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>.</p>', 'Integer <code>numCourses</code> and 2D array <code>prerequisites</code>.', 'Boolean <code>true</code> if possible.', '["1 <= numCourses <= 2000","0 <= prerequisites.length <= 5000","prerequisites[i].length == 2","0 <= ai, bi < numCourses"]', 'Determine if you can finish all courses given prerequisite dependencies (cycle detection in directed graph).', 'class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your solution below

        return false;
    }
}', TRUE, TRUE, 2000, 256),
(221, 2, 23, 2, 'redundant-connection', 'redundant-connection', 221, 'Redundant Connection', '<p>In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with <code>n</code> nodes labeled from <code>1</code> to <code>n</code>, with one additional edge added. The added edge has two different vertices chosen from <code>1</code> to <code>n</code>, and was not an edge that already existed. Return an edge that can be removed so that the resulting graph is a tree of <code>n</code> nodes.</p>', '2D array <code>edges</code>.', 'Edge [u, v] creating cycle.', '["n == edges.length","3 <= n <= 1000","edges[i].length == 2","1 <= ai < bi <= n"]', 'Return an edge that can be removed so that the resulting graph is a tree.', 'class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        // Write your solution below

        return new int[]{};
    }
}', TRUE, TRUE, 2000, 256),
(222, 2, 23, 2, 'course-schedule-ii', 'course-schedule-ii', 222, 'Course Schedule II', '<p>There are a total of <code>numCourses</code> courses labeled from <code>0</code> to <code>numCourses - 1</code>. Given <code>prerequisites[i] = [ai, bi]</code>, return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.</p>', 'Integer <code>numCourses</code> and <code>prerequisites</code>.', 'Array representing valid course order.', '["1 <= numCourses <= 2000","0 <= prerequisites.length <= numCourses * (numCourses - 1)"]', 'Return the ordering of courses you should take to finish all courses.', 'class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        // Write your solution below

        return new int[]{};
    }
}', TRUE, TRUE, 2000, 256),
(223, 2, 23, 1, 'alien-dictionary-order', 'alien-dictionary-order', 223, 'Verifying an Alien Dictionary', '<p>In an alien language, surprisingly, they also use English lowercase letters, but possibly in a different <code>order</code>. The <code>order</code> of the alphabet is some permutation of lowercase letters. Given a sequence of <code>words</code> written in the alien language, and the <code>order</code> of the alphabet, return <code>true</code> if and only if the given <code>words</code> are sorted lexicographically in this alien language.</p>', 'Array of strings <code>words</code> and string <code>order</code>.', 'Boolean <code>true</code> if sorted.', '["1 <= words.length <= 100","1 <= words[i].length <= 20","order.length == 26","All characters are lowercase English letters."]', 'Verify if words are sorted lexicographically according to a new alien language alphabet order.', 'class Solution {
    public boolean isAlienSorted(String[] words, String order) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(224, 2, 23, 2, 'network-delay-time', 'network-delay-time', 224, 'Network Delay Time', '<p>You are given a network of <code>n</code> nodes, labeled from <code>1</code> to <code>n</code>. You are also given <code>times</code>, a list of travel times as directed edges <code>times[i] = (ui, vi, wi)</code>, where <code>ui</code> is the source node, <code>vi</code> is the target node, and <code>wi</code> is the time it takes for a signal to travel from source to target. We will send a signal from a given node <code>k</code>. Return the minimum time it takes for all the <code>n</code> nodes to receive the signal. If it is impossible for all the <code>n</code> nodes to receive the signal, return <code>-1</code>.</p>', '2D array <code>times</code>, integer <code>n</code>, and starting node <code>k</code>.', 'Minimum delay time or -1.', '["1 <= k <= n <= 100","1 <= times.length <= 6000","times[i].length == 3","1 <= ui, vi <= n","ui != vi","0 <= wi <= 100"]', 'Find the minimum time it takes for all n nodes to receive a signal sent from node k using Dijkstra''s algorithm.', 'class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        // Write your solution below

        return -1;
    }
}', TRUE, TRUE, 2000, 256),
(225, 2, 23, 2, 'cheapest-flights-within-k-stops', 'cheapest-flights-within-k-stops', 225, 'Cheapest Flights Within K Stops', '<p>There are <code>n</code> cities connected by some number of flights. You are given an array <code>flights</code> where <code>flights[i] = [fromi, toi, pricei]</code> indicates that there is a flight from city <code>fromi</code> to city <code>toi</code> with cost <code>pricei</code>. You are also given three integers <code>src</code>, <code>dst</code>, and <code>k</code>, return the cheapest price from <code>src</code> to <code>dst</code> with at most <code>k</code> stops. If there is no such route, return <code>-1</code>.</p>', 'Array <code>flights</code>, integers <code>src, dst, k</code>.', 'Cheapest flight cost or -1.', '["1 <= n <= 100","0 <= flights.length <= (n * (n - 1) / 2)","0 <= src, dst, k < n"]', 'Find the cheapest price from src to dst with at most k stops.', 'class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        // Write your solution below

        return -1;
    }
}', TRUE, TRUE, 2000, 256),
(226, 2, 24, 2, 'non-overlapping-intervals', 'non-overlapping-intervals', 226, 'Non-overlapping Intervals', '<p>Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= intervals.length <= 10^5","intervals[i].length == 2","-5 * 10^4 <= start_i < end_i <= 5 * 10^4"]', 'Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals ...', 'class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(227, 2, 24, 2, 'meeting-rooms-ii', 'meeting-rooms-ii', 227, 'Meeting Rooms II', '<p>Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required to accommodate all meetings.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= intervals.length <= 10^4","0 <= start_i < end_i <= 10^6"]', 'Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number ...', 'class Solution {
    public int minMeetingRooms(int[][] intervals) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(228, 2, 24, 2, 'minimum-number-of-arrows-to-burst-balloons', 'minimum-number-of-arrows-to-burst-balloons', 228, 'Minimum Number of Arrows to Burst Balloons', '<p>There are spherical balloons taped to a flat wall. You are given a 2D integer array `points` where `points[i] = [x_start, x_end]`. An arrow shot vertically upwards from x bursts all balloons with `x_start <= x <= x_end`. Return the minimum number of arrows that must be shot to burst all balloons.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= points.length <= 10^5","points[i].length == 2","-2^31 <= x_start < x_end <= 2^31 - 1"]', 'There are spherical balloons taped to a flat wall. You are given a 2D integer array `points` where `points[i] = [x_start...', 'class Solution {
    public int findMinArrowShots(int[][] points) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(229, 2, 24, 1, 'assign-cookies', 'assign-cookies', 229, 'Assign Cookies', '<p>Assume you are an awesome parent and want to give your children some cookies. Each child `i` has a greed factor `g[i]`, and each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, the child is content. Your goal is to maximize the number of your content children and output the maximum number.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= g.length <= 3 * 10^4","0 <= s.length <= 3 * 10^4","1 <= g[i], s[j] <= 2^31 - 1"]', 'Assume you are an awesome parent and want to give your children some cookies. Each child `i` has a greed factor `g[i]`, ...', 'class Solution {
    public int findContentChildren(int[] g, int[] s) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(230, 2, 24, 1, 'lemonade-change', 'lemonade-change', 230, 'Lemonade Change', '<p>At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue and order one at a time. Each customer will only buy one lemonade and pay with either a `$5`, `$10`, or `$20` bill. You must provide the correct change to each customer, starting with no change in hand. Return `true` if and only if you can provide every customer with correct change.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= bills.length <= 10^5","bills[i] is either 5, 10, or 20"]', 'At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue and order one at a time. Each customer ...', 'class Solution {
    public boolean lemonadeChange(int[] bills) {
        // Write your solution here
        return true;
    }
}', FALSE, TRUE, 2000, 256),
(231, 2, 24, 2, 'gas-station', 'gas-station', 231, 'Gas Station', '<p>There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. Traveling from station `i` to `i + 1` costs `cost[i]` of gas. Return the starting gas station''s index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is guaranteed to be unique.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["n == gas.length == cost.length","1 <= n <= 10^5","0 <= gas[i], cost[i] <= 10^4"]', 'There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. Traveling ...', 'class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        // Write your solution here
        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(232, 2, 24, 2, 'queue-reconstruction-by-height', 'queue-reconstruction-by-height', 232, 'Queue Reconstruction by Height', '<p>You are given an array of people, `people`, where `people[i] = [h_i, k_i]` represents the `i-th` person of height `h_i` with exactly `k_i` other people in front who have a height greater than or equal to `h_i`. Reconstruct and return the queue that meets these attributes.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= people.length <= 2000","0 <= h_i <= 10^6","0 <= k_i < people.length"]', 'You are given an array of people, `people`, where `people[i] = [h_i, k_i]` represents the `i-th` person of height `h_i` ...', 'class Solution {
    public int[][] reconstructQueue(int[][] people) {
        // Write your solution here
        return new int[0][0];
    }
}', FALSE, TRUE, 2000, 256),
(233, 2, 24, 2, 'task-scheduler', 'task-scheduler', 233, 'Task Scheduler', '<p>Given a characters array `tasks`, representing the tasks a CPU needs to do, and an integer `n` representing the cooldown interval between two identical tasks. Return the minimum number of units of times that the CPU will take to finish all the given tasks.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= tasks.length <= 10^4","tasks[i] is uppercase English letter","0 <= n <= 100"]', 'Given a characters array `tasks`, representing the tasks a CPU needs to do, and an integer `n` representing the cooldown...', 'class Solution {
    public int leastInterval(char[] tasks, int n) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(234, 2, 24, 3, 'candy', 'candy', 234, 'Candy', '<p>There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`. You must give each child at least 1 candy, and children with a higher rating than their immediate neighbors must get more candies than their neighbor. Return the minimum number of candies you need to have to distribute the candies to the children.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["n == ratings.length","1 <= n <= 2 * 10^4","0 <= ratings[i] <= 2 * 10^4"]', 'There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`. Y...', 'class Solution {
    public int candy(int[] ratings) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(235, 2, 24, 2, 'jump-game', 'jump-game', 235, 'Jump Game', '<p>You are given an integer array `nums`. You are initially positioned at the array''s first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= nums.length <= 10^4","0 <= nums[i] <= 10^5"]', 'You are given an integer array `nums`. You are initially positioned at the array''s first index, and each element in the ...', 'class Solution {
    public boolean canJump(int[] nums) {
        // Write your solution here
        return false;
    }
}', FALSE, TRUE, 2000, 256),
(236, 2, 24, 2, 'jump-game-ii', 'jump-game-ii', 236, 'Jump Game II', '<p>You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`. Each element `nums[i]` represents the maximum length of a forward jump from index `i`. Return the minimum number of jumps to reach `nums[n - 1]`. The test cases are generated such that you can reach `nums[n - 1]`.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= nums.length <= 10^4","0 <= nums[i] <= 1000"]', 'You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`. Each elemen...', 'class Solution {
    public int jump(int[] nums) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(237, 2, 25, 1, 'climbing-stairs', 'climbing-stairs', 237, 'Climbing Stairs', '<p>You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= n <= 45"]', 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how m...', 'class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(238, 2, 25, 2, 'house-robber', 'house-robber', 238, 'House Robber', '<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= nums.length <= 100","0 <= nums[i] <= 400"]', 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, t...', 'class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(239, 2, 25, 2, 'house-robber-ii', 'house-robber-ii', 239, 'House Robber II', '<p>You are a professional robber planning to rob houses along a street. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Adjacent houses have security systems connected. Return the maximum amount of money you can rob tonight without alerting the police.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= nums.length <= 100","0 <= nums[i] <= 1000"]', 'You are a professional robber planning to rob houses along a street. All houses at this place are arranged in a circle. ...', 'class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(240, 2, 25, 2, 'decode-ways', 'decode-ways', 240, 'Decode Ways', '<p>A message containing letters from A-Z can be encoded into numbers using ''A'' -> ''1'', ''B'' -> ''2'', ..., ''Z'' -> ''26''. Given a string `s` containing only digits, return the number of ways to decode it.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= s.length <= 100","s contains only digits and may contain leading zero(s)"]', 'A message containing letters from A-Z can be encoded into numbers using ''A'' -> ''1'', ''B'' -> ''2'', ..., ''Z'' -> ''26''. Given ...', 'class Solution {
    public int numDecodings(String s) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(241, 2, 25, 2, 'unique-paths', 'unique-paths', 241, 'Unique Paths', '<p>There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= m, n <= 100"]', 'There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to ...', 'class Solution {
    public int uniquePaths(int m, int n) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(242, 2, 25, 2, 'unique-paths-ii', 'unique-paths-ii', 242, 'Unique Paths II', '<p>You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. An obstacle and space are marked as `1` or `0` respectively in `grid`. A path that the robot takes cannot include any square that is an obstacle. Return the number of possible unique paths.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["m == obstacleGrid.length","n == obstacleGrid[i].length","1 <= m, n <= 100","obstacleGrid[i][j] is 0 or 1"]', 'You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner `(0, 0)`. The r...', 'class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(243, 2, 25, 2, 'edit-distance', 'edit-distance', 243, 'Edit Distance', '<p>Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["0 <= word1.length, word2.length <= 500","word1 and word2 consist of lowercase English letters"]', 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. Y...', 'class Solution {
    public int minDistance(String word1, String word2) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(244, 2, 25, 2, 'partition-equal-subset-sum', 'partition-equal-subset-sum', 244, 'Partition Equal Subset Sum', '<p>Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= nums.length <= 200","1 <= nums[i] <= 100"]', 'Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the el...', 'class Solution {
    public boolean canPartition(int[] nums) {
        // Write your solution here
        return false;
    }
}', TRUE, TRUE, 2000, 256),
(245, 2, 25, 2, 'target-sum', 'target-sum', 245, 'Target Sum', '<p>You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one of the symbols ''+'' and ''-'' before each integer in nums and then concatenate all the integers. Return the number of different expressions that you can build, which evaluates to `target`.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= nums.length <= 20","0 <= nums[i] <= 1000","0 <= sum(nums[i]) <= 1000","-1000 <= target <= 1000"]', 'You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one...', 'class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(246, 2, 25, 2, 'coin-change', 'coin-change', 246, 'Coin Change', '<p>You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`. You may assume that you have an infinite number of each kind of coin.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= coins.length <= 12","1 <= coins[i] <= 2^31 - 1","0 <= amount <= 10^4"]', 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representin...', 'class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}', FALSE, TRUE, 2000, 256),
(247, 2, 25, 2, 'coin-change-ii', 'coin-change-ii', 247, 'Coin Change II', '<p>You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return `0`. You may assume that you have an infinite number of each kind of coin.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= coins.length <= 300","1 <= coins[i] <= 5000","0 <= amount <= 5000"]', 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representin...', 'class Solution {
    public int change(int amount, int[] coins) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(248, 2, 25, 2, 'longest-increasing-subsequence', 'longest-increasing-subsequence', 248, 'Longest Increasing Subsequence', '<p>Given an integer array `nums`, return the length of the longest strictly increasing subsequence.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= nums.length <= 2500","-10^4 <= nums[i] <= 10^4"]', 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.', 'class Solution {
    public int lengthOfLIS(int[] nums) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(249, 2, 25, 2, 'longest-common-subsequence', 'longest-common-subsequence', 249, 'Longest Common Subsequence', '<p>Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= text1.length, text2.length <= 1000","text1 and text2 consist of only lowercase English characters"]', 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subs...', 'class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(250, 2, 25, 2, 'word-break', 'word-break', 250, 'Word Break', '<p>Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["1 <= s.length <= 300","1 <= wordDict.length <= 1000","1 <= wordDict[i].length <= 20","s and wordDict[i] consist of only lowercase English letters"]', 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated ...', 'import java.util.List;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        return false;
    }
}', FALSE, TRUE, 2000, 256),
(251, 2, 25, 2, 'minimum-path-sum', 'minimum-path-sum', 251, 'Minimum Path Sum', '<p>Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. Note: You can only move either down or right at any point in time.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["m == grid.length","n == grid[i].length","1 <= m, n <= 200","0 <= grid[i][j] <= 200"]', 'Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the su...', 'class Solution {
    public int minPathSum(int[][] grid) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(252, 2, 25, 2, 'maximal-square', 'maximal-square', 252, 'Maximal Square', '<p>Given an `m x n` binary matrix filled with ''0''s and ''1''s, find the largest square containing only 1''s and return its area.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["m == matrix.length","n == matrix[i].length","1 <= m, n <= 300","matrix[i][j] is ''0'' or ''1''"]', 'Given an `m x n` binary matrix filled with ''0''s and ''1''s, find the largest square containing only 1''s and return its are...', 'class Solution {
    public int maximalSquare(char[][] matrix) {
        // Write your solution here
        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(253, 2, 25, 1, 'min-cost-climbing-stairs', 'min-cost-climbing-stairs', 253, 'Min Cost Climbing Stairs', '<p>You are given an integer array `cost` where `cost[i]` is the cost of `i-th` step on a staircase. Once you pay the cost, you can either climb one or two steps. You can either start from the step with index 0, or the step with index 1. Return the minimum cost to reach the top of the floor.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["2 <= cost.length <= 1000","0 <= cost[i] <= 999"]', 'You are given an integer array `cost` where `cost[i]` is the cost of `i-th` step on a staircase. Once you pay the cost, ...', 'class Solution {
    public int minCostClimbingStairs(int[] cost) {
        // Write your solution here
        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(254, 2, 25, 1, 'counting-bits', 'counting-bits', 254, 'Counting Bits', '<p>Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the number of 1''s in the binary representation of `i`.</p>', 'Standard input parameters as defined in function signature.', 'Return value matching the expected method return type.', '["0 <= n <= 10^5"]', 'Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the numb...', 'class Solution {
    public int[] countBits(int n) {
        // Write your solution here
        return new int[n + 1];
    }
}', FALSE, TRUE, 2000, 256),
(255, 2, 14, 1, 'richest-customer-wealth', 'richest-customer-wealth', 255, 'Richest Customer Wealth', '<p>You are given an <code>m x n</code> integer grid <code>accounts</code> where <code>accounts[i][j]</code> is the amount of money the <code>i-th</code> customer has in the <code>j-th</code> bank. Return the wealth that the richest customer has. A customer''s wealth is the amount of money they have in all their bank accounts.</p>', 'A 2D integer array accounts.', 'A single integer representing the maximum wealth.', '["m == accounts.length","n == accounts[i].length","1 <= m, n <= 50","1 <= accounts[i][j] <= 100"]', 'You are given an m x n integer grid accounts where accounts[i][j] is the money customer i has in bank j. Return the wealth of the richest customer.', 'class Solution {
    public int maximumWealth(int[][] accounts) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(256, 2, 14, 2, 'fruit-into-baskets', 'fruit-into-baskets', 256, 'Fruit Into Baskets', '<p>You are visiting a farm that has a single row of fruit trees arranged from left to right. You are given an integer array <code>fruits</code> where <code>fruits[i]</code> is the type of fruit the <code>i-th</code> tree produces. You have two baskets, and each basket can only hold a single type of fruit. Return the maximum number of fruits you can pick.</p>', 'An integer array fruits.', 'An integer representing the maximum number of fruits.', '["1 <= fruits.length <= 10^5","0 <= fruits[i] < fruits.length"]', 'You are visiting a farm that has a single row of fruit trees. You have two baskets, and each basket can only hold a single type of fruit.', 'class Solution {
    public int totalFruit(int[] fruits) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(257, 2, 14, 2, 'contiguous-array', 'contiguous-array', 257, 'Contiguous Array', '<p>Given a binary array <code>nums</code>, return the maximum length of a contiguous subarray with an equal number of <code>0</code> and <code>1</code>.</p>', 'A binary array nums containing only 0s and 1s.', 'An integer representing the maximum length.', '["1 <= nums.length <= 10^5","nums[i] is either 0 or 1"]', 'Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.', 'class Solution {
    public int findMaxLength(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(258, 2, 14, 2, 'maximum-product-subarray', 'maximum-product-subarray', 258, 'Maximum Product Subarray', '<p>Given an integer array <code>nums</code>, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer.</p>', 'An integer array nums.', 'A 32-bit signed integer representing the maximum product.', '["1 <= nums.length <= 2 * 10^4","-10 <= nums[i] <= 10"]', 'Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.', 'class Solution {
    public int maxProduct(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(259, 2, 14, 2, 'majority-element-ii', 'majority-element-ii', 259, 'Majority Element II', '<p>Given an integer array of size <code>n</code>, find all elements that appear more than <code>⌊ n/3 ⌋</code> times. Solve in linear time and O(1) space.</p>', 'An integer array nums.', 'A list of integers that appear more than n/3 times.', '["1 <= nums.length <= 5 * 10^4","-10^9 <= nums[i] <= 10^9"]', 'Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times.', 'class Solution {
    public java.util.List<Integer> majorityElement(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(260, 2, 14, 2, 'merge-intervals', 'merge-intervals', 260, 'Merge Intervals', '<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>', 'A 2D integer array intervals.', 'A 2D integer array of merged intervals.', '["1 <= intervals.length <= 10^4","intervals[i].length == 2","0 <= start_i <= end_i <= 10^4"]', 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.', 'class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution below

        return new int[0][0];
    }
}', FALSE, TRUE, 2000, 256),
(261, 2, 15, 1, 'jewels-and-stones', 'jewels-and-stones', 261, 'Jewels and Stones', '<p>You''re given strings <code>jewels</code> representing the types of stones that are jewels, and <code>stones</code> representing the stones you have. Each character in <code>stones</code> is a type of stone you have. You want to know how many of the stones you have are also jewels. Letters are case sensitive.</p>', 'Two strings jewels and stones.', 'An integer count of jewels in stones.', '["1 <= jewels.length, stones.length <= 50","jewels and stones consist of only English letters.","All the characters of jewels are unique."]', 'You''re given strings jewels representing the types of stones that are jewels, and stones representing the stones you have. Find how many stones are jewels.', 'class Solution {
    public int numJewelsInStones(String jewels, String stones) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(262, 2, 15, 2, 'reverse-words-in-a-string', 'reverse-words-in-a-string', 262, 'Reverse Words in a String', '<p>Given an input string <code>s</code>, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in <code>s</code> will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space, with no leading or trailing spaces.</p>', 'A string s consisting of English letters, digits, and spaces.', 'A formatted string with words in reverse order.', '["1 <= s.length <= 10^4","s contains English letters, digits, and spaces '' ''.","There is at least one word in s."]', 'Given an input string s, reverse the order of the words.', 'class Solution {
    public String reverseWords(String s) {
        // Write your solution below

        return "";
    }
}', FALSE, TRUE, 2000, 256),
(263, 2, 15, 1, 'repeated-substring-pattern', 'repeated-substring-pattern', 263, 'Repeated Substring Pattern', '<p>Given a string <code>s</code>, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.</p>', 'A string s consisting of lowercase English letters.', 'true if s can be constructed by repeating a substring, false otherwise.', '["1 <= s.length <= 10^4","s consists of lowercase English letters."]', 'Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.', 'class Solution {
    public boolean repeatedSubstringPattern(String s) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(264, 2, 16, 1, 'intersection-of-two-arrays', 'intersection-of-two-arrays', 264, 'Intersection of Two Arrays', '<p>Given two integer arrays <code>nums1</code> and <code>nums2</code>, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.</p>', 'Two integer arrays nums1 and nums2.', 'An integer array containing unique intersecting elements.', '["1 <= nums1.length, nums2.length <= 1000","0 <= nums1[i], nums2[i] <= 1000"]', 'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.', 'class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        // Write your solution below

        return new int[0];
    }
}', FALSE, TRUE, 2000, 256),
(265, 2, 16, 1, 'single-number', 'single-number', 265, 'Single Number', '<p>Given a non-empty array of integers <code>nums</code>, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.</p>', 'An integer array nums.', 'The unique single integer.', '["1 <= nums.length <= 3 * 10^4","-3 * 10^4 <= nums[i] <= 3 * 10^4","Each element appears twice except for one element which appears once."]', 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.', 'class Solution {
    public int singleNumber(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(266, 2, 16, 2, 'subarray-sums-divisible-by-k', 'subarray-sums-divisible-by-k', 266, 'Subarray Sums Divisible by K', '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the number of non-empty subarrays that have a sum divisible by <code>k</code>. A subarray is a contiguous part of an array.</p>', 'An integer array nums and an integer k.', 'An integer representing the count of valid subarrays.', '["1 <= nums.length <= 3 * 10^4","-10^4 <= nums[i] <= 10^4","2 <= k <= 10^4"]', 'Given an integer array nums and an integer k, return the number of non-empty subarrays that have a sum divisible by k.', 'class Solution {
    public int subarraysDivByK(int[] nums, int k) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(267, 2, 16, 2, 'custom-sort-string', 'custom-sort-string', 267, 'Custom Sort String', '<p>You are given two strings <code>order</code> and <code>s</code>. All the characters of order are unique and were sorted in some custom order previously. Permute the characters of <code>s</code> so that they match the order that <code>order</code> was sorted. More specifically, if a character x occurs before a character y in order, then x should occur before y in the permuted string.</p>', 'Two strings order and s.', 'A permuted string.', '["1 <= order.length <= 26","1 <= s.length <= 200","order and s consist of lowercase English letters.","All characters of order are unique."]', 'You are given two strings order and s. Permute the characters of s so that they match the order that order was sorted.', 'class Solution {
    public String customSortString(String order, String s) {
        // Write your solution below

        return "";
    }
}', FALSE, TRUE, 2000, 256),
(268, 2, 17, 2, 'circular-array-loop', 'circular-array-loop', 268, 'Circular Array Loop', '<p>An array of non-zero integers <code>nums</code> represents a circular sequence. Movement from index i jumps by nums[i] steps (modulo n). Determine if there is a cycle where every jump moves in the SAME direction (all positive or all negative) and the cycle length is strictly greater than 1.</p>', 'An integer array nums.', 'true if there is a valid unidirectional cycle, false otherwise.', '["1 <= nums.length <= 5000","-1000 <= nums[i] <= 1000","nums[i] != 0"]', 'An array of non-zero integers nums represents a circular sequence. Determine if there is a loop in nums.', 'class Solution {
    public boolean circularArrayLoop(int[] nums) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(269, 2, 17, 2, 'partition-list', 'partition-list', 269, 'Partition List', '<p>Given the head of a linked list and a value <code>x</code>, partition it such that all nodes less than <code>x</code> come before nodes greater than or equal to <code>x</code>. You should preserve the original relative order of the nodes in each of the two partitions.</p>', 'The head of a ListNode and an integer x.', 'The head of the partitioned linked list.', '["The number of nodes in the list is in the range [0, 200].","-100 <= Node.val <= 100","-200 <= x <= 200"]', 'Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.', 'class Solution {
    public ListNode partition(ListNode head, int x) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(270, 2, 17, 2, 'copy-list-with-random-pointer', 'copy-list-with-random-pointer', 270, 'Copy List with Random Pointer', '<p>Construct a deep copy of a linked list where each node has a <code>next</code> pointer and a <code>random</code> pointer pointing to any node in the list, or <code>null</code>.</p>', 'The head of a Node with next and random references.', 'The head of the cloned list.', '["0 <= n <= 1000","-10^4 <= Node.val <= 10^4","Node.random is null or is pointing to some node in the linked list."]', 'A linked list of length n is given such that each node contains an additional random pointer. Construct a deep copy of the list.', 'class Solution {
    public Node copyRandomList(Node head) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(271, 2, 18, 1, 'implement-stack-using-queues', 'implement-stack-using-queues', 271, 'Implement Stack using Queues', '<p>Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (<code>push</code>, <code>top</code>, <code>pop</code>, and <code>empty</code>).</p>', 'Sequence of stack operations.', 'Return values corresponding to top, pop, and empty operations.', '["1 <= x <= 9","At most 100 calls will be made to push, pop, top, and empty.","All the calls to pop and top are valid."]', 'Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support push, top, pop, and empty.', 'class Solution {
    public void push(int x) {
        // Write your solution below

        return // in-place queue simulation;
    }
}', FALSE, TRUE, 2000, 256),
(272, 2, 18, 1, 'final-prices-with-a-special-discount', 'final-prices-with-a-special-discount', 272, 'Final Prices With a Special Discount', '<p>You are given an integer array <code>prices</code> where <code>prices[i]</code> is the price of the <code>i-th</code> item in a shop. There is a special discount: you will receive a discount equivalent to <code>prices[j]</code> where <code>j</code> is the minimum index such that <code>j > i</code> and <code>prices[j] <= prices[i]</code>. Return an integer array of the final prices.</p>', 'An integer array prices.', 'An integer array of final prices after discount.', '["1 <= prices.length <= 500","1 <= prices[i] <= 1000"]', 'Given an integer array prices, apply a special discount from the next smaller or equal item.', 'class Solution {
    public int[] finalPrices(int[] prices) {
        // Write your solution below

        return new int[0];
    }
}', FALSE, TRUE, 2000, 256),
(273, 2, 18, 3, 'shortest-subarray-with-sum-at-least-k', 'shortest-subarray-with-sum-at-least-k', 273, 'Shortest Subarray with Sum at Least K', '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the length of the shortest non-empty subarray of <code>nums</code> with a sum of at least <code>k</code>. If there is no such subarray, return <code>-1</code>.</p>', 'An integer array nums and an integer k.', 'An integer length or -1.', '["1 <= nums.length <= 10^5","-10^5 <= nums[i] <= 10^5","1 <= k <= 10^9"]', 'Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k.', 'class Solution {
    public int shortestSubarray(int[] nums, int k) {
        // Write your solution below

        return -1;
    }
}', TRUE, TRUE, 2000, 256),
(274, 2, 19, 1, 'first-bad-version', 'first-bad-version', 274, 'First Bad Version', '<p>You have <code>n</code> versions <code>[1, 2, ..., n]</code> and you want to find out the first bad one, which causes all the following ones to be bad. You are given an API <code>bool isBadVersion(version)</code> which returns whether version is bad. Implement a function to find the first bad version with the fewest API calls.</p>', 'An integer n.', 'The version number of the first bad version.', '["1 <= k <= n <= 2^31 - 1"]', 'You are a product manager and currently leading a team to develop a new product. Find the first bad version using the isBadVersion API.', 'class Solution {
    public int firstBadVersion(int n) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(275, 2, 19, 2, 'find-peak-element', 'find-peak-element', 275, 'Find Peak Element', '<p>A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array <code>nums</code>, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. You must write an algorithm that runs in O(log n) time.</p>', 'An integer array nums.', 'The index of any peak element.', '["1 <= nums.length <= 1000","-2^31 <= nums[i] <= 2^31 - 1","nums[i] != nums[i + 1] for all valid i."]', 'A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element.', 'class Solution {
    public int findPeakElement(int[] nums) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(276, 2, 19, 2, 'search-in-rotated-sorted-array-ii', 'search-in-rotated-sorted-array-ii', 276, 'Search in Rotated Sorted Array II', '<p>There is an integer array <code>nums</code> sorted in non-decreasing order (not necessarily with distinct values). Given the array <code>nums</code> after being rotated and an integer <code>target</code>, return <code>true</code> if <code>target</code> is in <code>nums</code>, or <code>false</code> if it is not in <code>nums</code>.</p>', 'An integer array nums with duplicates and an integer target.', 'A boolean true or false.', '["1 <= nums.length <= 5000","-10^4 <= nums[i] <= 10^4","-10^4 <= target <= 10^4"]', 'Given the array nums after being rotated at an unknown pivot and an integer target, return true if target is in nums, or false if not.', 'class Solution {
    public boolean search(int[] nums, int target) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(277, 2, 20, 1, 'power-of-four', 'power-of-four', 277, 'Power of Four', '<p>Given an integer <code>n</code>, return <code>true</code> if it is a power of four. Otherwise, return <code>false</code>. An integer n is a power of four if there exists an integer x such that n == 4^x.</p>', 'An integer n.', 'true if n is a power of four, false otherwise.', '["-2^31 <= n <= 2^31 - 1"]', 'Given an integer n, return true if it is a power of four. Otherwise, return false.', 'class Solution {
    public boolean isPowerOfFour(int n) {
        // Write your solution below

        return false;
    }
}', FALSE, TRUE, 2000, 256),
(278, 2, 20, 2, 'letter-case-permutation', 'letter-case-permutation', 278, 'Letter Case Permutation', '<p>Given a string <code>s</code>, you can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings we could create. Return the output in any order.</p>', 'A string s consisting of English letters and digits.', 'A list of all generated strings.', '["1 <= s.length <= 12","s consists of lowercase English letters, uppercase English letters, and digits."]', 'Given a string s, you can transform every letter individually to be lowercase or uppercase to create another string. Return a list of all possible strings.', 'class Solution {
    public java.util.List<String> letterCasePermutation(String s) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', FALSE, TRUE, 2000, 256),
(279, 2, 20, 2, 'next-permutation', 'next-permutation', 279, 'Next Permutation', '<p>A permutation of an array of integers is an arrangement of its members into a sequence or linear order. The next permutation of an array of integers is the next lexicographically greater permutation of its integer. If no greater permutation is possible, rearrange as the lowest possible order (sorted in ascending order). Must be solved in-place.</p>', 'An integer array nums.', 'None (modifies nums in-place).', '["1 <= nums.length <= 100","0 <= nums[i] <= 100"]', 'A permutation of an array of integers is an arrangement of its members into a sequence. Find the next lexicographically greater permutation.', 'class Solution {
    public void nextPermutation(int[] nums) {
        // Write your solution below

        return // in-place;
    }
}', TRUE, TRUE, 2000, 256),
(280, 2, 20, 2, 'combination-sum-ii', 'combination-sum-ii', 280, 'Combination Sum II', '<p>Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code> where the candidate numbers sum to <code>target</code>. Each number in candidates may only be used once in the combination. The solution set must not contain duplicate combinations.</p>', 'An integer array candidates and an integer target.', 'A list of lists containing unique combinations.', '["1 <= candidates.length <= 100","1 <= candidates[i] <= 50","1 <= target <= 30"]', 'Given a collection of candidate numbers and a target number, find all unique combinations in candidates where the candidate numbers sum to target.', 'class Solution {
    public java.util.List<java.util.List<Integer>> combinationSum2(int[] candidates, int target) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(281, 2, 21, 2, 'lowest-common-ancestor-of-deepest-leaves', 'lowest-common-ancestor-of-deepest-leaves', 281, 'Lowest Common Ancestor of Deepest Leaves', '<p>Given the root of a binary tree, return the lowest common ancestor of its deepest leaves. A leaf is called deepest if it has the largest depth possible among any leaf in the entire tree.</p>', 'The root of a TreeNode.', 'The TreeNode that is the lowest common ancestor of deepest leaves.', '["The number of nodes in the tree will be in the range [1, 1000].","0 <= Node.val <= 1000"]', 'Given the root of a binary tree, return the lowest common ancestor of its deepest leaves.', 'class Solution {
    public TreeNode lcaDeepestLeaves(TreeNode root) {
        // Write your solution below

        return null;
    }
}', FALSE, TRUE, 2000, 256),
(282, 2, 22, 2, 'k-closest-points-to-origin', 'k-closest-points-to-origin', 282, 'K Closest Points to Origin', '<p>Given an array of <code>points</code> where <code>points[i] = [x_i, y_i]</code> represents a point on the X-Y plane and an integer <code>k</code>, return the <code>k</code> closest points to the origin <code>(0, 0)</code>. Distance is calculated via Euclidean distance: x^2 + y^2.</p>', 'A 2D integer array points and an integer k.', 'A 2D integer array of the k closest points.', '["1 <= k <= points.length <= 10^4","-10^4 <= x_i, y_i <= 10^4"]', 'Given an array of points where points[i] = [x_i, y_i] and an integer k, return the k closest points to the origin (0, 0).', 'class Solution {
    public int[][] kClosest(int[][] points, int k) {
        // Write your solution below

        return new int[0][0];
    }
}', TRUE, TRUE, 2000, 256),
(283, 2, 22, 2, 'kth-smallest-element-in-a-bst', 'kth-smallest-element-in-a-bst', 283, 'Kth Smallest Value in a BST', '<p>Given the root of a binary search tree, and an integer <code>k</code>, return the <code>k-th</code> smallest value (1-indexed) of all the values of the nodes in the tree.</p>', 'The root of a TreeNode and an integer k.', 'An integer representing the kth smallest value.', '["The number of nodes in the tree is n.","1 <= k <= n <= 10^4","0 <= Node.val <= 10^4"]', 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.', 'class Solution {
    public int kthSmallest(TreeNode root, int k) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(284, 2, 22, 3, 'ipo-project-selection', 'ipo-project-selection', 284, 'IPO Project Capital Selection', '<p>Suppose LeetCode will start its IPO soon. To generate capital, you are given <code>k</code> projects. You are given <code>n</code> projects where the <code>i-th</code> project has a pure profit <code>profits[i]</code> and a minimum capital <code>capital[i]</code> needed to start it. Initially, you have <code>w</code> capital. Choose at most <code>k</code> distinct projects to maximize your total capital.</p>', 'Integers k, w, and integer arrays profits and capital.', 'An integer representing the maximum possible final capital.', '["1 <= k <= 10^5","0 <= w <= 10^9","n == profits.length == capital.length","1 <= n <= 10^5","0 <= profits[i] <= 10^4","0 <= capital[i] <= 10^9"]', 'Given n projects with profits and capitals, pick at most k distinct projects to maximize your final capital.', 'class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(285, 2, 22, 2, 'kth-smallest-element-in-a-sorted-matrix', 'kth-smallest-element-in-a-sorted-matrix', 285, 'Kth Smallest Element in a Sorted Matrix', '<p>Given an <code>n x n</code> matrix where each of the rows and columns is sorted in ascending order, return the <code>k-th</code> smallest element in the matrix. Note that it is the kth smallest element in the sorted order, not the kth distinct element.</p>', 'An n x n 2D integer array matrix and an integer k.', 'The kth smallest integer.', '["n == matrix.length == matrix[i].length","1 <= n <= 300","-10^9 <= matrix[i][j] <= 10^9","All the rows and columns of matrix are guaranteed to be sorted in non-decreasing order.","1 <= k <= n^2"]', 'Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.', 'class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(286, 2, 23, 2, 'count-sub-islands', 'count-sub-islands', 286, 'Count Sub Islands', '<p>You are given two <code>m x n</code> binary matrices <code>grid1</code> and <code>grid2</code> containing only <code>0</code>''s (water) and <code>1</code>''s (land). Return the number of islands in <code>grid2</code> that are considered sub-islands.</p>', 'Two 2D integer arrays grid1 and grid2.', 'An integer count of sub-islands.', '["m == grid1.length == grid2.length","n == grid1[i].length == grid2[i].length","1 <= m, n <= 500","grid1[i][j] and grid2[i][j] are either 0 or 1."]', 'You are given two m x n binary matrices grid1 and grid2. An island in grid2 is considered a sub-island if there is an island in grid1 that contains all the cells that make up this island in grid2.', 'class Solution {
    public int countSubIslands(int[][] grid1, int[][] grid2) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(287, 2, 23, 2, 'graph-valid-tree', 'graph-valid-tree', 287, 'Graph Valid Tree', '<p>Given <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code> and a list of undirected edges (each edge is a pair of nodes), write a function to check whether these edges make up a valid tree.</p>', 'An integer n and a 2D integer array edges.', 'true if the graph forms a valid tree, false otherwise.', '["1 <= n <= 2000","0 <= edges.length <= 5000","edges[i].length == 2","0 <= a_i, b_i < n"]', 'Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if these edges make up a valid tree.', 'class Solution {
    public boolean validTree(int n, int[][] edges) {
        // Write your solution below

        return false;
    }
}', TRUE, TRUE, 2000, 256),
(288, 2, 23, 2, 'all-ancestors-of-a-node-in-a-dag', 'all-ancestors-of-a-node-in-a-dag', 288, 'All Ancestors of a Node in a Directed Acyclic Graph', '<p>You are given a positive integer <code>n</code> representing the number of nodes of a Directed Acyclic Graph (DAG). Given a 2D integer array <code>edges</code> where <code>edges[i] = [from_i, to_i]</code>, return a list <code>res</code> where <code>res[i]</code> is the list of ancestors of the <code>i-th</code> node, sorted in ascending order.</p>', 'An integer n and a 2D integer array edges.', 'A list of lists of sorted integers.', '["1 <= n <= 1000","0 <= edges.length <= Math.min(2000, n * (n - 1) / 2)","edges[i].length == 2","0 <= from_i, to_i < n","All pairs [from_i, to_i] are distinct.","The graph is a DAG."]', 'You are given a positive integer n representing the number of nodes of a Directed Acyclic Graph (DAG). Return a list where res[i] is the list of ancestors of node i.', 'class Solution {
    public java.util.List<java.util.List<Integer>> getAncestors(int n, int[][] edges) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(289, 2, 23, 2, 'path-with-minimum-effort', 'path-with-minimum-effort', 289, 'Path With Minimum Effort', '<p>You are a hiker preparing for an upcoming hike. You are given <code>heights</code>, a 2D array of size <code>rows x columns</code>. A route''s effort is the maximum absolute difference in heights between two consecutive cells of the route. Return the minimum effort required to travel from the top-left cell (0, 0) to the bottom-right cell (rows - 1, columns - 1).</p>', 'A 2D integer array heights.', 'An integer representing the minimum effort.', '["rows == heights.length","columns == heights[i].length","1 <= rows, columns <= 100","1 <= heights[i][j] <= 10^6"]', 'You are a hiker preparing for an upcoming hike. A route''s effort is the maximum absolute difference in heights between two consecutive cells. Find the minimum effort route.', 'class Solution {
    public int minimumEffortPath(int[][] heights) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(290, 2, 24, 1, 'maximum-units-on-a-truck', 'maximum-units-on-a-truck', 290, 'Maximum Units on a Truck', '<p>You are assigned to put some amount of boxes onto one truck. You are given a 2D array <code>boxTypes</code>, where <code>boxTypes[i] = [numberOfBoxes_i, numberOfUnitsPerBox_i]</code>. You are also given an integer <code>truckSize</code>, which is the maximum number of boxes that can be put on the truck. Return the maximum total number of units that can be put on the truck.</p>', 'A 2D integer array boxTypes and an integer truckSize.', 'An integer representing the maximum total units.', '["1 <= boxTypes.length <= 1000","1 <= numberOfBoxes_i, numberOfUnitsPerBox_i <= 1000","1 <= truckSize <= 10^6"]', 'You are assigned to put some amount of boxes onto one truck. Find the maximum total number of units that can be put on the truck.', 'class Solution {
    public int maximumUnits(int[][] boxTypes, int truckSize) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(291, 2, 25, 2, 'triangle', 'triangle', 291, 'Triangle', '<p>Given a <code>triangle</code> array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below. More formally, if you are on index <code>i</code> on the current row, you may move to either index <code>i</code> or index <code>i + 1</code> on the next row.</p>', 'A list of lists of integers representing a triangle.', 'An integer representing the minimum path sum.', '["1 <= triangle.length <= 200","triangle[0].length == 1","triangle[i].length == triangle[i - 1].length + 1","-10^4 <= triangle[i][j] <= 10^4"]', 'Given a triangle array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number of the row below.', 'class Solution {
    public int minimumTotal(java.util.List<java.util.List<Integer>> triangle) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(292, 2, 25, 1, 'n-th-tribonacci-number', 'n-th-tribonacci-number', 292, 'N-th Tribonacci Number', '<p>The Tribonacci sequence Tn is defined as: <code>T0 = 0, T1 = 1, T2 = 1</code>, and <code>Tn+3 = Tn + Tn+1 + Tn+2</code> for <code>n >= 0</code>. Given <code>n</code>, return the value of <code>Tn</code>.</p>', 'An integer n.', 'The n-th Tribonacci number.', '["0 <= n <= 37","The answer is guaranteed to fit within a 32-bit integer, ie. answer <= 2^31 - 1."]', 'The Tribonacci sequence Tn is defined as: T0 = 0, T1 = 1, T2 = 1, and Tn+3 = Tn + Tn+1 + Tn+2 for n >= 0. Given n, return the value of Tn.', 'class Solution {
    public int tribonacci(int n) {
        // Write your solution below

        return 0;
    }
}', FALSE, TRUE, 2000, 256),
(293, 2, 14, 3, 'segment-tree-range-sum', 'segment-tree-range-sum', 293, 'Range Sum Query - Mutable', '<p>Given an integer array <code>nums</code>, design a data structure that can handle multiple queries of updating an element at index <code>i</code> to a new value <code>val</code>, and querying the sum of elements between indices <code>left</code> and <code>right</code> inclusive. Both update and range sum queries must run in logarithmic time.</p>', 'An array of integers nums and query operations.', 'Results of range sum queries.', '["1 <= nums.length <= 3 * 10^4","-100 <= nums[i] <= 100","0 <= index < nums.length","0 <= left <= right < nums.length","At most 3 * 10^4 calls will be made to update and sumRange."]', 'Given an integer array nums, handle multiple queries of updating array elements and calculating the sum of elements between indices left and right.', 'class Solution {
    public int[] processRangeQueries(int[] nums, int[][] queries) {
        // Write your solution below

        return new int[0];
    }
}', TRUE, TRUE, 2000, 256),
(294, 2, 20, 3, 'word-search-ii', 'word-search-ii', 294, 'Word Search II', '<p>Given an <code>m x n</code> <code>board</code> of characters and a list of strings <code>words</code>, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a word.</p>', 'A 2D char array board and an array of String words.', 'A List of all matching words found on the board.', '["m == board.length","n == board[i].length","1 <= m, n <= 12","board[i][j] is a lowercase English letter","1 <= words.length <= 3 * 10^4","1 <= words[i].length <= 10"]', 'Given an m x n board of characters and a list of strings words, return all words on the board.', 'class Solution {
    public java.util.List<String> findWords(char[][] board, String[] words) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(295, 2, 15, 3, 'longest-duplicate-substring', 'longest-duplicate-substring', 295, 'Longest Duplicate Substring', '<p>Given a string <code>s</code>, consider all duplicated substrings: substrings of <code>s</code> that occur 2 or more times. The occurrences may overlap. Return any duplicated substring that has the longest possible length. If <code>s</code> does not have a duplicated substring, return <code>""</code>.</p>', 'A string s consisting of lowercase English letters.', 'A string representing the longest duplicate substring.', '["2 <= s.length <= 3 * 10^4","s consists of lowercase English letters."]', 'Given a string s, consider all duplicated substrings: substrings of s that occur 2 or more times. Return any duplicated substring that has the longest possible length.', 'class Solution {
    public String longestDupSubstring(String s) {
        // Write your solution below

        return "";
    }
}', TRUE, TRUE, 2000, 256),
(296, 2, 19, 3, 'count-of-smaller-numbers-after-self', 'count-of-smaller-numbers-after-self', 296, 'Count of Smaller Numbers After Self', '<p>Given an integer array <code>nums</code>, return an integer array <code>counts</code> where <code>counts[i]</code> is the number of smaller elements to the right of <code>nums[i]</code>.</p>', 'An integer array nums.', 'A List of integers representing counts of smaller elements to the right.', '["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"]', 'Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].', 'class Solution {
    public java.util.List<Integer> countSmaller(int[] nums) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(297, 2, 23, 3, 'critical-connections-in-a-network', 'critical-connections-in-a-network', 297, 'Critical Connections in a Network', '<p>There are <code>n</code> servers numbered from <code>0</code> to <code>n - 1</code> connected by undirected server-to-server <code>connections</code> forming a network. A critical connection is a connection that, if removed, will make some servers unable to reach some other server. Return all critical connections in the network in any order.</p>', 'An integer n and a List of undirected edges connections.', 'A List of edges [u, v] representing bridges.', '["2 <= n <= 10^5","n - 1 <= connections.length <= 10^5","0 <= u, v <= n - 1","u != v","There are no repeated connections.","The network is connected."]', 'There are n servers numbered from 0 to n - 1 connected by undirected server-to-server connections. Return all critical connections in the network.', 'class Solution {
    public java.util.List<java.util.List<Integer>> criticalConnections(int n, java.util.List<java.util.List<Integer>> connections) {
        // Write your solution below

        return new java.util.ArrayList<>();
    }
}', TRUE, TRUE, 2000, 256),
(298, 2, 25, 3, 'burst-balloons', 'burst-balloons', 298, 'Burst Balloons', '<p>You are given <code>n</code> balloons, indexed from <code>0</code> to <code>n - 1</code>. Each balloon is painted with a number on it represented by an array <code>nums</code>. You are asked to burst all the balloons. If you burst balloon <code>i</code>, you will get <code>nums[i - 1] * nums[i] * nums[i + 1]</code> coins. Return the maximum coins you can collect by bursting the balloons wisely.</p>', 'An integer array nums.', 'A 32-bit integer representing the maximum collected coins.', '["n == nums.length","1 <= n <= 300","0 <= nums[i] <= 100"]', 'You are given n balloons, indexed from 0 to n - 1. Return the maximum coins you can collect by bursting the balloons wisely.', 'class Solution {
    public int maxCoins(int[] nums) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(299, 2, 16, 2, 'single-number-ii', 'single-number-ii', 299, 'Single Number II', '<p>Given an integer array <code>nums</code> where every element appears three times except for one, which appears exactly once. Find the single element and return it. You must implement a solution with a linear runtime complexity and use only constant extra space.</p>', 'An integer array nums.', 'The single integer appearing exactly once.', '["1 <= nums.length <= 3 * 10^4","-2^31 <= nums[i] <= 2^31 - 1","Each element in nums appears exactly three times except for one element which appears once."]', 'Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element.', 'class Solution {
    public int singleNumber(int[] nums) {
        // Write your solution below

        return 0;
    }
}', TRUE, TRUE, 2000, 256),
(300, 2, 25, 3, 'regular-expression-matching', 'regular-expression-matching', 300, 'Regular Expression Matching', '<p>Given an input string <code>s</code> and a pattern <code>p</code>, implement regular expression matching with support for <code>''.''</code> and <code>''*''</code> where <code>''.''</code> matches any single character and <code>''*''</code> matches zero or more of the preceding element. The matching should cover the entire input string (not partial).</p>', 'Two strings s and p.', 'A boolean: true if pattern matches s, false otherwise.', '["1 <= s.length <= 20","1 <= p.length <= 20","s contains only lowercase English letters.","p contains only lowercase English letters, ''.'', and ''*''.","It is guaranteed for each appearance of the character ''*'', there will be a previous valid character to match."]', 'Given an input string s and a pattern p, implement regular expression matching with support for ''.'' and ''*'' where ''.'' matches any single character and ''*'' matches zero or more of the preceding element.', 'class Solution {
    public boolean isMatch(String s, String p) {
        // Write your solution below

        return false;
    }
}', TRUE, TRUE, 2000, 256)
ON DUPLICATE KEY UPDATE
    category_id = VALUES(category_id),
    difficulty_id = VALUES(difficulty_id),
    title = VALUES(title),
    description = VALUES(description),
    input_format = VALUES(input_format),
    output_format = VALUES(output_format),
    constraints = VALUES(constraints),
    explanation = VALUES(explanation),
    starter_code = VALUES(starter_code),
    is_premium = VALUES(is_premium);

-- ----------------------------------------------------------------------------
-- 2. Insert Progressive 3-Tier Hints for DSA Problems
-- ----------------------------------------------------------------------------
INSERT INTO problem_hints (problem_id, hint_level, hint_text) VALUES
(101, 1, 'Think about computing the total sum of all elements upfront.'),
(101, 2, 'As you traverse the array from left to right, maintain a running left sum. The right sum at any index is simply totalSum - leftSum - currentElement.'),
(101, 3, 'Check if leftSum == totalSum - leftSum - nums[i]. If so, return index i immediately. Remember to update leftSum after checking.'),
(102, 1, 'Iterate from the least significant digit (end of the array) towards the beginning.'),
(102, 2, 'If a digit is less than 9, increment it by 1 and return the array immediately.'),
(102, 3, 'If a digit is 9, turn it into 0 and carry over 1 to the next iteration. If all digits were 9, create a new array with length + 1 and set the first digit to 1.'),
(103, 1, 'Consider how you can look up whether the complement (target - nums[i]) has already been seen.'),
(103, 2, 'A hash map allows checking whether the complement exists in O(1) average time, mapping values to indices. Alternatively, on a sorted copy, two pointers can converge from both ends.'),
(103, 3, 'In a single pass with HashMap, for each element check map.containsKey(target - nums[i]). If found, return new int[]{map.get(target - nums[i]), i}; otherwise put nums[i] into the map.'),
(104, 1, 'The area is bounded by the shorter line: area = min(height[left], height[right]) * (right - left).'),
(104, 2, 'Start two pointers at opposite ends of the array to maximize width.'),
(104, 3, 'Always move the pointer that points to the shorter line inward. Moving the taller line inward could only reduce or match width without increasing height.'),
(105, 1, 'At any index i, the water trapped above it equals max(0, min(maxLeft, maxRight) - height[i]).'),
(105, 2, 'Instead of precomputing left and right arrays in O(N) space, use two pointers moving towards each other while maintaining leftMax and rightMax.'),
(105, 3, 'If height[left] < height[right], process left: update leftMax and add max(0, leftMax - height[left]) to result, then left++. Otherwise process right similarly.'),
(106, 1, 'Sorting the array first makes it easier to navigate sums and skip duplicates.'),
(106, 2, 'For each element nums[i], reduce the problem to Two Sum II with target = -nums[i] using two pointers (left = i + 1, right = n - 1).'),
(106, 3, 'When a valid triplet is found, remember to advance both left and right while skipping duplicate values to prevent duplicate triplets in the output.'),
(107, 1, 'Since k is fixed, finding the maximum average is equivalent to finding the maximum sum of a window of size k.'),
(107, 2, 'Calculate the sum of the first k elements as the initial window sum.'),
(107, 3, 'Slide the window one element at a time from k to n - 1 by adding nums[i] and subtracting nums[i - k]. Track the maximum sum found and divide by (double)k at the end.'),
(108, 1, 'Because all numbers are positive, expanding the right end always increases the sum, and shrinking the left end always decreases the sum.'),
(108, 2, 'Use a dynamic sliding window with two pointers left and right.'),
(108, 3, 'Expand right to add elements to currentSum. Whenever currentSum >= target, update minLen = min(minLen, right - left + 1), then subtract nums[left] and increment left until sum < target.'),
(109, 1, 'Precompute prefix sums so range sums can be answered in O(1) time without iterating repeatedly.'),
(109, 2, 'Build a prefix array of size n + 1 where prefix[i] stores the sum of elements from index 0 up to i - 1.'),
(109, 3, 'The range sum from left to right is simply prefix[right + 1] - prefix[left].'),
(110, 1, 'Can you express the sum of any subarray from index i to j in terms of prefix sums?'),
(110, 2, 'subarraySum(i, j) = prefixSum[j] - prefixSum[i - 1] == k => prefixSum[i - 1] = prefixSum[j] - k.'),
(110, 3, 'Use a HashMap to store the frequencies of prefix sums observed so far. Initialize map with (0: 1). For each element, add currentSum, check if (currentSum - k) is in map, and update count.'),
(111, 1, 'If the current running sum becomes negative, would keeping it benefit future elements?'),
(111, 2, 'At each index i, the maximum subarray ending at i is max(nums[i], currentSum + nums[i]). This is Kadane''s algorithm.'),
(111, 3, 'Maintain currentSum = nums[0] and maxSum = nums[0]. Iterate from index 1: currentSum = Math.max(nums[i], currentSum + nums[i]) and maxSum = Math.max(maxSum, currentSum).'),
(112, 1, 'A circular maximum subarray is either non-wrapping (standard Kadane) or wrapping (totalSum minus minimum subarray).'),
(112, 2, 'Run Kadane''s algorithm once for max subarray, and once for min subarray, while calculating totalSum.'),
(112, 3, 'If maxSubarraySum > 0, return max(maxSubarraySum, totalSum - minSubarraySum). If all elements are negative, return maxSubarraySum directly.'),
(113, 1, 'If you fill from the front, you will overwrite existing elements in nums1. Can you fill from the back?'),
(113, 2, 'Use three pointers: p1 = m - 1 (end of valid nums1), p2 = n - 1 (end of nums2), and p = m + n - 1 (end of buffer).'),
(113, 3, 'Compare nums1[p1] and nums2[p2], place the larger at nums1[p] and decrement p. If elements remain in nums2, copy them over.'),
(114, 1, 'This is the classic Dutch National Flag partitioning problem.'),
(114, 2, 'Maintain three pointers: low = 0 (boundary for 0s), mid = 0 (current element), and high = n - 1 (boundary for 2s).'),
(114, 3, 'While mid <= high: if nums[mid] == 0, swap(nums[low++], nums[mid++]); if nums[mid] == 1, mid++; if nums[mid] == 2, swap(nums[mid], nums[high--]).'),
(115, 1, 'While a HashMap can count frequencies in O(N) space, Boyer-Moore Voting Algorithm solves it in O(1) space.'),
(115, 2, 'Maintain a candidate and a count. When count is 0, pick current element as candidate.'),
(115, 3, 'If current element matches candidate, increment count; otherwise decrement count. Since the majority appears > n/2 times, it will survive.'),
(116, 1, 'The values range from 1 to n, which matches the valid index range 0 to n - 1.'),
(116, 2, 'Use the array itself as a hash table by negating the value at the corresponding index (Math.abs(nums[i]) - 1).'),
(116, 3, 'For each num, let idx = Math.abs(num) - 1. If nums[idx] < 0, then Math.abs(num) is a duplicate! Otherwise negate nums[idx].'),
(117, 1, 'Traversing from the back (end of string) is much faster than starting from the beginning.'),
(117, 2, 'First, skip any trailing space characters by decrementing your pointer.'),
(117, 3, 'Once you hit the first non-space character, count characters until you encounter the next space or the start of the string.'),
(118, 1, 'You can construct the result by iterating through characters in the input string.'),
(118, 2, 'A StringBuilder allows building the new string in O(N) time without allocating multiple intermediate String objects.'),
(118, 3, 'For each character ch, if ch == ''.'', append ''[.]''; otherwise append ch.'),
(119, 1, 'Use two pointers, one starting at the beginning (0) and one at the end (length - 1).'),
(119, 2, 'Swap characters at the left and right pointers, then move both pointers towards the center.'),
(119, 3, 'Continue the while loop while left < right. Use a temporary char variable for the swap.'),
(120, 1, 'Two pointers converging from both ends allow in-place verification without extra memory.'),
(120, 2, 'Use Character.isLetterOrDigit(ch) to skip non-alphanumeric characters on both left and right sides.'),
(120, 3, 'Compare Character.toLowerCase(s.charAt(left)) with Character.toLowerCase(s.charAt(right)). If they differ, return false immediately.'),
(121, 1, 'Convert string to a char array so you can perform in-place swaps.'),
(121, 2, 'Use two pointers left and right. Advance left until it points to a vowel, and decrement right until it points to a vowel.'),
(121, 3, 'When both point to vowels, swap their characters, increment left, decrement right, and continue while left < right.'),
(122, 1, 'Think of a sliding window [left, right] where all characters inside the window are guaranteed to be unique.'),
(122, 2, 'A hash map or array can store the most recent index where each character appeared.'),
(122, 3, 'When right encounters a character already seen at index lastIdx >= left, jump left to lastIdx + 1. Update maxLen = max(maxLen, right - left + 1).'),
(123, 1, 'A permutation has the exact same character frequencies as s1.'),
(123, 2, 'Use a fixed-size sliding window of length s1.length() over string s2.'),
(123, 3, 'Count character frequencies in s1 and in the current window of s2 using int[26]. If arrays match, return true. Update counts as window slides.'),
(124, 1, 'Track the character requirements of t using a frequency map.'),
(124, 2, 'Expand the right pointer to include characters until all requirements of t are satisfied (valid window).'),
(124, 3, 'Once valid, shrink from left as much as possible while maintaining validity, updating minWindow. Repeat until right reaches end.'),
(125, 1, 'Check every possible starting position i in haystack where needle could fit.'),
(125, 2, 'For each position i from 0 up to haystack.length() - needle.length(), compare characters.'),
(125, 3, 'If needle matches characters starting at i, return i. If loop completes with no match, return -1. (KMP can optimize to O(N)).'),
(126, 1, 'Every target sequence has a fixed length of exactly 10 characters.'),
(126, 2, 'Maintain a HashSet of seen 10-letter substrings, and a second HashSet of repeated substrings.'),
(126, 3, 'Iterate i from 0 to s.length() - 10. Extract sub = s.substring(i, i + 10). If !seen.add(sub), repeated.add(sub). Return new ArrayList<>(repeated).'),
(127, 1, 'Negative numbers cannot be palindromes because of the minus sign.'),
(127, 2, 'Also, numbers ending in 0 (except 0 itself) cannot be palindromes.'),
(127, 3, 'Revert half of the number by extracting digits: reverted = reverted * 10 + x % 10; x /= 10. Stop when x <= reverted. Return x == reverted || x == reverted / 10.'),
(128, 1, 'A palindrome mirrors around its center. A string has 2n - 1 possible centers (single characters or pairs).'),
(128, 2, 'For each index i, expand outwards for both odd-length (center i) and even-length (center i, i + 1) palindromes.'),
(128, 3, 'Write a helper expand(s, left, right) that increments while bounds match and characters are equal. Track the longest window found.'),
(129, 1, 'Every single character is a palindrome of length 1.'),
(129, 2, 'Expand around each possible center. There are 2n - 1 centers (n odd centers and n - 1 even centers).'),
(129, 3, 'For each center, expand outward as long as s.charAt(left) == s.charAt(right), incrementing total count and moving pointers.'),
(130, 1, 'If lengths differ, they cannot be anagrams.'),
(130, 2, 'An integer array count of size 26 can tally character frequencies in O(N) time and O(1) space.'),
(130, 3, 'Increment count for each char in s, decrement for each char in t. At the end, every entry in count must be 0.'),
(131, 1, 'Use a two-pass approach.'),
(131, 2, 'In the first pass, count the frequency of each character using an int[26] array.'),
(131, 3, 'In the second pass, iterate through the string from index 0 to length - 1. Return the first index where count[s.charAt(i) - ''a''] == 1.'),
(132, 1, 'Two strings are anagrams if and only if their sorted versions are identical, or their character frequency counts are identical.'),
(132, 2, 'Use a HashMap<String, List<String>> where the key is the sorted character array (or frequency tuple).'),
(132, 3, 'For each string, sort its chars to produce the key: char[] ca = s.toCharArray(); Arrays.sort(ca); String key = new String(ca); map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);'),
(133, 1, 'Break the problem down into sequential steps: whitespace, sign, digits, overflow check.'),
(133, 2, 'Use an int pointer i. Advance past spaces. Record sign if ''+'' or ''-''.'),
(133, 3, 'While s.charAt(i) is a digit, check for integer overflow before multiplying: if (res > Integer.MAX_VALUE / 10 || (res == Integer.MAX_VALUE / 10 && digit > 7)) return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE.'),
(134, 1, 'Take the first string as the initial prefix.'),
(134, 2, 'Iterate through the remaining strings. While strs[i].indexOf(prefix) != 0, shorten prefix by removing its last character.'),
(134, 3, 'If prefix becomes empty, return '''' immediately. After checking all strings, return the remaining prefix.'),
(135, 1, 'Count the available character counts in magazine.'),
(135, 2, 'An int[26] array or HashMap can track available character counts.'),
(135, 3, 'Iterate through ransomNote. For each character, decrement its count. If the count drops below 0, return false.'),
(136, 1, 'You need a bijection: each character in s maps uniquely to one in t, and vice versa.'),
(136, 2, 'Use two maps (or two int[256] arrays) to record last-seen positions or bidirectional mappings.'),
(136, 3, 'For each index i, if mapS[s.charAt(i)] != mapT[t.charAt(i)], return false. Then update both to i + 1.'),
(137, 1, 'Split s into an array of words using space as delimiter. If words.length != pattern.length(), return false.'),
(137, 2, 'Use two HashMaps or a single map with unique values to check bijection between pattern character and word.'),
(137, 3, 'Map char -> word and word -> char. If an existing mapping conflicts with the current pair, return false immediately.'),
(138, 1, 'A hash set stores unique elements and provides O(1) average lookup time.'),
(138, 2, 'Iterate through nums. For each element, attempt to add it to a HashSet.'),
(138, 3, 'If set.add(num) returns false, the element was already present—return true! If loop finishes, return false.'),
(139, 1, 'Insert all numbers into a HashSet for O(1) lookup.'),
(139, 2, 'A number x is the start of a sequence only if x - 1 is NOT in the set.'),
(139, 3, 'For each num in the set, if !set.contains(num - 1), count how many consecutive numbers exist: num + 1, num + 2... Track max sequence length.'),
(140, 1, 'First, count frequencies of each element using a HashMap<Integer, Integer>.'),
(140, 2, 'To achieve O(N) time without full sorting, use bucket sort where bucket[freq] holds all elements with that frequency.'),
(140, 3, 'Iterate backwards from bucket[nums.length] down to 1, collecting elements until you have gathered k elements.'),
(141, 1, 'Count the frequency of every character using a frequency map.'),
(141, 2, 'Create an array of buckets where index i holds characters that appear with frequency i.'),
(141, 3, 'Iterate buckets from high frequency to low frequency, appending each character count times to a StringBuilder.'),
(142, 1, 'Think of the array as a linked list where nums[i] points to index nums[i].'),
(142, 2, 'Because there is a duplicate number, multiple indices point to the same node, creating a cycle!'),
(142, 3, 'Use Floyd''s Tortoise and Hare algorithm. Move slow by 1 step (slow = nums[slow]) and fast by 2 steps (fast = nums[nums[fast]]). Once they meet, reset slow to 0 and move both by 1 step until they meet at the cycle entrance.'),
(143, 1, 'You only need to track the elements within a sliding window of size k.'),
(143, 2, 'Maintain a HashSet of size at most k.'),
(143, 3, 'For each i, if set.contains(nums[i]), return true. Add nums[i]. If set.size() > k, remove nums[i - k].'),
(144, 1, 'Because the array is already sorted, two pointers at the ends can converge in O(1) space.'),
(144, 2, 'Let left = 0 and right = n - 1. Calculate sum = numbers[left] + numbers[right].'),
(144, 3, 'If sum == target, return new int[]{left + 1, right + 1}. If sum < target, left++; if sum > target, right--.'),
(145, 1, 'Sort the array first to handle duplicate skipping easily.'),
(145, 2, 'Use two nested loops for the first two elements (i and j), then use two pointers (left and right) for the remaining two elements.'),
(145, 3, 'Watch out for 32-bit integer overflow when summing 4 numbers—cast sum to long.'),
(146, 1, 'Think about re-pointing each node''s next pointer to its predecessor.'),
(146, 2, 'Maintain three pointers: prev (initially null), curr (initially head), and nextTemp.'),
(146, 3, 'Iterate while curr != null: save nextTemp = curr.next, set curr.next = prev, advance prev = curr, and curr = nextTemp. Return prev.'),
(147, 1, 'Use a dummy head node to simplify operations when left == 1.'),
(147, 2, 'Advance a pointer prev to the node just before position left.'),
(147, 3, 'Perform right - left in-place node shifts: curr = prev.next; move curr.next to the front of the reversed sublist.'),
(148, 1, 'First check if there are at least k nodes remaining in the current group before reversing.'),
(148, 2, 'If k nodes exist, reverse the group using standard iterative reversal.'),
(148, 3, 'Connect the previous group''s tail to the newly reversed group''s head, and recursively or iteratively process subsequent groups.'),
(149, 1, 'Think about two runners on a circular track running at different speeds.'),
(149, 2, 'Initialize slow = head and fast = head. Advance slow by 1 step (slow = slow.next) and fast by 2 steps (fast = fast.next.next).'),
(149, 3, 'If there is a cycle, fast will eventually catch up to slow (slow == fast). If fast reaches null, there is no cycle.'),
(150, 1, 'Use two pointers moving at different speeds.'),
(150, 2, 'Advance slow by 1 step and fast by 2 steps in each iteration.'),
(150, 3, 'When fast reaches the end (fast == null or fast.next == null), slow will be exactly at the middle node.'),
(151, 1, 'Combine fast/slow pointers to find the middle, then reverse the second half of the list.'),
(151, 2, 'Use slow and fast to reach middle. Reverse list starting from slow.next.'),
(151, 3, 'Compare values node-by-node from the front (head) and reversed half. If all match, it is a palindrome.'),
(152, 1, 'Use Floyd''s cycle detection algorithm to find the meeting point first.'),
(152, 2, 'Mathematical property: distance from head to cycle entrance equals distance from meeting point to cycle entrance.'),
(152, 3, 'Once slow and fast meet, reset slow to head. Advance both slow and fast by 1 step at a time. The node where they meet is the cycle start!'),
(153, 1, 'The transitions between numbers form an implicit linked list.'),
(153, 2, 'If a number loops, fast and slow pointers (or a HashSet) can detect the cycle.'),
(153, 3, 'Let slow = n, fast = getNext(n). While fast != 1 and slow != fast: slow = getNext(slow), fast = getNext(getNext(fast)). Return fast == 1.'),
(154, 1, 'A dummy head node simplifies boundary cases when attaching the first node.'),
(154, 2, 'Maintain a pointer curr starting at dummy. Compare list1.val and list2.val.'),
(154, 3, 'Attach the smaller node to curr.next and advance that list''s pointer and curr. When one list is exhausted, attach the remainder of the other list.'),
(155, 1, 'Find the node at position a - 1 (before deletion) and position b + 1 (after deletion).'),
(155, 2, 'Find the tail node of list2.'),
(155, 3, 'Set nodeBeforeA.next = list2, and tailOfList2.next = nodeAfterB. Return list1.'),
(156, 1, 'Use two pointers with a gap of n nodes between them.'),
(156, 2, 'Attach a dummy head before head to handle removing the first node cleanly.'),
(156, 3, 'Advance fast pointer by n + 1 steps. Then move both fast and slow together until fast is null. slow.next will be pointing to the target: set slow.next = slow.next.next.'),
(157, 1, 'This problem combines three fundamental linked list operations: middle finding, reversal, and merging.'),
(157, 2, '1. Find middle of list using fast/slow pointers. 2. Reverse the second half of the list.'),
(157, 3, '3. Interleave/merge the first half and the reversed second half node-by-node.'),
(158, 1, 'A monotonic decreasing stack keeps track of indices of temperatures that haven''t found a warmer day yet.'),
(158, 2, 'Store indices in a stack. When a temperature higher than stack.peek() arrives, you found the warmer day for the peeked index!'),
(158, 3, 'Iterate i from 0 to n - 1. While !stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]: int prev = stack.pop(); ans[prev] = i - prev. Then stack.push(i).'),
(159, 1, 'Precompute the next greater element for all elements in nums2 first.'),
(159, 2, 'Use a monotonic stack and a HashMap<Integer, Integer> to map each element in nums2 to its next greater element.'),
(159, 3, 'Traverse nums2. While !stack.isEmpty() && num > stack.peek(): map.put(stack.pop(), num). Then push num. For remaining elements in stack, map to -1. Finally lookup nums1 in map.'),
(160, 1, 'For each bar of height h, how far can it extend to the left and to the right before hitting a shorter bar?'),
(160, 2, 'A monotonic increasing stack can find the left and right boundaries for every bar in O(N) total time.'),
(160, 3, 'Maintain a stack of indices with increasing heights. When a shorter bar is encountered, pop from stack: popped height * (i - stack.peek() - 1) is the rectangle area.'),
(161, 1, 'A stack (LIFO) is the ideal data structure because the most recently opened bracket must be the first one closed.'),
(161, 2, 'When encountering an opening bracket, push its expected closing bracket onto the stack.'),
(161, 3, 'When encountering a closing bracket, check if stack is empty or if stack.pop() doesn''t match the current character. At the end, stack must be empty.'),
(162, 1, 'Think recursively: at each step, you can either add ''('' or '')''.'),
(162, 2, 'You can add ''('' as long as count(open) < n. You can add '')'' only if count(close) < count(open).'),
(162, 3, 'Use backtracking with a StringBuilder. Base case: when string length == 2 * n, add to results. Backtrack after each recursive call.'),
(163, 1, 'Keep track of the indices of invalid parentheses.'),
(163, 2, 'Use a stack to record indices of unmatched ''('' brackets. If a '')'' has no matching ''('' on the stack, mark its index for deletion.'),
(163, 3, 'At the end of traversal, any ''('' indices remaining in the stack must also be removed. Build the final string excluding marked indices.'),
(164, 1, 'To simulate a circular array without actual concatenation, loop up to 2 * n - 1 and access elements using i % n.'),
(164, 2, 'Maintain a monotonic decreasing stack of indices.'),
(164, 3, 'Loop i from 0 to 2 * n - 1. While !stack.isEmpty() && nums[i % n] > nums[stack.peek()]: res[stack.pop()] = nums[i % n]. If i < n, push i to stack.'),
(165, 1, 'Instead of storing raw prices and scanning back, can you store price and accumulated span together?'),
(165, 2, 'Use a monotonic decreasing stack where each entry is an [price, span] pair.'),
(165, 3, 'When next(price) is called, initialize span = 1. While !stack.isEmpty() && stack.peek()[0] <= price: span += stack.pop()[1]. Push [price, span] and return span.'),
(166, 1, 'One stack is used for incoming pushes, and the second stack is used for outgoing pops.'),
(166, 2, 'Keep pushStack for incoming elements and popStack for outgoing elements.'),
(166, 3, 'In pop/peek: if popStack is empty, transfer all elements from pushStack to popStack (reversing their order to FIFO!). Then pop/peek from popStack.'),
(167, 1, 'Because timestamps t are strictly increasing, a Queue (FIFO) is the natural fit.'),
(167, 2, 'Add incoming timestamp t to the end of a Queue<Integer>.'),
(167, 3, 'While queue.peek() < t - 3000, pop/poll elements from the front of the queue. Return queue.size().'),
(168, 1, 'We need an O(1) way to find the maximum in the window while elements are added and removed.'),
(168, 2, 'A monotonic decreasing Deque storing indices can maintain the maximum element at deque.peekFirst().'),
(168, 3, 'For each i: remove indices out of window (deque.peekFirst() <= i - k). Pop from back while nums[deque.peekLast()] <= nums[i]. Push i to back. If i >= k - 1, record nums[deque.peekFirst()].'),
(169, 1, 'Use a fixed-size array of size k and maintain front and rear pointers.'),
(169, 2, 'To handle circular wrapping, update indices using modulo arithmetic: (front - 1 + k) % k for front insertion and (rear + 1) % k for rear insertion.'),
(169, 3, 'Track current size to differentiate between completely empty and completely full states.'),
(170, 1, 'Because the array is sorted, comparing the target against the middle element lets you eliminate half the search space.'),
(170, 2, 'Calculate mid using left + (right - left) / 2 to prevent 32-bit integer overflow.'),
(170, 3, 'If nums[mid] == target, return mid. If nums[mid] < target, search right half (left = mid + 1). If nums[mid] > target, search left half (right = mid - 1).'),
(171, 1, 'Binary search the range [1, n].'),
(171, 2, 'Compute mid = left + (right - left) / 2.'),
(171, 3, 'Call guess(mid). If guess returns 0, return mid. If -1, right = mid - 1. If 1, left = mid + 1.'),
(172, 1, 'This is finding the lower bound (the first position where nums[i] >= target).'),
(172, 2, 'Maintain left = 0 and right = nums.length - 1.'),
(172, 3, 'If nums[mid] >= target, narrow right to mid - 1. Otherwise left = mid + 1. When loop terminates, left is the exact insertion index.'),
(173, 1, 'Run binary search twice: once to find the leftmost (first) occurrence, and once to find the rightmost (last) occurrence.'),
(173, 2, 'To find the leftmost index, when nums[mid] == target, continue searching left by setting right = mid - 1 while recording mid.'),
(173, 3, 'To find the rightmost index, when nums[mid] == target, continue searching right by setting left = mid + 1 while recording mid.'),
(174, 1, 'Notice that if you split a rotated sorted array in half, at least one of the two halves is always normally sorted!'),
(174, 2, 'Check which half is sorted: if nums[left] <= nums[mid], the left half is sorted. Otherwise the right half is sorted.'),
(174, 3, 'Check if target lies within the boundaries of the sorted half. If yes, search that half; otherwise search the other half.'),
(175, 1, 'Compare nums[mid] with the last element nums[right].'),
(175, 2, 'If nums[mid] > nums[right], the minimum must be in the right half (left = mid + 1).'),
(175, 3, 'If nums[mid] <= nums[right], mid could be the minimum, so set right = mid. When left == right, nums[left] is the minimum.'),
(176, 1, 'The eating speed k ranges from 1 to max(piles). Notice that the hours required is monotonically decreasing with speed k.'),
(176, 2, 'Binary search the speed k in the range [1, max(piles)].'),
(176, 3, 'For a candidate speed mid, compute total hours = sum(ceil(pile / (double)mid)). If total <= h, try smaller speed (right = mid); otherwise left = mid + 1.'),
(177, 1, 'The minimum possible capacity is max(weights) (can ship the heaviest item). The maximum is sum(weights) (ships everything in 1 day).'),
(177, 2, 'Binary search the capacity in [max(weights), sum(weights)].'),
(177, 3, 'Test if a capacity mid can ship within days: greedily accumulate weights until exceeding mid, then increment days. Adjust left/right accordingly.'),
(178, 1, 'The answer must be between max(nums) and sum(nums). Can we binary search on the answer?'),
(178, 2, 'If we guess that the maximum subarray sum is mid, we can count how many subarrays are required using a greedy pass.'),
(178, 3, 'If count <= k, mid is achievable—try smaller (right = mid). If count > k, mid is too small (left = mid + 1). Return left.'),
(179, 1, 'Identify base cases: if n <= 1, return n.'),
(179, 2, 'Naive recursion recomputes states exponentially. Use memoization or two variables to compute iteratively in O(N) time.'),
(179, 3, 'Maintain prev2 = 0, prev1 = 1. Loop from 2 to n: curr = prev1 + prev2, prev2 = prev1, prev1 = curr. Return prev1.'),
(180, 1, 'Any positive power of three must be strictly greater than 0.'),
(180, 2, 'If n <= 0, return false. If n == 1, return true (3^0 = 1).'),
(180, 3, 'If n % 3 == 0, recursively check isPowerOfThree(n / 3). Otherwise return false.'),
(181, 1, 'For each element, you have two choices: include it in the current subset, or exclude it.'),
(181, 2, 'Use a recursive helper backtrack(start, currentSubset, result).'),
(181, 3, 'At each recursive call, add a copy of currentSubset to result. Then loop i from start to nums.length - 1: add nums[i], recurse with i + 1, and remove last element (backtrack).'),
(182, 1, 'Sort nums first so that duplicate numbers are adjacent.'),
(182, 2, 'In the backtrack loop over index i from start to nums.length - 1: skip duplicates if i > start && nums[i] == nums[i - 1].'),
(182, 3, 'This ensures a duplicate element is only chosen once at the current decision level.'),
(183, 1, 'Every permutation must contain all n elements in some order.'),
(183, 2, 'Maintain a boolean[] used array (or swap in-place) to track elements already included in the current branch.'),
(183, 3, 'When currentList.size() == nums.length, add a copy to results. In loop i from 0 to n - 1: if (!used[i]) { used[i] = true; list.add(nums[i]); recurse; list.removeLast(); used[i] = false; }'),
(184, 1, 'Sort the array first so identical numbers are grouped together.'),
(184, 2, 'Use a boolean[] used array to track which elements are active in current path.'),
(184, 3, 'Skip duplicates when i > 0 && nums[i] == nums[i - 1] && !used[i - 1]. The !used[i-1] check enforces consistent order among duplicates.'),
(185, 1, 'Sort candidates to enable early pruning when candidate > remaining target.'),
(185, 2, 'Because an element can be reused, the recursive call keeps the same start index i instead of advancing to i + 1.'),
(185, 3, 'Base cases: if remain == 0, add copy of current list to result. If remain < 0, return. Loop i from start to length: add, recurse with (i, remain - candidates[i]), backtrack.'),
(186, 1, 'Create an array mapping digit character to its corresponding letters: String[] map = {'''', '''', ''abc'', ''def'', ...}.'),
(186, 2, 'If digits is empty, return an empty list immediately.'),
(186, 3, 'Backtrack: at index idx, loop through each character mapped to digits.charAt(idx), append to path, recurse with idx + 1, and delete last char.'),
(187, 1, 'Queens attack along columns, rows, and diagonals. Place one queen per row.'),
(187, 2, 'Use three boolean sets/arrays to check conflicts in O(1): cols[c], diag1[r + c], diag2[r - c + n].'),
(187, 3, 'Backtrack row by row from 0 to n - 1. For each col c, if safe, place queen, update tracking arrays, recurse to row + 1, then backtrack.'),
(188, 1, 'Scan every cell (r, c) as a potential starting letter word.charAt(0).'),
(188, 2, 'From (r, c), explore 4 neighbors (up, down, left, right) with DFS backtracking.'),
(188, 3, 'Temporarily mark board[r][c] = ''#'' to prevent reuse in current path. Recurse for word.charAt(idx + 1). Restore character when backtracking.'),
(189, 1, 'Find the first empty cell ''.'' on the board.'),
(189, 2, 'Try placing digits ''1'' through ''9''. Check if the placement is valid with respects to its row, column, and 3x3 subgrid.'),
(189, 3, 'If valid, place digit and recursively call solve(). If solve() returns true, puzzle is solved! Otherwise reset cell to ''.'' and try next digit.'),
(190, 1, 'Inversion requires swapping the left and right child of every node.'),
(190, 2, 'This can be done with a postorder or preorder traversal.'),
(190, 3, 'Base case: if root == null, return null. Swap root.left and root.right. Then recursively call invertTree on both children. Return root.'),
(191, 1, 'Inorder traversal visits nodes in the order: Left Subtree -> Current Node -> Right Subtree.'),
(191, 2, 'Recursion is straightforward: traverse(node.left), list.add(node.val), traverse(node.right).'),
(191, 3, 'Iterative solution uses an explicit Stack: push all left children to stack until null, pop, record value, and move to right child.'),
(192, 1, 'Preorder visits: Current Node -> Left Subtree -> Right Subtree.'),
(192, 2, 'For an iterative approach, use a Stack initialized with root.'),
(192, 3, 'While stack is not empty: pop node, add node.val to result, push node.right (if not null), then push node.left (so left is processed first!).'),
(193, 1, 'It is not enough that left < node < right; all nodes in the left subtree must be less than node.'),
(193, 2, 'Pass a valid range (min, max) down the recursion tree. Use Long to avoid integer overflow.'),
(193, 3, 'Helper: isValid(node, min, max): if node == null return true. If node.val <= min || node.val >= max return false. Return isValid(node.left, min, node.val) && isValid(node.right, node.val, max).'),
(194, 1, 'An inorder traversal of a Binary Search Tree produces sorted values in strictly ascending order.'),
(194, 2, 'Traverse inorder and stop as soon as you have visited k nodes.'),
(194, 3, 'Use an iterative inorder traversal with a Stack. Each time you pop a node, decrement k. When k == 0, return the popped node''s value.'),
(195, 1, 'A leaf position always exists where the new value can be inserted validly.'),
(195, 2, 'If root is null, return new TreeNode(val).'),
(195, 3, 'If val < root.val, root.left = insertIntoBST(root.left, val). If val > root.val, root.right = insertIntoBST(root.right, val). Return root.'),
(196, 1, 'The depth of a tree is 1 + max(depth(left), depth(right)).'),
(196, 2, 'Base case: if root == null, return 0.'),
(196, 3, 'Recursive case: return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)).'),
(197, 1, 'The longest path passing through any node is depth(leftSubtree) + depth(rightSubtree).'),
(197, 2, 'Calculate the height of each node, and update a global maxDiameter at each step.'),
(197, 3, 'Helper returns height: 1 + max(leftH, rightH). Before returning, update maxDiameter = Math.max(maxDiameter, leftH + rightH).'),
(198, 1, 'A bottom-up recursion can compute height and check balance simultaneously in O(N) time.'),
(198, 2, 'Return -1 from the helper if any subtree is unbalanced.'),
(198, 3, 'In checkHeight(node): if left == -1 || right == -1 || abs(left - right) > 1 return -1. Otherwise return 1 + max(left, right). Tree is balanced if checkHeight(root) != -1.'),
(199, 1, 'Use the BST ordering property: nodes smaller than current are on the left, nodes larger are on the right.'),
(199, 2, 'If both p.val and q.val are smaller than curr.val, the LCA must be in the left subtree.'),
(199, 3, 'If both are greater than curr.val, LCA is in the right subtree. If they split (one is smaller, one is larger) or one equals curr, curr IS the LCA!'),
(200, 1, 'Since this is a general binary tree (not BST), search both subtrees recursively.'),
(200, 2, 'Base case: if root == null || root == p || root == q, return root.'),
(200, 3, 'Recurse left and right. If both left and right return non-null, root is the split point (LCA!). If only one is non-null, return that non-null child.'),
(201, 1, 'Level order traversal is Breadth-First Search (BFS).'),
(201, 2, 'A Queue (FIFO) processes nodes level by level.'),
(201, 3, 'While queue is not empty: get levelSize = queue.size(). Loop levelSize times: poll node, add value to current level list, enqueue left and right children.'),
(202, 1, 'Standing on the right side, you see the last node of each level in a level-order traversal.'),
(202, 2, 'Run BFS level-order traversal with a Queue.'),
(202, 3, 'At each level, loop for levelSize times. The last node polled (when index == levelSize - 1) is added to the result list.'),
(203, 1, 'Use BFS with a boolean flag leftToRight that toggles at each level.'),
(203, 2, 'Use a LinkedList (or Deque) to store the values of each level.'),
(203, 3, 'If leftToRight is true, append values to the end (list.addLast). If false, insert values at the front (list.addFirst). Toggle flag after each level.'),
(204, 1, 'A min-heap of size k keeps the k largest elements seen so far at all times.'),
(204, 2, 'Initialize a PriorityQueue<Integer> (min-heap by default in Java).'),
(204, 3, 'Offer each num to heap. If heap.size() > k, heap.poll(). At the end, heap.peek() is the kth largest element in O(N log k) time. (QuickSelect achieves O(N)).'),
(205, 1, 'Count word frequencies with a HashMap first.'),
(205, 2, 'Use a PriorityQueue with custom comparator: lower frequency comes first (so it gets polled out); for equal frequency, lexicographically greater comes first.'),
(205, 3, 'Maintain heap size at k. Poll excess elements. Reverse the remaining heap elements to build the final list.'),
(206, 1, 'A min-heap of capacity k will always have the kth largest element right at the top (heap.peek()).'),
(206, 2, 'In the constructor, add all elements into a min-heap PriorityQueue and poll until size is at most k.'),
(206, 3, 'In add(val): offer val. If size > k, poll(). Return heap.peek().'),
(207, 1, 'Since both arrays are sorted, the smallest pair is (nums1[0], nums2[0]).'),
(207, 2, 'Use a min-heap storing tuples: [sum, indexInNums1, indexInNums2].'),
(207, 3, 'Initialize heap with pairs (nums1[i], nums2[0]) for i in 0 to min(k, nums1.length - 1). Repeatedly poll min pair, and if indexInNums2 + 1 < nums2.length, push (nums1[i], nums2[indexInNums2 + 1]).'),
(208, 1, 'Divide the numbers into two halves: the smaller half and the larger half.'),
(208, 2, 'Use a max-heap for the smaller half and a min-heap for the larger half.'),
(208, 3, 'Balance sizes: max-heap holds either equal size or 1 more element than min-heap. If total size is odd, median is maxHeap.peek(). If even, median is (maxHeap.peek() + minHeap.peek()) / 2.0.'),
(209, 1, 'Extend the Two Heaps approach with lazy deletion for elements falling out of the window.'),
(209, 2, 'Maintain a max-heap for small values and a min-heap for large values, along with a hash map of delayed deletions.'),
(209, 3, 'When removing an element out of the window, increment its count in the delayed deletion map and rebalance heaps lazily.'),
(210, 1, 'At any moment, the next node in the merged list must be the smallest node among the current heads of the k lists.'),
(210, 2, 'A min-heap (PriorityQueue) holding the current head of each non-empty list provides the minimum in O(log k) time.'),
(210, 3, 'Add all initial heads to the heap. While heap is not empty, poll the smallest node, attach it to merged list, and if smallest.next != null, offer smallest.next to the heap.'),
(211, 1, 'Maintain one element from each of the k lists in a min-heap simultaneously.'),
(211, 2, 'Track the current maximum value maxVal among the k elements, while heap.peek() gives the current minimum minVal. Current range is [minVal, maxVal].'),
(211, 3, 'Poll the minimum element from the heap, update smallestRange if maxVal - minVal is smaller, and push the next element from that list. Stop when any list is exhausted.'),
(212, 1, 'Iterate over every cell. When you encounter ''1'', you have discovered a new island!'),
(212, 2, 'Increment count and launch a BFS or DFS traversal starting at that cell to mark all connected ''1''s as visited.'),
(212, 3, 'In BFS: enqueue (r, c), mark grid[r][c] = ''0''. Dequeue and explore 4 neighbors (up, down, left, right). For each valid neighbor with ''1'', mark ''0'' and enqueue.'),
(213, 1, 'This is a multi-source Breadth-First Search (BFS).'),
(213, 2, 'First, enqueue all rotten oranges (cells with value 2) and count the total fresh oranges.'),
(213, 3, 'Process BFS level by level. At each minute, rot all adjacent fresh oranges, decrement fresh count, and enqueue. If fresh count == 0 return minutes; otherwise -1.'),
(214, 1, 'Model this as an unweighted graph where words are vertices and single-letter transformations are edges.'),
(214, 2, 'BFS finds the shortest path in an unweighted graph.'),
(214, 3, 'Put wordList in a HashSet for O(1) existence checks. Start BFS queue with beginWord at distance 1. For each word, try changing all 26 letters at each character position to generate neighbors.'),
(215, 1, 'Use a HashMap<Node, Node> to map original nodes to their cloned counterparts and prevent infinite recursion in cycles.'),
(215, 2, 'If node == null, return null. If map contains node, return map.get(node).'),
(215, 3, 'Create copy = new Node(node.val), put in map, then for each neighbor, copy.neighbors.add(cloneGraph(neighbor)). Return copy.'),
(216, 1, 'Use Depth-First Search (DFS) to compute the size of each connected component of 1s.'),
(216, 2, 'When finding a 1, recursively visit its 4 neighbors, accumulating cell count.'),
(216, 3, 'Sink visited land by setting grid[r][c] = 0. Helper dfs(r, c) returns 1 + dfs(up) + dfs(down) + dfs(left) + dfs(right).'),
(217, 1, 'Any ''O'' on the border of the board (or connected to a border ''O'') CANNOT be surrounded.'),
(217, 2, 'Start DFS from all ''O'' cells located on the 4 boundary borders.'),
(217, 3, 'Mark border-connected ''O''s temporarily as ''#''. Finally, iterate whole board: change remaining ''O'' to ''X'', and restore ''#'' back to ''O''.'),
(218, 1, 'This can be solved using either Disjoint Set Union (Union-Find) or BFS/DFS.'),
(218, 2, 'With Union-Find, start with n separate components. For each edge, if find(u) != find(v), union them and decrement component count.'),
(218, 3, 'Return the remaining component count.'),
(219, 1, 'Track visited cities using a boolean[] visited array of size n.'),
(219, 2, 'Iterate i from 0 to n - 1. If city i has not been visited, start a DFS/BFS to visit all cities connected to i, and increment provinces count.'),
(219, 3, 'In DFS(city): mark visited[city] = true. For j from 0 to n - 1: if isConnected[city][j] == 1 && !visited[j], dfs(j).'),
(220, 1, 'You can finish all courses if and only if the directed graph has NO directed cycles.'),
(220, 2, 'Use Kahn''s algorithm (topological sort via indegrees) or 3-state DFS (0 = unvisited, 1 = visiting, 2 = visited).'),
(220, 3, 'With Kahn''s: calculate inDegree for every course. Enqueue courses with inDegree == 0. Poll, decrement neighbors'' inDegrees, enqueue if 0. Count processed nodes: return count == numCourses.'),
(221, 1, 'A tree with n nodes has exactly n - 1 edges. The extra edge is the one that connects two nodes that are ALREADY connected.'),
(221, 2, 'Use Disjoint Set Union (DSU / Union-Find).'),
(221, 3, 'For each edge [u, v]: if find(u) == find(v), u and v already belong to the same component, so this edge creates a cycle! Return [u, v]. Otherwise union(u, v).'),
(222, 1, 'This is finding a topological sort of a Directed Acyclic Graph (DAG).'),
(222, 2, 'Use Kahn''s algorithm: calculate indegree array and build adjacency list.'),
(222, 3, 'Add courses with inDegree == 0 to a Queue. As each node is dequeued, append it to the order array and decrement its neighbors'' indegrees. If processed count < numCourses, return empty array.'),
(223, 1, 'Map each character to its 0-25 rank in the alien order.'),
(223, 2, 'Compare adjacent words words[i] and words[i + 1] pair by pair.'),
(223, 3, 'Find the first index where characters differ. If orderRank[w1] > orderRank[w2], return false. If w1 is a prefix of w2 and longer, return false.'),
(224, 1, 'This is single-source shortest path with non-negative edge weights: Dijkstra''s algorithm.'),
(224, 2, 'Maintain a min-heap PriorityQueue storing [node, distance] pairs and an array dist[] initialized to infinity.'),
(224, 3, 'Extract min-distance node. For each neighbor, if dist[u] + weight < dist[v], update dist[v] and offer to heap. Answer is max(dist); if any node is unreachable, return -1.'),
(225, 1, 'Because of the step constraint (k stops means at most k + 1 edges), Bellman-Ford algorithm is very clean.'),
(225, 2, 'Run Bellman-Ford for k + 1 iterations.'),
(225, 3, 'In each iteration, create a copy of the prices array. For each flight [u, v, cost], if prices[u] != inf, update tempPrices[v] = min(tempPrices[v], prices[u] + cost). After k + 1 passes, return prices[dst].'),
(226, 1, 'This problem is equivalent to finding the maximum number of mutually compatible intervals (classic Interval Scheduling).'),
(226, 2, 'Sort intervals by their ending times in ascending order. When choosing intervals greedily, picking the one that finishes earliest leaves the most room for subsequent intervals.'),
(226, 3, 'Maintain the end time of the last accepted interval. If the current interval starts before this end time, it overlaps and must be removed (increment counter); otherwise, update the end time.'),
(227, 1, 'Consider the timeline of events: each meeting start increases the required rooms by 1, and each meeting end frees up a room.'),
(227, 2, 'You can extract and sort all start times and end times separately, or use a min-heap to keep track of end times of active meetings.'),
(227, 3, 'Iterate through sorted start times. If the earliest ending meeting (heap top) has ended before the current start time, reuse that room (poll from heap). Otherwise, allocate a new room.'),
(228, 1, 'Every arrow should hit as many overlapping balloons as possible. Greedily shooting at the end coordinate of the balloon that ends earliest maximizes chances of hitting others.'),
(228, 2, 'Sort balloons by their end coordinate `x_end` in ascending order. Be cautious of integer overflow during comparison (`Integer.compare`).'),
(228, 3, 'Initialize arrows = 1 and set arrowPos = points[0][1]. Iterate through points: if points[i][0] > arrowPos, increment arrows and set arrowPos = points[i][1].'),
(229, 1, 'To satisfy the maximum number of children, satisfy the least greedy children first using the smallest possible cookie that meets their threshold.'),
(229, 2, 'Sort both the children''s greed array `g` and the cookie sizes array `s` in ascending order.'),
(229, 3, 'Use two pointers: childPtr and cookiePtr. If `s[cookiePtr] >= g[childPtr]`, increment childPtr. Always increment cookiePtr. Return childPtr.'),
(230, 1, 'Track the count of $5 and $10 bills in hand. $20 bills are never given out as change, so counting them is unnecessary.'),
(230, 2, 'When given a $10 bill, you must return a $5 bill. If you don''t have one, return false.'),
(230, 3, 'When given a $20 bill, you need $15 in change. Greedily prioritize giving one $10 and one $5 first, because $5 bills are more versatile than $10 bills.'),
(231, 1, 'If the total sum of gas is less than the total sum of cost, completing the circuit is fundamentally impossible; return -1.'),
(231, 2, 'If you start at station A and run out of gas before station B, no station between A and B can reach B either. The next potential starting point must be B + 1.'),
(231, 3, 'Keep track of `totalGas - totalCost` and `currentTank`. When `currentTank < 0`, reset `currentTank = 0` and set `startStation = i + 1`.'),
(232, 1, 'Taller people do not care about shorter people in front of them because shorter people do not affect their `k` count.'),
(232, 2, 'Sort people primarily by height descending. For ties in height, sort by `k` ascending.'),
(232, 3, 'Insert each person into a dynamic list at index `k`. Since all previously inserted people are taller, inserting person `p` at index `p[1]` ensures exactly `p[1]` taller people precede them.'),
(233, 1, 'The execution time is bottlenecked by the task with the maximum frequency.'),
(233, 2, 'Let `maxFreq` be the highest count of any single task, and `maxCount` be the number of distinct tasks having that exact maximum frequency.'),
(233, 3, 'The formula for slots bounded by idle time is `(maxFreq - 1) * (n + 1) + maxCount`. The final answer is `Math.max(tasks.length, emptySlotsFormula)`.'),
(234, 1, 'Each child has two neighbors: left and right. Consider decomposing the problem into two passes: left-to-right and right-to-left.'),
(234, 2, 'Initialize an array `candies` filled with 1s. In the left-to-right pass, if `ratings[i] > ratings[i-1]`, set `candies[i] = candies[i-1] + 1`.'),
(234, 3, 'In the right-to-left pass, if `ratings[i] > ratings[i+1]`, set `candies[i] = Math.max(candies[i], candies[i+1] + 1)`. The sum of `candies` is the optimal answer.'),
(235, 1, 'Think about the maximum reach you can achieve as you iterate across the array.'),
(235, 2, 'Maintain `maxReach = 0`. At each index `i`, if `i > maxReach`, you are stranded and cannot proceed; return false.'),
(235, 3, 'Update `maxReach = Math.max(maxReach, i + nums[i])`. If `maxReach >= nums.length - 1`, return true.'),
(236, 1, 'This can be modeled as finding BFS levels on an implicit graph of reachable jump ranges.'),
(236, 2, 'Maintain `curEnd` (the boundary of the current jump) and `farthest` (the furthest index reachable from any index in the current jump window).'),
(236, 3, 'Iterate up to `nums.length - 2`. Update `farthest = Math.max(farthest, i + nums[i])`. When `i == curEnd`, increment jumps and set `curEnd = farthest`.'),
(237, 1, 'To reach step `i`, you must come from either step `i - 1` or step `i - 2`.'),
(237, 2, 'This leads directly to the recurrence relation: `ways[i] = ways[i - 1] + ways[i - 2]` with base cases `ways[1] = 1` and `ways[2] = 2`.'),
(237, 3, 'Notice this is the Fibonacci sequence. You only need two variables to store previous results in O(1) space.'),
(238, 1, 'For each house, you have two choices: rob it, or skip it.'),
(238, 2, 'If you rob house `i`, you cannot rob house `i-1`, so your total is `nums[i] + dp[i-2]`. If you skip house `i`, your total is `dp[i-1]`.'),
(238, 3, 'Recurrence: `dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i])`. You can optimize space to O(1) using two rolling variables `prev1` and `prev2`.'),
(239, 1, 'Since the houses are in a circle, house 0 and house `n - 1` are adjacent. You cannot rob both.'),
(239, 2, 'Break the circular dependency into two linear House Robber subproblems: houses `0` to `n - 2`, and houses `1` to `n - 1`.'),
(239, 3, 'Run the standard House Robber 1 algorithm on both slices and return `Math.max(robSlice(0, n-2), robSlice(1, n-1))` (handling `n == 1` as a base case).'),
(240, 1, 'At each index `i`, we can either decode a single digit `s[i-1]` or a two-digit number `s[i-2...i-1]`.'),
(240, 2, 'A single digit is valid if `s[i-1] != ''0''`. A two-digit prefix is valid if it lies between `10` and `26`.'),
(240, 3, 'Recurrence: `dp[i] = (valid single digit ? dp[i-1] : 0) + (valid two digits ? dp[i-2] : 0)`. Base cases: `dp[0] = 1`.'),
(241, 1, 'To reach cell `(r, c)`, the robot must come from either cell `(r - 1, c)` or `(r, c - 1)`.'),
(241, 2, 'Recurrence: `dp[r][c] = dp[r - 1][c] + dp[r][c - 1]`. Any cell in the first row or first column has only 1 unique path.'),
(241, 3, 'You can optimize the 2D matrix into a 1D array of size `n`, iteratively accumulating columns.'),
(242, 1, 'Similar to Unique Paths, but whenever `obstacleGrid[r][c] == 1`, no paths can pass through it, so `dp[r][c] = 0`.'),
(242, 2, 'If the starting cell `(0, 0)` or ending cell has an obstacle, return 0 immediately.'),
(242, 3, 'Iterate row by row. If `grid[i][j] == 0`, `dp[j] += dp[j-1]`; otherwise, `dp[j] = 0`.'),
(243, 1, 'Let `dp[i][j]` be the minimum operations to convert `word1[0...i-1]` to `word2[0...j-1]`.'),
(243, 2, 'If `word1[i-1] == word2[j-1]`, no operation is needed: `dp[i][j] = dp[i-1][j-1]`.'),
(243, 3, 'Otherwise, consider the 3 operations: insert (`dp[i][j-1]`), delete (`dp[i-1][j]`), or replace (`dp[i-1][j-1]`). Take `1 + min` of these three.'),
(244, 1, 'If the total sum of `nums` is odd, it cannot be divided into two equal integers; return false immediately.'),
(244, 2, 'This transforms into the 0/1 Knapsack problem: can we find a subset of numbers that sum up to `target = sum / 2`?'),
(244, 3, 'Use a 1D boolean array `dp` of size `target + 1` with `dp[0] = true`. Iterate numbers and update backwards from `target` down to `num` to ensure each item is used at most once.'),
(245, 1, 'Divide the elements into two subsets: P (positive signs) and N (negative signs). Then `sum(P) - sum(N) = target`.'),
(245, 2, 'Adding `sum(P) + sum(N) = totalSum` gives `2 * sum(P) = target + totalSum`, meaning `sum(P) = (target + totalSum) / 2`.'),
(245, 3, 'If `target + totalSum` is odd or negative, return 0. The problem is now equivalent to finding the number of subsets with sum `sum(P)` (Subset Sum DP).'),
(246, 1, 'This is an unbounded knapsack problem. What is the subproblem?'),
(246, 2, 'Let `dp[i]` be the minimum coins needed to make amount `i`.'),
(246, 3, 'Recurrence: `dp[i] = min(dp[i], dp[i - coin] + 1)` for each coin in `coins` where `coin <= i`. Initialize `dp` with `amount + 1`.'),
(247, 1, 'Distinguish between combinations and permutations: here order of coins does not matter, so `[1, 2]` is the same as `[2, 1]`.'),
(247, 2, 'To count unique combinations without permutations, loop through the coins outer-most, and amounts inner-most.'),
(247, 3, 'Create `dp` array of size `amount + 1` with `dp[0] = 1`. For each coin: for `x` from `coin` to `amount`: `dp[x] += dp[x - coin]`.'),
(248, 1, 'A standard O(n^2) approach uses `dp[i]` as the length of the longest increasing subsequence ending at index `i`.'),
(248, 2, '`dp[i] = 1 + max(dp[j])` for all `j < i` where `nums[j] < nums[i]`.'),
(248, 3, 'An optimal O(n log n) approach maintains an array `tails` where `tails[len]` is the smallest tail of all increasing subsequences of length `len+1`, found via binary search (`Arrays.binarySearch`).'),
(249, 1, 'Let `dp[i][j]` be the length of the longest common subsequence of prefixes `text1[0...i-1]` and `text2[0...j-1]`.'),
(249, 2, 'If `text1[i-1] == text2[j-1]`, this character contributes to the LCS: `dp[i][j] = 1 + dp[i-1][j-1]`.'),
(249, 3, 'If they do not match, the character might come from one string or the other: `dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`.'),
(250, 1, 'Let `dp[i]` denote whether the prefix `s[0...i-1]` can be segmented into valid words from `wordDict`.'),
(250, 2, 'Base case: `dp[0] = true` (empty string is always valid).'),
(250, 3, 'For each `i` from 1 to `s.length()`, check every `j` from 0 to `i - 1`. If `dp[j] && wordDict.contains(s.substring(j, i))`, then `dp[i] = true`.'),
(251, 1, 'To reach cell `(i, j)`, we must come from `(i - 1, j)` (above) or `(i, j - 1)` (left).'),
(251, 2, 'Recurrence relation: `dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1])`.'),
(251, 3, 'Initialize the first row and first column with cumulative sums, or solve in-place on `grid` to achieve O(1) extra space.'),
(252, 1, 'Let `dp[i][j]` represent the side length of the maximum square whose bottom-right corner is `(i, j)`.'),
(252, 2, 'If `matrix[i][j] == ''1''`, it forms a square bounded by its top, left, and top-left neighbors: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`.'),
(252, 3, 'Maintain `maxSide` across all cells and return `maxSide * maxSide`.'),
(253, 1, 'To reach step `i`, you could have jumped from `i - 1` or `i - 2`.'),
(253, 2, 'Recurrence relation: `minCost[i] = cost[i] + Math.min(minCost[i - 1], minCost[i - 2])`.'),
(253, 3, 'The top of the floor is at index `n`. Thus, the answer is `Math.min(minCost[n - 1], minCost[n - 2])` with O(1) rolling space.'),
(254, 1, 'Notice how bit patterns repeat. Dividing an integer by 2 (`i >> 1`) shifts all bits right by one.'),
(254, 2, 'The number of set bits in `i` is the number of set bits in `i >> 1` plus the lowest bit `i & 1`.'),
(254, 3, 'Recurrence: `ans[i] = ans[i >> 1] + (i & 1)`. Calculate in a single pass from 1 to `n` in O(n) linear time.'),
(255, 1, 'The problem requires iterating through each customer (each row) and finding the maximum row sum.'),
(255, 2, 'Use a nested loop. The outer loop traverses customers, and the inner loop sums up the accounts for that customer.'),
(255, 3, 'Maintain a maxWealth variable initialized to 0. After summing each row, update maxWealth = Math.max(maxWealth, currentSum).'),
(256, 1, 'This is equivalent to finding the length of the longest contiguous subarray that contains at most 2 distinct integers.'),
(256, 2, 'Use a sliding window with a HashMap tracking the frequency of each fruit type in the current window.'),
(256, 3, 'Expand right pointer adding fruits[right]. While map.size() > 2, shrink left pointer decrementing frequency and removing types with count 0. Update maxFruits = Math.max(maxFruits, right - left + 1).'),
(257, 1, 'Transform the array: treat 0 as -1 and 1 as +1. The problem then becomes finding the longest subarray with sum 0.'),
(257, 2, 'Use prefix sum with a Hash Map storing the first occurrence index of each prefix sum.'),
(257, 3, 'Initialize map with {0: -1}. If the current prefix sum has been seen before at index prevIndex, the subarray from prevIndex + 1 to i sums to 0. Length is i - prevIndex.'),
(258, 1, 'Unlike addition, multiplying two negative numbers yields a positive number. A negative current value can flip the minimum product into a maximum.'),
(258, 2, 'At each index, track both the maximum product and the minimum product ending at that position.'),
(258, 3, 'If nums[i] < 0, swap maxProd and minProd. Then update maxProd = Math.max(nums[i], maxProd * nums[i]) and minProd = Math.min(nums[i], minProd * nums[i]). Accumulate global max.'),
(259, 1, 'Notice that there can be at most 2 elements that appear strictly more than n / 3 times.'),
(259, 2, 'Use Boyer-Moore Voting Algorithm extended to two candidates (cand1, cand2) with two counters (count1, count2).'),
(259, 3, 'First pass finds the two most frequent candidates. Second pass verifies whether their actual counts strictly exceed n / 3.'),
(260, 1, 'Sorting the intervals by their start times ensures overlapping intervals are placed next to each other.'),
(260, 2, 'Sort intervals using Arrays.sort with a comparator comparing interval[0].'),
(260, 3, 'Iterate through sorted intervals: if current interval overlaps with the last added interval (current.start <= last.end), merge by updating last.end = Math.max(last.end, current.end). Otherwise, append current.'),
(261, 1, 'We need to test membership of each stone character in the set of jewel characters.'),
(261, 2, 'Use a boolean array boolean[128] or a HashSet<Character> to store jewel characters in O(1) lookup.'),
(261, 3, 'Traverse stones: for each character c in stones, if isJewel[c] is true, increment the counter. Return count.'),
(262, 1, 'Split words or iterate backwards from the end of the string to prepend words.'),
(262, 2, 'Using StringBuilder: trim leading/trailing spaces, parse words by reading contiguous non-space substrings.'),
(262, 3, 'Iterate from right to left: find the end of a word, find its beginning, extract word, append to StringBuilder followed by a space. Return sb.toString().trim().'),
(263, 1, 'Consider concatenating s with itself: (s + s). If s has a repeating period, removing the first and last characters of (s + s) will still contain s.'),
(263, 2, 'Or check potential pattern lengths L from 1 up to s.length() / 2 where s.length() % L == 0.'),
(263, 3, 'Elegant one-liner: String doubled = (s + s).substring(1, 2 * s.length() - 1); return doubled.contains(s);'),
(264, 1, 'A HashSet provides O(1) average lookup and automatically enforces uniqueness.'),
(264, 2, 'Add all elements of nums1 into a set1. Then iterate through nums2 and check set1.contains(x).'),
(264, 3, 'Store matches in a resultSet to avoid duplicates. Convert resultSet to int[] and return.'),
(265, 1, 'While a HashSet can detect duplicates by tracking seen elements, XOR bitwise operation achieves O(1) space.'),
(265, 2, 'Properties of XOR: a ^ a = 0 and a ^ 0 = a. XOR is commutative and associative.'),
(265, 3, 'XOR all numbers in the array into an accumulator initialized to 0. All pairs cancel out to 0, leaving only the unique element.'),
(266, 1, 'If two prefix sums have the same remainder when divided by k, the subarray between them is divisible by k.'),
(266, 2, 'Use a hash map or an array of size k to count remainder frequencies.'),
(266, 3, 'Compute running remainder: (prefixSum % k + k) % k (handling negative modulo in Java). Add current remainder''s frequency to count, then increment frequency.'),
(267, 1, 'Count the frequency of each character in s, then reconstruct the string following the sequence in order.'),
(267, 2, 'Use an int[26] frequency array to count all characters in s.'),
(267, 3, 'Iterate through order: for each character c, append it to a StringBuilder count[c - ''a''] times, and reset count[c - ''a''] = 0. Finally, append any remaining characters from the frequency array.'),
(268, 1, 'This is an implicit linked list cycle detection problem. Each index points to nextIndex = ((i + nums[i]) % n + n) % n.'),
(268, 2, 'Use Floyd''s Cycle-Finding Algorithm (slow and fast pointers).'),
(268, 3, 'For each starting index: verify that direction does not flip (nums[slow] * nums[next] > 0). If slow == next, cycle length is 1 (self-loop), which is invalid.'),
(269, 1, 'Decompose the list into two separate linked lists: one for nodes < x and one for nodes >= x.'),
(269, 2, 'Use two dummy nodes: beforeHead and afterHead, with pointers before and after.'),
(269, 3, 'Iterate through original list, appending nodes to before or after. Crucially, set after.next = null to avoid cycles, then connect before.next = afterHead.next.'),
(270, 1, 'Map original nodes to new nodes, or weave copied nodes directly beside original nodes.'),
(270, 2, 'A HashMap<Node, Node> maps each original node to its clone. Pass 1 creates copies, Pass 2 sets next and random.'),
(270, 3, 'For O(1) space: weave clones as cur.next = new Node(cur.val); set cur.next.random = cur.random != null ? cur.random.next : null; then unweave lists.'),
(271, 1, 'In a queue, the newest element is at the back. To make it behave like a stack, the newest element must be moved to the front.'),
(271, 2, 'You can use a single java.util.Queue (LinkedList or ArrayDeque).'),
(271, 3, 'When push(x) is called: enqueue x. Then rotate the queue by taking queue.poll() and re-offering it size - 1 times. This puts x at the head of the queue!'),
(272, 1, 'This is the Next Smaller or Equal Element problem.'),
(272, 2, 'Use a monotonic stack storing indices of items waiting for a discount.'),
(272, 3, 'Traverse prices with index i: while stack is not empty and prices[stack.peek()] >= prices[i], idx = stack.pop(); prices[idx] -= prices[i]. Then push i. Return prices.'),
(273, 1, 'Because nums contains negative values, standard two-pointer sliding window does NOT work monotonically. Prefix sum is required: P[j] - P[i] >= k.'),
(273, 2, 'Use a Monotonic Deque storing prefix sum indices.'),
(273, 3, '1. While deque not empty and P[i] - P[deque.peekFirst()] >= k: update minLen = Math.min(minLen, i - deque.pollFirst()). 2. While deque not empty and P[i] <= P[deque.peekLast()]: deque.pollLast(). 3. deque.addLast(i).'),
(274, 1, 'Since versions are ordered [good, good, ..., good, bad, bad, ..., bad], this is a monotonic boolean search space.'),
(274, 2, 'Use binary search. Calculate mid = left + (right - left) / 2 to prevent integer overflow.'),
(274, 3, 'If isBadVersion(mid) is true, the first bad version is at mid or to the left (right = mid). Otherwise, it is strictly to the right (left = mid + 1). Return left when left == right.'),
(275, 1, 'If an element nums[mid] < nums[mid + 1], an increasing slope guarantees that at least one peak exists to the right.'),
(275, 2, 'Binary search: set left = 0, right = nums.length - 1.'),
(275, 3, 'If nums[mid] > nums[mid + 1], we are on a descending slope (or at a peak); search left: right = mid. Otherwise search right: left = mid + 1. Return left.'),
(276, 1, 'Duplicates create ambiguity when nums[left] == nums[mid] == nums[right], making it impossible to determine which half is sorted.'),
(276, 2, 'When nums[left] == nums[mid] == nums[right], simply shrink the search window: left++ and right--.'),
(276, 3, 'Otherwise, determine whether the left half or right half is normally sorted, check if target falls inside that sorted range, and adjust bounds accordingly.'),
(277, 1, 'Base cases: n <= 0 is false, n == 1 is true.'),
(277, 2, 'If n % 4 != 0, it cannot be a power of four.'),
(277, 3, 'Recursion: return isPowerOfFour(n / 4). Alternatively, check (n > 0) && ((n & (n - 1)) == 0) && ((n & 0x55555555) != 0).'),
(278, 1, 'At each character, if it is a digit, you have 1 choice. If it is a letter, you have 2 branching choices: lowercase or uppercase.'),
(278, 2, 'Use backtracking or BFS to build strings index by index.'),
(278, 3, 'Base case: index == s.length(), add current char[] converted to String to results. If Character.isLetter, branch with Character.toLowerCase and Character.toUpperCase.'),
(279, 1, 'Find the first decreasing element from the right: nums[i] < nums[i + 1].'),
(279, 2, 'From the right, find the smallest element nums[j] that is strictly greater than nums[i].'),
(279, 3, 'Swap nums[i] and nums[j]. Reverse the entire suffix from i + 1 to the end of the array to make it the smallest possible lexicographical tail.'),
(280, 1, 'Sort the candidates first so that duplicates are adjacent and we can prune duplicate branches.'),
(280, 2, 'Backtracking: pass remaining target and start index. Advance index to i + 1 since each element is used at most once.'),
(280, 3, 'Skip duplicates at the same decision level: if (i > start && candidates[i] == candidates[i - 1]) continue. If target < candidates[i], break early.'),
(281, 1, 'Notice that if the left and right subtrees of a node have equal maximum depth, that node is the LCA of the deepest leaves in its subtree.'),
(281, 2, 'Perform a post-order traversal returning both the subtree depth and the LCA node candidate (Pair<TreeNode, Integer>).'),
(281, 3, 'If leftDepth == rightDepth, return (node, leftDepth + 1). If leftDepth > rightDepth, return (leftLCA, leftDepth + 1). Otherwise return (rightLCA, rightDepth + 1).'),
(282, 1, 'We want to retain the k smallest distances. A Max-Heap of size k is the standard pattern.'),
(282, 2, 'Compute squared distance dist = p[0]*p[0] + p[1]*p[1] (no need for Math.sqrt).'),
(282, 3, 'Maintain a PriorityQueue sorted descending by distance. For each point, add it; if heap size > k, poll() the furthest point. At the end, dump heap contents.'),
(283, 1, 'An inorder traversal of a Binary Search Tree produces elements in strictly ascending sorted order.'),
(283, 2, 'You can use an iterative stack or recursive traversal, decrementing k on visiting each node.'),
(283, 3, 'When k reaches 0, the current node''s value is the kth smallest. Stop traversal immediately and return it.'),
(284, 1, 'Sort all projects by required capital ascending. Then among all currently affordable projects, greedily pick the one with maximum profit.'),
(284, 2, 'Use a Min-Heap (or sorted list) for projects by capital, and a Max-Heap for affordable projects by profit.'),
(284, 3, 'Repeat k times: transfer all projects whose capital <= w into the Max-Heap. If Max-Heap is empty, break. Otherwise w += maxHeap.poll().'),
(285, 1, 'Since each row is sorted, this problem is directly analogous to merging n sorted lists.'),
(285, 2, 'Use a Min-Heap initialized with the first element of each row: (matrix[r][0], r, 0).'),
(285, 3, 'Extract the minimum element k - 1 times. Each time an element (val, r, c) is polled, insert its right neighbor (matrix[r][c+1], r, c+1) if c + 1 < n. The k-th polled value is the answer.'),
(286, 1, 'Traverse each connected component (island) in grid2 using DFS/BFS. Check whether every cell in that island is also land (1) in grid1.'),
(286, 2, 'Launch DFS from every unvisited 1 in grid2. Sinking cells in grid2 (grid2[r][c] = 0) prevents re-visiting.'),
(286, 3, 'Let isSub = (grid1[r][c] == 1). Traverse all 4 neighbors: isSub &= dfs(nr, nc). Only increment count if the entire component returned true.'),
(287, 1, 'A graph is a valid tree if and only if: 1. It has exactly n - 1 edges. 2. It is fully connected (no cycles).'),
(287, 2, 'If edges.length != n - 1, return false immediately. Then use Union-Find or BFS/DFS.'),
(287, 3, 'With Union-Find: for each edge [u, v], if find(u) == find(v), a cycle exists, return false. Union them. If loop completes, return true.'),
(288, 1, 'Instead of searching backwards for ancestors of each node, consider reversing the perspective: DFS from each parent node i to find all descendants it can reach.'),
(288, 2, 'Build adjacency list: parent -> children. If you start DFS from node u, every node v visited during this DFS has u as an ancestor.'),
(288, 3, 'Iterate u from 0 to n - 1. Run DFS from u: for each reachable v != u, add u to v''s ancestor list. Because u is looped in increasing order, ancestors are automatically sorted!'),
(289, 1, 'This is a shortest path problem where path cost is defined as max(edge_weights) rather than sum(edge_weights).'),
(289, 2, 'Use Dijkstra''s algorithm with a Min-Heap storing [effort, row, col].'),
(289, 3, 'Initialize dist matrix with infinity, dist[0][0] = 0. Extract min-effort cell, relax 4 neighbors: nextEffort = Math.max(effort, Math.abs(heights[nr][nc] - heights[r][c])). Push if nextEffort < dist[nr][nc].'),
(290, 1, 'To maximize total units, prioritize boxes that contain the greatest number of units per box (Fractional Knapsack greedy principle).'),
(290, 2, 'Sort boxTypes descending by numberOfUnitsPerBox.'),
(290, 3, 'Iterate through sorted box types: take takeBoxes = Math.min(truckSize, box[0]). Add takeBoxes * box[1] to totalUnits and decrement truckSize -= takeBoxes. Stop when truckSize == 0.'),
(291, 1, 'Bottom-up DP is cleaner than top-down because the answer naturally converges to the top cell (0, 0) without needing a min across the base.'),
(291, 2, 'Start from the second to last row and work upwards to row 0.'),
(291, 3, 'Recurrence: dp[j] = triangle.get(row).get(j) + Math.min(dp[j], dp[j + 1]). Using a 1D array of size N gives O(N) auxiliary space.'),
(292, 1, 'This is an extension of Fibonacci with three recurrence terms: T(n) = T(n-1) + T(n-2) + T(n-3).'),
(292, 2, 'Base cases: n == 0 return 0; n == 1 or n == 2 return 1.'),
(292, 3, 'Use three accumulator variables: a = 0, b = 1, c = 1. In a loop from 3 to n, next = a + b + c, shift a = b, b = c, c = next. Return c. Space complexity is O(1).'),
(293, 1, 'A naive prefix sum array allows O(1) queries but requires O(N) time for every point update. A standard array allows O(1) updates but O(N) queries.'),
(293, 2, 'Use a Segment Tree or a Binary Indexed Tree (Fenwick Tree) to achieve both O(log N) point updates and O(log N) range queries.'),
(293, 3, 'Construct a tree array of size 4*N. For sumRange, query overlapping intervals. For update, recursively traverse to leaf node, update value, and re-sum internal parents.'),
(294, 1, 'Searching each word individually across the entire grid leads to excessive repeated traversals. Instead, search all words simultaneously.'),
(294, 2, 'Build a Prefix Tree (Trie) containing all words in the dictionary. Then perform DFS starting from each board cell, advancing through the Trie nodes simultaneously.'),
(294, 3, 'When a Trie node marks the end of a word, add it to the result set and clear the word mark to prevent duplicate additions. Backtrack cell visits using an in-place character mask (e.g. board[r][c] = ''#''). Prune exhausted Trie branches to optimize runtime.'),
(295, 1, 'If a duplicate substring of length L exists, duplicate substrings of any length less than L must also exist. This monotonic property allows binary search on the length.'),
(295, 2, 'Binary search for the length L between 1 and s.length - 1. For a fixed length L, use Rabin-Karp rolling hash to detect whether any substring of length L appears at least twice in O(N) time.'),
(295, 3, 'Compute hash of window using polynomial rolling hash modulo a large prime (e.g., 2^63 - 1 or dual modulos 10^9+7 and 10^9+9) to minimize hash collisions. Maintain a HashSet of computed hashes. Return the longest candidate found.'),
(296, 1, 'Traverse the array from right to left. At each element nums[i], count how many numbers previously processed are strictly smaller than nums[i].'),
(296, 2, 'Coordinate compress the numbers and maintain a Fenwick Tree (Binary Indexed Tree) or use Merge Sort with index tracking to count inversions.'),
(296, 3, 'Using BIT: rank each unique value from 1 to K. For each number from right to left, query prefix sum in BIT up to rank(nums[i]) - 1, record the count, then update BIT at rank(nums[i]) with +1.'),
(297, 1, 'A critical connection in an undirected connected graph is also known as a ''bridge''. Bridges are edges that do not belong to any cycle.'),
(297, 2, 'Use Tarjan''s Bridge-Finding Algorithm based on Depth-First Search with discovery time and lowest reachable timestamp arrays (tin and low).'),
(297, 3, 'Track timer during DFS. For edge (u, v): if v is parent, continue; if v is already visited, low[u] = Math.min(low[u], tin[v]); if unvisited, recurse on v, low[u] = Math.min(low[u], low[v]). If low[v] > tin[u], then edge (u, v) is a bridge.'),
(298, 1, 'Thinking about which balloon to burst FIRST divides the remaining array into dependent subarrays because adjacent neighbors shift. Instead, think about which balloon to burst LAST in an interval.'),
(298, 2, 'If balloon k is burst LAST in interval [i, j], then its neighbors when it bursts are guaranteed to be nums[i-1] and nums[j+1]. This decouples the subproblems [i, k-1] and [k+1, j].'),
(298, 3, 'Pad nums with 1 at both boundaries: padded = [1, ...nums, 1]. Define dp[i][j] as max coins from bursting all balloons strictly between i and j. Recurrence: dp[i][j] = max(dp[i][k] + dp[k][j] + padded[i] * padded[k] * padded[j]) for k from i+1 to j-1.'),
(299, 1, 'If every element appears 3 times, summing the i-th bit across all numbers will yield a multiple of 3 if the single number has bit 0, or (3*k + 1) if it has bit 1.'),
(299, 2, 'Iterate through all 32 bit positions (0 to 31). Count the number of set bits at position i across all numbers. If bitCount % 3 != 0, set the i-th bit in the result.'),
(299, 3, 'Alternatively, design a 2-bit finite state machine using bitwise operations: ones = (ones ^ num) & ~twos; twos = (twos ^ num) & ~ones. Returns ones in O(N) time and O(1) space.'),
(300, 1, 'A character followed by ''*'' provides two branching possibilities: match 0 times (ignore preceding character and ''*'') or match 1 or more times (if preceding character matches s[i]).'),
(300, 2, 'Use 2D Dynamic Programming. Let dp[i][j] represent whether s[0...i-1] matches p[0...j-1].'),
(300, 3, 'Base case: dp[0][0] = true. If p[j-1] == ''*'', dp[i][j] = dp[i][j-2] (zero occurrences) || (matches(s[i-1], p[j-2]) && dp[i-1][j]). If characters match or p[j-1] == ''.'', dp[i][j] = dp[i-1][j-1].')
ON DUPLICATE KEY UPDATE hint_text = VALUES(hint_text);

-- ----------------------------------------------------------------------------
-- 3. Insert Public Sample Test Cases for DSA Problems
-- ----------------------------------------------------------------------------
INSERT INTO problem_test_cases (
    problem_id, is_sample, input_data, expected_output, explanation, display_order, is_active
) VALUES
(101, TRUE, 'nums = [1,7,3,6,5,6]', '3', 'The pivot index is 3. Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11.', 1, TRUE),
(101, TRUE, 'nums = [1,2,3]', '-1', 'There is no index that satisfies the conditions in the problem statement.', 2, TRUE),
(102, TRUE, 'digits = [1,2,3]', '[1,2,4]', 'The array represents the integer 123. Incrementing by one gives 124.', 1, TRUE),
(102, TRUE, 'digits = [9]', '[1,0]', 'The array represents 9. Incrementing by one gives 10.', 2, TRUE),
(103, TRUE, 'nums = [2, 7, 11, 15], target = 9', '[0, 1]', 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].', 1, TRUE),
(103, TRUE, 'nums = [3, 2, 4], target = 6', '[1, 2]', 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].', 2, TRUE),
(104, TRUE, 'height = [1,8,6,2,5,4,8,3,7]', '49', 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.', 1, TRUE),
(104, TRUE, 'height = [1,1]', '1', 'The distance between the two lines is 1, and minimum height is 1, giving area 1.', 2, TRUE),
(105, TRUE, 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', '6', 'The elevation map [0,1,0,2,1,0,1,3,2,1,2,1] can trap 6 units of rain water.', 1, TRUE),
(105, TRUE, 'height = [4,2,0,3,2,5]', '9', 'Water trapped is 9 units between the high walls.', 2, TRUE),
(106, TRUE, 'nums = [-1,0,1,2,-1,-4]', '[[-1,-1,2],[-1,0,1]]', 'The distinct triplets are [-1,0,1] and [-1,-1,2].', 1, TRUE),
(106, TRUE, 'nums = [0,1,1]', '[]', 'The only possible triplet does not sum up to 0.', 2, TRUE),
(107, TRUE, 'nums = [1,12,-5,-6,50,3], k = 4', '12.75000', 'Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75.', 1, TRUE),
(107, TRUE, 'nums = [5], k = 1', '5.00000', 'The single element has average 5.', 2, TRUE),
(108, TRUE, 'target = 7, nums = [2,3,1,2,4,3]', '2', 'The subarray [4,3] has the minimal length under the problem constraint.', 1, TRUE),
(108, TRUE, 'target = 4, nums = [1,4,4]', '1', 'The subarray [4] satisfies the condition.', 2, TRUE),
(109, TRUE, 'nums = [-2, 0, 3, -5, 2, -1], left = 0, right = 2', '1', 'sumRange(0, 2) -> (-2) + 0 + 3 = 1.', 1, TRUE),
(109, TRUE, 'nums = [-2, 0, 3, -5, 2, -1], left = 2, right = 5', '-1', 'sumRange(2, 5) -> 3 + (-5) + 2 + (-1) = -1.', 2, TRUE),
(110, TRUE, 'nums = [1,1,1], k = 2', '2', 'The subarrays [nums[0], nums[1]] and [nums[1], nums[2]] sum to 2.', 1, TRUE),
(110, TRUE, 'nums = [1,2,3], k = 3', '2', 'Subarrays [1, 2] and [3] sum to 3.', 2, TRUE),
(111, TRUE, 'nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', 'The subarray [4,-1,2,1] has the largest sum 6.', 1, TRUE),
(111, TRUE, 'nums = [5,4,-1,7,8]', '23', 'The entire array has the largest sum 23.', 2, TRUE),
(112, TRUE, 'nums = [1,-2,3,-2]', '3', 'Subarray [3] has maximum sum 3.', 1, TRUE),
(112, TRUE, 'nums = [5,-3,5]', '10', 'Subarray [5,5] has maximum sum 5 + 5 = 10.', 2, TRUE),
(113, TRUE, 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', '[1,2,2,3,5,6]', 'The arrays we are merging are [1,2,3] and [2,5,6].', 1, TRUE),
(113, TRUE, 'nums1 = [1], m = 1, nums2 = [], n = 0', '[1]', 'nums2 is empty, nums1 remains [1].', 2, TRUE),
(114, TRUE, 'nums = [2,0,2,1,1,0]', '[0,0,1,1,2,2]', 'Sorted colors in-place.', 1, TRUE),
(114, TRUE, 'nums = [2,0,1]', '[0,1,2]', 'Sorted colors in-place.', 2, TRUE),
(115, TRUE, 'nums = [3,2,3]', '3', '3 appears 2 times, which is more than 3/2 = 1.', 1, TRUE),
(115, TRUE, 'nums = [2,2,1,1,1,2,2]', '2', '2 appears 4 times, which is more than 7/2 = 3.', 2, TRUE),
(116, TRUE, 'nums = [4,3,2,7,8,2,3,1]', '[2,3]', '2 and 3 both appear twice.', 1, TRUE),
(116, TRUE, 'nums = [1,1,2]', '[1]', '1 appears twice.', 2, TRUE),
(117, TRUE, 's = ''Hello World''', '5', 'The last word is ''World'' with length 5.', 1, TRUE),
(117, TRUE, 's = ''   fly me   to   the moon  ''', '4', 'The last word is ''moon'' with length 4.', 2, TRUE),
(118, TRUE, 'address = ''1.1.1.1''', '''1[.]1[.]1[.]1''', 'Each ''.'' is replaced by ''[.]''.', 1, TRUE),
(118, TRUE, 'address = ''255.100.50.0''', '''255[.]100[.]50[.]0''', 'Each ''.'' is replaced by ''[.]''.', 2, TRUE),
(119, TRUE, 's = [''h'',''e'',''l'',''l'',''o'']', '[''o'',''l'',''l'',''e'',''h'']', 'The reversed array has elements in reverse order.', 1, TRUE),
(119, TRUE, 's = [''H'',''a'',''n'',''n'',''a'',''h'']', '[''h'',''a'',''n'',''n'',''a'',''H'']', 'In-place swap produces reversed string.', 2, TRUE),
(120, TRUE, 's = ''A man, a plan, a canal: Panama''', 'true', '''amanaplanacanalpanama'' is a palindrome.', 1, TRUE),
(120, TRUE, 's = ''race a car''', 'false', '''raceacar'' is not a palindrome.', 2, TRUE),
(121, TRUE, 's = ''IceCreAm''', '''AceCreIm''', 'The vowels are [''I'', ''e'', ''e'', ''A'']. Reversing them gives [''A'', ''e'', ''e'', ''I''].', 1, TRUE),
(121, TRUE, 's = ''leetcode''', '''leotcede''', 'The vowels [''e'', ''e'', ''o'', ''e''] reversed produce ''leotcede''.', 2, TRUE),
(122, TRUE, 's = ''abcabcbb''', '3', 'The answer is ''abc'', with the length of 3.', 1, TRUE),
(122, TRUE, 's = ''bbbbb''', '1', 'The answer is ''b'', with the length of 1.', 2, TRUE),
(123, TRUE, 's1 = ''ab'', s2 = ''eidbaooo''', 'true', 's2 contains one permutation of s1 (''ba'').', 1, TRUE),
(123, TRUE, 's1 = ''ab'', s2 = ''eidboaoo''', 'false', 'Neither ''ab'' nor ''ba'' exists as a contiguous substring.', 2, TRUE),
(124, TRUE, 's = ''ADOBECODEBANC'', t = ''ABC''', '''BANC''', 'The minimum window substring ''BANC'' includes ''A'', ''B'', and ''C'' from string t.', 1, TRUE),
(124, TRUE, 's = ''a'', t = ''a''', '''a''', 'The entire string s is the minimum window.', 2, TRUE),
(125, TRUE, 'haystack = ''sadbutsad'', needle = ''sad''', '0', '''sad'' occurs at index 0 and 6. The first occurrence is at index 0.', 1, TRUE),
(125, TRUE, 'haystack = ''leetcode'', needle = ''leeto''', '-1', '''leeto'' did not occur in ''leetcode''.', 2, TRUE),
(126, TRUE, 's = ''AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT''', '[''AAAAACCCCC'',''CCCCCAAAAA'']', 'Both sequences appear more than once.', 1, TRUE),
(126, TRUE, 's = ''AAAAAAAAAAAAA''', '[''AAAAAAAAAA'']', '''AAAAAAAAAA'' appears 4 times.', 2, TRUE),
(127, TRUE, 'x = 121', 'true', '121 reads as 121 from left to right and from right to left.', 1, TRUE),
(127, TRUE, 'x = -121', 'false', 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.', 2, TRUE),
(128, TRUE, 's = ''babad''', '''bab''', '''aba'' is also a valid answer.', 1, TRUE),
(128, TRUE, 's = ''cbbd''', '''bb''', 'The longest palindrome is ''bb''.', 2, TRUE),
(129, TRUE, 's = ''abc''', '3', 'Three palindromic strings: ''a'', ''b'', ''c''.', 1, TRUE),
(129, TRUE, 's = ''aaa''', '6', 'Six palindromic strings: ''a'', ''a'', ''a'', ''aa'', ''aa'', ''aaa''.', 2, TRUE),
(130, TRUE, 's = ''anagram'', t = ''nagaram''', 'true', 'Both strings have the same character counts.', 1, TRUE),
(130, TRUE, 's = ''rat'', t = ''car''', 'false', 'Characters do not match in frequency.', 2, TRUE),
(131, TRUE, 's = ''leetcode''', '0', 'The character ''l'' at index 0 is the first character that does not occur at any other index.', 1, TRUE),
(131, TRUE, 's = ''loveleetcode''', '2', 'The character ''v'' at index 2 is the first unique character.', 2, TRUE),
(132, TRUE, 'strs = [''eat'',''tea'',''tan'',''ate'',''nat'',''bat'']', '[[''bat''],[''nat'',''tan''],[''ate'',''eat'',''tea'']]', 'Grouped anagrams together.', 1, TRUE),
(132, TRUE, 'strs = ['''']', '[['''']]', 'Single empty string.', 2, TRUE),
(133, TRUE, 's = ''42''', '42', 'Leading digits form 42.', 1, TRUE),
(133, TRUE, 's = ''   -042''', '-42', 'Leading whitespace ignored, ''-'' read, produces -42.', 2, TRUE),
(134, TRUE, 'strs = [''flower'',''flow'',''flight'']', '''fl''', '''fl'' is the common prefix of all three words.', 1, TRUE),
(134, TRUE, 'strs = [''dog'',''racecar'',''car'']', '''''', 'There is no common prefix among the input strings.', 2, TRUE),
(135, TRUE, 'ransomNote = ''a'', magazine = ''b''', 'false', '''b'' does not contain ''a''.', 1, TRUE),
(135, TRUE, 'ransomNote = ''aa'', magazine = ''aab''', 'true', '''aab'' contains two ''a''s.', 2, TRUE),
(136, TRUE, 's = ''egg'', t = ''add''', 'true', '''e'' maps to ''a'' and ''g'' maps to ''d''.', 1, TRUE),
(136, TRUE, 's = ''foo'', t = ''bar''', 'false', '''o'' cannot map to both ''a'' and ''r''.', 2, TRUE),
(137, TRUE, 'pattern = ''abba'', s = ''dog cat cat dog''', 'true', '''a'' -> ''dog'', ''b'' -> ''cat''.', 1, TRUE),
(137, TRUE, 'pattern = ''abba'', s = ''dog cat cat fish''', 'false', '''a'' cannot map to both ''dog'' and ''fish''.', 2, TRUE),
(138, TRUE, 'nums = [1,2,3,1]', 'true', '1 appears at index 0 and index 3.', 1, TRUE),
(138, TRUE, 'nums = [1,2,3,4]', 'false', 'All elements are distinct.', 2, TRUE),
(139, TRUE, 'nums = [100,4,200,1,3,2]', '4', 'The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4.', 1, TRUE),
(139, TRUE, 'nums = [0,3,7,2,5,8,4,6,0,1]', '9', 'Sequence [0, 1, 2, 3, 4, 5, 6, 7, 8] has length 9.', 2, TRUE),
(140, TRUE, 'nums = [1,1,1,2,2,3], k = 2', '[1,2]', '1 appears 3 times, 2 appears 2 times.', 1, TRUE),
(140, TRUE, 'nums = [1], k = 1', '[1]', 'Single element.', 2, TRUE),
(141, TRUE, 's = ''tree''', '''eert''', '''e'' appears twice, ''r'' and ''t'' appear once. ''eetr'' is also valid.', 1, TRUE),
(141, TRUE, 's = ''cccaaa''', '''aaaccc''', 'Both ''a'' and ''c'' appear 3 times. ''cccaaa'' is also valid.', 2, TRUE),
(142, TRUE, 'nums = [1,3,4,2,2]', '2', '2 is the repeated number.', 1, TRUE),
(142, TRUE, 'nums = [3,1,3,4,2]', '3', '3 is the repeated number.', 2, TRUE),
(143, TRUE, 'nums = [1,2,3,1], k = 3', 'true', 'nums[0] == nums[3] and abs(0 - 3) = 3 <= 3.', 1, TRUE),
(143, TRUE, 'nums = [1,2,3,1,2,3], k = 2', 'false', 'Duplicate indices differ by 3 > 2.', 2, TRUE),
(144, TRUE, 'numbers = [2,7,11,15], target = 9', '[1,2]', 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].', 1, TRUE),
(144, TRUE, 'numbers = [2,3,4], target = 6', '[1,3]', 'The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3.', 2, TRUE),
(145, TRUE, 'nums = [1,0,-1,0,-2,2], target = 0', '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]', 'Unique quadruplets that sum to 0.', 1, TRUE),
(145, TRUE, 'nums = [2,2,2,2,2], target = 8', '[[2,2,2,2]]', 'One unique quadruplet summing to 8.', 2, TRUE),
(146, TRUE, 'head = [1,2,3,4,5]', '[5,4,3,2,1]', 'All node links are reversed.', 1, TRUE),
(146, TRUE, 'head = [1,2]', '[2,1]', 'Two nodes reversed.', 2, TRUE),
(147, TRUE, 'head = [1,2,3,4,5], left = 2, right = 4', '[1,4,3,2,5]', 'Nodes from position 2 to 4 are reversed.', 1, TRUE),
(147, TRUE, 'head = [5], left = 1, right = 1', '[5]', 'Single element reversed remains unchanged.', 2, TRUE),
(148, TRUE, 'head = [1,2,3,4,5], k = 2', '[2,1,4,3,5]', 'Nodes reversed in groups of 2.', 1, TRUE),
(148, TRUE, 'head = [1,2,3,4,5], k = 3', '[3,2,1,4,5]', 'First 3 nodes reversed, last 2 remain intact.', 2, TRUE),
(149, TRUE, 'head = [3,2,0,-4], pos = 1', 'true', 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).', 1, TRUE),
(149, TRUE, 'head = [1,2], pos = 0', 'true', 'There is a cycle in the linked list, where the tail connects to the 0th node.', 2, TRUE),
(150, TRUE, 'head = [1,2,3,4,5]', '[3,4,5]', 'The middle node of the list is node 3.', 1, TRUE),
(150, TRUE, 'head = [1,2,3,4,5,6]', '[4,5,6]', 'Since the list has two middle nodes with values 3 and 4, we return the second one.', 2, TRUE),
(151, TRUE, 'head = [1,2,2,1]', 'true', 'The list reads the same forward and backward.', 1, TRUE),
(151, TRUE, 'head = [1,2]', 'false', 'Not a palindrome.', 2, TRUE),
(152, TRUE, 'head = [3,2,0,-4], pos = 1', 'tail connects to node index 1', 'There is a cycle in the linked list, where tail connects to the second node.', 1, TRUE),
(152, TRUE, 'head = [1], pos = -1', 'no cycle', 'There is no cycle in the linked list.', 2, TRUE),
(153, TRUE, 'n = 19', 'true', '1^2 + 9^2 = 82 -> 8^2 + 2^2 = 68 -> 6^2 + 8^2 = 100 -> 1^2 + 0^2 + 0^2 = 1.', 1, TRUE),
(153, TRUE, 'n = 2', 'false', 'Enters an infinite cycle that does not include 1.', 2, TRUE),
(154, TRUE, 'list1 = [1,2,4], list2 = [1,3,4]', '[1,1,2,3,4,4]', 'Merged list in sorted order.', 1, TRUE),
(154, TRUE, 'list1 = [], list2 = []', '[]', 'Both empty lists.', 2, TRUE),
(155, TRUE, 'list1 = [10,1,13,6,9,5], a = 3, b = 4, list2 = [1000000,1000001,1000002]', '[10,1,13,1000000,1000001,1000002,5]', 'Nodes 3 and 4 (values 6 and 9) replaced by list2.', 1, TRUE),
(155, TRUE, 'list1 = [0,1,2,3,4,5,6], a = 2, b = 5, list2 = [100,101]', '[0,1,100,101,6]', 'Sublist replaced.', 2, TRUE),
(156, TRUE, 'head = [1,2,3,4,5], n = 2', '[1,2,3,5]', '4 is the 2nd node from the end and is removed.', 1, TRUE),
(156, TRUE, 'head = [1], n = 1', '[]', 'Removing only node returns empty list.', 2, TRUE),
(157, TRUE, 'head = [1,2,3,4]', '[1,4,2,3]', 'Nodes reordered from outer ends inward.', 1, TRUE),
(157, TRUE, 'head = [1,2,3,4,5]', '[1,5,2,4,3]', 'Nodes reordered from outer ends inward.', 2, TRUE),
(158, TRUE, 'temperatures = [73,74,75,71,69,72,76,73]', '[1,1,4,2,1,1,0,0]', 'Days until a warmer temperature occurs.', 1, TRUE),
(158, TRUE, 'temperatures = [30,40,50,60]', '[1,1,1,0]', 'Each day is followed immediately by a warmer temperature except the last.', 2, TRUE),
(159, TRUE, 'nums1 = [4,1,2], nums2 = [1,3,4,2]', '[-1,3,-1]', 'For 4, no greater element (-1). For 1, next greater is 3. For 2, no greater (-1).', 1, TRUE),
(159, TRUE, 'nums1 = [2,4], nums2 = [1,2,3,4]', '[3,-1]', 'Next greater for 2 is 3, for 4 is -1.', 2, TRUE),
(160, TRUE, 'heights = [2,1,5,6,2,3]', '10', 'The largest rectangle has height 5 and width 2 (bars at index 2 and 3), giving area 10.', 1, TRUE),
(160, TRUE, 'heights = [2,4]', '4', 'Largest rectangle has height 4 width 1 or height 2 width 2.', 2, TRUE),
(161, TRUE, 's = ''()[]{}''', 'true', 'All bracket pairs open and close correctly.', 1, TRUE),
(161, TRUE, 's = ''(]''', 'false', 'Mismatched bracket types.', 2, TRUE),
(162, TRUE, 'n = 3', '[''((()))'',''(()())'',''(())()'',''()(())'',''()()()'']', 'All 5 well-formed combinations of 3 pairs.', 1, TRUE),
(162, TRUE, 'n = 1', '[''()'']', 'Only one valid pair.', 2, TRUE),
(163, TRUE, 's = ''lee(t(c)o)de)''', '''lee(t(c)o)de''', 'The last '')'' is removed.', 1, TRUE),
(163, TRUE, 's = ''a)b(c)d''', '''ab(c)d''', 'First '')'' removed.', 2, TRUE),
(164, TRUE, 'nums = [1,2,1]', '[2,-1,2]', 'For 1, next is 2. For 2, no greater (-1). For circular 1, next is 2.', 1, TRUE),
(164, TRUE, 'nums = [1,2,3,4,3]', '[2,3,4,-1,4]', 'Circular search resolves remaining elements.', 2, TRUE),
(165, TRUE, 'prices = [100, 80, 60, 70, 60, 75, 85]', '[1, 1, 1, 2, 1, 4, 6]', 'Spans computed per day.', 1, TRUE),
(165, TRUE, 'prices = [31, 41, 48, 59, 79]', '[1, 2, 3, 4, 5]', 'Each strictly increasing day accumulates previous spans.', 2, TRUE),
(166, TRUE, 'operations = [''push 1'', ''push 2'', ''peek'', ''pop'', ''empty'']', '[null, null, 1, 1, false]', 'FIFO behavior demonstrated.', 1, TRUE),
(166, TRUE, 'operations = [''push 5'', ''empty'']', '[null, false]', 'Queue not empty after push.', 2, TRUE),
(167, TRUE, 'inputs = [1, 100, 3001, 3002]', '[1, 2, 3, 3]', 'At t=3002, t=1 is older than 3002 - 3000 = 2, so it is evicted, leaving 3 pings.', 1, TRUE),
(167, TRUE, 'inputs = [1, 2, 3]', '[1, 2, 3]', 'All pings within 3000ms window.', 2, TRUE),
(168, TRUE, 'nums = [1,3,-1,-3,5,3,6,7], k = 3', '[3,3,5,5,6,7]', 'Max values observed per window of size 3.', 1, TRUE),
(168, TRUE, 'nums = [1], k = 1', '[1]', 'Single element window.', 2, TRUE),
(169, TRUE, 'ops = [''insertLast 1'', ''insertLast 2'', ''insertFront 3'', ''getRear'']', '[true, true, true, 2]', 'Double ended queue operations.', 1, TRUE),
(169, TRUE, 'ops = [''isEmpty'', ''isFull'']', '[true, false]', 'Initial empty state.', 2, TRUE),
(170, TRUE, 'nums = [-1,0,3,5,9,12], target = 9', '4', '9 exists in nums and its index is 4.', 1, TRUE),
(170, TRUE, 'nums = [-1,0,3,5,9,12], target = 2', '-1', '2 does not exist in nums so return -1.', 2, TRUE),
(171, TRUE, 'n = 10, pick = 6', '6', 'Binary search finds 6 in log2(10) guesses.', 1, TRUE),
(171, TRUE, 'n = 1, pick = 1', '1', 'Single choice.', 2, TRUE),
(172, TRUE, 'nums = [1,3,5,6], target = 5', '2', '5 is found at index 2.', 1, TRUE),
(172, TRUE, 'nums = [1,3,5,6], target = 2', '1', '2 should be inserted at index 1.', 2, TRUE),
(173, TRUE, 'nums = [5,7,7,8,8,10], target = 8', '[3,4]', '8 first appears at index 3 and last at index 4.', 1, TRUE),
(173, TRUE, 'nums = [5,7,7,8,8,10], target = 6', '[-1,-1]', '6 does not exist in nums.', 2, TRUE),
(174, TRUE, 'nums = [4,5,6,7,0,1,2], target = 0', '4', '0 is at index 4 in rotated array.', 1, TRUE),
(174, TRUE, 'nums = [4,5,6,7,0,1,2], target = 3', '-1', '3 does not exist.', 2, TRUE),
(175, TRUE, 'nums = [3,4,5,1,2]', '1', 'The original array was [1,2,3,4,5] rotated 3 times.', 1, TRUE),
(175, TRUE, 'nums = [4,5,6,7,0,1,2]', '0', '0 is the minimum element.', 2, TRUE),
(176, TRUE, 'piles = [3,6,7,11], h = 8', '4', 'At speed 4, hours required is ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8.', 1, TRUE),
(176, TRUE, 'piles = [30,11,23,4,20], h = 5', '30', 'Speed must equal max pile to finish in 5 hours.', 2, TRUE),
(177, TRUE, 'weights = [1,2,3,4,5,6,7,8,9,10], days = 5', '15', 'A ship capacity of 15 allows shipping within 5 days.', 1, TRUE),
(177, TRUE, 'weights = [3,2,2,4,1,4], days = 3', '6', 'Capacity of 6 ships in 3 days.', 2, TRUE),
(178, TRUE, 'nums = [7,2,5,10,8], k = 2', '18', 'Best split is [7,2,5] and [10,8], largest sum is 18.', 1, TRUE),
(178, TRUE, 'nums = [1,2,3,4,5], k = 2', '9', 'Best split is [1,2,3] and [4,5], max sum 9.', 2, TRUE),
(179, TRUE, 'n = 2', '1', 'F(2) = F(1) + F(0) = 1 + 0 = 1.', 1, TRUE),
(179, TRUE, 'n = 4', '3', 'F(4) = F(3) + F(2) = 2 + 1 = 3.', 2, TRUE),
(180, TRUE, 'n = 27', 'true', '27 = 3^3.', 1, TRUE),
(180, TRUE, 'n = 0', 'false', '0 is not a power of three.', 2, TRUE),
(181, TRUE, 'nums = [1,2,3]', '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', 'All 2^3 = 8 subsets.', 1, TRUE),
(181, TRUE, 'nums = [0]', '[[],[0]]', 'Two subsets for single element.', 2, TRUE),
(182, TRUE, 'nums = [1,2,2]', '[[],[1],[1,2],[1,2,2],[2],[2,2]]', 'Unique subsets avoiding duplicates.', 1, TRUE),
(182, TRUE, 'nums = [0]', '[[],[0]]', 'Power set of [0].', 2, TRUE),
(183, TRUE, 'nums = [1,2,3]', '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', 'All 3! = 6 permutations.', 1, TRUE),
(183, TRUE, 'nums = [0,1]', '[[0,1],[1,0]]', '2 permutations.', 2, TRUE),
(184, TRUE, 'nums = [1,1,2]', '[[1,1,2],[1,2,1],[2,1,1]]', '3 unique permutations.', 1, TRUE),
(184, TRUE, 'nums = [1,2,3]', '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', '6 unique permutations.', 2, TRUE),
(185, TRUE, 'candidates = [2,3,6,7], target = 7', '[[2,2,3],[7]]', '2 + 2 + 3 = 7 and 7 = 7.', 1, TRUE),
(185, TRUE, 'candidates = [2,3,5], target = 8', '[[2,2,2,2],[2,3,3],[3,5]]', 'Three unique combinations.', 2, TRUE),
(186, TRUE, 'digits = ''23''', '[''ad'',''ae'',''af'',''bd'',''be'',''bf'',''cd'',''ce'',''cf'']', 'All combinations from mapping ''2'' and ''3''.', 1, TRUE),
(186, TRUE, 'digits = ''''', '[]', 'Empty digits produces empty list.', 2, TRUE),
(187, TRUE, 'n = 4', '[''.Q..'',''...Q'',''Q...'',''..Q.''],[''..Q.'',''Q...'',''...Q'',''.Q..'']', 'Two distinct 4-queens board configurations.', 1, TRUE),
(187, TRUE, 'n = 1', '[[''Q'']]', 'Single queen.', 2, TRUE),
(188, TRUE, 'board = [[''A'',''B'',''C'',''E''],[''S'',''F'',''C'',''S''],[''A'',''D'',''E'',''E'']], word = ''ABCCED''', 'true', 'The word ''ABCCED'' exists following adjacent cells.', 1, TRUE),
(188, TRUE, 'board = [[''A'',''B'',''C'',''E''],[''S'',''F'',''C'',''S''],[''A'',''D'',''E'',''E'']], word = ''ABCB''', 'false', 'Cannot reuse cell ''B''.', 2, TRUE),
(189, TRUE, 'board = [[''5'',''3'',''.'',''.'',''7'',''.'',''.'',''.'',''.''],[''6'',''.'',''.'',''1'',''9'',''5'',''.'',''.'',''.''],...]', 'solved board', 'All rows, columns, and 3x3 boxes filled validly.', 1, TRUE),
(189, TRUE, 'board = [[''8'',''.'',''.'',''.'',''.'',''.'',''.'',''.'',''.''],...]', 'solved board', 'Puzzle completed.', 2, TRUE),
(190, TRUE, 'root = [4,2,7,1,3,6,9]', '[4,7,2,9,6,3,1]', 'Left and right subtrees are inverted at every node level.', 1, TRUE),
(190, TRUE, 'root = [2,1,3]', '[2,3,1]', 'Subtrees swapped.', 2, TRUE),
(191, TRUE, 'root = [1,null,2,3]', '[1,3,2]', 'Inorder visits left, then current, then right.', 1, TRUE),
(191, TRUE, 'root = []', '[]', 'Empty tree.', 2, TRUE),
(192, TRUE, 'root = [1,null,2,3]', '[1,2,3]', 'Preorder visits root, then left, then right.', 1, TRUE),
(192, TRUE, 'root = [1]', '[1]', 'Single node tree.', 2, TRUE),
(193, TRUE, 'root = [2,1,3]', 'true', 'Left child 1 < 2 < right child 3.', 1, TRUE),
(193, TRUE, 'root = [5,1,4,null,null,3,6]', 'false', 'The root node''s value is 5 but its right child''s value is 4.', 2, TRUE),
(194, TRUE, 'root = [3,1,4,null,2], k = 1', '1', 'Inorder traversal is [1, 2, 3, 4], 1st smallest is 1.', 1, TRUE),
(194, TRUE, 'root = [5,3,6,2,4,null,null,1], k = 3', '3', '3rd smallest element is 3.', 2, TRUE),
(195, TRUE, 'root = [4,2,7,1,3], val = 5', '[4,2,7,1,3,5]', '5 is inserted as left child of 7.', 1, TRUE),
(195, TRUE, 'root = [40,20,60,10,30,50,70], val = 25', '[40,20,60,10,30,50,70,null,null,25]', '25 inserted.', 2, TRUE),
(196, TRUE, 'root = [3,9,20,null,null,15,7]', '3', 'Longest path is 3 -> 20 -> 15 (depth 3).', 1, TRUE),
(196, TRUE, 'root = [1,null,2]', '2', 'Depth is 2.', 2, TRUE),
(197, TRUE, 'root = [1,2,3,4,5]', '3', 'Longest path is [4,2,1,3] or [5,2,1,3], which has length 3 edges.', 1, TRUE),
(197, TRUE, 'root = [1,2]', '1', '1 edge between 1 and 2.', 2, TRUE),
(198, TRUE, 'root = [3,9,20,null,null,15,7]', 'true', 'Every subtree height differs by at most 1.', 1, TRUE),
(198, TRUE, 'root = [1,2,2,3,3,null,null,4,4]', 'false', 'Not height-balanced.', 2, TRUE),
(199, TRUE, 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', '6', 'The LCA of nodes 2 and 8 is 6.', 1, TRUE),
(199, TRUE, 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4', '2', 'The LCA of nodes 2 and 4 is 2 since a node can be descendant of itself.', 2, TRUE),
(200, TRUE, 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', '3', 'LCA of 5 and 1 is 3.', 1, TRUE),
(200, TRUE, 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', '5', 'LCA of 5 and 4 is 5.', 2, TRUE),
(201, TRUE, 'root = [3,9,20,null,null,15,7]', '[[3],[9,20],[15,7]]', 'Level 0: [3], Level 1: [9,20], Level 2: [15,7].', 1, TRUE),
(201, TRUE, 'root = [1]', '[[1]]', 'Single node.', 2, TRUE),
(202, TRUE, 'root = [1,2,3,null,5,null,4]', '[1,3,4]', 'Rightmost visible nodes from top to bottom.', 1, TRUE),
(202, TRUE, 'root = [1,null,3]', '[1,3]', 'Nodes on right path.', 2, TRUE),
(203, TRUE, 'root = [3,9,20,null,null,15,7]', '[[3],[20,9],[15,7]]', 'Level 1 is left-to-right, level 2 is right-to-left, level 3 is left-to-right.', 1, TRUE),
(203, TRUE, 'root = [1]', '[[1]]', 'Single level.', 2, TRUE),
(204, TRUE, 'nums = [3,2,1,5,6,4], k = 2', '5', 'Sorted order is [1,2,3,4,5,6], 2nd largest is 5.', 1, TRUE),
(204, TRUE, 'nums = [3,2,3,1,2,4,5,5,6], k = 4', '4', '4th largest element is 4.', 2, TRUE),
(205, TRUE, 'words = [''i'',''love'',''leetcode'',''i'',''love'',''coding''], k = 2', '[''i'',''love'']', '''i'' and ''love'' are the two most frequent words.', 1, TRUE),
(205, TRUE, 'words = [''the'',''day'',''is'',''sunny'',''the'',''the'',''the'',''sunny'',''is'',''is''], k = 4', '[''the'',''is'',''sunny'',''day'']', 'Ties broken alphabetically.', 2, TRUE),
(206, TRUE, 'k = 3, nums = [4, 5, 8, 2], adds = [3, 5, 10, 9, 4]', '[4, 5, 5, 8, 8]', 'Returns 3rd largest value at each step.', 1, TRUE),
(206, TRUE, 'k = 1, nums = [], adds = [-3, -2, -4, 0, 4]', '[-3, -2, -2, 0, 4]', 'Returns maximum at each step.', 2, TRUE),
(207, TRUE, 'nums1 = [1,7,11], nums2 = [2,4,6], k = 3', '[[1,2],[1,4],[1,6]]', 'The first 3 pairs are returned from the sequence.', 1, TRUE),
(207, TRUE, 'nums1 = [1,1,2], nums2 = [1,2,3], k = 2', '[[1,1],[1,1]]', 'Smallest sums are 1+1=2 and 1+1=2.', 2, TRUE),
(208, TRUE, 'adds = [1, 2], findMedian, add 3, findMedian', '[1.5, 2.0]', 'Median of [1,2] is 1.5, median of [1,2,3] is 2.0.', 1, TRUE),
(208, TRUE, 'adds = [5], findMedian', '[5.0]', 'Single element median is 5.0.', 2, TRUE),
(209, TRUE, 'nums = [1,3,-1,-3,5,3,6,7], k = 3', '[1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]', 'Medians of consecutive size 3 windows.', 1, TRUE),
(209, TRUE, 'nums = [1,2,3,4,2,3,1,4,2], k = 3', '[2.00000,3.00000,3.00000,3.00000,2.00000,3.00000,2.00000]', 'Medians per window.', 2, TRUE),
(210, TRUE, 'lists = [[1,4,5],[1,3,4],[2,6]]', '[1,1,2,3,4,4,5,6]', 'Merged sorted sequence.', 1, TRUE),
(210, TRUE, 'lists = []', '[]', 'Empty input.', 2, TRUE),
(211, TRUE, 'nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]', '[20,24]', 'Range [20, 24] covers 24 (list 1), 20 (list 2), 22 (list 3).', 1, TRUE),
(211, TRUE, 'nums = [[1,2,3],[1,2,3],[1,2,3]]', '[1,1]', 'Range [1,1] covers all three lists.', 2, TRUE),
(212, TRUE, 'grid = [[''1'',''1'',''1'',''1'',''0''],[''1'',''1'',''0'',''1'',''0''],[''1'',''1'',''0'',''0'',''0''],[''0'',''0'',''0'',''0'',''0'']]', '1', 'All adjacent lands merge into 1 island.', 1, TRUE),
(212, TRUE, 'grid = [[''1'',''1'',''0'',''0'',''0''],[''1'',''1'',''0'',''0'',''0''],[''0'',''0'',''1'',''0'',''0''],[''0'',''0'',''0'',''1'',''1'']]', '3', 'Three disconnected islands.', 2, TRUE),
(213, TRUE, 'grid = [[2,1,1],[1,1,0],[0,1,1]]', '4', 'Oranges rot simultaneously level by level.', 1, TRUE),
(213, TRUE, 'grid = [[2,1,1],[0,1,1],[1,0,1]]', '-1', 'The bottom-left fresh orange cannot be reached.', 2, TRUE),
(214, TRUE, 'beginWord = ''hit'', endWord = ''cog'', wordList = [''hot'',''dot'',''dog'',''lot'',''log'',''cog'']', '5', 'Shortest transformation is ''hit'' -> ''hot'' -> ''dot'' -> ''dog'' -> ''cog'' (5 words).', 1, TRUE),
(214, TRUE, 'beginWord = ''hit'', endWord = ''cog'', wordList = [''hot'',''dot'',''dog'',''lot'',''log'']', '0', '''cog'' is not in wordList.', 2, TRUE),
(215, TRUE, 'adjList = [[2,4],[1,3],[2,4],[1,3]]', '[[2,4],[1,3],[2,4],[1,3]]', 'Deep copy with all new Node instances.', 1, TRUE),
(215, TRUE, 'adjList = [[]]', '[[]]', 'Single isolated node.', 2, TRUE),
(216, TRUE, 'grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],...]', '6', 'Max area is 6.', 1, TRUE),
(216, TRUE, 'grid = [[0,0,0,0,0,0,0,0]]', '0', 'No islands present.', 2, TRUE),
(217, TRUE, 'board = [[''X'',''X'',''X'',''X''],[''X'',''O'',''O'',''X''],[''X'',''X'',''O'',''X''],[''X'',''O'',''X'',''X'']]', '[[''X'',''X'',''X'',''X''],[''X'',''X'',''X'',''X''],[''X'',''X'',''X'',''X''],[''X'',''O'',''X'',''X'']]', 'Surrounded ''O''s captured, border-connected ''O'' survives.', 1, TRUE),
(217, TRUE, 'board = [[''X'']]', '[[''X'']]', 'Single cell.', 2, TRUE),
(218, TRUE, 'n = 5, edges = [[0,1],[1,2],[3,4]]', '2', 'Component 1: {0,1,2}, Component 2: {3,4}.', 1, TRUE),
(218, TRUE, 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', '1', 'All nodes connected.', 2, TRUE),
(219, TRUE, 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]', '2', 'Cities 0 and 1 form one province, city 2 forms another.', 1, TRUE),
(219, TRUE, 'isConnected = [[1,0,0],[0,1,0],[0,0,1]]', '3', 'Three disconnected provinces.', 2, TRUE),
(220, TRUE, 'numCourses = 2, prerequisites = [[1,0]]', 'true', 'Take course 0 then course 1.', 1, TRUE),
(220, TRUE, 'numCourses = 2, prerequisites = [[1,0],[0,1]]', 'false', 'Circular prerequisite cycle exists.', 2, TRUE),
(221, TRUE, 'edges = [[1,2],[1,3],[2,3]]', '[2,3]', '[2,3] closes a cycle.', 1, TRUE),
(221, TRUE, 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', '[1,4]', 'Edge [1,4] creates redundant cycle.', 2, TRUE),
(222, TRUE, 'numCourses = 2, prerequisites = [[1,0]]', '[0,1]', 'Course 0 must be taken before course 1.', 1, TRUE),
(222, TRUE, 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', '[0,2,1,3]', 'Valid topological ordering.', 2, TRUE),
(223, TRUE, 'words = [''hello'',''leetcode''], order = ''hlabcdefgijkmnopqrstuvwxyz''', 'true', '''h'' comes before ''l'' in alien order.', 1, TRUE),
(223, TRUE, 'words = [''word'',''world'',''row''], order = ''worldabcefghijkmnpqstuvxyz''', 'false', '''d'' comes after ''l'' in this alien order.', 2, TRUE),
(224, TRUE, 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', '2', 'Signal reaches node 4 in 2 units of time.', 1, TRUE),
(224, TRUE, 'times = [[1,2,1]], n = 2, k = 1', '1', 'Reaches node 2 in 1 unit.', 2, TRUE),
(225, TRUE, 'n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1', '700', 'The optimal path with at most 1 stop is 0 -> 1 -> 3 (cost 700).', 1, TRUE),
(225, TRUE, 'n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0', '500', 'Direct flight with 0 stops costs 500.', 2, TRUE),
(226, TRUE, 'intervals = [[1,2],[2,3],[3,4],[1,3]]', '1', '[1,3] can be removed and the rest of the intervals are non-overlapping.', 1, TRUE),
(226, TRUE, 'intervals = [[1,2],[1,2],[1,2]]', '2', 'You need to remove two [1,2] to model non-overlapping intervals.', 2, TRUE),
(227, TRUE, 'intervals = [[0,30],[5,10],[15,20]]', '2', 'Room 1: [0,30]; Room 2: [5,10], [15,20].', 1, TRUE),
(227, TRUE, 'intervals = [[7,10],[2,4]]', '1', 'Only one room is needed as intervals do not overlap.', 2, TRUE),
(228, TRUE, 'points = [[10,16],[2,8],[1,6],[7,12]]', '2', 'Shoot arrow at x=6 (bursts [2,8] and [1,6]) and x=11 (bursts [10,16] and [7,12]).', 1, TRUE),
(228, TRUE, 'points = [[1,2],[3,4],[5,6],[7,8]]', '4', 'One arrow is needed for each balloon.', 2, TRUE),
(229, TRUE, 'g = [1,2,3], s = [1,1]', '1', 'You can only make child 1 content with cookie of size 1.', 1, TRUE),
(229, TRUE, 'g = [1,2], s = [1,2,3]', '2', 'You have 3 cookies and their sizes are big enough to gratify all 2 children.', 2, TRUE),
(230, TRUE, 'bills = [5,5,5,10,20]', 'true', 'From the first 3 customers, we collect three $5 bills. For the 4th, we collect $10 and give $5 change. For the 5th, we give a $10 and a $5.', 1, TRUE),
(230, TRUE, 'bills = [5,5,10,10,20]', 'false', 'For the last customer, we can''t give change of $15 because we only have two $10 bills.', 2, TRUE),
(231, TRUE, 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', '3', 'Start at station 3 (index 3). Tank = 4 - 1 + 5 - 2 + 1 - 3 + 2 - 4 + 3 - 5 = 0. Completed trip.', 1, TRUE),
(231, TRUE, 'gas = [2,3,4], cost = [3,4,3]', '-1', 'Total gas = 9 < total cost = 10, impossible to complete a full lap.', 2, TRUE),
(232, TRUE, 'people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]', '[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]', 'Person 0 has height 5 with no taller people in front. Person 1 has height 7 with 0 taller, etc.', 1, TRUE),
(232, TRUE, 'people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]', '[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]', 'Reconstructed queue matching all criteria.', 2, TRUE),
(233, TRUE, 'tasks = ["A","A","A","B","B","B"], n = 2', '8', 'A -> B -> idle -> A -> B -> idle -> A -> B. Total units = 8.', 1, TRUE),
(233, TRUE, 'tasks = ["A","C","A","B","D","B"], n = 1', '6', 'A -> B -> C -> D -> A -> B. No idle slots needed.', 2, TRUE),
(234, TRUE, 'ratings = [1,0,2]', '5', 'You can allocate 2, 1, 2 candies respectively.', 1, TRUE),
(234, TRUE, 'ratings = [1,2,2]', '4', 'You can allocate 1, 2, 1 candies respectively. The third child gets 1 candy because it satisfies above conditions.', 2, TRUE),
(235, TRUE, 'nums = [2,3,1,1,4]', 'true', 'Jump 1 step from index 0 to 1, then 3 steps to the last index.', 1, TRUE),
(235, TRUE, 'nums = [3,2,1,0,4]', 'false', 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.', 2, TRUE),
(236, TRUE, 'nums = [2,3,1,1,4]', '2', 'The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.', 1, TRUE),
(236, TRUE, 'nums = [2,3,0,1,4]', '2', 'Jump to index 1, then jump 3 steps to index 4.', 2, TRUE),
(237, TRUE, 'n = 2', '2', 'There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps.', 1, TRUE),
(237, TRUE, 'n = 3', '3', 'There are three ways: 1. 1 + 1 + 1, 2. 1 + 2, 3. 2 + 1.', 2, TRUE),
(238, TRUE, 'nums = [1,2,3,1]', '4', 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4.', 1, TRUE),
(238, TRUE, 'nums = [2,7,9,3,1]', '12', 'Rob house 1 (money = 2), house 3 (money = 9) and house 5 (money = 1). Total = 12.', 2, TRUE),
(239, TRUE, 'nums = [2,3,2]', '3', 'You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.', 1, TRUE),
(239, TRUE, 'nums = [1,2,3,1]', '4', 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.', 2, TRUE),
(240, TRUE, 's = "12"', '2', '"12" could be decoded as "AB" (1 2) or "L" (12).', 1, TRUE),
(240, TRUE, 's = "226"', '3', '"226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).', 2, TRUE),
(240, TRUE, 's = "06"', '0', '"06" cannot be mapped to "F" because "6" is different from "06".', 3, TRUE),
(241, TRUE, 'm = 3, n = 7', '28', '28 paths to reach bottom-right corner.', 1, TRUE),
(241, TRUE, 'm = 3, n = 2', '3', '1. Right -> Down -> Down; 2. Down -> Down -> Right; 3. Down -> Right -> Down.', 2, TRUE),
(242, TRUE, 'obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]', '2', 'There is one obstacle in the middle of the 3x3 grid. 2 unique paths.', 1, TRUE),
(242, TRUE, 'obstacleGrid = [[0,1],[0,0]]', '1', '1 path around the obstacle.', 2, TRUE),
(243, TRUE, 'word1 = "horse", word2 = "ros"', '3', 'horse -> rorse (replace ''h'' with ''r'') -> rose (remove ''r'') -> ros (remove ''e'').', 1, TRUE),
(243, TRUE, 'word1 = "intention", word2 = "execution"', '5', 'intention -> inention -> enention -> exention -> exection -> execution.', 2, TRUE),
(244, TRUE, 'nums = [1,5,11,5]', 'true', 'The array can be partitioned as [1, 5, 5] and [11].', 1, TRUE),
(244, TRUE, 'nums = [1,2,3,5]', 'false', 'The array cannot be partitioned into equal sum subsets.', 2, TRUE),
(245, TRUE, 'nums = [1,1,1,1,1], target = 3', '5', '-1+1+1+1+1=3, +1-1+1+1+1=3, +1+1-1+1+1=3, +1+1+1-1+1=3, +1+1+1+1-1=3. 5 ways.', 1, TRUE),
(245, TRUE, 'nums = [1], target = 1', '1', '+1 = 1.', 2, TRUE),
(246, TRUE, 'coins = [1,2,5], amount = 11', '3', '11 = 5 + 5 + 1', 1, TRUE),
(246, TRUE, 'coins = [2], amount = 3', '-1', 'Cannot make 3 with 2.', 2, TRUE),
(246, TRUE, 'coins = [1], amount = 0', '0', '0 coins for amount 0.', 3, TRUE),
(247, TRUE, 'amount = 5, coins = [1,2,5]', '4', 'Four ways: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1.', 1, TRUE),
(247, TRUE, 'amount = 3, coins = [2]', '0', 'Cannot make 3 using only 2s.', 2, TRUE),
(248, TRUE, 'nums = [10,9,2,5,3,7,101,18]', '4', 'The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.', 1, TRUE),
(248, TRUE, 'nums = [0,1,0,3,2,3]', '4', '[0, 1, 2, 3] is an LIS of length 4.', 2, TRUE),
(248, TRUE, 'nums = [7,7,7,7,7,7,7]', '1', 'Only single elements can form strictly increasing subsequences.', 3, TRUE),
(249, TRUE, 'text1 = "abcde", text2 = "ace"', '3', 'The longest common subsequence is "ace" and its length is 3.', 1, TRUE),
(249, TRUE, 'text1 = "abc", text2 = "abc"', '3', '"abc" has length 3.', 2, TRUE),
(249, TRUE, 'text1 = "abc", text2 = "def"', '0', 'No common subsequence.', 3, TRUE),
(250, TRUE, 's = "leetcode", wordDict = ["leet","code"]', 'true', 'Return true because "leetcode" can be segmented as "leet code".', 1, TRUE),
(250, TRUE, 's = "applepenapple", wordDict = ["apple","pen"]', 'true', 'Segmented as "apple pen apple".', 2, TRUE),
(250, TRUE, 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', 'false', 'Cannot segment successfully.', 3, TRUE),
(251, TRUE, 'grid = [[1,3,1],[1,5,1],[4,2,1]]', '7', 'Because the path 1 -> 3 -> 1 -> 1 -> 1 minimizes the sum.', 1, TRUE),
(251, TRUE, 'grid = [[1,2,3],[4,5,6]]', '12', 'Path 1 -> 2 -> 3 -> 6 = 12.', 2, TRUE),
(252, TRUE, 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', '4', 'The maximum square has side length 2, area = 4.', 1, TRUE),
(252, TRUE, 'matrix = [["0","1"],["1","0"]]', '1', 'Maximum square area is 1.', 2, TRUE),
(252, TRUE, 'matrix = [["0"]]', '0', 'No 1s, area is 0.', 3, TRUE),
(253, TRUE, 'cost = [10,15,20]', '15', 'You will start at index 1. Pay 15 and climb two steps to reach the top. Total cost is 15.', 1, TRUE),
(253, TRUE, 'cost = [1,100,1,1,1,100,1,1,100,1]', '6', 'Start at index 0. Pick index 0 -> 2 -> 4 -> 6 -> 7 -> 9 -> top. Cost = 6.', 2, TRUE),
(254, TRUE, 'n = 2', '[0,1,1]', '0 --> 0 (0 ones), 1 --> 1 (1 one), 2 --> 10 (1 one).', 1, TRUE),
(254, TRUE, 'n = 5', '[0,1,1,2,1,2]', '0: 0, 1: 1, 2: 1, 3: 2, 4: 1, 5: 2.', 2, TRUE),
(255, TRUE, '[[1,2,3],[3,2,1]]', '6', 'Customer 1 has wealth 6, customer 2 has wealth 6.', 1, TRUE),
(255, TRUE, '[[1,5],[7,3],[3,5]]', '10', 'Customer 2 has wealth 10, which is the maximum.', 2, TRUE),
(256, TRUE, '[1,2,1]', '3', 'We can pick from all 3 trees since there are only 2 distinct types [1, 2].', 1, TRUE),
(256, TRUE, '[0,1,2,2]', '3', 'We can pick from [1,2,2]. If we started at 0, we''d stop at 2.', 2, TRUE),
(257, TRUE, '[0,1]', '2', '[0, 1] is the longest contiguous subarray with an equal number of 0 and 1.', 1, TRUE),
(257, TRUE, '[0,1,0]', '2', '[0, 1] (or [1, 0]) is a longest contiguous subarray with equal number.', 2, TRUE),
(258, TRUE, '[2,3,-2,4]', '6', '[2,3] has the largest product 6.', 1, TRUE),
(258, TRUE, '[-2,0,-1]', '0', 'The result cannot be 2, because [-2,-1] is not a contiguous subarray.', 2, TRUE),
(259, TRUE, '[3,2,3]', '[3]', '3 appears 2 times, which is more than 3/3 = 1.', 1, TRUE),
(259, TRUE, '[1]', '[1]', '1 appears once, which is more than 1/3 = 0.', 2, TRUE),
(260, TRUE, '[[1,3],[2,6],[8,10],[15,18]]', '[[1,6],[8,10],[15,18]]', 'Since [1,3] and [2,6] overlap, merge them into [1,6].', 1, TRUE),
(260, TRUE, '[[1,4],[4,5]]', '[[1,5]]', 'Intervals [1,4] and [4,5] are considered overlapping.', 2, TRUE),
(261, TRUE, 'jewels = "aA", stones = "aAAbbbb"', '3', 'The jewels are ''a'' and ''A''. stones contains one ''a'' and two ''A''s. Total 3.', 1, TRUE),
(261, TRUE, 'jewels = "z", stones = "ZZ"', '0', 'Case-sensitive, no ''z'' present in stones.', 2, TRUE),
(262, TRUE, '"the sky is blue"', '"blue is sky the"', 'Words reversed in sequence.', 1, TRUE),
(262, TRUE, '"  hello world  "', '"world hello"', 'Redundant spaces reduced to single spaces.', 2, TRUE),
(263, TRUE, '"abab"', 'true', 'It is the substring ''ab'' twice.', 1, TRUE),
(263, TRUE, '"aba"', 'false', 'Cannot be formed by repeating a substring.', 2, TRUE),
(264, TRUE, 'nums1 = [1,2,2,1], nums2 = [2,2]', '[2]', '2 is the only common unique element.', 1, TRUE),
(264, TRUE, 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', '[4,9]', '4 and 9 are the common elements.', 2, TRUE),
(265, TRUE, '[2,2,1]', '1', '1 appears once.', 1, TRUE),
(265, TRUE, '[4,1,2,1,2]', '4', '4 appears once.', 2, TRUE),
(266, TRUE, 'nums = [4,5,0,-2,-3,1], k = 5', '7', 'There are 7 subarrays with sum divisible by 5.', 1, TRUE),
(266, TRUE, 'nums = [5], k = 9', '0', 'No subarray sum is divisible by 9.', 2, TRUE),
(267, TRUE, 'order = "cba", s = "abcd"', '"cbad"', '''c'', ''b'', and ''a'' appear in order specified by order. ''d'' is appended.', 1, TRUE),
(267, TRUE, 'order = "bcafg", s = "abcd"', '"bcad"', 'Matching characters appear first in specified order.', 2, TRUE),
(268, TRUE, '[2,-1,1,2,2]', 'true', 'Loop 0 -> 2 -> 3 -> 0 has length 3 and moves purely forward.', 1, TRUE),
(268, TRUE, '[-1,2]', 'false', 'Moves forward then backward, invalid direction change.', 2, TRUE),
(269, TRUE, 'head = [1,4,3,2,5,2], x = 3', '[1,2,2,4,3,5]', 'Nodes < 3 come first, followed by nodes >= 3, preserving relative order.', 1, TRUE),
(269, TRUE, 'head = [2,1], x = 2', '[1,2]', '1 comes before 2.', 2, TRUE),
(270, TRUE, '[[7,null],[13,0],[11,4],[10,2],[1,0]]', '[[7,null],[13,0],[11,4],[10,2],[1,0]]', 'Deep copy with identical values and pointers.', 1, TRUE),
(270, TRUE, '[[1,1],[2,1]]', '[[1,1],[2,1]]', 'Random points to self or other nodes.', 2, TRUE),
(271, TRUE, '["MyStack", "push", "push", "top", "pop", "empty"]', '[null, null, null, 2, 2, false]', 'Demonstrates LIFO behavior using FIFO primitives.', 1, TRUE),
(271, TRUE, '["MyStack", "push", "pop", "empty"]', '[null, 1, 1, true]', 'Basic push and pop.', 2, TRUE),
(272, TRUE, '[8,4,6,2,3]', '[4,2,4,2,3]', '8 - 4 = 4; 4 - 2 = 2; 6 - 2 = 4; 2 has no discount = 2; 3 has no discount = 3.', 1, TRUE),
(272, TRUE, '[1,2,3,4,5]', '[1,2,3,4,5]', 'No item receives a discount.', 2, TRUE),
(273, TRUE, 'nums = [1], k = 1', '1', 'Subarray [1] has sum 1 >= 1.', 1, TRUE),
(273, TRUE, 'nums = [1,2], k = 4', '-1', 'No subarray has sum >= 4.', 2, TRUE),
(274, TRUE, 'n = 5, bad = 4', '4', 'call isBadVersion(3) -> false, isBadVersion(5) -> true, isBadVersion(4) -> true. First bad is 4.', 1, TRUE),
(274, TRUE, 'n = 1, bad = 1', '1', 'First bad is 1.', 2, TRUE),
(275, TRUE, '[1,2,3,1]', '2', '3 is a peak element and your function should return the index number 2.', 1, TRUE),
(275, TRUE, '[1,2,1,3,5,6,4]', '5', 'Index 1 (value 2) or index 5 (value 6) are valid peaks.', 2, TRUE),
(276, TRUE, 'nums = [2,5,6,0,0,1,2], target = 0', 'true', '0 is present in the rotated array.', 1, TRUE),
(276, TRUE, 'nums = [2,5,6,0,0,1,2], target = 3', 'false', '3 is not present.', 2, TRUE),
(277, TRUE, '16', 'true', '16 = 4^2.', 1, TRUE),
(277, TRUE, '5', 'false', '5 is not a power of four.', 2, TRUE),
(278, TRUE, '"a1b2"', '["a1b2","a1B2","A1b2","A1B2"]', 'All 4 combinations of letter cases.', 1, TRUE),
(278, TRUE, '"3z4"', '["3z4","3Z4"]', 'Digits remain unchanged.', 2, TRUE),
(279, TRUE, '[1,2,3]', '[1,3,2]', 'The next lexicographical permutation is [1,3,2].', 1, TRUE),
(279, TRUE, '[3,2,1]', '[1,2,3]', 'Highest permutation wraps around to lowest sorted order.', 2, TRUE),
(280, TRUE, 'candidates = [10,1,2,7,6,1,5], target = 8', '[[1,1,6],[1,2,5],[1,7],[2,6]]', 'Duplicate combinations are excluded.', 1, TRUE),
(280, TRUE, 'candidates = [2,5,2,1,2], target = 5', '[[1,2,2],[5]]', 'Each candidate number is used at most once per branch.', 2, TRUE),
(281, TRUE, '[3,5,1,6,2,0,8,null,null,7,4]', '[2,7,4]', '7 and 4 are the deepest leaves, their LCA is node 2.', 1, TRUE),
(281, TRUE, '[1]', '[1]', 'The root is the only leaf, so it is its own LCA.', 2, TRUE),
(282, TRUE, 'points = [[1,3],[-2,2]], k = 1', '[[-2,2]]', '(-2,2) has distance sqrt(8) while (1,3) has distance sqrt(10).', 1, TRUE),
(282, TRUE, 'points = [[3,3],[5,-1],[-2,4]], k = 2', '[[3,3],[-2,4]]', 'Both have smaller squared distances than [5,-1].', 2, TRUE),
(283, TRUE, 'root = [3,1,4,null,2], k = 1', '1', '1 is the smallest element.', 1, TRUE),
(283, TRUE, 'root = [5,3,6,2,4,null,null,1], k = 3', '3', 'The elements in sorted order are [1, 2, 3, 4, 5, 6]. 3rd is 3.', 2, TRUE),
(284, TRUE, 'k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]', '4', 'Pick project 0 (capital 0, profit 1) -> w=1. Then pick project 2 (capital 1, profit 3) -> w=4.', 1, TRUE),
(284, TRUE, 'k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]', '6', 'Sequentially pick projects to reach total 6.', 2, TRUE),
(285, TRUE, 'matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8', '13', 'The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13.', 1, TRUE),
(285, TRUE, 'matrix = [[-5]], k = 1', '-5', 'Single element matrix.', 2, TRUE),
(286, TRUE, 'grid1 = [[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,0,0,0,0],[1,1,0,1,1]], grid2 = [[1,1,1,0,0],[0,0,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]', '3', '3 islands in grid2 are completely covered by land in grid1.', 1, TRUE),
(286, TRUE, 'grid1 = [[1,0,1,0,1],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[1,0,1,0,1]], grid2 = [[0,0,0,0,0],[1,1,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]', '2', '2 valid sub-islands.', 2, TRUE),
(287, TRUE, 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', 'true', 'Forms a connected graph with no cycles.', 1, TRUE),
(287, TRUE, 'n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]', 'false', 'Contains a cycle: 1-2-3-1.', 2, TRUE),
(288, TRUE, 'n = 8, edges = [[0,3],[0,4],[1,3],[2,4],[2,7],[3,5],[3,6],[3,7],[4,6]]', '[[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]', 'Ancestors for each node sorted ascending.', 1, TRUE),
(288, TRUE, 'n = 5, edges = [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]', '[[],[0],[0,1],[0,1,2],[0,1,2,3]]', 'Linear dependency cascade.', 2, TRUE),
(289, TRUE, 'heights = [[1,2,2],[3,8,2],[5,3,5]]', '2', 'Route [1,1] -> [1,2] -> [2,2] -> [3,2] -> [3,3] has maximum consecutive difference of 2.', 1, TRUE),
(289, TRUE, 'heights = [[1,2,3],[3,8,4],[5,3,5]]', '1', 'Route has maximum consecutive difference of 1.', 2, TRUE),
(290, TRUE, 'boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4', '8', 'Pick 1 box of 3 units, 2 boxes of 2 units, and 1 box of 1 unit. Total = 3 + 4 + 1 = 8.', 1, TRUE),
(290, TRUE, 'boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10', '91', 'Greedily take the highest-unit boxes first.', 2, TRUE),
(291, TRUE, 'triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]', '11', 'Path: 2 -> 3 -> 5 -> 1. Sum = 11.', 1, TRUE),
(291, TRUE, 'triangle = [[-10]]', '-10', 'Single element triangle.', 2, TRUE),
(292, TRUE, 'n = 4', '4', 'T_3 = 0 + 1 + 1 = 2, T_4 = 1 + 1 + 2 = 4.', 1, TRUE),
(292, TRUE, 'n = 25', '1389537', 'Value calculated by 25 iterations.', 2, TRUE),
(293, TRUE, 'nums = [1, 3, 5], sumRange(0, 2), update(1, 2), sumRange(0, 2)', '[9, 8]', 'Initial sum of [1, 3, 5] is 9. After updating index 1 to 2, array is [1, 2, 5], sum is 8.', 1, TRUE),
(293, TRUE, 'nums = [7, 2, 7, 2, 0], update(4, 6), update(0, 2), update(0, 9), sumRange(4, 4)', '[6]', 'After updates, element at index 4 is 6.', 2, TRUE),
(294, TRUE, 'board = [[''o'',''a'',''a'',''n''],[''e'',''t'',''a'',''e''],[''i'',''h'',''k'',''r''],[''i'',''f'',''l'',''v'']], words = [''oath'',''pea'',''eat'',''rain'']', '[''eat'',''oath'']', 'Both ''eat'' and ''oath'' can be formed by adjacent cells.', 1, TRUE),
(294, TRUE, 'board = [[''a'',''b''],[''c'',''d'']], words = [''abcb'']', '[]', 'No valid path forms ''abcb'' without reusing cell ''b''.', 2, TRUE),
(295, TRUE, 's = ''banana''', '''ana''', '''ana'' appears at index 1 and index 3.', 1, TRUE),
(295, TRUE, 's = ''abcd''', '''''', 'No duplicate substrings exist in s.', 2, TRUE),
(296, TRUE, 'nums = [5,2,6,1]', '[2,1,1,0]', 'To the right of 5: 2 and 1 (2 smaller). Right of 2: 1 (1 smaller). Right of 6: 1 (1 smaller). Right of 1: none (0 smaller).', 1, TRUE),
(296, TRUE, 'nums = [-1]', '[0]', 'Single element array has 0 elements to its right.', 2, TRUE),
(297, TRUE, 'n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]', '[[1,3]]', '[[1,3]] is the only critical connection because removing [0,1], [1,2], or [2,0] still leaves the triangle 0-1-2 connected.', 1, TRUE),
(297, TRUE, 'n = 2, connections = [[0,1]]', '[[0,1]]', 'Removing [0,1] disconnects servers 0 and 1.', 2, TRUE),
(298, TRUE, 'nums = [3,1,5,8]', '167', 'Optimal order: burst 1, then 5, then 3, then 8. Coins: (3*1*5) + (3*5*8) + (1*3*8) + (1*8*1) = 15 + 120 + 24 + 8 = 167.', 1, TRUE),
(298, TRUE, 'nums = [1,5]', '10', 'Burst 1 then 5: (1*1*5) + (1*5*1) = 5 + 5 = 10.', 2, TRUE),
(299, TRUE, 'nums = [2,2,3,2]', '3', '3 appears once, 2 appears three times.', 1, TRUE),
(299, TRUE, 'nums = [0,1,0,1,0,1,99]', '99', '99 appears once, 0 and 1 appear three times.', 2, TRUE),
(300, TRUE, 's = ''aa'', p = ''a*''', 'true', '''*'' means zero or more of the preceding element ''a''. Therefore, by repeating ''a'' once, it becomes ''aa''.', 1, TRUE),
(300, TRUE, 's = ''ab'', p = ''.*''', 'true', '''.*'' means ''zero or more (*) of any character (.)''.', 2, TRUE);

-- ----------------------------------------------------------------------------
-- 4. Insert Algorithmic Pattern Tags & Junction Mappings
-- ----------------------------------------------------------------------------
INSERT INTO problem_tags (id, name, slug) VALUES
(151, 'String Manipulation', 'string-manipulation'),
(152, 'HashMap', 'hashmap'),
(153, 'HashSet', 'hashset'),
(154, 'Frequency Maps', 'frequency-maps'),
(155, 'Duplicate Detection', 'duplicate-detection'),
(156, 'Pair and Complement Lookup', 'pair-and-complement-lookup'),
(157, 'Reversal', 'reversal'),
(158, 'Fast and Slow Pointers', 'fast-and-slow-pointers'),
(159, 'Cycle Detection', 'cycle-detection'),
(160, 'Merging Lists', 'merging-lists'),
(161, 'Node Manipulation', 'node-manipulation'),
(162, 'Monotonic Stack', 'monotonic-stack'),
(163, 'Balanced Parentheses', 'balanced-parentheses'),
(164, 'Next Greater Element', 'next-greater-element'),
(165, 'Queue Simulation', 'queue-simulation'),
(166, 'Deque Applications', 'deque-applications'),
(167, 'Basic Binary Search', 'basic-binary-search'),
(168, 'Lower and Upper Bound', 'lower-and-upper-bound'),
(169, 'Search in Rotated Arrays', 'search-in-rotated-arrays'),
(170, 'Binary Search on Answer', 'binary-search-on-answer'),
(171, 'Basic Recursion', 'basic-recursion'),
(172, 'Subsets', 'subsets'),
(173, 'Permutations', 'permutations'),
(174, 'Combination Generation', 'combination-generation'),
(175, 'Constraint-Based Backtracking', 'constraint-based-backtracking'),
(176, 'Tree Traversals', 'tree-traversals'),
(177, 'Binary Search Trees', 'binary-search-trees'),
(178, 'Height and Depth', 'height-and-depth'),
(179, 'Lowest Common Ancestor', 'lowest-common-ancestor'),
(180, 'Level Order Traversal', 'level-order-traversal'),
(181, 'Top K Elements', 'top-k-elements'),
(182, 'Kth Largest/Smallest', 'kth-largest-smallest'),
(183, 'Two Heaps', 'two-heaps'),
(184, 'Merge K Sorted Structures', 'merge-k-sorted-structures'),
(185, 'BFS', 'bfs'),
(186, 'DFS', 'dfs'),
(187, 'Connected Components', 'connected-components'),
(188, 'Topological Sorting', 'topological-sorting'),
(189, 'Shortest Paths', 'shortest-paths'),
(190, 'Interval Scheduling', 'interval-scheduling'),
(191, 'Activity Selection', 'activity-selection'),
(192, 'Sorting-Based Greedy', 'sorting-based-greedy'),
(193, 'Local Optimal Choices', 'local-optimal-choices'),
(194, '1D DP', '1d-dp'),
(195, '2D DP', '2d-dp'),
(196, 'Knapsack Patterns', 'knapsack-patterns'),
(197, 'Subsequence DP', 'subsequence-dp'),
(198, 'Grid DP', 'grid-dp'),
(199, 'Memoization and Tabulation', 'memoization-and-tabulation')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO problem_tag_mappings (problem_id, tag_id) VALUES
(101, 141),
(102, 141),
(103, 95),
(104, 95),
(105, 95),
(106, 95),
(107, 142),
(108, 142),
(109, 143),
(110, 143),
(111, 144),
(112, 144),
(113, 145),
(114, 145),
(115, 146),
(116, 146),
(117, 147),
(118, 147),
(119, 95),
(120, 95),
(121, 95),
(122, 142),
(123, 142),
(124, 142),
(125, 148),
(126, 148),
(127, 149),
(128, 149),
(129, 149),
(130, 150),
(131, 150),
(132, 150),
(133, 151),
(134, 151),
(135, 152),
(136, 152),
(137, 152),
(138, 153),
(139, 153),
(140, 154),
(141, 154),
(142, 155),
(143, 155),
(144, 156),
(145, 156),
(146, 157),
(147, 157),
(148, 157),
(149, 158),
(150, 158),
(151, 158),
(152, 159),
(153, 159),
(154, 160),
(155, 160),
(156, 161),
(157, 161),
(158, 162),
(159, 162),
(160, 162),
(161, 163),
(162, 163),
(163, 163),
(164, 164),
(165, 164),
(166, 165),
(167, 165),
(168, 166),
(169, 166),
(170, 167),
(171, 167),
(172, 168),
(173, 168),
(174, 169),
(175, 169),
(176, 170),
(177, 170),
(178, 170),
(179, 171),
(180, 171),
(181, 172),
(182, 172),
(183, 173),
(184, 173),
(185, 174),
(186, 174),
(187, 175),
(188, 175),
(189, 175),
(190, 176),
(191, 176),
(192, 176),
(193, 177),
(194, 177),
(195, 177),
(196, 178),
(197, 178),
(198, 178),
(199, 179),
(200, 179),
(201, 180),
(202, 180),
(203, 180),
(204, 181),
(205, 181),
(206, 182),
(207, 182),
(208, 183),
(209, 183),
(210, 184),
(211, 184),
(212, 185),
(213, 185),
(214, 185),
(215, 186),
(216, 186),
(217, 186),
(218, 187),
(219, 187),
(220, 159),
(221, 159),
(222, 188),
(223, 188),
(224, 189),
(225, 189),
(226, 190),
(227, 190),
(228, 190),
(229, 191),
(230, 191),
(231, 191),
(232, 192),
(233, 192),
(234, 192),
(235, 193),
(236, 193),
(237, 194),
(238, 194),
(239, 194),
(240, 194),
(241, 195),
(242, 195),
(243, 195),
(244, 196),
(245, 196),
(246, 196),
(247, 196),
(248, 197),
(249, 197),
(250, 197),
(251, 198),
(252, 198),
(253, 199),
(254, 199),
(255, 141),
(256, 142),
(257, 143),
(258, 144),
(259, 146),
(260, 145),
(261, 147),
(262, 151),
(263, 148),
(264, 153),
(265, 155),
(266, 156),
(267, 154),
(268, 159),
(269, 160),
(270, 161),
(271, 165),
(272, 164),
(273, 166),
(274, 167),
(275, 168),
(276, 169),
(277, 171),
(278, 172),
(279, 173),
(280, 174),
(281, 179),
(282, 181),
(283, 182),
(284, 183),
(285, 184),
(286, 187),
(287, 159),
(288, 188),
(289, 189),
(290, 193),
(291, 198),
(292, 199),
(293, 143),
(294, 175),
(295, 148),
(296, 170),
(297, 186),
(298, 195),
(299, 155),
(300, 195)
ON DUPLICATE KEY UPDATE problem_id = VALUES(problem_id);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
