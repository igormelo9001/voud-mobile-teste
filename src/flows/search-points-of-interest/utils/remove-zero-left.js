export default function removeZeroLeft(string) {
  return string.replace(/^(?!0$)0+/, '');
}