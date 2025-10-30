"use client"

import React from "react"

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      type="button"
      className={`ml-2 px-2 py-1 text-xs border rounded bg-gray-100 ${copied ? "text-green-600 border-green-300 bg-green-50" : "text-gray-400"} select-none`}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      aria-label="Copier dans le presse-papier"
    >
      {copied ? "Copié !" : "Copier"}
    </button>
  )
}
