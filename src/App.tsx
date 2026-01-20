import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/login";
import ChartPage from "./component/chart";

function App() {
  return (
    <BrowserRouter basename="/chart-app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
