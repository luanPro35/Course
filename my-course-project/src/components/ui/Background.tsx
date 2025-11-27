"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

const CourseThreadBackground: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const globeAnimationRef = useRef<number | null>(null);

  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
    "#ec4899",
    "#06b6d4",
  ];

  
  useEffect(() => {
    const canvas = globeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = 500;
      canvas.height = 500;
    };

    let rotation = 0;
    const radius = 200;
    const centerX = 250;
    const centerY = 250;

    const drawGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 20,
        centerX,
        centerY,
        radius + 40
      );
      outerGlow.addColorStop(0, "rgba(139, 92, 246, 0.15)");
      outerGlow.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 40, 0, Math.PI * 2);
      ctx.fill();

      
      const gradient = ctx.createRadialGradient(
        centerX - 60,
        centerY - 60,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.4)");
      gradient.addColorStop(1, "rgba(236, 72, 153, 0.3)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      
      ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
      ctx.lineWidth = 1.5;
      for (let i = -2; i <= 2; i++) {
        const y = centerY + (i * radius) / 3;
        const width = Math.sqrt(
          radius * radius - ((i * radius) / 3) * ((i * radius) / 3)
        );

        ctx.beginPath();
        ctx.ellipse(centerX, y, width, width * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + rotation;
        const x = Math.cos(angle);
        const z = Math.sin(angle);

        if (z > -0.3) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + z * 0.4})`;
          ctx.ellipse(
            centerX,
            centerY,
            radius * Math.abs(x) * 0.3,
            radius,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }

      
      const points = 30;
      for (let i = 0; i < points; i++) {
        const theta = (i / points) * Math.PI * 2 + rotation;
        const phi = Math.acos(2 * (i / points) - 1);

        const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
        const y = centerY + radius * Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);

        if (z > 0) {
          const size = 2 + z * 3;
          const opacity = 0.4 + z * 0.5;

          const pointGradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            size * 2
          );
          pointGradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
          pointGradient.addColorStop(1, `rgba(139, 92, 246, 0)`);

          ctx.fillStyle = pointGradient;
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(236, 72, 153, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rotation += 0.005;
      globeAnimationRef.current = requestAnimationFrame(drawGlobe);
    };

    resize();
    drawGlobe();

    return () => {
      if (globeAnimationRef.current) {
        cancelAnimationFrame(globeAnimationRef.current);
      }
    };
  }, []);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodesRef.current = [];
      const nodeCount = Math.floor((canvas.width * canvas.height) / 20000);

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: colors[i % colors.length],
        });
      }
    };

    const drawNode = (node: Node) => {
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        20
      );
      gradient.addColorStop(0, node.color + "40");
      gradient.addColorStop(1, node.color + "00");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      distance: number,
      maxDistance: number
    ) => {
      const opacity = (1 - distance / maxDistance) * 0.3;
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
      gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const maxDistance = 200;

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < 150) {
          node.x -= dx * 0.01;
          node.y -= dy * 0.01;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            drawLine(
              node.x,
              node.y,
              nodes[j].x,
              nodes[j].y,
              distance,
              maxDistance
            );
          }
        }

        drawNode(node);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-900">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute top-1/2 right-12 md:right-32 -translate-y-1/2 opacity-50">
        <canvas
          ref={globeCanvasRef}
          className="w-80 h-80 md:w-[500px] md:h-[500px]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CourseThreadBackground;
