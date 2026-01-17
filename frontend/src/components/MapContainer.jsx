import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

const MapContainer = ({ event }) => {
  const [selected, setSelected] = useState(null);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: event.coordinates?.lat || 0,
    lng: event.coordinates?.lng || 0,
  };

  return (
    <div className="relative h-64 rounded-lg overflow-hidden">
      {event.coordinates ? (
        <>
          <LoadScript
            googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
            loadingElement={<div className="h-full w-full bg-gray-200" />}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker
                position={center}
                onClick={() => {
                  setSelected(event);
                }}
              />

              {selected && (
                <InfoWindow
                  position={center}
                  onCloseClick={() => {
                    setSelected(null);
                  }}
                >
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p>{event.location}</p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Get Directions
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
          <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow-md">
            <a
              href={`https://www.google.com/maps?q=${center.lat},${center.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Open in Google Maps
            </a>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center bg-gray-200">
          <p className="text-gray-500">Map view of {event.location}</p>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
