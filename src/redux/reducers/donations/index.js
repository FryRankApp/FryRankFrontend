export const types = {
    ADD_TO_CART: 'DONATIONS/ADD_TO_CART',
    REMOVE_FROM_CART: 'DONATIONS/REMOVE_FROM_CART',
    UPDATE_QUANTITY: 'DONATIONS/UPDATE_QUANTITY',
    START_CHECKOUT: 'DONATIONS/START_CHECKOUT',
    CANCEL_CHECKOUT: 'DONATIONS/CANCEL_CHECKOUT',
    COMPLETE_ORDER: 'DONATIONS/COMPLETE_ORDER',
    RESET_ORDER: 'DONATIONS/RESET_ORDER',
};

export const initialState = {
    // Items: [{ id, name, price, emoji, quantity }]
    cart: [],
    showCheckout: false,
    orderComplete: false,
};

const donationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ADD_TO_CART: {
            const existingItem = state.cart.find(
                (item) => item.id === action.item.id
            );

            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.id === action.item.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            return {
                ...state,
                cart: [
                    ...state.cart,
                    { ...action.item, quantity: 1 },
                ],
            };
        }

        case types.REMOVE_FROM_CART: {
            return {
                ...state,
                cart: state.cart.filter((item) => item.id !== action.id),
            };
        }

        case types.UPDATE_QUANTITY: {
            const { id, quantity } = action;

            if (quantity <= 0) {
                return {
                    ...state,
                    cart: state.cart.filter((item) => item.id !== id),
                };
            }

            return {
                ...state,
                cart: state.cart.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                ),
            };
        }

        case types.START_CHECKOUT: {
            return {
                ...state,
                showCheckout: true,
                orderComplete: false,
            };
        }

        case types.CANCEL_CHECKOUT: {
            return {
                ...state,
                showCheckout: false,
            };
        }

        case types.COMPLETE_ORDER: {
            return {
                ...state,
                cart: [],
                showCheckout: false,
                orderComplete: true,
            };
        }

        case types.RESET_ORDER: {
            return {
                ...state,
                cart: [],
                showCheckout: false,
                orderComplete: false,
            };
        }

        default:
            return state;
    }
};

export default donationsReducer;

export const donationsActions = {
    addToCart: (item) => ({ type: types.ADD_TO_CART, item }),
    removeFromCart: (id) => ({ type: types.REMOVE_FROM_CART, id }),
    updateQuantity: (id, quantity) => ({ type: types.UPDATE_QUANTITY, id, quantity }),
    startCheckout: () => ({ type: types.START_CHECKOUT }),
    cancelCheckout: () => ({ type: types.CANCEL_CHECKOUT }),
    completeOrder: () => ({ type: types.COMPLETE_ORDER }),
    resetOrder: () => ({ type: types.RESET_ORDER }),
};


