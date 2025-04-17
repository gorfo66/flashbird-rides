import { average, degreesToRadians, max } from "./data-helpers";

describe('data-helper', () => {
  
  describe('average', () => {
    it('should return the average value of the array', () => {
      const array = [1, 2, 3];
      expect(average(array)).toEqual(2);
    });

    it('should return NaN if no array provided', () => {
      expect(average(undefined)).toEqual(NaN);
    });
  });

  describe('degreesToRadian', () => {
    it('should convert degre to radian', () => {
      expect(degreesToRadians(0)).toEqual(0);
      expect(degreesToRadians(90)).toEqual(Math.PI / 2);
      expect(degreesToRadians(180)).toEqual(Math.PI);
    });
  });

  describe('max', () => {
    it('should return the average value of the array', () => {
      const array = [1, 2, 3];
      expect(max(array)).toEqual(3);
    });

    it('should return NaN if no array provided', () => {
      expect(max(undefined)).toEqual(NaN);
    });
  });
});
