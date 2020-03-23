import axios from "axios";
import { updateDB, getFavorities } from "../firebase";

// constantes
let initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: []
};

const URL = "https://rickandmortyapi.com/api/character";

const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

const REMOVE_CHARACTER = "REMOVE_CHARACTER";
const ADD_TO_FAVORITIES = "ADD_TO_FAVORITIES";

const GET_FAVS = "GET_FAVS";
const GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
const GET_FAVS_ERROR = "GET_FAVS_ERROR";

//reducers
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case GET_FAVS:
      return {
        ...state,
        fetching: true
      };
    case GET_FAVS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case GET_FAVS_SUCCESS:
      return {
        ...state,
        fetching: false,
        favorites: action.payload
      };
    case ADD_TO_FAVORITIES:
      return {
        ...state,
        ...action.payload
      };
    case REMOVE_CHARACTER:
      return {
        ...state,
        array: action.payload
      };

    case GET_CHARACTERS:
      return {
        ...state,
        fetching: true
      };

    case GET_CHARACTERS_SUCCESS:
      return {
        ...state,
        array: action.payload,
        fetching: false
      };

    case GET_CHARACTERS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload
      };

    default:
      return state;
  }
}

// funciones auxiliares
function saveStorageFavs(favs) {
  localStorage.favs = JSON.stringify(favs);
}

//actions (thunk)
export const restoreFavsFromLocalStorage = () => (dispatch, getState) => {
  let storage = localStorage.getItem("storage");
  storage = JSON.parse(storage);

  if (storage && storage.user) {
    let favs = localStorage.getItem("favs");
    favs = JSON.parse(favs);
    if (favs.length > 0) {
      dispatch({
        type: GET_FAVS_SUCCESS,
        payload: [...favs]
      });
    }
  }
};
export const retreiveFavs = () => (dispatch, getState) => {
  dispatch({
    type: GET_FAVS
  });
  let { uid } = getState().user;
  return getFavorities(uid)
    .then(array => {
      dispatch({
        type: GET_FAVS_SUCCESS,
        payload: [...array]
      });
      saveStorageFavs([...array]);
    })
    .catch(e => {
      console.log(e);
      dispatch({
        type: GET_FAVS_ERROR,
        payload: e.message
      });
    });
};

export const addToFavoritesAction = () => (dispatch, getState) => {
  let { array, favorites } = getState().characters;
  let { uid } = getState().user;
  let char = array.shift();
  favorites.push(char);
  updateDB(favorites, uid);
  dispatch({
    type: ADD_TO_FAVORITIES,
    payload: { array: [...array], favorites: [...favorites] }
  });
};

export const removeCharacterAction = () => (dispatch, getState) => {
  let { array } = getState().characters;
  array.shift();
  dispatch({ type: REMOVE_CHARACTER, payload: [...array] });
};

export const getCharactersAction = () => async (dispatch, getState) => {
  dispatch({
    type: GET_CHARACTERS
  });
  try {
    const respuesta = await axios.get(URL);
    return dispatch({
      type: GET_CHARACTERS_SUCCESS,
      payload: respuesta.data.results
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_CHARACTERS_ERROR,
      payload: error.err.response.message
    });
  }
};
