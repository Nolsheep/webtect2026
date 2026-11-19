import { Route, Routes } from 'react-router-dom';
import Starfield from './components/Starfield.jsx';
import Navbar from './components/Navbar.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Chat from './pages/Chat.jsx';
import Member from './pages/Member.jsx';

export default function App() {
  return (
    <>
      <Starfield />
      <Navbar />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/member/:slug" element={<Member />} />
        <Route path="*" element={<Portfolio />} />
      </Routes>
    </>
  );
}
