import React, { useEffect, useState } from "react";
import axios from "axios";
import "./singleItem.scss";
import useConfigStore from "../../context/configStore";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import useFoodListStore from "../../context/foodStore";
import useFoodStore from "../../context/singleFoodStore";
import Reviews from "../../components/reviews/Reviews";
import Recommendations from "../../components/recommendations/Recommendations";
import SingleFoodItemDetails from "../../components/singleFoodItemDetails/SingleFoodItemDetails";

const SingleItem = () => {
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useConfigStore();
  const { id } = useParams();
  const { fetchCartData } = useFoodListStore();

  const {
    reviews,
    recommendations,
    setReviews,
    setRecommendations,
    setAverageRating,
  } = useFoodStore();

  const fetchFoodItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/${id}`);
      setFoodItem(response.data.foodItem);
      setReviews(response.data.reviews || []);

      console.log(reviews);
      setAverageRating(response.data.foodItem.averageRating);
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      setError("Failed to fetch food item details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItem();
    fetchCartData();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="food-item-page">
      {foodItem && <SingleFoodItemDetails foodItem={foodItem} />}
      {reviews && <Reviews foodId={foodItem._id} />}
      {recommendations && <Recommendations />}
    </div>
  );
};

export default SingleItem;
