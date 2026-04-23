import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-32 left-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg text-white font-semibold shadow-lg animate-slideUp max-w-sm ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
