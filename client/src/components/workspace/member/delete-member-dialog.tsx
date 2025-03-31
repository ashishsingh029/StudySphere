import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { MemberType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteMemberMutationFn} from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function DeleteMemberDialog({ member }: { member?: MemberType }) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteMemberMutationFn,
    });

    const handleConfirm = () => {
        if (!member?._id) return;
        mutate(
            { workspaceId, memberId: member?._id as string},
            {
                onSuccess: (data) => {
                    queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
                    toast({ title: "Success", description: data.message, variant: "success" });
                    setOpenDeleteDialog(false);
                },
                onError: (error) => {
                    toast({ title: "Error", description: error.message, variant: "destructive" });
                },
            }
        );
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
                isLoading={isPending}
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