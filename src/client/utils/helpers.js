export function isNumeric(str) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && !isNaN(parseFloat(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
  ); // ...and ensure strings of whitespace fail
}

export const reduceToNumbers = number => {
  return number.split('').reduce((acc, curr) => {
    if (isNumeric(curr)) {
      return acc + curr;
    }
    return acc;
  }, '');
};

export const getMostRecentMessage = arr =>
  [...arr].reverse().find(m => m.Direction === 'inbound');

export const getMostRecentMessageId = arr =>
  getMostRecentMessage(arr).MessageId || getMostRecentMessage(arr).SessionId;
