import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import monsieur from './monsieur-lefry-t-shirt.png'
import cap from './black-cap.png'
import monk from './fry-monk-black-t-shirt.png'

const StoreItems = () => {
    const items = [
        {
            name: 'Monsieur LeFry T-Shirt',
            image: monsieur,
            link: 'https://www.etsy.com/listing/1795875850/monsieur-le-fry-the-french-fry'
        },
        {
            name: 'Fry Monk T-Shirt',
            image: monk,
            link: 'https://www.etsy.com/listing/1796245424/fry-monk-t-shirt'
        },
        {
            name: 'FryRank Corduroy Cap',
            image: cap,
            link: 'https://www.etsy.com/listing/1796154532/fry-ranker-vintage-corduroy-cap'
        }
    ]

    return (
        <>
            <div className="text-center mb-8">
                <Link
                    href="https://fryrank.etsy.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-fry-orange text-white rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
                >
                    SEE ALL PRODUCTS
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover group"
                    >
                        <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4">{item.name}</h3>
                            <Link
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                            >
                                View on Etsy
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default StoreItems