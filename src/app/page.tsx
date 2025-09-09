"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import ParticleNetwork from "../components/particle-network";
import "./globals.css";

const slides = [
  {
    id: 1,
    title: "JOBATLAS",
    subtitle: "NAVIGATE THE WORLD OF WORK",
    description:
      "Explore thousands of occupations and skills from Tabiya's open taxonomy. Discover hidden career pathways and understand how the labor market connects.",
    image: "/professional-network-connections.jpg",
  },
  {
    id: 2,
    title: "CAREER PATHWAYS",
    subtitle: "UNCOVER HIDDEN OPPORTUNITIES",
    description:
      "Your Career, Mapped. Your Potential, Unlocked. Stop guessing which skills are in demand. Our platform visually reveals how expertise connects across industries, empowering you to pinpoint high-value skills, pivot with purpose, and build a future-proof career.",
    image: "/interactive-job-skills-web.jpg",
  },
  {
    id: 3,
    title: "SKILL NETWORKS",
    subtitle: "MAKE WORK VISIBLE & NAVIGABLE",
    description:
      "Transform complex job market data into clear, interactive visualizations. Explore career opportunities with real-world labor market insights.",
    image: "",
  },
];

export default function RevSliderDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 750);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
    }, 750);
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsAnimating(false);
      }, 750);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <ParticleNetwork />

      {/* Main Slider Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1500 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          >
            {/* Background Image Container with Improved Styling */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: isAnimating ? "scale(1.05)" : "scale(1)",
                  transition: "transform 7s ease-out",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-20 flex items-center justify-center h-full px-8">
              <div className="text-center text-white max-w-4xl">
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    index === currentSlide && !isAnimating
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  {/* Animated Subtitle */}
                  <p className="text-xl md:text-2xl font-bold mb-4 text-[#F69218] tracking-wider animate-pulse">
                    {slide.subtitle}
                  </p>

                  {/* Main Title with Gradient and Animation */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight bg-gradient-to-r from-[#F69218] via-[#FFB224] to-[#FFD166] bg-clip-text text-transparent animate-gradient">
                    {slide.title === "JOBATLAS" ? (
                      <>
                        <span className="inline-block animate-bounce">J</span>
                        <span className="inline-block animate-bounce delay-100">
                          O
                        </span>
                        <span className="inline-block animate-bounce delay-200">
                          B
                        </span>
                        <span className="inline-block animate-bounce delay-300">
                          A
                        </span>
                        <span className="inline-block animate-bounce delay-400">
                          T
                        </span>
                        <span className="inline-block animate-bounce delay-500">
                          L
                        </span>
                        <span className="inline-block animate-bounce delay-600">
                          A
                        </span>
                        <span className="inline-block animate-bounce delay-700">
                          S
                        </span>
                      </>
                    ) : (
                      slide.title.split(" ").map((word, i) => (
                        <span
                          key={i}
                          className="inline-block mr-4 animate-fadeInUp"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          {word}
                        </span>
                      ))
                    )}
                  </h1>

                  {/* Description with Highlighted Words */}
                  <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8 leading-relaxed">
                    {slide.description.split(" ").map((word, i) => {
                      const highlightWords = [
                        "Career",
                        "Mapped",
                        "Potential",
                        "Unlocked",
                        "skills",
                        "demand",
                        "platform",
                        "visually",
                        "expertise",
                        "industries",
                        "high-value",
                        "future-proof",
                      ];
                      const shouldHighlight = highlightWords.some((highlight) =>
                        word.toLowerCase().includes(highlight.toLowerCase())
                      );

                      return shouldHighlight ? (
                        <span
                          key={i}
                          className="text-[#F69218] font-semibold animate-pulse"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          {word}{" "}
                        </span>
                      ) : (
                        <span key={i}>{word} </span>
                      );
                    })}
                  </p>

                  {/* Animated Button */}
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#F69218] to-[#FFB224] hover:from-[#FFB224] hover:to-[#F69218] text-white px-10 py-4 text-xl font-bold rounded-full transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-xl hover:shadow-[#F69218]/30 animate-pulse-slow"
                  >
                    EXPLORE NOW
                  </Button>
                </div>
              </div>
            </div>

            {index === 0 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
                <p className="text-white/80 text-lg font-light animate-bounce">
                  Powered by Tabiya's Open Taxonomy
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-[#F69218] w-14 h-14 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        onClick={prevSlide}
        disabled={isAnimating}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-[#F69218] w-14 h-14 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        onClick={nextSlide}
        disabled={isAnimating}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#F69218] scale-125 shadow-lg shadow-[#F69218]/50"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/30 z-30">
        <div
          className="h-full bg-gradient-to-r from-[#F69218] to-[#FFB224] transition-all duration-5000 ease-linear"
          style={{
            width: isAnimating ? "100%" : "0%",
            animation: !isAnimating ? "progress 5s linear" : "none",
          }}
        />
      </div>
    </div>
  );
}
