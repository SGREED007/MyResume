'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

export function ToastItem({ toast, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />,
    };

    const styles = {
        success: 'bg-green-50 border-green-500 text-green-800',
        error: 'bg-red-50 border-red-500 text-red-800',
        warning: 'bg-orange-50 border-orange-500 text-orange-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
    };

    return (
        <div
            className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg ${styles[toast.type]} animate-in slide-in-from-right duration-300`}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="flex-shrink-0">{icons[toast.type]}</div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 max-w-md"
            aria-label="Notifications"
            role="region"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
}
