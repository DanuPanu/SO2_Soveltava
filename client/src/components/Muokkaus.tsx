import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

interface Props {
  dialogiAuki1 : boolean
  setDialogiAuki1 : Dispatch<SetStateAction<boolean>>
  apiKutsu : (arg0 : string, arg1? : any) => void
}

const Muokkaus: React.FC<Props> = (props : Props) : React.ReactElement => {

  const lomakeRef : any = useRef<HTMLFormElement>();
  const quillRef : any = useRef<any>();

  const tallenna = (e: React.FormEvent) : void => {

    e.preventDefault();

    props.apiKutsu("POST", {
      id : 0,
      otsikko : String(lomakeRef.current?.blogitekstinOtsikko.value),
      sisalto : quillRef.current.getEditorContents(),
      kirjoittaja : lomakeRef.current?.kirjoittaja.value === "" ? "Anonyymi" : lomakeRef.current?.kirjoittaja.value,
    })

    props.setDialogiAuki1(false);

  }

  const peruuta = () : void => {

    props.setDialogiAuki1(false);

  } 

  return <Dialog
            maxWidth="lg" 
            fullWidth={true}
            open={props.dialogiAuki1} 
            onClose={peruuta}
          >
          <DialogTitle>Lisää uusi kirjoitus</DialogTitle>
          <DialogContent style={{paddingTop : 10}}>
            <Stack 
              spacing={1} 
              component="form"
              onSubmit={tallenna}
              ref={lomakeRef}
            >
            <TextField
              name="blogitekstinOtsikko"
              label="Kirjoituksen otsikko"
              fullWidth
              variant="outlined"
            />

            <TextField
              sx={{marginBottom : 1}}
              name="kirjoittaja"
              label="Kirjoita nimesi(valinnainen)"
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
              variant="contained"
              type="submit"
            >Tallenna</Button>

            <Button
              variant="outlined"
              onClick={peruuta}
            >Peruuta</Button>

            </Stack>
          </DialogContent>

        </Dialog>;
};

export default Muokkaus;