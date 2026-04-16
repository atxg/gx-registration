"use client";

import { useCallback, useSyncExternalStore } from "react";
import ProtoController from "@/components/register/ProtoController";

/* ── Nav variants ── */
import NavV1Breadcrumb from "./NavV1Breadcrumb";
import NavV2FloatingPill from "./NavV2FloatingPill";
import NavV3Contextual from "./NavV3Contextual";
import NavV4MinimalProgress from "./NavV4MinimalProgress";
import NavV5SectionDots from "./NavV5SectionDots";
import NavV6BottomDock from "./NavV6BottomDock";

/* ── Sidebar variants ── */
import EventCard from "./EventCard";
import EventCardV2Luma from "./EventCardV2Luma";
import EventCardV3Flat from "./EventCardV3Flat";

/* ────────────────────────── Config ────────────────────────── */

const navVersions = [
  { id: "n1", label: "Breadcrumb", description: "Context-first hierarchy path. Familiar pattern, zero learning curve.", tag: "Context · Hierarchy" },
  { id: "n2", label: "Floating Pill", description: "Centered pill with anchor links to page sections. App-like feel.", tag: "Anchors · App-like" },
  { id: "n3", label: "Contextual Scroll", description: "Nav label morphs to show current section. Ultra-minimal with progress line.", tag: "Awareness · Minimal" },
  { id: "n4", label: "Minimal Progress", description: "Back button + fading title + full-width progress bar. Content breathes.", tag: "Clean · Progress" },
  { id: "n5", label: "Section Dots", description: "Carousel-inspired dot indicators. Active dot stretches. Hover reveals name.", tag: "Dots · Precise" },
  { id: "n6", label: "Bottom Dock", description: "macOS Dock at bottom with section icons. Touch-friendly.", tag: "Dock · Touch" },
];

const sidebarChoices = [
  { id: "s1", label: "Dark Minimal" },
  { id: "s2", label: "Luma Light" },
  { id: "s3", label: "Flat Editorial" },
];

const navMap: Record<string, React.FC> = {
  n1: NavV1Breadcrumb,
  n2: NavV2FloatingPill,
  n3: NavV3Contextual,
  n4: NavV4MinimalProgress,
  n5: NavV5SectionDots,
  n6: NavV6BottomDock,
};

const sidebarMap: Record<string, React.FC> = {
  s1: EventCard,
  s2: EventCardV2Luma,
  s3: EventCardV3Flat,
};

/* ───────────────── Shared store (module-level) ───────────────── */

type State = { nav: string; sidebar: string };
type Listener = () => void;

let state: State = { nav: "n1", sidebar: "s1" };
const listeners = new Set<Listener>();

function getSnapshot() {
  return state;
}

function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit() {
  listeners.forEach((fn) => fn());
}

function setNav(id: string) {
  state = { ...state, nav: id };
  emit();
}

function setSidebar(id: string) {
  state = { ...state, sidebar: id };
  emit();
}

/* ─────────────────── Hook ─────────────────── */

function usePageState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ─────────────────── Slot components ─────────────────── */

export function NavSlot() {
  const { nav } = usePageState();
  const Nav = navMap[nav] || NavV1Breadcrumb;
  return <Nav />;
}

export function SidebarSlot() {
  const { sidebar } = usePageState();
  const Sidebar = sidebarMap[sidebar] || EventCard;
  return <Sidebar />;
}

/* ─────────────── Proto controller (renders once) ─────────────── */

export default function PageController() {
  const { nav, sidebar } = usePageState();

  const onNavChange = useCallback((id: string) => setNav(id), []);
  const onSidebarChange = useCallback((id: string) => setSidebar(id), []);

  return (
    <ProtoController
      versions={navVersions}
      activeVersion={nav}
      onVersionChange={onNavChange}
      options={[
        {
          id: "sidebar",
          label: "Sidebar Style",
          choices: sidebarChoices,
          activeId: sidebar,
          onChange: onSidebarChange,
        },
      ]}
    />
  );
}
