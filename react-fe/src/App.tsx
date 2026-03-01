import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <AppLayout>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <h2 className="text-2xl font-semibold text-foreground">Welcome</h2>
        <p className="text-muted-foreground">
          React 19 + Vite + Tailwind + shadcn/ui + Apollo Client. Use the menu
          to navigate; collapse the sidebar on desktop with the rail.
        </p>
        <Button>Get started</Button>
      </div>
    </AppLayout>
  );
}

export default App;
