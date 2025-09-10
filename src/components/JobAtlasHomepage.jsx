import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import ParticleNetwork from './ParticleNetwork'

const JobAtlasHomepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  const slides = [
    {
      id: 1,
      title: "JOBATLAS",
      subtitle: "NAVIGATE THE WORLD OF WORK",
      description: "Explore thousands of occupations and skills from Tabiya's open taxonomy. Discover career pathways, understand skill requirements, and navigate the complex world of work with interactive visualizations.",
      footnote: "Powered by Tabiya's Open Taxonomy",
      backgroundImage: "/images/PHOTO-2025-09-10-19-40-34.jpg",
      titleAnimation: "bouncing-letters"
    },
    {
      id: 2,
      title: "CAREER PATHWAYS",
      subtitle: "UNCOVER HIDDEN OPPORTUNITIES",
      description: "Your Career, Mapped. Your Potential, Unlocked. Discover connections between occupations, identify skill gaps, and find new opportunities in the evolving job market through data-driven insights.",
      highlightWords: ["Career", "Mapped", "Potential", "Unlocked"],
      backgroundImage: "/images/PHOTO-2025-09-10-19-41-34.jpg",
      titleAnimation: "fade-in"
    },
    {
      id: 3,
      title: "SKILL NETWORKS",
      subtitle: "MAKE WORK VISIBLE & NAVIGABLE",
      description: "Transform complex job market data into clear, interactive visualizations. Understand how skills connect across industries and discover the building blocks of modern careers.",
      backgroundImage: "/images/PHOTO-2025-09-10-19-40-34.jpg",
      titleAnimation: "fade-in"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentSlide(current => (current + 1) % slides.length)
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setProgress(0)
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <ParticleNetwork />
      
      {/* Main Slide Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out
              ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            `}
            style={{ 
              zIndex: index === currentSlide ? 10 : 1,
              backgroundImage: `url(${slide.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            
            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="max-w-4xl mx-auto">
                {/* Title */}
                <h1 className={`
                  text-6xl md:text-8xl font-black text-white mb-6
                  ${slide.titleAnimation === 'bouncing-letters' ? 'bouncing-letters' : 'fade-in-title'}
                `}>
                  {slide.titleAnimation === 'bouncing-letters' ? (
                    slide.title.split('').map((letter, i) => (
                      <span
                        key={i}
                        className="inline-block animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {letter}
                      </span>
                    ))
                  ) : (
                    slide.title
                  )}
                </h1>

                {/* Subtitle */}
                <h2 className="text-2xl md:text-4xl font-bold text-[#F69218] mb-8 animate-pulse">
                  {slide.subtitle}
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                  {slide.highlightWords ? (
                    slide.description.split(' ').map((word, i) => {
                      const cleanWord = word.replace(/[.,]/g, '')
                      const isHighlighted = slide.highlightWords.includes(cleanWord)
                      return (
                        <span
                          key={i}
                          className={isHighlighted ? 'text-[#FFD166] font-bold animate-pulse' : ''}
                        >
                          {word}{' '}
                        </span>
                      )
                    })
                  ) : (
                    slide.description
                  )}
                </p>

                {/* CTA Button */}
                <Button 
                  className="mb-8 animate-pulse"
                  onClick={() => navigate('/graph')}
                >
                  EXPLORE NOW
                </Button>

                {/* Footnote */}
                {slide.footnote && (
                  <p className="text-sm text-gray-400 italic">
                    {slide.footnote}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30 p-4 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-300"
        >
          <ChevronLeft size={32} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 p-4 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-300"
        >
          <ChevronRight size={32} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-4 h-4 rounded-full transition-all duration-300
                ${index === currentSlide ? 'bg-[#F69218] scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}
              `}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30 z-30">
          <div
            className="h-full bg-gradient-to-r from-[#F69218] to-[#FFB224] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>


    </div>
  )
}

export default JobAtlasHomepage