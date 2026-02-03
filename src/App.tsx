import React from 'react';
import logo from './logo.svg';
import './App.css';

const App: () => JSX.Element = () => {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
        <p onClick={() => { fetch('/test').then(data => console.log(data)).catch(e => console.error(e)) }}  >Login with Spotify</p>
      </header>
    </div>
  );

}

export default App;