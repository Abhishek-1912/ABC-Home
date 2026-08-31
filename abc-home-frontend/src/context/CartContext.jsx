
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('abc-home-cart')

    return savedCart
      ? JSON.parse(savedCart)
      : []
  })

  useEffect(() => {
    localStorage.setItem(
      'abc-home-cart',
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  function addToCart(product, quantity = 1) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
        },
      ]
    })
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    )
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= 999
        ? 0
        : 99

  const total = subtotal + shipping

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

export default CartProvider
