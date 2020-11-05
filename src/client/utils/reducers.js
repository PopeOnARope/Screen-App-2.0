// eslint-disable-next-line import/prefer-default-export
export const reduceCallOrMessageData = (arr, { id, statusDescriptor }) =>
  arr
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
    });
