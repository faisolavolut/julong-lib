export const isStringEmpty = (input: string | null | undefined): boolean => {
  if (input === null || input === undefined) {
    return true;
  }
  return input.trim().length === 0;
};
export const empty = (input: string | null | undefined): boolean => {
  if (input === null || input === undefined) {
    return true;
  }
  return input.trim().length === 0;
};
