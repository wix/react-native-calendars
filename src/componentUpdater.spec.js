import {shouldUpdate} from './componentUpdater';

describe('component updater', () => {
  it('should return true if two different objects are provided with same path', async () => {
    const a = {details: 'whoa'};
    const b = {details: 'whoax'};
    const paths = ['details'];

    expect(shouldUpdate(a, b, paths)).toEqual(true);
  });

  it('should return false if two same objects are provided with same path', async () => {
    const a = {details: 'whoa'};
    const b = {details: 'whoa'};
    const paths = ['details'];

    expect(shouldUpdate(a, b, paths)).toEqual(false);
  });

  it('should return true if two different deep objects are provided with same path', async () => {
    const a = {details: {x: {y: 1}}};
    const b = {details: {x: {y: 2}}};
    const paths = ['details'];

    expect(shouldUpdate(a, b, paths)).toEqual(true);
  });

  it('should return false if two same deep objects are provided with same path', async () => {
    const a = {details: {x: {y: 1}}};
    const b = {details: {x: {y: 1}}};
    const paths = ['details'];

    expect(shouldUpdate(a, b, paths)).toEqual(false);
  });

  it('should return false if several same deep objects are provided with same path', async () => {
    const a = {details: {x: {y: 1}}, details2: {x: {y: 2}}, porage: 'yes'};
    const b = {details: {x: {y: 1}}, details2: {x: {y: 2}}, porage: 'yes'};
    const paths = ['details', 'details2', 'porage'];

    expect(shouldUpdate(a, b, paths)).toEqual(false);
  });

  it('should return true if several different deep objects are provided with same path', async () => {
    const a = {details: {x: {y: 1}}, details2: {x: {y: 2}}, porage: 'yes'};
    const b = {details: {x: {y: 1}}, details2: {x: {y: 2}}, porage: 'no'};
    const paths = ['details', 'details2', 'porage'];

    expect(shouldUpdate(a, b, paths)).toEqual(true);
  });

  it('should return true if two different deep props of objects are provided with same path', async () => {
    const a = {details: {x: {y: 1}}, details2: {x: {y: 2}}, porage: 'yes'};
    const b = {details: {x: {y: 2}}, details2: {x: {y: 2}}, porage: 'yes'};
    const paths = ['details.x.y', 'details2', 'porage'];

    expect(shouldUpdate(a, b, paths)).toEqual(true);
  });

  it('should return false if two same deep props of objects are provided with same path', async () => {
    const a = {details: {x: {y: 1}, y: '1'}, details2: {x: {y: 2}}, porage: 'yes'};
    const b = {details: {x: {y: 1}}, details2: {x: {y: 2}}, porage: 'yes'};
    const paths = ['details.x.y', 'details2', 'porage'];

    expect(shouldUpdate(a, b, paths)).toEqual(false);
  });
});
