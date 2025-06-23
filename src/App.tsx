import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CreateCourse from './pages/CreateCourse';
import Instances from './pages/Instances';
import CreateInstance from './pages/CreateInstance';
import InstanceDetail from './pages/InstanceDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/new" element={<CreateCourse />} />
          <Route path="/instances" element={<Instances />} />
          <Route path="/instances/new" element={<CreateInstance />} />
          <Route path="/instances/:year/:semester/:courseId" element={<InstanceDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;