import { StartCasePipe } from './start-case.pipe';

describe('StartCasePipe', () => {

  it('should return the startCase representation with spaces of a camelCase string', () => {
    const pipe = new StartCasePipe();
    expect(pipe.transform("camelCase")).toEqual("Camel Case");
  });
});
