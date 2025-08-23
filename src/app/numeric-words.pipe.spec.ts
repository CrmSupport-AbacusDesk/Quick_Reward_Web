import { NumericWordsPipe } from './numeric-words.pipe';

describe('NumericWordsPipe', () => {
  it('create an instance', () => {
    const pipe = new NumericWordsPipe();
    expect(pipe).toBeTruthy();
  });
});
