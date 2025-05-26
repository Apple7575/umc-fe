// src/components/CommentSkeleton.tsx
const CommentSkeleton = () => (
    <div className="bg-gray-700 p-4 rounded-lg animate-pulse mb-2">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 w-24 bg-gray-500 rounded"></div>
        <div className="h-3 w-12 bg-gray-500 rounded"></div>
      </div>
      <div className="h-4 w-full bg-gray-600 rounded mb-1"></div>
      <div className="h-4 w-3/4 bg-gray-600 rounded"></div>
    </div>
  );
  
  export default CommentSkeleton;