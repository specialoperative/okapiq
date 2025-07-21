export default function Loading() {
  // Lightweight fallback UI while the Data Explorer page streams in.
  return (
    <div
      className="flex h-full min-h-[50vh] w-full items-center justify-center bg-black"
      aria-label="Loading Data Explorer"
    >
      {/* Lucide's Loader2 icon spins to indicate activity */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 animate-spin text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="sr-only">{"Loading…"}</span>
    </div>
  )
}
