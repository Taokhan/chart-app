import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/login";
import ChartPage from "./component/chart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
