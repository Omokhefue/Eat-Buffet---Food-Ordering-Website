import React from "react";
import useFoodStore from "../../context/singleFoodStore";
import FoodItem from "../foodItem/FoodItem";
import "./recommendations.scss";
const Recommendations = () => {
  const { recommendations } = useFoodStore();

  return (
    <div className="food-display">
      {recommendations.length > 0 ? (
        <>
          <h2>Similar Items</h2>
          <div className="food-display-list">
            {recommendations.map((item, index) => (
              <FoodItem key={index} item={item} display={false} />
            ))}
          </div>
        </>
      ) : (
        <p>No Similar Items Currently Available</p>
      )}
    </div>
  );
};

export default Recommendations;
