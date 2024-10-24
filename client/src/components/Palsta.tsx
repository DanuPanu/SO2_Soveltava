import React, { useEffect, useState } from 'react';
import { Alert, Backdrop, Button, CircularProgress, Container, Paper, Stack, Typography} from '@mui/material';
import { format, parseJSON } from 'date-fns';
import Muokkaus from './Muokkaus';
import Lue from './Lue';

interface Keskustelupalsta {
  id : number
  otsikko : string
  sisalto : string
  kirjoittaja : string
  aikaleima : string
}

interface ApiData {
  keskustelut : Keskustelupalsta[]
  virhe : string
  haettu : boolean
}

interface fetchAsetukset {
  method : string
  headers? : any
  body? : string
}

const Palsta : React.FC = () : React.ReactElement => {

  const [dialogiAuki1, setDialogiAuki1] = useState<boolean>(false);
  const [dialogiAuki2, setDialogiAuki2] = useState<boolean>(false);

  const [valittuKeskustelu, setValittuKeskustelu] = useState<Keskustelupalsta>({
    id : 0,
    otsikko : "",
    sisalto : "",
    kirjoittaja : "",
    aikaleima : ""
  });

  const handleClick = (keskustelu : Keskustelupalsta) => {
    setValittuKeskustelu(keskustelu)
    setDialogiAuki2(true)
  }

  const [apiData, setApiData] = useState<ApiData>({
                                                    keskustelut : [],
                                                    virhe : "",
                                                    haettu : false
                                                  });


  const apiKutsu = async (metodi? : string, keskustelu? : Keskustelupalsta) : Promise<void> => {

    setApiData({
      ...apiData,
      haettu : false
    });

    let url = `/artistit/keskustelupalsta`;

    let asetukset : fetchAsetukset = { 
      method : metodi || "GET"
    };

    if (metodi === "POST") {

      asetukset = {
        ...asetukset,
        headers : {
          ...asetukset.headers,
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(keskustelu)
      }

    }
    
    try {

      const yhteys = await fetch(url, asetukset);

      if (yhteys.status === 200) {

        setApiData({
          ...apiData,
          keskustelut : await yhteys.json(),
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
      <Container>

        <Typography variant="h5" sx={{marginBottom: 3}}>Keskustelupalsta</Typography>
        
        <Button 
          variant='contained'
          onClick={() => { setDialogiAuki1(true) }}
          sx={{marginBottom: 2}}>
          Aloita uusi keskustelu
        </Button>

        {(Boolean(apiData.virhe))
          ? <Alert severity="error">{apiData.virhe}</Alert>
          : (apiData.haettu) 
            ? <Stack spacing={3}>

                  {apiData.keskustelut.sort((a, b) => parseJSON(b.aikaleima).getTime() - parseJSON(a.aikaleima).getTime())
                  .map((keskustelu : Keskustelupalsta, idx : number) => {
                    return <Paper key={idx} sx={{padding : 2}}>

                            <Typography onClick={() => {handleClick(keskustelu)}} variant="h4">{keskustelu.otsikko}</Typography><Typography variant='h5'>Keskustelun aloittaja: {keskustelu.kirjoittaja}</Typography>

                            <Typography variant="body2">Julkaistu {format(parseJSON(keskustelu.aikaleima), "dd.MM.yyyy HH.mm")}</Typography>
                            
                            <Typography variant="body1" sx={{marginTop : 2}}>
                              <span dangerouslySetInnerHTML={ {__html : keskustelu.sisalto} }/>
                            </Typography>

                          </Paper>                    
                  })}
                
              </Stack>              
            : <Backdrop open={true}>
                <CircularProgress color='inherit'/>
              </Backdrop>
        }

      <Muokkaus dialogiAuki1={dialogiAuki1} setDialogiAuki1={setDialogiAuki1} apiKutsu={apiKutsu}/>
      <Lue dialogiAuki2={dialogiAuki2} setDialogiAuki2={setDialogiAuki2} valittuKeskustelu={valittuKeskustelu}/>

    </Container>
  );
}

export default Palsta;