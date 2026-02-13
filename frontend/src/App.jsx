import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import PostgresCluster from './pages/PostgresCluster';
import MysqlCluster from './pages/MysqlCluster';
import AdminControls from './pages/AdminControls';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="postgres" element={<PostgresCluster />} />
          <Route path="mysql" element={<MysqlCluster />} />
          <Route path="admin" element={<AdminControls />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
