const updateCartItems = (cartItems, item, idx) => {
  if (item.count === 0) {
    return [
      ...cartItems.slice(0, idx),
      ...cartItems.slice(idx + 1)
    ]
  }
  if (idx === -1) {
    return [
      ...cartItems,
      item
    ];
  }

  return [
    ...cartItems.slice(0, idx),
    item, 
    ...cartItems.slice(idx + 1)
  ];
};

const updateCartItem = (book, item = {}, quantity) => {
  const {id = book.id, count = 0, title = book.title, total = 0} = item;
  return {
    id, title, count: count + quantity, total: total + quantity*book.price
  };
};

const updateOrder = (state, bookId, quantity) => {
  const {shoppingCart: {cartItems}, bookList : {books} } = state;
  const book = books.find(({id}) => id === bookId);
  const itemIndex = cartItems.findIndex(({id}) => id === bookId);
  const item = cartItems[itemIndex];
  const newItem = updateCartItem(book, item, quantity);

  return {
    orderTotal: 0,
    cartItems: updateCartItems(cartItems, newItem, itemIndex)
  }
};

const updateShoppingCart = (state, action) => {
  if (state === undefined) {
    return {
      cartItems: [],
      orderTotal: 0
    }
  }
  switch (action.type) {
    case 'BOOK_ADDED_TO_CART': 
    return updateOrder(state, action.payload, 1);
    case 'BOOK_ALL_DELETED':
      const bookId = action.payload;
      const filterBooks = state.shoppingCart.cartItems.filter(book => book.id !== bookId);
      return {
        ...state,
        cartItems: filterBooks
      }
    case 'BOOK_REMOVED_FROM_CART':
      return updateOrder(state, action.payload, -1);
    default: 
      return state.shoppingCart;
    }
};

export default updateShoppingCart;