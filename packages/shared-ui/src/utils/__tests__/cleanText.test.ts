import { cleanText } from '../cleanText';

describe('cleanText', () => {
  test.each([
    [undefined, ''],
    ['&nbsp;', ' '],
    ['something&nbsp;somethingElse&nbsp;', 'something somethingElse '],
    ['&amp;', '&'],
    ['something &amp; somethingElse &amp;', 'something & somethingElse &'],
    ['&pound;', '£'],
    ['something &pound; somethingElse &pound;', 'something £ somethingElse £'],
    ['something&nbsp;&amp;&nbsp;&pound;somethingElse', 'something & £somethingElse'],
  ])('if receives "%s", should return "%s"', (input, expected) => {
    expect(cleanText(input)).toBe(expected);
  });
});
