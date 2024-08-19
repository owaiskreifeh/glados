"use client";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

export function CodeEditor({
  value,
  onValueChange = () => {},
  className,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  className: string;
}) {
  return (
    <Editor
      className={className}
      value={value}
      onValueChange={onValueChange}
      highlight={(code) => highlight(code, languages.js, 'javascript')}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  );
}
