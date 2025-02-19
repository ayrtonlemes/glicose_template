'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Desktop as DesktopIcon } from '@phosphor-icons/react/dist/ssr/Desktop';
import { DeviceTablet as DeviceTabletIcon } from '@phosphor-icons/react/dist/ssr/DeviceTablet';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { Phone as PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';
import { Button } from '@mui/material';
import { getPatientFoodData } from '@/services/getPatientFoodData';
import DatetimeModal from '../DatetimeModal';
import { BowlFood, Egg, Hamburger, IceCream, Coffee } from '@phosphor-icons/react/dist/ssr';

const iconMapping = { Calories: Hamburger, Protein: Egg, Carbo: BowlFood, Sugar: IceCream } as Record<string, Icon>; //mudar os icones?

export interface TrafficProps {
  data: any[];
  labels: string[];
  sx?: SxProps;
}

export function FoodChart({ data, labels, sx }: TrafficProps): React.JSX.Element {
  const chartOptions = useChartOptions(labels);
  const [selectedDateFood, setSelectedDateFood] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [uniqueDatetimes, setUniqueDatetimes] = React.useState<string[]>([]);

  const getUniqueDatetimes = (data: any[]): string[] => {
    const uniqueDatetimes = new Set<string>();
  
    data.forEach((item) => {
      if (item.time_begin) {
        uniqueDatetimes.add(item.time_begin);
      }
    });
    console.log(data)
    console.log(uniqueDatetimes);
    return Array.from(uniqueDatetimes);
  };
  const handleConfirm = (selectedDate : any) => {
    setSelectedDateFood(selectedDate);

  }
  
  const filteredData = React.useMemo(() => {
    return data.filter(item => item.time_begin === selectedDateFood);
  }, [selectedDateFood, data]);

  
  const totalNutricionalValues = React.useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.calorie += item.calorie || 0;
        acc.carbo += item.carbo || 0;
        acc.protein += item.protein || 0;
        acc.sugar += item.sugar || 0;
        return acc;
      },
      { calorie: 0, carbo: 0, protein: 0, sugar: 0 } // valores iniciais zerados
    );
  }, [filteredData]);

  const chartSeries = React.useMemo(() => {
    
    return [
      Math.round(totalNutricionalValues.calorie * 100) / 100, 
      Math.round(totalNutricionalValues.carbo * 100) / 100, 
      Math.round(totalNutricionalValues.protein * 100) / 100, 
      Math.round(totalNutricionalValues.sugar * 100) / 100
    ];
  }, [totalNutricionalValues]);
  
  //const labels = ["Calories", "Carbs", "Protein", "Sugar"];
  
  React.useEffect(() => {
    if (data) {
      const datetimes = getUniqueDatetimes(data);
      setUniqueDatetimes(datetimes);
    }
  }, [data]);
  
  React.useEffect(() => {
    console.log("Filtered Data:", filteredData);
    console.log("Values:", totalNutricionalValues)
  }, [filteredData, totalNutricionalValues]);
  //obtem dados de alimentação
  return (
    <Card sx={sx}>
      <CardHeader 
        action={
        <Button color="inherit" size="small" onClick={() => setOpen(true)} startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
          Select Datetime
        </Button> 
        }
      title="Food Data" />

      <CardContent>
        <Stack spacing={2}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const Icon = iconMapping[label];
              const totalSum = chartSeries.reduce((acc, val) => acc + val, 0);
              const percentage = totalSum > 0 ? ((item / totalSum) * 100).toFixed(2) : "0";

              return (
                <Stack key={label} spacing={1} sx={{ alignItems: 'center' }}>
                  {Icon ? <Icon fontSize="var(--icon-fontSize-lg)" /> : null}
                  <Typography variant="h6">{label}</Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    {percentage}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        {data? <DatetimeModal open={open} handleClose={() => setOpen(false)} glucoseReadings={uniqueDatetimes} onConfirm={handleConfirm}></DatetimeModal> : <></>}
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.info.main,theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
