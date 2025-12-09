import { useEffect, useRef, useState } from "react";

export default () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const exceptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutsite = (event: MouseEvent | TouchEvent) => {
      if (
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node) &&
        exceptionRef.current &&
        !exceptionRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsite);
    document.addEventListener("touchstart", handleClickOutsite);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsite);
      document.removeEventListener("touchstart", handleClickOutsite);
    };
  }, [isOpen]);

  return { ref, isOpen, setIsOpen, exceptionRef };
};
