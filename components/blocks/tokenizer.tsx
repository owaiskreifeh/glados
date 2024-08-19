"use client";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

import { encode, decodeGenerator } from "gpt-tokenizer";
import { cn } from "@/lib";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";

const initialText = `It's important to note that the exact tokenization process varies between models. Newer models like GPT-3.5 and GPT-4 use a different tokenizer than previous models, and will produce different tokens for the same input text.`;

export function Tokenizer() {
  const [text, setText] = useState(initialText);
  const [tokens, setTokens] = useState<string[]>([]);
  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  useEffect(() => {
    const tokenIds = encode(text);
    const newTokens = [];
    for (let token of decodeGenerator(tokenIds)) {
      newTokens.push(token);
    }
    setTokens(newTokens);
  }, [text]);

  return (
    <div className="w-full max-w-[800px] flex flex-col gap-4 m-4">
      <Textarea
        className="w-full text-lg min-h-[180px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div>
      <div className="flex flex-wrap">
        {tokens.map((token, i) => (
          <div
            key={i}
            className={cn(
              "text-center p-1 m-1 rounded-lg",
              colors[i % colors.length]
            )}
          >
            {token}
          </div>
        ))}
      </div>

        <div className="flex items-center my-4 gap-2">
          <div>
          <div className="text-sm">
            Number of tokens: {tokens.length}
            <Badge className="mx-4">CL100K - gpt-4-32k</Badge>

            </div>
            <p className="text-sm">
                Number of words and punctuation: {text.split(" ").length}
            </p>
          </div>
        </div>
      </div>
      <Link href="https://www.npmjs.com/package/gpt-tokenizer" target="_blank">
        <div className="flex items-center gap-2">
          <Image
            src="/images/npm-logo.png"
            alt="npm logo"
            width={32}
            height={32}
          />
          GPT Tokenizer NPM Package
        </div>
      </Link>
    </div>
  );
}
