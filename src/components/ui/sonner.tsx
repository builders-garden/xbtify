"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        style: {
          background: "rgba(88, 28, 135, 0.95)",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          color: "white",
          backdropFilter: "blur(12px)",
        },
        classNames: {
          success: "bg-gradient-to-r from-purple-500/95 to-indigo-500/95 border-purple-400/30 text-white backdrop-blur-xl",
          error: "bg-gradient-to-r from-red-500/95 to-pink-500/95 border-red-400/30 text-white backdrop-blur-xl",
          info: "bg-gradient-to-r from-blue-500/95 to-cyan-500/95 border-blue-400/30 text-white backdrop-blur-xl",
          warning: "bg-gradient-to-r from-yellow-500/95 to-orange-500/95 border-yellow-400/30 text-white backdrop-blur-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
