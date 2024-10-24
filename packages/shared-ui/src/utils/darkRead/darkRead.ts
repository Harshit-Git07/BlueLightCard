import { Logger } from '../../logger';

type DarkReadOptions = {
  darkReadEnabled: boolean;
  experimentEnabled: boolean;
};

const logger = new Logger();

// Ability to call both the current & experimental functions via enabling dark read. This allows for live traffic to be replicated across to experimental functions for analysis.
// Once experiment function is stable, it can be enabled explicitly and usage of the current function is removed.
export const darkRead = async <T>(
  options: DarkReadOptions,
  currentFunction: () => Promise<T>,
  experimentFunction: () => Promise<T>,
): Promise<T> => {
  if (options.experimentEnabled) {
    try {
      return await experimentFunction();
    } catch (error) {
      logger.error('Experiment function threw error', 'experiment', error);
      throw error;
    }
  }

  // Calls experiment function alongside current function & does not wait on result
  if (options.darkReadEnabled) {
    Promise.resolve(experimentFunction()).catch((error) => {
      logger.debug('Experiment function threw error with dark read enabled', 'experiment', error);
    });
  }

  return await currentFunction();
};
