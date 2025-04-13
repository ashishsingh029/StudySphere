import { useRef, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tldraw, getSnapshot, loadSnapshot } from "@tldraw/tldraw";
import "tldraw/tldraw.css";
import SidePanel from "@/components/workspace/whitebord/side-panel";
import { socket } from "@/lib/whiteboard-socket";
import { useAuthContext } from "@/context/auth-provider";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";

interface User {
  userId: string;
  userName: string;
  host: boolean;
}

function debounce<Func extends (...args: any[]) => void>(func: Func, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<Func>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function Canva() {
  const [showPanel, setShowPanel] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const { user } = useAuthContext();
  const param = useParams();
  const roomId = param.roomId as string;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const editorRef = useRef<any>(null);

  const navigate = useNavigate()
  const workspaceId = useWorkspaceId()

  const isHost = useMemo(() => {
    return users.find((u) => u.userId === user?._id)?.host ?? false;
  }, [users, user?._id]);

  useEffect(() => {
    if (!user?._id || users.length === 0) return;

    const isInRoom = users.some(u => u.userId === user._id);

    if (!isInRoom) {
      navigate(`/workspace/${workspaceId}`);
    }
  }, [users, user?._id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.disconnect();
      toast({
        title: "Left the room",
        variant: "destructive",
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  useEffect(() => {
    if (!roomId) {
      navigate(`/workspace/${workspaceId}`);
      return;
    }
    socket.emit("getRoomUsers", roomId, (data: { users: User[] }) => {
      if (data.users.length === 0) {
        toast({
          title: "Room closed",
          variant: "destructive",
        });
        navigate(`/workspace/${workspaceId}`);
      } else {
        setUsers(data.users);
      }
    });

    socket.on("roomUserList", (data: { users: User[] }) => {
      const prevUserIds = new Set(users.map((u) => u.userId));
      const newUserIds = new Set(data.users.map((u) => u.userId));

      const joined = data.users.find((u) => !prevUserIds.has(u.userId));
      const left = users.find((u) => !newUserIds.has(u.userId));

      if (joined && joined.userId !== user?._id) {      
        if(joined.host){
          toast({
            title: `Host joined the room`,
            variant: "success",
          });
        }
        else{
          toast({
            title: `${joined.userName} joined the room`,
            variant: "success",
          });
        }
      }

      if (left && left.userId !== user?._id) {
        if(left.host){
          toast({
            title: `Host left the room`,
            variant: "destructive",
          });
        }
        else{
          toast({
            title: `${left.userName} left the room`,
            variant: "destructive",
          });
        }
       
      }

      const hasChanged =
        users.length !== data.users.length ||
        [...prevUserIds].some((id) => !newUserIds.has(id));

      if (hasChanged) {
        setUsers(data.users);
      }
    });

    return () => {
      socket.off("roomUserList");
    };
  }, [roomId, users, user?._id]);




  useEffect(() => {
    socket.on("whiteboard-changes", (snapshot) => {
      if (!snapshot || !editorRef.current) return;

      try {
        loadSnapshot(editorRef.current.store, snapshot);
      } catch (err) {
        console.error("Failed to load snapshot:", err);
      }
    });

    return () => {
      socket.off("whiteboard-changes");
    };
  }, []);

  useEffect(() => {
    const handleRoomClosed = () => {
      toast({
        title: "Room closed by host",
        variant: "destructive",
      });
      socket.disconnect();
      navigate(`/workspace/${workspaceId}`);
    };

    socket.on("roomClosed", handleRoomClosed);

    return () => {
      socket.off("roomClosed", handleRoomClosed);
    };
  }, [navigate, workspaceId]);


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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full h-[89vh]">
      <Tldraw
        hideUi={!isHost}
        onMount={(editor) => {
          editor.updateInstanceState({ isReadonly: !isHost });
          editorRef.current = editor;

          const sendDebouncedSnapshot = debounce(() => {
            if (roomId) {
              const snapshot = getSnapshot(editor.store);
              socket.emit("whiteboard-changes", { roomId, snapshot });
            }
          }, 1000);

          editor.store.listen((changes) => {
            const relevantChange = Object.values(changes.changes).some((change) =>
              Object.values(change).some(
                (value: any) =>
                  typeof value === "object" &&
                  value !== null &&
                  ["shape", "binding", "asset"].includes(value?.typeName)
              )
            );

            if (relevantChange) {
              sendDebouncedSnapshot();
            }
          });
        }}
      />

      <div className="absolute top-1 right-1 sm:bottom-12 sm:top-auto sm:right-auto sm:ml-1 z-50 ">
        <Button
          ref={buttonRef}
          onClick={() => setShowPanel((prev) => !prev)}
          className="text-base bg-slate-400
          hover:bg-slate-600 rounded-md font-semibold"
        >
          <p>Info</p>
        </Button>
      </div>

      <SidePanel
        showPanel={showPanel}
        panelRef={panelRef}
        users={users}
      />
    </div>
  );
}
