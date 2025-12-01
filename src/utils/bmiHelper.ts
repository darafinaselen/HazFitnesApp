export type BmiLevel = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export interface BmiResult {
  bmiValue: number;
  level: BmiLevel;
}

export const calculateBMI = (
  weightKg: number,
  heightCm: number,
): BmiResult | null => {
  if (weightKg <= 0 || heightCm <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const bmiValue = parseFloat(bmi.toFixed(2));

  let level: BmiLevel;

  if (bmiValue < 18.5) {
    level = 'Underweight';
  } else if (bmiValue < 25) {
    level = 'Normal';
  } else if (bmiValue < 30) {
    level = 'Overweight';
  } else {
    level = 'Obese';
  }

  return { bmiValue, level };
};
