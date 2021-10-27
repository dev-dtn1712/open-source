import { ActionModal } from './ActionModal';
import {
  findChild,
  getRenderer,
  getStyle,
  pressTouchable
} from '../../../TestUtils';

const renderActionModal = getRenderer(ActionModal, {
  title: 'Action Title',
  statement: 'Action Statement',
  isVisible: true
});

describe('ActionModal', () => {
  it('renders', () => {
    expect(renderActionModal()).toBeTruthy();
  });

  it('overrides default styles with passed styles', () => {
    const modal = renderActionModal({
      containerStyle: {
        backgroundColor: '#F00BA4'
      }
    });

    const container = findChild(modal, { testID: 'modalContainer' });
    expect(getStyle(container).backgroundColor).toEqual('#F00BA4');
  });

  it('overrides default action button styles with passed styles', () => {
    const modal = renderActionModal({
      actionOption: 'Action Button',
      actionStyle: {
        backgroundColor: '#F00BA4'
      }
    });

    const actionButton = findChild(modal, { testID: 'Confirm Modal' });
    expect(getStyle(actionButton).backgroundColor).toEqual('#F00BA4');
  });

  it('calls passed onAction function when pressed', () => {
    const onAction = jest.fn();
    const modal = renderActionModal({
      actionOption: 'Action Button',
      onAction
    });

    const actionButton = findChild(modal, { testID: 'Confirm Modal' });

    pressTouchable(actionButton);

    expect(onAction).toHaveBeenCalled();
  });
});
