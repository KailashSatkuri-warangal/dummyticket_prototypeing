'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

interface FlightGlobeAnimationProps {
  title?: string;
  subtitle?: string;
  origin?: string;
  destination?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  className?: string;
}

export function FlightGlobeAnimation({
  title = 'Searching Real-Time Flights...',
  subtitle = 'Scanning airlines, route schedules, and verified fares',
  origin = 'HYD',
  destination = 'DEL',
  size = 'md',
  className = '',
}: FlightGlobeAnimationProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg' || size === 'fullscreen';

  const globeSize = isSmall ? 100 : isLarge ? 180 : 130;
  const orbitRx = isSmall ? 65 : isLarge ? 115 : 85;
  const orbitRy = isSmall ? 25 : isLarge ? 42 : 32;

  const content = (
    <div
      className={`relative flex flex-col items-center justify-center select-none text-center ${
        size === 'fullscreen' ? 'min-h-[50vh] p-8' : 'p-6'
      } ${className}`}
    >
      {/* Background glow behind globe */}
      <div
        className="absolute rounded-full bg-blue-500/15 blur-2xl pointer-events-none"
        style={{
          width: globeSize * 1.6,
          height: globeSize * 1.6,
        }}
      />

      {/* Main Globe & Airplane Orbit Scene */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: globeSize * 1.7, height: globeSize * 1.4 }}
      >
        {/* 3D-effect Globe with Grid Lines */}
        <div
          className="relative rounded-full border border-blue-400/40 shadow-ticket overflow-hidden flex items-center justify-center"
          style={{
            width: globeSize,
            height: globeSize,
            background:
              'radial-gradient(circle at 35% 35%, #2563eb 0%, #1d4ed8 45%, #0b1e4f 85%, #050b1a 100%)',
          }}
        >
          {/* Subtle Rotating Latitude and Longitude Grid */}
          <motion.svg
            className="absolute inset-0 w-full h-full opacity-45 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* Equator & Parallels */}
            <ellipse cx="50" cy="50" rx="46" ry="14" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="2 2" />
            <ellipse cx="50" cy="50" rx="46" ry="30" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="3 3" />
            <ellipse cx="50" cy="30" rx="38" ry="10" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="2 2" />
            <ellipse cx="50" cy="70" rx="38" ry="10" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="2 2" />
            {/* Longitude Meridians */}
            <ellipse cx="50" cy="50" rx="18" ry="46" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="2 2" />
            <ellipse cx="50" cy="50" rx="36" ry="46" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="50" y1="4" x2="50" y2="96" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="2 2" />
          </motion.svg>

          {/* Continents silhouette stylized dots */}
          <motion.div
            className="absolute inset-0 opacity-40"
            animate={{ backgroundPosition: ['0px 0px', '120px 0px'] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />

          {/* Center glowing radar sweep */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(96,165,250,0.35) 60deg, transparent 90deg)',
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />

          {/* Core Brand Spark */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            <span className="font-mono text-[10px] font-black tracking-widest text-sky-200 uppercase opacity-90">
              {origin}
            </span>
            <div className="w-4 h-0.5 bg-sky-300 my-0.5 rounded-full" />
            <span className="font-mono text-[10px] font-black tracking-widest text-sky-200 uppercase opacity-90">
              {destination}
            </span>
          </div>
        </div>

        {/* Outer Orbit Path (Tilted Ellipse) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${globeSize * 1.7} ${globeSize * 1.4}`}
        >
          <g transform={`translate(${(globeSize * 1.7) / 2}, ${(globeSize * 1.4) / 2}) rotate(-24)`}>
            {/* Dashed Flight Path Arc */}
            <ellipse
              cx="0"
              cy="0"
              rx={orbitRx}
              ry={orbitRy}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-75"
            />
            {/* Secondary golden contrail glow */}
            <ellipse
              cx="0"
              cy="0"
              rx={orbitRx}
              ry={orbitRy}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.75"
              className="opacity-35"
            />
          </g>
        </svg>

        {/* Orbiting Airplane Container with Continuous 360 Motion */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {/* Plane positioned on the orbit edge */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(${orbitRx}px, 0px) rotate(90deg)`,
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Glowing flight contrail tail */}
              <div className="absolute right-3.5 w-6 h-1.5 bg-gradient-to-l from-sky-400 via-sky-200 to-transparent rounded-full blur-[0.5px] -z-10" />
              {/* Airplane Icon */}
              <div className="rounded-full bg-white p-1 text-blue-600 shadow-md ring-2 ring-blue-400/60">
                <Plane className="h-3.5 w-3.5 fill-blue-600 -rotate-45" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Counter Orbiting Secondary Flight for multi-route effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 5.5, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        >
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(-${orbitRx * 0.85}px, 0px) rotate(-90deg)`,
            }}
          >
            <div className="h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-200 shadow-sm animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Typography & Loading Progress */}
      {title && (
        <div className="mt-4 space-y-1.5 max-w-sm">
          <h3 className="text-base font-extrabold text-navy-900 tracking-tight flex items-center justify-center gap-2">
            <span>{title}</span>
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}

          {/* Animated Route Pill Badge */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" />
              {origin} → {destination} Live Route
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return content;
}
