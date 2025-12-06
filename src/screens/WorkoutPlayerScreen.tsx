import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY, FONT_SIZE } from '../constants/fonts';
import TopProgressBar from '../components/player/TopProgressBar';
import PlayerControls from '../components/player/PlayerControls';
import { BackIcon, VolumeIcon } from '../components/player/PlayerIcons';
import { Video, ResizeMode } from 'expo-av';
import QuitWorkoutModal from '../components/player/QuitWorkoutModal';
import { VideoLoadingIndicator } from '../components/player/VideoLoadingIndicator';
import { NetworkStatusIndicator } from '../components/player/NetworkStatusIndicator';

const WorkoutPlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'WorkoutPlayer'>>();
  const { playlist, initialIndex } = route.params;
  const videoRef = useRef(null);

  // --- STATE ---
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [isGetReady, setIsGetReady] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoRetryCount, setVideoRetryCount] = useState(0);

  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(0);

  const currentExercise = playlist[currentIndex];
  const progressPercent = (progress / currentExercise.duration) * 100;

  const handleBackPress = useCallback(() => {
    setIsPlaying(false);
    setModalVisible(true);
    return true;
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  const handleQuit = (reason: string) => {
    console.log('Quit reason:', reason);
    setModalVisible(false);
    navigation.goBack();
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: any;

    if (isPlaying && !isModalVisible) {
      if (isGetReady) {
        // COUNTDOWN MODE
        interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              setIsGetReady(false);
              setProgress(0);
              return 5;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // COUNT UP MODE (0 -> Duration)
        interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= currentExercise.duration) {
              handleNext();
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, isGetReady, currentExercise, isModalVisible, handleNext]);

  // --- HANDLERS ---
  const handleNext = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsGetReady(true);
      setCountdown(5);
      setProgress(0);
    } else {
      setIsPlaying(false);
      Alert.alert('WORKOUT COMPLETE! 🎉', 'Congratulations!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [currentIndex, playlist.length, navigation]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsGetReady(true);
      setCountdown(5);
      setProgress(0);
    } else {
      setIsGetReady(true);
      setCountdown(5);
    }
  }, [currentIndex]);

  const handleSkipGetReady = () => {
    setIsGetReady(false);
    setProgress(0);
  };

  // --- VIDEO HANDLERS ---
  const handleVideoLoadStart = () => {
    console.log('Video loading started...');
    setVideoLoading(true);
    setVideoError(null);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoading(false);
    setVideoError(null);
  };

  const handleVideoError = (error: any) => {
    const errorMessage = error?.message || 'Video failed to load. Check internet connection.';
    console.log('Video error:', error);
    setVideoLoading(false);
    setVideoError(errorMessage);
  };

  const handleRetryVideo = () => {
    console.log('Retrying video...');
    setVideoError(null);
    setVideoLoading(true);
    setVideoRetryCount(prev => prev + 1);
  };

  // --- CONTROL VIDEO PLAYBACK ---
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && !isGetReady && !isModalVisible) {
        videoRef.current.playAsync?.();
      } else {
        videoRef.current.pauseAsync?.();
      }
    }
  }, [isPlaying, isGetReady, isModalVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatusIndicator />
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* 1. TOP PROGRESS BAR */}
      {!isGetReady && (
        <TopProgressBar total={playlist.length} current={currentIndex} />
      )}

      {/* 2. HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <BackIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
          <VolumeIcon isMuted={isMuted} />
        </TouchableOpacity>
      </View>

      {/* 3. CONTENT AREA */}
      <View style={styles.content}>
        {isGetReady ? (
          // === LAYAR GET READY ===
          <View style={styles.getReadyContainer}>
            <Text style={styles.getReadyTitle}>READY TO START</Text>
            <Text style={styles.getReadyTimer}>{countdown}</Text>
            <Text style={styles.getReadyNext}>
              {currentExercise.category || 'EXERCISE'}
            </Text>
            <Text style={styles.nextExerciseName}>{currentExercise.name}</Text>

            <TouchableOpacity
              style={styles.btnSkipSmall}
              onPress={handleSkipGetReady}
            >
              <Text style={styles.btnSkipText}>SKIP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // === LAYAR VIDEO PLAYER ===
          <View style={styles.playerWrapper}>
            {/* A. VIDEO AREA */}
            <View style={styles.videoContainer}>
              {currentExercise.video ? (
                <>
                  <Video
                    key={videoRetryCount}
                    ref={videoRef}
                    source={currentExercise.video}
                    style={styles.videoStyle}
                    resizeMode={ResizeMode.COVER}
                    isLooping={true}
                    shouldPlay={isPlaying}
                    isMuted={isMuted}
                    onLoadStart={handleVideoLoadStart}
                    onLoad={handleVideoLoad}
                    onError={handleVideoError}
                  />
                  <VideoLoadingIndicator
                    isLoading={videoLoading}
                    isError={!!videoError}
                    errorMessage={videoError || 'Video failed to load'}
                    onRetry={handleRetryVideo}
                  />
                </>
              ) : (
                // Fallback kalau video ga ada
                <View
                  style={[
                    styles.videoStyle,
                    {
                      backgroundColor: '#eee',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <Text>No Video Source</Text>
                </View>
              )}
            </View>

            {/* B. INFO & CONTROLS (Layout Baru) */}
            <View style={styles.controlsArea}>
              {/* Judul (Kiri) dan Timer (Kanan) */}
              <View style={styles.infoRow}>
                <Text style={styles.exerciseName} numberOfLines={1}>
                  {currentExercise.name}
                </Text>

                <View style={styles.timerWrapper}>
                  <Text style={styles.timeCurrent}>{progress}"</Text>
                  <Text style={styles.timeTotal}>
                    /{currentExercise.duration}"
                  </Text>
                </View>
              </View>

              {/* Progress Bar (Garis Biru) */}
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>

              {/* Tombol Kontrol */}
              <View style={styles.controlButtonsWrapper}>
                <PlayerControls
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              </View>
            </View>
          </View>
        )}
      </View>
      <QuitWorkoutModal
        visible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          setIsPlaying(true);
        }}
        onQuit={handleQuit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // padding: 20,
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  // --- VIDEO STYLES ---
  playerWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F7FA',
    marginTop: 20,
  },
  videoStyle: {
    width: '100%',
    height: '100%',
  },

  // --- LAYOUT BARU INFO & CONTROLS ---
  controlsArea: {
    paddingHorizontal: 20,
    width: '100%',
    paddingBottom: 40,
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  exerciseName: {
    flex: 1,
    fontSize: 24,
    color: '#0B2D46',
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'left',
    marginRight: 10,
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeCurrent: {
    fontSize: 32,
    color: '#1697D4',
    fontFamily: FONT_FAMILY.RobotoMedium || 'System',
    fontWeight: '700',
  },
  timeTotal: {
    fontSize: 24,
    color: '#10486A',
    fontFamily: FONT_FAMILY.RobotoMedium || 'System',
    fontWeight: '700',
  },

  // Progress Bar
  progressBarBackground: {
    height: 6,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 30,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1697D4',
    borderRadius: 3,
  },

  controlButtonsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- GET READY STYLES ---
  getReadyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  getReadyTitle: {
    fontSize: FONT_SIZE.xl,
    color: '#10486A',
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  getReadyTimer: {
    fontSize: 120,
    color: '#10486A',
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  getReadyNext: {
    fontSize: FONT_SIZE.md,
    color: '#10486A',
    fontFamily: FONT_FAMILY.RobotoMedium || 'System',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  nextExerciseName: {
    fontSize: FONT_SIZE.lg,
    color: '#0B2D46',
    marginBottom: 30,
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    textTransform: 'uppercase',
  },
  btnSkipSmall: {
    backgroundColor: '#1697D4',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: 293,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSkipText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

export default WorkoutPlayerScreen;
