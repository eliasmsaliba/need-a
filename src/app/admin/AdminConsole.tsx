"use client";

import { Sidebar } from "./Sidebar";
import { NAV } from "./data";
import { useAdminConsole } from "./useAdminConsole";
import { Dashboard } from "./sections/Dashboard";
import { Dispatch } from "./sections/Dispatch";
import { Providers } from "./sections/Providers";
import { Customers } from "./sections/Customers";
import { Payments } from "./sections/Payments";
import { Categories } from "./sections/Categories";
import { Reviews } from "./sections/Reviews";
import type { AdminSubRole, RealBooking, RealCustomer, RealProvider } from "./types";

interface AdminConsoleProps {
  subRole: AdminSubRole;
  adminEmail: string;
  initialProviders: RealProvider[];
  initialCustomers: RealCustomer[];
  initialBookings: RealBooking[];
}

export function AdminConsole({
  subRole,
  adminEmail,
  initialProviders,
  initialCustomers,
  initialBookings,
}: AdminConsoleProps) {
  const flow = useAdminConsole(initialProviders, initialCustomers, initialBookings);
  const navItems = NAV.filter((n) => n.roles.includes(subRole));

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <Sidebar
        subRole={subRole}
        adminEmail={adminEmail}
        navItems={navItems}
        activeSection={flow.state.section}
        onSelect={flow.setSection}
      />
      <main className="flex-1 py-6 px-4 md:py-8 md:px-10 flex flex-col gap-6 max-w-[1200px] overflow-x-auto">
        {flow.state.section === "dashboard" && <Dashboard flow={flow} />}
        {flow.state.section === "dispatch" && <Dispatch flow={flow} />}
        {flow.state.section === "providers" && <Providers flow={flow} />}
        {flow.state.section === "customers" && <Customers flow={flow} />}
        {flow.state.section === "payments" && <Payments flow={flow} />}
        {flow.state.section === "categories" && <Categories flow={flow} />}
        {flow.state.section === "reviews" && <Reviews flow={flow} />}
      </main>
    </div>
  );
}
