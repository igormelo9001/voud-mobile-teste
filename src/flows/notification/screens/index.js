// NPM Imports
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  BackHandler,
  Image
} from "react-native";
import { connect } from "react-redux";

// VouD Imports
import RequestFeedback from "../../../components/RequestFeedback";
import NotificationItem from "./NotificationItem";
import Icon from "../../../components/Icon";
import { colors } from "../../../styles";
import VoudText from "../../../components/VoudText";
import VoudModal from "../../../components/Modal";

import {
  getNotifications,
  openNotification,
  markNotificationAsRead,
  fetchRemoveNotification
} from "../../../redux/notifications";

import {
  getNotificationsUI,
  getRemoveNotificationUI,
  getMarkNotificationAsReadUI
} from "../../../redux/selectors";
import ActionSheet from "../../../components/ActionSheet";
import ActionSheetItem from "../../../components/ActionSheet/Item";
import LoadMask from "../../../components/LoadMask";
import { showToast, toastStyles } from "../../../redux/toast";
import { backToHome } from "../../../redux/nav";
import VoudTouchableOpacity from "../../../components/TouchableOpacity";

// image
const arrowRightImg = require("../../../images/arrow-right.png");

// Screen component
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  notificationList: PropTypes.array.isRequired,
  notificationListUi: PropTypes.object.isRequired,
  removeNotificationUi: PropTypes.object.isRequired,
  markNotificationAsReadUi: PropTypes.object.isRequired
};

class NotificationCenterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNotificationActionsVisible: false,
      notificationIsVisible: false
    };
    this._selectedNotification = null;
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }

  _backHandler = () => {
    this._onCloseNotification();
    return true;
  };

  componentDidMount() {
    this.props.dispatch(getNotifications());
    this.setState({ notificationIsVisible: true });
  }

  _onRefresh = () => {
    this.props.dispatch(getNotifications());
  };

  _goToNotificationDetail = notification => {
    this.props.dispatch(openNotification(notification));
  };

  _renderNotificationItem = ({ item }) => {
    return (
      <NotificationItem
        data={item}
        onPress={() => {
          this._goToNotificationDetail(item);
        }}
        onOpenActions={() => {
          this._onNotificationActionsOpen(item);
        }}
      />
    );
  };

  _onNotificationActionsOpen = item => {
    this._selectedNotification = item;
    this.setState({ isNotificationActionsVisible: true });
  };

  _onNotificationActionsDismiss = () => {
    this._selectedNotification = null;
    this.setState({ isNotificationActionsVisible: false });
  };

  _onRemoveNotification = () => {
    const { dispatch } = this.props;
    const notificationMessage =
      this._selectedNotification && this._selectedNotification.message
        ? this._selectedNotification.message
        : null;

    if (notificationMessage) {
      this.props
        .dispatch(fetchRemoveNotification(notificationMessage.id))
        .then(() => {
          dispatch(showToast("Notificação excluida com sucesso"));
        })
        .catch(error => {
          dispatch(showToast(error.message, toastStyles.ERROR));
        });
    }
    this._onNotificationActionsDismiss();
  };

  _onReadNotification = () => {
    const { dispatch } = this.props;

    if (this._selectedNotification) {
      dispatch(
        markNotificationAsRead(
          this._selectedNotification.id,
          !this._selectedNotification.read
        )
      ).catch(error => {
        dispatch(showToast(error.message, toastStyles.ERROR));
      });
    }
    this._onNotificationActionsDismiss();
  };

  _onCloseNotification = () => {
    this.setState({ notificationIsVisible: false }, () => {
      this.props.dispatch(backToHome());
    });
  };

  render() {
    const {
      notificationList,
      notificationListUi,
      removeNotificationUi,
      markNotificationAsReadUi
    } = this.props;
    const showLoadMask =
      removeNotificationUi.isFetching || markNotificationAsReadUi.isFetching;

    return (
      <Fragment>
        <VoudModal
          isVisible={this.state.notificationIsVisible}
          style={styles.containerModal}
          onSwipe={this._onCloseNotification}
          onBackdropPress={this._onCloseNotification}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          backdropOpacity={0.3}
          swipeDirection={showLoadMask ? null : "right"}
        >
          <View style={styles.notificationContainer}>
            <View style={styles.header}>
              <Icon style={styles.icon} name="notifications" />
              <View style={styles.titleWrapper}>
                <VoudText style={styles.title}>Notificações</VoudText>
              </View>
            </View>
            {notificationList.length > 0 && (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={notificationListUi.isFetching}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <FlatList
                  data={notificationList}
                  renderItem={this._renderNotificationItem}
                  keyExtractor={item => item.id.toString()}
                />
              </ScrollView>
            )}
            {notificationList.length === 0 && (
              <View style={styles.emptyState}>
                <RequestFeedback
                  loadingMessage="Carregando notificações"
                  errorMessage={notificationListUi.error}
                  emptyMessage="Ainda não foram encontradas notificações e mensagens para você."
                  retryMessage="Tentar Novamente"
                  isFetching={notificationListUi.isFetching}
                  onRetry={this._onRefresh}
                />
              </View>
            )}
          </View>
          <VoudTouchableOpacity
            style={styles.arrowRightContainer}
            pointerEvents="box-none"
            onPress={this._onCloseNotification}
          >
            <Image source={arrowRightImg} />
          </VoudTouchableOpacity>
        </VoudModal>
        {showLoadMask && <LoadMask />}
        <ActionSheet
          isVisible={this.state.isNotificationActionsVisible}
          onDismiss={this._onNotificationActionsDismiss}
        >
          <ActionSheetItem
            key="delete"
            icon="delete"
            label="Excluir notificação"
            onPress={this._onRemoveNotification}
          />
          <ActionSheetItem
            key="drafts"
            icon={
              this._selectedNotification && this._selectedNotification.read
                ? "mail"
                : "drafts"
            }
            label={
              this._selectedNotification && this._selectedNotification.read
                ? "Marcar como não lida"
                : "Marcar como lida"
            }
            onPress={this._onReadNotification}
          />
        </ActionSheet>
      </Fragment>
    );
  }
}

NotificationCenterView.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  containerModal: {
    margin: 0,
    paddingLeft: 64
  },
  notificationContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 16,
    paddingTop: 40,
    paddingBottom: 16
  },
  icon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  },
  titleWrapper: {
    marginLeft: 20
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.BRAND_PRIMARY_DARKER
  },
  scrollView: {
    flex: 1
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "black",
    fontSize: 22
  },
  notificationActions: {
    justifyContent: "flex-end",
    margin: 0
  },
  arrowRightContainer: {
    position: "absolute",
    top: 0,
    left: 24,
    bottom: 0,
    justifyContent: "center"
  }
});

function mapStateToProps(state) {
  return {
    notificationList: state.notifications.notificationList.data,
    notificationListUi: getNotificationsUI(state),
    removeNotificationUi: getRemoveNotificationUI(state),
    markNotificationAsReadUi: getMarkNotificationAsReadUI(state)
  };
}

export const NotificationCenter = connect(mapStateToProps)(
  NotificationCenterView
);

export * from "./NotificationDetail";
