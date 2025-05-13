import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Confirm", message = "Are you sure to do this action?" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="dark:bg-gray-800  bg-gray-300  p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="dark:text-gray-300 text-black mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button  className="px-4 py-2 dark:bg-gray-300 bg-gray-400   text-black rounded" onClick={onClose}>Cancel</button>
          <button  className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;