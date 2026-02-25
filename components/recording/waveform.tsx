import { Dimensions, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

type Props = {
  levels: number[];
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const height = 100;
const barWidth = 4;
const width = SCREEN_WIDTH;
const gap = 3;

export default function Waveform({ levels }: Props) {
  const totalBarsWidth = levels.length * (barWidth + gap) - gap;

  const startX = (width - totalBarsWidth) / 2;
  return (
    <View style={{ marginBottom: 24, alignItems: "center" }}>
      <Svg width={width} height={height}>
        {levels.map((level, i) => {
          const barHeight = level * height;
          return (
            <Rect
              key={i}
              //   x={i * (barWidth + gap)}
              x={startX + i * (barWidth + gap)}
              y={(height - barHeight) / 2}
              width={barWidth}
              height={barHeight}
              rx={2}
              fill="#ddd"
            />
          );
        })}
      </Svg>
    </View>
  );
}
