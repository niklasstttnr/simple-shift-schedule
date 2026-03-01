import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { UsersPage } from "@/pages/users/UsersPage";
import { RolesPage } from "@/pages/roles/RolesPage";
import { ShiftsPage } from "@/pages/shifts/ShiftsPage";
import { PlanningPage } from "@/pages/shifts/planning/PlanningPage";

function Home() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <h2 className="text-2xl font-semibold text-foreground">Welcome</h2>
      <p className="text-muted-foreground">
        React 19 + Vite + Tailwind + shadcn/ui + Apollo Client. Use the menu
        to navigate; collapse the sidebar on desktop with the rail.
      </p>
      <Button>Get started</Button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/shifts" element={<ShiftsPage />} />
          <Route path="/shifts/planning" element={<PlanningPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
