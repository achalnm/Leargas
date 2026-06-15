'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// County centroids — projected to SVG space (viewBox 0 0 360 430)
// Transform: x = (lon + 10.5) * 68,  y = (55.4 - lat) * 108
export const COUNTY_POSITIONS: Record<string, { cx: number; cy: number; name: string }> = {
  donegal: { cx: 168, cy: 74, name: 'Donegal' },
  sligo: { cx: 129, cy: 130, name: 'Sligo' },
  leitrim: { cx: 176, cy: 142, name: 'Leitrim' },
  mayo: { cx: 82, cy: 162, name: 'Mayo' },
  roscommon: { cx: 156, cy: 184, name: 'Roscommon' },
  cavan: { cx: 210, cy: 158, name: 'Cavan' },
  monaghan: { cx: 251, cy: 130, name: 'Monaghan' },
  louth: { cx: 278, cy: 158, name: 'Louth' },
  galway: { cx: 102, cy: 218, name: 'Galway' },
  longford: { cx: 183, cy: 184, name: 'Longford' },
  westmeath: { cx: 204, cy: 206, name: 'Westmeath' },
  meath: { cx: 244, cy: 194, name: 'Meath' },
  dublin: { cx: 283, cy: 228, name: 'Dublin' },
  kildare: { cx: 251, cy: 238, name: 'Kildare' },
  offaly: { cx: 196, cy: 238, name: 'Offaly' },
  laois: { cx: 224, cy: 260, name: 'Laois' },
  wicklow: { cx: 278, cy: 262, name: 'Wicklow' },
  clare: { cx: 102, cy: 272, name: 'Clare' },
  tipperary: { cx: 178, cy: 300, name: 'Tipperary' },
  carlow: { cx: 244, cy: 282, name: 'Carlow' },
  kilkenny: { cx: 217, cy: 314, name: 'Kilkenny' },
  wexford: { cx: 265, cy: 336, name: 'Wexford' },
  waterford: { cx: 204, cy: 344, name: 'Waterford' },
  limerick: { cx: 129, cy: 314, name: 'Limerick' },
  kerry: { cx: 66, cy: 356, name: 'Kerry' },
  cork: { cx: 115, cy: 368, name: 'Cork' },
};

// Simplified island outline (clockwise from N tip)
const ISLAND_PATH =
  'M 210,2 L 247,20 L 276,22 L 295,19 L 320,55 L 334,106 L 330,126 ' +
  'L 299,148 L 279,157 L 283,182 L 299,221 L 302,240 ' +
  'L 308,264 L 295,284 L 280,342 L 280,352 L 242,358 ' +
  'L 232,354 L 196,361 L 188,374 L 149,388 L 134,413 ' +
  'L 104,421 L 46,429 L 18,414 L 13,382 L 2,358 ' +
  'L 14,341 L 47,331 L 38,307 L 57,295 L 75,261 ' +
  'L 33,204 L 42,193 L 61,172 L 20,155 L 35,157 ' +
  'L 71,142 L 87,128 L 129,121 L 138,101 L 156,97 ' +
  'L 122,74 L 119,71 L 171,21 L 194,15 Z';

// Northern Ireland — non-interactive neutral overlay
const NI_PATH =
  'M 231,32 L 265,22 L 295,19 L 320,55 L 334,106 L 330,126 ' +
  'L 299,148 L 255,143 L 243,130 L 224,122 L 208,114 ' +
  'L 212,96 L 224,79 L 237,63 Z';

interface CountyReading {
  county: string;
  label: string;
  value: string;
}

interface IrelandMapProps {
  /** 'landing' shows 3 station readings with draw-in animation */
  variant?: 'landing' | 'dashboard';
  readings?: CountyReading[];
  activeCounty?: string;
  onCountyClick?: (id: string) => void;
  className?: string;
}

