"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { js_beautify } from "js-beautify";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "@/components/blocks/settingsDialog";
import { inferYupSchema, schemaToString } from "@/lib/toYup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSchema } from "@/lib";
import persister from "@/lib/persister";
import { CodeEditor } from "@/components/blocks/codeEditor";
const initialJSON = `{
  "employee": {
      "name":       "sonoo",
      "salary":      56000,
      "married":    true
  }
}  `;
export default function GenerateForm() {
  const [schema, setSchema] = useState("const schema = yup.object().shape({");
  const [gtpSchema, setGPTSchema] = useState("");
  const [value, setValue] = useState(initialJSON);
  const [chat, setChat] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("original");
  const [loading, setLoading] = useState(false);
  const [streamController, setStreamController] =
    useState<AbortController | null>(null);

  const settings = persister.get("settings");

  const handleChange = useCallback((value: string) => {
    setSchema("");
    setValue(value);

    try {
      const json = JSON.parse(value);
      setErrors([]);
      const schema = inferYupSchema(json);
      setSchema(
        js_beautify(schemaToString(schema), {
          indent_size: 2,
          indent_char: " ",
          eol: "\n",
          indent_level: 0,
        })
      );
    } catch (e: any) {
      setErrors([e.message]);
    }
  }, []);

  const handleAskGPTClick = useCallback(async () => {
    setSelectedTab("gpt");
    setLoading(true);
    const stream = await generateSchema(schema, chat);
    setStreamController(stream.controller);
    let result = "";
    for await (const part of stream) {
      result += part.choices[0].delta.content ?? "";
      setGPTSchema(result);
    }
    setLoading(false);
  }, [chat, schema]);

  const handleAbortClick = useCallback(() => {
    if (streamController) {
      streamController.abort();
      setLoading(false);
    }
  }, [streamController]);

  return (
    <main className="h-screen flex-col gap-4 flex p-8">
      <h1 className="text-5xl font-black text-center">{`{JSON}`} 👉 YUP</h1>

      <ResizablePanelGroup
        direction="horizontal"
        className="w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={30} className="flex flex-col">
          <div className="flex justify-center p-2">
            <span className="font-semibold">JSON</span>
          </div>
          <div className="flex-1 overflow-y-auto m-4 ">
            <CodeEditor
              value={value}
              onValueChange={handleChange}
              className="p-4 h-full rounded-lg my-2"
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} className="p-4">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} className="flex flex-col">
              <Tabs
                className="flex-1 overflow-y-auto m-4 "
                defaultValue="original"
                value={selectedTab}
                onValueChange={setSelectedTab}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="gpt">Magic ✨</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="flex-1 flex overflow-y-auto m-4 "
                  value="original"
                >
                  <CodeEditor
                    value={
                      errors.length > 0 ? JSON.stringify(errors) : schema ?? ""
                    }
                    className="p-4 rounded-lg flex-1"
                  />
                </TabsContent>
                <TabsContent
                  className="flex-1 overflow-y-auto m-4 "
                  value="gpt"
                >
                  <CodeEditor value={gtpSchema} className="p-4 rounded-lg" />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
              <div className="flex flex-col justify-center items-center p-2">
                <span className="font-semibold">
                  Edit schema with AI <small>Powered by GPT</small>
                </span>
                {/* caption */}
                <span className="text-xs text-gray-500">
                  <small>
                    🔑 Open settings modal and provide your keys in order to use
                    this feature
                  </small>
                </span>
              </div>
              <div className="flex items-center gap-4 m-4">
                <Textarea
                  disabled={!settings?.apiKey}
                  value={chat}
                  onChange={(e) => setChat(e.target.value)}
                  placeholder={`Magic ✨| ${
                    settings?.apiKey
                      ? "Make name required and min length 2"
                      : "Provide your OpenAI API Key to ✨"
                  }`}
                />
                {loading ? (
                  <Button variant={"ghost"} onClick={handleAbortClick}>
                    Cancel
                  </Button>
                ) : (
                  <Button disabled={!chat.trim()} onClick={handleAskGPTClick}>
                    Send
                  </Button>
                )}
                <SettingsDialog />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
