// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// VouD imports
import Header, { headerActionTypes } from '../../components/Header';
import RequestFeedback from '../../components/RequestFeedback';
import { openMenu } from '../../redux/menu';
import { fetchHelpTopics, viewHelpDetails } from '../../redux/help';
import { getFaqList, getFaqListUI, getIsLoggedIn } from '../../redux/selectors';
import { routeNames } from '../../shared/route-names';

// Group imports
import QuestionsList from './QuestionsList';
import { navigateToRoute } from '../../redux/nav';
import { getPaddingForNotch } from '../../utils/is-iphone-with-notch';

// Screen component
class HelpView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // fetch help topics if needed
        if (!this.props.requestUi.requested)
            this._fetchHelpTopics();
    }

    openMenu = () => {
        const { dispatch } = this.props;
        dispatch(openMenu());
    };

    _fetchHelpTopics = () => {
        this.props.dispatch(fetchHelpTopics());
    };

    _viewDetails = (id) => {
        const { dispatch } = this.props;
        dispatch(viewHelpDetails(id));
        dispatch(navigateToRoute(routeNames.HELP_DETAILS));
    };

    _renderContent = () => {
        const { helpTopics } = this.props;
        const { error, isFetching } = this.props.requestUi;

        return helpTopics[0] ?
        (
            <QuestionsList 
                itemList={this.props.helpTopics}
                onPress={this._viewDetails}
            />
        ) :
        (
            <View style={styles.requestFeedbackContainer}>
                <RequestFeedback
                    loadingMessage="Carregando dúvidas e respostas..."
                    errorMessage={error}
                    emptyMessage="Não foram encontrados tópicos de ajuda"
                    retryMessage="Tentar novamente"
                    isFetching={isFetching}
                    onRetry={this._fetchHelpTopics}
                />
            </View>
        );
    }

    _openMenu = () => {
        const { dispatch } = this.props;
        dispatch(openMenu());
    };

    render() {
        return (
            <View style={styles.container}>
                <Header
                    title="Dúvidas Frequentes"
                    left={{
                        type: headerActionTypes.CLOSE,
                        onPress: () => this.props.dispatch(NavigationActions.back())
                    }}
                />
                {this._renderContent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: getPaddingForNotch(),
    },
    requestFeedbackContainer: {
        flex: 1,
        justifyContent: 'center'
    }
});

// Redux
const mapStateToProps = state => {
    return {
        helpTopics: getFaqList(state),
        requestUi: getFaqListUI(state),
        isMenuOpen: state.menu.isOpen,
        isLoggedIn: getIsLoggedIn(state),
    };
};

export const Help = connect(mapStateToProps)(HelpView);

// Export other screens from group
export * from './HelpDetails';