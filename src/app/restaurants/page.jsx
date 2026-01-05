'use client'

import { useState, useEffect } from 'react'
import { Search, Map, List, Star, MapPin, Moon, Sun } from 'lucide-react'
import { APIProvider } from '@vis.gl/react-google-maps'
import Header from '../../components/Common/Header'
import SearchInput from '../../components/Restaurants/SearchInput'
import RestaurantsList from '../../components/Restaurants/RestaurantsList'
import MapView from '../../components/Restaurants/Map'
import { useRestaurants } from '../../hooks/useRestaurants'
import { SELECTED_VIEW } from '../../constants'

export default function RestaurantsPage() {
  const [selectedView, setSelectedView] = useState(SELECTED_VIEW.LIST)
  const [currentSearchQuery, setCurrentSearchQuery] = useState('french fries')
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Map state
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [infoWindowProps, setInfoWindowProps] = useState({})
  const [showMapSearchButton, setShowMapSearchButton] = useState(false)
  
  const {
    restaurants,
    loading,
    error,
    location,
    fetchRestaurants,
    loadNearbyRestaurants,
    setLocation
  } = useRestaurants()

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

  // Load nearby restaurants on mount
  useEffect(() => {
    loadNearbyRestaurants(currentSearchQuery)
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

  const handleSearch = (query, searchLocation) => {
    setCurrentSearchQuery(query)
    fetchRestaurants(query, searchLocation)
  }

  const handleUpdateSearchQuery = (query) => {
    setCurrentSearchQuery(query)
  }

  // Convert restaurants array to the format expected by Map component
  const convertToPinData = () => {
    return restaurants.map(restaurant => {
      const score = restaurant.fryrankRating // Only use FryRank rating, no Google fallback
      
      return {
        key: restaurant.id,
        name: restaurant.displayName?.text || restaurant.name,
        location: {
          lat: restaurant.location?.latitude || restaurant.lat,
          lng: restaurant.location?.longitude || restaurant.lng
        },
        address: restaurant.formattedAddress || restaurant.vicinity,
        score: score
      }
    }).filter(restaurant => restaurant.location.lat && restaurant.location.lng)
  }

  // Convert restaurants array to the format expected by RestaurantsList
  const restaurantsObject = restaurants.reduce((acc, restaurant) => {
    acc[restaurant.id] = restaurant
    return acc
  }, {})
  const restaurantIdsArray = restaurants.map(r => r.id)

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''}>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text fry-gradient">
            Find the Best Fries
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover and review restaurants serving the best french fries in your area.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <SearchInput
              getRestaurants={handleSearch}
              currentSearchQuery={currentSearchQuery}
              updateSearchQuery={handleUpdateSearchQuery}
              location={location}
              selectedView={selectedView}
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => setSelectedView(SELECTED_VIEW.LIST)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                selectedView === SELECTED_VIEW.LIST
                  ? 'bg-white dark:bg-gray-700 text-fry-orange shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setSelectedView(SELECTED_VIEW.MAP)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                selectedView === SELECTED_VIEW.MAP
                  ? 'bg-white dark:bg-gray-700 text-fry-orange shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-fry-orange border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading restaurants...</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="min-h-[400px]">
          {!loading && (
            <>
              {selectedView === SELECTED_VIEW.LIST && (
                <RestaurantsList
                  restaurantIds={restaurantIdsArray}
                  currentRestaurants={restaurantsObject}
                  aggregateReviewsData={{}}
                />
              )}
              
              {selectedView === SELECTED_VIEW.MAP && (
                <div className="w-full h-[calc(100vh-320px)] md:h-[calc(100vh-340px)] min-h-[300px] max-h-[600px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <MapView
                    showInfoWindow={showInfoWindow}
                    setShowInfoWindow={setShowInfoWindow}
                    setInfoWindowProps={setInfoWindowProps}
                    infoWindowProps={infoWindowProps}
                    aggregateReviewsData={{}}
                    pinData={convertToPinData()}
                    showMapSearchButton={showMapSearchButton}
                    setShowMapSearchButton={setShowMapSearchButton}
                    getRestaurants={fetchRestaurants}
                    shouldAdjustBounds={true}
                    currentSearchQuery={currentSearchQuery}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </APIProvider>
  )
}
