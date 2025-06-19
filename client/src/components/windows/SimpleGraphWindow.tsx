import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";
import type { SystemMetrics } from "@shared/schema";

interface DataPoint {
  value: number;
  timestamp: number;
}

export default function SimpleGraphWindow() {
  const [cpuHistory, setCpuHistory] = useState<DataPoint[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<DataPoint[]>([]);

  const { data: metrics } = useQuery<SystemMetrics>({
    queryKey: ['/api/system/metrics'],
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (metrics) {
      const now = Date.now();
      
      setCpuHistory(prev => {
        const updated = [...prev, { value: metrics.cpuUsage, timestamp: now }];
        return updated.slice(-20); // Keep last 20 points
      });
      
      setMemoryHistory(prev => {
        const updated = [...prev, { value: metrics.memoryUsage, timestamp: now }];
        return updated.slice(-20);
      });
    }
  }, [metrics]);

  const renderGraph = (data: DataPoint[], color: string, label: string) => {
    if (data.length < 2) return null;

    const maxValue = 100;
    const width = 280;
    const height = 60;
    
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (point.value / maxValue) * height;
      return `${x},${y}`;
    }).join(' ');

    const currentValue = data[data.length - 1]?.value || 0;

    return (
      <div className="border border-holo-border rounded p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            {label === 'CPU' ? <Cpu className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
            <span>{label} USAGE</span>
          </div>
          <span className="text-lg font-mono">{currentValue}%</span>
        </div>
        
        <div className="relative">
          <svg width={width} height={height} className="border border-holo-border rounded bg-holo-surface">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 150, 200, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Area fill */}
            {data.length > 1 && (
              <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill={color}
                fillOpacity="0.2"
              />
            )}
            
            {/* Line */}
            {data.length > 1 && (
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            )}
            
            {/* Current value dot */}
            {data.length > 0 && (
              <circle
                cx={width}
                cy={height - (currentValue / maxValue) * height}
                r="3"
                fill={color}
              />
            )}
          </svg>
        </div>
        
        <div className="h-1 bg-holo-surface rounded overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${currentValue}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto holo-scrollbar">
      {/* Real-time status */}
      <div className="flex items-center justify-center space-x-2 text-xs opacity-60">
        <Activity className="w-3 h-3 text-holo-accent animate-pulse" />
        <span>Real-time monitoring • {cpuHistory.length} samples</span>
      </div>

      {/* CPU Graph */}
      {renderGraph(cpuHistory, 'hsl(195, 100%, 45%)', 'CPU')}
      
      {/* Memory Graph */}
      {renderGraph(memoryHistory, 'hsl(195, 100%, 45%)', 'MEMORY')}

      {/* Network Status */}
      <div className="border border-holo-border rounded p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <Wifi className="w-3 h-3" />
            <span>NETWORK STATUS</span>
          </div>
          <div className={`text-xs font-mono ${
            metrics?.networkStatus === 'CONNECTED' ? 'text-holo-accent' : 'text-red-400'
          }`}>
            {metrics?.networkStatus || 'UNKNOWN'}
          </div>
        </div>
        <div className="mt-2 flex space-x-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-1 h-4 rounded ${
                metrics?.networkStatus === 'CONNECTED' && index < 3
                  ? 'bg-holo-accent'
                  : 'border border-holo-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* System Summary */}
      <div className="border border-holo-border rounded p-3 space-y-2">
        <div className="text-xs opacity-60 mb-2">SYSTEM SUMMARY</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="opacity-60">Uptime:</span>
            <div className="font-mono">
              {Math.floor(Math.random() * 48 + 12)}h {Math.floor(Math.random() * 60)}m
            </div>
          </div>
          <div>
            <span className="opacity-60">Load Avg:</span>
            <div className="font-mono">{(Math.random() * 2).toFixed(2)}</div>
          </div>
          <div>
            <span className="opacity-60">Processes:</span>
            <div className="font-mono">{Math.floor(Math.random() * 50 + 120)}</div>
          </div>
          <div>
            <span className="opacity-60">Threads:</span>
            <div className="font-mono">{Math.floor(Math.random() * 200 + 800)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}