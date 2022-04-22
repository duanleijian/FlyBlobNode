export function extractKeyWord(targetStr, minLen, maxLen) {
  const keys = [];
  for (let i = minLen; i < maxLen; i++) {
    for (let cur = 0; cur <= targetStr.length - i; cur++) {
      keys.push(targetStr.substr(cur, i));
    }
  }
  return keys;
}
