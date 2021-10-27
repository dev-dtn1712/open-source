import { flow } from 'lodash';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  DEFAULT_TITLE_HEIGHT,
  ScrollSurface
} from '../../Containers/ScrollSurface';
import {
  DEFAULT_TOP_BAR_HEIGHT,
  Pulsar,
  ActionModal,
  UserCard
} from '../../Components';
import { getUsername } from '../../Redux/AuthRedux';
import { getContentDate } from '../../Redux/ContentMetaRedux';
import {
  setIsAvailable,
  getAvailablePeers,
  getSessionInvites,
  getCurrentSessionInvitee,
  getCurrentInviteeRejectedSession,
  removeSessionInvite,
  selectSessionInvite,
  setCurrentSessionInvitee,
  clearCurrentSessionInvitee,
  setCurrentInviteeRejectedSession,
  getSessionWasLost,
  setSessionWasLost
} from '../../Redux/ConnectionRedux';
import {
  MESSAGING_ERROR_CODES,
  getMessagingError,
  getMessagingStatus,
  startMessaging
} from '../../Services/Messaging';
import {
  APP_DARK_GRAY,
  APP_MEDIUM_GRAY,
  APP_WHITE,
  Fonts,
  Images,
  Metrics
} from '../../Themes';
import { logger, toTestIds } from '../../Utils';

const EMPTY_USERS_HEIGHT = 180;
const HEADER_HEIGHT = Metrics.screenHeight - EMPTY_USERS_HEIGHT;
const STATEMENT_TOP_PADDING = 15;
const STATEMENT_LINE_HEIGHT = 22;
const PULSAR_HEIGHT = Math.min(
  Metrics.screenWidth - 32,
  HEADER_HEIGHT -
    (DEFAULT_TOP_BAR_HEIGHT + DEFAULT_TITLE_HEIGHT) -
    (STATEMENT_TOP_PADDING + STATEMENT_LINE_HEIGHT)
);

const TITLE = 'Scanning';
const STATEMENT = 'Ensure the other person is in scanning mode.';
const INNER_CIRCLE_SIZE = 95;
const SCANNING_TIMEOUT_INTERVAL = 20000;

const NOBODY_ACTION_TITLE = 'No Users Found';
const NOBODY_ACTION_GLYPH = '😥';
const NOBODY_ACTION_STATEMENT =
  'We can’t find anyone near you using the app. Make sure they’re in discovery mode too!';

const INVITES_RECEIVED_TITLE = 'Accept';
const INVITES_RECEIVED_STATEMENT =
  'Would you like to connect with this person and explore each others intents?';
const INVITES_RECEIVED_ACTION = 'Accept';
const INVITES_RECEIVED_DISMISS = 'No Thanks';

const INVITE_DECLINED_TITLE = 'Invite Declined';
const INVITE_DECLINED_STATEMENT =
  "The other person didn't want to connect at this time.";
const INVITE_DECLINED_ACTION = 'Close';

const SESSION_LOST_TITLE = 'Connection Lost';
const SESSION_LOST_STATEMENT =
  'Sorry! Somehow the person on the other end was disconnected. Try again!';
const SESSION_LOST_ACTION = 'Close';

const ERROR_MODAL_ACTION = 'Got it!';

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_DARK_GRAY
  },
  headerWrapper: {
    backgroundColor: APP_DARK_GRAY,
    height: HEADER_HEIGHT,
    paddingHorizontal: 16
  },
  headerBody: {
    flex: 1,
    paddingTop: DEFAULT_TOP_BAR_HEIGHT + DEFAULT_TITLE_HEIGHT
  },
  statement: {
    ...Fonts.style.normal,
    color: APP_WHITE,
    marginTop: STATEMENT_TOP_PADDING
  },
  container: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: PULSAR_HEIGHT
  },
  pulsar: {
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  scannDots: {
    position: 'absolute',
    resizeMode: 'contain'
  },
  innerCircle: {
    backgroundColor: APP_DARK_GRAY,
    height: INNER_CIRCLE_SIZE,
    width: INNER_CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: INNER_CIRCLE_SIZE / 2
  },
  logoCanWe: {
    aspectRatio: 0.5,
    resizeMode: 'contain'
  },
  usersContainer: {
    flex: 1,
    alignItems: 'center'
  },
  usersLabel: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    color: APP_WHITE,
    marginBottom: 10
  },
  usersCarousel: {
    width: Metrics.screenWidth * 0.837,
    marginBottom: 16
  }
});

