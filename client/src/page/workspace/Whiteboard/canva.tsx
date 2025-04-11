import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tldraw } from "@tldraw/tldraw";
import "tldraw/tldraw.css";
import SidePanel from "@/components/workspace/whitebord/side-panel";
import { socket } from "@/context/whiteboard-socket";
import { useAuthContext } from "@/context/auth-provider";
import { useParams } from "react-router-dom";

// ✅ Define a User type
interface User {
  userId: string;
  userName: string;
  host: boolean;
  presenter: boolean;
}

export default function Canva() {
  const [showPanel, setShowPanel] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // ✅ Type the users array
  const { user } = useAuthContext();

  const param = useParams();
  const roomId = param.roomId as string

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Request current users from server when component mounts
    if (!roomId) return; // Make sure roomId is available
    socket.emit("getRoomUsers", roomId, (data: { users: User[] }) => {
      console.log("✅ Received users via manual fetch:", data.users);
      setUsers(data.users);
    });
  
    // Also listen for live updates if needed
    socket.on("roomUserList", (data: { users: User[] }) => {
      console.log("📡 Real-time update:", data.users);
      setUsers(data.users);
    });
  
    return () => {
      socket.off("roomUserList");
    };
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanel]);

  const isHost = users.find((u) => u.userId === user?._id)?.host ?? false;

  return (
    <div className="relative w-full h-[89vh]">
      <Tldraw hideUi={!isHost} />

      <div className="absolute top-0 right-0 sm:bottom-12 sm:top-auto sm:right-auto z-50">
        <Button
          ref={buttonRef}
          onClick={() => setShowPanel((prev) => !prev)}
          className="text-base bg-slate-400 text-black 
        hover:bg-slate-200 dark:bg-black dark:text-white rounded-none font-semibold"
        >
          <p>Info</p>
        </Button>
      </div>

      <SidePanel
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        panelRef={panelRef}
        users={users}
      />
    </div>
  );
}

