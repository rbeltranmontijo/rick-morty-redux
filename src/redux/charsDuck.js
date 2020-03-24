import axios from "axios";
import { updateDB, getFavorities } from "../firebase";
import ApolloClient, { gpl, gql } from "apollo-boost";

// constantes
let initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
  nextPage: 1
};

const URL = "https://rickandmortyapi.com/api/character";

const client = new ApolloClient({ uri: "https://rickandmortyapi.com/graphql" });

const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

const REMOVE_CHARACTER = "REMOVE_CHARACTER";
const ADD_TO_FAVORITIES = "ADD_TO_FAVORITIES";

const GET_FAVS = "GET_FAVS";
const GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
const GET_FAVS_ERROR = "GET_FAVS_ERROR";

const UPDATE_PAGE = "UPDATE_PAGE";

//reducers
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        nextPage: action.payload
      };
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
    // let favs = localStorage.getItem("favs");
    // favs = JSON.parse(favs);
    // if (favs.length > 0) {
    //   dispatch({
    //     type: GET_FAVS_SUCCESS,
    //     payload: [...favs]
    //   });
    // }
    retreiveFavs()(dispatch, getState);
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
  if (!array.length) {
    getCharactersAction()(dispatch, getState);
    return;
  }
  dispatch({ type: REMOVE_CHARACTER, payload: [...array] });
};

export const getCharactersAction = () => async (dispatch, getState) => {
  console.log("entrando en get characters");
  let query = gql`
    query($page: Int) {
      characters(page: $page) {
        info {
          pages
          next
          prev
        }
        results {
          name
          image
        }
      }
    }
  `;

  dispatch({
    type: GET_CHARACTERS
  });
  let { nextPage } = getState().characters;
  return client
    .query({
      query,
      variables: { page: nextPage }
    })
    .then((data, error) => {
      console.log(data);
      if (error) {
        dispatch({
          type: GET_CHARACTERS_ERROR,
          payload: error
        });
        return;
      }

      dispatch({
        type: GET_CHARACTERS_SUCCESS,
        payload: data.data.characters.results
      });
      dispatch({
        type: UPDATE_PAGE,
        payload: data.data.characters.info.next
          ? data.data.characters.info.next
          : 1
      });
    });

  // try {
  //   const respuesta = await axios.get(URL);
  //   return dispatch({
  //     type: GET_CHARACTERS_SUCCESS,
  //     payload: respuesta.data.results
  //   });
  // } catch (error) {
  //   console.log(error);
  //   dispatch({
  //     type: GET_CHARACTERS_ERROR,
  //     payload: error.err.response.message
  //   });
  // }
};
