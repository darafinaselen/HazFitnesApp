import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

const DEFAULT_COLOR = '#0A659A';
const DARK_COLOR = '#0B2D46';

interface IconProps {
  color?: string;
  size?: number;
}

export const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={DARK_COLOR}
    />
  </Svg>
);

export const StatsIconBig: React.FC<IconProps> = ({ size = 100 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Path
      d="M45.8334 50.0002C45.8334 51.1052 46.2724 52.165 47.0538 52.9464C47.8352 53.7278 48.895 54.1668 50 54.1668C51.1051 54.1668 52.1649 53.7278 52.9463 52.9464C53.7277 52.165 54.1667 51.1052 54.1667 50.0002C54.1667 48.8951 53.7277 47.8353 52.9463 47.0539C52.1649 46.2725 51.1051 45.8335 50 45.8335C48.895 45.8335 47.8352 46.2725 47.0538 47.0539C46.2724 47.8353 45.8334 48.8951 45.8334 50.0002Z"
      stroke="#0A659A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M70.5166 46.3834C69.8014 42.3255 67.8989 38.5708 65.0497 35.5942C62.2005 32.6175 58.5326 30.5526 54.5099 29.6606C50.4871 28.7685 46.2902 29.0894 42.4498 30.5826C38.6094 32.0759 35.298 34.6744 32.9345 38.0495C30.5709 41.4247 29.2613 45.425 29.1712 49.5445C29.0812 53.664 30.2147 57.7177 32.4285 61.1929C34.6423 64.6682 37.8369 67.4089 41.6084 69.0685C45.3798 70.7282 49.5588 71.2322 53.6166 70.5168"
      stroke="#0A659A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 50C12.5 57.4168 14.6993 64.667 18.8199 70.8339C22.9404 77.0007 28.7971 81.8072 35.6494 84.6455C42.5016 87.4838 50.0416 88.2264 57.3159 86.7794C64.5902 85.3325 71.272 81.761 76.5165 76.5165C81.761 71.272 85.3325 64.5902 86.7794 57.3159C88.2264 50.0416 87.4838 42.5016 84.6455 35.6494C81.8072 28.7971 77.0007 22.9404 70.8339 18.8199C64.667 14.6993 57.4168 12.5 50 12.5"
      stroke="#0A659A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronRight: React.FC<IconProps> = ({
  color = DARK_COLOR,
  size = 20,
}) => (
  <Svg width={size} height={size * 2} viewBox="0 0 20 40" fill="none">
    <Path
      d="M4.08664 10.9669L5.85498 9.20023L15.4866 18.8286C15.6419 18.9828 15.7651 19.1663 15.8492 19.3684C15.9333 19.5705 15.9766 19.7872 15.9766 20.0061C15.9766 20.2249 15.9333 20.4417 15.8492 20.6437C15.7651 20.8458 15.6419 21.0293 15.4866 21.1836L5.85498 30.8169L4.08831 29.0502L13.1283 20.0086L4.08664 10.9669Z"
      fill={color}
    />
  </Svg>
);

export const EditIcon: React.FC<IconProps> = ({
  color = DEFAULT_COLOR,
  size = 25,
}) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
    <G clipPath="url(#clip0_124_4926)">
      <Path
        d="M23.2671 0.810351C22.1866 -0.270117 20.4401 -0.270117 19.3596 0.810351L18.1558 2.01416L22.9858 6.8442L24.1896 5.64039C25.2701 4.55992 25.2701 2.81341 24.1896 1.73294L23.2671 0.810351ZM8.5056 11.6644C8.20465 11.9653 7.97277 12.3353 7.83956 12.7448L6.3792 17.1259C6.23612 17.5502 6.3496 18.0189 6.66535 18.3396C6.9811 18.6603 7.4498 18.7688 7.87903 18.6257L12.2601 17.1654C12.6647 17.0322 13.0347 16.8003 13.3406 16.4993L21.3133 8.5167L16.4833 3.68666L8.5056 11.6644ZM4.7363 2.89728C2.12147 2.89728 0 5.01875 0 7.63358V20.2637C0 22.8785 2.12147 25 4.7363 25H17.3664C19.9813 25 22.1027 22.8785 22.1027 20.2637V15.5274C22.1027 14.6542 21.3972 13.9486 20.524 13.9486C19.6507 13.9486 18.9452 14.6542 18.9452 15.5274V20.2637C18.9452 21.137 18.2397 21.8425 17.3664 21.8425H4.7363C3.86304 21.8425 3.15753 21.137 3.15753 20.2637V7.63358C3.15753 6.76032 3.86304 6.05481 4.7363 6.05481H9.47259C10.3458 6.05481 11.0514 5.3493 11.0514 4.47605C11.0514 3.60279 10.3458 2.89728 9.47259 2.89728H4.7363Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_124_4926">
        <Rect width="25" height="25" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const ReminderIcon: React.FC<IconProps> = ({
  color = DEFAULT_COLOR,
  size = 25,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C10.9 2 10 2.9 10 4V4.29C7.03 4.99 5 7.57 5 10V16L3.71 17.29C3.08 17.92 3.52 19 4.41 19H19.58C20.47 19 20.92 17.92 20.29 17.29L19 16V10C19 7.57 16.97 4.99 14 4.29V4C14 2.9 13.11 2 12 2ZM10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20H10Z"
      fill={color}
    />
  </Svg>
);

export const FeedbackIcon: React.FC<IconProps> = ({
  color = DEFAULT_COLOR,
  size = 25,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z"
      fill={color}
    />
  </Svg>
);

export const LogoutIcon: React.FC<IconProps> = ({
  color = DEFAULT_COLOR,
  size = 25,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
      fill={color}
    />
  </Svg>
);
