# linked_lists.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: Reversal
    problems.append(make_prob(
        "reverse-linked-list", "Reverse Linked List", "Easy", "Linked Lists", "Reversal",
        "Reverse a singly linked list and return the reversed list.",
        "Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.",
        "The head node of a singly linked list.", "The head node of the reversed linked list.",
        ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
        "head = [1,2,3,4,5]", "[5,4,3,2,1]", "All node links are reversed.",
        "head = [1,2]", "[2,1]", "Two nodes reversed.",
        "Think about re-pointing each node's next pointer to its predecessor.",
        "Maintain three pointers: prev (initially null), curr (initially head), and nextTemp.",
        "Iterate while curr != null: save nextTemp = curr.next, set curr.next = prev, advance prev = curr, and curr = nextTemp. Return prev.",
        "ListNode reverseList(ListNode head)", "null", "74.1%", 31200
    ))

    problems.append(make_prob(
        "reverse-linked-list-ii", "Reverse Linked List II", "Medium", "Linked Lists", "Reversal",
        "Reverse the nodes of the list from position left to position right.",
        "Given the <code>head</code> of a singly linked list and two integers <code>left</code> and <code>right</code> where <code>left <= right</code>, reverse the nodes of the list from position <code>left</code> to position <code>right</code>, and return the reversed list.",
        "Head node of linked list and 1-based bounds <code>left, right</code>.", "Head node of modified linked list.",
        ["The number of nodes in the list is n.", "1 <= n <= 500", "-500 <= Node.val <= 500", "1 <= left <= right <= n"],
        "head = [1,2,3,4,5], left = 2, right = 4", "[1,4,3,2,5]", "Nodes from position 2 to 4 are reversed.",
        "head = [5], left = 1, right = 1", "[5]", "Single element reversed remains unchanged.",
        "Use a dummy head node to simplify operations when left == 1.",
        "Advance a pointer prev to the node just before position left.",
        "Perform right - left in-place node shifts: curr = prev.next; move curr.next to the front of the reversed sublist.",
        "ListNode reverseBetween(ListNode head, int left, int right)", "head", "46.2%", 14200
    ))

    problems.append(make_prob(
        "reverse-nodes-in-k-group", "Reverse Nodes in k-Group", "Hard", "Linked Lists", "Reversal",
        "Reverse the nodes of a linked list k at a time and return its modified list.",
        "Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return the modified list. <code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then left-out nodes, in the end, should remain as it is.",
        "Head of list and integer <code>k</code>.", "Modified linked list head.",
        ["The number of nodes in the list is n.", "1 <= k <= n <= 5000", "0 <= Node.val <= 1000"],
        "head = [1,2,3,4,5], k = 2", "[2,1,4,3,5]", "Nodes reversed in groups of 2.",
        "head = [1,2,3,4,5], k = 3", "[3,2,1,4,5]", "First 3 nodes reversed, last 2 remain intact.",
        "First check if there are at least k nodes remaining in the current group before reversing.",
        "If k nodes exist, reverse the group using standard iterative reversal.",
        "Connect the previous group's tail to the newly reversed group's head, and recursively or iteratively process subsequent groups.",
        "ListNode reverseKGroup(ListNode head, int k)", "head", "56.4%", 9800
    ))

    # Pattern: Fast and Slow Pointers
    problems.append(make_prob(
        "linked-list-cycle", "Linked List Cycle", "Easy", "Linked Lists", "Fast and Slow Pointers",
        "Determine if the linked list has a cycle in it.",
        "Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Return <code>true</code> if there is a cycle in the linked list. Otherwise, return <code>false</code>.",
        "The head of a singly linked list.", "Boolean <code>true</code> if a cycle exists, <code>false</code> otherwise.",
        ["The number of the nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5"],
        "head = [3,2,0,-4], pos = 1", "true", "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
        "head = [1,2], pos = 0", "true", "There is a cycle in the linked list, where the tail connects to the 0th node.",
        "Think about two runners on a circular track running at different speeds.",
        "Initialize slow = head and fast = head. Advance slow by 1 step (slow = slow.next) and fast by 2 steps (fast = fast.next.next).",
        "If there is a cycle, fast will eventually catch up to slow (slow == fast). If fast reaches null, there is no cycle.",
        "boolean hasCycle(ListNode head)", "false", "48.7%", 24300
    ))

    problems.append(make_prob(
        "middle-of-the-linked-list", "Middle of the Linked List", "Easy", "Linked Lists", "Fast and Slow Pointers",
        "Return the middle node of the linked list. If two middle nodes, return the second.",
        "Given the <code>head</code> of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
        "Head of a linked list.", "The middle ListNode.",
        ["The number of nodes in the list is in the range [1, 100].", "1 <= Node.val <= 100"],
        "head = [1,2,3,4,5]", "[3,4,5]", "The middle node of the list is node 3.",
        "head = [1,2,3,4,5,6]", "[4,5,6]", "Since the list has two middle nodes with values 3 and 4, we return the second one.",
        "Use two pointers moving at different speeds.",
        "Advance slow by 1 step and fast by 2 steps in each iteration.",
        "When fast reaches the end (fast == null or fast.next == null), slow will be exactly at the middle node.",
        "ListNode middleNode(ListNode head)", "null", "77.2%", 27100
    ))

    problems.append(make_prob(
        "find-middle-node", "Palindrome Linked List", "Easy", "Linked Lists", "Fast and Slow Pointers",
        "Check if a singly linked list is a palindrome in O(n) time and O(1) space.",
        "Given the <code>head</code> of a singly linked list, return <code>true</code> if it is a palindrome or <code>false</code> otherwise.",
        "Head of a linked list.", "Boolean <code>true</code> if palindrome.",
        ["The number of nodes in the list is in the range [1, 10^5].", "0 <= Node.val <= 9"],
        "head = [1,2,2,1]", "true", "The list reads the same forward and backward.",
        "head = [1,2]", "false", "Not a palindrome.",
        "Combine fast/slow pointers to find the middle, then reverse the second half of the list.",
        "Use slow and fast to reach middle. Reverse list starting from slow.next.",
        "Compare values node-by-node from the front (head) and reversed half. If all match, it is a palindrome.",
        "boolean isPalindrome(ListNode head)", "false", "50.9%", 21400
    ))

    # Pattern: Cycle Detection
    problems.append(make_prob(
        "linked-list-cycle-ii", "Linked List Cycle II", "Medium", "Linked Lists", "Cycle Detection",
        "Return the node where the cycle begins in a linked list, or null if no cycle.",
        "Given the <code>head</code> of a linked list, return the node where the cycle begins. If there is no cycle, return <code>null</code>. Do not modify the linked list.",
        "Head of a linked list.", "ListNode at the start of cycle or null.",
        ["The number of the nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5"],
        "head = [3,2,0,-4], pos = 1", "tail connects to node index 1", "There is a cycle in the linked list, where tail connects to the second node.",
        "head = [1], pos = -1", "no cycle", "There is no cycle in the linked list.",
        "Use Floyd's cycle detection algorithm to find the meeting point first.",
        "Mathematical property: distance from head to cycle entrance equals distance from meeting point to cycle entrance.",
        "Once slow and fast meet, reset slow to head. Advance both slow and fast by 1 step at a time. The node where they meet is the cycle start!",
        "ListNode detectCycle(ListNode head)", "null", "49.5%", 17200
    ))

    problems.append(make_prob(
        "happy-number", "Happy Number", "Easy", "Linked Lists", "Cycle Detection",
        "Determine if a number n is happy (sum of squares of digits reaches 1 without cycling).",
        "Write an algorithm to determine if a number <code>n</code> is happy. A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1, or it loops endlessly in a cycle which does not include 1.",
        "A positive integer <code>n</code>.", "Boolean <code>true</code> if happy, <code>false</code> otherwise.",
        ["1 <= n <= 2^31 - 1"],
        "n = 19", "true", "1^2 + 9^2 = 82 -> 8^2 + 2^2 = 68 -> 6^2 + 8^2 = 100 -> 1^2 + 0^2 + 0^2 = 1.",
        "n = 2", "false", "Enters an infinite cycle that does not include 1.",
        "The transitions between numbers form an implicit linked list.",
        "If a number loops, fast and slow pointers (or a HashSet) can detect the cycle.",
        "Let slow = n, fast = getNext(n). While fast != 1 and slow != fast: slow = getNext(slow), fast = getNext(getNext(fast)). Return fast == 1.",
        "boolean isHappy(int n)", "false", "55.8%", 20100
    ))

    # Pattern: Merging Lists
    problems.append(make_prob(
        "merge-two-sorted-lists", "Merge Two Sorted Lists", "Easy", "Linked Lists", "Merging Lists",
        "Merge two sorted linked lists and return it as a sorted list.",
        "You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
        "Heads of two sorted linked lists <code>list1</code> and <code>list2</code>.", "Head of the merged sorted linked list.",
        ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."],
        "list1 = [1,2,4], list2 = [1,3,4]", "[1,1,2,3,4,4]", "Merged list in sorted order.",
        "list1 = [], list2 = []", "[]", "Both empty lists.",
        "A dummy head node simplifies boundary cases when attaching the first node.",
        "Maintain a pointer curr starting at dummy. Compare list1.val and list2.val.",
        "Attach the smaller node to curr.next and advance that list's pointer and curr. When one list is exhausted, attach the remainder of the other list.",
        "ListNode mergeTwoLists(ListNode list1, ListNode list2)", "null", "63.2%", 33400
    ))

    problems.append(make_prob(
        "merge-in-between-linked-lists", "Merge In Between Linked Lists", "Medium", "Linked Lists", "Merging Lists",
        "Remove nodes from index a to b in list1, and put list2 in their place.",
        "You are given two linked lists: <code>list1</code> and <code>list2</code> of sizes <code>n</code> and <code>m</code> respectively. Remove <code>list1</code>'s nodes from the <code>a</code>-th node to the <code>b</code>-th node, and put <code>list2</code> in their place.",
        "Two linked lists <code>list1, list2</code> and integers <code>a, b</code>.", "Head of modified list1.",
        ["3 <= list1.length <= 10^4", "1 <= a <= b < list1.length - 1", "1 <= list2.length <= 10^4"],
        "list1 = [10,1,13,6,9,5], a = 3, b = 4, list2 = [1000000,1000001,1000002]", "[10,1,13,1000000,1000001,1000002,5]", "Nodes 3 and 4 (values 6 and 9) replaced by list2.",
        "list1 = [0,1,2,3,4,5,6], a = 2, b = 5, list2 = [100,101]", "[0,1,100,101,6]", "Sublist replaced.",
        "Find the node at position a - 1 (before deletion) and position b + 1 (after deletion).",
        "Find the tail node of list2.",
        "Set nodeBeforeA.next = list2, and tailOfList2.next = nodeAfterB. Return list1.",
        "ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2)", "list1", "76.4%", 10800
    ))

    # Pattern: Node Manipulation
    problems.append(make_prob(
        "remove-nth-node-from-end", "Remove Nth Node From End of List", "Medium", "Linked Lists", "Node Manipulation",
        "Remove the nth node from the end of the list and return its head.",
        "Given the <code>head</code> of a linked list, remove the <code>n</code>-th node from the end of the list and return its head.",
        "Head of linked list and integer <code>n</code>.", "Head of modified list.",
        ["The number of nodes in the list is sz.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
        "head = [1,2,3,4,5], n = 2", "[1,2,3,5]", "4 is the 2nd node from the end and is removed.",
        "head = [1], n = 1", "[]", "Removing only node returns empty list.",
        "Use two pointers with a gap of n nodes between them.",
        "Attach a dummy head before head to handle removing the first node cleanly.",
        "Advance fast pointer by n + 1 steps. Then move both fast and slow together until fast is null. slow.next will be pointing to the target: set slow.next = slow.next.next.",
        "ListNode removeNthFromEnd(ListNode head, int n)", "head", "42.9%", 22100
    ))

    problems.append(make_prob(
        "reorder-list", "Reorder List", "Medium", "Linked Lists", "Node Manipulation",
        "Reorder the list to be L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2...",
        "You are given the head of a singly linked-list. The list can be represented as: <code>L0 -> L1 -> ... -> Ln-1 -> Ln</code>. Reorder the list to be: <code>L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...</code>. You may not modify the values in the list's nodes. Only nodes themselves may be changed.",
        "Head of a linked list.", "None (modify list in-place).",
        ["The number of nodes in the list is in the range [1, 5 * 10^4].", "1 <= Node.val <= 1000"],
        "head = [1,2,3,4]", "[1,4,2,3]", "Nodes reordered from outer ends inward.",
        "head = [1,2,3,4,5]", "[1,5,2,4,3]", "Nodes reordered from outer ends inward.",
        "This problem combines three fundamental linked list operations: middle finding, reversal, and merging.",
        "1. Find middle of list using fast/slow pointers. 2. Reverse the second half of the list.",
        "3. Interleave/merge the first half and the reversed second half node-by-node.",
        "void reorderList(ListNode head)", "", "54.7%", 15900
    ))

    return problems

