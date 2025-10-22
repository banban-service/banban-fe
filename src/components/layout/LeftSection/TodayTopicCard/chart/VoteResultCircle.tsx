// import { CHART_CONFIG } from "@/constants/chart";
// import { calculateTextPosition } from "@/lib/chart";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import PercentageTexts from "./PercentageTexts";
// import ChartGradients from "./ChartGradients";
// import { useId } from "react";

// export type PieData = {
//   option: string;
//   count: number;
//   userSelected: boolean;
//   percent: number;
// };

// const { dimensions, outerRadius, angles, animation } = CHART_CONFIG;

// const VoteResultCircle = ({ pieData }: { pieData: PieData[] }) => {
//   const [showStroke, setShowStroke] = useState(false);

//   const textPositions = useMemo(
//     () => calculateTextPosition(pieData),
//     [pieData],
//   );

//   const uniqueId = useId();

//   const colors = useMemo(
//     () => ({
//       normal: [
//         `url(#${uniqueId}-pinkGradient)`,
//         `url(#${uniqueId}-blueGradient)`,
//       ],
//       highlight: [
//         `url(#${uniqueId}-pinkGradientStrong)`,
//         `url(#${uniqueId}-blueGradientStrong)`,
//       ],
//     }),
//     [uniqueId],
//   );

//   const renderCell = useCallback(
//     (entry: PieData, index: number) => {
//       const isUserSelected = entry.userSelected;
//       const shouldHighlight = isUserSelected && showStroke;
//       const shouldShowStroke =
//         isUserSelected && entry.percent !== 100 && showStroke;

//       const fillColor = shouldHighlight
//         ? colors.highlight[index % colors.highlight.length]
//         : colors.normal[index % colors.normal.length];

//       return (
//         <Cell
//           key={`cell-${entry.option}-${index}`}
//           fill={fillColor}
//           stroke={shouldShowStroke ? "#fff" : "none"}
//           strokeWidth={shouldShowStroke ? 8 : 0}
//           filter="url(#shadow)"
//           style={{
//             transition: "fill 0.5s ease-in-out",
//             willChange: "fill",
//           }}
//         />
//       );
//     },
//     [showStroke, colors],
//   );

//   useEffect(() => {
//     const timer = setTimeout(() => setShowStroke(true), animation.strokeDelay);
//     return () => clearTimeout(timer);
//   }, []);

//   if (!pieData.length) {
//     return (
//       <div
//         style={{
//           width: dimensions.width,
//           height: dimensions.height,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "white",
//           fontSize: 16,
//         }}
//       >
//         데이터가 없습니다
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         width: dimensions.width,
//         height: dimensions.height,
//         position: "relative",
//       }}
//     >
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart style={{ pointerEvents: "none" }}>
//           <ChartGradients uniqueId={uniqueId} />
//           <Pie
//             data={pieData}
//             cx="50%"
//             cy="50%"
//             dataKey="count"
//             startAngle={angles.start}
//             endAngle={angles.end}
//             outerRadius={outerRadius}
//             innerRadius={0}
//             stroke="none"
//             strokeWidth={0}
//             animationBegin={0}
//             animationDuration={animation.duration}
//           >
//             {pieData.map(renderCell)}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>

//       {/* stroke 보여질때 같이 보여지기 */}
//       {showStroke && (
//         <PercentageTexts pieData={pieData} textPositions={textPositions} />
//       )}
//     </div>
//   );
// };

// export default VoteResultCircle;

import { CHART_CONFIG } from "@/constants/chart";
import { calculateTextPosition } from "@/lib/chart";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PercentageTexts from "./PercentageTexts";
import ChartGradients from "./ChartGradients";
import { useId } from "react";

export type PieData = {
  option: string;
  count: number;
  userSelected: boolean;
  percent: number;
};

// + (추가) renderCell의 entry 타입에 originalIndex 추가
type PieDataWithIndex = PieData & { originalIndex: number };

const { dimensions, outerRadius, angles, animation } = CHART_CONFIG;

const VoteResultCircle = ({ pieData }: { pieData: PieData[] }) => {
  const [showStroke, setShowStroke] = useState(false);

  const uniqueId = useId();

  const colors = useMemo(
    () => ({
      normal: [
        `url(#${uniqueId}-pinkGradient)`,
        `url(#${uniqueId}-blueGradient)`,
      ],
      highlight: [
        `url(#${uniqueId}-pinkGradientStrong)`,
        `url(#${uniqueId}-blueGradientStrong)`,
      ],
    }),
    [uniqueId],
  );

  // 2. z-index를 위해 데이터를 정렬 (이전과 동일)
  const sortedData = useMemo(() => {
    return pieData
      .map((d, i) => ({ ...d, originalIndex: i })) // 2a. 원래 인덱스 추가
      .sort((a, b) => {
        // 2b. 정렬
        const aWillHaveStroke = a.userSelected && a.percent !== 100;
        const bWillHaveStroke = b.userSelected && b.percent !== 100;

        if (aWillHaveStroke && !bWillHaveStroke) return 1;
        if (!aWillHaveStroke && bWillHaveStroke) return -1;
        return 0;
      });
  }, [pieData]);

  // 1. 원본 데이터 기준 텍스트 위치 계산 (변경 없음)
  const textPositions = useMemo(
    () => calculateTextPosition(sortedData),
    [sortedData],
  );

  const renderCell = useCallback(
    (entry: PieDataWithIndex) => {
      const isUserSelected = entry.userSelected;
      const shouldHighlight = isUserSelected && showStroke;
      const shouldShowStroke =
        isUserSelected && entry.percent !== 100 && showStroke;

      const colorIndex = entry.originalIndex; // 원본 인덱스로 색상 매핑

      const fillColor = shouldHighlight
        ? colors.highlight[colorIndex % colors.highlight.length]
        : colors.normal[colorIndex % colors.normal.length];

      return (
        <Cell
          key={`cell-${entry.option}-${entry.originalIndex}`}
          fill={fillColor}
          stroke={shouldShowStroke ? "#fff" : "none"}
          strokeWidth={shouldShowStroke ? 8 : 0}
          filter="url(#shadow)"
          style={{
            transition: "fill 0.5s ease-in-out",
            willChange: "fill",
          }}
        />
      );
    },
    [showStroke, colors],
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowStroke(true), animation.strokeDelay);
    return () => clearTimeout(timer);
  }, []);

  if (!pieData.length) {
    return (
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 16,
        }}
      >
        데이터가 없습니다
      </div>
    );
  }

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart style={{ pointerEvents: "none" }}>
          <ChartGradients uniqueId={uniqueId} />
          <Pie
            data={sortedData} // 4. 정렬된 데이터 사용 (이전과 동일)
            cx="50%"
            cy="50%"
            dataKey="count"
            startAngle={angles.start}
            endAngle={angles.end}
            outerRadius={outerRadius}
            innerRadius={0}
            stroke="none"
            strokeWidth={0}
            animationBegin={0}
            animationDuration={animation.duration}
          >
            {sortedData.map(renderCell)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* stroke 보여질때 같이 보여지기 */}
      {showStroke && (
        // + 5. (수정) PercentageTexts에 정렬된 데이터와 정렬된 위치 전달
        <PercentageTexts pieData={sortedData} textPositions={textPositions} />
      )}
    </div>
  );
};

export default VoteResultCircle;
