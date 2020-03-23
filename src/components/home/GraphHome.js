import React, { useEffect, useState } from "react";
import Card from "../card/Card";

import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";

const GraphHome = () => {
  const [chars, setChars] = useState([]);

  const query = gql`
    {
      characters {
        results {
          name
          image
        }
      }
    }
  `;

  let { data, loading, error } = useQuery(query);

  useEffect(() => {
    console.log(data);
    if (data && !loading && !error) {
      setChars([...data.characters.results]);
    }
  }, [data]);

  const nextCharacter = () => {
    chars.shift();
    setChars([...chars]);
  };

  if (loading) return <h1>Cargando...</h1>;
  return (
    <Card
      //   rightClick={addFav}
      leftClick={nextCharacter}
      {...chars[0]}
    />
  );
};

export default GraphHome;
