import { Loader } from "lucide-react";

const MainLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin text-blue-500" size={40} />
    </div>
  );
};

export default MainLoader;
