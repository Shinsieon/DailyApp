import { useEffect, useState } from "react";
import { api } from "../api";
import { message } from "antd";

interface LocationProps {
  latitude: number;
  longitude: number;
}

const Weather = () => {
  const [location, setLocation] = useState<LocationProps | null>({
    latitude: 37.46085,
    longitude: 126.9106672,
  });
  const [loading, setLoading] = useState(true);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const success = (pos: GeolocationPosition) => {
    const crd = pos.coords;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    setLocation({ latitude: crd.latitude, longitude: crd.longitude });
    setLoading(false);
  };

  const errors = (err: GeolocationPositionError) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setLoading(false);
  };
  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) {
        return;
      }
      try {
        const response = await api.getWeather(
          location.latitude,
          location.longitude
        );
        //const data = await response.json();
        console.log(response);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      }
    };
    fetchWeather();
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            message.error("Geolocation permission has been denied.");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Permission query error:", err);
          message.error("Permission query error.");
          setLoading(false);
        });
    } else {
      message.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h1>Weather</h1>
      <p>{`Latitude: ${location?.latitude}, Longitude: ${location?.longitude}`}</p>
    </div>
  );
};

export default Weather;
