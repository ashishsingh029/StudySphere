import { sendMessageInWorkspaceQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const sendMessageInWorkspaceQuery = ({
  workspaceId,
  message,
  skip = false,
}: {
  workspaceId: string;
  message: { text: string; file: any };
  skip: boolean;
}) => {
  const query = useQuery({
    queryKey: ["messages", workspaceId],
    queryFn: () => sendMessageInWorkspaceQueryFn({ workspaceId, message}),
    staleTime: Infinity,
    retry: 2,
    enabled: !skip,
  });

  return query;
};
export default sendMessageInWorkspaceQuery;
