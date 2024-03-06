import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemsSlected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
  isSucessOrder: false,
  notify: 0,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const existingOrderItem = state?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );
      if (existingOrderItem) {
        existingOrderItem.amount += orderItem.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const orderItem = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const orderItemSelected = state?.orderItemsSlected?.find(
        (item) => item?.product === idProduct
      );
      orderItem.amount++;
      if (orderItemSelected) {
        orderItemSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const orderItem = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const orderItemSelected = state?.orderItemsSlected?.find(
        (item) => item?.product === idProduct
      );
      orderItem.amount--;
      if (orderItemSelected) {
        orderItemSelected.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      const orderItem = state?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      const orderItemSeleted = state?.orderItemsSlected?.filter(
        (item) => item?.product !== idProduct
      );
      state.orderItems = orderItem;
      state.orderItemsSlected = orderItemSeleted;
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;
      const orderItems = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      const orderItemsSelected = state?.orderItemsSlected?.filter(
        (item) => !listChecked.includes(item.product)
      );
      state.orderItems = orderItems;
      state.orderItemsSlected = orderItemsSelected;
    },
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      const orderSelected = [];
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order);
        }
      });
      state.orderItemsSlected = orderSelected;
    },
    notifyOrder: (state, action) => {
      state.notify += 1;
    },
    resetNotifyOrder: (state, action) => {
      if (state.notify >= 1) state.notify -= 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
  notifyOrder,
  resetNotifyOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
