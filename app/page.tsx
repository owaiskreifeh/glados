import { ServiceCard } from "@/components/blocks/serviceCard";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col gap-4 p-8">
      <div className="header">
        <h1 className="text-2xl">ALMB <small> Magic ✨</small> </h1>
        <p className="text-sm text-gray-400">
          Services to help you pass PRs with ease
        </p>
      </div>

      <div className="flex flex-1 flex-wrap gap-4 items-center justify-center">
        <ServiceCard
          title="JSON 👉 YUP"
          link="/yup"
          description="convert json object to yup schema with an option to add validations powered by AI✨"
        />
      </div>
    </main>
  );
}
