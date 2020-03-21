import { loginWithGoogle, signOutGoogle } from "../firebase";

// state inicial
let initialData = {
  loggedIn: false,
  fetching: false
};

// constantes
const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";

const LOGOUT = "LOGOUT";

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGOUT:
      return { ...initialData };

    case LOGIN:
      return { ...state, fetching: true };

    case LOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        loggedIn: true,
        ...action.payload
      };

    case LOGIN_ERROR:
      return { ...state, fetching: false, error: action.payload };

    default:
      return state;
  }
}

// funciones auxiliares
function saveStorage(storage) {
  localStorage.storage = JSON.stringify(storage);
}

// action (action creator)
export let logOutAction = () => (dispatch, getState) => {
  signOutGoogle();
  dispatch({
    type: LOGOUT
  });
  localStorage.removeItem("storage");
};

export let restoreSessionAction = () => dispatch => {
  let storage = localStorage.getItem("storage");
  storage = JSON.parse(storage);
  if (storage && storage.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: storage.user
    });
  }
};

export let doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({
    type: LOGIN
  });
  return loginWithGoogle()
    .then(user => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }
      });
      saveStorage(getState());
    })
    .catch(e => {
      console.log(e);
      dispatch({
        type: LOGIN_ERROR,
        payload: e.message
      });
    });
};
