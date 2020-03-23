import React from "react";
import Card from "../card/Card";
import styles from "./home.module.css";
import {
  removeCharacterAction,
  addToFavoritesAction
} from "../../redux/charsDuck";
import { useSelector, useDispatch } from "react-redux";

function Home() {
  const chars = useSelector(state => state.characters.array);

  const dispatch = useDispatch();
  const removeCharacterActionComponent = () =>
    dispatch(removeCharacterAction());

  const addToFavoritesActionComponent = () => dispatch(addToFavoritesAction());

  function addFav() {
    addToFavoritesActionComponent();
  }

  function renderCharacter() {
    let char = chars[0];
    return <Card rightClick={addFav} leftClick={nextCharacter} {...char} />;
  }

  function nextCharacter() {
    removeCharacterActionComponent();
  }

  return (
    <div className={styles.container}>
      <h2>Personajes de Rick y Morty</h2>
      <div>{renderCharacter()}</div>
    </div>
  );
}

// function mapState(state) {
//   return {
//     chars: state.characters.array
//   };
// }

// export default connect(mapState, { removeCharacterAction })(Home);
export default Home;
