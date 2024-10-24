import React, { useEffect, useRef, useState } from "react";
import { Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface Props {
  token : string
}

interface Kayttaja {
  id : number
  etunimi : string
  sukunimi : string
  kaupunki : string
  tyyli : string
  kerro : string
  tyopaikka : string
  s_posti : string
  puhnumero : string
  kayttajatunnus : string
  salasana : string
}

interface ApiData {
  kayttajat : Kayttaja[]
  virhe : string
  haettu : boolean
}

const Rekisteröidy: React.FC<Props> = (props : Props) : React.ReactElement => {

    const klikki = () => {
        navigate("/")
    }

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<any>();

  const [apiData, setApiData] = useState<ApiData>({
                                        kayttajat : [],
                                        virhe : "",
                                        haettu : false
                                      });


  const lisaaKayttaja = async (e: React.FormEvent) => {
    e.preventDefault();

    apiKutsu("POST", {
      id : 0,
      etunimi : lomakeRef.current?.etunimi.value,
      sukunimi : lomakeRef.current?.sukunimi.value,
      kaupunki : lomakeRef.current?.kaupunki.value,
      tyyli : lomakeRef.current?.tyyli.value,
      kerro : lomakeRef.current?.kerro.value,
      tyopaikka : lomakeRef.current?.tyopaikka.value,
      s_posti : lomakeRef.current?.s_posti.value,
      puhnumero : lomakeRef.current?.puhnumero.value,
      kayttajatunnus : lomakeRef.current?.kayttajatunnus.value,
      salasana : lomakeRef.current?.salasana.value,
    });

    alert("Kiitos rekisteröitymisestä!")
    navigate("/")
  }

const apiKutsu = async (metodi? : string, kayttaja? : Kayttaja, id? : number) : Promise<void> => {

  setApiData({
    ...apiData,
    haettu : false
  });

  let url = `/artistit`;

  let asetukset : any = { 
    method : metodi || "GET",
    headers : {
      'Authorization' : `Bearer ${props.token}`
    }
  };

  if (metodi === "POST") {

    asetukset = {
      ...asetukset,
      headers : {
        ...asetukset.headers,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(kayttaja)
    }

  }
  
  try {

    const yhteys = await fetch(url, asetukset);

    if (yhteys.status === 200) {
      setApiData({
        ...apiData,
        kayttajat : await yhteys.json(),
        haettu : true
      });
    } else {

      let virheteksti :string = "";

      switch (yhteys.status) {

        case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
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
        <Paper sx={{padding : 2, marginTop : 3}}>
            <Typography variant="h6">Täytä alla olevat kentät</Typography>
                    <Stack
                      spacing={2} 
                      sx={{margin : "10px"}}
                      component="form"
                      onSubmit={lisaaKayttaja}
                      ref={lomakeRef}
                      >
                        <TextField 
                            label="Etunimi" 
                            name="etunimi"
                        />
                        <TextField 
                            label="Sukunimi"
                            name="sukunimi"
                        />
                        <TextField 
                            label="Käyttäjätunnus" 
                            name="kayttajatunnus"
                        />
                        <TextField 
                            label="Salasana" 
                            name="salasana"
                            type="password"
                        />
                        <TextField 
                            label="Sähköposti" 
                            name="s_posti"
                        />
                        <TextField 
                            label="Puhelinnumero"
                            name="puhnumero"
                        /> 
                        <TextField 
                            label="Kaupunki jossa työskentelet" 
                            name="kaupunki"
                        />
                        <TextField 
                            label="Tatuointi tyyli"
                            name="tyyli"
                        />
                        <TextField 
                            label="Työpaikka(yrittäjänä vai liikkeessä)" 
                            name="tyopaikka"
                        />
                    
                        <TextField 
                            sx={{marginBottom : "10px"}}
                            multiline
                            label="Kerro itsestäsi"
                            name="kerro"></TextField>
                        <Button 
                            sx={{marginBottom : "10px"}}
                            type="submit" 
                            variant="contained" 
                            size="large"
                            >
                                Rekisteröidy
                        </Button>
                        <Button onClick={klikki}>Peruuta</Button>
                      </Stack>
        </Paper>
        </>
    );
};

export default Rekisteröidy;