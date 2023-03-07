// NPM imports
import React from 'react';
import {
    Animated,
    StyleSheet,
    View
} from 'react-native';

// VouD imports
import Icon from '../Icon';
import SystemText from '../SystemText';
import { colors } from '../../styles';
import { formatCurrency } from '../../utils/parsers-formaters';

const recargaPendente = "Recarga pendente: "

// Component
const SecondaryInfo = ({ icon, collapse, value, breakLine }) => {
    if (collapse) {
        const opacity = collapse.interpolate({
            inputRange: [0, 0.5],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
    
        const height = collapse.interpolate({
            inputRange: [0, 1],
            outputRange: [breakLine ? 32 : 16, 0]
        });

        const marginTop = collapse.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 0]
        });
        
        const animStyles = {
            opacity,
            height,
            marginTop
        };

        return (
            <Animated.View style={StyleSheet.flatten([styles.container, animStyles])}>
                { icon && (
                    <Icon
                        name={icon}
                        style={styles.icon}
                    />
                )}
                <SystemText style={styles.text}>
                    {recargaPendente}{breakLine ? '\n' : ' '}
                    R$ {formatCurrency(value)}
                </SystemText>
            </Animated.View>
        );
    }

    return (
        <View style={styles.container}>
            { icon && (
                <Icon
                    name={icon}
                    style={styles.icon}
                />
            )}
            { breakLine?
                <View>
                    <SystemText style={styles.text}>
                        {recargaPendente}
                    </SystemText>
                    <SystemText style={styles.text}>
                        R$ {formatCurrency(value)}
                    </SystemText>
                </View>
                :
                <SystemText style={styles.text}>
                    `${recargaPendente} R$ {formatCurrency(value)}`
                </SystemText>
            }
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 8
    },
    icon: {
        width: 16,
        marginRight: 8,
        marginTop: 2,
        fontSize: 16,
        textAlign: 'center',
        color: colors.GRAY
    },
    text: {
        fontSize: 12,
        lineHeight: 16,
        color: colors.GRAY
    }
});

export default SecondaryInfo;
