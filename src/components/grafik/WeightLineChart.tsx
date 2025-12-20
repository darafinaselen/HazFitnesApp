import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { FONT_FAMILY } from '../../constants/fonts';
import color from '../../constants/color';

interface DataPoint {
  value: number;
  label?: string;
  dataPointText?: string;
}

interface WeightLineChartProps {
  data: DataPoint[];
  isMini?: boolean;
  width?: number;
}

const WeightLineChart: React.FC<WeightLineChartProps> = ({
  data,
  isMini = true,
  width,
}) => {
  const screenWidth = Dimensions.get('window').width;

  // 1. Handle Data Kosong
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={{ color: '#ccc' }}>No Data Available</Text>
      </View>
    );
  }

  // 2. Hitung Nilai Min/Max/Avg
  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  let averageVal = values.reduce((a, b) => a + b, 0) / values.length;
  if (isNaN(averageVal)) averageVal = 0;

  // 3. Scale Y-Axis (Dinamis & Rapi)
  const yAxisOffset = Math.floor(minVal - 1);
  const maxValue = Math.ceil(maxVal) - yAxisOffset + 0.5;
  const sections = 4;
  const stepValue = maxValue / sections;

  // 4. Width & Spacing Logic
  const availableWidth = width || screenWidth - 60;
  const chartWidth = isMini ? availableWidth - 50 : availableWidth;

  let spacing;
  let initialSpacing;

  if (isMini) {
    spacing = chartWidth / data.length - 10;
    initialSpacing = 20;
  } else {
    spacing = 130;
    initialSpacing = 40;
  }

  const finalData = data.map(item => ({
    ...item,
    dataPointLabelComponent: () => (
      <View style={styles.dataLabelBubble}>
        <Text style={styles.dataLabelText} numberOfLines={1}>
          {item.value.toFixed(2)}
        </Text>
      </View>
    ),
    dataPointLabelShiftY: -30,
    dataPointLabelShiftX: -8,
  }));

  const chartConfig = isMini
    ? {
        width: chartWidth,
        scrollable: false,
        spacing: spacing,
      }
    : {
        width: availableWidth,
        scrollable: true,
        spacing: spacing,
      };

  return (
    <View style={[styles.container, { paddingTop: isMini ? 10 : 40 }]}>
      <LineChart
        data={finalData}
        areaChart
        curved
        isAnimated
        animationDuration={1200}
        {...chartConfig}
        initialSpacing={30}
        endSpacing={50}
        formatYLabel={label => parseFloat(label).toFixed(2)}
        // --- STYLE GARIS UTAMA ---
        color="#1697D4"
        thickness={3}
        startFillColor="#1697D4"
        endFillColor="#1697D4"
        startOpacity={0.15}
        endOpacity={0.01}
        // --- REFERENCE LINE (BIRU PUTUS-PUTUS) ---
        showReferenceLine1={true}
        referenceLine1Position={averageVal}
        referenceLine1Config={{
          color: '#1697D4',
          dashWidth: 4,
          dashGap: 4,
          thickness: 1,
          type: 'dashed',
        }}
        // --- SUMBU Y ---
        hideYAxisText={false}
        yAxisOffset={yAxisOffset}
        maxValue={maxValue}
        noOfSections={sections}
        stepValue={stepValue}
        yAxisTextStyle={styles.axisText}
        yAxisLabelWidth={45}
        yAxisThickness={0}
        // --- SUMBU X ---
        xAxisThickness={0}
        xAxisLabelTextStyle={[styles.axisText, { marginTop: 6 }]}
        // --- GRID BACKGROUND ---
        rulesType="solid"
        rulesColor="#F7F7F7"
        // --- TITIK (DONUT STYLE) ---
        dataPointsColor="#FFFFFF"
        dataPointsRadius={5}
        dataPointsWidth={11}
        customDataPoint={() => <View style={styles.donutPoint} />}
        // --- TOOLTIP ---
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: '#E0E0E0',
          pointerStripWidth: 1,
          pointerColor: '#1697D4',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: (items: any) => {
            return (
              <View style={styles.tooltipContainer}>
                <Text style={styles.tooltipText}>
                  {items[0].value.toFixed(2)} kg
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 15,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  emptyContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPoint: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#1697D4',
    borderRadius: 6,
  },
  dataLabelBubble: {
    backgroundColor: '#E1F2FD',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataLabelText: {
    color: color.text,
    fontSize: 10,
    fontFamily: FONT_FAMILY.MontserratBold,
    textAlign: 'center',
    width: '100%',
  },
  axisText: {
    color: '#A0A0A0',
    fontSize: 10,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
  tooltipContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#333333',
    borderRadius: 20,
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FONT_FAMILY.MontserratBold,
  },
});

export default WeightLineChart;
