// components/GoogleMap.js

import { useEffect, useRef } from 'react';

function GoogleMap({ address }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!address) return;

    const geocoder = new (window as any).google.maps.Geocoder();

    const map = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: -34.397, lng: 150.644 },  // Default to some location
    });

    geocoder.geocode({ "address": address }, function (results, status) {
      if (status === "OK") {
        map.setCenter(results[0].geometry.location);
        new (window as any).google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  }, [address]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
  );
}

export default GoogleMap;
