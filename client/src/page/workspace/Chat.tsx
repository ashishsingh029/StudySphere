import { Card } from "@/components/ui/card";
import ChatHeader from "@/components/workspace/Chat/chat-header";
import ChatContent from "@/components/workspace/Chat/chat-content";
import ChatFooter from "@/components/workspace/Chat/chat-footer";
import { ChatSkeleton } from "@/components/skeleton-loaders/chat-skeleton";
import { useState } from "react";

const Chat = () => {
  const [isLoading,setIsLoading] = useState(false)
  return (
    <Card className="flex flex-1 flex-col md:pt-3 h-[calc(88vh)]">
      {isLoading ? <>
        <ChatHeader />
        <ChatSkeleton/>
        <ChatSkeleton/>
      </>:    
      <>
        <ChatHeader />
        <ChatContent />
        <ChatFooter />
      </>}
      
    </Card>
  );
};

export default Chat;
