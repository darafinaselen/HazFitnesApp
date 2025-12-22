import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import Geolocation from 'react-native-geolocation-service';

// --- ICONS ---
const BackIcon = () => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10486A"
    strokeWidth="2"
  >
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const LocationPinIcon = () => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#10486A"
    stroke="#10486A"
    strokeWidth="2"
  >
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" fill="#FFF" />
  </Svg>
);

const PauseIcon = () => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
    stroke="white"
    strokeWidth="2"
  >
    <Path d="M10 9v6m4-6v6" strokeLinecap="round" />
  </Svg>
);

// --- COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { height: 100vh; width: 100vw; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    // Inisialisasi Peta (Default Zoom Out dulu)
    var map = L.map('map', { zoomControl: false }).setView([0, 0], 2);
    var userMarker = null;

    // Layer OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fungsi ini dipanggil dari React Native untuk update lokasi marker
    function updateMapLocation(lat, lng) {
      map.setView([lat, lng], 16); // Zoom otomatis ke lokasi user
      
      if (!userMarker) {
        // Buat marker baru jika belum ada
        userMarker = L.circleMarker([lat, lng], {
          color: 'white', 
          fillColor: '#10486A', 
          fillOpacity: 1, 
          weight: 3, 
          radius: 10 
        }).addTo(map);
      } else {
        // Geser marker jika sudah ada
        userMarker.setLatLng([lat, lng]);
      }
    }
  </script>
</body>
</html>
`;

const StepsTrackerScreen: React.FC = () => {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);

  // --- 1. LOGIC IZIN LOKASI (ANDROID) ---
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izinkan Lokasi',
            message:
              'Aplikasi membutuhkan akses lokasi untuk menampilkan posisi lari kamu.',
            buttonNeutral: 'Nanti',
            buttonNegative: 'Tolak',
            buttonPositive: 'Izinkan',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            'Izin Ditolak',
            'Lokasi tidak dapat ditampilkan tanpa izin.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // --- 2. LOGIC AMBIL KOORDINAT GPS ---
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const script =
          'updateMapLocation(' + latitude + ', ' + longitude + '); true;';

        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(script);
        }
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert('Gagal ambil lokasi', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  };

  // Jalan otomatis saat layar dibuka
  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      }
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* HEADER */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>STEPS</Text>
          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.iconButton}
          >
            <LocationPinIcon />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* MAP SECTION */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: leafletHtml }}
          style={styles.map}
          scrollEnabled={false}
        />

        {/* FLOATING CONTROLS (Bottom Sheet) */}
        <View style={styles.bottomSheet}>
          {/* Timer Floating Pill */}
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>00 : 22 : 00</Text>
            <View style={styles.divider} />
            <TouchableOpacity>
              <PauseIcon />
            </TouchableOpacity>
          </View>
          <Text style={styles.timerLabel}>Duration</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatItem value="10 KM" label="Distance (KM)" />
            <StatItem value="180" label="Calories" />
            <StatItem value="20:20" label="Avg. Pace" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // Header
  headerContainer: {
    backgroundColor: '#FFF',
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    color: '#10486A',
    textTransform: 'uppercase',
  },
  iconButton: {
    padding: 5,
  },

  // Map
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Bottom Sheet / Controls
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
  },
  timerPill: {
    backgroundColor: '#10486A',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    position: 'absolute',
    alignSelf: 'center',
    top: 10,

    // Shadow for pill
    shadowColor: '#10486A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  timerText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 20,
    marginRight: 15,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 15,
  },
  timerLabel: {
    color: '#A2A6AB',
    fontSize: 12,
    marginBottom: 20,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#10486A',
    fontSize: 18,
    fontFamily: FONT_FAMILY.MontserratBold,
    marginBottom: 4,
  },
  statLabel: {
    color: '#A2A6AB',
    fontSize: 12,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
});

export default StepsTrackerScreen;
