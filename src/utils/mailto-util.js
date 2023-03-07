import { Platform } from 'react-native';
import { openUrl } from "./open-url";

export const openSupportEmail = (userData) => {
  const voudEmail = "atendimento@voud.com.br";
  const emailSubject = "Suporte para o usuário VouD";
  const userName = `${userData.name} ${userData.lastName}`;
  const userEmail = userData.email;
  // Why %0A? mailto protocol supports percent enconding, and we need a line break
  // between userName and userEmail on the email body and add one linebreaks after
  // to format the email for the user to type
  const lineSeparator = Platform.OS === 'ios' ? '</br>' : '%0A';
  openUrl(`mailto:${voudEmail}?subject=${emailSubject}&body=${userName}${lineSeparator}${userEmail}${lineSeparator}`);
}
