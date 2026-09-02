import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchWishlist, addToWishlistApi, removeFromWishlistApi } from '../api/wishlist'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

// Adapts backend WishlistItemDto -> shape ProductCard/WishlistPage already expect
function adaptWishlistItem(dto) {
  return {
    id: dto.productId,
    slug: dto.slug,
    name: dto.name,
    image: dto.imageUrl || 'https://placehold.co/600x600?text=ABC+Home',
    price: dto.sellingPrice,
    oldPrice: dto.mrp > dto.sellingPrice ? dto.mrp : null,
    category: '', // not included in wishlist DTO; fine for the card's small label
  }
}

function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([])
      return
    }
    try {
      const data = await fetchWishlist()
      setWishlistItems(data.map(adaptWishlistItem))
    } catch (err) {
      console.error('Failed to load wishlist', err)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  function isInWishlist(productId) {
    return wishlistItems.some((item) => item.id === productId)
  }

  async function toggleWishlist(product) {
    if (!isAuthenticated) {
      alert('Please log in to save items to your wishlist')
      return
    }

    const alreadyIn = isInWishlist(product.id)

    // optimistic update — feels instant, we still sync with server after
    if (alreadyIn) {
      setWishlistItems((current) => current.filter((item) => item.id !== product.id))
    } else {
      setWishlistItems((current) => [...current, product])
    }

    try {
      if (alreadyIn) {
        await removeFromWishlistApi(product.id)
      } else {
        await addToWishlistApi(product.id)
      }
    } catch (err) {
      // roll back on failure
      refreshWishlist()
      alert(err.message)
    }
  }

  async function removeFromWishlist(productId) {
    setWishlistItems((current) => current.filter((item) => item.id !== productId))
    try {
      await removeFromWishlistApi(productId)
    } catch (err) {
      refreshWishlist()
      alert(err.message)
    }
  }

  function clearWishlist() {
    // No bulk-clear endpoint yet — remove one by one
    wishlistItems.forEach((item) => removeFromWishlistApi(item.id).catch(() => {}))
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
        refreshWishlist,
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