const getErrorModalTitle = errorCode => {
  switch (errorCode) {
    case MESSAGING_ERROR_CODES.START_MISSING_BLUETOOTH:
      return 'Bluetooth Off';
    case MESSAGING_ERROR_CODES.START_MISSING_LOCATION_SERVICES:
      return 'Location Services Off';
    default:
      return 'Scanning Failed';
  }
};

const getErrorModalStatement = errorCode => {
  switch (errorCode) {
    case MESSAGING_ERROR_CODES.START_MISSING_BLUETOOTH:
      return "We're unable to scan around you, check your Bluetooth settings to continue.";
    case MESSAGING_ERROR_CODES.START_MISSING_LOCATION_SERVICES:
      return "We're unable to scan around you, check your Location permissions to continue.";
    default:
      return 'An unknown error occurred while attempting to scan. Please try again later.';
  }
};

const usernameOf = (users, id) => {
  const user = users.find(({ uuid }) => uuid === id);
  return user && user.username;
};

const renderHeaderWrapper = () => (
  <View style={STYLES.headerWrapper}>
    <View style={STYLES.headerBody}>
      <Text style={STYLES.statement}>{STATEMENT}</Text>
      <View style={STYLES.container}>
        <Pulsar
          style={STYLES.pulsar}
          startSize={INNER_CIRCLE_SIZE}
          endSize={PULSAR_HEIGHT}
        />
        <Image style={STYLES.scannDots} source={Images.scanDots} />
        <View style={STYLES.innerCircle}>
          <Image style={STYLES.logoCanWe} source={Images.logoCanWe} />
        </View>
      </View>
    </View>
  </View>
);

const renderUsersCarousel = (usersFound, onSelectUser = () => {}) => {
  const foundCount = usersFound.length;
  const isUsersFound = foundCount > 0;
  const foundTemplate =
    foundCount === 1 ? '1 User Found' : `${foundCount} Users Found`;

  return (
    <View style={STYLES.usersContainer}>
      {isUsersFound && <Text style={STYLES.usersLabel}>{foundTemplate}</Text>}
      {isUsersFound &&
        usersFound.map(user => {
          const { username, memberSince } = user;
          return (
            <TouchableWithoutFeedback
              key={username}
              {...toTestIds(`Select ${username}`)}
              onPress={() => onSelectUser(user)}>
              <UserCard
                style={STYLES.usersCarousel}
                username={username}
                memberSince={memberSince}
              />
            </TouchableWithoutFeedback>
          );
        })}
    </View>
  );
};

const renderOutdatedContentAction = ({
  username,
  actionVisible,
  onAction,
  isPeer = false
}) => {
  const actionStatement = isPeer
    ? `${username}'s content is out of date. Please ask them to connect to a network to update.`
    : 'Your content is out of date. Please connect to a network to update.';
  return (
    <ActionModal
      isVisible={actionVisible}
      username={username === '' ? undefined : username}
      title="Whoops!"
      statement={actionStatement}
      actionOption="Got it!"
      onAction={onAction}
    />
  );
};

const renderVerifyConnectAction = ({
  user,
  actionVisible,
  onAction,
  onDismiss
}) => {
  const { username, memberSince } = user;
  const actionStatement = `MEMBER SINCE ${memberSince}`;
  return (
    <ActionModal
      isVisible={actionVisible}
      username={username}
      title={username}
      statement={actionStatement}
      actionOption="Send Invite"
      onAction={onAction}
      onDismiss={onDismiss}
    />
  );
};

