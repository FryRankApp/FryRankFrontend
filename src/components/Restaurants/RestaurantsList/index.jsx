import { PropTypes } from 'prop-types'
import { Fragment } from 'react'
import Link from 'next/link'
import { Star, MapPin, ExternalLink } from 'lucide-react'
import { PATH_RESTAURANT_REVIEWS, PATH_VARIABLE_RESTAURANT_ID } from '../../../constants.js'

const propTypes = {
    restaurantIds: PropTypes.array,
    currentRestaurants: PropTypes.object,
    aggregateReviewsData: PropTypes.object // Keep for backward compatibility
}

const Score = ({ score, size = 'md' }) => {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    }
    
    const getColor = (score) => {
        if (score >= 4.5) return 'text-green-500'
        if (score >= 3.5) return 'text-yellow-500'
        if (score >= 2.5) return 'text-orange-500'
        return 'text-red-500'
    }

    return (
        <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
            <Star className={`w-4 h-4 ${getColor(score)} fill-current`} />
            <span className={`font-semibold ${getColor(score)}`}>{score?.toFixed(1) || 'N/A'}</span>
        </div>
    )
}

const RestaurantsList = ({ restaurantIds, currentRestaurants, aggregateReviewsData }) => {
    const restaurants = restaurantIds && currentRestaurants
        ? Object.values(currentRestaurants).filter(restaurant => restaurantIds.includes(restaurant.id))
        : null

    if (restaurants && restaurants.length > 0) {
        return (
            <div className="grid gap-6">
                {restaurants.map((restaurant) => {
                    let restaurantLink = `${PATH_RESTAURANT_REVIEWS}`.replace(PATH_VARIABLE_RESTAURANT_ID, restaurant.id)
                    return (
                        <div
                            key={restaurant.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300 card-hover"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-3">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            <Link 
                                                href={restaurantLink}
                                                className="hover:text-fry-orange transition-colors duration-200"
                                            >
                                                {restaurant.displayName?.text || restaurant.name}
                                            </Link>
                                        </h3>
                                        <Link
                                            href={restaurantLink}
                                            className="inline-flex items-center gap-1 p-2 text-gray-600 dark:text-gray-400 hover:text-fry-orange transition-colors duration-200"
                                            aria-label={`View reviews for ${restaurant.displayName?.text || restaurant.name}`}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {restaurant.formattedAddress || restaurant.address}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* FryRank Rating Only */}
                                        {restaurant.fryrankRating && (
                                            <Score 
                                                score={restaurant.fryrankRating} 
                                                size="md" 
                                            />
                                        )}
                                        {/* Show "No Rating" for restaurants without FryRank data */}
                                        {!restaurant.fryrankRating && (
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <span className="text-xs">No rating yet</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <Link
                                        href={restaurantLink}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-fry-orange text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                                    >
                                        View Reviews
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    } else if (restaurants && restaurants.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No restaurants found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    We couldn't find any restaurants matching your search. Try adjusting your search terms or location.
                </p>
            </div>
        )
    } else {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-fry-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading restaurants...</p>
                </div>
            </div>
        )
    }
}

RestaurantsList.propTypes = propTypes

export default RestaurantsList