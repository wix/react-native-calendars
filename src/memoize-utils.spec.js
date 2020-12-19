const {memoize} = require('./memoize-utils');

describe('memoize', function () {
  it('should invoke actual function on first call', function () {
    // given
    const func = jest.fn(x => x);
    const memoizedFunc = memoize(func);

    // when
    const result = memoizedFunc(5);

    // then
    expect(func.mock.calls.length).toBe(1);

    expect(result).toBe(5);
  });

  it('should not invoke real func for second time for the same argument', function () {
    // given
    const func = jest.fn(x => x);
    const memoizedFunc = memoize(func);

    // when
    const result1 = memoizedFunc(5);
    const result2 = memoizedFunc(5);

    // then
    expect(func.mock.calls.length).toBe(1);

    expect(result1).toBe(5);
    expect(result2).toBe(5);
  });

  it('should work with several arguments', function () {
    // given
    const func = jest.fn((a, b, c) => a + b + c);
    const memoizedFunc = memoize(func);

    // when
    const result1 = memoizedFunc(1, 2, 3);
    const result2 = memoizedFunc(1, 2, 3);

    // then
    expect(func.mock.calls.length).toBe(1);

    expect(result1).toBe(6);
    expect(result2).toBe(6);
  });

  it('should invoke func again only for unique args', function () {
    // given
    const func = jest.fn(x => x);
    const memoizedFunc = memoize(func);

    // when
    memoizedFunc(5);
    memoizedFunc(1);
    memoizedFunc(-1);

    memoizedFunc(-9);
    memoizedFunc(-9);

    memoizedFunc(5);

    memoizedFunc(10);

    // then
    expect(func.mock.calls.length).toBe(5);
  });

  it('should work with keyExtractor', function () {
    // given
    const func = jest.fn((a, b) => a + b);
    const memoizedFunc = memoize(func, (...args) => args[0]);

    // when
    memoizedFunc(1, 2); // invoke N1
    memoizedFunc(1, 3); // skips
    memoizedFunc(2, 3); // invoke N2
    memoizedFunc(2, 5); // skips
    memoizedFunc(4, 3); // invoke N3
    memoizedFunc(4, 3); // skips

    // then
    expect(func.mock.calls.length).toBe(3);
  });
});
