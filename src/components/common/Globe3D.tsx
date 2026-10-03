import React, { useRef, useEffect, useState } from 'react';
import { Zap, RotateCw } from 'lucide-react';
import earthMapTexture from '../../assets/earth_map.jpg';

interface TradeNode {
  name: string;
  country: string;
  lat: number;
  lng: number;
  product: string;
  cnCode: string;
  emissions: number; // tCO2e/t
  color: string;
}

const TRADE_NODES: TradeNode[] = [
  { name: 'Jindal Steel Mill', country: 'India', lat: 21.8, lng: 84.0, product: 'Hot-Rolled Steel Coils', cnCode: '7208 39 00', emissions: 1.90, color: '#34d399' },
  { name: 'Eregli Iron Works', country: 'Turkey', lat: 41.2, lng: 31.4, product: 'Alloy Steel Billets', cnCode: '7224 90 00', emissions: 2.15, color: '#38bdf8' },
  { name: 'Baosteel Plant 3', country: 'China', lat: 31.2, lng: 121.5, product: 'Cold Finished Bars', cnCode: '7215 50 00', emissions: 2.45, color: '#f59e0b' },
  { name: 'Gerdau Acominas', country: 'Brazil', lat: -20.5, lng: -43.8, product: 'Raw Pig Iron', cnCode: '7201 10 00', emissions: 1.65, color: '#a78bfa' },
  { name: 'EU Customs Hub (Rotterdam)', country: 'Netherlands', lat: 51.9, lng: 4.5, product: 'EU Import Destination', cnCode: 'CBAM-ENTRY', emissions: 0.0, color: '#ffffff' },
];

