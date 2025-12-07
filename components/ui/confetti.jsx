"use client";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
export default function Confetti({ type = "fireworks", colors, }) {
    const defaultColors = ["#10B981", "#22C55E", "#34D399"];
    if (type === "fireworks") {
        return (<Fireworks autorun={{ speed: 3, duration: 1000, delay: 500 }} globalOptions={{
                resize: true,
                useWorker: true,
            }} decorateOptions={(options) => ({
                ...options,
                colors: colors || defaultColors,
            })} style={{
                position: "fixed",
                pointerEvents: "none",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
            }}/>);
    }
}
