"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Jobs } from "./sections/Jobs";
import { Business } from "./sections/Business";
import type { ProviderProfileData, RealJob } from "./types";

type Tab = "jobs" | "business";

export function ProviderDashboard({
  profile,
  jobs: initialJobs,
}: {
  profile: ProviderProfileData;
  jobs: RealJob[];
}) {
  const [tab, setTab] = useState<Tab>("jobs");
  const [jobs, setJobs] = useState(initialJobs);

  function updateJobStatus(id: string, status: RealJob["status"]) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  }

  return (
    <div className="flex-1 flex flex-col">
      <nav className="sticky top-0 z-20 flex flex-wrap items-center gap-4 py-3 px-4 md:px-10 bg-bg/70 backdrop-blur-xl border-b border-divider">
        <span className="text-lg font-semibold mr-auto">Need-A Pro</span>
        <SegmentedControl<Tab>
          name="tab"
          value={tab}
          onChange={setTab}
          options={[
            { value: "jobs", label: "Jobs" },
            { value: "business", label: "My business" },
          ]}
        />
      </nav>
      <main className="flex-1 py-6 px-4 md:py-8 md:px-10 flex flex-col gap-6 max-w-[900px] mx-auto w-full">
        {tab === "jobs" && <Jobs jobs={jobs} onStatusChange={updateJobStatus} />}
        {tab === "business" && <Business profile={profile} />}
      </main>
    </div>
  );
}
