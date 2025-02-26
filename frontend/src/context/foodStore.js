import { create } from "zustand";
import axios from "axios";
import useConfigStore from "./configStore";
import useAuthStore from "./authStore";

const useFoodListStore = create((set, get) => ({
  foodList: [],
  totalFoods: 0,
  currentPage: 1,
  totalPages: 0,
  cartItems: {},
  isDataFetched: false,
  resetFoodList: async () => {
    set({
      foodList: [],
      totalFoods: 0,
      currentPage: 1,
      totalPages: 0,
    });
  },

  setCartData: (cartItems) => {
    set({ cartItems });
  },
  fetchAllData: async () => {
    try {
      if (!get().isDataFetched) {
        await Promise.all([get().fetchFoodlist(), get().fetchCartData()]);
        set({ isDataFetched: true });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  fetchFoodlist: async (
    page,
    type = "menu",
    searchQuery = null,
    category = null
  ) => {
    try {
      const { url } = useConfigStore.getState();
      const endpointMap = {
        menu: "all",
        search: "search",
        categoryFilter: "filterByCategory", 
        special: "specialOffers",
      };

      const endpoint = endpointMap[type] || "all";
      const response = await axios.get(
        `${url}/api/food/${endpoint}?page=${page}&searchQuery=${searchQuery}&category=${category}`
      );
      const {
        data: newFoodList,
        totalFoods,
        currentPage,
        totalPages,
      } = response.data;
      console.log(currentPage, newFoodList);
      set((state) => ({
        foodList: [...state.foodList, ...newFoodList],
        totalFoods,
        currentPage,
        totalPages,
      }));
    } catch (error) {
      console.error("Failed to fetch food list:", error);
      throw error;
    }
  },

  fetchCartData: async () => {
    const { url } = useConfigStore.getState();
    const { token } = useAuthStore.getState();
    try {
      const response = await axios.get(`${url}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ cartItems: response.data.data });
    } catch (error) {
      console.error("Failed to get cart items:", error);
    }
  },
  updateCartItem: async (action, itemId, name, price, image, quantity) => {
    const { url } = useConfigStore.getState();
    const { token } = useAuthStore.getState();

    const payload = {
      itemId,
      name,
      price,
      image,
      quantity,
    };
    try {
      let response;
      if (action === "add") {
        response = await axios.post(`${url}/api/cart/add-to-cart`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (action === "remove") {
        response = await axios.put(`${url}/api/cart/remove`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (action === "remove-completely") {
        response = await axios.put(
          `${url}/api/cart/remove`,
          { itemId, action: "remove-completely" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      set({ cartItems: response.data.cartData });
    } catch (error) {
      console.error("Error updating cart item:", error.message);
    }
  },
  getTotalCartAmount: () => {
    let totalAmount = 0;
    const cartItems = get().cartItems;

    for (const itemId in cartItems) {
      if (cartItems.hasOwnProperty(itemId)) {
        const item = cartItems[itemId]; 
        totalAmount += item.price * item.quantity;
      }
    }

    return totalAmount;
  },

  resetCart: () => set({ cartItems: {} }),
}));

export default useFoodListStore;
