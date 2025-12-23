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

  const [chartDatasets, setChartDatasets] = useState<any[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState("24h");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  useEffect(() => {
    async function getData() {
      const locationQuery = selectedLocation !== "all" ? `&locations=${selectedLocation}` : "";

      const response = await fetch(
        `https://west.albion-online-data.com/api/v2/stats/history/${itemId}?${locationQuery}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const now = dayjs();
        const cutoffTime = selectedRange === "24h" ? now.subtract(24, 'hour') : now.subtract(7, 'day');

        if (selectedLocation === "all") {
          let locationData: Record<string, Record<string, number>> = {};
          
          const allDataPoints: Array<{location: string, timestamp: Date, price: number}> = [];

          if (selectedRange === "24h") {
            const timestampCounts: Record<string, number> = {};
            
            data.forEach((entry: any) => {
              entry.data.forEach((dataPoint: any) => {
                const timestamp = dataPoint.timestamp;
                if (!timestampCounts[timestamp]) {
                  timestampCounts[timestamp] = 0;
                }
                timestampCounts[timestamp]++;
              });
            });

            const sortedByCount = Object.entries(timestampCounts)
              .sort((a, b) => {
                if (b[1] !== a[1]) {
                  return b[1] - a[1];
                }
                return dayjs(b[0]).diff(dayjs(a[0]));
              });

            if (sortedByCount.length > 0) {
              const mostRecentTime = dayjs(sortedByCount[0][0]);
              const recentCutoff = mostRecentTime.subtract(24, 'hour');

              data.forEach((entry: any) => {
                const location = entry.location;
                entry.data.forEach((dataPoint: any) => {
                  const pointTime = dayjs(dataPoint.timestamp);
                  if (pointTime.isAfter(recentCutoff) && pointTime.isBefore(mostRecentTime.add(1, 'hour'))) {
                    allDataPoints.push({
                      location: location,
                      timestamp: pointTime.toDate(),
                      price: dataPoint.avg_price
                    });
                  }
                });
              });
            }
          } else {
            data.forEach((entry: any) => {
              const location = entry.location;
              entry.data.forEach((dataPoint: any) => {
                const pointTime = dayjs(dataPoint.timestamp);
                if (pointTime.isAfter(cutoffTime)) {
                  allDataPoints.push({
                    location: location,
                    timestamp: pointTime.toDate(),
                    price: dataPoint.avg_price
                  });
                }
              });
            });
          }

          const timeGroups: Record<string, Date> = {};
          allDataPoints.forEach(point => {
            const roundedTime = dayjs(point.timestamp).startOf('minute').format('YYYY-MM-DD HH:mm');
            if (!timeGroups[roundedTime]) {
              timeGroups[roundedTime] = point.timestamp;
            }
          });

          const uniqueTimestamps = Object.keys(timeGroups)
            .sort((a, b) => dayjs(a).diff(dayjs(b)))
            .map(key => dayjs(key).format("DD/MM/YYYY HH:mm"));

          allDataPoints.forEach(point => {
            const roundedTime = dayjs(point.timestamp).startOf('minute').format("DD/MM/YYYY HH:mm");
            
            if (!locationData[point.location]) {
              locationData[point.location] = {};
            }
            
            if (!locationData[point.location][roundedTime] || 
                dayjs(point.timestamp).isAfter(dayjs(locationData[point.location][roundedTime]))) {
              locationData[point.location][roundedTime] = point.price;
            }
          });

          setTimestamps(uniqueTimestamps);

          const datasets = Object.entries(locationData).map(([location, prices]) => {
            const priceData = uniqueTimestamps.map(ts => prices[ts] || null);
            return {
              label: `${t('average_price')} - ${location}`,
              data: priceData,
              borderColor: locationColors[location] || "#5DADE2",
              backgroundColor: "rgba(0, 0, 0, 0)",
              pointBackgroundColor: locationColors[location] || "#5DADE2",
              pointBorderColor: "#34495E",
              pointHoverBackgroundColor: "#ECF0F1",
              pointHoverBorderColor: locationColors[location] || "#5DADE2",
              tension: 0.4,
              borderWidth: 2,
              spanGaps: true,
            };
          });

          setChartDatasets(datasets);
        } else {
          let consolidatedData = data.flatMap((entry: any) => entry.data)
            .filter((dataPoint: any) => {
              const pointTime = dayjs(dataPoint.timestamp);
              return pointTime.isAfter(cutoffTime);
            })
            .sort((a: any, b: any) => {
              return dayjs(a.timestamp).diff(dayjs(b.timestamp));
            });

          if (consolidatedData.length === 0 && selectedRange === "24h") {
            const allData = data.flatMap((entry: any) => entry.data)
              .sort((a: any, b: any) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));

            if (allData.length > 0) {
              const mostRecentTime = dayjs(allData[0].timestamp);
              const recentCutoff = mostRecentTime.subtract(24, 'hour');

              consolidatedData = allData
                .filter((dataPoint: any) => {
                  const pointTime = dayjs(dataPoint.timestamp);
                  return pointTime.isAfter(recentCutoff);
                })
                .sort((a: any, b: any) => dayjs(a.timestamp).diff(dayjs(b.timestamp)));
            }
          }

          const extractedTimestamps = consolidatedData.map((entry: any) =>
            dayjs(entry.timestamp).format("DD/MM/YYYY HH:mm")
          );
          const extractedPricesAvg = consolidatedData.map(
            (entry: any) => entry.avg_price
          );
          const extractedItemCounts = consolidatedData.map(
            (entry: any) => entry.item_count
          );

          setTimestamps(extractedTimestamps);
          setChartDatasets([
            {
              label: `${t('average_price')} - ${selectedLocation}`,
              data: extractedPricesAvg,
              borderColor: locationColors[selectedLocation] || "#5DADE2",
              backgroundColor: "rgba(0, 0, 0, 0)",
              pointBackgroundColor: locationColors[selectedLocation] || "#5DADE2",
              pointBorderColor: "#34495E",
              pointHoverBackgroundColor: "#ECF0F1",
              pointHoverBorderColor: locationColors[selectedLocation] || "#5DADE2",
              tension: 0.4,
              yAxisID: 'y',
              borderWidth: 3,
            },
            {
              label: `${t('quantity_sold')} - ${selectedLocation}`,
              data: extractedItemCounts,
              borderColor: "#7F8C8D",
              backgroundColor: "rgba(127, 140, 141, 0.1)",
              pointBackgroundColor: "#7F8C8D",
              pointBorderColor: "#34495E",
              pointHoverBackgroundColor: "#ECF0F1",
              pointHoverBorderColor: "#7F8C8D",
              tension: 0.4,
              yAxisID: 'y1',
              borderWidth: 3,
            },
          ]);
        }
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
  }, [itemId, selectedRange, selectedLocation, t]);

  const locationOptions = [
    { label: t('all-locations') || 'Todas las localizaciones', value: "all" },
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
    "Bridgewatch": "#FFB84D",
    "Martlock": "#5DADE2",
    "Thetford": "#9B59B6",
    "Fort Sterling": "#95A5A6",
    "Lymhurst": "#52BE80",
    "Caerleon": "#E74C3C",
    "Black Market": "#34495E",
    "Brecilien": "#EC7063", 
  };

  const chartData = {
    labels: timestamps,
    datasets: chartDatasets,
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
          color: "#2C3E50",
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: selectedLocation === "all" ? t('price_trends') || 'Tendencias de precios' : t('price_and_quantity_trends'),
        color: "#2C3E50",
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        position: 'nearest' as const,
        backgroundColor: 'rgba(44, 62, 80, 0.95)',
        padding: 15,
        titleColor: '#ECF0F1',
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyColor: '#ECF0F1',
        bodyFont: {
          size: 13,
        },
        bodySpacing: 8,
        borderColor: '#95A5A6',
        borderWidth: 2,
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
            
            if (selectedLocation === "all" || !context.dataset.yAxisID || context.dataset.yAxisID === 'y') {
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
          color: "#34495E",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15,
        },
        grid: {
          color: "rgba(149, 165, 166, 0.3)",
          borderColor: "#7F8C8D",
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: t('average_price'),
          color: "#2C3E50",
          font: {
            size: 13,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: "#34495E",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(149, 165, 166, 0.3)",
          borderColor: "#7F8C8D",
        },
      },
      ...(selectedLocation !== "all" ? {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: t('quantity_sold'),
            color: "#7F8C8D",
            font: {
              size: 13,
              weight: 'bold' as const,
            },
          },
          ticks: {
            color: "#7F8C8D",
            font: {
              size: 11,
            },
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      } : {}),
    },
  };

  const rangeOptions = [
    { label: t('last_24_hours'), value: "24h" },
    { label: t('last_week'), value: "1week" },
  ];

  const availableRangeOptions = selectedLocation === "all" 
    ? rangeOptions.filter(option => option.value === "1week")
    : rangeOptions;

  useEffect(() => {
    if (selectedLocation === "all" && selectedRange === "24h") {
      setSelectedRange("1week");
    }
  }, [selectedLocation, selectedRange]);

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
            options={availableRangeOptions}
            onChange={(e) => setSelectedRange(e.value)}
            placeholder={t('select_a_range')}
            className="p-dropdown"
            disabled={selectedLocation === "all"}
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
      {selectedLocation === "all" && (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '15px', 
          color: '#7F8C8D', 
          fontStyle: 'italic',
          marginBottom: '0.5rem'
        }}>
          {t('click_legend_filter')}
        </div>
      )}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ItemChart;
