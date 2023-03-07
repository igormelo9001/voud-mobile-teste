// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
    Image,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../components/Header';
import BrandText from '../../components/BrandText';
import Icon from '../../components/Icon';
import RequestFeedback from '../../components/RequestFeedback';
import { getQuestionDetails } from '../../redux/selectors';
import { colors } from '../../styles';
import { openUrl } from '../../utils/open-url';
import { fetchHelpTopics } from '../../redux/help';
import { getFaqListUI } from '../../redux/selectors';
import VoudTouchableOpacity from '../../components/TouchableOpacity';

// Component
class HelpDetailsView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { data } = this.props;
        if (!data) 
            this._fetchHelpTopics();
    }

    _fetchHelpTopics = () => {
        this.props.dispatch(fetchHelpTopics());
    }

    back = () => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.back());
    };

    render() {
        const { data, requestUi } = this.props;
        const { error, isFetching } = requestUi;

        return (
            <View style={styles.container}>
                <Header
                    title="Ajuda"
                    left={{
                        type: headerActionTypes.CLOSE,
                        onPress: this.back
                    }}
                />
                { !data || isFetching ?
                    <View style={styles.requestFeedbackContainer}>
                        <RequestFeedback
                            loadingMessage="Carregando dúvidas e respostas..."
                            errorMessage={error}
                            emptyMessage="Tópico de ajuda não encontrado"
                            retryMessage="Tentar novamente"
                            isFetching={isFetching}
                            onRetry={this._fetchHelpTopics}
                        />
                    </View>
                    :
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.content}
                    >
                        { data.imageUrl && (
                            <Image
                                source={{uri: data.imageUrl}}
                                resizeMode="contain"
                                style={styles.image}
                            />
                        )}
                        <BrandText style={styles.questionText}>
                            {data.question}
                        </BrandText>
                        <BrandText style={styles.mainText}>
                            {data.answer}
                        </BrandText>
                        { data.details && (
                            <BrandText style={styles.longText}>
                                {data.details}
                            </BrandText>
                        )}
                        { data.linkUrl && (
                            <VoudTouchableOpacity
                                style={styles.link}
                                onPress={() => { openUrl(data.linkUrl); }}
                            >
                                <Icon
                                    style={styles.linkIcon}
                                    name="open-in-new"
                                />
                                <BrandText style={styles.linkText}>
                                    { data.linkText || 'Saiba mais' }
                                </BrandText>
                            </VoudTouchableOpacity>
                        )}
                    </ScrollView>
                }
            </View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    requestFeedbackContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    scrollView: {
        flex: 1
    },
    content: {
        paddingVertical: 24,
        paddingHorizontal: 16
    },
    imagePlaceholder: {
        alignSelf: 'center',
        width: 240,
        height: 240,
        borderRadius: 120,
        marginBottom: 24,
        backgroundColor: colors.BRAND_PRIMARY_LIGHTER
    },
    image: {
        height: 240,
        alignSelf: 'stretch',
        marginBottom: 24
    },
    questionText: {
        marginBottom: 16,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 'bold',
        color: colors.BRAND_PRIMARY
    },
    mainText: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.GRAY_DARKER
    },
    longText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.GRAY,
        marginTop: 16
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16
    },
    linkIcon: {
        marginRight: 8,
        fontSize: 24,
        color: colors.BRAND_PRIMARY_LIGHTER
    },
    linkText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        textDecorationLine: 'underline',
        color: colors.BRAND_PRIMARY_LIGHTER
    }
});

// Redux
const mapStateToProps = (state) => {
    return {
        data: getQuestionDetails(state),
        requestUi: getFaqListUI(state),
    };
};

export const HelpDetails = connect(mapStateToProps)(HelpDetailsView);
