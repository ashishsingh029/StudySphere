import { CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clearChatQueryFn } from "@/lib/api"
import useWorkspaceId from "@/hooks/use-workspace-id"
import { toast } from "@/hooks/use-toast"
const ChatHeader = () => {
    const workspaceId = useWorkspaceId()
    return (
        <CardHeader className="flex flex-row items-center p-2 justify-end">
            <Button variant="outline" className="rounded-md border-none bg-red-500 hover:bg-red-600 hover:text-white text-white px-3 py-1" onClick={ async () => {
                const response = await clearChatQueryFn(workspaceId)
                console.log(response);
                if(response.message.code === "ERR_BAD_REQUEST") {
                    console.log("Error caught in delete")
                    toast({
                        title: "Restricted",
                        description: "BKL aaukat me",
                        variant: "destructive",
                      });
                }
            }}>Clear Chat</Button>
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="ml-auto rounded-full border-none">
                        <EllipsisVerticalIcon className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Files</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu> */}
        </CardHeader>
    )
}

export default ChatHeader
