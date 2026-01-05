import { useState, useEffect } from 'react'
import { fetchRestaurants } from '../lib/googlePlaces'
import { FRENCH_FRIES_TEXT_QUERY, AGGREGATE_INFORMATION_API_PATH } from '../constants'
import axios from 'axios'

export function useRestaurants(initialQuery = FRENCH_FRIES_TEXT_QUERY) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [location, setLocation] = useState(null)

  const fetchRestaurantsWithLocation = async (query, searchLocation) => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchRestaurants(query, searchLocation)
      
      // Fetch FryRank ratings from backend
      let aggregateReviewsData = null
      if (data.restaurants && data.restaurants.length > 0) {
        try {
          const restaurantIds = data.restaurants.map(r => r.id).join(',')
          console.log('Fetching FryRank ratings for restaurant IDs:', restaurantIds)
          console.log('Backend API path:', AGGREGATE_INFORMATION_API_PATH)
          
          const response = await axios.get(AGGREGATE_INFORMATION_API_PATH, { 
            params: { 
              ids: restaurantIds, 
              rating: true 
            } 
          })
          aggregateReviewsData = response.data.restaurantIdToRestaurantInformation
          console.log('FryRank ratings received:', aggregateReviewsData)
        } catch (ratingError) {
          console.warn('Failed to fetch FryRank ratings:', ratingError.response?.status, ratingError.response?.statusText)
          console.warn('Error details:', ratingError.response?.data)
          // Continue without ratings if backend call fails
        }
      }
      
      // Merge Google Places data with FryRank ratings
      const restaurantsWithRatings = data.restaurants.map(restaurant => {
        const fryrankData = aggregateReviewsData?.[restaurant.id]
        
        return {
          ...restaurant,
          fryrankRating: fryrankData?.averageRating || fryrankData?.avgScore || null,
          totalReviews: fryrankData?.totalReviews || fryrankData?.reviewCount || 0
        }
      })
      
      setRestaurants(restaurantsWithRatings)
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setLocation(coords)
          resolve(coords)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  const loadNearbyRestaurants = async (query) => {
    try {
      const userLocation = await getUserLocation()
      await fetchRestaurantsWithLocation(query, userLocation)
    } catch (error) {
      console.error('Error getting location, using default search:', error)
      await fetchRestaurantsWithLocation(query, null)
    }
  }

  return {
    restaurants,
    loading,
    error,
    location,
    fetchRestaurants: fetchRestaurantsWithLocation,
    loadNearbyRestaurants,
    setLocation
  }
}
