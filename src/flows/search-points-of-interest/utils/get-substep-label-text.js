import removeZeroLeft from "./remove-zero-left";

export default function getSubstepLabelText(type, shortName) {
  if (type === "BUS") {
    return shortName;
  } else {
    return `Linha ${removeZeroLeft(shortName)}`;
  }
}