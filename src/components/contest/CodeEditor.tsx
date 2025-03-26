
import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { languages } from '@/lib/code-languages';
import { Check, AlertTriangle } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onFocusViolation?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language,
  onFocusViolation
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<{line: number, col: number}>({line: 1, col: 1});
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Update line count whenever code changes
  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);
  
  // Monitor focus violations
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && onFocusViolation && isFocused) {
        onFocusViolation();
      }
    };
    
    // Track when user leaves the page
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent copy-paste from outside
    const handlePaste = (e: ClipboardEvent) => {
      if (onFocusViolation && !isFocused) {
        e.preventDefault();
        onFocusViolation();
      }
    };
    
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('paste', handlePaste);
    };
  }, [onFocusViolation, isFocused]);

  // Track cursor position
  const updateCursorPosition = () => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const cursorPos = textarea.selectionStart;
    
    // Calculate line and column
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const line = (textBeforeCursor.match(/\n/g) || []).length + 1;
    const lastNewLine = textBeforeCursor.lastIndexOf('\n');
    const col = lastNewLine === -1 ? cursorPos + 1 : cursorPos - lastNewLine;
    
    setCursorPosition({line, col});
  };

  // Simple syntax highlighting for common programming constructs
  const getHighlightedCode = () => {
    let highlightedCode = value;
    
    // Basic syntax highlighting based on language
    if (language === 'javascript' || language === 'typescript') {
      // Keywords
      highlightedCode = highlightedCode.replace(
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, 
        '<span class="text-purple-400">$1</span>'
      );
      // Strings
      highlightedCode = highlightedCode.replace(
        /(["'`])(.*?)\1/g, 
        '<span class="text-green-400">$1$2$1</span>'
      );
      // Comments
      highlightedCode = highlightedCode.replace(
        /\/\/(.*)/g, 
        '<span class="text-gray-500">\/\/$1</span>'
      );
    } else if (language === 'python') {
      // Keywords
      highlightedCode = highlightedCode.replace(
        /\b(def|class|import|from|return|if|elif|else|for|while|try|except|with|as|pass|break|continue)\b/g, 
        '<span class="text-purple-400">$1</span>'
      );
      // Strings
      highlightedCode = highlightedCode.replace(
        /(["'])(.*?)\1/g, 
        '<span class="text-green-400">$1$2$1</span>'
      );
      // Comments
      highlightedCode = highlightedCode.replace(
        /#(.*)/g, 
        '<span class="text-gray-500">#$1</span>'
      );
    }
    
    return highlightedCode;
  };
  
  // Line numbering
  const renderLineNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= lineCount; i++) {
      numbers.push(
        <div 
          key={i} 
          className={`text-right pr-3 select-none ${cursorPosition.line === i ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
        >
          {i}
        </div>
      );
    }
    return numbers;
  };
  
  // Handle tab key to insert spaces
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = editorRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert 2 spaces instead of tab
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor to right position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateCursorPosition();
      }, 0);
    }
  };
  
  return (
    <div className="w-full h-full bg-gray-900 text-white font-mono flex flex-col">
      <div className="flex flex-grow overflow-hidden">
        {/* Line numbers */}
        <div className="bg-gray-800 py-2 overflow-y-auto scrollbar-thin text-sm flex-shrink-0">
          {renderLineNumbers()}
        </div>
        
        {/* Editor */}
        <div className="relative flex-grow overflow-auto">
          <Textarea
            ref={editorRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onKeyDown={handleTabKey}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute inset-0 bg-transparent w-full h-full p-2 font-mono text-transparent caret-white resize-none outline-none overflow-auto border-0 focus-visible:ring-0"
            spellCheck={false}
            style={{ caretColor: 'white' }}
          />
          <pre className="language-none p-2 overflow-auto whitespace-pre">
            <div dangerouslySetInnerHTML={{ __html: getHighlightedCode() || ' ' }} />
          </pre>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-700 text-xs text-gray-300 flex justify-between items-center px-2 py-1">
        <div>
          {isFocused ? 
            <span className="flex items-center text-green-400">
              <Check className="h-3 w-3 mr-1" /> Focused
            </span> : 
            <span className="flex items-center text-gray-400">
              <AlertTriangle className="h-3 w-3 mr-1" /> Not focused
            </span>
          }
        </div>
        <div>
          Ln {cursorPosition.line}, Col {cursorPosition.col} | {language.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
