import { MOCK_RIDE } from "../../mocks/ride";
import { interpolate } from "./ride-helpers";

describe('ride-helper', () => {
  
  describe('interpolate', () => {
    it('should return the same array if no need to interpolate', () => {
      const logs = MOCK_RIDE.logs.slice(0, 400);
      expect(interpolate(logs)).toEqual(logs);
    });

    it('should interpolate the big array', () => {
      const logs = MOCK_RIDE.logs;
      const interpolated = interpolate(logs);
      expect(interpolated.length).toBeLessThan(1000);
    });
  });

});
