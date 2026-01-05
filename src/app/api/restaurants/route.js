import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'french fries'
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  
  // In Next.js API routes, we need to access the environment variable directly
  // Since you mentioned REACT_APP_GOOGLE_API_KEY, let's use that specifically
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY
  
  console.log('API Key check:', {
    'REACT_APP_GOOGLE_API_KEY': !!process.env.REACT_APP_GOOGLE_API_KEY,
    'apiKeyLength': process.env.REACT_APP_GOOGLE_API_KEY?.length || 0
  })

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Places API key not configured. Please set GOOGLE_PLACES_API_KEY in your .env file' },
      { status: 500 }
    )
  }

  try {
    // Use Google Places API Nearby Search
    const location = lat && lng ? `${lat},${lng}` : '40.7128,-74.0060' // Default to NYC
    const radius = '5000' // 5km radius
    
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${encodeURIComponent(query)}&type=restaurant&key=${apiKey}`
    
    console.log('Making request to:', placesUrl)
    console.log('Request headers will include:')
    console.log('- Referer: Will be set automatically by fetch')
    console.log('- User-Agent: Will be set automatically by fetch')
    
    const response = await fetch(placesUrl, {
      headers: {
        'Referer': 'http://localhost:3000',
        'User-Agent': 'FryRank-NextJS-App'
      }
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const data = await response.json()
    
    console.log('Google API Response:', {
      status: data.status,
      error_message: data.error_message,
      results_count: data.results?.length || 0
    })
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      let errorDetails = data.error_message || 'No additional details available'
      
      // Special handling for referer restriction error
      if (data.error_message?.includes('referer restrictions')) {
        errorDetails = 'Your Google API key has referer restrictions enabled. Please go to Google Cloud Console → APIs & Services → Credentials → Edit API key → Remove referer restrictions or add your domain to the allowed list.'
      }
      
      return NextResponse.json(
        { 
          error: `Google Places API error: ${data.status}`,
          details: errorDetails,
          api_key_length: apiKey.length,
          api_key_prefix: apiKey.substring(0, 8) + '...'
        },
        { status: 400 }
      )
    }

    // Transform the data to match our expected format
    const restaurants = data.results?.map(place => ({
      id: place.place_id,
      displayName: { text: place.name },
      formattedAddress: place.vicinity || place.formatted_address || 'Address not available',
      rating: place.rating || 0,
      location: {
        latitude: place.geometry?.location.lat,
        longitude: place.geometry?.location.lng
      }
    })) || []

    return NextResponse.json({ restaurants })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}
