"use client";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function Confetti({
  type = "fireworks",
}: {
  type: "fireworks" | "stars";
}) {
  if (type === "fireworks") {
    return (
      <Fireworks
        autorun={{ speed: 3, duration: 1000, delay: 500 }}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
    );
  }
}
