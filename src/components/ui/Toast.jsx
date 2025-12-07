'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, Check, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ title, description, type = 'success', duration = 3000 }) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type, duration }]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-24 md:bottom-8 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ title, description, type, onClose }) {
    const icons = {
        success: <Check className="w-5 h-5 text-[#00ff88]" />,
        error: <X className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    };

    const borders = {
        success: 'border-[#00ff88]/30',
        error: 'border-red-500/30',
        info: 'border-blue-400/30',
        warning: 'border-yellow-500/30'
    };

    return (
        <div className={`pointer-events-auto min-w-[300px] max-w-md bg-black/80 backdrop-blur-xl border ${borders[type]} p-4 rounded-xl shadow-2xl animate-slide-up flex items-start gap-3`}>
            <div className={`p-2 rounded-full bg-white/5 ${type === 'success' ? 'shadow-[0_0_15px_rgba(0,255,136,0.2)]' : ''}`}>
                {icons[type]}
            </div>
            <div className="flex-1 pt-1">
                <h4 className="font-bold text-white text-sm">{title}</h4>
                {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
