import JoinRoomForm from "@/components/workspace/whitebord/join-room-form";
// import { socket } from "@/lib/whiteboard-socket";
// import { useEffect } from "react";
// import { socket } from "@/context/whiteboard-socket";
// import { useEffect } from "react";
// interface User {
//   userId: string;
//   userName: string;
//   host: boolean;
// }
export default function JoinRoom() {
    // useEffect(() => {
    //   socket.on("userIsJoined", (data) => {
    //     if (data.success) {
    //       console.log("userJoined");
    //     } else {
    //       console.log("userJoinend error");
    //     }
    //   });
  
    //   // return () => {
    //   //   socket.disconnect();
    //   //   console.log("Socket disconnected");
    //   // };
    // }, []);
    // useEffect(() => {
    //     socket.on("roomUserList", (data: { users: User[] }) => {
    //        if (!data?.users?.length) {
    //       console.warn("⚠️ No users received");
    //     }  
    //       // setUsers(data.users);
    //     });
    
    //     return () => {
    //       socket.off("roomUserList");
    //     };
    //   }, []);
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <JoinRoomForm/>
      </div>
    </div>
  );
}
