import React, { useState } from "react";
import { Box, Typography, Stack, TextField, Button, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Definição dos intervalos de cores
const intervals = [
  { max: 70, color: "#3385FF" }, // Azul
  { max: 99, color: "#33FF57" }, // Verde
  { max: 126, color: "#FF8C00" }, // Laranja
  { max: 150, color: "#FF5733" }, // Vermelho
];

const mapValueToPercentage = (value: number): number => {
  if (value <= 70) return (value / 70) * 30;
  if (value <= 99) return 30 + ((value - 70) / (99 - 70)) * 20;
  if (value <= 126) return 50 + ((value - 99) / (126 - 99)) * 20;
  if (value <= 150) return 70 + ((value - 126) / (150 - 126)) * 30;
  return 100;
};

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const markers = [70, 99, 126];
  return (
    <Box sx={{ width: "100%", textAlign: "center", padding: 2 }}>
      <Typography variant="body1" fontWeight="bold" sx={{ fontSize: "26px" }}>
        Value Glucose: {value}
      </Typography>
      <Box sx={{ position: "relative", width: "100%", height: 24, borderRadius: 8, backgroundColor: "#ddd", overflow: "hidden" }}>
        {intervals.map((interval, index) => {
          const start = index === 0 ? 0 : mapValueToPercentage(intervals[index - 1].max);
          const end = mapValueToPercentage(interval.max);
          const segmentWidth = Math.min(mapValueToPercentage(value), end) - start;
          return segmentWidth > 0 ? (
            <Box
              key={index}
              sx={{
                position: "absolute",
                left: `${start}%`,
                width: `${segmentWidth}%`,
                height: "100%",
                backgroundColor: interval.color,
                transition: "width 0.3s ease-in-out",
              }}
            />
          ) : null;
        })}
        {markers.map((mark, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              left: `calc(${mapValueToPercentage(mark)}% - 2px)`,
              top: "0",
              width: "4px",
              height: "100%",
              backgroundColor: "#000",
              opacity: 0.8,
            }}
          />
        ))}
      </Box>

        {/* Marcadores da régua com posicionamento manual */}
      <Stack
        direction="row"
        sx={{
          position: "relative",
          mt: 1,
          px: 1,
          height: "24px"
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            position: "absolute",
            left: "2%", // Posição do 0
            transform: "translateX(-50%)",
          }}
        >
          0
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            position: "absolute",
            left: "30%", // Posição do 70
            transform: "translateX(-50%)",
          }}
        >
          70
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            position: "absolute",
            left: "50%", // Posição do 99
            transform: "translateX(-50%)",
          }}
        >
          99
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            position: "absolute",
            left: "70%", // Posição do 126
            transform: "translateX(-50%)",
          }}
        >
          126
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            position: "absolute",
            left: "98%", // Posição do 150
            transform: "translateX(-50%)",
          }}
        >
          150
        </Typography>
      </Stack>


      <Stack spacing={1} sx={{ mt: 2, alignItems: "center" }}>
            {[
              { label: "Hypoglycemia", color: "#3385FF" },
              { label: "Normal", color: "#33FF57" },
              { label: "Prediabetes", color: "#FF8C00" },
              { label: "Diabetes", color: "#FF5733" },
            ].map((item, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, backgroundColor: item.color, borderRadius: "4px" }} />
                <Typography variant="body1" fontWeight="bold">{item.label}</Typography>
              </Stack>
            ))}
          </Stack>
    </Box>
  );
};
interface SidebarAppProps {
    glicoResult:any;
    open: boolean;
    setOpen: (arg: boolean) => void;
}
const SidebarApp = ({glicoResult, open, setOpen}: SidebarAppProps) => {
  const [progress, setProgress] = useState(0);

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      setProgress(newValue);
    }
  };

  return (
    <div>
      <Box sx={{ position: "absolute", top: 10, right: 10 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Abrir Sidebar
        </Button>
      </Box>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} sx={{ width: "50%" }}>
        <Box sx={{ width: "50vw", padding: 3, textAlign: "center", position: "relative" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            Resultado do modelo
          </Typography>
          <ProgressBar value={glicoResult} />
        </Box>
      </Drawer>
    </div>
  );
};

export default SidebarApp;
