import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import {
  getDistanceFromLatLonInKm,
  formatTime,
  calculatePace,
} from '../utils/trackerHelper';
import TrackerHeader from '../components/stepsTracker/TrackerHeader';
import TrackerStatsSheet from '../components/stepsTracker/TrackerStatsSheet';

const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style> body { margin: 0; padding: 0; } #map { height: 100vh; width: 100vw; } </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([0, 0], 16);
    var userMarker = null;
    var routeLine = null;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    routeLine = L.polyline([], {color: '#1697D4', weight: 5}).addTo(map);

    function updateMapLocation(lat, lng) {
      var newLatLng = new L.LatLng(lat, lng);
      map.setView(newLatLng, 16);
      if (!userMarker) {
        userMarker = L.circleMarker(newLatLng, { color: 'white', fillColor: '#10486A', fillOpacity: 1, weight: 3, radius: 8 }).addTo(map);
      } else {
        userMarker.setLatLng(newLatLng);
      }
    }
    
    function addRoutePoint(lat, lng) {
        var newLatLng = new L.LatLng(lat, lng);
        map.setView(newLatLng, 16);
        if (!userMarker) {
            userMarker = L.circleMarker(newLatLng, { color: 'white', fillColor: '#10486A', fillOpacity: 1, weight: 3, radius: 8 }).addTo(map);
        } else {
            userMarker.setLatLng(newLatLng);
        }
        routeLine.addLatLng(newLatLng);
    }
  </script>
</body>
</html>
`;

const StepsTrackerScreen: React.FC = () => {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState('0\'00"');
  const [loading, setLoading] = useState(false);

  // Refs
  const lastLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null,
  );

  // Logic Timer
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Logic Center Map (Manual)
  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Mohon izinkan lokasi.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      const script = `updateMapLocation(${latitude}, ${longitude}); true;`;
      webViewRef.current?.injectJavaScript(script);
      lastLocationRef.current = { latitude, longitude };
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Logic Start/Stop Tracking
  const startTracking = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Mohon izinkan lokasi.');
      setLoading(false);
      return;
    }

    setIsRunning(true);
    setLoading(false);

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 5,
      },
      location => {
        const { latitude, longitude } = location.coords;
        const script = `addRoutePoint(${latitude}, ${longitude}); true;`;
        webViewRef.current?.injectJavaScript(script);

        if (lastLocationRef.current) {
          const newDist = getDistanceFromLatLonInKm(
            lastLocationRef.current.latitude,
            lastLocationRef.current.longitude,
            latitude,
            longitude,
          );
          setDistance(prevDist => {
            const totalDist = prevDist + newDist;
            setCalories(Math.round(totalDist * 60));
            return totalDist;
          });
        }
        lastLocationRef.current = { latitude, longitude };
      },
    );
  };

  const stopTracking = () => {
    setIsRunning(false);
    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;
  };

  const toggleTracking = () => {
    if (isRunning) stopTracking();
    else startTracking();
  };

  // Hitung Pace
  useEffect(() => {
    const newPace = calculatePace(timer, distance);
    setPace(newPace);
  }, [timer, distance]);

  // Init
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* 1. HEADER COMPONENT */}
      <TrackerHeader
        onBack={() => {
          stopTracking();
          navigation.goBack();
        }}
        onCenterMap={getCurrentLocation}
        loading={loading}
      />

      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: leafletHtml }}
          style={[styles.map, { opacity: 0.99 }]}
          scrollEnabled={false}
        />

        {/* STATS SHEET COMPONENT */}
        <TrackerStatsSheet
          isRunning={isRunning}
          timerString={formatTime(timer)}
          distance={distance}
          calories={calories}
          pace={pace}
          onToggleTracking={toggleTracking}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  mapContainer: { flex: 1, position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
});

export default StepsTrackerScreen;
