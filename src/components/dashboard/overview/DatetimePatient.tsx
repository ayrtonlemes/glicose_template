'use client'
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import { Button } from '@mui/material';
import DatetimeModal from '../DatetimeModal';
import { useCallback, useEffect, useState } from 'react';
import { getAllDatetimePatient } from '@/services/getAllDatetimePatient';

export interface TasksProgressProps {
  patientData: any;
  onDatetimeSelect: (selectedDatetime: string) => void;
  setLoading: (status: boolean) => void;
  sx?: SxProps;
}

export function DatetimePatient({patientData, onDatetimeSelect, setLoading, sx }: TasksProgressProps): React.JSX.Element {

  //carregar a tela do novo componente para escolher a data
  //somente funcionar depois de ter selecionado paciente?
  /// se sim como mostrar para o usuario, botao desabilitado e um aviso para ele selecionar?

  const [open, setOpen] = useState<boolean>(false);
  const [selectedDatetime, setSelectedDatetime] = useState<string>('');
  const [datetimeList, setDatetimeList] = useState<any[]>([]);
  
  const [error, setError] = useState<string>("");



  const fetchDatetimePatient = useCallback(async (id_patient: number) => {
    try {
      setLoading(true)
      //set message of loading datetimes..maybe..
      const data = await getAllDatetimePatient(id_patient);
      if(data && data.length > 0) {
        const allDates = data.map((item: {datetime: string}) => item.datetime)
        setDatetimeList(allDates);
        console.log("Atualizado todos os datetimes do paciente.")
      } else {
        setDatetimeList([]);
      } 
    } catch(err) {
      setError("Erro ao carregar todos os datetimes");
      console.log(err)
    } finally {
      setLoading(false);
    }
  }, [])

  const handleOpenModal = () => {
    if(patientData){
      fetchDatetimePatient(patientData.id_patient)
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleDatetimeSelect = (selectedDatetime: string) => {
    setSelectedDatetime(selectedDatetime); 
    onDatetimeSelect(selectedDatetime); // Passa a informação selecionada para o componente pai
    handleCloseModal(); // Fecha o modal
  }


  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Datetime
              </Typography>
              {selectedDatetime}
            </Stack>
            {/*
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <ListBulletsIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
            */}
          </Stack>
          <div>
            <Button variant="outlined" onClick={handleOpenModal} disabled={!patientData}>Select</Button>
          </div>
        </Stack>
      {patientData? <DatetimeModal open={open} handleClose={() => setOpen(false)} glucoseReadings={datetimeList} onConfirm={handleDatetimeSelect}></DatetimeModal> : <></>}
      </CardContent>
    </Card>
    
  );
}
