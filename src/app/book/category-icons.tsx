import {
  Wrench,
  Lightning,
  Hammer,
  Broom,
  WashingMachine,
  Plant,
  House,
  PaintRoller,
  Toolbox,
  Fan,
  Drop,
  ThermometerSimple,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export const ICON_OPTIONS: { key: string; label: string; icon: Icon }[] = [
  { key: "wrench", label: "Wrench", icon: Wrench },
  { key: "lightning", label: "Lightning", icon: Lightning },
  { key: "hammer", label: "Hammer", icon: Hammer },
  { key: "broom", label: "Broom", icon: Broom },
  { key: "washing-machine", label: "Washing machine", icon: WashingMachine },
  { key: "plant", label: "Plant", icon: Plant },
  { key: "house", label: "House", icon: House },
  { key: "paint-roller", label: "Paint roller", icon: PaintRoller },
  { key: "toolbox", label: "Toolbox", icon: Toolbox },
  { key: "fan", label: "Fan", icon: Fan },
  { key: "drop", label: "Drop", icon: Drop },
  { key: "thermometer", label: "Thermometer", icon: ThermometerSimple },
];

const ICON_MAP: Record<string, Icon> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.key, o.icon]),
);

export function getCategoryIcon(key: string): Icon {
  return ICON_MAP[key] ?? Wrench;
}
