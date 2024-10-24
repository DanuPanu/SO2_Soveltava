import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Paper, Stack, TextField, Typography } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

interface Props {
  dialogiAuki2 : boolean
  valittuKeskustelu : any
  setDialogiAuki2 : Dispatch<SetStateAction<boolean>>
}

interface Viesti {
  id : number
  viesti : string
  nimi : string
  keskusteluId : number
}

interface ApiData {
  viestit : Viesti[]
  virhe : string
  haettu : boolean
}

interface fetchAsetukset {
  method : string
  headers? : any
  body? : string
}

const Lue: React.FC<Props> = (props : Props) : React.ReactElement => {

  const lomakeRef : any = useRef<HTMLFormElement>();
  const quillRef : any = useRef<any>();
  const [nakyy, setNakyy] : any = useState<string>("none");
  const [nakyy2, setNakyy2] : any = useState<string>("block");

  const tallenna = (e: React.FormEvent) : void => {

    e.preventDefault();

    apiKutsu("POST", {
      id : 0,
      viesti : quillRef.current.getEditorContents(),
      nimi : lomakeRef.current?.kirjoittaja.value === "" ? "Anonyymi" : lomakeRef.current?.kirjoittaja.value,
      keskusteluId : props.valittuKeskustelu.id,
    })
    setNakyy("none")
    setNakyy2("block")
  } 

  const peruuta = () : void => {
    props.setDialogiAuki2(false);
    setNakyy("none")
    setNakyy2("block")
  }

  const KlikkiHandle = () => {
    setNakyy("block")
    setNakyy2("none")
  }

  const [apiData, setApiData] = useState<ApiData>({
    viestit : [],
    virhe : "",
    haettu : false
  });

  const apiKutsu = async (metodi? : string, viesti? : Viesti, id? : number) : Promise<void> => {

    setApiData({
      ...apiData,
      haettu : false
    });

    let url =  `/artistit/viestit`;

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
        body : JSON.stringify(viesti)
      }

    }
    
    try {

      const yhteys = await fetch(url, asetukset);

      if (yhteys.status === 200) {

        setApiData({
          ...apiData,
          viestit : await yhteys.json(),
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

  return <Dialog
            maxWidth="lg" 
            fullWidth={true}
            open={props.dialogiAuki2} 
            onClose={peruuta}
          >
          <DialogTitle >{props.valittuKeskustelu.otsikko}</DialogTitle>
          <DialogContent style={{paddingTop : 10}}>
            <Stack 
              spacing={1} 
            >
            
            <Typography variant="body1">
                <span dangerouslySetInnerHTML={ {__html : props.valittuKeskustelu.sisalto} }/>
            </Typography>

            <Typography variant="h6">Viestit:</Typography>
            {apiData.viestit.filter((viesti: Viesti) => viesti.keskusteluId === props.valittuKeskustelu.id)
            .map((viesti : Viesti, idx : number) => {
                    return <Paper key={idx} sx={{padding : 2}}>

                            <Typography variant="h6">{viesti.nimi}</Typography>
                            
                            <Typography variant="body1" sx={{marginTop : 2}}>
                              <span dangerouslySetInnerHTML={ {__html : viesti.viesti} }/>
                            </Typography>
                          </Paper>                    
                  })}

              <Box sx={{display : nakyy}}>
                <Stack sx={{display : nakyy}}
                      component="form"
                      onSubmit={tallenna}
                      ref={lomakeRef}>
                <TextField
                  sx={{marginBottom : 1}}
                  name="kirjoittaja"
                  label="Kirjoita nimesi"
                  fullWidth
                  variant="outlined"
                />

                <ReactQuill
                  ref={quillRef}
                  style={{
                    height : 200,
                    marginBottom : 50
                  }}
                />

                <Button 
                  fullWidth
                  variant="contained"
                  type="submit"
                >Tallenna</Button>
              </Stack>
            </Box>
              <Button
                sx={{display : nakyy2}}
                variant="contained"
                onClick={KlikkiHandle}
              >Vastaa keskusteluun</Button>
  
              <Button
                variant="contained"
                onClick={peruuta}
              >Takaisin</Button>

            </Stack>
          </DialogContent>

        </Dialog>;
};

export default Lue;