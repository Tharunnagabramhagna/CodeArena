# strings.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: String Traversal
    problems.append(make_prob(
        "length-of-last-word", "Length of Last Word", "Easy", "Strings", "String Traversal",
        "Return the length of the last word in the string consisting of non-space characters.",
        "Given a string <code>s</code> consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.",
        "A string <code>s</code>.", "Length of the last word.",
        ["1 <= s.length <= 10^4", "s consists of only English letters and spaces ' '."],
        "s = 'Hello World'", "5", "The last word is 'World' with length 5.",
        "s = '   fly me   to   the moon  '", "4", "The last word is 'moon' with length 4.",
        "Traversing from the back (end of string) is much faster than starting from the beginning.",
        "First, skip any trailing space characters by decrementing your pointer.",
        "Once you hit the first non-space character, count characters until you encounter the next space or the start of the string.",
        "int lengthOfLastWord(String s)", "0", "48.2%", 24500
    ))

    problems.append(make_prob(
        "defanging-ip-address", "Defanging an IP Address", "Easy", "Strings", "String Traversal",
        "Replace every period in an IPv4 IP address with [.]",
        "Given a valid (IPv4) IP <code>address</code>, return a defanged version of that IP address. A defanged IP address replaces every period <code>'.'</code> with <code>'[.]'</code>.",
        "A valid IPv4 <code>address</code> string.", "The defanged IP address string.",
        ["The given address is a valid IPv4 address."],
        "address = '1.1.1.1'", "'1[.]1[.]1[.]1'", "Each '.' is replaced by '[.]'.",
        "address = '255.100.50.0'", "'255[.]100[.]50[.]0'", "Each '.' is replaced by '[.]'.",
        "You can construct the result by iterating through characters in the input string.",
        "A StringBuilder allows building the new string in O(N) time without allocating multiple intermediate String objects.",
        "For each character ch, if ch == '.', append '[.]'; otherwise append ch.",
        "String defangIPaddr(String address)", "address", "88.9%", 19200
    ))

    # Pattern: Two Pointers
    problems.append(make_prob(
        "reverse-a-string", "Reverse a String", "Easy", "Strings", "Two Pointers",
        "Reverse the given character array in-place.",
        "Write a function that reverses a character array <code>s</code> in-place. You must modify the input array directly with <code>O(1)</code> extra memory without allocating a new array.",
        "A character array <code>s</code>.", "None (modify <code>s</code> in-place).",
        ["1 <= s.length <= 10^5", "s[i] is a printable ASCII character."],
        "s = ['h','e','l','l','o']", "['o','l','l','e','h']", "The reversed array has elements in reverse order.",
        "s = ['H','a','n','n','a','h']", "['h','a','n','n','a','H']", "In-place swap produces reversed string.",
        "Use two pointers, one starting at the beginning (0) and one at the end (length - 1).",
        "Swap characters at the left and right pointers, then move both pointers towards the center.",
        "Continue the while loop while left < right. Use a temporary char variable for the swap.",
        "void reverseString(char[] s)", "", "76.8%", 25400
    ))

    problems.append(make_prob(
        "valid-palindrome", "Valid Palindrome", "Easy", "Strings", "Two Pointers",
        "Check if a string is a palindrome after converting all uppercase letters to lowercase and removing non-alphanumeric characters.",
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.",
        "A string <code>s</code>.", "Boolean <code>true</code> if palindrome, <code>false</code> otherwise.",
        ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
        "s = 'A man, a plan, a canal: Panama'", "true", "'amanaplanacanalpanama' is a palindrome.",
        "s = 'race a car'", "false", "'raceacar' is not a palindrome.",
        "Two pointers converging from both ends allow in-place verification without extra memory.",
        "Use Character.isLetterOrDigit(ch) to skip non-alphanumeric characters on both left and right sides.",
        "Compare Character.toLowerCase(s.charAt(left)) with Character.toLowerCase(s.charAt(right)). If they differ, return false immediately.",
        "boolean isPalindrome(String s)", "false", "45.8%", 27800
    ))

    problems.append(make_prob(
        "reverse-vowels-of-a-string", "Reverse Vowels of a String", "Easy", "Strings", "Two Pointers",
        "Reverse only the vowels in a given string and return it.",
        "Given a string <code>s</code>, reverse only all the vowels in the string and return it. The vowels are <code>'a'</code>, <code>'e'</code>, <code>'i'</code>, <code>'o'</code>, and <code>'u'</code>, and they can appear in both lower and upper cases, more than once.",
        "A string <code>s</code>.", "String with vowels reversed.",
        ["1 <= s.length <= 3 * 10^5", "s consists of printable ASCII characters."],
        "s = 'IceCreAm'", "'AceCreIm'", "The vowels are ['I', 'e', 'e', 'A']. Reversing them gives ['A', 'e', 'e', 'I'].",
        "s = 'leetcode'", "'leotcede'", "The vowels ['e', 'e', 'o', 'e'] reversed produce 'leotcede'.",
        "Convert string to a char array so you can perform in-place swaps.",
        "Use two pointers left and right. Advance left until it points to a vowel, and decrement right until it points to a vowel.",
        "When both point to vowels, swap their characters, increment left, decrement right, and continue while left < right.",
        "String reverseVowels(String s)", "s", "52.4%", 16100
    ))

    # Pattern: Sliding Window
    problems.append(make_prob(
        "longest-substring", "Longest Substring Without Repeating Characters", "Medium", "Strings", "Sliding Window",
        "Find the length of the longest substring without repeating characters.",
        "Given a string <code>s</code>, find the length of the longest substring without duplicate characters.",
        "A string <code>s</code>.", "The maximum length of a substring without repeating characters.",
        ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
        "s = 'abcabcbb'", "3", "The answer is 'abc', with the length of 3.",
        "s = 'bbbbb'", "1", "The answer is 'b', with the length of 1.",
        "Think of a sliding window [left, right] where all characters inside the window are guaranteed to be unique.",
        "A hash map or array can store the most recent index where each character appeared.",
        "When right encounters a character already seen at index lastIdx >= left, jump left to lastIdx + 1. Update maxLen = max(maxLen, right - left + 1).",
        "int lengthOfLongestSubstring(String s)", "0", "34.5%", 31200
    ))

    problems.append(make_prob(
        "permutation-in-string", "Permutation in String", "Medium", "Strings", "Sliding Window",
        "Check if s2 contains a permutation of s1.",
        "Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code> if <code>s2</code> contains a permutation of <code>s1</code>, or <code>false</code> otherwise. In other words, return <code>true</code> if one of <code>s1</code>'s permutations is the substring of <code>s2</code>.",
        "Two strings <code>s1</code> and <code>s2</code>.", "Boolean <code>true</code> if permutation found.",
        ["1 <= s1.length, s2.length <= 10^4", "s1 and s2 consist of lowercase English letters."],
        "s1 = 'ab', s2 = 'eidbaooo'", "true", "s2 contains one permutation of s1 ('ba').",
        "s1 = 'ab', s2 = 'eidboaoo'", "false", "Neither 'ab' nor 'ba' exists as a contiguous substring.",
        "A permutation has the exact same character frequencies as s1.",
        "Use a fixed-size sliding window of length s1.length() over string s2.",
        "Count character frequencies in s1 and in the current window of s2 using int[26]. If arrays match, return true. Update counts as window slides.",
        "boolean checkInclusion(String s1, String s2)", "false", "44.3%", 14900
    ))

    problems.append(make_prob(
        "minimum-window-substring", "Minimum Window Substring", "Hard", "Strings", "Sliding Window",
        "Find the minimum window substring of s that contains all characters in t.",
        "Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If there is no such substring, return the empty string <code>''</code>.",
        "Two strings <code>s</code> and <code>t</code>.", "Minimum window substring.",
        ["m == s.length", "n == t.length", "1 <= m, n <= 10^5", "s and t consist of uppercase and lowercase English letters."],
        "s = 'ADOBECODEBANC', t = 'ABC'", "'BANC'", "The minimum window substring 'BANC' includes 'A', 'B', and 'C' from string t.",
        "s = 'a', t = 'a'", "'a'", "The entire string s is the minimum window.",
        "Track the character requirements of t using a frequency map.",
        "Expand the right pointer to include characters until all requirements of t are satisfied (valid window).",
        "Once valid, shrink from left as much as possible while maintaining validity, updating minWindow. Repeat until right reaches end.",
        "String minWindow(String s, String t)", "''", "41.6%", 11200
    ))

    # Pattern: String Matching
    problems.append(make_prob(
        "find-index-of-first-occurrence", "Find Index of First Occurrence in a String", "Easy", "Strings", "String Matching",
        "Find the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
        "Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.",
        "Two strings <code>haystack</code> and <code>needle</code>.", "0-based index or -1.",
        ["1 <= haystack.length, needle.length <= 10^4", "haystack and needle consist of only lowercase English characters."],
        "haystack = 'sadbutsad', needle = 'sad'", "0", "'sad' occurs at index 0 and 6. The first occurrence is at index 0.",
        "haystack = 'leetcode', needle = 'leeto'", "-1", "'leeto' did not occur in 'leetcode'.",
        "Check every possible starting position i in haystack where needle could fit.",
        "For each position i from 0 up to haystack.length() - needle.length(), compare characters.",
        "If needle matches characters starting at i, return i. If loop completes with no match, return -1. (KMP can optimize to O(N)).",
        "int strStr(String haystack, String needle)", "-1", "40.2%", 21800
    ))

    problems.append(make_prob(
        "repeated-dna-sequences", "Repeated DNA Sequences", "Medium", "Strings", "String Matching",
        "Find all 10-letter-long sequences that occur more than once in a DNA molecule.",
        "The DNA sequence is composed of a series of nucleotides abbreviated as <code>'A'</code>, <code>'C'</code>, <code>'G'</code>, and <code>'T'</code>. When studying DNA, it is useful to identify repeated sequences within the DNA. Given a string <code>s</code> that represents a DNA sequence, return all the <code>10</code>-letter-long sequences (substrings) that occur more than once in a DNA molecule.",
        "A DNA string <code>s</code>.", "List of 10-letter substrings occurring more than once.",
        ["1 <= s.length <= 10^5", "s[i] is either 'A', 'C', 'G', or 'T'."],
        "s = 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT'", "['AAAAACCCCC','CCCCCAAAAA']", "Both sequences appear more than once.",
        "s = 'AAAAAAAAAAAAA'", "['AAAAAAAAAA']", "'AAAAAAAAAA' appears 4 times.",
        "Every target sequence has a fixed length of exactly 10 characters.",
        "Maintain a HashSet of seen 10-letter substrings, and a second HashSet of repeated substrings.",
        "Iterate i from 0 to s.length() - 10. Extract sub = s.substring(i, i + 10). If !seen.add(sub), repeated.add(sub). Return new ArrayList<>(repeated).",
        "java.util.List<String> findRepeatedDnaSequences(String s)", "new java.util.ArrayList<>()", "47.8%", 9700
    ))

    # Pattern: Palindrome Patterns
    problems.append(make_prob(
        "palindrome-number", "Palindrome Number", "Easy", "Strings", "Palindrome Patterns",
        "Determine whether an integer is a palindrome without converting to string.",
        "Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise. An integer is a palindrome when it reads the same forward and backward.",
        "An integer <code>x</code>.", "Boolean <code>true</code> if palindrome, <code>false</code> otherwise.",
        ["-2^31 <= x <= 2^31 - 1"],
        "x = 121", "true", "121 reads as 121 from left to right and from right to left.",
        "x = -121", "false", "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
        "Negative numbers cannot be palindromes because of the minus sign.",
        "Also, numbers ending in 0 (except 0 itself) cannot be palindromes.",
        "Revert half of the number by extracting digits: reverted = reverted * 10 + x % 10; x /= 10. Stop when x <= reverted. Return x == reverted || x == reverted / 10.",
        "boolean isPalindrome(int x)", "false", "54.1%", 29400
    ))

    problems.append(make_prob(
        "longest-palindromic-substring", "Longest Palindromic Substring", "Medium", "Strings", "Palindrome Patterns",
        "Find the longest palindromic substring in s.",
        "Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>.",
        "A string <code>s</code>.", "The longest palindromic substring.",
        ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
        "s = 'babad'", "'bab'", "'aba' is also a valid answer.",
        "s = 'cbbd'", "'bb'", "The longest palindrome is 'bb'.",
        "A palindrome mirrors around its center. A string has 2n - 1 possible centers (single characters or pairs).",
        "For each index i, expand outwards for both odd-length (center i) and even-length (center i, i + 1) palindromes.",
        "Write a helper expand(s, left, right) that increments while bounds match and characters are equal. Track the longest window found.",
        "String longestPalindrome(String s)", "s", "33.2%", 18300
    ))

    problems.append(make_prob(
        "palindromic-substrings", "Palindromic Substrings", "Medium", "Strings", "Palindrome Patterns",
        "Count how many palindromic substrings are in the string.",
        "Given a string <code>s</code>, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string.",
        "A string <code>s</code>.", "Count of palindromic substrings.",
        ["1 <= s.length <= 1000", "s consists of lowercase English letters."],
        "s = 'abc'", "3", "Three palindromic strings: 'a', 'b', 'c'.",
        "s = 'aaa'", "6", "Six palindromic strings: 'a', 'a', 'a', 'aa', 'aa', 'aaa'.",
        "Every single character is a palindrome of length 1.",
        "Expand around each possible center. There are 2n - 1 centers (n odd centers and n - 1 even centers).",
        "For each center, expand outward as long as s.charAt(left) == s.charAt(right), incrementing total count and moving pointers.",
        "int countSubstrings(String s)", "0", "67.8%", 13400
    ))

    # Pattern: Character Frequency
    problems.append(make_prob(
        "valid-anagram", "Valid Anagram", "Easy", "Strings", "Character Frequency",
        "Determine if t is an anagram of s.",
        "Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        "Two strings <code>s</code> and <code>t</code>.", "Boolean <code>true</code> if anagram.",
        ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
        "s = 'anagram', t = 'nagaram'", "true", "Both strings have the same character counts.",
        "s = 'rat', t = 'car'", "false", "Characters do not match in frequency.",
        "If lengths differ, they cannot be anagrams.",
        "An integer array count of size 26 can tally character frequencies in O(N) time and O(1) space.",
        "Increment count for each char in s, decrement for each char in t. At the end, every entry in count must be 0.",
        "boolean isAnagram(String s, String t)", "false", "63.7%", 26100
    ))

    problems.append(make_prob(
        "first-unique-character-in-string", "First Unique Character in a String", "Easy", "Strings", "Character Frequency",
        "Find the first non-repeating character in a string and return its index.",
        "Given a string <code>s</code>, find the first non-repeating character in it and return its index. If it does not exist, return <code>-1</code>.",
        "A string <code>s</code>.", "Index of first unique character or -1.",
        ["1 <= s.length <= 10^5", "s consists of only lowercase English letters."],
        "s = 'leetcode'", "0", "The character 'l' at index 0 is the first character that does not occur at any other index.",
        "s = 'loveleetcode'", "2", "The character 'v' at index 2 is the first unique character.",
        "Use a two-pass approach.",
        "In the first pass, count the frequency of each character using an int[26] array.",
        "In the second pass, iterate through the string from index 0 to length - 1. Return the first index where count[s.charAt(i) - 'a'] == 1.",
        "int firstUniqChar(String s)", "-1", "60.4%", 22900
    ))

    problems.append(make_prob(
        "group-anagrams", "Group Anagrams", "Medium", "Strings", "Character Frequency",
        "Group an array of strings into anagram groups.",
        "Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order.",
        "An array of strings <code>strs</code>.", "List of grouped anagram string lists.",
        ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
        "strs = ['eat','tea','tan','ate','nat','bat']", "[['bat'],['nat','tan'],['ate','eat','tea']]", "Grouped anagrams together.",
        "strs = ['']", "[['']]", "Single empty string.",
        "Two strings are anagrams if and only if their sorted versions are identical, or their character frequency counts are identical.",
        "Use a HashMap<String, List<String>> where the key is the sorted character array (or frequency tuple).",
        "For each string, sort its chars to produce the key: char[] ca = s.toCharArray(); Arrays.sort(ca); String key = new String(ca); map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);",
        "java.util.List<java.util.List<String>> groupAnagrams(String[] strs)", "new java.util.ArrayList<>()", "67.1%", 19800
    ))

    # Pattern: String Manipulation
    problems.append(make_prob(
        "string-to-integer-atoi", "String to Integer (atoi)", "Medium", "Strings", "String Manipulation",
        "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
        "Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer. Read in and ignore any leading whitespace. Check if the next character is '-' or '+'. Read in next characters until the next non-digit character or end of input. Clamp to [-2^31, 2^31 - 1] if overflow occurs.",
        "A string <code>s</code>.", "Parsed 32-bit signed integer.",
        ["0 <= s.length <= 200", "s consists of English letters, digits, ' ', '+', '-', and '.'."],
        "s = '42'", "42", "Leading digits form 42.",
        "s = '   -042'", "-42", "Leading whitespace ignored, '-' read, produces -42.",
        "Break the problem down into sequential steps: whitespace, sign, digits, overflow check.",
        "Use an int pointer i. Advance past spaces. Record sign if '+' or '-'.",
        "While s.charAt(i) is a digit, check for integer overflow before multiplying: if (res > Integer.MAX_VALUE / 10 || (res == Integer.MAX_VALUE / 10 && digit > 7)) return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE.",
        "int myAtoi(String s)", "0", "16.8%", 14200
    ))

    problems.append(make_prob(
        "longest-common-prefix", "Longest Common Prefix", "Easy", "Strings", "String Manipulation",
        "Find the longest common prefix string amongst an array of strings.",
        "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string <code>''</code>.",
        "An array of strings <code>strs</code>.", "Longest common prefix string.",
        ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."],
        "strs = ['flower','flow','flight']", "'fl'", "'fl' is the common prefix of all three words.",
        "strs = ['dog','racecar','car']", "''", "There is no common prefix among the input strings.",
        "Take the first string as the initial prefix.",
        "Iterate through the remaining strings. While strs[i].indexOf(prefix) != 0, shorten prefix by removing its last character.",
        "If prefix becomes empty, return '' immediately. After checking all strings, return the remaining prefix.",
        "String longestCommonPrefix(String[] strs)", "''", "41.8%", 27200
    ))

    return problems

