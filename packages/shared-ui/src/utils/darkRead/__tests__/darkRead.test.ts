import * as target from '../darkRead';

const currentFunction = jest.fn();
const experimentFunction = jest.fn();

describe('darkRead', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    currentFunction.mockReturnValue('current');
    experimentFunction.mockReturnValue('experiment');
  });

  it.each([true, false])(
    'should call and await experiment function only if "experiment" is enabled',
    async (darkReadEnabled) => {
      const options = { darkReadEnabled, experimentEnabled: true };

      const result = await target.darkRead(options, currentFunction, experimentFunction);

      expect(result).toBe('experiment');
      expect(currentFunction).not.toHaveBeenCalled();
      expect(experimentFunction).toHaveBeenCalled();
    },
  );

  it('should call both functions, returning the results of current if "darkRead" is enabled & "experiment" is disabled', async () => {
    const options = { darkReadEnabled: true, experimentEnabled: false };

    const result = await target.darkRead(options, currentFunction, experimentFunction);

    expect(result).toBe('current');
    expect(currentFunction).toHaveBeenCalled();
    expect(experimentFunction).toHaveBeenCalled();
  });

  it('should call and await current function only if "darkRead" is disabled & "experiment" is disabled', async () => {
    const options = { darkReadEnabled: false, experimentEnabled: false };

    const result = await target.darkRead(options, currentFunction, experimentFunction);

    expect(result).toBe('current');
    expect(currentFunction).toHaveBeenCalled();
    expect(experimentFunction).not.toHaveBeenCalled();
  });
});
