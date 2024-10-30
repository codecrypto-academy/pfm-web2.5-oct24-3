// front/src/App.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="content">
        {/* Aquí puedes añadir el contenido principal de la aplicación */}
        <h2>Bienvenido a Build Private Ethereum Networks</h2>
        <p>Configura y administra redes privadas de Ethereum de manera sencilla.</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
