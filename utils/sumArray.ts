export default function sumArray(array: number[]): number {
  return array.reduce((acc, cur) => acc + cur, 0);
}
