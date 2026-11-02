const paths = {
  conversations: <><path d="M5 6.5h14v9H9l-4 3v-12Z" /><path d="M9 10h6M9 13h4" /></>,
  teams: <><path d="M16 18v-1.5A3.5 3.5 0 0 0 12.5 13h-5A3.5 3.5 0 0 0 4 16.5V18" /><circle cx="10" cy="7.5" r="3" /><path d="M16 10.5a2.5 2.5 0 0 1 4 2v1" /></>,
  tasks: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="m8.5 9 1.5 1.5L13 7.5M8.5 15h7" /></>,
  sparkles: <><path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2L12 3Z" /><path d="m18.5 13 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" /></>,
  logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" /></>,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  send: <><path d="m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z" /><path d="m10.3 13.7 4.2-4.2" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  retry: <><path d="M20 6v5h-5" /><path d="M18.3 16a8 8 0 1 1 .7-8l1 3" /></>,
  panel: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  users: <><circle cx="9" cy="9" r="3" /><circle cx="17" cy="8" r="2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15 13.5a4.5 4.5 0 0 1 5.5 4.4" /></>,
  clipboard: <><path d="M9 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H15" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></>,
  decision: <><path d="M12 3a7 7 0 0 0-4 12.7V19h8v-3.3A7 7 0 0 0 12 3Z" /><path d="M9 22h6M9 15h6" /></>,
  summary: <><path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  check: <path d="m5 12 4 4L19 6" />,
};

function Icon({ name, size = 20, className = '' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size}
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      {paths[name]}
    </svg>
  );
}

export function BrandMark({ size = 38 }) {
  return (
    <span className="brand-mark" style={{ '--brand-size': `${size}px` }} aria-hidden="true">
      <span /><span /><span />
    </span>
  );
}

export default Icon;
