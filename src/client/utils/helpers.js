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
  (getMostRecentMessage(arr) && getMostRecentMessage(arr).MessageId) ||
  (getMostRecentMessage(arr) && getMostRecentMessage(arr).SessionId) ||
  null;

export const formatCallOrMessageData = (arr, { id, statusDescriptor }) =>
  arr && arr.length
    ? arr
        .sort((a, b) => b.Timestamp - a.Timestamp)
        .reduce((reducedList, item) => {
          const reducedItem = {
            ...item,
            [item[statusDescriptor]]: item.Timestamp,
            Status: item[statusDescriptor],
          };
          // the first time this cycles through, our reducedList will just be a single item.
          if (!Array.isArray(reducedList)) return [{ ...reducedItem }];

          // check if there is already a item with the given id in reducedList
          const indexOfExistingMessage = reducedList.findIndex(
            reducedMessage => reducedMessage[id] === item[id]
          );

          if (indexOfExistingMessage === -1) {
            return [...reducedList, { ...reducedItem }];
          }

          reducedList.splice(indexOfExistingMessage, 1, {
            ...reducedList[indexOfExistingMessage],
            ...reducedItem,
          });
          return [...reducedList];
        })
    : [];
