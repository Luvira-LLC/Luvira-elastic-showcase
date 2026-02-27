export const toPercentage = (
  value: number,
  fractionDigits: number = 0,
): string => {
  if (!Number.isFinite(value)) return "0%";

  const percentageValue = value * 100;

  return `${percentageValue.toFixed(fractionDigits)}%`;
};
