import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';


const YlaPalkki : React.FC = () : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const klikki1 = () => {
        navigate("/rekisteröidy")
    }

    const klikki3 = () => {
        navigate("/profiili")
    }

    const klikki4 = () => {
        navigate("/")
    }

    const klikki5 = () => {
        navigate("/keskustelupalsta")
    }

return(
    <>
    <Typography textAlign={"center"} variant='h4'>Tatuointi artisti haku</Typography>
    <Box sx={{marginTop : "1em"}} display="flex" alignItems="center" justifyContent="center">
        <Button onClick={klikki4}>Etusivu</Button>
        <Button onClick={klikki5}>Keskustelupalsta</Button>
        <Button variant='contained' onClick={klikki1}>Rekisteröidy Artistiksi</Button>
        <Button onClick={klikki3}>Profiili</Button>
    </Box>
    </>
)

}

export default YlaPalkki
