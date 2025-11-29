import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);

  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [pricesAvg, setPricesAvg] = useState<number[]>([]);
  const [itemCounts, setItemCounts] = useState<number[]>([]);
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

        // Extract timestamps, avg_price, and item_count
        const extractedTimestamps = consolidatedData.map((entry: any) =>
          dayjs(entry.timestamp).format("DD/MM/YYYY HH:MM")
        );
        const extractedPricesAvg = consolidatedData.map(
          (entry: any) => entry.avg_price
        );
        const extractedItemCounts = consolidatedData.map(
          (entry: any) => entry.item_count
        );

        setTimestamps(extractedTimestamps);
        setPricesAvg(extractedPricesAvg);
        setItemCounts(extractedItemCounts);
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "info",
            summary: t('no_results'),
            detail: t('no_data_found'),
            life: 5000,
          });
        }
      }
    }
    getData();
  }, [itemId, selectedRange, selectedLocation]);

  const locationOptions = [
    { label: t('bridgewatch'), value: "Bridgewatch" },
    { label: t('martlock'), value: "Martlock" },
    { label: t('thetford'), value: "Thetford" },
    { label: t('fort_sterling'), value: "Fort Sterling" },
    { label: t('lymhurst'), value: "Lymhurst" },
    { label: t('caerleon'), value: "Caerleon" },
    { label: t('black_market'), value: "Black Market" },
    { label: t('brecilien'), value: "Brecilien" },
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
        label: `${t('average_price')} - ${selectedLocation}`,
        data: pricesAvg,
        borderColor: locationColors[selectedLocation] || "#ffffffff",
        backgroundColor: "rgba(0, 0, 0, 0)",
        pointBackgroundColor: locationColors[selectedLocation] || "#ffffffff",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: locationColors[selectedLocation] || "#ffffffff",
        tension: 0.4,
        yAxisID: 'y',
        borderWidth: 2,
      },
      {
        label: `${t('quantity_sold')} - ${selectedLocation}`,
        data: itemCounts,
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        pointBackgroundColor: "#FFD700",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FFD700",
        tension: 0.4,
        yAxisID: 'y1',
        borderWidth: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: t('price_and_quantity_trends'),
        color: "#ffffff",
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        position: 'nearest' as const,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 15,
        titleColor: '#ffffff',
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyColor: '#ffffff',
        bodyFont: {
          size: 13,
        },
        bodySpacing: 8,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 15,
        boxHeight: 15,
        boxPadding: 5,
        callbacks: {
          title: function(tooltipItems: any) {
            return tooltipItems[0].label;
          },
          label: function (context: any) {
            const value = context.parsed.y;
            
            if (context.datasetIndex === 0) {
              return `  ${t('price')}: ${value.toLocaleString()} ${t('silver')}`;
            } else {
              return `  ${t('sold')}: ${value.toLocaleString()} ${t('items')}`;
            }
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: t('average_price'),
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: t('quantity_sold'),
          color: "#FFD700",
        },
        ticks: {
          color: "#FFD700",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const rangeOptions = [
    { label: t('last_24_hours'), value: "24h" },
    { label: t('last_week'), value: "1week" },
  ];

  return (
    <div>
      <Toast ref={toast} />
      <div className="p-field p-grid" style={{ marginBottom: "1rem" }}>
        <label htmlFor="range" className="p-col-12 p-md-2">
          {t('select_range')}
        </label>
        <div className="p-col-12 p-md-10">
          <Dropdown
            id="range"
            value={selectedRange}
            options={rangeOptions}
            onChange={(e) => setSelectedRange(e.value)}
            placeholder={t('select_a_range')}
            className="p-dropdown"
          />
        </div>
      </div>
      <div className="p-field p-grid" style={{ marginBottom: "1rem" }}>
        <label htmlFor="location" className="p-col-12 p-md-2">
          {t('select_location')}
        </label>
        <div className="p-col-12 p-md-10">
          <Dropdown
            id="location"
            value={selectedLocation}
            options={locationOptions}
            onChange={(e) => setSelectedLocation(e.value)}
            placeholder={t('select_a_location')}
            className="p-dropdown"
          />
        </div>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ItemChart;
