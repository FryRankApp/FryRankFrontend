import { PropTypes } from 'prop-types'
import { MapPin, Star } from 'lucide-react'
import { Score } from "../"

const propTypes = {
    currentRestaurant: PropTypes.object.isRequired,
    averageScore: PropTypes.number.isRequired,
}

const RestaurantHeader = ({ currentRestaurant, averageScore }) => {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                {currentRestaurant.displayName?.text || currentRestaurant.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4">
                {averageScore && (
                    <div className="flex items-center gap-2">
                        <Score score={averageScore} size="lg" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            FryRank Rating
                        </span>
                    </div>
                )}
                
                {currentRestaurant.rating && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{currentRestaurant.rating}</span>
                        <span className="text-xs text-gray-400">(Google)</span>
                    </div>
                )}
            </div>
            
            <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                    {currentRestaurant.formattedAddress || currentRestaurant.address}
                </p>
            </div>
        </div>
    )
}

RestaurantHeader.propTypes = propTypes

export default RestaurantHeader