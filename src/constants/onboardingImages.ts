const male = require('../assets/images/male.png');
const female = require('../assets/images/female.png');
const maleGain = require('../assets/images/male_weight_gain.png');
const femaleGain = require('../assets/images/female_weight_gain.png');
const maleLoss = require('../assets/images/male_weight_loss.png');
const femaleLoss = require('../assets/images/female_weight_loss.png');

export const onboardingImages = {
  gender: {
    male: male,
    female: female,
  },
  goal: {
    gain: {
      male: maleGain,
      female: femaleGain,
    },
    loss: {
      male: maleLoss,
      female: femaleLoss,
    },
  },
};
