import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useCustomersStore } from "../../../store/useCustomersStore";
import { useBillsStore } from "../../../store/useBillsStore";

// ChartJS modüllerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // doldurma özelliği
);

const AreaChart = () => {
  const { customers } = useCustomersStore();
  const { bills } = useBillsStore();

  const data = {
    labels: customers.map((customer) => customer.name),
    datasets: [
      {
        label: "Toplam Satış",
        data: customers.map((customer) => {
          const customerBills = bills.filter(
            (bill) => bill.customer_id === customer.id
          );

          return customerBills.reduce(
            (acc, bill) => acc + bill.total_amount,
            0
          );
        }),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)", // bg
        borderColor: "rgba(59, 130, 246, 1)", // border
        tension: 0.4, // kıvrımlı çizgi
        pointRadius: 3,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `₺${value.toLocaleString("tr-TR")}`,
        },
      },
    },
  };

  return (
    <div className="max-w-full lg:max-w-xl w-full bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Müşteri Bazlı Satış Grafiği
      </h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AreaChart;
