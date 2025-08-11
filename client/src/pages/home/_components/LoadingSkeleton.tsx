const LoadingSkeleton = () => {
  return (
    <div>
      <ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 pb-20 xl:pb-0 gap-4">
        {Array.from({ length: 15 }).map((_, index) => (
          <li
            key={index}
            className="relative bg-gray-200 animate-pulse rounded-2xl p-4 h-[350px] flex flex-col gap-2 items-start justify-start"
          >
            <div className="w-full h-1/2 bg-gray-300 rounded-lg"></div>
            <div className="w-full bg-gray-300 h-5 rounded-lg"></div>
            <div className="w-1/3 bg-gray-300 h-3 rounded-lg"></div>
            <div className="w-9 h-9 bg-gray-300 rounded-lg flex justify-end ml-auto mt-auto"></div>
            <div className="absolute right-4 top-2 bg-gray-400 rounded-full py-3 px-4 w-1/2"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoadingSkeleton;
