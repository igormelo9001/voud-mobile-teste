// NPM imports
import { Platform } from 'react-native';

// util function
const getIconName = (icon) => {
    if (icon) {
        return Array.isArray(icon) ? (Platform.OS === 'ios' ? icon[0] : icon[1]) : icon;
    }
    return null;
};

export default getIconName;