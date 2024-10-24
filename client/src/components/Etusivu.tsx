import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';


const Etusivu : React.FC = () : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const klikki = () => {
        navigate("/artistit")
    }
return(
    <>
    <Box display="flex" flexDirection={"column"} alignItems={"center"} textAlign="center" sx={{marginTop : "5em"}}>
        <Typography variant='h5'>Lisää näkyvyyttäsi liittymällä artistiemme joukkoon!</Typography>
        <Button sx={{marginTop : "2em", height : "4em", width : "70%"}} variant='contained' onClick={klikki}>Selaa artistejamme!</Button>
    </Box>
    <Box display="flex" justifyContent="center" sx={{marginTop : "2em", marginBottom : "1em"}}>
        <Typography variant='h6'>Tämän hetken kuumimmat uutiset ja trendit</Typography>
    </Box>
    <Box display="flex" alignContent={"space-evenly"}>
        <Box sx={{width : "50%"}}>
            <Typography sx={{padding : "5px"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem maiores recusandae fugit. Nobis itaque officiis eveniet ea debitis eum voluptatem, dicta asperiores facere? Necessitatibus aut molestiae cupiditate doloremque in? Alias voluptatem velit inventore culpa ad dolore aperiam nam accusantium obcaecati, aliquid debitis eos quam iusto minima tenetur repudiandae, facere eligendi enim esse quasi iure dolor earum. Eaque voluptatem quibusdam ipsam cumque voluptatibus dignissimos aliquid consectetur ratione quaerat amet quo molestiae eius laboriosam veniam, expedita recusandae quas itaque nihil animi eveniet tenetur laudantium! Inventore, nostrum, libero ipsum doloremque iure eaque animi, perferendis eos atque nesciunt praesentium quam accusamus tempora autem cum?</Typography>
        </Box>
        <Box sx={{width : "50%"}}>
            <Typography sx={{padding : "5px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem voluptates molestias provident odio facilis non laboriosam mollitia, necessitatibus ab architecto, quasi, quia dignissimos nemo. Libero ipsum iusto aliquam ad asperiores esse odit veritatis enim? Odio animi quisquam voluptatibus velit quia minima sapiente excepturi perferendis alias illo aliquam, quasi fuga recusandae ipsa possimus delectus, expedita dolor fugiat repellat inventore aut! Rem neque laborum, ut corrupti quam sit, quos eius illum delectus nesciunt est possimus molestiae sequi asperiores nisi quaerat pariatur soluta aperiam aliquid labore adipisci at molestias. Ipsum sapiente voluptates blanditiis optio officiis, debitis aperiam temporibus expedita, laudantium libero magni autem sed dolorum eius illum, quas a sint id necessitatibus nulla! Aspernatur quo impedit error illum iste placeat expedita dolorem at blanditiis. Assumenda iusto aspernatur quis ipsam nulla fuga repellendus expedita deserunt exercitationem culpa, qui eius ut, optio rerum pariatur aliquam earum et debitis? Iusto recusandae nobis explicabo quisquam et harum.</Typography>
        </Box>
    </Box>  
    </> 
);
}

export default Etusivu
