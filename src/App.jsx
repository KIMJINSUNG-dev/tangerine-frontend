import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DocumentListPage from "./pages/wiki/DocumentListPage";
import DocumentDetailPage from "./pages/wiki/DocumentDetailPage";
import DocumentCreatePage from "./pages/wiki/DocumentCreatePage";
import DocumentEditPage from "./pages/wiki/DocumentEditPage";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/wiki/type/:typeId" element={<DocumentListPage />}></Route>
        <Route path="/wiki/documents/new" element={<DocumentCreatePage />}></Route>
        <Route path="/wiki/documents/:id" element={<DocumentDetailPage />}></Route>
        <Route path="/wiki/documents/:id/edit" element={<DocumentEditPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;