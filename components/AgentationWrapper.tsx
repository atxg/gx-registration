"use client";

import { Agentation } from "agentation";

/* Demo annotations point at key sections of the event page so the toolbar
   auto-expands and shows how agentation works on first load. */
const demoAnnotations = [
  {
    selector: "h1",
    comment: "Event title — consider adding a tagline or date sub-heading for faster scanning.",
  },
  {
    selector: "[data-section='register']",
    comment: "Register CTA — the price label and button could be more prominent on mobile.",
  },
  {
    selector: "[data-section='about']",
    comment: "About section — long text could benefit from collapsible paragraphs.",
  },
];

export default function AgentationWrapper() {
  return (
    <Agentation
      enableDemoMode
      demoAnnotations={demoAnnotations}
      demoDelay={800}
    />
  );
}
