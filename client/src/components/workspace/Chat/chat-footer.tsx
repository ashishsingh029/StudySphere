import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/use-chat-store";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";
import profanity from "@devshubham/clean-speech-hindi"

const ChatFooter = () => {
  const [input, setInput] = useState("");
  const [isSendingMessage, setIsSendingMesage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { sendMessage } = useChatStore();
  const workspaceId = useWorkspaceId();
  const inputLength = input.trim().length;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 512) {
      toast({
        title: "File too Large",
        description: "Max. allowed Size is 512KB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({ name: file.name, preview: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inputLength === 0 && !selectedFile) return;
    if (!workspaceId) return;

    const messageData = {
      text: profanity.maskBadWords(input),
      file: selectedFile?.preview || undefined,
      filename: selectedFile?.name || undefined,
    };

    try {
      setIsSendingMesage(true);
      await sendMessage(messageData, workspaceId);
      setInput("");
      removeSelectedFile();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSendingMesage(false);
    }
  };

  return (
    <CardFooter className="py-3 flex flex-col space-y-2">
      {/* Display Selected File on the Right */}
      {selectedFile && (
        <div className="flex justify-start w-full">
          <div className="flex items-center bg-gray-200 p-1 rounded-md max-w-[30vw] text-xs space-x-1">
            <span className="truncate text-gray-700 max-w-[25vw]">
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={removeSelectedFile}
              className="text-red-500"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="flex w-full items-center space-x-2"
      >
        <Input
          id="message"
          placeholder="Type your message..."
          className="flex-1 bg-slate-200 border-none hover:shadow-blue-400 focus-visible:ring-0"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Button
          type="button"
          size="icon"
          className="bg-gray-400"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSendingMessage}
        >
          <Paperclip className="size-5" />
        </Button>

        <Button
          type="submit"
          size="icon"
          className="bg-blue-600"
          disabled={isSendingMessage || (inputLength === 0 && !selectedFile)}
        >
          <Send className="size-5" />
        </Button>
      </form>
    </CardFooter>
  );
};

export default ChatFooter;
