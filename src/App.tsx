import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-svh bg-background font-sans text-foreground">
      <main className="container mx-auto flex min-h-svh flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-3xl font-bold text-foreground">Shift Schedule</h1>
        <p className="text-muted-foreground">
          React 19 + Vite + Tailwind + shadcn/ui + Apollo Client
        </p>
        <Button>Get started</Button>
      </main>
    </div>
  );
}

export default App;
