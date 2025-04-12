import CreateRoomForm from "@/components/workspace/whitebord/create-room-form";

const generateRoomCode = (): string => {
  const segment = (): string =>
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

  return `${segment()}${segment()}-${segment()}-${segment()}-${segment()}-${segment()}${segment()}${segment()}`;
};

const CreateRoom = () => {
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <CreateRoomForm generateRoomCode={generateRoomCode} />
      </div>
    </div>
  );
};

export default CreateRoom;
