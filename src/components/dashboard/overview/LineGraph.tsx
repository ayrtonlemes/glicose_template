import React, { useState } from "react";
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
import { Line } from "react-chartjs-2";
import { Box, MenuItem, Select, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  selectedPatient: any;
  selectedSensor: string; // Nome do sensor
  data: number[] | { acc_x: number[]; acc_y: number[]; acc_z: number[] }; // Dados podem ser um array simples ou um objeto com eixos
  dateTime: string;
}

const LineGraph: React.FC<LineGraphProps> = ({ selectedPatient, selectedSensor, data, dateTime }) => {
  const [selectedAxis, setSelectedAxis] = useState<"acc_x" | "acc_y" | "acc_z">("acc_x");

  if (!data || Object.keys(data).length === 0) {
    return <div>No data to show on graph.</div>;
  }

  if (selectedPatient && (!dateTime || dateTime === "")) {
    return <div>Select a datetime before selecting data</div>;
  }

  // Verifica se os dados possuem os eixos acc_x, acc_y e acc_z
  const isMultiAxis =
    typeof data === "object" && "acc_x" in data && "acc_y" in data && "acc_z" in data;

  // Obtém os dados corretos
  const selectedData = isMultiAxis ? data[selectedAxis] : (data as number[]);
  const labels = selectedData.map((_, index) => `${index + 1}`);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: isMultiAxis
          ? `${selectedSensor} - ${selectedAxis.toUpperCase()}`
          : selectedSensor,
        data: selectedData,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        pointRadius: 3,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Valores do Sensor ao Longo do Tempo" },
    },
    scales: {
      x: { title: { display: true, text: "Índice dos Dados" } },
      y: {
        title: { display: true, text: "Valor do Sensor" },
        min: Math.min(...selectedData) - Math.min(...selectedData) / 2,
        max: Math.max(...selectedData) + Math.min(...selectedData) / 2,
      },
    },
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Select para alternar entre acc_x, acc_y e acc_z - Apenas se o sensor tiver múltiplos eixos */}
      {isMultiAxis && (
        <>
          <Typography variant="h6">Selecione o eixo:</Typography>
          <Select
            value={selectedAxis}
            onChange={(e) => setSelectedAxis(e.target.value as "acc_x" | "acc_y" | "acc_z")}
            sx={{ mb: 2, minWidth: 120 }}
          >
            <MenuItem value="acc_x">X</MenuItem>
            <MenuItem value="acc_y">Y</MenuItem>
            <MenuItem value="acc_z">Z</MenuItem>
          </Select>
        </>
      )}

      {/* Gráfico */}
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default LineGraph;
