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
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CheckIcon, CopyIcon, Loader, RefreshCcwIcon } from "lucide-react";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { socket } from "@/lib/whiteboard-socket";

// Schema
const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Room name is required",
  }),
  roomCode: z.string().trim().min(1, {
    message: "Room code is required",
  }),
});

export default function CreateRoomForm({
  generateRoomCode,
}: {
  generateRoomCode: () => string;
}) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthContext();
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      roomCode: "",
    },
  });

  const roomCode = form.watch("roomCode");

  const handleCopy = async () => {
    if (!roomCode) {
      toast({
        title: "No Room Code",
        description: "Please generate a room code first.",
        variant: "destructive",
      });
      return;
    }

    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast({
      title: "Copied",
      description: "Room code copied to clipboard.",
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateRoomCode = () => {
    setIsGenerating(true);
    const code = generateRoomCode();
    form.setValue("roomCode", code);
    setIsGenerating(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user?._id || !user.name) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a room.",
        variant: "destructive",
      });
      return;
    }

    const RoomData = {
      roomName: values.name.trim(),
      roomId: values.roomCode.trim(),
      workspaceId,
      userId: user._id,
      userName: user.name,
      host: true,
    };

    setIsSubmitting(true);
    socket.emit(
      "createRoom",
      RoomData,
      (response: { success: boolean; message?: string }) => {
        setIsSubmitting(false);
        if (response.success) {
          toast({
            title: "Success",
            description: response.message || "Room Created Successfully",
            variant: "success",
          });
          form.reset();
        } else {
          toast({
            title: "Room Creation Failed",
            description: response.message || "Something went wrong. Try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="mb-5 pb-2 border-b">
        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1 text-center sm:text-left">
          Create Room
        </h1>
        <p className="text-muted-foreground text-sm leading-tight">
          Set up a shared space to brainstorm, solve problems, and learn together—perfect for study groups and project teams.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
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

          <div className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="roomCode"
              render={({ field }) => (
                <FormItem className="flex-1 mb-8">
                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                    Room Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Generate room code"
                      readOnly
                      className="!h-[48px] cursor-default select-none focus-visible:ring-0 disabled:opacity-100 disabled:pointer-events-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-8">
              <Button
                type="button"
                onClick={handleGenerateRoomCode}
                disabled={isGenerating}
                className="bg-blue-500 hover:bg-blue-800 shrink-0 h-[48px] w-[48px]"
                size="icon"
                aria-label="Generate Room Code"
              >
                <RefreshCcwIcon
                  className={isGenerating ? "animate-spin" : ""}
                />
              </Button>

              <Button
                type="button"
                onClick={handleCopy}
                disabled={!roomCode}
                className="shrink-0 h-[48px] w-[48px]"
                size="icon"
                aria-label="Copy Room Code"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="flex h-[40px] text-white font-semibold items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
            Create Room
          </Button>
        </form>
      </Form>
    </div>
  );
}