const renderInviteSentAction = ({ username, actionVisible, onAction }) => {
  const actionStatement = `Waiting for ${username} to accept your invitation to connect.`;
  return (
    <ActionModal
      isVisible={actionVisible}
      username={username}
      title="Invite Sent"
      statement={actionStatement}
      actionOption="Cancel"
      actionStyle={{ backgroundColor: APP_MEDIUM_GRAY }}
      onAction={onAction}
    />
  );
};

const renderInvitesReceivedAction = ({
  peers,
  invites,
  onAction,
  onDismiss
}) => {
  const isVisible = invites.length > 0;
  const currentInviteId = invites[0];

  return (
    <ActionModal
      isVisible={isVisible}
      username={usernameOf(peers, currentInviteId)}
      title={INVITES_RECEIVED_TITLE}
      statement={INVITES_RECEIVED_STATEMENT}
      actionOption={INVITES_RECEIVED_ACTION}
      dismissOption={INVITES_RECEIVED_DISMISS}
      onAction={() => onAction(currentInviteId)}
      onDismiss={() => onDismiss(currentInviteId)}
    />
  );
};

export const DiscoveryScanning = ({ navigation }) => {
  const [nobodyAction, setNobodyAction] = useState(false);
  const [noPeersFound, setNoPeersFound] = useState(true);
  const [outdatedContentOf, setOutdatedContentOf] = useState(null);
  const [verifyConnectAction, setVerifyConnectAction] = useState(false);
  const [userToInvite, setUserToInvite] = useState(null);
  const [messagingError, setMessagingError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const noPeersFoundRef = useRef(noPeersFound);
  noPeersFoundRef.current = noPeersFound;

  // start scanning, send or cancel the connection invite
  const name = useSelector(getUsername);
  const contentDate = useSelector(getContentDate);
  const peers = useSelector(getAvailablePeers);
  const invites = useSelector(getSessionInvites);
  const currentInvitee = useSelector(getCurrentSessionInvitee);
  const inviteRejected = useSelector(getCurrentInviteeRejectedSession);
  const isSessionLost = useSelector(getSessionWasLost);

  const dispatch = useDispatch();
  const dispatchIsAvailable = useCallback(flow([setIsAvailable, dispatch]), [
    dispatch
  ]);
  const dispatchAcceptInvite = useCallback(
    flow([selectSessionInvite, dispatch]),
    [dispatch]
  );
  const dispatchRejectInvite = useCallback(
    flow([removeSessionInvite, dispatch]),
    [dispatch]
  );
  const dispatchSendInvite = useCallback(
    flow([setCurrentSessionInvitee, dispatch]),
    [dispatch]
  );
  const dispatchCancelInvite = useCallback(
    flow([clearCurrentSessionInvitee, dispatch]),
    [dispatch]
  );
  const dispatchSetInviteRejected = useCallback(
    flow([setCurrentInviteeRejectedSession, dispatch]),
    [dispatch]
  );
  const dispatchDismissSessionLost = useCallback(
    () => dispatch(setSessionWasLost(false)),
    [dispatch]
  );

  // handler for user selected
  const onSelectUser = user => {
    const timestamp = Date.parse(contentDate);
    const { contentDate: peerContentDate } = user;
    if (timestamp < peerContentDate * 1000) {
      setOutdatedContentOf(name);
    } else if (timestamp > peerContentDate * 1000) {
      setOutdatedContentOf(user.username);
    } else {
      setUserToInvite(user);
      setVerifyConnectAction(true);
    }
  };

  // handler to send the invite
  const sendConnectInvite = () => {
    setVerifyConnectAction(false);
    dispatchSendInvite(userToInvite.uuid);
    setUserToInvite(null);
  };

  // handler to cancel the invite
  const cancelInvite = () => {
    dispatchCancelInvite(currentInvitee);
  };

  const leaveDiscovery = () => {
    navigation.navigate('DiscoveryIntro');
  };

  useEffect(() => {
    let nobodyTimer = null;

    const lookForPeers = () => {
      dispatchIsAvailable(true);
      setNoPeersFound(peers.length > 0);

      nobodyTimer = setTimeout(() => {
        if (noPeersFoundRef.current) {
          setNobodyAction(true);
        }
      }, SCANNING_TIMEOUT_INTERVAL);
    };

    // Verify that messaging has started, waiting if in the process of starting
    startMessaging().then(isStarted => {
      if (isStarted) {
        lookForPeers();
      } else {
        const status = getMessagingStatus();
        const errorCode = getMessagingError();

        logger.warn(
          `Scanning failed with messaging status, code: ${status}, ${errorCode}`
        );

        setMessagingError(errorCode);
        setShowErrorModal(true);
      }
    });

    // Listener for navigating back to screen
    const didFocusListener = navigation.addListener('didFocus', () => {
      lookForPeers();
    });

    // Listener for navigating away from screen
    const willBlurListener = navigation.addListener('willBlur', () => {
      dispatchIsAvailable(false);
      clearTimeout(nobodyTimer);
      setVerifyConnectAction(false);
      setShowErrorModal(false);
    });

    return () => {
      didFocusListener.remove();
      willBlurListener.remove();
    };
  }, []);

  useEffect(() => {
    if (peers.length > 0) {
      setNobodyAction(false);
      setNoPeersFound(false);
    }
  }, [peers]);

  return (
    <View style={STYLES.screen}>
      <ScrollSurface
        title={TITLE}
        topBarProps={{
          leftItemLabel: 'Intents',
          onPressLeftItem: leaveDiscovery
        }}
        contentStyle={{
          backgroundColor: APP_DARK_GRAY
        }}>
        {renderHeaderWrapper()}
        {renderUsersCarousel(peers, user => onSelectUser(user))}
      </ScrollSurface>
      <ActionModal
        isVisible={nobodyAction}
        glyph={NOBODY_ACTION_GLYPH}
        title={NOBODY_ACTION_TITLE}
        statement={NOBODY_ACTION_STATEMENT}
        actionOption="Keep Scanning"
        onAction={() => setNobodyAction(false)}
        onDismiss={() => setNobodyAction(false)}
      />
      {outdatedContentOf !== null &&
        renderOutdatedContentAction({
          username: outdatedContentOf,
          actionVisible: outdatedContentOf !== null,
          onAction: () => setOutdatedContentOf(null),
          isPeer: outdatedContentOf !== name
        })}
      <ActionModal
        isVisible={inviteRejected}
        title={INVITE_DECLINED_TITLE}
        statement={INVITE_DECLINED_STATEMENT}
        actionOption={INVITE_DECLINED_ACTION}
        onAction={() => dispatchSetInviteRejected(false)}
      />
      <ActionModal
        isVisible={isSessionLost}
        title={SESSION_LOST_TITLE}
        statement={SESSION_LOST_STATEMENT}
        actionOption={SESSION_LOST_ACTION}
        onAction={dispatchDismissSessionLost}
      />
      {renderInvitesReceivedAction({
        peers,
        invites,
        onAction: dispatchAcceptInvite,
        onDismiss: dispatchRejectInvite
      })}
      {userToInvite &&
        renderVerifyConnectAction({
          user: userToInvite,
          actionVisible: verifyConnectAction,
          onAction: () => sendConnectInvite(),
          onDismiss: () => setVerifyConnectAction(false)
        })}
      {renderInviteSentAction({
        username: usernameOf(peers, currentInvitee),
        actionVisible: currentInvitee !== null,
        onAction: () => cancelInvite()
      })}
      <ActionModal
        isVisible={showErrorModal}
        title={getErrorModalTitle(messagingError)}
        statement={getErrorModalStatement(messagingError)}
        actionOption={ERROR_MODAL_ACTION}
        onAction={leaveDiscovery}
      />
    </View>
  );
};
