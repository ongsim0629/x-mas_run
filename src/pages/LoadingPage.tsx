const LoadingPage = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-8">Loading Game...</h1>
        <div className="w-32 h-32 relative">
          <div className="absolute inset-0 border-t-4 border-blue-200 border-solid rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
