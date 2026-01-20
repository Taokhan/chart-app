import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartConfiguration,
  Plugin,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dragDataPlugin from "chartjs-plugin-dragdata";
import { generateEcgBpData, ChartPoint, ChartDataset } from "../data/generate.data";
import "./chart.css";

// Dark background plugin
export const darkBackgroundPlugin: Plugin = {
  id: "darkBackground",
  beforeDraw: (chart) => {
    const { ctx, width, height } = chart;
    ctx.save();
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  },
};

Chart.register(
  zoomPlugin,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
  dragDataPlugin,
  darkBackgroundPlugin,
);

const ChartPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);

  const rawDatasets = useRef<ChartDataset[]>(generateEcgBpData(10, 5));

  const styledDatasets = rawDatasets.current.map((ds) => {
    if (ds.label === "ECG") {
      return {
        ...ds,
        yAxisID: "y",
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.15)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: (ctx: any) => {
          const point = ctx.raw as ChartPoint;
          if (!point) return 0;
          return point.R || point.F ? 3 : 0;
        },
        pointBackgroundColor: (ctx: any) => {
          const point = ctx.raw as ChartPoint;
          if (!point) return "#38bdf8";
          if (point.R) return "#f87171";
          if (point.F) return "#bbd334ff";
          return "#38bdf8";
        },
        pointHoverRadius: 6,
      };
    }
    if (ds.label === "BP") {
      return {
        ...ds,
        yAxisID: "y2",
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167,139,250,0.15)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      };
    }
    return ds;
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: {
        datasets: styledDatasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: "linear", min: 0, max: 10, title: { display: true, text: "Time (s)" } },
          y: { min: -1, max: 1, position: "left", title: { display: true, text: "ECG (mV)" } },
          y2: { min: 60, max: 120, position: "right", title: { display: true, text: "BP (mmHg)" } },
        },
        plugins: {
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const point = tooltipItem.raw as ChartPoint;
                if (!point) return "";
                if (point.R) return `R detected at ${point.x}s`;
                if (point.F) return `F detected at ${point.x}s`;
                return `Value: ${point.y}`;
              },
            },
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "xy",
              modifierKey: "ctrl",
            },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "xy",
            },
            limits: {
              x: { min: 0, max: 10 },
              y: { min: -2, max: 2 },
              y2: { min: 50, max: 150 },
            },
          },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);

    return () => chartRef.current?.destroy();
  }, []);

useEffect(() => {
  if (!chartRef.current) return;

  if (!isPlaying) {
    chartRef.current.data.datasets = styledDatasets;
    chartRef.current.update();
    setPlayIndex(0);
    return;
  }

  const animatedDatasets = styledDatasets.map(ds => ({
    ...ds,
    data: [],
  }));

  chartRef.current.data.datasets = animatedDatasets;
  chartRef.current.update();

  const maxIndex = rawDatasets.current[0].data.length;
  const interval = setInterval(() => {
    setPlayIndex(prev => {
      const next = prev + 1;
      if (next >= maxIndex) {
        clearInterval(interval);
        return prev;
      }

      chartRef.current!.data.datasets!.forEach((dataset, idx) => {
        dataset.data.push(rawDatasets.current[idx].data[next]);
      });

      chartRef.current!.update("none");
      return next;
    });
  }, 10);

  return () => clearInterval(interval);

}, [isPlaying, styledDatasets]);


  useEffect(() => {
    if (!isPlaying && chartRef.current) {
      chartRef.current.data.datasets = styledDatasets;
      chartRef.current.update();
      setPlayIndex(0);
    }
  }, [isPlaying, styledDatasets]);
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#0b1220" }}>
      <canvas ref={canvasRef} />
      <button
        onClick={() => chartRef.current?.resetZoom()}
        style={{ position: "absolute", top: 10, left: 10, zIndex: 10, padding: "6px 12px", borderRadius: 4, border: "none", backgroundColor: "#38bdf8", color: "#fff", cursor: "pointer" }}
      >
        Reset Zoom
      </button>
      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        style={{ position: "absolute", top: 50, left: 10, zIndex: 10, padding: "6px 12px", borderRadius: 4, border: "none", backgroundColor: isPlaying ? "#f87171" : "#38bdf8", color: "#fff", cursor: "pointer" }}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
    </div>
  );
};

export default ChartPage;