export const Globe3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0.0 });
  const autoRotateRef = useRef(true);
  const selectedNodeRef = useRef<TradeNode>(TRADE_NODES[0]);
  const earthImgRef = useRef<HTMLImageElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<TradeNode>(TRADE_NODES[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Preload realistic equirectangular Earth map
  useEffect(() => {
    const img = new Image();
    img.src = earthMapTexture;
    img.onload = () => {
      earthImgRef.current = img;
    };
  }, []);

  // Sync state to refs for 60fps canvas loop
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  // Drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setAutoRotate(false);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = (e.clientX - lastMouseRef.current.x) * 0.007;
    const deltaY = (e.clientY - lastMouseRef.current.y) * 0.007;

    rotationRef.current = {
      x: Math.max(-1.2, Math.min(1.2, rotationRef.current.x + deltaY)),
      y: rotationRef.current.y + deltaX,
    };
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    let animId: number;
    let particleOffset = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Smooth continuous auto rotation
      if (autoRotateRef.current) {
        rotationRef.current.y += 0.0035;
      }

      particleOffset = (particleOffset + 0.012) % 1;
      const currentRot = rotationRef.current;

      // 1. Atmosphere Radial Outer Glow
      const atmosphereGlow = ctx.createRadialGradient(
        centerX, 
        centerY, 
        radius * 0.95, 
        centerX, 
        centerY, 
        radius * 1.35
      );
      atmosphereGlow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      atmosphereGlow.addColorStop(0.3, 'rgba(14, 165, 233, 0.22)');
      atmosphereGlow.addColorStop(0.7, 'rgba(2, 132, 199, 0.08)');
      atmosphereGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Realistic Rotating Earth Surface Inside 3D Sphere Mask
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      if (earthImgRef.current && earthImgRef.current.complete) {
        const earthImg = earthImgRef.current;
        const imgWidth = radius * 4.2;
        const imgHeight = radius * 2.1;
        
        // Continuous horizontal rotation mapping
        const normRotation = ((currentRot.y / (Math.PI * 2)) % 1 + 1) % 1;
        const panX = -normRotation * imgWidth;
        const panY = -radius * 1.05 + currentRot.x * 25; // pitch tilt

        ctx.save();
        ctx.translate(centerX, centerY);

        // Draw multiple seamless tiles of world map to rotate endlessly
        ctx.drawImage(earthImg, panX - imgWidth, panY, imgWidth, imgHeight);
        ctx.drawImage(earthImg, panX, panY, imgWidth, imgHeight);
        ctx.drawImage(earthImg, panX + imgWidth, panY, imgWidth, imgHeight);
        ctx.drawImage(earthImg, panX + imgWidth * 2, panY, imgWidth, imgHeight);
        ctx.restore();

        // 3D Spherical Curvature & Lighting Gradient
        const lightGrad = ctx.createRadialGradient(
          centerX - radius * 0.35,
          centerY - radius * 0.35,
          radius * 0.15,
          centerX + radius * 0.2,
          centerY + radius * 0.2,
          radius * 1.08
        );
        lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)'); // solar highlight
        lightGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0)');
        lightGrad.addColorStop(0.75, 'rgba(2, 6, 23, 0.45)');
        lightGrad.addColorStop(1, 'rgba(2, 6, 23, 0.9)'); // night terminator shadow

        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric Blue Limb Gradient
        const innerAtmosphere = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.82,
          centerX,
          centerY,
          radius
        );
        innerAtmosphere.addColorStop(0, 'rgba(56, 189, 248, 0)');
        innerAtmosphere.addColorStop(0.8, 'rgba(56, 189, 248, 0.25)');
        innerAtmosphere.addColorStop(1, 'rgba(56, 189, 248, 0.65)');
        ctx.fillStyle = innerAtmosphere;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const fallbackGrad = ctx.createRadialGradient(
          centerX - radius * 0.35,
          centerY - radius * 0.35,
          radius * 0.1,
          centerX,
          centerY,
          radius
        );
        fallbackGrad.addColorStop(0, '#0284c7');
        fallbackGrad.addColorStop(0.5, '#0369a1');
        fallbackGrad.addColorStop(1, '#020617');
        ctx.fillStyle = fallbackGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Outer Glowing Limb Border
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. 3D Coordinate Projection Helper (Synchronized with Earth surface)
      const project = (latDeg: number, lngDeg: number) => {
        const phi = (90 - latDeg) * (Math.PI / 180);
        const theta = (lngDeg + 180) * (Math.PI / 180) + currentRot.y;

        const px = Math.sin(phi) * Math.cos(theta);
        const py = Math.cos(phi);
        const pz = Math.sin(phi) * Math.sin(theta);

        const rotX = currentRot.x;
        const x2 = px;
        const y2 = py * Math.cos(rotX) - pz * Math.sin(rotX);
        const z2 = py * Math.sin(rotX) + pz * Math.cos(rotX);

        return {
          x: centerX + x2 * radius,
          y: centerY - y2 * radius,
          visible: z2 > -0.15,
          depth: z2,
        };
      };

      // 4. Draw 3D Carbon Arc Trajectories (Origin to EU Rotterdam)
      const euPt = project(51.9, 4.5);

      TRADE_NODES.slice(0, 4).forEach((supplier) => {
        const supPt = project(supplier.lat, supplier.lng);

        if (supPt.visible || euPt.visible) {
          const midX = (supPt.x + euPt.x) / 2;
          const midY = Math.min(supPt.y, euPt.y) - radius * 0.28;

          ctx.beginPath();
          ctx.strokeStyle = `${supplier.color}55`;
          ctx.lineWidth = 1.4;
          ctx.setLineDash([4, 4]);
          ctx.moveTo(supPt.x, supPt.y);
          ctx.quadraticCurveTo(midX, midY, euPt.x, euPt.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Animated moving particle
          const t = (particleOffset + supplier.emissions * 0.2) % 1;
          const px = (1 - t) * (1 - t) * supPt.x + 2 * (1 - t) * t * midX + t * t * euPt.x;
          const py = (1 - t) * (1 - t) * supPt.y + 2 * (1 - t) * t * midY + t * t * euPt.y;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = supplier.color;
          ctx.shadowColor = supplier.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 5. Draw Interactive Trading Nodes & Pulsing Badges
      TRADE_NODES.forEach((node) => {
        const pt = project(node.lat, node.lng);
        if (pt.visible) {
          const isSelected = selectedNodeRef.current.name === node.name;
          const nodeRadius = isSelected ? 7 : 5;

          // Outer pulse ring
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, nodeRadius * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `${node.color}60`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Node center dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Country Label
          if (isSelected || pt.depth > 0.35) {
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillStyle = '#030712';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 4;
            ctx.fillText(`${node.country}`, pt.x + 9, pt.y - 3);
            ctx.fillStyle = isSelected ? '#38bdf8' : '#ffffff';
            ctx.fillText(`${node.country}`, pt.x + 8, pt.y - 4);
            ctx.shadowBlur = 0;
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 p-6">
      {/* 3D WebGL / Canvas Viewport */}
      <div 
        className="relative w-full md:w-1/2 h-[340px] md:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="w-full h-full max-w-[420px] max-h-[420px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
        />

        {/* Floating 3D HUD Badge */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] bg-[#0c131d]/90 border border-[#1e293b] text-[10px] font-mono font-medium text-[#38bdf8] backdrop-blur-md shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            3D CBAM Telemetry Orbit
          </span>
          <span className="text-[10px] font-mono text-[#64748b] bg-black/40 px-2 py-0.5 rounded border border-[#1e293b]/50">
            Click & Drag to Rotate
          </span>
        </div>

        {/* Auto-rotate Toggle */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`absolute bottom-2 right-2 px-2.5 py-1 rounded-[5px] text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
            autoRotate
              ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40'
              : 'bg-[#1e293b] text-[#94a3b8] border border-[#334155]'
          }`}
        >
          <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>{autoRotate ? 'Auto-Orbit ON' : 'Paused'}</span>
        </button>
      </div>

      {/* Real-time 3D Telemetry Inspector Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#34d399] uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            Cross-Border Verified Ingestion
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Global Carbon Origin Map
          </h3>
          <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
            Every shipment across borders is linked to physical mill coordinates, certified primary emissions, and verified EU CBAM clearance.
          </p>
        </div>

        {/* Active Node Card with 3D Depth */}
        <div className="p-4 rounded-[8px] bg-[#0f172a]/80 border border-[#1e293b] shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-[#334155]/60 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: selectedNode.color }} 
              />
              <span className="font-semibold text-sm text-white">
                {selectedNode.name}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] border border-[#334155]">
              {selectedNode.country}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#64748b] block">HS/CN Code</span>
              <span className="text-white font-semibold">{selectedNode.cnCode}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">Declared Goods</span>
              <span className="text-[#cbd5e1] truncate block">{selectedNode.product}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">Specific Emissions</span>
              <span className="text-[#34d399] font-bold">
                {selectedNode.emissions > 0 ? `${selectedNode.emissions} tCO₂e/t` : 'Destination Port'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">Traceability Hash</span>
              <span className="text-[#94a3b8] text-[10px]">SHA256: 0x8f2c...4e</span>
            </div>
          </div>
        </div>

        {/* Selectable Supplier Pins */}
        <div className="flex flex-wrap gap-1.5">
          {TRADE_NODES.map((node) => (
            <button
              key={node.name}
              type="button"
              onClick={() => setSelectedNode(node)}
              className={`px-2.5 py-1 rounded-[5px] text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedNode.name === node.name
                  ? 'bg-[#10b981] text-[#022c22] font-bold shadow-md'
                  : 'bg-[#1e293b]/70 text-[#cbd5e1] hover:bg-[#334155] border border-[#334155]/60'
              }`}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: node.color }} 
              />
              <span>{node.country}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
