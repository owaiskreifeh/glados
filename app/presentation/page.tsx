import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Tokenizer } from "@/components/blocks/tokenizer";
import PromptBuilder from "@/components/blocks/promptBuilder";
import BuildingSaaSFlow from "@/components/blocks/buildingSassFlow";
import TravelAmigo from "@/components/blocks/travelAmigo";

function AIGeneratedBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group", className)}>
      {children}
      <Badge
        className={cn(
          "position-absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "w-fit"
        )}
        variant={"outline"}
      >
        AI✨ Generated
      </Badge>
    </div>
  );
}

function AIProvider({
  title,
  description,
  image,
  link,
}: {
  title: string;
  image: string;
  description?: string;
  link?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        className="rounded-full aspect-square w-12"
        src={image}
        alt={title}
        width={400}
        height={400}
      />
      <h4 className="text-3xl font-bold">{title}</h4>
      {description && (
        <p className="text-lg text-gray-500 text-center">{description}</p>
      )}
      {link && (
        <Link
          href={link}
          target="_blank"
          className="text-xs flex items-center gap-2 text-primary underline-offset-4 hover:underline"
        >
          Learn More <ExternalLink width={12} />
        </Link>
      )}
    </div>
  );
}

export default function Presentation() {
  return (
    <main className="w-full p-8 min-h-screen max-w-[1200px] mx-auto">
      <section>
        <header className="min-h-screen flex justify-between items-center">
          <div className="flex flex-col items-center gap-24">
            <h1 className="text-5xl font-bold text-center">
              <span className="text-8xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-900 to-rose-500 block">
                ALMB
              </span>
              AI✨ Talk
            </h1>

            <Link href="#llm">What is LLM? </Link>
          </div>
          <Image
            src={"/images/llama.png"}
            alt="llama"
            width={400}
            height={400}
          />
        </header>
      </section>

      <section
        id="llm"
        className="min-h-screen w-full flex justify-between items-center "
      >
        <AIGeneratedBadge>
          <Image
            src={"/images/wizard-llama.webp"}
            alt="llm"
            width={400}
            height={400}
          />
        </AIGeneratedBadge>
        <div className="flex flex-col items-center gap-12">
          <h2 className="text-5xl font-bold text-center">
            What is LLM ?<small className="text-sm">Large Language Model</small>
          </h2>
          <AIGeneratedBadge className="flex flex-col gap-8 items-start">
            <Badge>
              <Image
                src="/images/kurzgesagt-bird.png"
                alt="kurzgesagt-bird"
                width={32}
                height={32}
              />
              Written in Kurzgesagt narrating style
              <Image
                src="/images/kurzgesagt-logo.png"
                alt="kurzgesagt-logo"
                width={32}
                height={32}
              />
            </Badge>
            <p className="text-xl max-w-[700px]">
              {` Imagine a super-smart digital assistant, like a wise llama in a futuristic city. This is a Large Language Model, or LLM. Picture it reading millions of books and articles, learning the intricate dance of human language. It's not just a computer program; it's a language wizard llama. When you ask it a question, it crafts answers with the grace of a seasoned storyteller, making complex topics simple and engaging. It's like having a chat with a knowledgeable llama, always ready to enlighten you with its vast, ever-growing wisdom.`}
            </p>
            <div className="flex gap-4 justify-center items-center">
              <audio src="/audio/what-is-llm.mp3" controls />
              <Link
                href="https://www.101soundboards.com/boards/77315-kurzgesagt-tts-computer-ai-voice"
                target="_blank"
              >
                101soundboards
              </Link>
            </div>
          </AIGeneratedBadge>

          <div className="flex  items-center gap-4">
            <Link
              className="border-2 border-cyan-900 px-4 py-2 rounded-md text-xs font-bold text-white"
              href="https://www.3blue1brown.com/lessons/gpt"
            >
              <div className="flex gap-2 items-center">
                <div className="flex flex-col items-center gap-2">
                  <span>GPT</span>
                  How does it work? <span>(3blue1brown) Learn More</span>
                </div>
                <ExternalLink />
              </div>
            </Link>

            <Link
              className="border-2 border-cyan-900 px-4 py-2 rounded-md text-xs font-bold text-white"
              href="https://www.youtube.com/watch?v=wvWpdrfoEv0&ab_channel=CGPGrey"
            >
              <div className="flex gap-2 items-center">
                <div className="flex flex-col items-center gap-2">
                  <span>GPT - how does it learn?</span>6 years ago{" "}
                  <span>(CGP Grey) Learn More</span>
                </div>
                <ExternalLink />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="providers"
        className="min-h-screen w-full flex justify-between items-center "
      >
        <div className="flex flex-col items-center gap-24 flex-shrink-0">
          <h2 className="text-5xl font-bold text-center ">
            AI Providers <small className="block text-sm">as a service</small>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-12 w-full">
          <AIProvider
            title="Google Gemini"
            image="/images/gemini-logo.png"
            link="https://gemini.google.com/app"
          />
          <AIProvider
            title="OpenAI GPT"
            image="/images/gpt-logo.png"
            link="https://chat.openai.com/"
          />
          <AIProvider
            title="Meta Ollama"
            image="/images/ollama-logo.png"
            link="https://www.meta.ai/"
            description="Meta AI is the hosted version of Ollama. * not available in Jordan for now"
          />
          <AIProvider
            title="Huggingface*"
            image="/images/huggingface-logo.png"
            link="https://huggingface.co/"
            description={`
                Biggest AI model repository.
                * Not a provider, you can use it to train, fine-tune and deploy your own models.`}
          />
        </div>
      </section>

      <section
        id="ai-use-cases"
        className="min-h-screen w-full flex justify-between items-center gap-8"
      >
        <AIGeneratedBadge>
          <h3 className="text-2xl ">When AI is Beneficial</h3>
          <p>
            {`AI excels in tasks like automated calculations, data analysis, and pattern recognition.
                It's effective in customer support for handling FAQs and automating responses, and in healthcare for analyzing medical images and predicting outcomes.
                In software development, AI aids in code completion, bug detection, and automating tests.
                It also generates design ideas and automates repetitive tasks in creative fields.`}
          </p>
        </AIGeneratedBadge>

        <AIGeneratedBadge className="min-w-80">
          <Image
            src="/images/confused-llama.png"
            alt="confused llama"
            width={500}
            height={500}
          />
        </AIGeneratedBadge>

        <AIGeneratedBadge>
          <h3 className="text-2xl ">When AI is Not the Best Solution</h3>
          <p>
            {`AI struggles with tasks requiring complex problem-solving, creativity, and nuanced understanding.
                It's less effective in writing nuanced articles, diagnosing rare diseases, and providing empathetic customer support.
                In software development, AI can't replace strategic planning, system design, and interpreting user feedback.
                Legal judgments, unique creative designs, and human resources decisions involving interpersonal skills also require human expertise.`}
          </p>
        </AIGeneratedBadge>
      </section>

      <section
        id="tokens"
        className="min-h-screen w-full flex gap-24 items-center "
      >
        <div className="flex flex-col items-center gap-24 flex-shrink-0">
          <div>
            <h2 className="text-5xl font-bold text-center ">
              Tokens
              <small className="block text-sm underline cursor-pointer"></small>
            </h2>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">not words 🤔</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between flex-col space-x-4">
                  <p className="text-sm text-gray-400">
                    {`
                    OpenAI's large language models (sometimes referred to as GPT's) process text using tokens, which are common sequences of characters found in a set of text. The models learn to understand the statistical relationships between these tokens, and excel at producing the next token in a sequence of tokens.
                `}
                  </p>
                  <p>
                    {`
                    Tokens are the building blocks of natural language. They are the smallest units of meaning that the model can understand.
                    `}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="w-full">
          <Tokenizer />
        </div>
      </section>

      <section
        id="prompts"
        className="min-h-screen w-full flex  gap-24 items-center "
      >
        <div className="flex flex-col items-center gap-24 flex-shrink-0">
          <div>
            <h2 className="text-5xl font-bold text-center ">
              Prompts
              <small className="block text-sm">It still not a human</small>
            </h2>
          </div>
        </div>

        <div>
          <PromptBuilder />
        </div>
      </section>

      <section
        id="json-yup"
        className="min-h-screen w-full flex  gap-24 items-center "
      >
        <div className="flex flex-col items-center gap-24 flex-shrink-0">
          <div>
            <h2 className="text-5xl font-bold text-center ">
              {`{JSON}`} 👉 Yup
              <small className="block text-sm">Real-life example</small>
            </h2>
            <div className="m-5 flex justify-center items-center">
              <Link href={"/yup"}>View App</Link>
            </div>
          </div>
        </div>

        <div className="aspect-video min-w-[300px] w-full">
          <BuildingSaaSFlow />
        </div>
      </section>

      <section
        id="travel-amigo"
        className="min-h-screen w-full flex gap-24 items-center "
      >
        <div className="flex flex-col items-center gap-24 flex-shrink-0">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-5xl font-bold text-center ">
              TravelAmigo
              <small className="block text-sm">
                Using chatGPT Function Calls
              </small>
            </h2>

            <Image src={'/images/amigo-llama.png'} alt="amigo llama" 
            className="rounded-full"
            width={200} height={200} />
          </div>
        </div>

        <div className="w-full">
          <TravelAmigo />
        </div>
      </section>
    </main>
  );
}
