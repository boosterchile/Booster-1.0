import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';

interface GoogleMapComponentProps {
  mapId?: string;
  center: { lat: number; lng: number };
  zoom: number;
  markerPosition?: { lat: number; lng: number } | null;
  markerTitle?: string;
  style?: React.CSSProperties;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  mapId = 'smartcargo-map',
  center,
  zoom,
  markerPosition,
  markerTitle,
  style = { height: '100%', minHeight: '300px', width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is fully mounted before rendering map
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Don't render until component is mounted
  if (!isMounted) {
    return (
      <div style={style} className="flex items-center justify-center bg-[#2c3035] rounded-xl">
        <div className="text-[#a2abb3]/70 text-sm">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div style={style}>
      <Map
        mapId={mapId}
        center={center}
        zoom={zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        reuseMaps={true}
      >
        {markerPosition && (
          <AdvancedMarker
            position={markerPosition}
            title={markerTitle}
          >
            <span style={{ fontSize: '24px' }}>📍</span>
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
};

export default React.memo(GoogleMapComponent);