// Client-side Google Places API calls

// Use the newer Places API (Places API New)
const GOOGLE_API_URL = 'https://places.googleapis.com/v1/places:searchText'

export async function fetchRestaurants(query, location) {
  // Client-side code needs NEXT_PUBLIC_ prefix for environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY
  
  console.log('Client-side API key check:', {
    'NEXT_PUBLIC_GOOGLE_API_KEY': !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    'REACT_APP_GOOGLE_API_KEY': !!process.env.REACT_APP_GOOGLE_API_KEY,
    'finalApiKey': !!apiKey
  })
  
  if (!apiKey) {
    throw new Error('Google Places API key not configured')
  }

  const locationBias = location ? {
    circle: {
      center: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      radius: 5000.0 // 5km
    }
  } : null

  try {
    // Use the newer Places API with POST request
    const response = await fetch(GOOGLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id,places.rating,places.location,places.types'
      },
      body: JSON.stringify({
        textQuery: query && query !== "" ? `${query} restaurant` : 'restaurant',
        locationBias: locationBias,
        maxResultCount: 10,
        includedType: 'restaurant'
      })
    })
    
    console.log('Google API Response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google API error:', errorData)
      throw new Error(errorData.error?.message || 'Failed to fetch restaurants')
    }

    const data = await response.json()
    console.log('Google API response data:', data)
    
    // Transform the data to match our expected format
    let restaurants = data.places?.map(place => ({
      id: place.id,
      displayName: place.displayName,
      formattedAddress: place.formattedAddress || 'Address not available',
      rating: place.rating || 0,
      location: place.location,
      types: place.types || []
    })) || []

    // Additional client-side filtering to ensure only restaurants
    restaurants = restaurants.filter(place => {
      // Check if the place has restaurant type or if the name suggests it's a restaurant
      const hasRestaurantType = place.types?.includes('restaurant') 
      const nameIndicatesRestaurant = place.displayName?.text?.toLowerCase().includes('restaurant') ||
                                   place.displayName?.text?.toLowerCase().includes('cafe') === false // Explicitly exclude cafes
      const queryIndicatesRestaurant = query.toLowerCase().includes('restaurant') || 
                                       query.toLowerCase().includes('food') ||
                                       query.toLowerCase().includes('french fries')
      
      const isRestaurant = hasRestaurantType || nameIndicatesRestaurant || queryIndicatesRestaurant
      
      console.log(`Filtering ${place.displayName?.text}:`, {
        types: place.types,
        hasRestaurantType,
        nameIndicatesRestaurant,
        queryIndicatesRestaurant,
        isRestaurant
      })
      
      return isRestaurant
    })

    console.log('Filtered restaurants:', restaurants)

    return { restaurants }
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw error
  }
}
