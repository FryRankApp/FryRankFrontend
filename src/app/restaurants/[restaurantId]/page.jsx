'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin, Plus, LogIn } from 'lucide-react'
import Link from 'next/link'
import Header from '../../../components/Common/Header'
import { ReviewCardList } from '../../../components/Common'
import RestaurantHeader from '../../../components/Common/RestaurantHeader'
import { FrySpinner } from '../../../components/Common'

export default function RestaurantReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.restaurantId

  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [averageScore, setAverageScore] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true)
        
        // TODO: Replace with actual API calls
        // const restaurantResponse = await fetchRestaurantDetails(restaurantId)
        // const reviewsResponse = await fetchRestaurantReviews(restaurantId)
        
        // Mock data for demonstration
        const mockRestaurant = {
          id: restaurantId,
          displayName: { text: 'Chikin Drip' },
          formattedAddress: '530 Newhall Dr, San Jose, CA 95110, USA',
          rating: 4.2
        }
        
        const mockReviews = [
          {
            reviewId: '1',
            accountId: 'user1',
            title: 'Amazing fries!',
            body: 'The french fries here are absolutely incredible. Perfectly crispy and well-seasoned.',
            score: 5,
            isoDateTime: '2024-01-15T10:30:00Z',
            userMetadata: { username: 'FryLover123' }
          },
          {
            reviewId: '2', 
            accountId: 'user2',
            title: 'Good but could be better',
            body: 'Decent fries but a bit oily. The service was friendly though.',
            score: 3,
            isoDateTime: '2024-01-10T14:20:00Z',
            userMetadata: { username: 'FoodCritic' }
          }
        ]

        setRestaurant(mockRestaurant)
        setReviews(mockReviews)
        
        // Calculate average score
        if (mockReviews.length > 0) {
          const avg = mockReviews.reduce((sum, review) => sum + review.score, 0) / mockReviews.length
          setAverageScore(avg)
        }
        
      } catch (err) {
        setError('Failed to load restaurant data')
        console.error('Error fetching restaurant:', err)
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      fetchRestaurantData()
    }
  }, [restaurantId])

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
            Be the first to share your experience at this restaurant!
          </p>
        </div>
      )
    } else {
      return <ReviewCardList reviews={reviews} />
    }
  }

  if (loading && !restaurant) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header loggedIn={false} />
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-fry-orange border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading restaurant...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header loggedIn={loggedIn} />
      
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

        {/* Restaurant Header */}
        {restaurant && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <RestaurantHeader 
                currentRestaurant={restaurant} 
                averageScore={averageScore} 
              />
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                {loggedIn ? (
                  <Link
                    href={`/restaurants/${restaurantId}/create`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-fry-orange text-white rounded-lg hover:bg-fry-orange/90 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Write a Review
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  >
                    <LogIn className="w-4 h-4" />
                    Log in to Write a Review
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Reviews ({reviews.length})
          </h2>
          {reviewsBody()}
        </div>
      </div>
    </div>
  )
}
