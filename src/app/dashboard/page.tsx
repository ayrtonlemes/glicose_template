'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { PatientComponent } from '@/components/dashboard/overview/PatientSelectorComponent';
import { SensorChart } from '@/components/dashboard/overview/SensorChart';
import { SelectSensor } from '@/components/dashboard/overview/SensorSelectorComponent';
import { PredictBox } from '@/components/dashboard/overview/PredictBox';
import { FoodChart } from '@/components/dashboard/overview/FoodChart';
import { DatetimePatient } from '../../components/dashboard/overview/DatetimePatient';
import { getPatientSensors } from '@/services/getPatientSensors';
import { getPatientFoodData } from '@/services/getPatientFoodData';
import { Backdrop, CircularProgress, Typography } from '@mui/material';
import SidebarApp from '@/components/dashboard/overview/PreviewModel';

export default function Page(): React.JSX.Element {
  
  const [patient, setPatient] = React.useState<any>(null);

  const [selectedPatient, setSelectedPatient] = React.useState<any>(null);
  const [selectedSensor, setSelectedSensor] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<string>(""); //general for both graphs (sensors and food)
  
  const [sensorData, setSensorData] = React.useState<any[]>([]); //sensorData
  const [foodData, setFoodData] = React.useState<any[]>([])//foodData
  const [glicoResult, setGlicoResult] = React.useState<any>();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingFood, setLoadingFood] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchSensorsData = React.useCallback(async (id_patient: number, selectedSensor: string, dateTime: string) => {
    try {
      setLoading(true);
      const data = await getPatientSensors(id_patient, selectedSensor, dateTime)
      console.log(data);
      if(data && data.length > 0) {
        setSensorData(data);
      }
    }catch(err) {
      setError("Erro ao obter dados do sensor do paciente");
      console.log(err);
    }finally {
      setLoading(false);
    }
  }, [])

  const fetchFoodData = React.useCallback(async (id_patient: number) => {
      try {
        if(id_patient) {
          setLoadingFood(true);
          const data = await getPatientFoodData(id_patient);
          setFoodData(data)
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoadingFood(false);
      }
    },[]);

  //sensorData tem que ser nessa página para passar info (talvez nao tenha que ser nessa mas nada muda a não ser a organização)
  /// se formos fazer botões para os dois gráficos individuais, ira carregar a página mas será assim:
  /// primeiro botão: ja existia e é o que manda pro modelo os dados necessários
  /// segundo botão: vai coletar o momento que se quer ver do sensor  - possivelmente vai ser junto do primeiro botão pra não lascar a página, porem a se pensar
  /// terceiro botão: muda somente o datetime para o gráfico de alimentação

  ///atualização - somente dois botões que mexem com data. :
  // um para ver os sensores, que posteriormente vai pro modelo
  // segundo para er somente dados de alimentação
  React.useEffect(() => {
    if(selectedPatient && selectedSensor && selectedDate) {
      //const patient = patients?.find(p => p.name === selectedPatient);
      if(patient) {
        setSensorData([]);
        fetchSensorsData(patient.id_patient, selectedSensor, selectedDate);
      }
    }
  }, [selectedPatient, selectedSensor, selectedDate, fetchSensorsData]);

  React.useEffect(() => {
    if(selectedPatient && patient.id_patient) {
      if(patient) {
        setFoodData([]);
        setLoading(true)
        fetchFoodData(patient.id_patient);
      }
      setLoading(false);
    }
  },[patient])
  
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <PatientComponent selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} setPatientInfo={setPatient} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <SelectSensor  selectedSensor={selectedSensor} setSelectedSensor={setSelectedSensor} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <DatetimePatient patientData={patient} onDatetimeSelect ={setSelectedDate} setLoading={setLoading} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <PredictBox  patientId={patient?.id_patient} selectedDate={selectedDate} isSideBarOpen={isSidebarOpen} setGlicoResult={setGlicoResult} loading={loading} setLoading={setLoading} changeStatusSideBar={toggleSidebar} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={8} xs={12}>
        <SensorChart
          selectedPatient={patient}
          selectedSensor={selectedSensor}
          data={sensorData}
          datetime={selectedDate}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        {loadingFood ? <Typography>Loading</Typography> : <FoodChart 
        data={foodData.length > 0 ? foodData : []}
        labels={['Calories', 'Carbo', 'Protein', 'Sugar']} //pode ser definido lá dentro mas por enquanto aqui fora 
        sx={{ height: '100%' }} />}
      <SidebarApp open={isSidebarOpen && !loading} setOpen={toggleSidebar} glicoResult={glicoResult} />
      </Grid>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1, // Para garantir que o Backdrop fique acima de outros componentes
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Escurece a tela
        }}
        open={loading} // Exibe o Backdrop somente quando o loading estiver ativo
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
}
