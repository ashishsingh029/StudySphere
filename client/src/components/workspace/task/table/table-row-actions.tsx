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
import { useParams } from "react-router-dom";
import EditTaskDialog from "../edit-task-dialog"; // Import the dialog component

interface DataTableRowActionsProps {
  row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); // Add state for edit dialog

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const param = useParams();
  const projectId = param.projectId as string;
  const taskId = row.original._id as string;
  const taskCode = row.original.taskCode;

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskMutationFn,
  });

  const handleDeleteConfirm = () => {
    mutate(
      { workspaceId, taskId },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
          toast({ title: "Success", description: data.message, variant: "success" });
          setTimeout(() => setOpenDeleteDialog(false), 100);
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
          {/* Open Edit Dialog */}
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)} className="cursor-pointer">
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Open Delete Confirmation Dialog */}
          <DropdownMenuItem className="!text-destructive cursor-pointer" onClick={() => setOpenDeleteDialog(true)}>
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={openDeleteDialog}
        isLoading={isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete ${taskCode}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog projectId={projectId} taskId={taskId} isOpen={openEditDialog} onClose={() => setOpenEditDialog(false)} />
    </>
  );
}