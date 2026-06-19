import React from 'react'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white text-stone-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all">
                <h3 className="text-xl font-bold mb-2 text-stone-900 text-center">{title}</h3>
                <p className="mb-8 text-center text-stone-500 leading-relaxed">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-stone-100 text-stone-700 px-6 py-2.5 rounded-full font-medium hover:bg-stone-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-auto bg-rose-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-rose-700 transition-colors shadow-sm"
                    >
                        Yes, delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
