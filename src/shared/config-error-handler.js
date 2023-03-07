// NPM imports
import { Alert } from 'react-native';

export const configErrorHandler = () => {
    Alert.alert(
        'Sem conexão',
        'Você está sem conexão com nossos servidores. Por favor, tente novamente em instantes.',
        [
            {
                text: 'OK'
            }
        ]
    );
};