"use client";

import { useEffect, useRef } from "react";
import type { DrawElement } from "@/types";

function drawElement(ctx: CanvasRenderingContext2D, el: DrawElement, w: number, h: number) {
  ctx.strokeStyle = el.color;
  ctx.lineWidth = el.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (el.kind === "stroke") {
    if (el.points.length < 2) {
      // A single dot — render as a filled circle so a tap still leaves a mark.
      const p = el.points[0];
      if (!p) return;
      ctx.beginPath();
      ctx.fillStyle = el.color;
      ctx.arc((p.x / 100) * w, (p.y / 100) * h, el.width / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.beginPath();
    const first = el.points[0]!;
    ctx.moveTo((first.x / 100) * w, (first.y / 100) * h);
    for (const p of el.points.slice(1)) {
      ctx.lineTo((p.x / 100) * w, (p.y / 100) * h);
    }
    ctx.stroke();
  } else {
    const x1 = (el.start.x / 100) * w;
    const y1 = (el.start.y / 100) * h;
    const x2 = (el.end.x / 100) * w;
    const y2 = (el.end.y / 100) * h;
    ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
  }
}

/**
 * A resolution-independent HTML canvas layer. Elements store points as 0-100
 * percentages, not pixels, so the drawing stays correct across resizes,
 * zoom, and different screen sizes without any coordinate translation at
 * the call site — the same contract the sticky notes already use.
 */
export function DrawingCanvas({
  elements,
  liveElement,
}: {
  elements: DrawElement[];
  liveElement: DrawElement | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const render = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const el of elements) drawElement(ctx, el, rect.width, rect.height);
      if (liveElement) drawElement(ctx, liveElement, rect.width, rect.height);
    };

    render();

    const observer = new ResizeObserver(render);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [elements, liveElement]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
