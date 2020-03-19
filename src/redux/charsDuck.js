import axios from "axios";

// constantes
let initialData = {
  fetching: false,
  array: [],
  current: {}
};

const URL = "https://rickandmortyapi.com/api/character";

const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

//reducers
export default function reducer(state = initialData, action) {
  switch (action.type) {
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

//actions (thunk)
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
