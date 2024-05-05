import Image from "next/image";

export default function UserBlock({
  user,
}: {
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}) {
  return (
    <div className="flex gap-4">
      <Image
        src={`http:localhost:3001/api/user/avatar/${user.id}`}
        alt="Avatar"
        width={250}
        height={250}
        className="rounded-full"
      />
      <div className="flex flex-col gap-2 mt-[5%]">
        <div className="font-500 text-[24px]">{user.full_name}</div>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
