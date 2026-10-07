import type { PublicContent } from "./site-types";

export const originalCopy = {
  announcement: "WIPI now has representation across all 17 LGAs of Plateau State.",
  reachTitle: "17 LGAs. One Movement.",
  reachPageTitle: "WIPI Across All 17 LGAs",
  aboutToday:
    "On 15 January 2026, the initiative expanded across Plateau State. Today, WIPI reports representation in all 17 LGAs and a growing community of more than 20,000 women.",
  heroReach: "17 LGAs • 20,000+ Women",
  journeyLgas: "Representation across 17 LGAs.",
  journeyMembers: "20,000+ reported members."
};

export function liveCopy(content: PublicContent) {
  const count = content.lgas.length;
  const members = content.reportedMembers.toLocaleString("en-NG");
  return {
    announcement:
      content.text.announcement === originalCopy.announcement
        ? `WIPI now has representation across all ${count} LGAs of Plateau State.`
        : content.text.announcement,
    reachTitle: content.text.reachTitle === originalCopy.reachTitle ? `${count} LGAs. One Movement.` : content.text.reachTitle,
    reachPageTitle: content.text.reachPageTitle === originalCopy.reachPageTitle ? `WIPI Across All ${count} LGAs` : content.text.reachPageTitle,
    aboutToday:
      content.text.aboutToday === originalCopy.aboutToday
        ? `On 15 January 2026, the initiative expanded across Plateau State. Today, WIPI reports representation in all ${count} LGAs and a growing community of more than ${members} women.`
        : content.text.aboutToday,
    heroLabel: (label: string) => (label === originalCopy.heroReach ? `${count} LGAs • ${members}+ Women` : label),
    journeyLgas: `Representation across ${count} LGAs.`,
    journeyMembers: `${members}+ reported members.`
  };
}
