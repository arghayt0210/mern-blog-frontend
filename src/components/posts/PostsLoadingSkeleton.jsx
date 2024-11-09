export default function PostsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="p-6">
            {/* Description skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Date skeleton */}
            <div className="mt-4 h-3 bg-gray-200 rounded w-1/4"></div>

            {/* Actions skeleton */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
