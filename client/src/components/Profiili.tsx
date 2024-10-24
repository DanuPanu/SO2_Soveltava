import React, { useEffect, useState } from 'react';
import { Box, Button, Typography} from '@mui/material';
import {useNavigate, NavigateFunction} from 'react-router-dom';

interface Artisti {
    id        : number
    etunimi   : string
    sukunimi  : string
    kaupunki  : string
    tyyli     : string
    kerro     : string
    tyopaikka : string
    s_posti   : string
    puhnumero : string
}

interface ApiData {
  artisti : Artisti
  virhe : string
  haettu : boolean
}

interface fetchAsetukset {
  method : string
  headers? : any
  body? : string
}

interface Props {
  token : string
}

const Profiili : React.FC<Props> = (props : Props) : React.ReactElement => {

  const navigate : NavigateFunction = useNavigate();

  const klikki = () => {
    alert("Ulos kirjautuminen onnistui!")
    localStorage.clear()
    navigate("/")
    window.location.reload()
  }

  const [apiData, setApiData] = useState<ApiData>({
                                                    artisti : {
                                                        id        : 0,
                                                        etunimi   : "",
                                                        sukunimi  : "",
                                                        kaupunki  : "",
                                                        tyyli     : "",
                                                        kerro     : "",
                                                        tyopaikka : "",
                                                        s_posti   : "",
                                                        puhnumero : ""
                                                    },
                                                    virhe : "",
                                                    haettu : false
                                                  });

  const apiKutsu = async (metodi? : string, artisti? : Artisti, id? : number) : Promise<void> => {

    setApiData({
      ...apiData,
      haettu : false
    });

    let url = `/profiili`;

    let asetukset : fetchAsetukset = { 
      method : metodi || "GET",
      headers : {
        'Authorization' : `Bearer ${props.token}`
      }
    };
    
    try {

      const yhteys = await fetch(url, asetukset);

      if (yhteys.status === 200) {

        setApiData({
          ...apiData,
          artisti : await yhteys.json(),
          haettu : true
        });

      } else {

        let virheteksti :string = "";

        switch (yhteys.status) {

          case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
          case 401 : navigate("/login"); break;
          default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;

        }

        setApiData({
          ...apiData,
          virhe : virheteksti,
          haettu : true
        });

      }

    } catch (e : any) {

      setApiData({
        ...apiData,
        virhe : "Palvelimeen ei saada yhteyttä",
        haettu : true
      });

    }

  }

  useEffect(() => {
    apiKutsu();
  }, []);

  return (
      <>
        <Typography sx={{marginTop : "0.5em", marginBottom : "1em"}} textAlign={"center"} variant='h4'>Profiilisi</Typography>
        <Typography variant='body1' sx={{marginTop : "3px", fontSize : "1.5em"}}>Nimi: {apiData.artisti.etunimi} {apiData.artisti.sukunimi}</Typography>
        <Typography variant='body1' sx={{marginTop : "10px", fontSize : "1.5em"}}>Kaupunki: {apiData.artisti.kaupunki}</Typography>
        <Typography variant='body1' sx={{marginTop : "10px", fontSize : "1.5em"}}>Tyylisi: {apiData.artisti.tyyli}</Typography>
        <Typography variant='body1' sx={{marginTop : "10px", fontSize : "1.5em"}}>Kerro itsestäsi: {apiData.artisti.kerro}</Typography>
        <Typography variant='body1' sx={{marginTop : "10px", fontSize : "1.5em"}}>Työpaikka: {apiData.artisti.tyopaikka}</Typography>
        <Typography variant='body1' sx={{marginTop : "10px", fontSize : "1.5em"}}>Sähköpostiosoite: {apiData.artisti.s_posti}</Typography>
        <Typography variant='body1' sx={{marginTop : "10px", fontSize : "1.5em"}}>Puhelinnumero: {apiData.artisti.puhnumero}</Typography>
        <Box display={"flex"} justifyContent={"center"}>
          <Button onClick={klikki} sx={{width : "60%", marginTop : "15px", fontSize : "1em"}} variant='contained'>Kirjaudu ulos</Button>
        </Box>
    </>
  );
}

export default Profiili;