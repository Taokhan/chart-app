export type ChartPoint = { x: number; y: number; R?: boolean; F?: boolean };

export interface ChartDataset {
  label: string;
  axis: "y" | "y2";
  data: ChartPoint[];
}

export function generateEcgBpData(durationSeconds: number, stepMs: number): ChartDataset[] {
  const points = Math.floor((durationSeconds * 1000) / stepMs);
  const ecgData: ChartPoint[] = [];
  const bpData: ChartPoint[] = [];

  for (let i = 0; i <= points; i++) {
    const t = i * (stepMs / 1000);

    const ecg = Math.sin(2 * Math.PI * 1 * t) * 0.5 + Math.sin(2 * Math.PI * 5 * t) * 0.1;
    const bp = 80 + 20 * Math.sin(2 * Math.PI * 1.2 * t) + Math.random() * 2;

    const R = Math.random() < 0.1;
    const F = Math.random() < 0.1;

    ecgData.push({ x: parseFloat(t.toFixed(3)), y: parseFloat(ecg.toFixed(3)), R, F });
    bpData.push({ x: parseFloat(t.toFixed(3)), y: parseFloat(bp.toFixed(1)) });
  }

  return [
    { label: "ECG", axis: "y", data: ecgData },
    { label: "BP", axis: "y2", data: bpData }
  ];
}
