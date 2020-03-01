import { turnNumbersIntoString, turnTimesIntoNumbers } from "./TrackOptions";

describe("turnNumbersIntoString", () => {
  it("should turn numbers with length one into string", () => {
    let arr = [0, 1, 2, 3];
    let str = turnNumbersIntoString(arr, 1);
    expect(str).toBe("0, 1, 2, 3");
  });
  it("should turn numbers with length 2 into string", () => {
    let arr = [0, 1, 2, 3];
    let str = turnNumbersIntoString(arr, 2);
    expect(str).toBe("0 1, 2 3");
  });
  it("should turn numbers with length 4 into string", () => {
    let arr = [0, 1, 2, 3, 5, 6, 8, 9];
    let str = turnNumbersIntoString(arr, 4);
    expect(str).toBe("0 1 2 3, 5 6 8 9");
  });
  it("should turn numbers with length 5 into string", () => {
    let arr = [0, 1, 2, 3, 5, 6, 8, 9, 1, 1, 5];
    let str = turnNumbersIntoString(arr, 5);
    expect(str).toBe("0 1 2 3 5, 6 8 9 1 1, 5");
  });
});

describe("turnTimesIntoNumbers", () => {
  it("should turn length 1 string of 1 elements into numbers", () => {
    let str = "0";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0]);
  });
  it("should turn length 1 string of 5 elements into numbers", () => {
    let str = "0, 1, 2, 3, 4";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0, 1, 2, 3, 4]);
  });
  it("should turn length 2 string of 4 elements into numbers", () => {
    let str = "0 1, 2 3";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0, 1, 2, 3]);
  });
  it("should turn length 2 string of 11 elements into numbers", () => {
    let str = "0 1b 2 3y 4 5/ 6 7_ 8 9. 10";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
