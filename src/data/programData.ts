import { ProgramDay } from '../types/programTypes';

const workoutThumb = require('../assets/images/splash.png');

export const getProgramDataByLevel = (levelId: string): ProgramDay[] => {
  const prefix =
    levelId === 'advanced' ? 'ADV' : levelId === 'intermediet' ? 'INT' : '';
  const durationMultiplier = levelId === 'advanced' ? 2 : 1;
  return [
    {
      id: 1,
      dayTitle: `HARI 1: ${prefix} UPPER BODY`,
      subtitle: `${18 * durationMultiplier} Minutes • 6 Exercises`,
      warmUp: [
        {
          id: '1w1',
          name: 'JUMPING JACKS',
          duration: 30,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Berdiri tegak dengan kaki rapat dan tangan di samping.\n2. Lompat sambil membuka kaki dan angkat tangan ke atas kepala.\n3. Lompat lagi untuk kembali ke posisi awal.\n4. Ulangi dengan ritme yang stabil.',
        },
        {
          id: '1w2',
          name: 'ARM CIRCLES',
          duration: 30,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
      exercises: [
        {
          id: '1e1',
          name: 'PUSH UPS',
          duration: '45',
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
        {
          id: '1e2',
          name: 'CHEST PRESS',
          duration: 45,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
      coolDown: [
        {
          id: '1c1',
          name: 'ARM STRETCH',
          duration: 30,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
    },
    {
      id: 2,
      dayTitle: `HARI 2: ${prefix} LOWER BODY`,
      subtitle: `${20 * durationMultiplier} Minutes • 8 Exercises`,
      warmUp: [
        {
          id: '2w1',
          name: 'HIGH KNEES',
          duration: 40,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
      exercises: [
        {
          id: '2e1',
          name: 'SQUATS',
          duration: 45,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
        {
          id: '2e2',
          name: 'LUNGES',
          duration: 40,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
      coolDown: [
        {
          id: '2c1',
          name: 'QUAD STRETCH',
          duration: 40,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
    },
    {
      id: 3,
      dayTitle: `HARI 3: ${prefix} FULL BODY`,
      subtitle: `${20 * durationMultiplier} 25 Minutes • 10 Exercises`,
      warmUp: [
        {
          id: '3w1',
          name: 'JUMP ROPE',
          duration: 60,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
      exercises: [
        {
          id: '3e1',
          name: 'BURPEES',
          duration: 40,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
        {
          id: '3e2',
          name: 'MOUNTAIN CLIMBERS',
          duration: 30,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
        {
          id: '3e3',
          name: 'PLANK',
          duration: 60,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
      coolDown: [
        {
          id: '3c1',
          name: 'CHILD POSE',
          duration: 60,
          image: workoutThumb,
          video: {
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          description:
            '1. Rentangkan tangan ke samping setinggi bahu.\n2. Putar lengan membentuk lingkaran kecil ke depan.\n3. Pertahankan siku tetap lurus.\n4. Setelah 15 detik, putar ke arah sebaliknya.',
        },
      ],
    },
  ];
};
