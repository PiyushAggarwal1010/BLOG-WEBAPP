import React from 'react'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-stone-900/40 dark:bg-stone-950/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all">
            <div className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-transparent dark:border-stone-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all">
                <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-white text-center">{title}</h3>
                <p className="mb-8 text-center text-stone-500 dark:text-stone-400 leading-relaxed">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-6 py-2.5 rounded-full font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-auto bg-rose-600 dark:bg-rose-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-rose-700 dark:hover:bg-rose-500 transition-colors shadow-sm"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal