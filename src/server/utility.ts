import { Logger } from 'tslog';

export const firstLetterToUpperCase = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const log: Logger = new Logger();

export default {
  firstLetterToUpperCase,
  log,
};
