import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PauseIcon, PlayIcon, NextIcon, PrevIcon } from './PlayerIcons'; // Import dari file icon yang kita buat

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrev} style={styles.ctrlBtn}>
        <PrevIcon />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPause} style={styles.ctrlBtnMain}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext} style={styles.ctrlBtn}>
        <NextIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  ctrlBtn: {
    padding: 15,
  },
  ctrlBtnMain: {
    padding: 10,
  },
});

export default PlayerControls;
