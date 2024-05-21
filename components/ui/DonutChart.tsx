"use client"
import { CSSProperties, useEffect, useRef } from "react";


interface DonutChartProps {
  percentage: number;
  bgColorClass?: string;
  donutColor?: string;
}

const DonutChart = ({ percentage, bgColorClass = 'bg-gray-200', donutColor = '#22C55E' }: DonutChartProps) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current as HTMLElement | null;
    let start = 0;
    const duration = 1000; // animation duration in ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentPercentage = start + progress * (percentage - start);
      if (chart && chart.style) {
        chart.style.setProperty('--percentage', currentPercentage as unknown as string);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  return (
    <div
      ref={chartRef}
      className={`donut-chart ${bgColorClass}`}
      style={{
        '--target-percentage': percentage as any,
        '--donut-color': donutColor as any,
      } as CSSProperties}
    >
      <div className={`donut-chart-center ${bgColorClass}`}></div>
    </div>
  );
};

export default DonutChart;

