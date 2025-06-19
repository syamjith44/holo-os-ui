import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Wifi, Download, Upload, Globe, Server } from "lucide-react";

interface NetworkDataPoint {
  time: string;
  download: number;
  upload: number;
  latency: number;
  timestamp: number;
}

interface ConnectionData {
  id: string;
  host: string;
  port: number;
  status: 'active' | 'idle' | 'closed';
  bandwidth: number;
}

export default function NetworkActivityWindow() {
  const [networkData, setNetworkData] = useState<NetworkDataPoint[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);

  useEffect(() => {
    const generateNetworkData = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        minute: '2-digit',
        second: '2-digit'
      });

      const newDataPoint: NetworkDataPoint = {
        time: timeString,
        download: Math.random() * 100 + 20, // 20-120 Mbps
        upload: Math.random() * 50 + 10,    // 10-60 Mbps
        latency: Math.random() * 50 + 5,    // 5-55 ms
        timestamp: now.getTime(),
      };

      setNetworkData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-15); // Keep last 15 points
      });
    };

    const generateConnections = () => {
      const hosts = ['api.github.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'replit.dev', 'localhost'];
      const newConnections: ConnectionData[] = hosts.map((host, index) => ({
        id: `conn-${index}`,
        host,
        port: 443 + (index * 10),
        status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'idle' : 'closed',
        bandwidth: Math.random() * 50 + 5,
      }));
      setConnections(newConnections);
    };

    // Initial data
    generateNetworkData();
    generateConnections();

    // Update intervals
    const dataInterval = setInterval(generateNetworkData, 2000);
    const connectionInterval = setInterval(generateConnections, 5000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  const getLatestSpeed = (type: 'download' | 'upload') => {
    const latest = networkData[networkData.length - 1];
    return latest ? latest[type].toFixed(1) : '0.0';
  };

  const getAverageLatency = () => {
    if (networkData.length === 0) return '0';
    const avg = networkData.reduce((sum, point) => sum + point.latency, 0) / networkData.length;
    return avg.toFixed(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-holo-accent';
      case 'idle': return 'bg-holo-accent opacity-60';
      default: return 'bg-holo-accent opacity-30';
    }
  };

  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto holo-scrollbar">
      {/* Network Speed Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-holo-border rounded p-2 space-y-1">
          <div className="flex items-center space-x-1 text-xs">
            <Download className="w-3 h-3" />
            <span>DOWN</span>
          </div>
          <div className="text-lg font-mono">{getLatestSpeed('download')}</div>
          <div className="text-xs opacity-60">Mbps</div>
        </div>

        <div className="border border-holo-border rounded p-2 space-y-1">
          <div className="flex items-center space-x-1 text-xs">
            <Upload className="w-3 h-3" />
            <span>UP</span>
          </div>
          <div className="text-lg font-mono">{getLatestSpeed('upload')}</div>
          <div className="text-xs opacity-60">Mbps</div>
        </div>

        <div className="border border-holo-border rounded p-2 space-y-1">
          <div className="flex items-center space-x-1 text-xs">
            <Wifi className="w-3 h-3" />
            <span>PING</span>
          </div>
          <div className="text-lg font-mono">{getAverageLatency()}</div>
          <div className="text-xs opacity-60">ms</div>
        </div>
      </div>

      {/* Bandwidth Graph */}
      <div className="border border-holo-border rounded p-3">
        <div className="flex items-center space-x-2 mb-3 text-xs">
          <Globe className="w-3 h-3 text-holo-accent" />
          <span>BANDWIDTH USAGE</span>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={networkData}>
              <XAxis 
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: 'hsl(0, 0%, 50%)' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: 'hsl(0, 0%, 50%)' }}
                width={25}
              />
              <Line
                type="monotone"
                dataKey="download"
                stroke="hsl(195, 100%, 45%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="hsl(195, 100%, 45%)"
                strokeWidth={1}
                strokeDasharray="3,3"
                dot={false}
                opacity={0.7}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-4 text-xs mt-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-holo-accent"></div>
            <span>Download</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-holo-accent opacity-70" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(195, 100%, 45%) 2px, hsl(195, 100%, 45%) 4px)' }}></div>
            <span>Upload</span>
          </div>
        </div>
      </div>

      {/* Active Connections */}
      <div className="border border-holo-border rounded p-3">
        <div className="flex items-center space-x-2 mb-3 text-xs">
          <Server className="w-3 h-3 text-holo-accent" />
          <span>ACTIVE CONNECTIONS</span>
        </div>
        <div className="space-y-2 max-h-24 overflow-y-auto holo-scrollbar">
          {connections.map((conn) => (
            <div key={conn.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(conn.status)}`}></div>
                <span className="truncate font-mono">{conn.host}:{conn.port}</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="font-mono">{conn.bandwidth.toFixed(1)} KB/s</span>
                <span className="capitalize opacity-60">{conn.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latency Graph */}
      <div className="border border-holo-border rounded p-3">
        <div className="flex items-center space-x-2 mb-3 text-xs">
          <Wifi className="w-3 h-3 text-holo-accent" />
          <span>LATENCY HISTOGRAM</span>
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={networkData.slice(-8)}>
              <XAxis 
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: 'hsl(0, 0%, 50%)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: 'hsl(0, 0%, 50%)' }}
                width={20}
              />
              <Bar
                dataKey="latency"
                fill="hsl(195, 100%, 45%)"
                opacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status */}
      <div className="text-xs opacity-60 text-center pt-2 border-t border-holo-border">
        Real-time network monitoring • {networkData.length} samples
      </div>
    </div>
  );
}