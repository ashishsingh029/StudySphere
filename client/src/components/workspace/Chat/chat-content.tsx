import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CardContent } from "@/components/ui/card"
import { useState } from "react";


const ChatContent = () => {
    const [messages, setMessages] = useState([
        { role: "agent", sender: "Toby", content: "Hey! How are you doing?", time: "09:25 AM" },
        { role: "user", sender: "You", content: "I'm doing great! Just finished working on that new feature we discussed.", time: "09:27 AM" },
        { role: "agent", sender: "Toby", content: "That's awesome! Can't wait to see it. When do you think it'll be ready for review?", time: "09:28 AM" },
        { role: "user", sender: "You", content: "I'm just running some final tests. Should be ready in about an hour!", time: "09:30 AM" },
        { role: "agent", sender: "Toby", content: "Perfect! I'll check it out once it's ready. Is there anything specific you'd like me to focus on during the review?", time: "09:32 AM" }
      ]);
  return (
       <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message:any, index:number) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-start`}>
              {/* Avatar on the left for received messages, on the right for sent messages */}
              {message.role !== "user" && (
                <Avatar className="size-8 mr-3">
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
              )}

              {/* Message Content */}
              <div className="flex flex-col max-w-[75%]">
                {message.role === "user" ?
                <>
                <p className={"font-semibold text-[0.62rem] text-right text-red-500"}>
                  {message.sender}
                </p>
                <div className={"px-4 py-2  rounded-l-lg rounded-br-2xl text-[0.7rem] bg-gray-500 text-primary-foreground"}>
                  <p>{message.content}</p>
                </div>
                <p className={"text-[0.6rem] text-gray-600 mt-1 text-right"}>
                  {message.time}
                </p>
                </> : 
                
                <>
                <p className={"font-semibold text-[0.62rem] text-blue-500"}>
                  {message.sender}
                </p>
                <div className={"px-4 py-2  rounded-r-lg rounded-bl-2xl text-[0.7rem] bg-muted"}>
                  <p>{message.content}</p>
                </div>
                <p className={"text-[0.6rem] text-gray-600 mt-1 text-left"}>
                  {message.time}
                </p>
                </>}
                
              </div>

              {message.role === "user" && (
                <Avatar className="size-8 ml-3">
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </CardContent>
  )
}

export default ChatContent
