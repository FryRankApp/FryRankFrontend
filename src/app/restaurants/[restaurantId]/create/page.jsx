'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import Header from '../../../../components/Common/Header'

export default function CreateReviewPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.restaurantId

  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [score, setScore] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRestaurant = async () => {
      try {
        setLoading(true)
        
        // Mock data
        const mockRestaurant = {
          id: restaurantId,
          displayName: { text: 'Chikin Drip' },
          formattedAddress: '530 Newhall Dr, San Jose, CA 95110, USA'
        }
        
        setRestaurant(mockRestaurant)
      } catch (err) {
        setError('Failed to load restaurant data')
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      fetchRestaurant()
    }
  }, [restaurantId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !body.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      
      // TODO: Replace with actual API call
      console.log('Submitting review:', {
        restaurantId,
        title,
        body,
        score
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to restaurant reviews page
      router.push(`/restaurants/${restaurantId}`)
      
    } catch (err) {
      setError('Failed to submit review')
      console.error('Error submitting review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header loggedIn={loggedIn} />
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-fry-orange border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header loggedIn={loggedIn} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href={`/restaurants/${restaurantId}`}
            className="inline-flex items-center gap-2 text-fry-orange hover:text-fry-orange/80 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Restaurant</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Write a Review
          </h1>
          {restaurant && (
            <div className="text-gray-600 dark:text-gray-400">
              Reviewing: <span className="font-medium">{restaurant.displayName?.text}</span>
            </div>
          )}
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setScore(rating)}
                  className="p-1 transition-colors duration-200"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= score
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors duration-200`}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {score} star{score !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Review Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-fry-orange focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
              placeholder="Summarize your experience"
              required
            />
          </div>

          {/* Review Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-fry-orange focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
              placeholder="Tell us about your experience with the french fries..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-fry-orange text-white py-3 px-6 rounded-lg hover:bg-fry-orange/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            
            <Link
              href={`/restaurants/${restaurantId}`}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
