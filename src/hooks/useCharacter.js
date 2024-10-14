// useEffect(() => {
//   setIsLoading(true);
//   axios
//     .get("https://rickandmortyapi.com/api/character")

import axios from "axios";
import toast from "react-hot-toast";

//     .then(({ data }) => {
//       setCharacters(data.results);
//     })
//     .catch((err) => {
//       console.log(err);
//       toast.error(err.response.data.error);
//     })
//     .finally(() => setIsLoading(false));
// }, []);
// -------------------------------------------
// Dependancy Array:
// 1. useEffect(()=>{}) => Effect runs on every render
// 2. useEffect(()=>{}, []) => Effect runs on initial mount
// 3. useEffect(()=>{
// if(state) ...
// }, [state]) => Effect runs when the dep. array changes

// 1. Role of dep. array? To Decide when to run effect function
// 2. Which states are written in dep. array? The ones that are written in the effect function
// 3. Why is it not recommended to use dep. array? Because it brings about an additional rendering
// 4. When does useEffect run? It runs after "browser paint" (re-render)
// 5. Why afterwards? Scenerio: What if the effect takes a significant amount of time to run? Why not show the user some data until then?
// -------------------------------------------
// Clean Up Function
// Why do we use it? To prevent memory leaks & unwanted-unnecessory behavior
// When does it run?
//    1. The moment the component unmounts
//    2. Between two re-renders (Before the next re-render)
// Is it mandetory to use it? No, using it is optional
// where is it necessory to use? When the side effect keeps running ...
//    1.  after the component unmounts
//    2.  while re-renderings
// Examples of components, which keeps running after they unmount:
// Fetch API , Timer , EventListener , ...
// Timer Example
// useEffect(() => {
//   const interval = setInterval(() => setCount((c) => c + 1), 1000);
//   return () => {
//     clearInterval(interval);
//   };
// }, [count]);
import { useEffect, useState } from "react";

export default function useCharacter(url, query) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);
        setCharacters([]);

        const { data } = await axios.get(
          `${url}=${query}`,
          { signal }
        );
        setCharacters(data.results);
      } catch (err) {
        // fetch => err.name === "AbortError"
        // axios => axios.isCancel()
        if (err.name === "CanceledError") {
          console.log("Cancelled Successfully");
        } else {
          setCharacters([]);
          toast.error(err.response.data.error);
          toast.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // if (query.length < 2) {
    //   setCharacters([]);
    //   return;
    // }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { characters, isLoading };
}
