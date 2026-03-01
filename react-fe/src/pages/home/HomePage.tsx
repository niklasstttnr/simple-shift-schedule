export function HomePage() {
  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8">
      <p className="text-muted-foreground">
        Shift planning and assignment for your team.
      </p>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">What is this?</h3>
        <p className="text-muted-foreground leading-relaxed">
          Shiftomatic helps you plan and assign shifts. You define roles, create
          shifts in a weekly planning view, then assign team members to those
          shifts. Use the sidebar to open <strong>Shifts → Planning</strong> to
          create and edit shifts, and <strong>Shifts → Assignments</strong> to
          assign people to shifts.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">Roles</h3>
        <p className="text-muted-foreground leading-relaxed">
          <strong>Roles</strong> are job types (e.g. Bartender, Host, Chef). You
          manage them under <strong>Roles</strong> in the menu. Each shift is
          tied to a role, so when you create a shift you choose which role it is
          for. Assignments then link a team member to a shift (and thus to that
          role for that time).
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">How shifts work</h3>
        <p className="text-muted-foreground leading-relaxed">
          <strong>Shifts</strong> are time slots with a date, start/end time,
          and a role. In <strong>Planning</strong> you create and edit shifts in
          a week view and can move between weeks. In{" "}
          <strong>Assignments</strong>
          you see the same week and assign users to each shift. Shifts are shown
          per day; you can create multiple shifts per day and assign different
          people to each.
        </p>
      </section>
    </div>
  );
}
