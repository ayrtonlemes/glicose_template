import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import { Button } from '@mui/material';
import { getResultModel } from '@/services/getResultModel';

export interface PredictBoxProps {
  patientId: string;
  selectedDate: string;
  isSideBarOpen: boolean;
  loading: boolean;
  changeStatusSideBar: () => void
  setLoading: (status: boolean) => void;
  setGlicoResult: (value :any) => void;
  sx?: SxProps;
}

export function PredictBox({patientId, selectedDate, isSideBarOpen, changeStatusSideBar, loading, setLoading, setGlicoResult, sx }: PredictBoxProps): React.JSX.Element {
  //vai ser um botão que ao clicar nele:
    //abre uma animação de loading para esperar o modelo.
    ///  ao terminar a animação ativa uma sidebar vindo provavelmente da direita
    ///  com as informações obtidas do modelo.
    const [result, setResult] = React.useState<any>();

    const fetchResultData = async () => {
      try {
        console.log("iniciando modelo prediction")
        setLoading(true);
        const response = (patientId && selectedDate) ? await getResultModel(patientId, selectedDate) : ""
         // Buscar os dados
        if (response !== "") {
          const value = response;
          setResult(value); // Atualizar o valor de result
          setGlicoResult(value)
          console.log("RESULTADO:", value)
        } else {
          setResult("Nenhum dado encontrado");
        }
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
        setResult("Erro ao obter os dados");
      }finally {
        setLoading(false);
      }
    };

  const handleSideBarModel = () => {
    if(!isSideBarOpen && !loading) {
      fetchResultData();
    }
    if(!loading){
      changeStatusSideBar();
    }
  }
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Predict Model
            </Typography>
            {/*<Typography variant="h4">{value}</Typography>*/}
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
            <ReceiptIcon fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
        </Stack>
        <Button variant="outlined" onClick={handleSideBarModel} disabled={!patientId || !selectedDate}>Predict</Button>
      </CardContent>
    </Card>
  );
}
