# trees.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: Tree Traversals
    problems.append(make_prob(
        "invert-binary-tree", "Invert Binary Tree", "Easy", "Trees", "Tree Traversals",
        "Invert a binary tree by swapping left and right subtrees recursively.",
        "Given the <code>root</code> of a binary tree, invert the tree, and return its root. Inverting a tree means swapping every left child with its right child.",
        "The root TreeNode of a binary tree.", "The root TreeNode of the inverted binary tree.",
        ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
        "root = [4,2,7,1,3,6,9]", "[4,7,2,9,6,3,1]", "Left and right subtrees are inverted at every node level.",
        "root = [2,1,3]", "[2,3,1]", "Subtrees swapped.",
        "Inversion requires swapping the left and right child of every node.",
        "This can be done with a postorder or preorder traversal.",
        "Base case: if root == null, return null. Swap root.left and root.right. Then recursively call invertTree on both children. Return root.",
        "TreeNode invertTree(TreeNode root)", "null", "76.4%", 28100
    ))

    problems.append(make_prob(
        "binary-tree-inorder-traversal", "Binary Tree Inorder Traversal", "Easy", "Trees", "Tree Traversals",
        "Return the inorder traversal of its nodes' values.",
        "Given the <code>root</code> of a binary tree, return the inorder traversal of its nodes' values (Left -> Root -> Right).",
        "The root TreeNode of a binary tree.", "A list of integers in inorder sequence.",
        ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
        "root = [1,null,2,3]", "[1,3,2]", "Inorder visits left, then current, then right.",
        "root = []", "[]", "Empty tree.",
        "Inorder traversal visits nodes in the order: Left Subtree -> Current Node -> Right Subtree.",
        "Recursion is straightforward: traverse(node.left), list.add(node.val), traverse(node.right).",
        "Iterative solution uses an explicit Stack: push all left children to stack until null, pop, record value, and move to right child.",
        "java.util.List<Integer> inorderTraversal(TreeNode root)", "new java.util.ArrayList<>()", "75.1%", 29400
    ))

    problems.append(make_prob(
        "binary-tree-preorder-traversal", "Binary Tree Preorder Traversal", "Easy", "Trees", "Tree Traversals",
        "Return the preorder traversal of its nodes' values.",
        "Given the <code>root</code> of a binary tree, return the preorder traversal of its nodes' values (Root -> Left -> Right).",
        "Root TreeNode of a binary tree.", "List of integers in preorder sequence.",
        ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
        "root = [1,null,2,3]", "[1,2,3]", "Preorder visits root, then left, then right.",
        "root = [1]", "[1]", "Single node tree.",
        "Preorder visits: Current Node -> Left Subtree -> Right Subtree.",
        "For an iterative approach, use a Stack initialized with root.",
        "While stack is not empty: pop node, add node.val to result, push node.right (if not null), then push node.left (so left is processed first!).",
        "java.util.List<Integer> preorderTraversal(TreeNode root)", "new java.util.ArrayList<>()", "69.8%", 21200
    ))

    # Pattern: Binary Search Trees
    problems.append(make_prob(
        "validate-binary-search-tree", "Validate Binary Search Tree", "Medium", "Trees", "Binary Search Trees",
        "Determine if a binary tree is a valid binary search tree (BST).",
        "Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys strictly less than the node's key. The right subtree of a node contains only nodes with keys strictly greater than the node's key. Both the left and right subtrees must also be binary search trees.",
        "Root TreeNode of a binary tree.", "Boolean <code>true</code> if valid BST, <code>false</code> otherwise.",
        ["The number of nodes in the tree is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"],
        "root = [2,1,3]", "true", "Left child 1 < 2 < right child 3.",
        "root = [5,1,4,null,null,3,6]", "false", "The root node's value is 5 but its right child's value is 4.",
        "It is not enough that left < node < right; all nodes in the left subtree must be less than node.",
        "Pass a valid range (min, max) down the recursion tree. Use Long to avoid integer overflow.",
        "Helper: isValid(node, min, max): if node == null return true. If node.val <= min || node.val >= max return false. Return isValid(node.left, min, node.val) && isValid(node.right, node.val, max).",
        "boolean isValidBST(TreeNode root)", "false", "32.8%", 20100
    ))

    problems.append(make_prob(
        "kth-smallest-element-in-bst", "Kth Smallest Element in a BST", "Medium", "Trees", "Binary Search Trees",
        "Find the kth smallest value (1-indexed) in a binary search tree.",
        "Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return the <code>k</code>-th smallest value (1-indexed) of all the values of the nodes in the tree.",
        "Root of BST and integer <code>k</code>.", "The kth smallest value.",
        ["The number of nodes in the tree is n.", "1 <= k <= n <= 10^4", "0 <= Node.val <= 10^4"],
        "root = [3,1,4,null,2], k = 1", "1", "Inorder traversal is [1, 2, 3, 4], 1st smallest is 1.",
        "root = [5,3,6,2,4,null,null,1], k = 3", "3", "3rd smallest element is 3.",
        "An inorder traversal of a Binary Search Tree produces sorted values in strictly ascending order.",
        "Traverse inorder and stop as soon as you have visited k nodes.",
        "Use an iterative inorder traversal with a Stack. Each time you pop a node, decrement k. When k == 0, return the popped node's value.",
        "int kthSmallest(TreeNode root, int k)", "0", "71.9%", 18300
    ))

    problems.append(make_prob(
        "insert-into-binary-search-tree", "Insert into a Binary Search Tree", "Medium", "Trees", "Binary Search Trees",
        "Insert a new value into a BST and return the root of the modified BST.",
        "You are given the <code>root</code> node of a binary search tree (BST) and a <code>val</code> to insert into the tree. Return the root node of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.",
        "Root of BST and integer <code>val</code>.", "Root of modified BST.",
        ["The number of nodes in the tree will be in the range [0, 10^4].", "-10^8 <= Node.val <= 10^8", "val does not exist in original BST."],
        "root = [4,2,7,1,3], val = 5", "[4,2,7,1,3,5]", "5 is inserted as left child of 7.",
        "root = [40,20,60,10,30,50,70], val = 25", "[40,20,60,10,30,50,70,null,null,25]", "25 inserted.",
        "A leaf position always exists where the new value can be inserted validly.",
        "If root is null, return new TreeNode(val).",
        "If val < root.val, root.left = insertIntoBST(root.left, val). If val > root.val, root.right = insertIntoBST(root.right, val). Return root.",
        "TreeNode insertIntoBST(TreeNode root, int val)", "null", "73.9%", 14100
    ))

    # Pattern: Height and Depth
    problems.append(make_prob(
        "maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree", "Easy", "Trees", "Height and Depth",
        "Find the maximum depth (number of nodes along longest path from root to leaf).",
        "Given the <code>root</code> of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        "Root TreeNode of a binary tree.", "Maximum depth as an integer.",
        ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
        "root = [3,9,20,null,null,15,7]", "3", "Longest path is 3 -> 20 -> 15 (depth 3).",
        "root = [1,null,2]", "2", "Depth is 2.",
        "The depth of a tree is 1 + max(depth(left), depth(right)).",
        "Base case: if root == null, return 0.",
        "Recursive case: return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)).",
        "int maxDepth(TreeNode root)", "0", "74.8%", 31200
    ))

    problems.append(make_prob(
        "diameter-of-binary-tree", "Diameter of Binary Tree", "Easy", "Trees", "Height and Depth",
        "Return the length of the longest path between any two nodes in a tree.",
        "Given the <code>root</code> of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root. The length of a path between two nodes is represented by the number of edges between them.",
        "Root of binary tree.", "Integer diameter (number of edges).",
        ["The number of nodes in the tree is in the range [1, 10^4].", "-100 <= Node.val <= 100"],
        "root = [1,2,3,4,5]", "3", "Longest path is [4,2,1,3] or [5,2,1,3], which has length 3 edges.",
        "root = [1,2]", "1", "1 edge between 1 and 2.",
        "The longest path passing through any node is depth(leftSubtree) + depth(rightSubtree).",
        "Calculate the height of each node, and update a global maxDiameter at each step.",
        "Helper returns height: 1 + max(leftH, rightH). Before returning, update maxDiameter = Math.max(maxDiameter, leftH + rightH).",
        "int diameterOfBinaryTree(TreeNode root)", "0", "60.4%", 22300
    ))

    problems.append(make_prob(
        "balanced-binary-tree", "Balanced Binary Tree", "Easy", "Trees", "Height and Depth",
        "Determine if a binary tree is height-balanced.",
        "Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.",
        "Root of binary tree.", "Boolean <code>true</code> if balanced, <code>false</code> otherwise.",
        ["The number of nodes in the tree is in the range [0, 5000].", "-10^4 <= Node.val <= 10^4"],
        "root = [3,9,20,null,null,15,7]", "true", "Every subtree height differs by at most 1.",
        "root = [1,2,2,3,3,null,null,4,4]", "false", "Not height-balanced.",
        "A bottom-up recursion can compute height and check balance simultaneously in O(N) time.",
        "Return -1 from the helper if any subtree is unbalanced.",
        "In checkHeight(node): if left == -1 || right == -1 || abs(left - right) > 1 return -1. Otherwise return 1 + max(left, right). Tree is balanced if checkHeight(root) != -1.",
        "boolean isBalanced(TreeNode root)", "false", "51.2%", 18900
    ))

    # Pattern: Lowest Common Ancestor
    problems.append(make_prob(
        "lowest-common-ancestor-of-bst", "Lowest Common Ancestor of a BST", "Medium", "Trees", "Lowest Common Ancestor",
        "Find the lowest common ancestor (LCA) node of two given nodes in a BST.",
        "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. According to the definition of LCA on Wikipedia: 'The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).'",
        "Root of BST, and two target nodes <code>p</code> and <code>q</code>.", "TreeNode representing the LCA.",
        ["The number of nodes in the tree is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q", "p and q will exist in the BST."],
        "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", "6", "The LCA of nodes 2 and 8 is 6.",
        "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", "2", "The LCA of nodes 2 and 4 is 2 since a node can be descendant of itself.",
        "Use the BST ordering property: nodes smaller than current are on the left, nodes larger are on the right.",
        "If both p.val and q.val are smaller than curr.val, the LCA must be in the left subtree.",
        "If both are greater than curr.val, LCA is in the right subtree. If they split (one is smaller, one is larger) or one equals curr, curr IS the LCA!",
        "TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q)", "null", "63.8%", 20100
    ))

    problems.append(make_prob(
        "lowest-common-ancestor-of-binary-tree", "Lowest Common Ancestor of a Binary Tree", "Medium", "Trees", "Lowest Common Ancestor",
        "Find the lowest common ancestor of two nodes in a general binary tree.",
        "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes <code>p</code> and <code>q</code>.",
        "Root of binary tree, and nodes <code>p, q</code>.", "TreeNode representing the LCA.",
        ["The number of nodes in the tree is in the range [2, 10^5].", "-10^9 <= Node.val <= 10^9", "All Node.val are unique.", "p != q", "p and q exist in the tree."],
        "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1", "3", "LCA of 5 and 1 is 3.",
        "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4", "5", "LCA of 5 and 4 is 5.",
        "Since this is a general binary tree (not BST), search both subtrees recursively.",
        "Base case: if root == null || root == p || root == q, return root.",
        "Recurse left and right. If both left and right return non-null, root is the split point (LCA!). If only one is non-null, return that non-null child.",
        "TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q)", "null", "61.2%", 22800
    ))

    # Pattern: Level Order Traversal
    problems.append(make_prob(
        "binary-tree-level-order-traversal", "Binary Tree Level Order Traversal", "Medium", "Trees", "Level Order Traversal",
        "Return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
        "Given the <code>root</code> of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
        "Root TreeNode of a binary tree.", "List of lists of integers per level.",
        ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
        "root = [3,9,20,null,null,15,7]", "[[3],[9,20],[15,7]]", "Level 0: [3], Level 1: [9,20], Level 2: [15,7].",
        "root = [1]", "[[1]]", "Single node.",
        "Level order traversal is Breadth-First Search (BFS).",
        "A Queue (FIFO) processes nodes level by level.",
        "While queue is not empty: get levelSize = queue.size(). Loop levelSize times: poll node, add value to current level list, enqueue left and right children.",
        "java.util.List<java.util.List<Integer>> levelOrder(TreeNode root)", "new java.util.ArrayList<>()", "67.4%", 26400
    ))

    problems.append(make_prob(
        "binary-tree-right-side-view", "Binary Tree Right Side View", "Medium", "Trees", "Level Order Traversal",
        "Return the values of the nodes you can see ordered from top to bottom standing on the right side.",
        "Given the <code>root</code> of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.",
        "Root TreeNode of a binary tree.", "List of integers visible from right side.",
        ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
        "root = [1,2,3,null,5,null,4]", "[1,3,4]", "Rightmost visible nodes from top to bottom.",
        "root = [1,null,3]", "[1,3]", "Nodes on right path.",
        "Standing on the right side, you see the last node of each level in a level-order traversal.",
        "Run BFS level-order traversal with a Queue.",
        "At each level, loop for levelSize times. The last node polled (when index == levelSize - 1) is added to the result list.",
        "java.util.List<Integer> rightSideView(TreeNode root)", "new java.util.ArrayList<>()", "63.9%", 17900
    ))

    problems.append(make_prob(
        "binary-tree-zigzag-level-order", "Binary Tree Zigzag Level Order Traversal", "Medium", "Trees", "Level Order Traversal",
        "Return the zigzag level order traversal of its nodes' values (alternate left-to-right and right-to-left).",
        "Given the <code>root</code> of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).",
        "Root TreeNode of a binary tree.", "List of lists of integers in zigzag order.",
        ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
        "root = [3,9,20,null,null,15,7]", "[[3],[20,9],[15,7]]", "Level 1 is left-to-right, level 2 is right-to-left, level 3 is left-to-right.",
        "root = [1]", "[[1]]", "Single level.",
        "Use BFS with a boolean flag leftToRight that toggles at each level.",
        "Use a LinkedList (or Deque) to store the values of each level.",
        "If leftToRight is true, append values to the end (list.addLast). If false, insert values at the front (list.addFirst). Toggle flag after each level.",
        "java.util.List<java.util.List<Integer>> zigzagLevelOrder(TreeNode root)", "new java.util.ArrayList<>()", "59.2%", 15800
    ))

    return problems

