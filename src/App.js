import './App.css';
import { Form } from './components/Form';
import { Table } from './components/Table';
import {Routes, Route} from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Form/>}/>
        <Route path='/userData' element={<Table/>}/>
      </Routes>
    </div>
  );
}

export default App;

