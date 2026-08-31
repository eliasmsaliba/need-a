import {
  Wrench,
  Lightning,
  Hammer,
  Broom,
  WashingMachine,
  Plant,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { CategoryId } from "./types";

export const CATEGORY_ICONS: Record<CategoryId, Icon> = {
  plumbing: Wrench,
  electrical: Lightning,
  handyman: Hammer,
  cleaning: Broom,
  appliance: WashingMachine,
  gardening: Plant,
};
