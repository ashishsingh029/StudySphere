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
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { socket } from "@/context/whiteboard-socket";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function JoinRoomForm() {
      const navigate = useNavigate();
    //   const queryClient = useQueryClient();
      const workspaceId = useWorkspaceId();
      const {user} = useAuthContext()

    //   const [emoji, setEmoji] = useState("📊");

    //   const { mutate, isPending } = useMutation({
    //     mutationFn: createRoomMutationFn,
    //   });

    const formSchema = z.object({
        name: z.string().trim().min(1, {
            message: "Room name is required",
        }),
        roomCode: z.string().trim().min(1, {
            message: "Room code is required",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            roomCode: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const roomData = {
            userId: user?._id,
            userName: user?.name,
            roomName: values.name,
            roomId : values.roomCode,
            workspaceId,
            host: false,
            presenter: false,
        }
        socket.emit("joinRoom", roomData, (response: { success: boolean; message?: string }) => {
            if (response.success) {
                navigate(`/workspace/${workspaceId}/whiteboard/${roomData.roomId}`);
            } else {
                toast({
                    title: "Failed to Join Room",
                    description: response.message || "Invalid room name or code.",
                    variant: "destructive",
                });
            }
        });
        
    };
    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full">
                <div className="mb-5 pb-2 border-b">
                    <h1
                        className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
                    >
                        Join Room
                    </h1>
                    <p className="text-muted-foreground text-sm leading-tight">
                        Organize and manage tasks, resources, and team collaboration
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Room Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter a room name"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mb-8">
                            <FormField
                                control={form.control}
                                name="roomCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Room Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter a room code"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            disabled={false}
                            className="flex place-self-start h-[40px] text-white font-semibold"
                            type="submit"
                        >
                            {false && <Loader className="animate-spin" />}
                            Join Room
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
