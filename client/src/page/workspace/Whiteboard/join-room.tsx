import JoinRoomForm from "@/components/workspace/whitebord/join-room-form";
export default function JoinRoom() {
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <JoinRoomForm/>
      </div>
    </div>
  );
}
