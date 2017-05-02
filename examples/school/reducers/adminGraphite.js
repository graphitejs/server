export default function adminGraphite(state = [], action) {
  switch (action.type) {
  case 'ADD_STORE':
    return { ...state, ...action.props };
  default:
    return state;
  }
}
