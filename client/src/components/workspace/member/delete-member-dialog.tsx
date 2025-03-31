import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { Member, MemberType, TaskType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog";

// interface DataTableRowActionsProps {
//     row: Row<TaskType>;
// }

export function DeleteMemberDialog({ member }: { member?: MemberType }) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId();

    // const { mutate, isPending } = useMutation({
    //     mutationFn: deleteMemberMutationFn,
    // });

    const handleConfirm = () => {
        // mutate(
        //     { workspaceId, taskId: task._id },
        //     {
        //         onSuccess: (data) => {
        //             queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
        //             toast({ title: "Success", description: data.message, variant: "success" });
        //             setOpenDeleteDialog(false);
        //         },
        //         onError: (error) => {
        //             toast({ title: "Error", description: error.message, variant: "destructive" });
        //         },
        //     }
        // );
    };

    return (
        <>
            <div>
                <Button variant={"destructive"} className=" cursor-pointer size-auto text-xs"
                    onClick={() => setOpenDeleteDialog(true)}> Delete</Button>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={openDeleteDialog}
                isLoading={false}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleConfirm}
                title="Remove Member"
                description={`Are you sure you want to delete`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
}