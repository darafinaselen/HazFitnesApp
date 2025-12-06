import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TopProgressBarProps {
  total: number;
  current: number;
}

const TopProgressBar: React.FC<TopProgressBarProps> = ({ total, current }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index <= current ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 6,
    height: 10,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  active: {
    backgroundColor: '#10486A',
  },
  inactive: {
    backgroundColor: 'rgba(22, 151, 212, 0.5)',
  },
});

export default TopProgressBar;
