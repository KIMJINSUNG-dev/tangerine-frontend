import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DocumentListPage from "./pages/wiki/DocumentListPage";
import DocumentDetailPage from "./pages/wiki/DocumentDetailPage";
import DocumentCreatePage from "./pages/wiki/DocumentCreatePage";
import DocumentEditPage from "./pages/wiki/DocumentEditPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PostListPage from "./components/board/PostListPage";
import PostDetailPage from "./components/board/PostDetailPage";
import PostCreatePage from "./components/board/PostCreatePage";
import PostEditPage from "./components/board/PostEditPage";

function App() {

  return (
    
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/wiki/type/:typeId" element={<DocumentListPage />} />
          <Route path="/wiki/documents/new" element={
            <ProtectedRoute>
              <DocumentCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/wiki/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/wiki/documents/:id/edit" element={
            <ProtectedRoute>
              <DocumentEditPage />
            </ProtectedRoute>
          } />
          <Route path="/board/:boardType" element={<PostListPage />} />
          <Route path="/board/posts/new" element={
            <ProtectedRoute><PostCreatePage /></ProtectedRoute>
          } />
          <Route path="/board/posts/:id" element={<PostDetailPage />} />
          <Route path="/board/posts/:id/edit" element={
            <ProtectedRoute><PostEditPage /></ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;