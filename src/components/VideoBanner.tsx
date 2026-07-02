import { useEffect, useRef } from 'react'
import heroVideo from '../assets/video/video_ai.mp4'

export default function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || hasStartedRef.current) return

    const startOnce = async () => {
      if (hasStartedRef.current) return
      hasStartedRef.current = true

      video.muted = true

      try {
        await video.play()
      } catch {
        hasStartedRef.current = false
      }
    }

    const onLoaded = () => void startOnce()

    if (video.readyState >= 2) {
      void startOnce()
      return
    }

    video.addEventListener('loadedmetadata', onLoaded, { once: true })
    return () => video.removeEventListener('loadedmetadata', onLoaded)
  }, [])

  return (
    <div
      className="animate-fade-up mx-auto mt-8 w-full max-w-2xl sm:mt-10"
      style={{ animationDelay: '0.45s' }}
    >
      <div
        className="hero-video-player glass-card overflow-hidden rounded-2xl p-1 shadow-2xl shadow-cyan-500/20 notranslate"
        translate="no"
      >
        <div className="relative overflow-hidden rounded-xl bg-slate-950">
          <video
            ref={videoRef}
            controls
            muted
            playsInline
            loop
            preload="metadata"
            className="block w-full bg-slate-950 object-contain"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  )
}