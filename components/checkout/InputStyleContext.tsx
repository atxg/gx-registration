"use client";

import { createContext, useContext } from "react";

/**
 * Input visual style — controls how MaterialInput / MaterialTextarea render.
 */
export type InputStyle = "filled" | "filled-tonal" | "outlined" | "rounded" | "underline";

const InputStyleContext = createContext<InputStyle>("filled");
export const InputStyleProvider = InputStyleContext.Provider;
export function useInputStyle(): InputStyle {
  return useContext(InputStyleContext);
}

/** Fill opacity — only applies to "filled" and "filled-tonal" variants */
const FillOpacityContext = createContext<number>(1);
export const FillOpacityProvider = FillOpacityContext.Provider;
export function useFillOpacity(): number {
  return useContext(FillOpacityContext);
}

/**
 * Accent color — drives the blue across the entire checkout flow.
 * Provides both hex (for solid usage) and rgb string (for rgba() construction).
 */
export interface AccentColor {
  hex: string;
  rgb: string; // e.g. "91,158,255" for use in rgba(${rgb}, alpha)
}

export const ACCENT_PRESETS: Record<string, AccentColor> = {
  proposed:  { hex: "#5b9eff", rgb: "91,158,255" },
  white:     { hex: "#ffffff", rgb: "255,255,255" },
  brand:     { hex: "#0064ff", rgb: "0,100,255" },
  current:   { hex: "#408cff", rgb: "64,140,255" },
};

const AccentColorContext = createContext<AccentColor>(ACCENT_PRESETS.current);
export const AccentColorProvider = AccentColorContext.Provider;
export function useAccentColor(): AccentColor {
  return useContext(AccentColorContext);
}

/** Outlined label Y offset — controls the vertical position of the floated label in outlined mode */
const OutlinedLabelYContext = createContext<number>(-11);
export const OutlinedLabelYProvider = OutlinedLabelYContext.Provider;
export function useOutlinedLabelY(): number {
  return useContext(OutlinedLabelYContext);
}
