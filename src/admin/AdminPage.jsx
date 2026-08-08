import AdminGate from "./AdminGate";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboard />
    </AdminGate>
  );
}
