import { useChatStore } from "@/store/use-chat-store";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { useAuthContext } from "@/context/auth-provider";
import { formatMessageTime } from "@/lib/dateFormatter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper Functions
const getFileExtension = (url: string) =>
  url.split(".").pop()?.toLowerCase() || "";

const isImage = (url: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  return imageExtensions.includes(getFileExtension(url));
};

const generateRandomFileName = (extension: string) => {
  const randomString = Math.random().toString(36).substring(3, 15); // 10-12 chars
  return `${randomString}.${extension}`;
};

const ChatContent = () => {
  const { messages } = useChatStore();
  const { user } = useAuthContext();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <CardContent className="flex-1 overflow-y-auto space-y-4 h-[calc(80vh)]">
      {messages.map((message, index: number) => {
        const isCurrentUser = message.senderId === user?._id;
        return (
          <div
            key={index}
            className={`flex items-start ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
            ref={messageEndRef}
          >
            {/* If the message is from another user */}
            {!isCurrentUser ? (
              <>
                {/* Avatar */}
                <Avatar className="size-8 mr-3">
                  <AvatarImage src={user?.profilePicture || ""} />
                  <AvatarFallback className="rounded-full bg-pink-200">
                    {user?.name?.split(" ")?.[0]?.charAt(0)}
                    {user?.name?.split(" ")?.[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Message Box */}
                <div className="flex flex-col max-w-[75%]">
                  <p className="font-semibold text-[0.62rem] text-left text-blue-500">
                    {message.senderName}
                  </p>

                  {/* File Handling */}
                  {message.file && (
                    <div className="">
                      {isImage(message.file) ? (
                        <a
                          href={message.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={message.file}
                            alt="Attachment"
                            className="sm:max-w-[200px] rounded-md"
                          />
                        </a>
                      ) : (
                        <div className="flex items-center space-x-2 bg-gray-300 p-2 rounded-md w-fit">
                          <span className="bg-gray-200 px-3 py-1 rounded-md text-sm text-gray-700">
                            {generateRandomFileName(
                              getFileExtension(message.file)
                            )}
                          </span>
                          <a
                            href={message.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Button
                              variant="destructive"
                              size="sm"
                              className="size-8"
                            >
                              <Download className="size-1" />
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Message */}
                  {message.text && (
                    <div className="px-4 py-2 text-sm bg-purple-200 text-black rounded-r-lg rounded-bl-2xl">
                      <p>{message.text}</p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[0.6rem] text-gray-600 mt-1 text-left">
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </>
            ) : (
              /* If the message is from the logged-in user */
              <>
                {/* Message Box */}
                <div className="flex flex-col max-w-[75%]">
                  <p className="font-semibold text-[0.62rem] text-right text-red-600">
                    You
                  </p>

                  {/* File Handling */}
                  {message.file && (
                    <div className="">
                      {isImage(message.file) ? (
                        <a
                          href={message.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={message.file}
                            alt="Attachment"
                            className="sm:max-w-[200px] rounded-md"
                          />
                        </a>
                      ) : (
                        <div className="flex items-center space-x-2 bg-gray-300 p-2 rounded-md w-fit">
                          <span className="bg-gray-200 px-3 py-1 rounded-md text-gray-700 text-sm">
                            {generateRandomFileName(
                              getFileExtension(message.file)
                            )}
                          </span>
                          <a
                            href={message.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Button
                              variant="destructive"
                              size="sm"
                              className="size-8"
                            >
                              <Download className="size-1" />
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Message */}
                  {message.text && (
                    <div className="px-4 py-2 text-sm bg-orange-100 text-black rounded-l-lg rounded-br-2xl">
                      <p>{message.text}</p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[0.6rem] text-gray-600 mt-1 text-right">
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>

                {/* Avatar */}
                <Avatar className="size-8 ml-3">
                  <AvatarImage src={user?.profilePicture || ""} />
                  <AvatarFallback className="rounded-full bg-red-200">
                    {user?.name?.split(" ")?.[0]?.charAt(0)}
                    {user?.name?.split(" ")?.[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </>
            )}
          </div>
        );
      })}
    </CardContent>
  );
};
export default ChatContent;
