"use client";
import { useState } from "react";
import { mockResources, getDashboardSummary } from "@/lib/mock-data";
import { AzureResource } from "@/lib/types";
import { SummaryCards } from "@/components/SummaryCards";
import { ResourceTable } from "@/components/ResourceTable";
import { ResourceDetail } from "@/components/ResourceDetail";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { PageHeader } from "@/components/PageHeader";

export default function Home() {
  const [selected, setSelected] = useState<AzureResource | null>(null);
  const summary = getDashboardSummary();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 px-8 py-6 w-full">
          <PageHeader />
          <SummaryCards summary={summary} />

          <div className={`grid gap-4 mt-6 transition-all duration-200 ${
            selected ? "grid-cols-1 xl:grid-cols-[1fr_400px]" : "grid-cols-1"
          }`}>
            <ResourceTable resources={mockResources} onSelect={setSelected} selectedId={selected?.id} />
            {selected && <ResourceDetail resource={selected} onClose={() => setSelected(null)} />}
          </div>
        </main>
      </div>
    </div>
  );
}
