// import { createContext, useContext } from "react";
// import useWorkspaceId from "@/hooks/use-workspace-id";
// import useGetMessagesInWorkspaceQuery from "@/hooks/api/use-get-messages";

// // Define the message type properly
// type ReceivedMessageType = {
//   text: string;
//   file: string;
// };

// // Define the context shape
// type ChatContextType = {
//   messages: ReceivedMessageType[];
//   isMessageLoading: boolean;
//   refetchMessages: () => void;
//   error?: any;
// };

// // Create Chat Context
// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const workspaceId = useWorkspaceId();

//   // Fetch messages for the workspace
//   const {
//     data: messagesData,
//     isLoading: isMessageLoading,
//     error: messageError,
//     refetch: refetchMessages,
//   } = useGetMessagesInWorkspaceQuery({ workspaceId });

//   // ✅ Transform messagesData into an array of MessageType
//   const formattedMessages: ReceivedMessageType[] = messagesData?.message
//     ? [messagesData.message] // Wrap in an array if it's an object
//     : [];

//   return (
//     <ChatContext.Provider
//       value={{
//         messages: formattedMessages,
//         isMessageLoading,
//         refetchMessages,
//         error: messageError,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// // Custom Hook for using the Chat Context
// export const useChatContext = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChatContext must be used within a ChatProvider");
//   }
//   return context;
// };
