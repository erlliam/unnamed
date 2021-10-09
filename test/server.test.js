let { validExpirationMinutes } = require("../src/server");

describe("validExpirationMinutes", () => {
  test.each([
    ["10", true],
    ["30", true],
    ["Hello", false],
    [undefined, false],
    [{}, false],
  ])("%p returns %p", (expirationMinutes, expected) => {
    expect(validExpirationMinutes(expirationMinutes)).toBe(expected);
  });
});
