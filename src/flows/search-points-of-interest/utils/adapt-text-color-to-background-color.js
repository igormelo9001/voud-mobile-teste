import { colors } from "../../../styles";

export function adaptTextColorToBackgroundColor(backgroundColor) {
  if(backgroundColor === '#F0C800') return { color: colors.GRAY_DARKER };
  return { color: 'white' }
}