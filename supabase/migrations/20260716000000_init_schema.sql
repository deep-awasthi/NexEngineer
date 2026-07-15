-- ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}'::jsonb, -- github, linkedin, twitter
    badges JSONB DEFAULT '[]'::jsonb,       -- List of unlocked badges
    achievements JSONB DEFAULT '[]'::jsonb, -- List of earned achievements
    xp INT DEFAULT 0,
    streak_count INT DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. TOPICS
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- e.g., 'Data Structures', 'Algorithms', 'Advanced Techniques'
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Topics are readable by everyone" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Only admins can modify topics" ON public.topics FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (badges->>'is_admin')::boolean = true)
);

-- 3. QUESTIONS
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id UUID REFERENCES public.topics ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    companies TEXT[] DEFAULT '{}',
    frequency REAL DEFAULT 0.0,
    leetcode_url TEXT,
    video_url TEXT,
    estimated_time INT DEFAULT 30, -- minutes
    default_code JSONB DEFAULT '{}'::jsonb, -- Boilerplates for JS, PY, CPP, Java
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are readable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Only admins can modify questions" ON public.questions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (badges->>'is_admin')::boolean = true)
);

-- 4. USER PROGRESS (DSA Tracker)
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT false,
    favorite BOOLEAN DEFAULT false,
    revision_count INT DEFAULT 0,
    last_revision_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    personal_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- 5. REVISIONS (History log for revision cycles)
CREATE TABLE IF NOT EXISTS public.revisions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions ON DELETE CASCADE NOT NULL,
    revised_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL, -- 'NEEDS_REVISION', 'MASTERED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own revisions" ON public.revisions FOR ALL USING (auth.uid() = user_id);

-- 6. ARTICLE CATEGORIES
CREATE TABLE IF NOT EXISTS public.article_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are readable by everyone" ON public.article_categories FOR SELECT USING (true);

-- 7. ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT,
    reading_time INT NOT NULL,
    content TEXT NOT NULL, -- MDX content
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    category_id UUID REFERENCES public.article_categories ON DELETE SET NULL,
    author_id UUID REFERENCES public.profiles ON DELETE SET NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are readable by everyone" ON public.articles FOR SELECT USING (published = true);
CREATE POLICY "Drafts are viewable by author/admins" ON public.articles FOR SELECT USING (
    auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (badges->>'is_admin')::boolean = true)
);
CREATE POLICY "Only admins or author can modify articles" ON public.articles FOR ALL USING (
    auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (badges->>'is_admin')::boolean = true)
);

-- 8. BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('QUESTION', 'ARTICLE', 'ALGORITHM', 'DIAGRAM')),
    target_id TEXT NOT NULL, -- can store UUID or slug
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, type, target_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- 9. DIAGRAMS
CREATE TABLE IF NOT EXISTS public.diagrams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT 'Untitled Diagram',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.diagrams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public diagrams are readable by everyone" ON public.diagrams FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage their own diagrams" ON public.diagrams FOR ALL USING (auth.uid() = user_id);

-- 10. DIAGRAM VERSIONS
CREATE TABLE IF NOT EXISTS public.diagram_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    diagram_id UUID REFERENCES public.diagrams ON DELETE CASCADE NOT NULL,
    content JSONB NOT NULL, -- Stores React Flow nodes, edges, viewports
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.diagram_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage versions of their diagrams" ON public.diagram_versions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.diagrams WHERE id = diagram_id AND user_id = auth.uid())
);

