import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

interface NetworkStatusIndicatorProps {
  visible?: boolean;
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  visible = true,
}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    // Check initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  if (!visible || isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>No internet connection</Text>
      <Text style={styles.subtext}>
        Videos require an active internet connection
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E55A23',
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  subtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Roboto',
  },
});
