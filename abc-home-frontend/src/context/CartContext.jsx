import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  fetchCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCartApi,
} from '../api/cart'
import { useAuth } from './AuthContext'

const CartContext = createContext()

// Adapts the backend's CartResponse.Item shape into what CartPage/Navbar/etc already expect
function adaptCartItem(item) {

  console.log("Raw backend cart item:", item);
  return {
    id: item.cartItemId ?? item.id,  // <-- Fallback to item.id if cartItemId is undefined // components use item.id as the key for update/remove
    productId: item.productId,
    variantId: item.variantId,
    name: item.productName,
    slug: item.productSlug,
    image: item.imageUrl,
    category: item.variantLabel || '', // reused for the small label line under the name
    price: item.unitPrice,
    quantity: item.quantity,
  }
}

function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([])
      setSubtotal(0)
      return
    }
    setLoading(true)
    try {
      const data = await fetchCart()
      setCartItems(data.items.map(adaptCartItem))
      setSubtotal(data.subtotal)
    } catch (err) {
      console.error('Failed to load cart', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  async function addToCart(product, quantity = 1) {
    if (!isAuthenticated) {
      alert('Please log in to add items to your cart')
      return
    }
    try {
      const data = await addCartItem({
        productId: product.id,
        variantId: product.variantId || null,
        quantity,
      })
      setCartItems(data.items.map(adaptCartItem))
      setSubtotal(data.subtotal)
    } catch (err) {
      alert(err.message)
    }
  }

 async function removeFromCart(cartItemId) {
  if (!cartItemId) {
    console.error("removeFromCart called with an invalid ID:", cartItemId);
    alert("Could not remove item: Missing item identifier.");
    return;
  }
  try {
    const data = await removeCartItem(cartItemId);
    setCartItems(data.items.map(adaptCartItem));
    setSubtotal(data.subtotal);
  } catch (err) {
    alert(err.message);
  }
}

async function updateQuantity(cartItemId, quantity) {
  if (!cartItemId) {
    console.error("updateQuantity called with an invalid ID:", cartItemId);
    alert("Could not update quantity: Missing item identifier.");
    return;
  }
  try {
    const data = await updateCartItemQuantity(cartItemId, quantity);
    setCartItems(data.items.map(adaptCartItem));
    setSubtotal(data.subtotal);
  } catch (err) {
    alert(err.message);
  }
}
  async function clearCart() {
    try {
      const data = await clearCartApi()
      setCartItems(data.items.map(adaptCartItem))
      setSubtotal(data.subtotal)
    } catch (err) {
      alert(err.message)
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        totalItems,
        subtotal,
        shipping,
        total,
        loading,
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