function memoize(fn, keyExtractor) {
  let cache = {};
  return function (...args) {
    const hash = JSON.stringify(keyExtractor ? keyExtractor(...args) : args);
    if (hash in cache) {
      return cache[hash];
    }

    let result = fn(...args);
    cache[hash] = result;
    return result;
  };
}

module.exports = {
  memoize
};
