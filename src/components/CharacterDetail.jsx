import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader";

function CharacterDetail({ selectedId, onAddFavourite, isAddedToFavourites }) {
  // How to fetch a single character's data

  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setCharacter(null);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const episodesId = data.episode.map((e) => e.split("/").at(-1));

        const { data: episodesData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        setEpisodes([episodesData].flat());
      } catch (err) {
        toast.error(err.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedId) fetchData();
  }, [selectedId]);

  if (isLoading)
    return (
      <div style={{ flex: 1, color: "white" }}>
        <Loader />
      </div>
    );

  if (!character || !selectedId) {
    return (
      <div style={{ flex: 1, color: "white" }}>Please Select A Character</div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      <CharacterSubInfo
        character={character}
        onAddFavourite={onAddFavourite}
        isAddedToFavourites={isAddedToFavourites}
      />
      <EpisodeList episodes={episodes} />
    </div>
  );
}

export default CharacterDetail;

function CharacterSubInfo({ character, onAddFavourite, isAddedToFavourites }) {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === "Male" ? "👨" : "👩"}</span>
          <span>&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>
            &nbsp;{character.status} - {character.species}
          </span>
        </div>
        <div className="location">
          <p>Last known location:</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isAddedToFavourites ? (
            <p>Added To Favourites ✅</p>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => onAddFavourite(character)}
            >
              Add to favorites
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EpisodeList({ episodes }) {
  // true => earliest => asc
  const [sortBy, setSortBy] = useState(true);

  let sortedEpisodes;

  if (sortBy) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }

  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of Episodes</h2>
        <button onClick={() => setSortBy((is) => !is)}>
          <ArrowDownCircleIcon
            className="icon"
            style={{ rotate: sortBy ? "0deg" : "180deg" }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, "0")} - {item.episode}:{" "}
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
