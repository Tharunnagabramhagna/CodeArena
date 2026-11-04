# hashing.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: HashMap
    problems.append(make_prob(
        "ransom-note", "Ransom Note", "Easy", "Hashing", "HashMap",
        "Check if ransomNote can be constructed by using the letters from magazine.",
        "Given two strings <code>ransomNote</code> and <code>magazine</code>, return <code>true</code> if <code>ransomNote</code> can be constructed by using the letters from <code>magazine</code> and <code>false</code> otherwise. Each letter in <code>magazine</code> can only be used once in <code>ransomNote</code>.",
        "Two strings <code>ransomNote</code> and <code>magazine</code>.", "Boolean <code>true</code> if constructible.",
        ["1 <= ransomNote.length, magazine.length <= 10^5", "ransomNote and magazine consist of lowercase English letters."],
        "ransomNote = 'a', magazine = 'b'", "false", "'b' does not contain 'a'.",
        "ransomNote = 'aa', magazine = 'aab'", "true", "'aab' contains two 'a's.",
        "Count the available character counts in magazine.",
        "An int[26] array or HashMap can track available character counts.",
        "Iterate through ransomNote. For each character, decrement its count. If the count drops below 0, return false.",
        "boolean canConstruct(String ransomNote, String magazine)", "false", "59.3%", 21200
    ))

    problems.append(make_prob(
        "isomorphic-strings", "Isomorphic Strings", "Easy", "Hashing", "HashMap",
        "Determine if two strings are isomorphic (characters in s can be replaced to get t).",
        "Given two strings <code>s</code> and <code>t</code>, determine if they are isomorphic. Two strings <code>s</code> and <code>t</code> are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.",
        "Two strings <code>s</code> and <code>t</code>.", "Boolean <code>true</code> if isomorphic.",
        ["1 <= s.length <= 5 * 10^4", "t.length == s.length", "s and t consist of any valid ASCII character."],
        "s = 'egg', t = 'add'", "true", "'e' maps to 'a' and 'g' maps to 'd'.",
        "s = 'foo', t = 'bar'", "false", "'o' cannot map to both 'a' and 'r'.",
        "You need a bijection: each character in s maps uniquely to one in t, and vice versa.",
        "Use two maps (or two int[256] arrays) to record last-seen positions or bidirectional mappings.",
        "For each index i, if mapS[s.charAt(i)] != mapT[t.charAt(i)], return false. Then update both to i + 1.",
        "boolean isIsomorphic(String s, String t)", "false", "44.6%", 18300
    ))

    problems.append(make_prob(
        "word-pattern", "Word Pattern", "Easy", "Hashing", "HashMap",
        "Determine if a string s follows the pattern defined by characters.",
        "Given a <code>pattern</code> and a string <code>s</code>, find if <code>s</code> follows the same pattern. Here follow means a full match, such that there is a bijection between a letter in <code>pattern</code> and a non-empty word in <code>s</code>.",
        "A string <code>pattern</code> and a string <code>s</code>.", "Boolean <code>true</code> if s follows pattern.",
        ["1 <= pattern.length <= 300", "1 <= s.length <= 3000", "pattern contains only lowercase letters, s contains lowercase letters and spaces."],
        "pattern = 'abba', s = 'dog cat cat dog'", "true", "'a' -> 'dog', 'b' -> 'cat'.",
        "pattern = 'abba', s = 'dog cat cat fish'", "false", "'a' cannot map to both 'dog' and 'fish'.",
        "Split s into an array of words using space as delimiter. If words.length != pattern.length(), return false.",
        "Use two HashMaps or a single map with unique values to check bijection between pattern character and word.",
        "Map char -> word and word -> char. If an existing mapping conflicts with the current pair, return false immediately.",
        "boolean wordPattern(String pattern, String s)", "false", "41.7%", 15100
    ))

    # Pattern: HashSet
    problems.append(make_prob(
        "contains-duplicate", "Contains Duplicate", "Easy", "Hashing", "HashSet",
        "Return true if any value appears at least twice in the array.",
        "Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice in the array, and return <code>false</code> if every element is distinct.",
        "An integer array <code>nums</code>.", "Boolean <code>true</code> if duplicate exists.",
        ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        "nums = [1,2,3,1]", "true", "1 appears at index 0 and index 3.",
        "nums = [1,2,3,4]", "false", "All elements are distinct.",
        "A hash set stores unique elements and provides O(1) average lookup time.",
        "Iterate through nums. For each element, attempt to add it to a HashSet.",
        "If set.add(num) returns false, the element was already present—return true! If loop finishes, return false.",
        "boolean containsDuplicate(int[] nums)", "false", "61.5%", 32000
    ))

    problems.append(make_prob(
        "longest-consecutive-sequence", "Longest Consecutive Sequence", "Medium", "Hashing", "HashSet",
        "Find the length of the longest consecutive elements sequence in O(n) time.",
        "Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in <code>O(n)</code> time.",
        "An integer array <code>nums</code>.", "Length of the longest consecutive sequence.",
        ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        "nums = [100,4,200,1,3,2]", "4", "The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4.",
        "nums = [0,3,7,2,5,8,4,6,0,1]", "9", "Sequence [0, 1, 2, 3, 4, 5, 6, 7, 8] has length 9.",
        "Insert all numbers into a HashSet for O(1) lookup.",
        "A number x is the start of a sequence only if x - 1 is NOT in the set.",
        "For each num in the set, if !set.contains(num - 1), count how many consecutive numbers exist: num + 1, num + 2... Track max sequence length.",
        "int longestConsecutive(int[] nums)", "0", "47.3%", 17600
    ))

    # Pattern: Frequency Maps
    problems.append(make_prob(
        "top-k-frequent-elements", "Top K Frequent Elements", "Medium", "Hashing", "Frequency Maps",
        "Return the k most frequent elements in an integer array.",
        "Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements. You may return the answer in any order.",
        "An integer array <code>nums</code> and integer <code>k</code>.", "An array of the k most frequent integers.",
        ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is in the range [1, the number of unique elements in the array]."],
        "nums = [1,1,1,2,2,3], k = 2", "[1,2]", "1 appears 3 times, 2 appears 2 times.",
        "nums = [1], k = 1", "[1]", "Single element.",
        "First, count frequencies of each element using a HashMap<Integer, Integer>.",
        "To achieve O(N) time without full sorting, use bucket sort where bucket[freq] holds all elements with that frequency.",
        "Iterate backwards from bucket[nums.length] down to 1, collecting elements until you have gathered k elements.",
        "int[] topKFrequent(int[] nums, int k)", "new int[]{}", "62.8%", 19100
    ))

    problems.append(make_prob(
        "sort-characters-by-frequency", "Sort Characters By Frequency", "Medium", "Hashing", "Frequency Maps",
        "Sort a string in decreasing order based on the frequency of the characters.",
        "Given a string <code>s</code>, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string. Return the sorted string. If there are multiple answers, return any of them.",
        "A string <code>s</code>.", "String sorted by character frequencies.",
        ["1 <= s.length <= 5 * 10^5", "s consists of uppercase and lowercase English letters and digits."],
        "s = 'tree'", "'eert'", "'e' appears twice, 'r' and 't' appear once. 'eetr' is also valid.",
        "s = 'cccaaa'", "'aaaccc'", "Both 'a' and 'c' appear 3 times. 'cccaaa' is also valid.",
        "Count the frequency of every character using a frequency map.",
        "Create an array of buckets where index i holds characters that appear with frequency i.",
        "Iterate buckets from high frequency to low frequency, appending each character count times to a StringBuilder.",
        "String frequencySort(String s)", "s", "70.2%", 12400
    ))

    # Pattern: Duplicate Detection
    problems.append(make_prob(
        "find-duplicate-number", "Find the Duplicate Number", "Medium", "Hashing", "Duplicate Detection",
        "Find the duplicate integer in an array containing n + 1 integers where each is between 1 and n.",
        "Given an array of integers <code>nums</code> containing <code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive. There is only one repeated number in <code>nums</code>, return this repeated number. You must solve the problem without modifying the array <code>nums</code> and uses only constant extra space.",
        "An integer array <code>nums</code>.", "The duplicate integer.",
        ["1 <= n <= 10^5", "nums.length == n + 1", "1 <= nums[i] <= n", "All integers in nums appear only once except for precisely one integer which appears two or more times."],
        "nums = [1,3,4,2,2]", "2", "2 is the repeated number.",
        "nums = [3,1,3,4,2]", "3", "3 is the repeated number.",
        "Think of the array as a linked list where nums[i] points to index nums[i].",
        "Because there is a duplicate number, multiple indices point to the same node, creating a cycle!",
        "Use Floyd's Tortoise and Hare algorithm. Move slow by 1 step (slow = nums[slow]) and fast by 2 steps (fast = nums[nums[fast]]). Once they meet, reset slow to 0 and move both by 1 step until they meet at the cycle entrance.",
        "int findDuplicate(int[] nums)", "0", "59.1%", 18300
    ))

    problems.append(make_prob(
        "contains-duplicate-ii", "Contains Duplicate II", "Easy", "Hashing", "Duplicate Detection",
        "Check if two duplicate values exist within index distance k.",
        "Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> if there are two distinct indices <code>i</code> and <code>j</code> in the array such that <code>nums[i] == nums[j]</code> and <code>abs(i - j) <= k</code>.",
        "An integer array <code>nums</code> and integer <code>k</code>.", "Boolean <code>true</code> if duplicate within distance k.",
        ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "0 <= k <= 10^5"],
        "nums = [1,2,3,1], k = 3", "true", "nums[0] == nums[3] and abs(0 - 3) = 3 <= 3.",
        "nums = [1,2,3,1,2,3], k = 2", "false", "Duplicate indices differ by 3 > 2.",
        "You only need to track the elements within a sliding window of size k.",
        "Maintain a HashSet of size at most k.",
        "For each i, if set.contains(nums[i]), return true. Add nums[i]. If set.size() > k, remove nums[i - k].",
        "boolean containsNearbyDuplicate(int[] nums, int k)", "false", "44.1%", 16200
    ))

    # Pattern: Pair and Complement Lookup
    problems.append(make_prob(
        "two-sum-ii-input-array-is-sorted", "Two Sum II - Input Array Is Sorted", "Medium", "Hashing", "Pair and Complement Lookup",
        "Find two numbers in a 1-indexed sorted array that add up to target.",
        "Given a 1-indexed array of integers <code>numbers</code> that is already sorted in non-decreasing order, find two numbers such that they add up to a specific <code>target</code> number. Return the indices of the two numbers, <code>index1</code> and <code>index2</code>, added by one as an integer array <code>[index1, index2]</code> of length 2.",
        "A 1-indexed sorted array <code>numbers</code> and integer <code>target</code>.", "Integer array [index1, index2] with 1-based indexing.",
        ["2 <= numbers.length <= 3 * 10^4", "-1000 <= numbers[i] <= 1000", "numbers is sorted in non-decreasing order."],
        "numbers = [2,7,11,15], target = 9", "[1,2]", "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].",
        "numbers = [2,3,4], target = 6", "[1,3]", "The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3.",
        "Because the array is already sorted, two pointers at the ends can converge in O(1) space.",
        "Let left = 0 and right = n - 1. Calculate sum = numbers[left] + numbers[right].",
        "If sum == target, return new int[]{left + 1, right + 1}. If sum < target, left++; if sum > target, right--.",
        "int[] twoSum(int[] numbers, int target)", "new int[]{}", "60.5%", 23400
    ))

    problems.append(make_prob(
        "four-sum", "4Sum", "Medium", "Hashing", "Pair and Complement Lookup",
        "Find all unique quadruplets in the array which sum to target.",
        "Given an array <code>nums</code> of <code>n</code> integers, return an array of all the unique quadruplets <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that <code>a, b, c, and d</code> are distinct and <code>nums[a] + nums[b] + nums[c] + nums[d] == target</code>. You may return the answer in any order.",
        "An integer array <code>nums</code> and integer <code>target</code>.", "List of unique quadruplets.",
        ["1 <= nums.length <= 200", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
        "nums = [1,0,-1,0,-2,2], target = 0", "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]", "Unique quadruplets that sum to 0.",
        "nums = [2,2,2,2,2], target = 8", "[[2,2,2,2]]", "One unique quadruplet summing to 8.",
        "Sort the array first to handle duplicate skipping easily.",
        "Use two nested loops for the first two elements (i and j), then use two pointers (left and right) for the remaining two elements.",
        "Watch out for 32-bit integer overflow when summing 4 numbers—cast sum to long.",
        "java.util.List<java.util.List<Integer>> fourSum(int[] nums, int target)", "new java.util.ArrayList<>()", "35.8%", 11900
    ))

    return problems

