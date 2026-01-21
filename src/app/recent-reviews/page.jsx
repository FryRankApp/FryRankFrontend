'use client'

import { useState, useEffect } from 'react'
import { Clock, Star, Moon, Sun } from 'lucide-react'
import Header from '../../components/Common/Header'
import { ReviewCardList } from '../../components/Common'
import { FrySpinner } from '../../components/Common'
import { fetchRecentReviews, fetchRestaurantDetails } from '../../utils/api'

export default function RecentReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [restaurants, setRestaurants] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Dark mode setup
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDarkMode(shouldUseDark)
    if (shouldUseDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Fetch recent reviews from backend
  useEffect(() => {
    const fetchRecentReviewsData = async () => {
      try {
        setLoading(true)
        
        // Fetch recent reviews
        const reviewsData = await fetchRecentReviews()
        
        if (reviewsData && reviewsData.reviews) {
          setReviews(reviewsData.reviews)
          
          // Fetch restaurant details for all reviews
          const restaurantIds = [...new Set(reviewsData.reviews.map(review => review.restaurantId))]
          if (restaurantIds.length > 0) {
            const restaurantPromises = restaurantIds.map(id => fetchRestaurantDetails(id))
            const restaurantResponses = await Promise.all(restaurantPromises)
            
            const restaurantMap = {}
            restaurantResponses.forEach(restaurant => {
              if (restaurant) {
                restaurantMap[restaurant.id] = restaurant
              }
            })
            setRestaurants(restaurantMap)
          }
        }
        
      } catch (err) {
        setError(err.message || 'Failed to load recent reviews')
        console.error('Error fetching recent reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentReviewsData()
  }, [])

  const reviewsBody = () => {
    if (loading) {
      return <FrySpinner />
    } else if (reviews.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No recent reviews
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Be the first to share your experience at a restaurant!
          </p>
        </div>
      )
    } else {
      return <ReviewCardList reviews={reviews} currentRestaurants={restaurants} />
    }
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header loggedIn={false} />
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-fry-orange border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading recent reviews...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header loggedIn={false} />
      
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-20 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-fry-yellow" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>
      
      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-fry-orange/10 rounded-full w-16 h-16 flex items-center justify-center">
                <Clock className="w-8 h-8 text-fry-orange" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Recent Reviews
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Latest reviews from our community
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Latest Reviews ({reviews.length})
          </h2>
          {reviewsBody()}
        </div>
      </div>
    </div>
  )
}
