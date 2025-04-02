import { getMessagesByWorkspaceIdQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetMessagesInWorkspaceQuery = ({
  workspaceId,
  skip = false,
}: {
  workspaceId: string;
  skip?: boolean;
}) => {
  const query = useQuery({
    queryKey: ["messages", workspaceId],
    queryFn: () => getMessagesByWorkspaceIdQueryFn({ workspaceId }),
    staleTime: Infinity,
    retry: 2,
    enabled: !skip,
  });

  return query;
};
export default useGetMessagesInWorkspaceQuery;
