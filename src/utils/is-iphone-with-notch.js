import { hasNotch } from './has-notch';

export function getPaddingForNotch() {
  return hasNotch() ? 24 : 0
}