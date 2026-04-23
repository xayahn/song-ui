export default function ConfirmDialog({ 
  title, 
  message, 
  isOpen, 
  onConfirm, 
  onCancel,
  confirmLabel = 'Confirm',
  confirmColor = 'red',
  isLoading = false
}) {
  if (!isOpen) return null;

  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
        <h2 className="text-white text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded transition font-semibold ${
              colorClasses[confirmColor]
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}