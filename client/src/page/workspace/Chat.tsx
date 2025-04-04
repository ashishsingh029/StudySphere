import { useEffect } from "react";
import { Card } from "@/components/ui/card";
// import ChatHeader from "@/components/workspace/Chat/chat-header";
import ChatContent from "@/components/workspace/Chat/chat-content";
import ChatFooter from "@/components/workspace/Chat/chat-footer";
import { ChatSkeleton } from "@/components/skeleton-loaders/chat-skeleton";
import { useChatStore } from "@/store/use-chat-store";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
// import chatbgImage from "../../assets/chatbg.jpg";

const Chat = () => {
  const { isMessagesLoading, getMessages, setupSocketListeners } = useChatStore();
  const workspaceId = useWorkspaceId();

  useEffect(() => {
    getMessages(workspaceId);
    setupSocketListeners();
  }, [workspaceId]);

  const { user } = useAuthContext();
  const socket = useChatStore((state) => state.socket);

  useEffect(() => {
    if (!user || !socket || !workspaceId) {
      console.log(user, socket, workspaceId);
      return;
    }
    socket.emit("joinWorkspace", workspaceId);
    return () => {
      socket.off("receiveMessage");
    };
  }, [user, socket, workspaceId]);

  return (
    <Card className="flex flex-1 flex-col md:pt-3 h-[calc(88vh)]">
      {isMessagesLoading ? (
        <ChatSkeleton />
      ) : (
        <>
          {/* <ChatHeader /> */}
          <ChatContent />
          <ChatFooter />
        </>
      )}
    </Card>
  );
};

export default Chat;
