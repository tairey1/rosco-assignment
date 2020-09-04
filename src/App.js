import React from 'react';
import datapage from './datapage.png';
import './App.css';
import Table from './table/Table';

function App() {
  return (
    <div className="App">
      <img src={datapage} className='header' alt='data page'/>
      <div className='table'>
        <Table/>
      </div>
      <div className='legend'>
        <div className='danger block'></div>
        <div className='description'> : Group contains unit with usage over the limit {'(100 MB)'}</div>
        <br/>
        <div className='warning block'></div>
        <div className='description'> : Group contains unit with usage approaching the limit {'(>90 MB)'}</div>
      </div>
    </div>
  );
}

export default App;
