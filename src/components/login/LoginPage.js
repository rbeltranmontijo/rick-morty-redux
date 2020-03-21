import React from "react";
import styles from "./login.module.css";
import { connect } from "react-redux";

import { doGoogleLoginAction } from "../../redux/userDuck";

function LoginPage({ loggedIn, fetching, doGoogleLoginAction }) {
  function doLogin() {
    doGoogleLoginAction();
  }

  if (fetching) {
    return <h2>Cargando...</h2>;
  }

  return (
    <div className={styles.container}>
      {loggedIn ? <h1>Cierra tu sesión</h1> : <h1>Inicia Sesión con Google</h1>}
      {loggedIn ? (
        <button>Cerrar Sesión</button>
      ) : (
        <button onClick={doLogin}>Iniciar</button>
      )}
    </div>
  );
}

function mapState({ user: { fetching, loggedIn } }) {
  return { fetching, loggedIn };
}

export default connect(mapState, { doGoogleLoginAction })(LoginPage);
