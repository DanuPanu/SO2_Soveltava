import React, { useState } from 'react';
import { Container} from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import YlaPalkki from './components/YläPalkki';
import Etusivu from './components/Etusivu';
import Rekisteröidy from './components/Rekisteröidy';
import Login from './components/Login';
import Artistit from './components/Artistit';
import Profiili from './components/Profiili';
import Palsta from './components/Palsta';

const App : React.FC = () : React.ReactElement => {

  const [token, setToken] = useState<string>(String(localStorage.getItem("token")));

  return (
    <Container>
      <YlaPalkki></YlaPalkki>
      <Routes>
        <Route path="/" element={<Etusivu/>}/>
        <Route path="/rekisteröidy" element={<Rekisteröidy token={token}/>}/>
        <Route path="/login" element={<Login setToken={setToken}/>}/>
        <Route path="/artistit" element={<Artistit/>}/>
        <Route path="/profiili" element={<Profiili token={token}/>}/>
        <Route path="/keskustelupalsta" element={<Palsta/>}/>
      </Routes>
  </Container>
  );
}

export default App;
