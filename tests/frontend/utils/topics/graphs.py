# graphs.py
from .common import make_prob

def get_problems():
    problems = []

    # Pattern: BFS
    problems.append(make_prob(
        "number-of-islands", "Number of Islands", "Medium", "Graphs", "BFS",
        "Count the number of islands in a 2D binary grid.",
        "Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
        "A 2D char array <code>grid</code>.", "Number of islands as an integer.",
        ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
        "grid = [['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]", "1", "All adjacent lands merge into 1 island.",
        "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]", "3", "Three disconnected islands.",
        "Iterate over every cell. When you encounter '1', you have discovered a new island!",
        "Increment count and launch a BFS or DFS traversal starting at that cell to mark all connected '1's as visited.",
        "In BFS: enqueue (r, c), mark grid[r][c] = '0'. Dequeue and explore 4 neighbors (up, down, left, right). For each valid neighbor with '1', mark '0' and enqueue.",
        "int numIslands(char[][] grid)", "0", "57.8%", 27400
    ))

    problems.append(make_prob(
        "rotting-oranges", "Rotting Oranges", "Medium", "Graphs", "BFS",
        "Find the minimum number of minutes that must elapse until no cell has a fresh orange.",
        "You are given an <code>m x n</code> grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return <code>-1</code>.",
        "An <code>m x n</code> grid of integers.", "Minimum minutes elapsed, or -1.",
        ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 10", "grid[i][j] is 0, 1, or 2."],
        "grid = [[2,1,1],[1,1,0],[0,1,1]]", "4", "Oranges rot simultaneously level by level.",
        "grid = [[2,1,1],[0,1,1],[1,0,1]]", "-1", "The bottom-left fresh orange cannot be reached.",
        "This is a multi-source Breadth-First Search (BFS).",
        "First, enqueue all rotten oranges (cells with value 2) and count the total fresh oranges.",
        "Process BFS level by level. At each minute, rot all adjacent fresh oranges, decrement fresh count, and enqueue. If fresh count == 0 return minutes; otherwise -1.",
        "int orangesRotting(int[][] grid)", "-1", "54.1%", 19200
    ))

    problems.append(make_prob(
        "word-ladder", "Word Ladder", "Hard", "Graphs", "BFS",
        "Find the length of the shortest transformation sequence from beginWord to endWord.",
        "A transformation sequence from word <code>beginWord</code> to word <code>endWord</code> using a dictionary <code>wordList</code> is a sequence of words <code>beginWord -> s1 -> s2 -> ... -> sk</code> such that every adjacent pair of words differs by a single letter, and every <code>si</code> is in <code>wordList</code>. Given two words, <code>beginWord</code> and <code>endWord</code>, and a dictionary <code>wordList</code>, return the number of words in the shortest transformation sequence from <code>beginWord</code> to <code>endWord</code>, or <code>0</code> if no such sequence exists.",
        "Strings <code>beginWord, endWord</code> and list <code>wordList</code>.", "Shortest sequence length, or 0.",
        ["1 <= beginWord.length <= 10", "endWord.length == beginWord.length", "1 <= wordList.length <= 5000"],
        "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']", "5", "Shortest transformation is 'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog' (5 words).",
        "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log']", "0", "'cog' is not in wordList.",
        "Model this as an unweighted graph where words are vertices and single-letter transformations are edges.",
        "BFS finds the shortest path in an unweighted graph.",
        "Put wordList in a HashSet for O(1) existence checks. Start BFS queue with beginWord at distance 1. For each word, try changing all 26 letters at each character position to generate neighbors.",
        "int ladderLength(String beginWord, String endWord, java.util.List<String> wordList)", "0", "38.2%", 11500
    ))

    # Pattern: DFS
    problems.append(make_prob(
        "clone-graph", "Clone Graph", "Medium", "Graphs", "DFS",
        "Return a deep copy (clone) of a connected undirected graph.",
        "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (<code>int</code>) and a list (<code>List[Node]</code>) of its neighbors.",
        "A Node object.", "Cloned deep-copy Node.",
        ["The number of nodes in the graph is in the range [0, 100].", "1 <= Node.val <= 100", "Node.val is unique for each node."],
        "adjList = [[2,4],[1,3],[2,4],[1,3]]", "[[2,4],[1,3],[2,4],[1,3]]", "Deep copy with all new Node instances.",
        "adjList = [[]]", "[[]]", "Single isolated node.",
        "Use a HashMap<Node, Node> to map original nodes to their cloned counterparts and prevent infinite recursion in cycles.",
        "If node == null, return null. If map contains node, return map.get(node).",
        "Create copy = new Node(node.val), put in map, then for each neighbor, copy.neighbors.add(cloneGraph(neighbor)). Return copy.",
        "Node cloneGraph(Node node)", "null", "55.8%", 16400
    ))

    problems.append(make_prob(
        "max-area-of-island", "Max Area of Island", "Medium", "Graphs", "DFS",
        "Return the maximum area of an island in a 2D binary grid.",
        "You are given an <code>m x n</code> binary matrix <code>grid</code>. An island is a group of <code>1</code>'s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water. The area of an island is the number of cells with a value <code>1</code> in the island. Return the maximum area of an island in <code>grid</code>. If there is no island, return <code>0</code>.",
        "A binary 2D integer array <code>grid</code>.", "Maximum island area as integer.",
        ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 50", "grid[i][j] is either 0 or 1."],
        "grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],...]", "6", "Max area is 6.",
        "grid = [[0,0,0,0,0,0,0,0]]", "0", "No islands present.",
        "Use Depth-First Search (DFS) to compute the size of each connected component of 1s.",
        "When finding a 1, recursively visit its 4 neighbors, accumulating cell count.",
        "Sink visited land by setting grid[r][c] = 0. Helper dfs(r, c) returns 1 + dfs(up) + dfs(down) + dfs(left) + dfs(right).",
        "int maxAreaOfIsland(int[][] grid)", "0", "71.9%", 18300
    ))

    problems.append(make_prob(
        "surrounded-regions", "Surrounded Regions", "Medium", "Graphs", "DFS",
        "Capture all regions surrounded by 'X' by converting them to 'X'.",
        "Given an <code>m x n</code> matrix <code>board</code> containing <code>'X'</code> and <code>'O'</code>, capture all regions that are 4-directionally surrounded by <code>'X'</code>. A region is captured by flipping all <code>'O'</code>s into <code>'X'</code>s in that surrounded region.",
        "An m x n char array <code>board</code>.", "None (modify <code>board</code> in-place).",
        ["m == board.length", "n == board[i].length", "1 <= m, n <= 200", "board[i][j] is 'X' or 'O'."],
        "board = [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']]", "[['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]", "Surrounded 'O's captured, border-connected 'O' survives.",
        "board = [['X']]", "[['X']]", "Single cell.",
        "Any 'O' on the border of the board (or connected to a border 'O') CANNOT be surrounded.",
        "Start DFS from all 'O' cells located on the 4 boundary borders.",
        "Mark border-connected 'O's temporarily as '#'. Finally, iterate whole board: change remaining 'O' to 'X', and restore '#' back to 'O'.",
        "void solve(char[][] board)", "", "39.4%", 12900
    ))

    # Pattern: Connected Components
    problems.append(make_prob(
        "number-of-connected-components", "Number of Connected Components in an Undirected Graph", "Medium", "Graphs", "Connected Components",
        "Find the number of connected components in an undirected graph.",
        "You have a graph of <code>n</code> nodes. You are given an integer <code>n</code> and an array <code>edges</code> where <code>edges[i] = [ai, bi]</code> indicates that there is an edge between <code>ai</code> and <code>bi</code> in the graph. Return the number of connected components in the graph.",
        "Integer <code>n</code> and 2D integer array <code>edges</code>.", "Number of connected components.",
        ["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= ai <= bi < n"],
        "n = 5, edges = [[0,1],[1,2],[3,4]]", "2", "Component 1: {0,1,2}, Component 2: {3,4}.",
        "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", "1", "All nodes connected.",
        "This can be solved using either Disjoint Set Union (Union-Find) or BFS/DFS.",
        "With Union-Find, start with n separate components. For each edge, if find(u) != find(v), union them and decrement component count.",
        "Return the remaining component count.",
        "int countComponents(int n, int[][] edges)", "n", "62.4%", 10800
    ))

    problems.append(make_prob(
        "number-of-provinces", "Number of Provinces", "Medium", "Graphs", "Connected Components",
        "Find the total number of connected provinces from an adjacency matrix.",
        "There are <code>n</code> cities. Some of them are connected, while some are not. If city <code>a</code> is connected directly with city <code>b</code>, and city <code>b</code> is connected directly with city <code>c</code>, then city <code>a</code> is connected indirectly with city <code>c</code>. A province is a group of directly or indirectly connected cities and no other cities outside of the group. Given an <code>n x n</code> matrix <code>isConnected</code> where <code>isConnected[i][j] = 1</code> if the <code>i</code>-th city and the <code>j</code>-th city are directly connected, and <code>isConnected[i][j] = 0</code> otherwise, return the total number of provinces.",
        "An n x n binary matrix <code>isConnected</code>.", "Total number of provinces.",
        ["1 <= n <= 200", "n == isConnected.length", "isConnected[i][j] is 1 or 0.", "isConnected[i][i] == 1", "isConnected[i][j] == isConnected[j][i]"],
        "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", "2", "Cities 0 and 1 form one province, city 2 forms another.",
        "isConnected = [[1,0,0],[0,1,0],[0,0,1]]", "3", "Three disconnected provinces.",
        "Track visited cities using a boolean[] visited array of size n.",
        "Iterate i from 0 to n - 1. If city i has not been visited, start a DFS/BFS to visit all cities connected to i, and increment provinces count.",
        "In DFS(city): mark visited[city] = true. For j from 0 to n - 1: if isConnected[city][j] == 1 && !visited[j], dfs(j).",
        "int findCircleNum(int[][] isConnected)", "0", "65.7%", 17200
    ))

    # Pattern: Cycle Detection
    problems.append(make_prob(
        "course-schedule", "Course Schedule", "Medium", "Graphs", "Cycle Detection",
        "Determine if you can finish all courses given prerequisite dependencies (cycle detection in directed graph).",
        "There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you must take course <code>bi</code> first if you want to take course <code>ai</code>. Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>.",
        "Integer <code>numCourses</code> and 2D array <code>prerequisites</code>.", "Boolean <code>true</code> if possible.",
        ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2", "0 <= ai, bi < numCourses"],
        "numCourses = 2, prerequisites = [[1,0]]", "true", "Take course 0 then course 1.",
        "numCourses = 2, prerequisites = [[1,0],[0,1]]", "false", "Circular prerequisite cycle exists.",
        "You can finish all courses if and only if the directed graph has NO directed cycles.",
        "Use Kahn's algorithm (topological sort via indegrees) or 3-state DFS (0 = unvisited, 1 = visiting, 2 = visited).",
        "With Kahn's: calculate inDegree for every course. Enqueue courses with inDegree == 0. Poll, decrement neighbors' inDegrees, enqueue if 0. Count processed nodes: return count == numCourses.",
        "boolean canFinish(int numCourses, int[][] prerequisites)", "false", "46.8%", 24500
    ))

    problems.append(make_prob(
        "redundant-connection", "Redundant Connection", "Medium", "Graphs", "Cycle Detection",
        "Return an edge that can be removed so that the resulting graph is a tree.",
        "In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with <code>n</code> nodes labeled from <code>1</code> to <code>n</code>, with one additional edge added. The added edge has two different vertices chosen from <code>1</code> to <code>n</code>, and was not an edge that already existed. Return an edge that can be removed so that the resulting graph is a tree of <code>n</code> nodes.",
        "2D array <code>edges</code>.", "Edge [u, v] creating cycle.",
        ["n == edges.length", "3 <= n <= 1000", "edges[i].length == 2", "1 <= ai < bi <= n"],
        "edges = [[1,2],[1,3],[2,3]]", "[2,3]", "[2,3] closes a cycle.",
        "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", "[1,4]", "Edge [1,4] creates redundant cycle.",
        "A tree with n nodes has exactly n - 1 edges. The extra edge is the one that connects two nodes that are ALREADY connected.",
        "Use Disjoint Set Union (DSU / Union-Find).",
        "For each edge [u, v]: if find(u) == find(v), u and v already belong to the same component, so this edge creates a cycle! Return [u, v]. Otherwise union(u, v).",
        "int[] findRedundantConnection(int[][] edges)", "new int[]{}", "62.8%", 14900
    ))

    # Pattern: Topological Sorting
    problems.append(make_prob(
        "course-schedule-ii", "Course Schedule II", "Medium", "Graphs", "Topological Sorting",
        "Return the ordering of courses you should take to finish all courses.",
        "There are a total of <code>numCourses</code> courses labeled from <code>0</code> to <code>numCourses - 1</code>. Given <code>prerequisites[i] = [ai, bi]</code>, return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.",
        "Integer <code>numCourses</code> and <code>prerequisites</code>.", "Array representing valid course order.",
        ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= numCourses * (numCourses - 1)"],
        "numCourses = 2, prerequisites = [[1,0]]", "[0,1]", "Course 0 must be taken before course 1.",
        "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", "[0,2,1,3]", "Valid topological ordering.",
        "This is finding a topological sort of a Directed Acyclic Graph (DAG).",
        "Use Kahn's algorithm: calculate indegree array and build adjacency list.",
        "Add courses with inDegree == 0 to a Queue. As each node is dequeued, append it to the order array and decrement its neighbors' indegrees. If processed count < numCourses, return empty array.",
        "int[] findOrder(int numCourses, int[][] prerequisites)", "new int[]{}", "50.1%", 19800
    ))

    problems.append(make_prob(
        "alien-dictionary-order", "Verifying an Alien Dictionary", "Easy", "Graphs", "Topological Sorting",
        "Verify if words are sorted lexicographically according to a new alien language alphabet order.",
        "In an alien language, surprisingly, they also use English lowercase letters, but possibly in a different <code>order</code>. The <code>order</code> of the alphabet is some permutation of lowercase letters. Given a sequence of <code>words</code> written in the alien language, and the <code>order</code> of the alphabet, return <code>true</code> if and only if the given <code>words</code> are sorted lexicographically in this alien language.",
        "Array of strings <code>words</code> and string <code>order</code>.", "Boolean <code>true</code> if sorted.",
        ["1 <= words.length <= 100", "1 <= words[i].length <= 20", "order.length == 26", "All characters are lowercase English letters."],
        "words = ['hello','leetcode'], order = 'hlabcdefgijkmnopqrstuvwxyz'", "true", "'h' comes before 'l' in alien order.",
        "words = ['word','world','row'], order = 'worldabcefghijkmnpqstuvxyz'", "false", "'d' comes after 'l' in this alien order.",
        "Map each character to its 0-25 rank in the alien order.",
        "Compare adjacent words words[i] and words[i + 1] pair by pair.",
        "Find the first index where characters differ. If orderRank[w1] > orderRank[w2], return false. If w1 is a prefix of w2 and longer, return false.",
        "boolean isAlienSorted(String[] words, String order)", "false", "54.7%", 16100
    ))

    # Pattern: Shortest Paths
    problems.append(make_prob(
        "network-delay-time", "Network Delay Time", "Medium", "Graphs", "Shortest Paths",
        "Find the minimum time it takes for all n nodes to receive a signal sent from node k using Dijkstra's algorithm.",
        "You are given a network of <code>n</code> nodes, labeled from <code>1</code> to <code>n</code>. You are also given <code>times</code>, a list of travel times as directed edges <code>times[i] = (ui, vi, wi)</code>, where <code>ui</code> is the source node, <code>vi</code> is the target node, and <code>wi</code> is the time it takes for a signal to travel from source to target. We will send a signal from a given node <code>k</code>. Return the minimum time it takes for all the <code>n</code> nodes to receive the signal. If it is impossible for all the <code>n</code> nodes to receive the signal, return <code>-1</code>.",
        "2D array <code>times</code>, integer <code>n</code>, and starting node <code>k</code>.", "Minimum delay time or -1.",
        ["1 <= k <= n <= 100", "1 <= times.length <= 6000", "times[i].length == 3", "1 <= ui, vi <= n", "ui != vi", "0 <= wi <= 100"],
        "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", "2", "Signal reaches node 4 in 2 units of time.",
        "times = [[1,2,1]], n = 2, k = 1", "1", "Reaches node 2 in 1 unit.",
        "This is single-source shortest path with non-negative edge weights: Dijkstra's algorithm.",
        "Maintain a min-heap PriorityQueue storing [node, distance] pairs and an array dist[] initialized to infinity.",
        "Extract min-distance node. For each neighbor, if dist[u] + weight < dist[v], update dist[v] and offer to heap. Answer is max(dist); if any node is unreachable, return -1.",
        "int networkDelayTime(int[][] times, int n, int k)", "-1", "54.2%", 14200
    ))

    problems.append(make_prob(
        "cheapest-flights-within-k-stops", "Cheapest Flights Within K Stops", "Medium", "Graphs", "Shortest Paths",
        "Find the cheapest price from src to dst with at most k stops.",
        "There are <code>n</code> cities connected by some number of flights. You are given an array <code>flights</code> where <code>flights[i] = [fromi, toi, pricei]</code> indicates that there is a flight from city <code>fromi</code> to city <code>toi</code> with cost <code>pricei</code>. You are also given three integers <code>src</code>, <code>dst</code>, and <code>k</code>, return the cheapest price from <code>src</code> to <code>dst</code> with at most <code>k</code> stops. If there is no such route, return <code>-1</code>.",
        "Array <code>flights</code>, integers <code>src, dst, k</code>.", "Cheapest flight cost or -1.",
        ["1 <= n <= 100", "0 <= flights.length <= (n * (n - 1) / 2)", "0 <= src, dst, k < n"],
        "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1", "700", "The optimal path with at most 1 stop is 0 -> 1 -> 3 (cost 700).",
        "n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0", "500", "Direct flight with 0 stops costs 500.",
        "Because of the step constraint (k stops means at most k + 1 edges), Bellman-Ford algorithm is very clean.",
        "Run Bellman-Ford for k + 1 iterations.",
        "In each iteration, create a copy of the prices array. For each flight [u, v, cost], if prices[u] != inf, update tempPrices[v] = min(tempPrices[v], prices[u] + cost). After k + 1 passes, return prices[dst].",
        "int findCheapestPrice(int n, int[][] flights, int src, int dst, int k)", "-1", "38.9%", 11800
    ))

    return problems

