export function LogoIcon({ className }: { className?: string }) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M2 2H8V8H2V2Z"
          className="fill-current"
        />
        <path
          d="M2 10H8V22H2V10Z"
          className="fill-current"
        />
        <path
          d="M10 10H14V14H10V10Z"
          className="fill-current"
        />
        <path
          d="M16 2H22V8H16V2Z"
          className="fill-current"
        />
        <path
          d="M16 10H22V22H16V10Z"
          className="fill-current"
        />
      </svg>
    );
  }
  