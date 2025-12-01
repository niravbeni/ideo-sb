export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🎵</div>
        <p className="text-lg text-gray-600 font-semibold">Loading soundboard...</p>
        <div className="mt-4 flex justify-center gap-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-pink-600 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}

