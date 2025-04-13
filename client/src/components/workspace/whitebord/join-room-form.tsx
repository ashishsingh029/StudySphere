import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import useWorkspaceId from "@/hooks/use-workspace-id"
import { useAuthContext } from "@/context/auth-provider"
import { socket } from "@/lib/whiteboard-socket"
import { Loader } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

export default function JoinRoomForm() {
  const navigate = useNavigate()
  const workspaceId = useWorkspaceId()
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

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
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user?._id || !user.name) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to join a room.",
        variant: "destructive",
      })
      return
    }

    const roomData = {
      userId: user._id,
      userName: user.name.trim(),
      roomName: values.name.trim(),
      roomId: values.roomCode.trim(),
      workspaceId,
      host: false,
    }

    setIsLoading(true)

    socket.emit(
      "joinRoom",
      roomData,
      (response: { success: boolean; message?: string }) => {
        setIsLoading(false)
        if (response.success) {
          navigate(`/workspace/${workspaceId}/whiteboard/${roomData.roomId}`)
        } else {
          toast({
            title: "Failed to Join Room",
            description: response.message || "Invalid room name or code.",
            variant: "destructive",
          })
        }
      }
    )
  }

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1 text-center sm:text-left">
            Join Room
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            Team up with peers in a shared workspace to exchange ideas, collaborate on tasks, and study smarter—together.
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
              disabled={isLoading}
              className="flex items-center gap-2 h-[40px] text-white font-semibold"
              type="submit"
            >
              {isLoading && <Loader className="animate-spin w-4 h-4" />}
              Join Room
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
