// components/SidePanel.tsx
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { X } from "lucide-react";

interface User {
  userId: string;
  userName: string;
  host: boolean;
  presenter: boolean;
}

interface SidePanelProps {
  showPanel: boolean;
  setShowPanel: (value: boolean) => void;
  panelRef: React.RefObject<HTMLDivElement>;
  users: User[]; // 👈 added users prop
}

export default function SidePanel({
  showPanel,
  setShowPanel,
  panelRef,
  users,
}: SidePanelProps) {
  return (
    <div
      ref={panelRef}
      className={`absolute top-12 h-[72vh] w-64 bg-white shadow-xl border-l z-50 transition-all duration-300 ease-in-out ${showPanel ? "left-0" : "-left-96"
        }`}
    >
      <div className="flex justify-end items-center mb-2">
        <Button variant="ghost" size="sm" onClick={() => setShowPanel(false)}>
          <X />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="user" className="w-full h-full flex flex-col">
        <TabsList className="grid grid-cols-2 w-full bg-neutral-500 text-white rounded-sm">
          <TabsTrigger
            value="user"
            className="data-[state=active]:bg-white data-[state=active]:text-black rounded-t-md"
          >
            User
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-white data-[state=active]:text-black rounded-t-md"
          >
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="flex-1 overflow-auto px-4 py-2">
          {/* 👇 Total Users Count */}
          <div className="mb-3 text-sm font-semibold">
            Online Users: {users.length}
          </div>

          {users.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {users.map((user) => (
                <li
                  key={user.userId}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>{user.userName}</span>
                  <div className="text-xs flex space-x-1">
                    {user.host && (
                      <span className="text-blue-500 font-medium">Host</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No users connected.</p>
          )}
        </TabsContent>


        <TabsContent value="chat" className="flex-1 overflow-auto p-4">
          <div className="text-sm">Chat content...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
