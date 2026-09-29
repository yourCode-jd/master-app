
export function goalProgress(start: number | null, target: number | null, current: number | null) {
  if (start === null || target === null || current === null || start === target) return null;
  const ratio = (current - start) / (target - start);
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

export function metricTrend(values: number[]) {
  if (values.length < 2) return "Not enough history";
  const delta = values.at(-1)! - values[0];
  return delta > 0 ? `Up ${delta.toFixed(1)}` : delta < 0 ? `Down ${Math.abs(delta).toFixed(1)}` : "Stable";
}
