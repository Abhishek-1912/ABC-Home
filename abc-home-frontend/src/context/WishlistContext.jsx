
import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext()

function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('abc-home-wishlist')

    return savedWishlist
      ? JSON.parse(savedWishlist)
      : []
  })

  useEffect(() => {
    localStorage.setItem(
      'abc-home-wishlist',
      JSON.stringify(wishlistItems)
    )
  }, [wishlistItems])

  function isInWishlist(productId) {
    return wishlistItems.some(
      (item) => item.id === productId
    )
  }

  function toggleWishlist(product) {
    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) => item.id === product.id
      )

      if (exists) {
        return currentItems.filter(
          (item) => item.id !== product.id
        )
      }

      return [
        ...currentItems,
        product,
      ]
    })
  }

  function removeFromWishlist(productId) {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    )
  }

  function clearWishlist() {
    setWishlistItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}

export default WishlistProvider
