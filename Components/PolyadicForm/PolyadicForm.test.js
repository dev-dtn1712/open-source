import { PolyadicForm } from './PolyadicForm';
import {
  getRenderer,
  getStyle,
  hasText,
  pressTouchable
} from '../../../TestUtils';

const renderPolyadicForm = getRenderer(PolyadicForm, {
  max: 1,
  onChange: () => {},
  responses: [
    {
      uuid: '12345678-90ab-cdef-1234567890af',
      statement: 'Hello, response to my query!'
    }
  ]
});

describe('PolyadicForm', () => {
  it('renders', () => {
    expect(renderPolyadicForm()).toBeTruthy();
  });

  it('displays statements from all passed responses', () => {
    const form = renderPolyadicForm({
      responses: [
        { uuid: '1', statement: 'Foo' },
        { uuid: '2', statement: 'Bar' },
        { uuid: '3', statement: 'Baz' }
      ]
    });

    expect(hasText(form, 'Foo')).toEqual(true);
    expect(hasText(form, 'Bar')).toEqual(true);
    expect(hasText(form, 'Baz')).toEqual(true);
  });

  it('calls onChange with the selected response data when pressed', () => {
    const onChange = jest.fn();
    const form = renderPolyadicForm({
      onChange,
      responses: [{ uuid: '1', statement: 'Foo' }]
    });

    pressTouchable(form);

    expect(onChange).toHaveBeenCalledWith([{ uuid: '1' }]);
  });

  it('disables unselected answers when the max is reached', () => {
    const onChange = jest.fn();
    const form = renderPolyadicForm({
      max: 1,
      onChange,
      responses: [
        { uuid: '1', statement: 'Foo' },
        { uuid: '2', statement: 'Bar' }
      ]
    });

    pressTouchable(form, child => hasText(child, 'Foo'));
    pressTouchable(form, child => hasText(child, 'Bar'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('accepts optional initial responseData', () => {
    const onChange = jest.fn();
    const form = renderPolyadicForm({
      onChange,
      responses: [{ uuid: '1', statement: 'Foo' }],
      responseData: [{ uuid: '1' }] // starts selected
    });

    pressTouchable(form); // de-select

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('overrides default styles with passed styles', () => {
    const form = renderPolyadicForm({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(form).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const form = renderPolyadicForm({ accessibilityHint: 'foo' });
    expect(form.props.accessibilityHint).toEqual('foo');
  });
});
