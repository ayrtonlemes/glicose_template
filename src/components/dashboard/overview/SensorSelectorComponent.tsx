'use client'

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { sensorConfigs } from '@/types/sensors';

export interface SelectSensorProps {
  selectedSensor: string;
  setSelectedSensor: (selectedSensor: string) => void;
  sx?: SxProps;
}

export function SelectSensor({ selectedSensor, setSelectedSensor, sx}: SelectSensorProps): React.JSX.Element {

  const allSensors = sensorConfigs;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Sensors
              </Typography>
            </Stack>
          </Stack>
          <Select
              labelId="sensor-select-label"
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value as string)}
            >
              {Object.keys(allSensors).map((key) => (
                <MenuItem key={key} value={key}>
                  {allSensors[key].typeSensor}
                </MenuItem>
              ))}
            </Select>
        </Stack>
      </CardContent>
    </Card>
  );
}
