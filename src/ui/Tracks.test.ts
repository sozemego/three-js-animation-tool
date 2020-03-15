import {
  stripValues,
  turnNumbersIntoString,
  turnTimesIntoNumbers,
  turnValuesIntoColors
} from "./Tracks";

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
  it("should turn string of 1 elements into numbers", () => {
    let str = "0";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0]);
  });
  it("should turn string of 5 elements into numbers", () => {
    let str = "0, 1, 2, 3, 4";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0, 1, 2, 3, 4]);
  });
  it("should turn string of 4 elements into numbers", () => {
    let str = "0 1, 2 3";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0, 1, 2, 3]);
  });
  it("should turn string of 10 elements into numbers", () => {
    let str = "0,1,2,3,4,5,5.5,6.6,7.7,8.8,9.9";
    let numbers = turnTimesIntoNumbers(str);
    expect(numbers).toStrictEqual([0, 1, 2, 3, 4, 5, 5.5, 6.6, 7.7, 8.8, 9.9]);
  });
});

describe("turnValuesIntoColors", () => {
  it("should turn numbers into numbers", () => {
    let str = "1 1 1, 0 0 0";
    let colors = turnValuesIntoColors(str);
    expect(colors).toStrictEqual([1, 1, 1, 0, 0, 0]);
  });
  it("should turn color names into numbers", () => {
    let str = "red, green, blue";
    let colors = turnValuesIntoColors(str);
    expect(colors).toStrictEqual([1, 0, 0, 0, 0.5019607843137255, 0, 0, 0, 1]);
  });
  it("should turn hexes into numbers", () => {
    let str = "#ff0000, #00ff00, #0000ff";
    let colors = turnValuesIntoColors(str);
    expect(colors).toStrictEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });
  it("should turn incomplete hexes into numbers", () => {
    let str = "#ff, #00ff";
    let colors = turnValuesIntoColors(str);
    console.log(colors);
    expect(colors).toStrictEqual([1, 0, 0, 0, 1, 0]);
  });
  it("should turn mixed numbers/names/hexes into numbers", () => {
    let str = "red, #00ff00, 0 0 1";
    let colors = turnValuesIntoColors(str);
    expect(colors).toStrictEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });
});

describe("stripValues", () => {
  it("Should get rid of non commas/periods/digits/whitespaces", () => {
    let input = "1 2 2.5, 6bc 12.12, 3";
    let parsedInput = stripValues(input);
    expect(parsedInput).toBe("1 2 2.5, 6 12.12, 3");
  });
});
