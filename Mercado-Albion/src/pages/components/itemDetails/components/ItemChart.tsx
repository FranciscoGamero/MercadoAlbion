import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ItemChartProps {
  itemId: string;
}

const ItemChart: React.FC<ItemChartProps> = ({ itemId }) => {
  const toast = useRef<Toast>(null);

  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [pricesAvg, setPricesAvg] = useState<number[]>([]);
  const [selectedRange, setSelectedRange] = useState("24h"); // Default to 24h range
  const [selectedLocation, setSelectedLocation] = useState<string>(""); // Reverted to single location selection

  useEffect(() => {
    async function getData() {
      let timeScale = 24; // Default to 24 hours
      if (selectedRange === "1week") {
        timeScale = 168; // 7 days * 24 hours
      }

      const locationQuery = selectedLocation ? `&locations=${selectedLocation}` : "";

      const response = await fetch(
        `https://west.albion-online-data.com/api/v2/stats/history/${itemId}?time-scale=${timeScale}${locationQuery}`
      );
      const data = await response.json();

      if (data.length > 0) {
        // Consolidate data from the selected location
        const consolidatedData = data.flatMap((entry: any) => entry.data);

        // Extract timestamps and avg_price
        const extractedTimestamps = consolidatedData.map((entry: any) =>
          dayjs(entry.timestamp).format("DD/MM/YYYY HH:MM")
        );
        const extractedPricesAvg = consolidatedData.map(
          (entry: any) => entry.avg_price
        );

        setTimestamps(extractedTimestamps);
        setPricesAvg(extractedPricesAvg);
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "info",
            summary: "Sin resultados",
            detail: "No se encontraron datos para la búsqueda debido a un error en el servicio.",
            life: 5000,
          });
        }
      }
    }
    getData();
  }, [itemId, selectedRange, selectedLocation]);

  const locationOptions = [
    { label: "Bridgewatch", value: "Bridgewatch" },
    { label: "Martlock", value: "Martlock" },
    { label: "Thetford", value: "Thetford" },
    { label: "Fort Sterling", value: "Fort Sterling" },
    { label: "Lymhurst", value: "Lymhurst" },
    { label: "Caerleon", value: "Caerleon" },
    { label: "Black Market", value: "Black Market" },
    { label: "Brecilien", value: "Brecilien" },
  ];

  const locationColors: Record<string, string> = {
    "Bridgewatch": "#FFD700",
    "Martlock": "#87CEEB",
    "Thetford": "#8A2BE2",
    "Fort Sterling": "#A9A9A9",
    "Lymhurst": "#32CD32",
    "Caerleon": "#FF0000",
    "Black Market": "#000000",
    "Brecilien": "#FF69B4", 
  };

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: `Precio Promedio - ${selectedLocation}`,
        data: pricesAvg,
        borderColor: locationColors[selectedLocation] || "#ffffffff",
        backgroundColor: "rgba(0, 0, 0, 0)",
        pointBackgroundColor: locationColors[selectedLocation] || "#ffffffff",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: locationColors[selectedLocation] || "#ffffffff",
        tension: 0.4,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "Tendencias de Precios",
        color: "#ffffff",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Precio: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  const rangeOptions = [
    { label: "Últimas 24 horas", value: "24h" },
    { label: "Última semana", value: "1week" },
  ];

  return (
    <div>
      <Toast ref={toast} />
      <div className="p-field p-grid" style={{ marginBottom: "1rem" }}>
        <label htmlFor="range" className="p-col-12 p-md-2">
          Seleccionar rango:
        </label>
        <div className="p-col-12 p-md-10">
          <Dropdown
            id="range"
            value={selectedRange}
            options={rangeOptions}
            onChange={(e) => setSelectedRange(e.value)}
            placeholder="Selecciona un rango"
            className="p-dropdown"
          />
        </div>
      </div>
      <div className="p-field p-grid" style={{ marginBottom: "1rem" }}>
        <label htmlFor="location" className="p-col-12 p-md-2">
          Seleccionar Localización:
        </label>
        <div className="p-col-12 p-md-10">
          <Dropdown
            id="location"
            value={selectedLocation}
            options={locationOptions}
            onChange={(e) => setSelectedLocation(e.value)}
            placeholder="Selecciona una localización"
            className="p-dropdown"
          />
        </div>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ItemChart;
