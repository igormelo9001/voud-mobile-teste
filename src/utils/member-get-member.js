import firebase from 'react-native-firebase';
import { showToast, toastStyles } from '../redux/toast';

export async function getDiscountCode(openedLink) {
  const link = openedLink ? openedLink : await firebase.links().getInitialLink();

  if (link) {
    const linkSplitted = link.split('discountCode=');
    const discountCode = linkSplitted.length > 0 ? linkSplitted[1] : null;
    return discountCode;
  } 
  return null;
}

export function emitInvalidDiscountToast(dispatch) {
  const message = "Você já está cadastrado no VouD. Código de desconto válido apenas para novos usuários.";
  dispatch(showToast(message, toastStyles.DEFAULT));
}