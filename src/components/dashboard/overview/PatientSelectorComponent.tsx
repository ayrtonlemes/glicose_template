'use client'

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { getAllPatients } from '@/services/getPatients';
import { getDatetime } from '@/services/getDatetime';

interface BudgetProps {
  selectedPatient: string;
  setSelectedPatient: (patient: string) => void;
  setPatientInfo: (patient:any) => void;
  sx?: any;
}

export function PatientComponent({ selectedPatient, setSelectedPatient, setPatientInfo, sx }: BudgetProps): React.JSX.Element {
  
  const [patients, setPatients] = useState<any>();
  const [patientData, setPatientData] = useState<any>();
  const [dateTimeRange, setDatetimeRange] = useState<any>();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [minNav, setMinNav] = useState<any>(0);
  const [maxNav, setMaxNav] = useState<any>(20);
  const [error, setError] = useState<string>("");
  
  const handlePatientChange = (event: SelectChangeEvent) => {
    const selectedName = event.target.value as string;
    setSelectedPatient(selectedName);
    //setSensorData([]);
    //setSelectedSensor('');
    //setSelectedDate('');
    const patient = patients?.find((p) => p.name === selectedName);
    if (patient) {
      setPatientData(patient);
      setPatientInfo(patient);
      setMinNav(0);
      fetchDatetimeRange(patient.id_patient, 0, maxNav);
    }
  };


  const fetchDatetimeRange = useCallback(async (id_patient: number, min: number, limit: number) => {
    try {
      setLoading(true);
      const data = await getDatetime(id_patient, min, limit);
      if (data && data.length > 0) {
        const formattedDates = data.map((item: { datetime: string }) => item.datetime);
        setDatetimeRange(formattedDates);
        console.log("Atualizado datetimeRange:", formattedDates);
      } else {
        setDatetimeRange([]);
      }
    } catch (err) {
      setError("Erro ao carregar datetimes do paciente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      setError("Erro ao carregar pacientes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients]);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Patient
              </Typography>
            </Stack>
          </Stack>
          <Select
          labelId="patient-selector-label"
          value={selectedPatient ?? ''}
          onChange={handlePatientChange}
        >
          {patients
            ? patients.map((patient) => (
                <MenuItem key={patient.id_patient} value={patient.name}>
                  {patient.name}
                </MenuItem>
              ))
            : (
                <MenuItem value="" disabled>
                  No patients found.
                </MenuItem>
              )}
        </Select>
        </Stack>
      </CardContent>
    </Card>
  );
}
