import { useChatStore } from "@/store/use-chat-store";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { formatMessageTime } from "@/lib/dateFormatter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper Functions
const getFileExtension = (url: string) => url.split(".").pop()?.toLowerCase() || "";

const isImage = (url: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  return imageExtensions.includes(getFileExtension(url));
};

const generateRandomFileName = (extension: string) => {
  const randomString = Math.random().toString(36).substring(3, 15); // 10-12 chars
  return `${randomString}.${extension}`;
};

const ChatContent = () => {
  const { messages, getMessages } = useChatStore();
  const { user } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (workspaceId) getMessages(workspaceId);
  }, [workspaceId, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!messages) {
    return (
      <CardContent className="flex-1 overflow-y-auto p-4 text-2xl">
        No messages available.
      </CardContent>
    );
  }

  return (
    <CardContent className="flex-1 overflow-y-auto space-y-4">
      {messages.map((message, index: number) => {
        const isCurrentUser = message.senderId === user?._id;

        return (
          <div
            key={index}
            className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"}`}
            ref={messageEndRef}
          >
            {/* Avatar */}
            {!isCurrentUser && (
              <Avatar className="size-8 mr-3">
                <AvatarFallback>{message.senderId.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}

            {/* Message Box */}
            <div className="flex flex-col max-w-[75%]">
              <p className={`font-semibold text-[0.62rem] ${isCurrentUser ? "text-right text-red-600" : "text-left text-blue-500"}`}>
                {isCurrentUser ? "You" : message.senderId}
              </p>

              {/* File Handling */}
              {message.file && (
                <div className="flex items-center space-x-2 bg-gray-300 p-2 rounded-md w-fit">
                  {isImage(message.file) ? (
                    <a
                      href={message.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img src={message.file} alt="Attachment" className="sm:max-w-[200px] rounded-md" />
                    </a>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-200 px-3 py-1 rounded-md text-gray-700">
                        {generateRandomFileName(getFileExtension(message.file))}
                      </span>
                      <a href={message.file} target="_blank" rel="noopener noreferrer" download>
                        <Button variant="destructive" size="sm" className="size-8">
                          <Download className="size-1" />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Text Message */}
              {message.text && (
                <div
                  className={`px-4 py-2 text-sm ${
                    isCurrentUser ? "bg-gray-500 text-white rounded-l-lg rounded-br-2xl" : "bg-purple-200 text-black rounded-r-lg rounded-bl-2xl"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              )}

              {/* Timestamp */}
              <p className={`text-[0.6rem] text-gray-600 mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                {formatMessageTime(message.createdAt)}
              </p>
            </div>

            {/* Avatar for Current User */}
            {isCurrentUser && (
              <Avatar className="size-8 ml-3">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
    </CardContent>
  );
};

export default ChatContent;
