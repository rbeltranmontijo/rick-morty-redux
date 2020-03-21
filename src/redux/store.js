import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import userReducer, { restoreSessionAction } from "./userDuck";
import charsReducer, { getCharactersAction } from "./charsDuck";
import thunk from "redux-thunk";

let rootReducer = combineReducers({
  user: userReducer,
  characters: charsReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  let store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );
  // Se ejecuta para saber si el usuario esa en el localStorage
  restoreSessionAction()(store.dispatch);

  // Se ejecuta la funcion para conseguir los personajes
  getCharactersAction()(store.dispatch, store.getState);

  return store;
}
