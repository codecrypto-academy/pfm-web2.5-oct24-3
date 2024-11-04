// front/src/App.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { useEffect, useState } from 'react';

type Data = {
  p1: string
  p2: string
  p3: string
}

function App() {
  const [data, setData] = useState <Data | null> (null)
  useEffect(() =>{
    fetch('http://localhost:3333/Parametros/Master/123')
    .then(res => res.json())
    .then(data => setData(data))
  }, [])

  if (!data) return <div>Loading data.....waiting</div>

  return (
    <div className="App">
      <Header />
      <main className="content">
        {/* Aquí puedes añadir el contenido principal de la aplicación */}
        <h2>Bienvenido a Build Private Ethereum Networks</h2>
        <p>Configura y administra redes privadas de Ethereum de manera sencilla.</p>
        <p>
          {data?.p1} {data?.p2} {data?.p3}
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
