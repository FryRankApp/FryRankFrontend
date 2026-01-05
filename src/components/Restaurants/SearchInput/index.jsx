import { PropTypes } from 'prop-types'
import { Search } from 'lucide-react'

const propTypes = {
    currentSearchQuery: PropTypes.string.isRequired,
    updateSearchQuery: PropTypes.func.isRequired,
    getRestaurants: PropTypes.func.isRequired,
    location: PropTypes.object,
    selectedView: PropTypes.string.isRequired,
}

const SearchInput = ({ getRestaurants, currentSearchQuery, updateSearchQuery, location, selectedView }) => {
    const handleSearch = () => {
        let searchLocation
        if (selectedView === 'MAP' && location) {
            searchLocation = location
        } else {
            searchLocation = location
        }

        getRestaurants(currentSearchQuery, searchLocation)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search for restaurants or cuisines..."
                        value={currentSearchQuery}
                        onChange={(e) => updateSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-fry-orange focus:border-transparent transition-all duration-200"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-fry-orange text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center gap-2 hover:scale-105"
                >
                    <Search className="w-4 h-4" />
                    Search
                </button>
            </div>
        </div>
    )
}

SearchInput.propTypes = propTypes

export default SearchInput