export interface errorIf {
  (fieldValue: string): boolean;
}

export const requiredInputHasNoValue: errorIf = (value) => value.length === 0;

export const isNot15CharactersLong: errorIf = (value) =>
  !value || value.length !== 15;

export const isNotHexadecimalString: errorIf = (value) =>
  value.match(/^[a-f0-9]+$/i) === null;
