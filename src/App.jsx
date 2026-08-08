import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./Portfolio";

// Lazy-load admin so it doesn't bloat the public portfolio bundle
const AdminPage = lazy(() => import("./admin/AdminPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminPage />
          </Suspense>
        } />
        <Route path="*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminLoadingFallback() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#0a0a0a",
      color: "#888",
      fontFamily: "system-ui, sans-serif",
    }}>
      Loading...
    </div>
  );
}
