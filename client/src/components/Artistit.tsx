import React, { useRef, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material';

interface Artisti {
    etunimi   : string
    sukunimi  : string
    kaupunki  : string
    tyyli     : string
    kerro     : string
    tyopaikka : string
    s_posti   : string
    puhnumero : string
}

const Artistit : React.FC = () : React.ReactElement => {

  const lomakeRef = useRef<any>();
  const [artistit, setArtistit] = useState<any[]>([]);
  const [virhe, setVirhe] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const [valittuHenkilo, setValittuHenkilo] = useState<Artisti>({
                                        etunimi   : "",
                                        sukunimi  : "",
                                        kaupunki  : "",
                                        tyyli     : "",
                                        kerro     : "",
                                        tyopaikka : "",
                                        s_posti   : "",
                                        puhnumero : ""
});

const handleClickOpen = (ihminen : Artisti) => {
    setOpen(true)
    setValittuHenkilo(ihminen)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const kaynnistaHaku = async (e : React.FormEvent) : Promise<void> => {

    e.preventDefault();


    try {

        setVirhe("")

        let url : string = `/artistit?hakusana=${lomakeRef.current.hakusana.value}&hakusanaKaupunki=${lomakeRef.current.hakusanaKaupunki.value}`;

        const yhteys = await fetch(url);
 
        
        if (yhteys.ok) {

          setArtistit(await yhteys.json());

        } else {

          switch (yhteys.status) {

            case 400 : setVirhe("Virheellinen hakusana"); break;
            default : setVirhe("Palvelimella tapahtui odottamaton virhe"); break;
  
          }

        }

        

    } catch (e: any) {

      setVirhe("Palvelimelle ei saada yhteyttä.")

    } 

  }


  return (
    <>
    <Container sx={{marginTop : "4em", display : "flex", alignItems : "center", flexDirection : "column"}}>
    <Box display="flex" justifyContent={"center"} sx={{marginBottom : "1em"}}>
        <Typography variant="h5" sx={{marginBottom: 2}}>Hae artisteja nimellä tai kaupungin nimellä!</Typography>
    </Box>
      <Paper 
        component="form"
        onSubmit={kaynnistaHaku}
        ref={lomakeRef}
        elevation={2}
        sx={{ padding : 2 , marginBottom: 2}}
      >
        <Stack spacing={2}>

          <Grid container spacing={1}>

            <Grid item xs={10}>

              <TextField 
                name="hakusana"
                variant="outlined"
                size="small"
                fullWidth={true}
                placeholder="Artistin nimi..."
              />

            </Grid>
            <Grid item xs={10}>

              <TextField 
                name="hakusanaKaupunki"
                variant="outlined"
                size="small"
                fullWidth={true}
                placeholder="Kaupungin nimi..."
              />

            </Grid>
            <Grid item xs={2}>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth={true}
              >Hae</Button>

            </Grid>
          </Grid>
        </Stack>

      </Paper>

      {(Boolean(virhe)) 
        ? <Alert severity="error">{virhe}</Alert>
        : <List>{artistit.map((artisti : Artisti, idx : number) => {
          return <ListItem key={idx}>
            <Dialog open={open} onClose={handleClose}>
                  <DialogTitle sx={{textAlign : "center"}}>Tarkemmat tiedot</DialogTitle>
                  <DialogContent>
                      <Typography sx={{textAlign : "center"}} variant="h5">{`Nimi: ${valittuHenkilo.etunimi} ${valittuHenkilo.sukunimi}`}</Typography>
                    <Container sx={{display : "flex", justifyContent : "center", marginTop : "1em"}}>
                        <Box sx={{marginRight : "10px", textAlign : "center"}}>
                          <Typography variant="body1">{`Kaupunki: ${valittuHenkilo.kaupunki}`}</Typography>
                          <Typography variant="body1">{`Tyyli: ${valittuHenkilo.tyyli}`}</Typography>
                          <Typography variant="body1">{`Työpaikka: ${valittuHenkilo.tyopaikka}`}</Typography>
                        </Box>
                        <Box sx={{marginLeft : "10px", textAlign : "center"}}>
                          <Typography variant="body1">{`Yhteystiedot:`}</Typography>
                          <Typography variant="body1">{`Sähköposti: ${valittuHenkilo.s_posti}`}</Typography>
                          <Typography variant="body1">{`Puhelin: ${valittuHenkilo.puhnumero}`}</Typography>
                        </Box>
                    </Container>
                      <Typography sx={{marginTop : "1em"}} textAlign={"center"} variant="body1">{`Profiili: ${valittuHenkilo.kerro}`}</Typography>
                  </DialogContent>
                  <DialogActions sx={{display : "flex", justifyContent : "center"}}>
                      <Button sx={{width : "80%"}} variant='outlined' onClick={handleClose}>Sulje</Button>
                  </DialogActions>
                </Dialog>
                    <ListItemText 
                      sx={{marginRight : "25px"}}
                      primary={`${artisti.etunimi} ${artisti.sukunimi}`}
                      secondary={`${artisti.kaupunki}`}  
                    />
                    <Button sx={{marginLeft : "25px"}} onClick={() => {handleClickOpen(artisti)}} variant="outlined" startIcon={<InfoIcon/>}>Lisätietoja</Button>
                  </ListItem>
        })}</List>
      }

    </Container>
    </>
  );
}
export default Artistit;