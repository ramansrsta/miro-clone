import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center flex-col">
      <Image
        src="/logo.svg"
        width={120}
        height={120}
        alt="Miro Logo"
        className="animate-pulse duration-700"
      />
    </div>
  );
};
