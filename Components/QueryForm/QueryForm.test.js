import { QueryForm } from './QueryForm';
import {
  getDeepRenderer,
  getStyle,
  hasText,
  pressTouchable
} from '../../../TestUtils';

const renderQueryForm = getDeepRenderer(QueryForm, {
  onChange: () => {},
  query: {
    uuid: '12345678-90ab-cdef-1234567890af',
    title: 'Hello, title of my query!',
    statement: 'Hello, statement about my query!',
    hint: '',
    prompt: '',
    queryRule: {
      type: 'polyadic',
      min: 1,
      max: 1
    },
    responses: [
      {
        uuid: '23456789-0abc-def1-234567890af1',
        statement: 'Hello, response to my query!'
      }
    ]
  }
});

describe('QueryForm', () => {
  it('renders', () => {
    expect(renderQueryForm()).toBeTruthy();
  });

  describe('polyadic query', () => {
    it('displays answers for a polyadic query', () => {
      const form = renderQueryForm({
        query: {
          queryRule: {
            type: 'polyadic',
            min: 1,
            max: 2
          },
          responses: [
            { uuid: '1', statement: 'Foo' },
            { uuid: '2', statement: 'Bar' },
            { uuid: '3', statement: 'Baz' }
          ]
        }
      });

      expect(hasText(form, 'Foo')).toEqual(true);
      expect(hasText(form, 'Bar')).toEqual(true);
      expect(hasText(form, 'Baz')).toEqual(true);
    });

    it('calls onChange with the selected response data when pressed', () => {
      const onChange = jest.fn();
      const form = renderQueryForm({
        onChange,
        query: {
          queryRule: { type: 'polyadic' },
          responses: [{ uuid: '1', statement: 'Foo' }]
        }
      });

      pressTouchable(form);

      expect(onChange).toHaveBeenCalledWith([{ uuid: '1' }]);
    });

    it('disables unselected answers when the max is reached', () => {
      const onChange = jest.fn();
      const form = renderQueryForm({
        onChange,
        query: {
          queryRule: {
            type: 'polyadic',
            max: 1
          },
          responses: [
            { uuid: '1', statement: 'Foo' },
            { uuid: '2', statement: 'Bar' }
          ]
        }
      });

      pressTouchable(form, child => hasText(child, 'Foo'));
      pressTouchable(form, child => hasText(child, 'Bar'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('accepts optional initial responseData', () => {
      const onChange = jest.fn();
      const form = renderQueryForm({
        onChange,
        query: {
          queryRule: { type: 'polyadic' },
          responses: [{ uuid: '1', statement: 'Foo' }]
        },
        responseData: [{ uuid: '1' }] // starts selected
      });

      pressTouchable(form); // de-select

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('binary query', () => {
    it('displays answers for a binary query', () => {
      const form = renderQueryForm({
        query: {
          queryRule: { type: 'binary' },
          responses: [
            { uuid: '1', statement: 'Foo' },
            { uuid: '2', statement: 'Bar' }
          ]
        }
      });

      expect(hasText(form, 'Foo')).toEqual(true);
      expect(hasText(form, 'Bar')).toEqual(true);
    });

    it('calls onChange with the selected response data when pressed', () => {
      const onChange = jest.fn();
      const form = renderQueryForm({
        onChange,
        query: {
          queryRule: { type: 'binary' },
          responses: [
            { uuid: '1', statement: 'Foo' },
            { uuid: '2', statement: 'Bar' }
          ]
        }
      });

      pressTouchable(form, child => hasText(child, 'Bar'));

      expect(onChange).toHaveBeenCalledWith([{ uuid: '2' }]);
    });

    it('disables the opposite answer when one is pressed', () => {
      const onChange = jest.fn();
      const form = renderQueryForm({
        onChange,
        query: {
          queryRule: { type: 'binary' },
          responses: [
            { uuid: '1', statement: 'Foo' },
            { uuid: '2', statement: 'Bar' }
          ]
        }
      });

      pressTouchable(form, child => hasText(child, 'Foo'));
      pressTouchable(form, child => hasText(child, 'Bar'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('accepts optional initial responseData', () => {
      const onChange = jest.fn();
      const form = renderQueryForm({
        onChange,
        query: {
          queryRule: { type: 'binary' },
          responses: [
            { uuid: '1', statement: 'Foo' },
            { uuid: '2', statement: 'Bar' }
          ]
        },
        responseData: [{ uuid: '2' }] // starts selected
      });

      pressTouchable(form, child => hasText(child, 'Bar')); // de-select

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  it('overrides default styles with passed styles', () => {
    const form = renderQueryForm({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(form).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const form = renderQueryForm({ accessibilityHint: 'foo' });
    expect(form.props.accessibilityHint).toEqual('foo');
  });
});
