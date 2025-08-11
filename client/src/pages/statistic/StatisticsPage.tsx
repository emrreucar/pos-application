import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useCustomersStore } from "../../store/useCustomersStore";
import { useProductsStore } from "../../store/useProductsStore";
import { useBillsStore } from "../../store/useBillsStore";
import { formatCurrency } from "../../lib/utils";
import PieChart from "./_components/PieChart";
import AreaChart from "./_components/AreaChart";

const StatisticsPage = () => {
  const { customers, fetchCustomers } = useCustomersStore();
  const { products, fetchProducts } = useProductsStore();
  const { bills, fetchBills } = useBillsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts();
    if (user?.role === "admin") {
      fetchCustomers();
      fetchBills();
    }
  }, []);

  const DATA = [
    {
      id: 1,
      name: "Toplam Müşteri",
      value: customers.length || 0,
      imgUrl: "/icons/user.png",
    },
    {
      id: 2,
      name: "Toplam Ürün",
      value: products.length || 0,
      imgUrl: "/icons/product.png",
    },
    {
      id: 3,
      name: "Toplam Satış",
      value: bills.length || 0,
      imgUrl: "/icons/sale.png",
    },
    {
      id: 4,
      name: "Toplam Kazanç",
      value: formatCurrency(
        bills.reduce((acc, bill) => acc + bill.total_amount, 0) || 0
      ),
      imgUrl: "/icons/money.png",
    },
  ];

  const greeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Günaydın.";
    } else if (currentHour < 18) {
      return "İyi Günler.";
    } else {
      return "İyi Akşamlar.";
    }
  };

  return (
    <>
      <div className="pb-20 lg:pb-0">
        <h2 className="lg:hidden block mb-5 text-3xl font-bold">
          İstatistikler
        </h2>

        <div className="text-2xl font-bold">
          <span>Merhaba, </span>
          <span className="text-primary">
            {" "}
            {user?.name + " " + user?.surname}
          </span>
          {"."}
          <span> {greeting()} </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {DATA.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-4 py-6 bg-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out text-white"
            >
              <img
                src={item.imgUrl}
                alt={item.imgUrl + item.id}
                className="object-cover w-16 h-16 rounded-full bg-white p-2"
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-300">
                  {item.name}
                </h3>
                <p className="text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-5 mt-6">
          <PieChart />
          {user?.role === "admin" && <AreaChart />}
        </div>
      </div>
    </>
  );
};

export default StatisticsPage;
