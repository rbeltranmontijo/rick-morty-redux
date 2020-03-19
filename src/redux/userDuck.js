// state inicial
let initialData = {
  loggedIn: false
};

// constantes
const LOGIN = "LOGIN";

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGIN:
      break;

    default:
      return state;
  }
}

// action (action creator)
