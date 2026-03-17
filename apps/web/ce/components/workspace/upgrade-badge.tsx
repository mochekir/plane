/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

type TUpgradeBadge = {
  className?: string;
  size?: "sm" | "md";
};

// No upgrade badge - all features unlocked
export function UpgradeBadge(props: TUpgradeBadge) {
  return null;
}
