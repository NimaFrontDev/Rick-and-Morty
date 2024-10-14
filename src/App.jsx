import { useEffect, useState } from "react";
import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar, { Favourites, Search, SearchResult } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import useCharacter from "./hooks/useCharacter";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [query, setQuery] = useState("");
  const { characters, isLoading } = useCharacter(
    "https://rickandmortyapi.com/api/character/?name",
    query
  );
  const [selectedId, setSelectedId] = useState(null);
  const [Favourites, setFavourites] = useLocalStorage("FAVORITES", []);

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };
  const handleAddFavourite = (char) => {
    setFavourites((prevFav) => [...prevFav, char]);
  };
  const handleDeleteFavorite = (id) =>
    setFavourites((prevFav) => prevFav.filter((fav) => fav.id !== id));
  const isAddedToFavourites = Favourites
    .map((fav) => fav.id)
    .includes(selectedId);

  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult numOfResult={characters.length} />
        <Favourites
          favourites={Favourites}
          onDeleteFavorite={handleDeleteFavorite}
        />
      </Navbar>
      <Main characters={characters}>
        <CharacterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
        />
        <CharacterDetail
          isAddedToFavourites={isAddedToFavourites}
          selectedId={selectedId}
          onAddFavourite={handleAddFavourite}
        />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
