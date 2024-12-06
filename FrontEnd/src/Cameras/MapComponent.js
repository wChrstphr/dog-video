import React, { useEffect, useRef, useState } from 'react';

function MapComponent() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API não está carregada");
      return;
    }

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 6,
    });

    setMap(newMap);

    const infoWindow = new window.google.maps.InfoWindow();
    const locationButton = document.createElement("button");
    locationButton.textContent = "Ir para Localização Atual";
    locationButton.classList.add("custom-map-control-button");
    newMap.controls[window.google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("Localização encontrada.");
            infoWindow.open(newMap);
            newMap.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, newMap.getCenter());
          }
        );
      } else {
        handleLocationError(false, infoWindow, newMap.getCenter());
      }
    });
  }, []);

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    if (!map) return;

    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Erro: O serviço de Geolocalização falhou."
        : "Erro: Seu navegador não suporta geolocalização."
    );
    infoWindow.open(map);
  }

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}

export default MapComponent;