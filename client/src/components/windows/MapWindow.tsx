import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Navigation, MapPin } from "lucide-react";

interface MapNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

interface MapConnection {
  from: string;
  to: string;
  angle: number;
  length: number;
}

export default function MapWindow() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentLocation, setCurrentLocation] = useState({ x: 50, y: 35 });
  const [destination, setDestination] = useState({ x: 75, y: 65 });
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lon: -122.4194 });
  const [routeInfo, setRouteInfo] = useState({ distance: "2.4 km", eta: "8 min" });

  const mapNodes: MapNode[] = [
    { id: "node1", x: 15, y: 20, label: "A" },
    { id: "node2", x: 35, y: 40, label: "B" },
    { id: "node3", x: 25, y: 60, label: "C" },
    { id: "node4", x: 70, y: 30, label: "D" },
    { id: "node5", x: 80, y: 70, label: "E" },
  ];

  const mapConnections: MapConnection[] = [
    { from: "node1", to: "node2", angle: 45, length: 15 },
    { from: "node2", to: "node3", angle: -30, length: 20 },
    { from: "node4", to: "node5", angle: 60, length: 25 },
    { from: "node2", to: "node4", angle: 20, length: 35 },
  ];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDestination({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    
    // Simulate route calculation
    const distance = Math.sqrt(Math.pow(x - currentLocation.x, 2) + Math.pow(y - currentLocation.y, 2));
    setRouteInfo({
      distance: `${(distance * 50 / 100).toFixed(1)} km`,
      eta: `${Math.max(1, Math.round(distance * 12 / 100))} min`
    });
  };

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinates(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lon: prev.lon + (Math.random() - 0.5) * 0.001,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full p-4 flex flex-col">
      {/* Map Container */}
      <div 
        className="relative flex-1 border border-holo-border rounded wireframe-grid cursor-crosshair overflow-hidden"
        onClick={handleMapClick}
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
      >
        <div className="absolute inset-4">
          {/* Map Nodes */}
          {mapNodes.map((node) => (
            <div
              key={node.id}
              className="absolute map-node rounded-full flex items-center justify-center text-xs font-bold"
              style={{ 
                top: `${node.y}%`, 
                left: `${node.x}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={`Node ${node.label}`}
            >
              {node.label}
            </div>
          ))}
          
          {/* Map Connections */}
          {mapConnections.map((connection, index) => {
            const fromNode = mapNodes.find(n => n.id === connection.from);
            const toNode = mapNodes.find(n => n.id === connection.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <div
                key={index}
                className="absolute map-connection"
                style={{
                  top: `${fromNode.y}%`,
                  left: `${fromNode.x}%`,
                  width: `${connection.length}%`,
                  transform: `rotate(${connection.angle}deg)`,
                  transformOrigin: 'left center'
                }}
              />
            );
          })}
          
          {/* Current Location */}
          <div
            className="absolute w-4 h-4 border-2 border-holo-accent rounded-full bg-holo-accent bg-opacity-30 animate-pulse-glow flex items-center justify-center"
            style={{ 
              top: `${currentLocation.y}%`, 
              left: `${currentLocation.x}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title="Current Location"
          >
            <Navigation className="w-2 h-2 text-holo-accent" />
          </div>
          
          {/* Destination Marker */}
          <div
            className="absolute w-3 h-3 bg-holo-accent rounded-full flex items-center justify-center"
            style={{ 
              top: `${destination.y}%`, 
              left: `${destination.x}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title="Destination"
          >
            <MapPin className="w-2 h-2 text-black" />
          </div>
          
          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${currentLocation.x}%`}
              y1={`${currentLocation.y}%`}
              x2={`${destination.x}%`}
              y2={`${destination.y}%`}
              stroke="rgba(0, 212, 255, 0.6)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
        
        {/* Map Controls */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          <Button
            onClick={handleZoomIn}
            className="w-8 h-8 p-0 holo-button text-xs"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            onClick={handleZoomOut}
            className="w-8 h-8 p-0 holo-button text-xs"
          >
            <Minus className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Coordinates Display */}
        <div className="absolute bottom-2 left-2 text-xs opacity-60 font-mono">
          LAT: {coordinates.lat.toFixed(4)} LON: {coordinates.lon.toFixed(4)}
        </div>
        
        {/* Zoom Level */}
        <div className="absolute top-2 left-2 text-xs opacity-60">
          ZOOM: {(zoomLevel * 100).toFixed(0)}%
        </div>
      </div>
      
      {/* Navigation Info */}
      <div className="mt-2 flex justify-between text-xs flex-shrink-0">
        <span className="opacity-80">Distance: {routeInfo.distance}</span>
        <span className="opacity-80">ETA: {routeInfo.eta}</span>
      </div>
      
      {/* Instructions */}
      <div className="mt-1 text-xs opacity-60 text-center flex-shrink-0">
        Click on map to set destination
      </div>
    </div>
  );
}
