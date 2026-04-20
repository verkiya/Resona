/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  waveYOffset = 250,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveYOffset?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();

  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: CanvasRenderingContext2D | null,
    canvas: HTMLCanvasElement | null;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  let animationId: number;

  const drawWave = (n: number) => {
    if (!ctx) return;

    nt += getSpeed();

    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];

      for (x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + waveYOffset);
      }

      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = () => {
    if (!ctx) {
      animationId = requestAnimationFrame(render);
      return;
    }

    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity ?? 0.5;

    ctx.fillRect(0, 0, w, h);
    drawWave(5);

    animationId = requestAnimationFrame(render);
  };

  const init = () => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;

    ctx.filter = `blur(${blur}px)`;
    nt = 0;

    const handleResize = () => {
      if (!ctx) return;
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", handleResize);

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  const waveColors = colors ?? [
    "#fdba74", // soft orange
    "#fca5a5", // soft red
    "#f9a8d4", // soft pink
    "#d8b4fe", // soft purple
    "#fbcfe8", // pastel pink
  ];

  useEffect(() => {
    const cleanup = init();

    return () => {
      cancelAnimationFrame(animationId);
      cleanup && cleanup();
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome"),
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName,
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
