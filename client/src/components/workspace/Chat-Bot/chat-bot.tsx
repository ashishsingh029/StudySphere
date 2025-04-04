import { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { getGeminiResponse } from "@/lib/gemini-service";
import profanity from "@devshubham/clean-speech-hindi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const filteredMsg = profanity.maskBadWords(input);
    const userMessage: Message = { text: filteredMsg, sender: "user" };
    setMessages((prev) => [...prev.slice(-9), userMessage]);
    setInput("");
    setLoading(true);

    try {
      const instruction = `
        Answer in a **maximum of 8 lines**. Keep responses concise and clear.
        If necessary, provide key points in bullet format.
      `;

      const botResponse = await getGeminiResponse(`${instruction}\nUser: ${filteredMsg}`);
      const formattedResponse = formatBotResponse(botResponse);
      setMessages((prev) => [...prev.slice(-9), { text: formattedResponse, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(-9),
        { text: "Error fetching response", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatBotResponse = (response: string | undefined): string => {
    if(!response) {
      return `<li class="mb-2">${"No response"}</li>`;
    }
    const cleanedResponse = response.replace(/\*\*/g, "");
    const formattedResponse = cleanedResponse.replace(
      /(\*\*([^*]+)(\*+)\*\*)/g,
      (p2) => `<strong class="font-bold">${p2}</strong>`
    );

    const points = formattedResponse
      .split("\n")
      .map((line) => {
        if (line.trim()) {
          if (line.startsWith("•")) {
            return `<li class="mb-2">• ${line.replace(/^•\s*/, "").trim()}</li>`;
          }
          return `<li class="mb-2">${line.trim()}</li>`;
        }
        return "";
      })
      .filter(Boolean);

    return `<ul class="list-disc pl-6 text-white">${points.join("")}</ul>`;
  };

  return (
    <div className="fixed bottom-1 h-screen right-0 z-50">
      {isOpen && (
        <Card className="w-[36vw] h-full flex flex-col border bg-background shadow-lg">
          <div className="bg-secondary px-4 py-2 flex items-center justify-between border-b bg-slate-200">
            <span className="text-base font-medium">How can I help you?</span>
            <Button variant="ghost" className="hover:bg-slate-300" size="sm" onClick={() => setIsOpen(false)}>
              <ArrowRight size={20} />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4 space-y-3 bg-gray-100">
            {messages.map((msg, index) =>
              msg.sender === "bot" ? (
                <div
                  key={index}
                  className="bg-secondary bg-slate-600 text-white text-sm py-2 px-3 my-3 rounded-r-lg rounded-bl-xl w-fit max-w-[70%]"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ) : (
                <div
                  key={index}
                  className="bg-green-500 text-white text-sm py-2 px-3 rounded-l-lg rounded-br-xl ml-auto my-3 w-fit max-w-[70%]"
                >
                  {msg.text}
                </div>
              )
            )}
            {loading && <div className="text-gray-400 text-sm">Typing...</div>}
          </ScrollArea>

          <div className="flex items-center gap-2 border-t p-2 bg-slate-200">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="bg-slate-50 focus-visible:ring-0 hover:shadow-green-400"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} size="icon" className="bg-green-600 hover:bg-green-700">
              <Send size={20} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
