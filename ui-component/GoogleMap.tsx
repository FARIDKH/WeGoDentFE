// components/GoogleMap.js
import { useEffect, useRef } from 'react';

function GoogleMap({ address, pinpointAddresses = [], clinics }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const geocoder = new (window as any).google.maps.Geocoder();

    // Budapest as the default location
    const defaultLocation = { lat: 47.4979, lng: 19.0402 };

    const map = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 15,
      center: defaultLocation,
    });

    // InfoWindow for the pinpoints
    const infoWindow = new (window as any).google.maps.InfoWindow();


    // Set center of the map based on main address (if provided)
    if (address) {
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
    }

    // Add pinpoints for each address in pinpointAddresses
    clinics.forEach((clinic) => {
      // Geocode the clinic's office location address
      geocoder.geocode({ "address": clinic.officeLocationName }, function (results, status) {
        if (status === "OK") {
          const marker = new (window as any).google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
          });

          // Set clinic data as content for the infoWindow
          const content = `
            <div>
              <h3>${clinic.name}</h3>
              <p>${clinic.officeLocationName}</p>
              <p>Phone: ${clinic.phoneNumber}</p>
            </div>
          `;

          // Add a click event listener to open the infoWindow
          marker.addListener("click", () => {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          });
        } else {
          console.error("Geocode was not successful for the following reason: " + status);
        }
      });
    });

  }, [address, clinics]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: "20px" }}></div>
  );
}

export default GoogleMap;
