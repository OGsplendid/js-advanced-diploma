import { calcTileType } from '../utils';

test.each([
  [0, 8, 'top-left'],
  [7, 8, 'top-right'],
  [12, 8, 'center'],
  [24, 8, 'left'],
  [31, 8, 'right'],
  [56, 8, 'bottom-left'],
  [63, 8, 'bottom-right'],
  [12, 5, 'center'],
  [73, 8, 'invalid value'],
])('.add(%i, %i)', (a, b, expected) => {
  expect(calcTileType(a, b)).toBe(expected);
});
