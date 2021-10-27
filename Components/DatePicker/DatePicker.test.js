import { DatePicker } from './DatePicker';
import { getRenderer, getStyle } from '../../../TestUtils';

const renderDatePicker = getRenderer(DatePicker, {
  onDate: () => {}
});

describe('DatePicker', () => {
  it('renders', () => {
    expect(renderDatePicker()).toBeTruthy();
  });

  it('calls passed onDate function with the selected Date', () => {
    const selectedDate = new Date(2010, 0, 1);
    const onDate = jest.fn();
    const datePicker = renderDatePicker({ onDate });

    datePicker.props.onChange({
      nativeEvent: {
        timestamp: selectedDate.getTime()
      }
    });

    expect(onDate).toHaveBeenCalledWith(selectedDate);
  });

  it('overrides default styles with passed styles', () => {
    const datePicker = renderDatePicker({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(datePicker).backgroundColor).toEqual('#F00BA4');
  });

  it('passes on any additional props', () => {
    const datePicker = renderDatePicker({ testID: 'foo' });
    expect(datePicker.props.testID).toEqual('foo');
  });
});
