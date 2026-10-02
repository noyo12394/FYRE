import React from 'react'

const paths = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  map: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15 M15 6v15',
  bridge: 'M2 17h20 M4 17V7 M20 17V7 M4 8q8 12 16 0 M8 12v5 M12 14v3 M16 12v5',
  chart: 'M4 3v17h17 M8 15v-4 M13 15V7 M18 15V5',
  book: 'M12 5q-5-3-9-1v15q4-2 9 1 5-3 9-1V4q-4-2-9 1z M12 5v15',
  arrow: 'M4 12h16 M14 6l6 6-6 6',
  check: 'M5 12l4 4L19 6',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  flag: 'M5 21V3 M5 3h14l-3 4 3 4H5',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
  github:
    'M9 19c-4 1-4-2-6-2 M9 22v-3c0-1 .1-2-1-3-4 0-6-2-6-6 0-2 1-3 2-4 0-2 0-3 1-4l4 2c2-1 4-1 6 0l4-2c1 1 1 2 1 4 1 1 2 2 2 4 0 4-2 6-6 6-1 1-1 2-1 3v3',
  wave: 'M2 12h4l2-7 4 14 3-11 2 4h5',
  lock: 'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4',
}

export default function Icon({ name, className = '' }) {
  return (
    <svg
      className={`lab-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  )
}