export function IrelandMap({
  variant = 'landing',
  readings = [],
  activeCounty,
  onCountyClick,
  className = '',
}: IrelandMapProps) {
  const [drawn, setDrawn] = useState(variant !== 'landing');
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);

  useEffect(() => {
    if (variant === 'landing') {
      const t = setTimeout(() => setDrawn(true), 1200);
      return () => clearTimeout(t);
    }
  }, [variant]);

  const countiesToShow = Object.entries(COUNTY_POSITIONS);

  return (
    <svg
      viewBox="0 0 360 430"
      width="100%"
      className={`block ${className}`}
      aria-label="Map of Ireland"
      style={{ overflow: 'visible' }}
    >
      {/* Survey paper ground fill */}
      <rect width="360" height="430" fill="var(--color-ground)" />

      {/* Graticule grid lines */}
      {[0, 60, 120, 180, 240, 300, 360].map((x) => (
        <line
          key={`vg-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={430}
          stroke="var(--color-graticule)"
          strokeWidth="0.4"
          strokeOpacity="0.5"
        />
      ))}
      {[0, 72, 144, 216, 288, 360, 430].map((y) => (
        <line
          key={`hg-${y}`}
          x1={0}
          y1={y}
          x2={360}
          y2={y}
          stroke="var(--color-graticule)"
          strokeWidth="0.4"
          strokeOpacity="0.5"
        />
      ))}

      {/* Island fill (sea colour distinguishes land) */}
      <path d={ISLAND_PATH} fill="var(--color-ground-shade)" stroke="none" />

      {/* Northern Ireland — neutral, non-interactive */}
      <path
        d={NI_PATH}
        fill="var(--color-graticule)"
        fillOpacity="0.35"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />

      {/* Island outline — draws in on landing */}
      {variant === 'landing' ? (
        <motion.path
          d={ISLAND_PATH}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      ) : (
        <path
          d={ISLAND_PATH}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.7"
        />
      )}

      {/* County station markers */}
      {countiesToShow.map(([id, { cx, cy, name }], i) => {
        const isActive = activeCounty === id;
        const isHovered = hoveredCounty === id;
        const reading = readings.find((r) => r.county.toLowerCase() === id);

        return (
          <g key={id}>
            {/* Station circle */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={isActive ? 5 : 3.5}
              fill={isActive ? 'var(--color-atlantic)' : 'var(--color-ground)'}
              stroke={isActive ? 'var(--color-atlantic)' : 'var(--color-ink)'}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeOpacity={isActive ? 1 : 0.55}
              style={{ cursor: onCountyClick ? 'pointer' : 'default' }}
              initial={variant === 'landing' ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              animate={{ opacity: isHovered || isActive ? 1 : 0.65, scale: 1 }}
              transition={{ duration: 0.25, delay: variant === 'landing' ? 1.4 + i * 0.03 : 0 }}
              onMouseEnter={() => setHoveredCounty(id)}
              onMouseLeave={() => setHoveredCounty(null)}
              onClick={() => onCountyClick?.(id)}
            />

            {/* Hover label */}
            {isHovered && !reading && (
              <g>
                <rect
                  x={cx + 7}
                  y={cy - 10}
                  width={name.length * 5.5 + 8}
                  height={16}
                  fill="var(--color-ground)"
                  stroke="var(--color-graticule)"
                  strokeWidth="0.5"
                  rx="1"
                />
                <text
                  x={cx + 11}
                  y={cy + 2}
                  fontSize="8"
                  fontFamily="var(--font-ibm-plex-mono)"
                  fill="var(--color-ink)"
                >
                  {name}
                </text>
              </g>
            )}

            {/* Station reading (landing page mode) */}
            {reading && drawn && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {/* Leader line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + 18}
                  y2={cy - 16}
                  stroke="var(--color-ink)"
                  strokeWidth="0.6"
                  strokeOpacity="0.5"
                />
                {/* Reading card */}
                <rect
                  x={cx + 19}
                  y={cy - 28}
                  width={reading.value.length * 5.5 + reading.label.length * 4.2 + 12}
                  height={20}
                  fill="var(--color-ground)"
                  stroke="var(--color-graticule)"
                  strokeWidth="0.5"
                  rx="1"
                />
                <text
                  x={cx + 23}
                  y={cy - 15}
                  fontSize="7"
                  fontFamily="var(--font-ibm-plex-mono)"
                  fill="var(--color-ink-soft)"
                >
                  {reading.label}
                </text>
                <text
                  x={cx + 23 + reading.label.length * 4.2 + 4}
                  y={cy - 15}
                  fontSize="7.5"
                  fontFamily="var(--font-ibm-plex-mono)"
                  fontWeight="500"
                  fill="var(--color-ink)"
                >
                  {reading.value}
                </text>
              </motion.g>
            )}
          </g>
        );
      })}

      {/* Scale bar (dashboard only) */}
      {variant === 'dashboard' && (
        <g>
          <line
            x1="16"
            y1="420"
            x2="60"
            y2="420"
            stroke="var(--color-ink)"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <line
            x1="16"
            y1="417"
            x2="16"
            y2="423"
            stroke="var(--color-ink)"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <line
            x1="60"
            y1="417"
            x2="60"
            y2="423"
            stroke="var(--color-ink)"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <text
            x="32"
            y="415"
            fontSize="6"
            fontFamily="var(--font-ibm-plex-mono)"
            fill="var(--color-ink-soft)"
            textAnchor="middle"
          >
            0 — 100km
          </text>
          <text
            x="310"
            y="422"
            fontSize="7"
            fontFamily="var(--font-ibm-plex-mono)"
            fill="var(--color-ink-soft)"
            opacity="0.5"
          >
            N↑
          </text>
        </g>
      )}
    </svg>
  );
}
