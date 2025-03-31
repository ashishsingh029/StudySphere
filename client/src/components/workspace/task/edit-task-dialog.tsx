import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import CreateTaskForm from "./create-task-form";

const EditTaskDialog = (props: { projectId?: string,taskId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // const { data, isPending, isError } = useQuery({
  //   queryKey: ["singleProject", projectId],
  //   queryFn: () =>
  //     getProjectByIdQueryFn({
  //       workspaceId,
  //       projectId,
  //     }),
  //   staleTime: Infinity,
  //   enabled: !!projectId,
  //   placeholderData: keepPreviousData,
  // });

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
          {/* <EditTaskForm projectId={props.projectId} taskId={props.taskId} onClose={onClose} /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default EditTaskDialog;
