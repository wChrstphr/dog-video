import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '10px',
    overflow: 'hidden'
  };
  

function Map({ onClose }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: '',
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error('Erro ao obter localização:', err.message);
          setError('Não foi possível obter sua localização.');
        }
      );
    } else {
      console.error('Geolocalização não é suportada pelo navegador.');
      setError('Geolocalização não é suportada pelo navegador.');
    }
  }, []);

  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition || { lat: -15.7942, lng: -47.8822 }}
        zoom={14}
        options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
        }}
        >
        {currentPosition && <Marker position={currentPosition} />}
        </GoogleMap>

      )}
    </div>
  );
}

export default Map;
