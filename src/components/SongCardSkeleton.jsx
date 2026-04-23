export default function SongCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="w-full h-40 bg-gray-700 rounded mb-3"></div>

      {/* Title Skeleton */}
      <div className="h-4 bg-gray-700 rounded mb-2"></div>

      {/* Artist Skeleton */}
      <div className="h-3 bg-gray-700 rounded mb-2 w-3/4"></div>

      {/* Album Skeleton */}
      <div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>

      {/* Play Button Skeleton */}
      <div className="w-full h-9 bg-gray-700 rounded mb-2"></div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-gray-700 rounded"></div>
        <div className="flex-1 h-8 bg-gray-700 rounded"></div>
        <div className="flex-1 h-8 bg-gray-700 rounded"></div>
        <div className="flex-1 h-8 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
