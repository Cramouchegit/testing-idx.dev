import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface Prompt {
  sender: "user" | "bot";
  content: string;
}

declare global {
  interface Window {
    ai: {
      createTextSession: any;
    };
  }
}

export default function Home() {
  const [chat, setChat] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);

  const sendPrompt = async (prompt: string) => {
    const session = await window.ai.createTextSession();

    console.log("session", session);

    const response = await session.prompt(prompt);
    setChat((prev) => [
      ...prev,
      {
        sender: "bot",
        content: response.text,
      },
    ]);

    session.destroy();

    setLoading(false);
  };

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const prompt = form.prompt.value;

    if (!prompt) return;

    setChat((prev) => [
      ...prev,
      {
        sender: "user",
        content: prompt,
      },
    ]);

    form.reset();

    setLoading(true);
    sendPrompt(prompt);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center w-screen gap-10 ${inter.className}`}
    >
      <div className="w-1/2 border rounded-lg h-[80vh] p-6 overflow-auto">
        {chat.map((item: Prompt, id: number) => (
          <div
            className={`w-full flex flex-col gap-1 ${
              item.sender === "user" ? "items-start" : "items-end"
            }`}
            key={`chat-${id}`}
          >
            <h4 className="text-sm font-semibold">{item.sender}</h4>
            <p
              className={`text-lg w-fit bg-slate-300 px-4 py-2 rounded-3xl max-w-[45%] ${
                item.sender === "user" ? "rounded-tl-none" : "rounded-tr-none"
              }`}
            >
              {item.content}
            </p>
          </div>
        ))}
      </div>
      <form className="flex gap-4 w-1/2" onSubmit={handleForm}>
        <input
          type="text"
          name="prompt"
          className="border px-4 py-2 rounded-md flex-1"
          autoComplete="off"
          placeholder="ask ai"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50"
        >
          {loading ? "sending..." : "send"}
        </button>
      </form>
    </main>
  );
}
