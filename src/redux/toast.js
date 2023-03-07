// VouD imports
import { loginActions } from './login';
import { registerActions } from './register';
import { profileEditActions } from './profile-edit';
import { cardActions } from './transport-card';

// Actions

const SHOW = 'voud/toast/SHOW';
const DISMISS = 'voud/toast/DISMISS';

// Consts

export const toastStyles = {
    DEFAULT: 0,
    SUCCESS: 1,
    ERROR: 2
};

// Reducer

const initialState = {
    active: false,
    type: toastStyles.DEFAULT,
    message: ''
};

function reducer(state = initialState, action) {
    switch (action.type) {
        // Toast "API"

        case SHOW:
            return {
                active: true,
                type: action.style,
                message: action.message
            };
        case DISMISS:
            return {
                ...state,
                active: false
            };

        // other actions
        
        case loginActions.CHANGE_PASSWORD_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'Senha alterada com sucesso! Agora você pode utilizar a nova senha.'
            };

        case registerActions.RESEND_MOBILE_CONFIRMATION_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'SMS de confirmação reenviado'
            };

        case registerActions.RESEND_EMAIL_CONFIRMATION_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'E-mail de confirmação reenviado'
            };

        case profileEditActions.EDIT_PASSWORD_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'Senha alterada com sucesso!'
            };

        case profileEditActions.EDIT_PERSONAL_DATA_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'Dados pessoais atualizados com sucesso!'
            };

        case profileEditActions.EDIT_ADDRESS_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'Endereço salvo com sucesso'
            };

        case cardActions.REMOVE_CARD_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'Cartão removido com sucesso'
            };

        case cardActions.UPDATE_CARD_SUCCESS:
            return {
                active: true,
                type: toastStyles.DEFAULT,
                message: 'Cartão atualizado com sucesso'
            };

        default:
            return state;
    }
}

export default reducer;

// Actions creators
export function showToast(message, style = toastStyles.DEFAULT) {
    return {
        type: SHOW,
        message,
        style
    };
}

export function dismissToast() {
    return { type: DISMISS };
}
