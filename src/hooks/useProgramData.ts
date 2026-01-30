import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { programService } from '../services/api';
import {
  SanoVitaDayDetail,
  SanoVitaScheduleSummary,
  Exercise,
} from '../types/programTypes';

const DEFAULT_THUMBNAIL = require('../assets/images/splash.png');

export const useProgramData = (
  programId: string | number,
  dayNumber: number,
) => {
  const [loading, setLoading] = useState(true);
  const [scheduleSummary, setScheduleSummary] = useState<
    SanoVitaScheduleSummary[]
  >([]);
  const [currentDayDetail, setCurrentDayDetail] =
    useState<SanoVitaDayDetail | null>(null);

  useEffect(() => {
    fetchData();
  }, [programId, dayNumber]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await programService.getProgramSchedule(
        programId,
        dayNumber,
      );
      if (response?.data) {
        setScheduleSummary(response.data.schedule_summary || []);
        setCurrentDayDetail(response.data.current_day_detail || null);
      }
    } catch (error) {
      console.error('Failed to fetch schedule', error);
      Alert.alert('Error', 'Gagal memuat jadwal program.');
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: Mapping Logic ---
  const getExercisesBySection = (keywords: string[]): Exercise[] => {
    if (!currentDayDetail?.workout_sections) return [];

    const section = currentDayDetail.workout_sections.find(sec =>
      keywords.some(k => sec.section_name.toUpperCase().includes(k)),
    );

    return (
      section?.exercises.map(ex => {
        // Logic cek video vs image
        const isVideo = ex.image_url && ex.image_url.endsWith('.mp4');

        return {
          id: ex.id,
          name: ex.name,
          duration: ex.duration_seconds,
          // Jika video, pakai default thumbnail. Jika gambar, pakai URL-nya.
          image: isVideo ? DEFAULT_THUMBNAIL : { uri: ex.image_url },
          video: { uri: ex.image_url },
          // Default description
          description: `Lakukan gerakan ${ex.name} selama ${ex.duration_display}`,
          title: ex.name,
          subtitle: ex.duration_display,
        };
      }) || []
    );
  };

  // Gunakan useMemo agar tidak render ulang percuma
  const warmUpData = useMemo(
    () => getExercisesBySection(['WARM', 'WARM UP']),
    [currentDayDetail],
  );
  const mainWorkoutData = useMemo(
    () => getExercisesBySection(['WORKOUT', 'EXERCISE', 'MAIN']),
    [currentDayDetail],
  );
  const coolDownData = useMemo(
    () => getExercisesBySection(['COOL', 'COOL DOWN']),
    [currentDayDetail],
  );

  const workoutType = useMemo(() => {
    const title = currentDayDetail?.title || '';
    if (title.toUpperCase().includes('UPPER')) return 'Upper Body';
    if (title.toUpperCase().includes('LOWER')) return 'Lower Body';
    return 'Full Body';
  }, [currentDayDetail]);

  return {
    loading,
    scheduleSummary,
    currentDayDetail,
    warmUpData,
    mainWorkoutData,
    coolDownData,
    workoutType,
    refetch: fetchData,
  };
};
