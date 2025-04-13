import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import ChatContent from "@/components/workspace/chat/chat-content"
import ChatFooter from "@/components/workspace/chat/chat-footer";
import { ChatSkeleton } from "@/components/skeleton-loaders/chat-skeleton";
import { useChatStore } from "@/store/use-chat-store";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";

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
      return;
    }
    socket.emit("joinWorkspace", workspaceId);
    return () => {
      socket.off("receiveMessage");
    };
  }, [user, socket, workspaceId]);

  return (
    <Card className="flex flex-1 flex-col pt-2 sm:h-[calc(88vh)] h-[calc(82vh)]">
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
