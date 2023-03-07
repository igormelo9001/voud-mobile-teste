import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export const addEllipsis = (string, charLimit = 100) => {
  if (string && string.length > charLimit) {
    return string.slice(0, charLimit) + "...";
  }
  return string;
};

export const capitalizeFirstLetter = string => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
};

export const capitalizeLetters = string =>
  string
    ? string.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
        return a.toUpperCase();
      })
    : "";

const acronymWords = ["Cptm"];

export const voudCapitalizeLetters = string => {
  const capitalizeString = capitalizeLetters(string);
  return acronymWords.reduce((acc, cur) => {
    return acc.replace(cur, cur.toUpperCase());
  }, capitalizeString);
};

export const padStart = (value, padString, targetLength) => {
  targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
  padString = String(typeof padString !== "undefined" ? padString : " ");
  if (value.length > targetLength) {
    return String(value);
  } else {
    targetLength = targetLength - value.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
    }
    return padString.slice(0, targetLength) + String(value);
  }
};

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
