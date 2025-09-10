import React from 'react'

const Button = ({ children, className = '', onClick, ...props }) => {
  return (
    <button
      className={`
        relative px-12 py-4 
        bg-gradient-to-r from-[#F69218] via-[#FFB224] to-[#FFD166]
        text-white font-black text-xl tracking-wider
        rounded-full
        transform transition-all duration-500
        hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/50
        active:scale-95
        border-2 border-transparent
        hover:border-white/20
        overflow-hidden
        group
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD166] via-[#FFB224] to-[#F69218] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  )
}

export default Button