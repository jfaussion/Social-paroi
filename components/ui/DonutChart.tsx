"use client"
import { useEffect, useRef } from "react";

const DonutChart = ({ percentage, bgColorClass = 'bg-gray-200', donutColor = '#22C55E' }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;
    let start = 0;
    const duration = 1000; // animation duration in ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentPercentage = start + progress * (percentage - start);
      chart.style.setProperty('--percentage', currentPercentage);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  return (
    <div
      ref={chartRef}
      className={`donut-chart ${bgColorClass}`}
      style={{
        '--target-percentage': percentage,
        '--donut-color': donutColor,
      }}
    >
      <div className={`donut-chart-center ${bgColorClass}`}></div>
    </div>
  );
};

export default DonutChart;

