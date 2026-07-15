import { createClient } from '@/lib/supabase/server';
import { IDEWorkspace } from '@/components/ide/ide-workspace';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Static seed questions backup mapping
const STATIC_QUESTIONS_BACKUP: Record<string, any> = {
  'two-sum': {
    id: 'q1',
    name: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'EASY',
    estimated_time: 15,
    leetcode_url: 'https://leetcode.com/problems/two-sum/',
    default_code: {
      javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
      cpp: `#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        std::unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (seen.count(complement)) {\n                return {seen[complement], i};\n            }\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      java: `import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[] { seen.get(complement), i };\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}`
    }
  },
  'reverse-linked-list': {
    id: 'q2',
    name: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'EASY',
    estimated_time: 15,
    leetcode_url: 'https://leetcode.com/problems/reverse-linked-list/',
    default_code: {
      javascript: `function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`,
      python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head: ListNode) -> ListNode:\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
      cpp: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr) {\n            ListNode* nextTemp = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n};`,
      java: `class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) { val = x; }\n}\n\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode nextTemp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n}`
    }
  },
  'valid-parentheses': {
    id: 'q3',
    name: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'EASY',
    estimated_time: 15,
    leetcode_url: 'https://leetcode.com/problems/valid-parentheses/',
    default_code: {
      javascript: `function isValid(s) {\n    const stack = [];\n    const mapping = { ")": "(", "}": "{", "]": "[" };\n    for (let char of s) {\n        if (mapping[char]) {\n            const topElement = stack.length === 0 ? "#" : stack.pop();\n            if (topElement !== mapping[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else ''\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack`,
      cpp: `#include <stack>\n#include <string>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    bool isValid(std::string s) {\n        std::stack<char> st;\n        std::unordered_map<char, char> mapping = {{')', '('}, {'}', '{'}, {']', '['}};\n        for (char c : s) {\n            if (c == ')' || c == '}' || c == ']') {\n                if (st.empty()) return false;\n                char top = st.top(); st.pop();\n                if ((c == ')' && top != '(') ||\n                    (c == '}' && top != '{') ||\n                    (c == ']' && top != '[')) return false;\n            } else {\n                st.push(c);\n            }\n        }\n        return st.empty();\n    }\n};`,
      java: `import java.util.Stack;\n\nclass Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push('(');\n            else if (c == '{') stack.push('{');\n            else if (c == '[') stack.push('[');\n            else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if (c == ')' && top != '(') return false;\n                if (c == '}' && top != '{') return false;\n                if (c == ']' && top != '[') return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}`
    }
  }
};

interface PageProps {
  params: Promise<{
    questionSlug: string;
  }>;
}

export default async function QuestionIDEPage({ params }: PageProps) {
  const { questionSlug } = await params;
  let question = STATIC_QUESTIONS_BACKUP[questionSlug] || null;

  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  if (!isDemo) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('slug', questionSlug)
        .single();
      if (data) {
        question = data;
      }
    } catch (err) {
      console.log('Failed to fetch question from Supabase, loading fallback', err);
    }
  }

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-zinc-500" />
        <h1 className="text-xl font-bold text-white">Question Not Found</h1>
        <p className="text-zinc-400 text-sm max-w-sm">
          We could not locate this coding challenge. Please verify the URL slug.
        </p>
        <Link href="/dsa" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider">
          Back to DSA Tracker
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Link href="/dsa" className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider">
          &larr; Back to Tracker
        </Link>
      </div>

      {/* Mounting the Workspace client */}
      <IDEWorkspace question={question} />
    </div>
  );
}
