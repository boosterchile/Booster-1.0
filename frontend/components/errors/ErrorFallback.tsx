
import React, { ErrorInfo } from 'react';

interface ErrorFallbackProps {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    onReset?: () => void;
}

/**
 * Friendly error UI displayed when an error is caught by ErrorBoundary
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, onReset }) => {
    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-[#0a0d12] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-[#1a1f25] border border-[#40474f] rounded-xl p-8 shadow-2xl">
                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-2xl font-bold text-white text-center mb-2">
                    ¡Ups! Algo salió mal
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    Ha ocurrido un error inesperado. No te preocupes, estamos trabajando en ello.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && error && (
                    <div className="bg-[#0a0d12] border border-red-500/20 rounded-lg p-4 mb-6 max-h-60 overflow-auto">
                        <p className="text-red-400 font-mono text-sm mb-2 font-semibold">
                            {error.name}: {error.message}
                        </p>
                        {errorInfo && (
                            <pre className="text-gray-500 text-xs font-mono whitespace-pre-wrap">
                                {errorInfo.componentStack}
                            </pre>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onReset && (
                        <button
                            onClick={onReset}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-md"
                        >
                            Intentar de nuevo
                        </button>
                    )}
                    <button
                        onClick={handleReload}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-md"
                    >
                        Recargar página
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-md"
                    >
                        Ir al inicio
                    </button>
                </div>

                {/* Help Text */}
                <p className="text-gray-500 text-sm text-center mt-6">
                    Si el problema persiste, por favor contacta al soporte técnico.
                </p>
            </div>
        </div>
    );
};

export default ErrorFallback;
