import { get } from 'lodash';
import React, { useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ActionModal } from '../../Components';
import {
  getSessionPeer,
  getAlignedIntents,
  getIncomingCompareInvite,
  clearIncomingCompareInvite,
  selectIncomingCompareInvite,
  getOutgoingCompareInvite,
  clearOutgoingCompareInvite,
  getOutgoingCompareInviteRejected,
  setOutgoingCompareInviteRejected
} from '../../Redux/SessionRedux';
import { APP_MEDIUM_GRAY } from '../../Themes';

const REJECTED_TILE = 'Invite Declined';
const REJECTED_STATEMENT =
  "The other person didn't want to explore this intent at this time. Try again!";

const INVITE_SENT_ACTION_TITLE = 'Invite Sent';

const getIncomingStatement = peerName =>
  `Would you like to explore this intent with ${peerName}?`;
const getInviteSentStatement = (peerName, intentTitle) =>
  `Waiting for ${peerName} to accept your invitation to explore ${intentTitle}.`;

const templateByInvite = (matches, invite, defaultValue) => {
  if (!invite) {
    return defaultValue;
  }

  const match = matches.find(({ uuid }) => invite.intentId === uuid);
  return match ? match.template : defaultValue;
};

export const CompareInviteModals = () => {
  const peerName = get(useSelector(getSessionPeer), ['username'], '');
  const alignedIntents = useSelector(getAlignedIntents);

  const incomingInvite = useSelector(getIncomingCompareInvite);
  const outgoingInvite = useSelector(getOutgoingCompareInvite);
  const isOutgoingInviteRejected = useSelector(
    getOutgoingCompareInviteRejected
  );

  const incomingIntent = templateByInvite(alignedIntents, incomingInvite, {});
  const outgoingIntent = templateByInvite(alignedIntents, outgoingInvite, {});

  const dispatch = useDispatch();
  const dispatchCompareInviteCancel = useCallback(
    () => dispatch(clearOutgoingCompareInvite(outgoingInvite)),
    [dispatch, outgoingInvite]
  );
  const dispatchIncomingInviteReject = useCallback(
    () => dispatch(clearIncomingCompareInvite(incomingInvite)),
    [dispatch, incomingInvite]
  );
  const dispatchIncomingInviteAccept = useCallback(
    () => dispatch(selectIncomingCompareInvite(incomingInvite)),
    [dispatch, incomingInvite]
  );
  const dismissOutgoingInviteRejected = useCallback(
    () => dispatch(setOutgoingCompareInviteRejected(false)),
    [dispatch]
  );

  return (
    <Fragment>
      <ActionModal
        isVisible={!!incomingInvite}
        glyph={incomingIntent.glyphs}
        title={incomingIntent.title}
        statement={getIncomingStatement(peerName)}
        actionOption="Accept"
        dismissOption="No Thanks"
        onAction={dispatchIncomingInviteAccept}
        onDismiss={dispatchIncomingInviteReject}
      />
      <ActionModal
        isVisible={!!isOutgoingInviteRejected}
        title={REJECTED_TILE}
        statement={REJECTED_STATEMENT}
        actionOption="Close"
        onAction={dismissOutgoingInviteRejected}
      />
      <ActionModal
        isVisible={!!outgoingInvite}
        glyph={outgoingIntent.glyphs}
        title={INVITE_SENT_ACTION_TITLE}
        statement={getInviteSentStatement(peerName, outgoingIntent.title)}
        actionOption="Cancel Invite"
        actionStyle={{ backgroundColor: APP_MEDIUM_GRAY }}
        onAction={dispatchCompareInviteCancel}
      />
    </Fragment>
  );
};
