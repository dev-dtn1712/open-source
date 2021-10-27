import { Input } from './Input';
import { getRenderer, getStyle } from '../../../TestUtils';

const renderInput = getRenderer(Input);

describe('Input', () => {
  it('renders', () => {
    expect(renderInput()).toBeTruthy();
  });

  it('overrides default styles with passed styles', () => {
    const input = renderInput({
      style: {
        backgroundColor: '#F00BA4'
      }
    });

    expect(getStyle(input).backgroundColor).toEqual('#F00BA4');
  });
});
