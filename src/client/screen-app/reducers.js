export const initialState = { currentView: 'verify' };

export default function rootReducer(state, action) {
  console.log({ action });
  switch (action.type) {
    default:
      return { ...state, [action.type]: action.value };
  }
}
