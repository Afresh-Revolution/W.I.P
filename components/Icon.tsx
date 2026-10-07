import type { ReactNode, SVGProps } from "react";

const paths: Record<string, ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-4 2-7 6-7s6 3 6 7M16 5c3 .5 4 4 2 6M17 14c2 .7 3.5 2.5 4 5" />
    </>
  ),
  book: <path d="M4 5c4-2 7 0 8 2v13c-1-2-4-4-8-2V5ZM20 5c-4-2-7 0-8 2v13c1-2 4-4 8-2V5Z" />,
  shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-3Z" />,
  heart: <path d="M20 8c0 6-8 11-8 11S4 14 4 8c0-5 6-6 8-2 2-4 8-3 8 2Z" />,
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  quote: <path d="M5 17h5V8H4v5h3M14 17h5V8h-6v5h3" />,
  chevron: <path d="m8 10 4 4 4-4" />
};

export function Icon({ name, size = 20 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export function svgProps(size = 20): SVGProps<SVGSVGElement> {
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
}
