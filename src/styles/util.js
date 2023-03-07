import { StatusBar, Platform } from 'react-native';

export const getStatusBarHeight = () => {
     return Platform.OS === 'ios' ? 20 : (Platform.Version >= 21 ? StatusBar.currentHeight : 0);
};

export const addIconSufix = iconName => {
    return Platform.OS === 'ios' ? 'ios-' + iconName : 'md-' + iconName;
}
