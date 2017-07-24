import { StartCasePipe } from './start-case.pipe';

describe('StartCasePipe', () => {
  describe('transform', () => {
    it('should capitalize the first letter of a string', () => {
      const pipe = new StartCasePipe();
      expect(pipe.transform("text")).toEqual("Text");
    });

    it('should insert a space before a capitalized letter in the string', () => {
      const pipe = new StartCasePipe();
      expect(pipe.transform("textOtherText")).toEqual("Text Other Text");
    });
  });
});
