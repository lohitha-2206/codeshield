
export interface Language {
  id: string;
  name: string;
  extension: string;
  template: string;
}

export const languages: Record<string, Language> = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    template: `// Write your JavaScript solution here

function solution(input) {
  // Your code here
  
  return null;
}

// Example usage:
// console.log(solution([1, 2, 3]));`
  },
  python: {
    id: 'python',
    name: 'Python',
    extension: 'py',
    template: `# Write your Python solution here

def solution(input):
    # Your code here
    
    return None

# Example usage:
# print(solution([1, 2, 3]))`
  },
  java: {
    id: 'java',
    name: 'Java',
    extension: 'java',
    template: `// Write your Java solution here

public class Solution {
    public static void main(String[] args) {
        // Example usage
        // int[] input = {1, 2, 3};
        // System.out.println(solution(input));
    }
    
    public static Object solution(Object input) {
        // Your code here
        
        return null;
    }
}`
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    template: `// Write your C++ solution here

#include <iostream>
#include <vector>
using namespace std;

// Your solution function
template <typename T>
T solution(T input) {
    // Your code here
    
    return T();
}

int main() {
    // Example usage
    // vector<int> input = {1, 2, 3};
    // auto result = solution(input);
    // cout << result << endl;
    
    return 0;
}`
  }
};

export const getLanguageById = (id: string): Language => {
  return languages[id.toLowerCase()] || languages.javascript;
};

export const getLanguageTemplate = (id: string): string => {
  return getLanguageById(id).template;
};
