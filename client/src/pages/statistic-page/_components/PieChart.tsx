import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useBillsStore } from "../../../store/useBillsStore";
import { useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { getReportProducts, reportProducts } = useBillsStore();

  useEffect(() => {
    getReportProducts();
  }, []);

  const generateColors = (count: number) => {
    const baseColors = [
      "#4f46e5",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
      "#f43f5e",
      "#84cc16",
      "#14b8a6",
      "#6366f1",
      "#eab308",
      "#db2777",
      "#0ea5e9",
    ];

    const colors = [];

    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }

    return colors;
  };

  const backgroundColors = generateColors(reportProducts.length);

  const data = {
    labels: reportProducts.map((product) =>
      product.title.length > 20
        ? product.title.slice(0, 20) + "..."
        : product.title
    ),
    datasets: [
      {
        label: "Satış Dağılımı",
        data: reportProducts.map((product) => product.total_sold),
        backgroundColor: backgroundColors,
        borderColor: ["#fff", "#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#374151", // text color
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="max-w-full md:max-w-sm bg-white shadow p-4 rounded-xl w-full">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Ürün Satış Dağılımı
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
