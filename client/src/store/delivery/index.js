import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  duser:[],
  orderDetails: null,
};

export const getAllDeliveryUser = createAsyncThunk(
  "/order/getAllDeliveryUser",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/delivery/orders/duser`
    );


    return response.data;
  }
);
export const getAllOrdersForDelivery = createAsyncThunk(
  "/order/getAllOrdersForDelivery",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/delivery/orders/get`
    );

    return response.data;
  }
);

export const getOrderDetailsForDelivery = createAsyncThunk(
  "/order/getOrderDetailsForDelivery",
  async (id) => {
    alert("sending the request")
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/delivery/orders/details/${id}`
    );
    

    return response.data;
  }
);

export const selectDeliveryBoy = createAsyncThunk(
  "/order/selectDeliveryBoy",
  async ({ id, deliveryId }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/delivery/orders/update/${id}`,
      {
        deliveryId,
      }
    );

    return response.data;
  }
);

const deliveryOrderSlice = createSlice({
  name: "deliveryOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForDelivery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForDelivery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForDelivery.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForDelivery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForDelivery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForDelivery.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(getAllDeliveryUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDeliveryUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.duser = action.payload.data;
      })
      .addCase(getAllDeliveryUser.rejected, (state) => {
        state.isLoading = false;
        state.duser = null;
      });
  },
});

export const { resetOrderDetails } = deliveryOrderSlice.actions;

export default deliveryOrderSlice.reducer;
