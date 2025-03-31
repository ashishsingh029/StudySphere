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
import { TaskType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog";
import EditTaskForm from "../edit-task-form";

interface DataTableRowActionsProps {
  row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);


  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  // const param = useParams();
  // const projectId = param.projectId as string;
  // const taskId = row.original._id as string;
  // const taskCode = row.original.taskCode;

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskMutationFn,
  });

  const task = row.original;

  const handleConfirm = () => {
    mutate(
      { workspaceId, taskId: task._id },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="!text-destructive cursor-pointer"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
          <DialogTitle className="sr-only">Edit Task</DialogTitle>
          <DialogDescription>
            Update the details of your task to keep the project organized.
          </DialogDescription>
          <EditTaskForm task={task} onClose={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={openDeleteDialog}
        isLoading={isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete ${task.taskCode}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Edit Task Dialog */}
    </>
  );
}