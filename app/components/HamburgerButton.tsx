import type { Dispatch, SetStateAction } from "react";

export default function HamburgerButton({
  isOpen,
  setIsOpen,
  hamburgerRef,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  hamburgerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      className="hover:cursor-pointer md:hidden"
      onClick={(event) => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
      ref={hamburgerRef}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isOpen ? (
          <path d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}
