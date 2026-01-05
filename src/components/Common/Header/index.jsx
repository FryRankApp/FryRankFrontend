'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingBag, Utensils, Clock, Heart, Settings, LogIn } from 'lucide-react'

export default function Header({ loggedIn = false }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <header className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800 sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/FryRankLogo.png"
                            alt="FryRank"
                            width={120}
                            height={40}
                            className="w-auto h-8 md:h-10"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/restaurants"
                            className="flex items-center gap-2 text-gray-300 hover:text-fry-yellow transition-colors duration-200"
                        >
                            <Utensils className="w-4 h-4" />
                            <span>Restaurants</span>
                        </Link>

                        <Link
                            href="/recent-reviews"
                            className="flex items-center gap-2 text-gray-300 hover:text-fry-yellow transition-colors duration-200"
                        >
                            <Clock className="w-4 h-4" />
                            <span>Recent Reviews</span>
                        </Link>

                        <a
                            href="https://www.etsy.com/shop/fryrank/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-300 hover:text-fry-yellow transition-colors duration-200"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Merch Shop</span>
                        </a>

                        <Link
                            href="/donate"
                            className="flex items-center gap-2 text-gray-300 hover:text-fry-yellow transition-colors duration-200"
                        >
                            <Heart className="w-4 h-4" />
                            <span>Donate</span>
                        </Link>

                        {loggedIn && (
                            <Link
                                href="/userSettings"
                                className="flex items-center gap-2 text-gray-300 hover:text-fry-yellow transition-colors duration-200"
                            >
                                <Settings className="w-4 h-4" />
                                <span>User Settings</span>
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button & Login */}
                    <div className="flex items-center gap-4">
                        {/* Login Button - Desktop */}
                        <div className="hidden md:block">
                            <button className="flex items-center gap-2 px-4 py-2 bg-fry-orange text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200">
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggle}
                            className="md:hidden p-2 text-gray-300 hover:text-fry-yellow transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-700 dark:border-gray-800">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                href="/restaurants"
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-fry-yellow hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <Utensils className="w-4 h-4" />
                                <span>Restaurants</span>
                            </Link>

                            <Link
                                href="/recent-reviews"
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-fry-yellow hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <Clock className="w-4 h-4" />
                                <span>Recent Reviews</span>
                            </Link>

                            <a
                                href="https://www.etsy.com/shop/fryrank/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-fry-yellow hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Merch Shop</span>
                            </a>

                            <Link
                                href="/donate"
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-fry-yellow hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                <Heart className="w-4 h-4" />
                                <span>Donate</span>
                            </Link>

                            {loggedIn && (
                                <Link
                                    href="/userSettings"
                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-fry-yellow hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>User Settings</span>
                                </Link>
                            )}

                            {/* Mobile Login Button */}
                            <div className="pt-3 border-t border-gray-700 dark:border-gray-800">
                                <button className="flex items-center gap-2 w-full px-3 py-2 bg-fry-orange text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200 justify-center">
                                    <LogIn className="w-4 h-4" />
                                    <span>Login</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}