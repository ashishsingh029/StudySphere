import { useEffect } from "react";
import { Card } from "@/components/ui/card";
// import ChatHeader from "@/components/workspace/Chat/chat-header";
import ChatContent from "@/components/workspace/Chat/chat-content";
import ChatFooter from "@/components/workspace/Chat/chat-footer";
import { ChatSkeleton } from "@/components/skeleton-loaders/chat-skeleton";
import { useChatStore } from "@/store/use-chat-store";
import useWorkspaceId from "@/hooks/use-workspace-id";
// import chatbgImage from "../../assets/chatbg.jpg";

const Chat = () => {
  const { isMessagesLoading, getMessages } = useChatStore();
  const workspaceId = useWorkspaceId();

  useEffect(() => {
    if (workspaceId) {
      getMessages(workspaceId);
    }
  }, [workspaceId]);

  return (
    <Card className="flex flex-1 flex-col md:pt-3 h-[calc(88vh)]">
      {isMessagesLoading ? (
        <ChatSkeleton />
      ) : (
        <>
          <ChatContent />
          <ChatFooter />
        </>
      )}
    </Card>
  );
};

export default Chat;
