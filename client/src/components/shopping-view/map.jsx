import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapRender = ({ productLocation, customerLocation }) => {
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (productLocation && customerLocation) {
      fetchRoute();
    }
  }, [productLocation]); 

  const fetchRoute = async () => {
    const apiKey = "5b3ce3597851110001cf6248b090b8b61cc64dab9d2598625e635fa7";
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${productLocation.lng},${productLocation.lat}&end=${customerLocation.lng},${customerLocation.lat}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRoute(coordinates);
      setDistance((response.data.features[0].properties.summary.distance / 1000).toFixed(2));
      setTime((response.data.features[0].properties.summary.duration / 60).toFixed(2));
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };


  function convertMinutesToTime(minutes) {
    const days = Math.floor(minutes / 1440); // 1 day = 1440 minutes
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = Math.floor(minutes % 60);

    return `${days} days, ${hours} hours, ${mins} minutes`;
}



  return (
    <div>
      <MapContainer 
        key={productLocation.lat + productLocation.lng} 
        center={productLocation} 
        zoom={7} 
        style={{ height: "500px", width: "50vw" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={productLocation}>
          <Popup>Product Location</Popup>
        </Marker>
        <Marker position={customerLocation}>
          <Popup>Customer Location</Popup>
        </Marker>
        {route.length > 0 && <Polyline positions={route} color="black" />}
      </MapContainer>
      {distance && time && (
        <div style={{ marginTop: "10px" }}>
          <p><strong>Distance:</strong> {distance} km</p>
          <p><strong>Estimated Time:</strong> {convertMinutesToTime(time)}s</p>
        </div>
      )}
    </div>
  );
};


export default MapRender;


