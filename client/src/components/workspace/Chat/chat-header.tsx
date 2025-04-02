import { CardHeader } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"
import { EllipsisVerticalIcon } from "lucide-react";

const ChatHeader = () => {
    return (
        <CardHeader className="flex flex-row items-center p-2">
            <DropdownMenu>
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
            </DropdownMenu>
        </CardHeader>
    )
}

export default ChatHeader
