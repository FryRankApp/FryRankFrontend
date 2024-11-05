export const PATH_VARIABLE_RESTAURANT_ID = ":restaurantId"
export const PATH_VARIABLE_ACCOUNT_ID = ":accountId"

export const PATH_HOME = "/"
export const PATH_RESTAURANTS = "/restaurants"
export const PATH_RESTAURANT_REVIEWS = `${PATH_RESTAURANTS}/${PATH_VARIABLE_RESTAURANT_ID}`
export const PATH_ACCOUNT_REVIEWS = `/critics/${PATH_VARIABLE_ACCOUNT_ID}`
export const PATH_CREATE_REVIEW = `${PATH_RESTAURANTS}/${PATH_VARIABLE_RESTAURANT_ID}/create`
export const PATH_RECENT_REVIEW = "/recent-reviews"

export const BACKEND_SERVICE_PATH = process.env.REACT_APP_BACKEND_SERVICE_PATH;
export const AGGREGATE_INFORMATION_API_PATH = `${BACKEND_SERVICE_PATH}/reviews/aggregateInformation`;

export const FRENCH_FRIES_TEXT_QUERY = "french fries";

export const REVIEW_PROPERTY_ISO_DATE_TIME = "isoDateTime";

export const WELCOME_MESSAGE = "Bonjour, my name is Monsieur LeFry. Bienvenue to my website, FryRank. " +
    "Crisp, golden, and irresistible, French Fries have held a special place in my heart ever since I was a wee garçon. " +
    "Have you ever wondered what it's like to immerse yourself in the world of French Fries, traversing countless eateries, " +
    "meticulously sampling each fry, and dissecting their every nuance? This is my world, the world of a French Fry food critic. " +
    "Join me as we explore the art of evaluating, appreciating, and savoring the remarkable world of French Fries. " +
    "Ok, enough talk. Off you go now!"

export const SELECTED_VIEW = Object.freeze({
    MAP: Symbol('map'),
    LIST: Symbol('list'),
});