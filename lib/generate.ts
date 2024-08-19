import OpenAI from "openai";
import { GENERATE_SCHEMA_PROMPT } from "./prompts/generate-schema-prompt";
import { GENERATE_FORM_PROMPT } from "./prompts/generate-form-prompt";
import persister from "./persister";

function getGPT(apiKey: string, orgId: string) {
  if (!apiKey || !orgId) {
    throw new Error("API Key not found");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    organization: orgId,

    dangerouslyAllowBrowser: true, // disable in production
  });

  return openai;
}

export const getReadyInstance = () => {
  const settings = persister.get("settings");

  if (!settings) {
    throw new Error("Settings not found");
  }

  const { apiKey, orgId, model } = settings;

  const openai = getGPT(apiKey, orgId);
  return { openai, model };
}

export function complete(systemPrompt: string, userPrompt: string, functions?: any) {

  const { openai, model } = getReadyInstance();

  return openai.chat.completions.create({
    model,
    response_format: {
      type: "text",
    },
    stream: true,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    functions,
    function_call: functions ? 'auto' : undefined
  });
}

export async function generateSchema(schema: string, message: string) {
  const systemPrompt = GENERATE_SCHEMA_PROMPT;
  const userPrompt = `schema is ${schema} and the requirements are ${message}`;
  return complete(systemPrompt, userPrompt);
}

export async function generateForm(schema: string, message: string) {
  const systemPrompt = GENERATE_FORM_PROMPT;
  const userPrompt = `schema is ${schema} and the requirements for validation are ${message}`;
  return complete(systemPrompt, userPrompt);
}
