import { UserCard } from './UserCard';
import { getRenderer, getStyle, hasText } from '../../../TestUtils';

const renderUserCard = getRenderer(UserCard, {
  username: 'username',
  memberSince: 2020
});

describe('UserCard', () => {
  it('renders', () => {
    expect(renderUserCard()).toBeTruthy();
  });

  it('displays a username', () => {
    const card = renderUserCard({ username: 'Foo' });
    expect(hasText(card, 'Foo')).toEqual(true);
  });

  it('displays initials', () => {
    const card = renderUserCard({ username: 'Foo' });
    expect(hasText(card, 'FO')).toEqual(true);
  });

  it('displays the year the user signed up', () => {
    const card = renderUserCard({ memberSince: 1600 });
    expect(hasText(card, '1600')).toEqual(true);
  });

  it('overrides default styles with passed styles', () => {
    const card = renderUserCard({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(card).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const card = renderUserCard({ accessibilityHint: 'foo' });
    expect(card.props.accessibilityHint).toEqual('foo');
  });
});
