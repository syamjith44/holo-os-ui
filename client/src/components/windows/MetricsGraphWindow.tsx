import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";
import type { SystemMetrics } from "@shared/schema";

interface DataPoint {
  time: string;
  cpu: number;
  memory: number;
  timestamp: number;
}

export default function MetricsGraphWindow() {
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);

  const { data: metrics } = useQuery<SystemMetrics>({
    queryKey: ['/api/system/metrics'],
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
  });

  useEffect(() => {
    if (metrics) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        minute: '2-digit',
        second: '2-digit'
      });

      const newDataPoint: DataPoint = {
        time: timeString,
        cpu: metrics.cpuUsage,
        memory: metrics.memoryUsage,
        timestamp: now.getTime(),
      };

      setHistoricalData(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 data points for smooth visualization
        return updated.slice(-20);
      });
    }
  }, [metrics]);

  const getCurrentValue = (type: 'cpu' | 'memory') => {
    const latest = historicalData[historicalData.length - 1];
    return latest ? latest[type] : 0;
  };

  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto holo-scrollbar">
      {/* Real-time Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-holo-border rounded p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <Cpu className="w-3 h-3" />
            <span>CPU USAGE</span>
          </div>
          <div className="text-2xl font-mono">{getCurrentValue('cpu')}%</div>
          <div className="h-1 bg-holo-surface rounded overflow-hidden">
            <div 
              className="h-full bg-holo-accent transition-all duration-500"
              style={{ width: `${getCurrentValue('cpu')}%` }}
            />
          </div>
        </div>

        <div className="border border-holo-border rounded p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <HardDrive className="w-3 h-3" />
            <span>MEMORY</span>
          </div>
          <div className="text-2xl font-mono">{getCurrentValue('memory')}%</div>
          <div className="h-1 bg-holo-surface rounded overflow-hidden">
            <div 
              className="h-full bg-holo-accent transition-all duration-500"
              style={{ width: `${getCurrentValue('memory')}%` }}
            />
          </div>
        </div>
      </div>

      {/* CPU Usage Graph */}
      <div className="border border-holo-border rounded p-3">
        <div className="flex items-center space-x-2 mb-3 text-xs">
          <Activity className="w-3 h-3 text-holo-accent" />
          <span>CPU USAGE OVER TIME</span>
        </div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(195, 100%, 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(195, 100%, 45%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 50%)' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 50%)' }}
                width={25}
              />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="hsl(195, 100%, 45%)"
                strokeWidth={2}
                fill="url(#cpuGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage Graph */}
      <div className="border border-holo-border rounded p-3">
        <div className="flex items-center space-x-2 mb-3 text-xs">
          <Activity className="w-3 h-3 text-holo-accent" />
          <span>MEMORY USAGE OVER TIME</span>
        </div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 50%)' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 50%)' }}
                width={25}
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="hsl(195, 100%, 45%)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5,5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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

      {/* Data Info */}
      <div className="text-xs opacity-60 text-center pt-2 border-t border-holo-border">
        {historicalData.length > 0 ? (
          <>Real-time data • {historicalData.length} samples</>
        ) : (
          <>Waiting for data...</>
        )}
      </div>
    </div>
  );
}