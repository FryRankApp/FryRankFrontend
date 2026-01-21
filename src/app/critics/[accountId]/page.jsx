'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, Star, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import Header from '../../../components/Common/Header'
import { ReviewCardList } from '../../../components/Common'
import { FrySpinner } from '../../../components/Common'
import { fetchAccountReviews, fetchRestaurantDetails, fetchUserSettings } from '../../../utils/api'

export default function CriticReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.accountId

  const [reviews, setReviews] = useState([])
  const [restaurants, setRestaurants] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userSettings, setUserSettings] = useState(null)
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

  // Fetch critic data from backend
  useEffect(() => {
    const fetchCriticData = async () => {
      try {
        setLoading(true)
        
        // Fetch reviews and user settings in parallel
        const [reviewsResponse, userSettingsResponse] = await Promise.all([
          fetchAccountReviews(accountId),
          fetchUserSettings(accountId)
        ])
        
        // Set reviews data
        if (reviewsResponse && reviewsResponse.reviews) {
          setReviews(reviewsResponse.reviews)
          
          // Fetch restaurant details for all reviews
          const restaurantIds = [...new Set(reviewsResponse.reviews.map(review => review.restaurantId))]
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
        
        // Set user settings
        if (userSettingsResponse) {
          setUserSettings(userSettingsResponse)
        }
        
      } catch (err) {
        setError(err.message || 'Failed to load critic data')
        console.error('Error fetching critic:', err)
      } finally {
        setLoading(false)
      }
    }

    if (accountId) {
      fetchCriticData()
    }
  }, [accountId])

  const reviewsBody = () => {
    if (loading) {
      return <FrySpinner />
    } else if (reviews.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            This critic hasn't published any reviews yet.
          </p>
        </div>
      )
    } else {
      return <ReviewCardList reviews={reviews} currentRestaurants={restaurants} />
    }
  }

  const criticName = userSettings?.username || accountId

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header loggedIn={false} />
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-fry-orange border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading critic profile...</p>
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
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 text-fry-orange hover:text-fry-orange/80 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Restaurants</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Critic Header */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-fry-orange/10 rounded-full w-16 h-16 flex items-center justify-center">
                <User className="w-8 h-8 text-fry-orange" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {criticName}'s Reviews
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''} published
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Published Reviews
          </h2>
          {reviewsBody()}
        </div>
      </div>
    </div>
  )
}
