/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { CalendarCheck } from "lucide-react";
// plane imports
import { useTranslation } from "@plane/i18n";
import type { ICycle } from "@plane/types";
import { ContentWrapper, Loader } from "@plane/ui";
import { renderFormattedDate } from "@plane/utils";
// hooks
import { useCycle } from "@/hooks/store/use-cycle";
import { useProject } from "@/hooks/store/use-project";

export const WorkspaceActiveCyclesRoot = observer(function WorkspaceActiveCyclesRoot() {
  const { workspaceSlug } = useParams();
  const { t } = useTranslation();
  const { fetchWorkspaceCycles, cycleMap } = useCycle();
  const { getProjectById } = useProject();

  useEffect(() => {
    if (workspaceSlug) {
      fetchWorkspaceCycles(workspaceSlug.toString());
    }
  }, [workspaceSlug, fetchWorkspaceCycles]);

  // Filter for active/current cycles
  const allCycles = Object.values(cycleMap) as ICycle[];
  const activeCycles = allCycles.filter((cycle) => {
    if (!cycle.start_date || !cycle.end_date) return false;
    const now = new Date();
    const start = new Date(cycle.start_date);
    const end = new Date(cycle.end_date);
    return start <= now && end >= now;
  });

  if (!allCycles.length) {
    return (
      <ContentWrapper>
        <Loader className="space-y-4">
          <Loader.Item height="40px" />
          <Loader.Item height="40px" />
          <Loader.Item height="40px" />
        </Loader>
      </ContentWrapper>
    );
  }

  if (activeCycles.length === 0) {
    return (
      <ContentWrapper className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <CalendarCheck className="h-12 w-12 text-tertiary" />
          <h3 className="text-lg font-semibold">{t("no_active_cycles") || "No active cycles"}</h3>
          <p className="text-sm text-tertiary">
            {t("no_active_cycles_description") || "There are no cycles currently running across your projects."}
          </p>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper className="gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {activeCycles.map((cycle) => {
          const project = cycle.project_id ? getProjectById(cycle.project_id) : null;
          return (
            <div
              key={cycle.id}
              className="flex flex-col gap-3 rounded-lg border border-subtle bg-layer-1 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-accent-primary" />
                  <h3 className="text-base font-semibold truncate">{cycle.name}</h3>
                </div>
                {project && (
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-secondary">
                    {project.name}
                  </span>
                )}
              </div>
              {cycle.description && (
                <p className="text-sm text-tertiary line-clamp-2">{cycle.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-secondary">
                {cycle.start_date && (
                  <span>{renderFormattedDate(cycle.start_date)}</span>
                )}
                {cycle.start_date && cycle.end_date && <span>→</span>}
                {cycle.end_date && (
                  <span>{renderFormattedDate(cycle.end_date)}</span>
                )}
              </div>
              {typeof cycle.total_issues === "number" && (
                <div className="flex items-center gap-3 text-xs text-tertiary">
                  <span>{cycle.total_issues} work items</span>
                  {typeof cycle.completed_issues === "number" && (
                    <span>• {cycle.completed_issues} completed</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ContentWrapper>
  );
});
