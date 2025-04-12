import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { socket } from "@/lib/whiteboard-socket";
import { useNavigate } from "react-router-dom";
import Chat from "./chat";

interface User {
  userId: string;
  userName: string;
  host: boolean;
}

interface SidePanelProps {
  showPanel: boolean;
  panelRef: React.RefObject<HTMLDivElement>;
  users: User[]; 
}



export default function SidePanel({
  showPanel,
  panelRef,
  users,
}: SidePanelProps) {

  const workspaceId = useWorkspaceId()
  const navigate = useNavigate()

  const leaveRoom = () => {
    socket.disconnect();
    toast({
      title: "Left the room",
      variant: "destructive",
    });
    setTimeout(() => {
      navigate(`/workspace/${workspaceId}`);
    }, 500);

  }

  return (
    <div
      ref={panelRef}
      className={`absolute top-12 h-[72vh] w-64 bg-blue-50 shadow-xl border-l z-50  transition-all duration-300 ease-in-out text-xs ${showPanel ? "left-0" : "-left-96"
        }`}
    >
      <div className="flex justify-between mb-2  ">
        <Button variant="destructive" className="h-8 w-full rounded-none" onClick={leaveRoom}> Leave Room</Button>
        {/* <div className="flex justify-end items-center">
          <Button variant="ghost" size="sm" onClick={() => setShowPanel(false)}>
            <X />
          </Button>
        </div> */}
      </div>


      {/* Tabs */}
      <Tabs defaultValue="user" className="w-full h-full flex flex-col text-sm">
        <TabsList className="grid grid-cols-2 w-full bg-blue-800 text-white rounded-none ">
          <TabsTrigger
            value="user"
            className="data-[state=active]:bg-white data-[state=active]:text-black"
          >
            User
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="flex-1 overflow-auto px-4 py-2 h-full">
          {/* 👇 Total Users Count */}
          <div className="mb-3 font-semibold">
            Online Users: {users.length}
          </div>

          {users.length > 0 ? (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.userId}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>{user.userName}</span>
                  
                  <div className="flex  space-x-1">
                    {user.host && (
                      <span className="text-blue-500 font-medium">Host</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No users connected.</p>
          )}
        </TabsContent>


        <TabsContent value="chat" className="flex-1">
          <Chat/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
