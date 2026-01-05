'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Moon, Sun, Star, MapPin, PenTool, ShoppingBag } from 'lucide-react'
import StoreItems from '../components/Homepage/StoreItems'
import Header from '../components/Common/Header'

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDarkMode(shouldUseDark)
    if (shouldUseDark) {
      document.documentElement.classList.add('dark')
    }
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 fry-gradient opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              The best fries,
              <span className="block text-transparent bg-clip-text fry-gradient">
                ranked.
              </span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8 md:mb-12">
              <div className="flex items-center gap-2 text-lg md:text-xl">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-fry-orange" />
                <span className="font-medium">Read reviews</span>
              </div>
              <div className="flex items-center gap-2 text-lg md:text-xl">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-fry-orange" />
                <span className="font-medium">Discover fries</span>
              </div>
              <div className="flex items-center gap-2 text-lg md:text-xl">
                <PenTool className="w-5 h-5 md:w-6 md:h-6 text-fry-orange" />
                <span className="font-medium">Write a review</span>
              </div>
            </div>

            <Link
              href="/restaurants"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white fry-gradient rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Explore restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-fry-orange">
                  Welcome to FryRank
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Your ultimate destination for discovering and reviewing the best french fries in town. 
                  Join our community of fry enthusiasts and help others find their perfect crispy, 
                  golden-brown potatoes.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Whether you prefer shoestring, crinkle-cut, or steak fries, we've got you covered. 
                  Read authentic reviews, share your own experiences, and become part of the fry 
                  revolution!
                </p>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 fry-gradient rounded-full blur-3xl opacity-20"></div>
                <Image
                  src="/FrenchFryFoodCritic.png"
                  alt="French Fry Food Critic"
                  width={400}
                  height={400}
                  className="relative z-10 w-full max-w-sm md:max-w-md h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merch Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-8 h-8 text-fry-orange" />
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text fry-gradient">
                Shop FryRank Merch
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Show off your love for fries with our exclusive merchandise collection
            </p>
          </div>
          
          <StoreItems />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 FryRank. The best fries, ranked.
          </p>
        </div>
      </footer>
    </div>
  )
}
