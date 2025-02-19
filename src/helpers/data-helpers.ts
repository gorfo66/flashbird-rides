export const average = (arr: number[] | undefined): number => {
  if (arr) {
    return arr.reduce((a, b) => { return a + b }, 0) / arr.length;
  }

  console.error('no array');
  return NaN
}

export const degreesToRadians = (degrees: number) => {
  return degrees * Math.PI / 180;
}

export const max = (arr: number[] | undefined): number => {
  if (arr) {
    return Math.max(...arr);
  }

  return NaN
}