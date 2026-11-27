import type { ReactNode } from 'react';

export type ResortDetailsIconName =
  | 'gondola'
  | 'chairlift'
  | 'surface-lift'
  | 'snowpark'
  | 'freeride'
  | 'family'
  | 'parking'
  | 'airport'
  | 'elevation'
  | 'rental'
  | 'instructor'
  | 'rescue'
  | 'locker'
  | 'pass'
  | 'close'
  | 'arrow'
  | 'star';

const glyphs: Record<ResortDetailsIconName, ReactNode> = {
  rental: (
    <>
      <path d="m18.5 3.5 2 2a3 3 0 0 1 0 4.2L9.7 20.5a3 3 0 0 1-4.2 0l-2-2a3 3 0 0 1 0-4.2L14.3 3.5a3 3 0 0 1 4.2 0Z" />
      <path d="m8 13 3 3m2-8 3 3" />
    </>
  ),
  instructor: (
    <>
      <path d="m2 8 10-5 10 5-10 5zM6 10v6c4 3 8 3 12 0v-6m4-2v7" />
    </>
  ),
  rescue: (
    <>
      <rect
        x="3"
        y="7"
        width="18"
        height="14"
        rx="2"
      />
      <path d="M8 7V4h8v3m-4 4v6m-3-3h6" />
    </>
  ),
  locker: (
    <>
      <rect
        x="5"
        y="6"
        width="14"
        height="15"
        rx="2"
      />
      <path d="M9 6V3h6v3m-7 15v1m8-1v1" />
    </>
  ),
  pass: (
    <>
      <path d="M2 6h20v4a2 2 0 1 0 0 4v4H2v-4a2 2 0 1 0 0-4z" />
      <path d="M15 8v1m0 2v2m0 2v1" />
    </>
  ),
  gondola: (
    <>
      <path d="m2 5 20-3M12 3.5V8" />
      <rect
        height="13"
        rx="3"
        width="14"
        x="5"
        y="8"
      />
      <path d="M5 15h14M12 8v7M8 21v1m8-1v1" />
    </>
  ),
  chairlift: (
    <>
      <path d="m2 5 20-3M12 3.5v6l-3 3v5h10M7 21h14M17 17v4" />
      <circle
        cx="16"
        cy="10"
        r="1.5"
      />
      <path d="m15 13-1 3h4l2 3" />
    </>
  ),
  'surface-lift': <path d="m2 5 20-3M12 3.5V19m-6 0h12" />,
  snowpark: (
    <>
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
      <path d="m9 4 3 3 3-3m-6 16 3-3 3 3M4 10l4-1-1-4m10 14-1-4 4-1M7 19l1-4-4-1m16-4-4-1 1-4" />
    </>
  ),
  freeride: (
    <>
      <path d="m2 20 6-13 4 7 4-11 6 17M5.7 12h4.6m4-5 2 2 1.5-2" />
      <path d="M13 15c-4 1-5 3-1 4s3 2-1 3" />
    </>
  ),
  family: (
    <>
      <circle
        cx="12"
        cy="13"
        r="8"
      />
      <circle
        cx="9"
        cy="12"
        fill="currentColor"
        r="0.8"
        stroke="none"
      />
      <circle
        cx="15"
        cy="12"
        fill="currentColor"
        r="0.8"
        stroke="none"
      />
      <path d="M9 16a4 4 0 0 0 6 0M10 5a2.5 2.5 0 1 1 4-2m-4 2a2 2 0 0 0 3 1" />
    </>
  ),
  parking: <path d="m5 10 1.5-5h11l1.5 5M3 10h18v8H3zM5 18v2m14-2v2M3 13h3m12 0h3M6 10h12" />,
  airport: (
    <path
      d="M21.5 3c-.8-.8-2-.6-2.8.2l-4.5 4.5L4 5l-2 2 8.3 4.7-4.1 4.1-3.4-.5L1.5 17l4.1 1.9 1.9 4.1 1.7-1.3-.5-3.4 4.1-4.1 4.7 8.3 2-2-2.7-10.2 4.5-4.5c.8-.8 1-2 .2-2.8Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  elevation: <path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5" />,
  close: <path d="m4 4 16 16M4 20 20 4" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  star: (
    <path
      d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
};

export function ResortDetailsIcon({
  name,
  className,
}: Readonly<{
  name: ResortDetailsIconName;
  className?: string;
}>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="24"
    >
      {glyphs[name]}
    </svg>
  );
}
