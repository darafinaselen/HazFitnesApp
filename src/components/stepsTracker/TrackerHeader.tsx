import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { FONT_FAMILY } from '../../constants/fonts';

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

interface Props {
  onBack: () => void;
  onCenterMap: () => void;
  loading: boolean;
}

const TrackerHeader: React.FC<Props> = ({ onBack, onCenterMap, loading }) => {
  return (
    <SafeAreaView style={styles.headerContainer} edges={['top']}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>STEPS TRACKER</Text>
        <TouchableOpacity style={styles.iconButton} onPress={onCenterMap}>
          {loading ? (
            <ActivityIndicator size="small" color="#10486A" />
          ) : (
            <LocationPinIcon />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default TrackerHeader;
