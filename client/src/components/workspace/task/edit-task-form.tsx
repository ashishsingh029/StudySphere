import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { editTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { TaskType } from "@/types/api.type";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { useAuthContext } from "@/context/auth-provider";

export default function EditTaskForm({ task, onClose }: { task?: TaskType; onClose: () => void; }) {

    const [canEdit, setCanEdit] = useState(true);
    const workspaceId = useWorkspaceId();
    const queryClient = useQueryClient();
    const {user} = useAuthContext();

    const { data } = useGetWorkspaceMembers(workspaceId);
    const members = data?.members || [];
    const memberRole = members.find((member) => member.userId._id == user?._id)

    useEffect(() => {
        if(task?.assignedTo?._id == memberRole?.userId._id){
            setCanEdit(false)
        }
    }, [])
    

    if(task?.assignedTo == memberRole?._id){
        console.log(task?.assignedTo);
        console.log(memberRole?._id);
        
        
        setCanEdit(true)
    }


    const formSchema = z.object({
        title: z.string().trim().min(1, { message: "Task title is required" }),
        description: z.string().trim().optional(),
        status: z.string().min(1, { message: "Status is required" }),
        priority: z.string().min(1, { message: "Priority is required" }),
        dueDate: z.string().min(1, { message: "Due date is required" }),
    });

    const { mutate, isPending } = useMutation({ mutationFn: editTaskMutationFn });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task?.title || "",
            description: task?.description || "",
            status: task?.status || "",
            priority: task?.priority || "",
            dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        },
    });

    useEffect(() => {
        if (task) {
            form.reset({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "",
                priority: task.priority || "",
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
            });
        }
    }, [task]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isPending) return;

        const payload = {
            projectId: task?.project?._id || "",
            taskId: task?._id || "",
            workspaceId,
            data: {
                ...values,
                dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
            },
        };

        if (!payload.taskId || !payload.projectId) {
            toast({ title: "Error", description: "Invalid task data", variant: "destructive" });
            return;
        }

        mutate(payload, {
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
                toast({ title: "Success", description: data.message, variant: "success" });
                setTimeout(onClose, 100);
            },
            onError: (error) => {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            },
        });
    };

    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full">
                <div className="mb-5 pb-2 border-b">
                    <h1 className="text-xl font-semibold mb-1 text-center sm:text-left">Edit Task</h1>
                    <p className="text-muted-foreground text-sm leading-tight">Update task details to refine project management</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="title">Task Title</FormLabel>
                                        <FormControl><Input id="title" placeholder="Task title" {...field} disabled={memberRole?.role.name != "OWNER"} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="description">Task Description</FormLabel>
                                        <FormControl><Textarea id="description" rows={4} placeholder="Task description" {...field} disabled={memberRole?.role.name !== "OWNER"} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                                        <FormControl><Input id="dueDate" type="date" {...field} disabled={memberRole?.role.name !== "OWNER"} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="status">Status</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange} disabled={canEdit}>
                                                <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                                                    <SelectItem value="DONE">Done</SelectItem>
                                                    <SelectItem value="BACKLOG">Backlog</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="priority">Priority</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={memberRole?.role.name !== "OWNER"}>
                                                <SelectTrigger id="priority">
                                                    <SelectValue placeholder="Select Priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LOW">Low</SelectItem>
                                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                                    <SelectItem value="HIGH">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            className="flex place-self-end  h-[40px] text-white font-semibold"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending && <Loader className="animate-spin" />}
                            Update
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
