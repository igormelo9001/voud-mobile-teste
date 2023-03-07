import { openUrl } from "./open-url";

export const openTel = telNumber => {
  openUrl(`tel:${telNumber}`);
}