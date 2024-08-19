"use client";
import places from "@/app/mocks/places.json";
import people from "@/app/mocks/travelamigos.json";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, SendIcon } from "lucide-react";
import { cn, getReadyInstance } from "@/lib";
import { SettingsDialog } from "./settingsDialog";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions.mjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MarkdownPreview from "@uiw/react-markdown-preview";

export interface Place {
  name: string;
  avg_temp: number;
  access_to_sea: boolean;
  nature: string;
  avg_budget: number;
  points_of_interest: string[];
}

export interface Person {
  name: string;
  age: number;
  interests: string[];
}

function getPlaces(params: Partial<Place>): Place[] {
  return places.filter(
    (place) =>
      (params.name
        ? place.name.toLowerCase() === params.name.toLowerCase()
        : true) &&
      (params.avg_temp
        ? params.avg_temp - 5 < place.avg_temp ||
          place.avg_temp < params.avg_temp + 5
        : true) &&
      (params.access_to_sea !== undefined
        ? place.access_to_sea === params.access_to_sea
        : true) &&
      (params.nature
        ? place.nature.toLowerCase() === params.nature.toLowerCase()
        : true) &&
      (params.avg_budget ? place.avg_budget === params.avg_budget : true) &&
      (params.points_of_interest
        ? params.points_of_interest.every((poi) =>
            place.points_of_interest.includes(poi)
          )
        : true)
  );
}

function getPeople(params: Partial<Person>): Person[] {
  return people.filter(
    (person) =>
      (params.name
        ? person.name.toLowerCase() === params.name.toLowerCase()
        : true) &&
      (params.age
        ? person.age >= params.age - 2 && person.age <= params.age + 2
        : true) &&
      (params.interests
        ? params.interests.every((interest) =>
            person.interests.includes(interest)
          )
        : true)
  );
}

const getPlaceFunction = {
  name: "getPlaces",
  description:
    "Retrieve details of places to visit including average temperature, access to sea, nature type, average budget, and points of interest.",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of the place to retrieve details for.",
      },
      avg_temp: {
        type: "number",
        description: "The average temperature of the place.",
      },
      access_to_sea: {
        type: "boolean",
        description: "Indicates if the place has access to the sea.",
      },
      nature: {
        type: "string",
        description:
          "The type of nature in the place (e.g., tropical, forested, coastal, urban, etc.).",
      },
      avg_budget: {
        type: "number",
        description: "The average budget required to visit the place.",
      },
      points_of_interest: {
        type: "array",
        items: {
          type: "string",
        },
        description: "A list of points of interest in the place.",
      },
    },
    required: ["name"],
  },
};

const getAmigoFunction = {
  name: "getPeople",
  description:
    "Retrieve a list of people interested in visiting certain places with details such as name, age, and their interests.",
  parameters: {
    type: "object",
    properties: {
      personName: {
        type: "string",
        description: "The name of the person to retrieve details for.",
      },
    },
    required: ["personName"],
  },
};

function ChatMessage({ message }: { message: ChatCompletionMessageParam }) {
  return (
    <div
      className={cn(
        "m-2 bg-gray-800 rounded-xl p-2 flex gap-2 items-center",
        message.role === "user" ? " bg-zinc-900 flex-row-reverse" : ""
      )}
    >
      {message.role === "user" ? (
        <Avatar>
          <AvatarImage src="images/curious-llama.webp" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar>
          <AvatarImage src="images/system-llama.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
      <MarkdownPreview
        style={{ background: "transparent" }}
        source={typeof message.content === 'string' ? message.content : ''}
      />
    </div>
  );
}

export default function TravelAmigo() {
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>("");
  const [chat, setChat] = useState<ChatCompletionMessageParam[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (callCount = 0) => {
    const chatHistory = chat;
    const userPrompt = value;

    if (callCount === 4) {
      chatHistory.push({
        role: "assistant",
        content: "Something went wrong! im repeating my self!",
      });
    }

    setValue("");
    setLoading(true);

    const systemPrompt =
      "You're an expert at travel counseling, you have access to places and people as tools, try to find the best matching place and person to the user request";

    const tools: ChatCompletionTool[] = [
      {
        type: "function",
        function: getPlaceFunction,
      },
      {
        type: "function",
        function: getAmigoFunction,
      },
    ];

    if (chatHistory.length === 0) {
      chatHistory.push({
        role: "system",
        content: systemPrompt,
      });
    }

    const lastUserMessage = chatHistory.findLast(
      (message) => message.role == "user"
    );
    if (userPrompt.trim() && lastUserMessage?.content !== userPrompt) {
      chatHistory.push({
        role: "user",
        content: userPrompt,
      });
    }

    const { openai, model } = getReadyInstance();
    const response = await openai.chat.completions.create({
      model,
      response_format: {
        type: "text",
      },
      messages: chatHistory,
      tools,
      tool_choice: "auto",
      temperature: 0.9,
    });
    const finishReason = response.choices[0].finish_reason;
    const message = response.choices[0].message;
    chatHistory.push(message);

    if (finishReason === "tool_calls") {
      const tools = message.tool_calls;
      tools?.forEach((tool) => {
        const func = tool.function;
        const parameters = JSON.parse(func.arguments);
        if (func.name === "getPlaces") {
          const places = getPlaces(parameters);
          chatHistory.push({
            role: "tool",
            tool_call_id: tool.id,
            content:
              places.length < 1
                ? "could not find any places"
                : JSON.stringify({
                    places,
                  }),
          });
        } else if (func.name === "getPeople") {
          const person = getPeople(parameters.personName);
          chatHistory.push({
            role: "tool",
            tool_call_id: tool.id,
            content:
              person.length < 1
                ? "could not find any one"
                : JSON.stringify({
                    person,
                  }),
          });
        }
      });
      setChat(chatHistory);
      setTimeout(() => {
        handleSend(callCount + 1);
      }, 400);
    } else {
      setChat(chatHistory);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatPanelRef.current?.scroll({
      behavior: "smooth",
      top: 100000,
    });
  }, [loading]);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={chatPanelRef}
        className="max-h-[600px] overflow-auto bg-gray-900 rounded-xl shadow-xl"
      >
        {chat
          .filter(
            (message) =>
              message.content &&
              message.role !== "system" &&
              message.role !== "tool"
          )
          .map((message, index) => {
            console.log("chat", message.role);

            return (
              <div key={index}>
                <ChatMessage message={message} />
              </div>
            );
          })}
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Textarea
            placeholder="lets find a place to go!!! ¿A donde quieres ir? "
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <span className="text-xs text-gray-400">
            * This will always use way more tokens!
          </span>
        </div>
        <div className="flex gap-4">
          <Button
            disabled={loading}
            size="icon"
            type="button"
            onClick={() => {
              handleSend();
            }}
          >
            <SendIcon />
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
          <SettingsDialog />
        </div>
      </div>
    </div>
  );
}
