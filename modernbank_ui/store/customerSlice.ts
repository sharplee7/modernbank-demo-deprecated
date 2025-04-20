import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
  isCustomer: boolean;
}

const initialState: CustomerState = {
  isCustomer: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerStatus: (state, action: PayloadAction<boolean>) => {
      state.isCustomer = action.payload;
    },
  },
});

export const { setCustomerStatus } = customerSlice.actions;
export default customerSlice.reducer; 