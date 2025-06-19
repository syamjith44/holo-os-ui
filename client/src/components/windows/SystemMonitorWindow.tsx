import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cpu, HardDrive, Wifi, Activity } from "lucide-react";
import type { SystemMetrics } from "@shared/schema";

export default function SystemMonitorWindow() {
  const { data: metrics, isLoading, refetch } = useQuery<SystemMetrics>({
    queryKey: ['/api/system/metrics'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const formatUptime = () => {
    const uptimeMs = Date.now() - (new Date().getTime() - Math.random() * 86400000);
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getNetworkBars = (status: string) => {
    if (status === 'CONNECTED') {
      return [true, true, true, false];
    } else if (status === 'LIMITED') {
      return [true, true, false, false];
    } else {
      return [false, false, false, false];
    }
  };

  const formatMemory = (percentage: number) => {
    const totalGB = 16;
    const usedGB = (percentage / 100) * totalGB;
    return `${usedGB.toFixed(1)} GB / ${totalGB} GB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm opacity-60">Loading system metrics...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm opacity-60">No system data available</div>
      </div>
    );
  }

  const networkBars = getNetworkBars(metrics.networkStatus);

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto holo-scrollbar">
      {/* CPU Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3 h-3" />
            <span>CPU</span>
          </div>
          <span className="font-mono">{metrics.cpuUsage}%</span>
        </div>
        <div className="w-full h-1 border border-holo-border rounded overflow-hidden">
          <div
            className="h-full bg-holo-accent transition-all duration-500"
            style={{ width: `${metrics.cpuUsage}%` }}
          />
        </div>
      </div>

      {/* Memory Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-3 h-3" />
            <span>MEMORY</span>
          </div>
          <span className="font-mono">{formatMemory(metrics.memoryUsage)}</span>
        </div>
        <div className="w-full h-1 border border-holo-border rounded overflow-hidden">
          <div
            className="h-full bg-holo-accent transition-all duration-500"
            style={{ width: `${metrics.memoryUsage}%` }}
          />
        </div>
      </div>

      {/* Network Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Wifi className="w-3 h-3" />
            <span>NETWORK</span>
          </div>
          <span className={`font-mono ${metrics.networkStatus === 'CONNECTED' ? 'text-holo-accent' : 'text-red-400'}`}>
            {metrics.networkStatus}
          </span>
        </div>
        <div className="flex space-x-1">
          {networkBars.map((active, index) => (
            <div
              key={index}
              className={`w-1 h-4 rounded ${
                active ? 'bg-holo-accent' : 'border border-holo-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="text-xs opacity-60 pt-2 border-t border-holo-border space-y-1">
        <div className="flex items-center justify-between">
          <span>UPTIME:</span>
          <span className="font-mono">{formatUptime()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>PROCESSES:</span>
          <span className="font-mono">{Math.floor(Math.random() * 20) + 35} active</span>
        </div>
        <div className="flex items-center justify-between">
          <span>LOAD AVG:</span>
          <span className="font-mono">{(Math.random() * 2).toFixed(2)}</span>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center justify-center space-x-2 pt-2">
        <Activity className="w-3 h-3 text-holo-accent animate-pulse" />
        <span className="text-xs opacity-60">Real-time monitoring</span>
      </div>
    </div>
  );
}
