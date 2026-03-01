import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/home/HomePage";
import { UsersPage } from "@/pages/users/UsersPage";
import { RolesPage } from "@/pages/roles/RolesPage";
import { ShiftsPage } from "@/pages/shifts/ShiftsPage";
import { PlanningPage } from "@/pages/shifts/planning/PlanningPage";
import { AssignmentsPage } from "@/pages/shifts/assignments/AssignmentsPage";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/shifts" element={<ShiftsPage />} />
          <Route path="/shifts/planning" element={<PlanningPage />} />
          <Route path="/shifts/assignments" element={<AssignmentsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
