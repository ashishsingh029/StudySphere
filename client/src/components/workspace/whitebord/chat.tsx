import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/auth-provider";
import { socket } from "@/lib/whiteboard-socket"
import { useParams } from "react-router-dom";

interface Message {
    content: string;
    userId: string;
    userName: string;
    roomId?: string;
    timestamp?: string;
}

const Chat = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const { user } = useAuthContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const inputLength = input.trim().length;

    useEffect(() => {
        const handleMessage = (data: {
            message: string;
            userId: string;
            userName: string;
            roomId: string;
            timestamp: string;
        }) => {
            setMessages((prev) => [
                ...prev,
                {
                    content: data.message,
                    userId: data.userId,
                    userName: data.userName,
                    roomId,
                    timestamp: data.timestamp,
                },
            ]);
        };

        socket.on("message", handleMessage);
        return () => {
            socket.off("message", handleMessage);
        };
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !input.trim()) return;

        const messageData = {
            roomId,
            message: input,
            userId: user._id,
            userName: user.name,
        };

        socket.emit("message", messageData);

        setMessages((prev) => [
            ...prev,
            {
                content: input,
                userId: user._id,
                userName: user.name,
                roomId,
                timestamp: new Date().toISOString(),
            },
        ]);

        setInput("");
    };

    return (
        <>
            <CardContent className="overflow-y-auto p-2 ]">
                {messages.length === 0 ? <span className="text-muted">"No message to read"</span> :
                    <div className="space-y-8">
                        {messages.map((message, index) => {
                            const isMe = message.userId === user?._id;
                            return (
                                <div key={index} className={cn("flex flex-col mb-2", isMe ? "items-end" : "items-start")}>
                                    {/* Display userName above the bubble */}
                                    <p className={cn(
                                        "text-xs font-medium mb-1",
                                        isMe ? "text-right text-red-500" : "text-left text-blue-600"
                                    )}>
                                        {isMe ? "You" : message.userName}
                                    </p>

                                    <div
                                        className={cn(
                                            "relative w-fit max-w-[75%] px-4 py-2 shadow-md transition-all",
                                            isMe
                                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-l-xl rounded-br-xl mr-2"
                                                : "bg-muted text-black rounded-r-xl rounded-bl-xl ml-2"
                                        )}
                                    >
                                        <p className="break-words">{message.content}</p>
                                        <p className="absolute -bottom-5 right-0 text-[0.55rem] text-gray-500 mt-1">
                                            {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={messagesEndRef} />
                    </div>
                }
            </CardContent>
            <CardFooter className="w-full p-1 absolute bottom-0 bg-blue-300">
                <form
                    onSubmit={handleMessageSend}
                    className="flex items-center space-x-2 w-full"
                >
                    <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1 bg-white focus-visible:ring-0 border-none rounded-md px-4"
                        autoComplete="off"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-md bg-blue-700 hover:bg-blue-500 text-white"
                        disabled={inputLength === 0}
                    >
                        <Send className="size-5" />
                    </Button>
                </form>
            </CardFooter>
        </>
    );
};

export default Chat;
