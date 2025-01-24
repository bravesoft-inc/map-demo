import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapApp from './components/MapApp';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapApp />} />
      </Routes>
    </Router>
  );
};

export default App;