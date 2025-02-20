import React, { useEffect, useState } from "react";
import "./search.scss";
import Spinner from "../../components/Spinner/Spinner";
import FoodItem from "../../components/foodItem/FoodItem";
import useFoodListStore from "../../context/foodStore";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetFoodList, foodList, fetchFoodlist, currentPage, totalPages } =
    useFoodListStore();

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      setError("");
      setClicked(false);
    };
    

  useEffect(() => {
    resetFoodList();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    resetFoodList();
    setLoading(true);
    setClicked(true);
    setError("");

    try {
      await fetchFoodlist(1, "search", searchQuery);
    } catch (err) {
      setError("It's us not you. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        !loading && foodList.length > 0 ? "search-food success" : "search-food "
      }`}
    >
      <div className={`${foodList.length > 0 ? "aside success" : "aside "}`}>
        <input
          type="text"
          placeholder="Search for food..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>Search</button>
        {error && <p className="message">{error}</p>}
        {clicked && !loading && foodList.length === 0 && (
          <p className="message">No food items found that match your serach</p>
        )}
      </div>

      {loading && <Spinner />}

      <div className="search-results">
        {!loading &&
          foodList.length > 0 &&
          foodList.map((food) => <FoodItem key={food._id} item={food} />)}
      </div>

      {currentPage < totalPages && (
        <button
          className="more"
          onClick={() => fetchFoodlist(currentPage + 1, "search", searchQuery)}
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default Search;