-- 11. SAVED CODE (IDE Playgrounds)
CREATE TABLE IF NOT EXISTS public.saved_code (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    question_id UUID REFERENCES public.questions ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.saved_code ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own saved code" ON public.saved_code FOR ALL USING (auth.uid() = user_id);

-- 12. READING HISTORY
CREATE TABLE IF NOT EXISTS public.reading_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES public.articles ON DELETE CASCADE NOT NULL,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_percentage INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own reading history" ON public.reading_history FOR ALL USING (auth.uid() = user_id);

-- 13. USER SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE PRIMARY KEY,
    theme TEXT DEFAULT 'dark',
    email_notifications BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own settings" ON public.settings FOR ALL USING (auth.uid() = user_id);

-- AUTOMATIC PROFILE CREATION ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, username, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Engineer'),
        COALESCE(new.raw_user_meta_data->>'preferred_username', split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 4)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    );
    INSERT INTO public.settings (user_id) VALUES (new.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- SEED TOPICS
INSERT INTO public.topics (id, slug, name, description, category, order_index) VALUES
('a1111111-1111-1111-1111-111111111111', 'arrays', 'Arrays', 'Continuous linear blocks of memory storing collection elements.', 'Data Structures', 1),
('b2222222-2222-2222-2222-222222222222', 'strings', 'Strings', 'Sequence of characters representing text.', 'Data Structures', 2),
('c3333333-3333-3333-3333-333333333333', 'linked-list', 'Linked List', 'Nodes chained sequentially containing value and next pointer.', 'Data Structures', 3),
('d4444444-4444-4444-4444-444444444444', 'stack', 'Stack', 'LIFO access structure supporting push and pop operations.', 'Data Structures', 4),
('e5555555-5555-5555-5555-555555555555', 'queue', 'Queue', 'FIFO access structure supporting enqueue and dequeue.', 'Data Structures', 5),
('f6666666-6666-6666-6666-666666666666', 'hashing', 'Hashing', 'Map keys to indexes via hash function for O(1) average access.', 'Data Structures', 6),
('77777777-7777-7777-7777-777777777777', 'trees', 'Trees', 'Hierarchical graph structure containing root and children nodes.', 'Data Structures', 7),
('88888888-8888-8888-8888-888888888888', 'bst', 'BST', 'Binary search trees where left sub-node < current < right sub-node.', 'Data Structures', 8),
('99999999-9999-9999-9999-999999999999', 'heap', 'Heap', 'Tree structure preserving min/max invariant at the root.', 'Data Structures', 9),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'trie', 'Trie', 'Prefix-based search tree storing associative dictionary strings.', 'Data Structures', 10),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'graph', 'Graph', 'Vertices connected by edges representing networks.', 'Data Structures', 11),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'dynamic-programming', 'Dynamic Programming', 'Optimization caching overlapping subproblem results.', 'Algorithms', 12),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'greedy', 'Greedy', 'Locally optimal choice at each step targeting global maximum.', 'Algorithms', 13),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'backtracking', 'Backtracking', 'Recursive search pruning branches failing constraints.', 'Algorithms', 14),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'binary-search', 'Binary Search', 'Logarithmic division of sorted search space.', 'Algorithms', 15),
('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', 'sliding-window', 'Sliding Window', 'Dynamic or fixed sub-range tracking over sequential items.', 'Algorithms', 16),
('0f0f0f0f-0f0f-0f0f-0f0f-0f0f0f0f0f0f', 'two-pointer', 'Two Pointer', 'Simultaneous traversal of structures using two indexes.', 'Algorithms', 17),
('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'prefix-sum', 'Prefix Sum', 'Precalculated cumulative sums enabling O(1) range queries.', 'Algorithms', 18),
('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'segment-tree', 'Segment Tree', 'Binary tree structure answering range queries dynamically.', 'Advanced Techniques', 19),
('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', 'fenwick-tree', 'Fenwick Tree', 'Binary indexed tree representing dynamic prefix operations.', 'Advanced Techniques', 20),
('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4d', 'union-find', 'Union Find', 'Disjoint-set structure supporting quick merge and check cycles.', 'Advanced Techniques', 21),
('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e', 'bit-manipulation', 'Bit Manipulation', 'Low-level logical binary operations directly modifying bits.', 'Advanced Techniques', 22),
('6f6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f6f', 'math', 'Math', 'Number theory, combinatorics, and numeric algorithms.', 'Advanced Techniques', 23),
('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a7a', 'monotonic-stack', 'Monotonic Stack', 'Stack maintaining sorted numeric values for next greater queries.', 'Advanced Techniques', 24),
('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b', 'intervals', 'Intervals', 'Range queries representing start-end scheduling questions.', 'Advanced Techniques', 25)
ON CONFLICT (id) DO NOTHING;

-- SEED QUESTIONS
INSERT INTO public.questions (topic_id, name, slug, difficulty, companies, frequency, leetcode_url, video_url, estimated_time, default_code) VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'Two Sum',
  'two-sum',
  'EASY',
  ARRAY['Google', 'Amazon', 'Facebook', 'Apple'],
  1.0,
  'https://leetcode.com/problems/two-sum/',
  'https://www.youtube.com/watch?v=KLlXCFG5Tk0',
  15,
  '{"javascript": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}", "python": "def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []", "cpp": "#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        std::unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (seen.count(complement)) {\n                return {seen[complement], i};\n            }\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};", "java": "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[] { seen.get(complement), i };\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}"}'::jsonb
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Reverse Linked List',
  'reverse-linked-list',
  'EASY',
  ARRAY['Amazon', 'Microsoft', 'Adobe'],
  0.9,
  'https://leetcode.com/problems/reverse-linked-list/',
  'https://www.youtube.com/watch?v=G0_I-ZF0S38',
  15,
  '{"javascript": "function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}", "python": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head: ListNode) -> ListNode:\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev", "cpp": "struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr) {\n            ListNode* nextTemp = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n};", "java": "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) { val = x; }\n}\n\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode nextTemp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n}"}'::jsonb
),
(
  'd4444444-4444-4444-4444-444444444444',
  'Valid Parentheses',
  'valid-parentheses',
  'EASY',
  ARRAY['Google', 'Bloomberg', 'Netflix'],
  0.85,
  'https://leetcode.com/problems/valid-parentheses/',
  'https://www.youtube.com/watch?v=WTzjTskDFMg',
  15,
  '{"javascript": "function isValid(s) {\n    const stack = [];\n    const mapping = { \")\": \"(\", \"}\": \"{\", \"]\": \"[\" };\n    for (let char of s) {\n        if (mapping[char]) {\n            const topElement = stack.length === 0 ? \"#\" : stack.pop();\n            if (topElement !== mapping[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}", "python": "def isValid(s: str) -> bool:\n    stack = []\n    mapping = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else ''\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack", "cpp": "#include <stack>\n#include <string>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    bool isValid(std::string s) {\n        std::stack<char> st;\n        std::unordered_map<char, char> mapping = {{'')'', ''(''}, {''}'', ''{''}, {''}'', ''[''}}; -- escaped in SQL if single quotes\n        for (char c : s) {\n            if (c == '')'' || c == ''}'' || c == '']'') {\n                if (st.empty()) return false;\n                char top = st.top(); st.pop();\n                if ((c == '')'' && top != ''('') ||\n                    (c == ''}'' && top != ''{'') ||\n                    (c == '']'' && top != ''['')) return false;\n            } else {\n                st.push(c);\n            }\n        }\n        return st.empty();\n    }\n};", "java": "import java.util.Stack;\n\nclass Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == ''('') stack.push(''('');\n            else if (c == ''{'') stack.push(''{'');\n            else if (c == ''['') stack.push(''['');\n            else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if (c == '')'' && top != ''('') return false;\n                if (c == ''}'' && top != ''{'') return false;\n                if (c == '']'' && top != ''['') return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}"}'::jsonb
),
(
  'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0',
  'Longest Substring Without Repeating Characters',
  'longest-substring-without-repeating-characters',
  'MEDIUM',
  ARRAY['Amazon', 'Google', 'Uber'],
  0.95,
  'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  'https://www.youtube.com/watch?v=wiGpG14cmac',
  30,
  '{"javascript": "function lengthOfLongestSubstring(s) {\n    let maxLen = 0, left = 0;\n    const charSet = new Set();\n    for (let right = 0; right < s.length; right++) {\n        while (charSet.has(s[right])) {\n            charSet.delete(s[left]);\n            left++;\n        }\n        charSet.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}", "python": "def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len", "cpp": "#include <string>\n#include <unordered_set>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        std::unordered_set<char> charSet;\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); ++right) {\n            while (charSet.count(s[right])) {\n                charSet.erase(s[left]);\n                left++;\n            }\n            charSet.insert(s[right]);\n            maxLen = std::max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};", "java": "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> charSet = new HashSet<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (charSet.contains(s.charAt(right))) {\n                charSet.remove(s.charAt(left));\n                left++;\n            }\n            charSet.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}"}'::jsonb
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Number of Islands',
  'number-of-islands',
  'MEDIUM',
  ARRAY['Google', 'Amazon', 'Microsoft', 'Bloomberg'],
  0.95,
  'https://leetcode.com/problems/number-of-islands/',
  'https://www.youtube.com/watch?v=pV2kpPD66PE',
  35,
  '{"javascript": "function numIslands(grid) {\n    if (!grid || grid.length === 0) return 0;\n    let count = 0;\n    const dfs = (r, c) => {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === \"0\") return;\n        grid[r][c] = \"0\";\n        dfs(r + 1, c);\n        dfs(r - 1, c);\n        dfs(r, c + 1);\n        dfs(r, c - 1);\n    };\n    for (let r = 0; r < grid.length; r++) {\n        for (let c = 0; c < grid[0].length; c++) {\n            if (grid[r][c] === \"1\") {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    return count;\n}", "python": "def numIslands(grid: list[list[str]]) -> int:\n    if not grid: return 0\n    count = 0\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]) or grid[r][c] == ''0'':\n            return\n        grid[r][c] = ''0''\n        dfs(r+1, c)\n        dfs(r-1, c)\n        dfs(r, c+1)\n        dfs(r, c-1)\n    \n    for r in range(len(grid)):\n        for c in range(len(grid[0])):\n            if grid[r][c] == ''1'':\n                count += 1\n                dfs(r, c)\n    return count", "cpp": "#include <vector>\n\nclass Solution {\nprivate:\n    void dfs(std::vector<std::vector<char>>& grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == ''0'') return;\n        grid[r][c] = ''0'';\n        dfs(grid, r + 1, c);\n        dfs(grid, r - 1, c);\n        dfs(grid, r, c + 1);\n        dfs(grid, r, c - 1);\n    }\npublic:\n    int numIslands(std::vector<std::vector<char>>& grid) {\n        int count = 0;\n        for (int r = 0; r < grid.size(); ++r) {\n            for (int c = 0; c < grid[0].size(); ++c) {\n                if (grid[r][c] == ''1'') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n};", "java": "class Solution {\n    private void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == ''0'') return;\n        grid[r][c] = ''0'';\n        dfs(grid, r + 1, c);\n        dfs(grid, r - 1, c);\n        dfs(grid, r, c + 1);\n        dfs(grid, r, c - 1);\n    }\n    public int numIslands(char[][] grid) {\n        if (grid == null || grid.length == 0) return 0;\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == ''1'') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n}"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- SEED CATEGORIES FOR ARTICLES
INSERT INTO public.article_categories (id, slug, name) VALUES
('11111111-aaaa-bbbb-cccc-000000000001', 'system-design', 'System Design'),
('11111111-aaaa-bbbb-cccc-000000000002', 'dsa', 'Data Structures & Algorithms'),
('11111111-aaaa-bbbb-cccc-000000000003', 'databases', 'Databases'),
('11111111-aaaa-bbbb-cccc-000000000004', 'microservices', 'Microservices'),
('11111111-aaaa-bbbb-cccc-000000000005', 'devops', 'DevOps & Infrastructure')
ON CONFLICT (id) DO NOTHING;

-- SEED SAMPLE ARTICLES
INSERT INTO public.articles (slug, title, description, cover_url, reading_time, content, published, published_at, category_id) VALUES
(
  'demystifying-rate-limiters',
  'Demystifying Rate Limiters: Token Bucket vs Leaky Bucket',
  'Deep dive into the architecture and mathematics behind API rate limiters. We compare Token Bucket, Leaky Bucket, and Sliding Window Log algorithms with code.',
  'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop',
  10,
  '# Demystifying Rate Limiters

Rate limiting is a critical component of any public API. It protects your infrastructure from starvation, brute-force attacks, and DDoS attempts. In this post, we will walk through the core algorithms.

## 1. Token Bucket Algorithm

The **Token Bucket** algorithm is widely used because it is intuitive and allows for bursts of traffic.

### How it Works:
- A bucket is filled with tokens at a constant rate $r$ tokens/sec up to capacity $C$.
- Each request consumes 1 token.
- If tokens are available, the request is processed; otherwise, it is dropped or delayed.

```python
import time

class TokenBucket:
    def __init__(self, capacity: int, fill_rate: float):
        self.capacity = capacity
        self.fill_rate = fill_rate
        self.tokens = capacity
        self.last_update = time.time()

    def allow_request(self) -> bool:
        now = time.time()
        elapsed = now - self.last_update
        self.last_update = now
        
        # Add new tokens
        self.tokens = min(self.capacity, self.tokens + elapsed * self.fill_rate)
        
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
```

## 2. Leaky Bucket Algorithm

Unlike Token Bucket, the **Leaky Bucket** algorithm enforces a strict, smooth egress rate.

### How it Works:
- Requests flow into a queue (the bucket).
- If the queue exceeds capacity, incoming requests are rejected immediately.
- Requests are processed (leaked) at a constant rate.

---

Stay tuned for our next article on Distributed Rate Limiting using Redis!',
  true,
  NOW(),
  '11111111-aaaa-bbbb-cccc-000000000001'
),
(
  'understanding-consistent-hashing',
  'Understanding Consistent Hashing in Distributed Systems',
  'How to scale cache nodes and databases without reshuffling the entire keyspace. Learn how consistent hashing works visually with virtual nodes.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
  8,
  '# Understanding Consistent Hashing

When building distributed caches or databases, we need a way to distribute keys across multiple nodes.

## The Problem with Simple Hashing

If we have $N$ cache nodes, the simplest way to map a key to a node is:
$$\text{node\_index} = \text{hash}(key) \pmod N$$

However, when $N$ changes (a node crashes or a new node is added), almost all keys map to different nodes. This triggers a **cache storm**, thrashing the backend.

## The Solution: Consistent Hashing

Consistent hashing maps both **keys** and **nodes** onto a circular ring (often called the hash ring).

### Steps:
1. Hash the server IP/Name and place it on the ring.
2. Hash the key to find its position on the ring.
3. Move clockwise from the key''s position until you hit a server node. That server handles the key.

### Virtual Nodes (VNodes)
To avoid hotspots (skewed distribution), we map each physical server to multiple **virtual nodes** on the ring.',
  true,
  NOW(),
  '11111111-aaaa-bbbb-cccc-000000000001'
)
ON CONFLICT (slug) DO NOTHING;
