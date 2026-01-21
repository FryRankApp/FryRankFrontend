import axios from 'axios';

const BACKEND_SERVICE_PATH = process.env.NEXT_PUBLIC_BACKEND_SERVICE_PATH || process.env.REACT_APP_BACKEND_SERVICE_PATH;
const REVIEWS_API_PATH = `${BACKEND_SERVICE_PATH}/reviews`;
const AGGREGATE_INFORMATION_API_PATH = `${BACKEND_SERVICE_PATH}/reviews/aggregateInformation`;

// Google Places API configuration
const GOOGLE_API_PATH = "https://places.googleapis.com/v1/";
const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_API_KEY = 'X-Goog-Api-Key';
const HEADER_FIELD_MASK = 'X-Goog-FieldMask';

export const fetchRestaurantReviews = async (restaurantId) => {
  try {
    const { data } = await axios.get(REVIEWS_API_PATH, { params: { restaurantId } });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

export const fetchRestaurantDetails = async (restaurantId) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }
    
    const { data } = await axios.get(GOOGLE_API_PATH + "places/" + restaurantId, {
      headers: {
        [HEADER_CONTENT_TYPE]: 'application/json',
        [HEADER_API_KEY]: apiKey,
        [HEADER_FIELD_MASK]: 'id,displayName,formattedAddress'
      }
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch restaurant details');
  }
};

export const fetchAggregateInformation = async (restaurantId) => {
  try {
    const { data } = await axios.get(AGGREGATE_INFORMATION_API_PATH, { params: { ids: restaurantId, rating: true } });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch aggregate information');
  }
};

export const fetchAccountReviews = async (accountId) => {
  try {
    const { data } = await axios.get(REVIEWS_API_PATH, { params: { accountId } });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch account reviews');
  }
};

export const fetchUserSettings = async (accountId) => {
  try {
    const USER_SETTINGS_API_PATH = `${BACKEND_SERVICE_PATH}/userMetadata`;
    const { data } = await axios.get(USER_SETTINGS_API_PATH, { params: { accountId } });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user settings');
  }
};

export const fetchRecentReviews = async (count = 10) => {
  try {
    const RECENT_REVIEWS_API_PATH = `${BACKEND_SERVICE_PATH}/reviews/recent`;
    const { data } = await axios.get(RECENT_REVIEWS_API_PATH, { params: { count } });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent reviews');
  }
};
