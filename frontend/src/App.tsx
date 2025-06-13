import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CommunityPage from "./pages/CommunityPage";
import ArticlePage from "./pages/ArticlePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import ReportPage from "./pages/ReportPage";
import ReviewReportPage from "./pages/ReviewReportPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPassPage from "./pages/ResetPassPage";
import VerifyResetPassPage from "./pages/VerifyResetPassPage";
import ProfilePage from "./pages/ProfilePage";
import CoinsVerificationPage from "./pages/CoinsVerificationPage";
import CoinExchangePage from "./pages/CoinsExcangePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="komunitas" element={<CommunityPage />} />
          <Route path="lapor" element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          } />
          <Route path="artikel" element={<ArticlePage />} />
          <Route path="artikel/:id" element={<ArticleDetailPage />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
            } />
          <Route path="tukar-coin" element={
            <ProtectedRoute>
              <CoinExchangePage />
            </ProtectedRoute>
          } />

          <Route path="login" element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          } />
          <Route path="register" element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          } />
          <Route path="reset-password" element={
            <GuestRoute>
              <ResetPassPage />
            </GuestRoute>
          } />
          <Route path="verification/reset-password/:tokenReset" element={
            <GuestRoute>
              <VerifyResetPassPage />
            </GuestRoute>
          } />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path="laporan" element={<ReviewReportPage />} />
          <Route path="koin" element={<CoinsVerificationPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </Router>
  );
}
