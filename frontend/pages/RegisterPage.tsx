

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '../constants';
import { MockUserCredentials } from '../types';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<MockUserCredentials>({
        username: '', password: '', name: '', role: 'Shipper',
        companyName: '', email: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!formData.username || !formData.password || !formData.name || !formData.email || !formData.companyName) {
            setError("Por favor, complete todos los campos requeridos.");
            return;
        }
        if (formData.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            const result = await register(formData);
            if (result.success) {
                if (formData.role === 'Carrier') {
                    setSuccessMessage("¡Registro exitoso! Su cuenta como transportista está pendiente de aprobación por un administrador.");
                    setTimeout(() => navigate('/login'), 5000); // Redirect after message
                } else {
                    navigate('/dashboard'); // Shippers log in directly
                }
            } else {
                setError(result.message || 'Error desconocido durante el registro.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido durante el registro.');
        }
    };
    
    const inputStyle = "block w-full pl-3 pr-3 py-2 border border-[#40474f] rounded-md shadow-sm focus:outline-none focus:ring-[#3f7fbf] focus:border-[#3f7fbf] sm:text-sm bg-[#1f2328] text-white placeholder-[#a2abb3]/70";
    const labelStyle = "block text-sm font-medium text-[#a2abb3] mb-1";

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#121416] p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        Bienvenido a {APP_NAME}
                    </h1>
                    <p className="text-base text-[#a2abb3] mt-2">Cree su cuenta para empezar</p>
                </div>
                <div className="bg-[#1a1f25] border border-[#40474f] shadow-lg rounded-xl p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">Registro de Nuevo Usuario</h2>
                    {successMessage ? (
                         <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-md">
                            <p className="text-green-300">{successMessage}</p>
                            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 mt-4 block">
                                Ir a Iniciar Sesión
                            </Link>
                        </div>
                    ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="role" className={labelStyle}>Soy un...</label>
                                <select id="role" name="role" value={formData.role} onChange={handleInputChange} className={inputStyle}>
                                    <option value="Shipper">Shipper (Remitente)</option>
                                    <option value="Carrier">Carrier (Transportista)</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="companyName" className={labelStyle}>Nombre de la Empresa</label>
                                <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className={inputStyle} required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="name" className={labelStyle}>Nombre Completo (Contacto)</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="email" className={labelStyle}>Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={inputStyle} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="username" className={labelStyle}>Nombre de Usuario</label>
                                <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="password" className={labelStyle}>Contraseña</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} className={inputStyle} required minLength={8} />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md border border-red-500/20">{error}</p>}
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#3f7fbf] hover:bg-[#3f7fbf]/80 focus:outline-none disabled:opacity-60">
                                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                            </button>
                        </div>
                    </form>
                    )}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#a2abb3]">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
