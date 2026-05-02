const FallbackUI = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-semibold text-red-600">
        Something went wrong 😢
      </h2>

      <p className="mb-6 text-sm text-gray-500">
        An unexpected error occurred. Please try reloading the page.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-95"
      >
        Reload
      </button>
    </div>
  );
};

export default FallbackUI;
