import { useEffect, useState } from "react";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const mouseMoveEvent = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });

    window.addEventListener("mousemove", mouseMoveEvent);

    return () => {
      window.removeEventListener("mousemove", mouseMoveEvent);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
