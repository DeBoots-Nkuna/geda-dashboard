'use client'
import { useEffect, useRef } from 'react'

export default function BgVideo({
  rate = 0.5, // 0.5 = half speed, 0.25 = quarter speed
  webm = '/videos/hero-bg.webm',
  mp4 = '/videos/hero-bg.mp4',
  poster = '/images/hero-poster.png',
}: {
  rate?: number
  webm: string
  mp4?: string
  poster?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const apply = () => {
      try {
        v.playbackRate = rate
      } catch {}
    }
    apply()
    v.addEventListener('loadedmetadata', apply)
    v.addEventListener('canplay', apply)
    return () => {
      v.removeEventListener('loadedmetadata', apply)
      v.removeEventListener('canplay', apply)
    }
  }, [rate])

  return (
    <video
      ref={ref}
      className="block h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
    >
      <source src={webm} type="video/webm" />
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
    </video>
  )
}
