import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tldraw, getSnapshot, loadSnapshot } from "@tldraw/tldraw";
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

// ✅ Custom debounce function
function debounce<Func extends (...args: any[]) => void>(
  func: Func,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<Func>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
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

  useEffect(() => {
    if (!roomId) return;
    socket.emit("getRoomUsers", roomId, (data: { users: User[] }) => {
      // console.log("✅ Received users via manual fetch:", data.users);
      setUsers(data.users);
    });

    socket.on("roomUserList", (data: { users: User[] }) => {
      // console.log("📡 Real-time update:", data.users);
      setUsers(data.users);
    });

    return () => {
      socket.off("roomUserList");
    };
  }, [roomId]);

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

  useEffect(() => {
    socket.on("whiteboard-changes", (snapshot) => {
      // console.log("📥 Changes received from backend");

      if (!snapshot) {
        // console.warn("⚠️ Snapshot is undefined");
        return;
      }

      if (!editorRef.current) {
        // console.warn("⚠️ Editor not ready yet");
        return;
      }

      try {
        loadSnapshot(editorRef.current.store, snapshot);
      } catch (err) {
        console.error("❌ Failed to load snapshot:", err);
      }
    });

    return () => {
      socket.off("whiteboard-changes");
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
            // console.log("📤 Emitting snapshot to server...");
            const snapshot = getSnapshot(editor.store);
            socket.emit("whiteboard-changes", { roomId, snapshot });
          }, 1000);

          editor.store.listen((changes) => {
            // console.log("🔍 Changes object:", changes);
            const relevantChange = Object.values(changes.changes).some(
              (change) => {
                // console.log("🔍 Examining change:", change);

                // Check if the change object itself has a relevant typeName
                // if (
                //   change?.typeName === "shape" ||
                //   change?.typeName === "binding" ||
                //   change?.typeName === "asset"
                // ) {
                //   console.log(
                //     "🔍 Found relevant typeName directly:",
                //     change.typeName
                //   );
                //   return true;
                // }

                // If not, iterate through the properties of the change object
                for (const key in change) {
                  const value = change[key];

                //   // If the value is an array, check its elements for relevant typeNames
                  // if (Array.isArray(value)) {
                  //   if (
                  //     value.some(
                  //       (item) =>
                  //         item?.typeName === "shape" ||
                  //         item?.typeName === "binding" ||
                  //         item?.typeName === "asset"
                  //     )
                  //   ) {
                  //     console.log(
                  //       `🔍 Found relevant typeName in array '${key}':`,
                  //       value.find(
                  //         (item) =>
                  //           item?.typeName === "shape" ||
                  //           item?.typeName === "binding" ||
                  //           item?.typeName === "asset"
                  //       )?.typeName
                  //     );
                  //     return true;
                  //   }
                  // }
                //   // If the value is an object, check if it has a relevant typeName
                //   else if (
                  if (
                    typeof value === "object" &&
                    value !== null &&
                    (value?.typeName === "shape" ||
                      value?.typeName === "binding" ||
                      value?.typeName === "asset")
                  ) {
                    // console.log(
                      // `🔍 Found relevant typeName in object '${key}':`,
                      // value.typeName
                    // );
                    return true;
                  }
                }

                // console.log("🔍 Checking change type: undefined");
                return false; // No relevant change found in this iteration
              }
            );

            // console.log("🔍 Listening to relevant change:", relevantChange);
            if (relevantChange) {
              sendDebouncedSnapshot();
            }
          });
        }}
      />

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
