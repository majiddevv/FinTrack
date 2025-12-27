import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}) => {
  const buttonClasses = {
    danger: 'btn-danger',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    primary: 'btn-primary',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center py-4">
        <div className={`p-3 rounded-full mb-4 ${
          type === 'danger' ? 'bg-red-100' : 
          type === 'warning' ? 'bg-amber-100' : 'bg-primary-100'
        }`}>
          <AlertTriangle className={`w-6 h-6 ${
            type === 'danger' ? 'text-red-600' : 
            type === 'warning' ? 'text-amber-600' : 'text-primary-600'
          }`} />
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${buttonClasses[type]} flex-1`}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

