"use client";

export function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Video */}
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
      >
        <source src="/videos/background3.mp4" type="video/mp4" />
      </video>

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Dark gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

      {/* Purple/Indigo tint to match the theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40" />
    </div>
  );
}
