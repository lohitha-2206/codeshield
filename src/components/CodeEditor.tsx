import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  onRun: (code: string) => void;
  onReset: () => void;
  defaultLanguage?: string;
  defaultValue?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  onRun,
  onReset,
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here...',
  height = '70vh'
}) => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultValue);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' }
  ];

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Disable various editor features
    editor.updateOptions({
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      parameterHints: { enabled: false },
      contextmenu: false,
    });

    // Disable copy-paste in editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      toast.error("Copying is not allowed!");
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      toast.error("Pasting is not allowed!");
    });
  };

  return (
    <Card className="border-2 shadow-lg">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="vs-dark">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map(theme => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReset()}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => onRun(code)}
            >
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Editor
          height={height}
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            folding: true,
            lineNumbers: 'on',
            roundedSelection: false,
            tabSize: 2,
            cursorStyle: 'line',
            automaticLayout: true,
            padding: { top: 16 }
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </Card>
  );
};

export default CodeEditor;