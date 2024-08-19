"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MarkdownPreview from "@uiw/react-markdown-preview";

import { SettingsDialog } from "./settingsDialog";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { complete } from "@/lib";
import { Loader2 } from "lucide-react";

type InstructionType = "Example" | "Explanation" | "Best Practice";
type Language = "Java" | "TypeScript" | "PHP";
type CodeFeature = "Design Pattern" | "Algorithm" | "API Integration";

interface PromptOptions {
  instructionType: InstructionType;
  language: Language;
  codeFeature: CodeFeature;
  userMessage: string;
}

function buildPrompt(options: PromptOptions): string {
  let prompt = "You are an expert in ";
  prompt += ` ${options.language} programming language. `;
  prompt += ` the user will give you a feature, algorithm, or concept. `;


  prompt += `You have been asked to `;
  switch (options.instructionType) {
    case "Example":
      prompt += `write an example of `;
      break;
    case "Explanation":
      prompt += `explain how to implement `;
      break;
    case "Best Practice":
      prompt += `describe the best practice for implementing `;
      break;
  }

  switch (options.codeFeature) {
    case "Design Pattern":
      prompt += "a design pattern";
      break;
    case "Algorithm":
      prompt += "an algorithm";
      break;
    case "API Integration":
      prompt += "an API integration";
      break;
  }

  prompt += ` that uses the ${options.language} language. `;
  prompt += ` write a complete and comprehensive`;


  return prompt;
}

export default function PromptBuilder() {
  const form = useForm({
    defaultValues: {
      instructionType: "Example",
      language: "Java",
      codeFeature: "Design Pattern",
      userMessage: "Sort a list of numbers in ascending order.",
    },
  });

  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [gptMessage, setGptMessage] = useState<string>("😴");
  const [loading, setLoading] = useState(false);
  const [streamController, setStreamController] =
    useState<AbortController | null>(null);

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const handleChange = (data: any) => {
    //@ts-ignore
    setSystemPrompt(buildPrompt(form.getValues()));
  };

  const handleCancel = () => {
    if (streamController) {
      streamController.abort();
      setStreamController(null);
      setLoading(false);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    const stream = await complete(systemPrompt, form.getValues().userMessage);
    setStreamController(stream.controller);
    let result = "";
    for await (const part of stream) {
      result += part.choices[0].delta.content ?? "";
      setGptMessage(result);
    }
    setLoading(false);
  };

  const renderSelectInput = (
    name: "instructionType" | "language" | "codeFeature",
    label: string,
    options: Array<{ label: string; value: string; description?: string }>
  ) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="col-span-3">
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      {option.label}
                      <small>{option.description}</small>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="col-span-3" />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Build a Prompt</CardTitle>
            <CardDescription>
              See how the prompt builder works by filling out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onChange={handleChange}
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                {renderSelectInput("instructionType", "Instruction Type", [
                  {
                    label: "Example",
                    value: "Example",
                  },
                  {
                    label: "Explanation",
                    value: "Explanation",
                  },
                  {
                    label: "Best Practice",
                    value: "Best Practice",
                  },
                ])}

                {renderSelectInput("language", "Language", [
                  {
                    label: "Java",
                    value: "Java",
                  },
                  {
                    label: "TypeScript",
                    value: "TypeScript",
                  },
                  {
                    label: "PHP",
                    value: "PHP",
                  },
                ])}

                {renderSelectInput("codeFeature", "Code Feature", [
                  {
                    label: "Design Pattern",
                    value: "Design Pattern",
                  },
                  {
                    label: "Algorithm",
                    value: "Algorithm",
                  },
                  {
                    label: "API Integration",
                    value: "API Integration",
                  },
                ])}

                <Separator className="my-4" />

                <FormField
                  control={form.control}
                  name={"userMessage"}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-2 items-center gap-1">
                      <FormLabel>{"Your Message"}</FormLabel>
                      <FormControl className="col-span-3">
                        <Input
                          placeholder={"Your specific request"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-3" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-4">
              <SettingsDialog />
              <p className="text-gray-400 text-sm">Keys & Settings</p>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 h-full bg-zinc-900 p-2 rounded-xl">
              {/* system prompt */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-400/40">
                <Avatar>
                  <AvatarImage src="images/system-llama.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm">{systemPrompt}</p>
                  <Badge>System Message</Badge>
                </div>
              </div>

              {/* user message */}

              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-400/20">
                <Avatar>
                  <AvatarImage src="images/curious-llama.webp" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm">{form.getValues("userMessage")}</p>
                  <Badge>User Message</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {loading ? (
              <Button variant={"destructive"} onClick={handleCancel}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancel
              </Button>
            ) : (
              <Button onClick={handleSend}>Send</Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col gap-4 h-full bg-zinc-900 p-2 rounded-xl my-4">
        <div className="flex flex-row-reverse items-center gap-2 p-2 rounded-xl bg-gray-400/40">
          <Avatar>
            <AvatarImage src="images/support-llama.png" />
            <AvatarFallback>GPT</AvatarFallback>
          </Avatar>

          <div>
            <MarkdownPreview
              source={gptMessage}
              style={{ padding: 16, background: "transparent" }}
              className="text-sm max-h-60 overflow-y-auto"
            />
            <Badge>chatGPT</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
