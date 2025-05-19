const PreviewCard = ({
  image,
  title,
  price,
}: {
  image: string | null;
  title: string;
  price: string;
}) => {
  return (
    <div className="flex flex-col w-1/3 h-full">
      <span className="block text-center mb-2">Ürün Ön İzlemesi</span>
      <div className="p-4 border rounded-lg shadow-md w-full">
        <img
          src={image ? image : "/images/no-image.jpg"}
          alt="Ürün Görseli"
          className="w-full h-32 object-cover mb-4 rounded-lg"
        />
        <h2 className="text-lg font-semibold text-center">
          {title?.length > 30 ? title?.slice(0, 30) + "..." : title}
        </h2>
        <p className="text-gray-500 text-center">
          {price ? (
            <>
              {price?.length > 7
                ? price?.slice(0, 7) + "..." + "₺"
                : Number(price).toFixed(2) + "₺"}
            </>
          ) : (
            <span>Fiyat yok</span>
          )}
        </p>
        <button className="ml-auto block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
          +
        </button>
      </div>
    </div>
  );
};

export default PreviewCard;
