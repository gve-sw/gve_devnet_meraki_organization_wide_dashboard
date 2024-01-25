import './App.css';
import Layout from './layout/layout';
import { HashRouter, Route, Routes } from 'react-router-dom'; // Import HashRouter
import HomePage from './components/body/pages/home/home'; // Adjust the path as necessary
import AppPage from './components/body/pages/app/app'; // Adjust the path as necessary

function App() {
  return (
    <HashRouter> {/* Use HashRouter instead of Router */}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
