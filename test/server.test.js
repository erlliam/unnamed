let { validExpirationMinutes, validVideo } = require("../src/server");

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

describe("validVideo", () => {
  test.each([
    ["/", false],
    [undefined, false],
    [{}, false],
    [10, false],
    ["test/bezos.png", false],
    ["~", false],
    ["test/2021-08-30 23-40-37.mkv", true],
    ["test/SampleVideo_1280x720_30mb.mp4", true],
  ])("%p returns %p", (path, expected) => {
    return validVideo(path).then((result) => {
      expect(result).toBe(expected);
    });
  });
});
