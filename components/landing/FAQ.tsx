"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Do you guarantee we'll be mentioned by AI?",
    a: "No. We don't do black-box promises. We give transparent visibility measurement and action plans to improve your odds.",
  },
  {
    q: "Is this replacing SEO?",
    a: "No. It extends SEO into AI-answer discovery behavior.",
  },
  {
    q: "How is this different from basic rank tracking?",
    a: "Rank trackers show SERP positions. We track AI mentions, citation patterns, competitor deltas, and prompt-level movement.",
  },
  {
    q: "Can this show business impact?",
    a: "Yes, by pairing visibility trends with traffic/conversion movement over time.",
  },
  {
    q: "Is this only for SEO teams?",
    a: "No. AIknowsMe is built for any professional whose reputation matters in AI answers — lawyers, doctors, financial advisors, founders, coaches, and personal brand builders. You don't need an SEO background to use it.",
  },
  {
    q: "Can this help if my website isn't #1 on Google?",
    a: "Yes. AI citation visibility is separate from Google rankings. AIknowsMe focuses on how AI models cite and represent your authority — not just your SERP position. Many professionals rank poorly on Google but can still be cited frequently by AI assistants when their authority signals are structured correctly.",
  },
  {
    q: "Do you work with regulated industries like legal, medical, or finance?",
    a: "Yes. We work with professionals in regulated industries. We focus on visibility measurement and authority structuring — not on making claims about outcomes. All recommendations follow non-claim principles appropriate for YMYL fields, and you retain full control over your public messaging.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border-b border-border/50">
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-5 text-left text-[15px] font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              {item.q}
              <span
                className={`text-xl text-muted-foreground transition-transform duration-200 ml-4 shrink-0 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isOpen ? "max-h-60" : "max-h-0"
              }`}
            >
              <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
