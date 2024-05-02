export default function getBatteryPercentage(voltage: number) {
  const emptyLevel = 11
  const fullLevel = 13

  const level = (voltage - emptyLevel) / (fullLevel - emptyLevel)

  return level * 100
}
