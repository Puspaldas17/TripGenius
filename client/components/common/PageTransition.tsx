import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("enter");

  useEffect(() => {
    if (location !== displayLocation) setTransitionStage("exit");
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === "exit") {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("enter");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  return (
    <div
      className={`transition-opacity duration-200 ${
        transitionStage === "enter" ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
