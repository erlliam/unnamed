let { validExpirationMinutes, validVideo } = require("../src/server");

describe("validExpirationMinutes", () => {
  test.each([
    ["10", true],
    ["30", true],
    ["0", false],
    ["1239", false],
    ["Hello", false],
    [undefined, false],
  ])("%p returns %p", (expirationMinutes, expected) => {
    expect(validExpirationMinutes(expirationMinutes)).toBe(expected);
  });
});

describe("validVideo", () => {
  test.each([
    ["test/2021-08-30 23-40-37.mkv", true],
    ["test/SampleVideo_1280x720_30mb.mp4", true],
    ["/", false],
    ["~", false],
    ["test/bezos.png", false],
    [undefined, false],
  ])("%p returns %p", (path, expected) => {
    return validVideo(path).then((result) => {
      expect(result).toBe(expected);
    });
  });
});
