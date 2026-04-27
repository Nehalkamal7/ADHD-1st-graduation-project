import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import StudentInfo from './pages/StudentInfo';
import RecordingSample from './pages/RecordingSample';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-secondary-light/10 to-primary-light/10">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student-info" element={<StudentInfo />} />
            <Route path="/record-sample" element={<RecordingSample />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;