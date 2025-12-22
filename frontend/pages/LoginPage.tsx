
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME, APP_SUBTITLE } from '../constants';
import { LockIcon, UsersIcon } from '../components/icons';
import FormError from '../components/forms/FormError';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al iniciar sesión.';
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121416] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {APP_NAME}
          </h1>
          <p className="text-base text-[#a2abb3] mt-2">{APP_SUBTITLE}</p>
        </div>
        <div className="bg-[#1a1f25] border border-[#40474f] shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#a2abb3]">
                Usuario
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UsersIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  {...register('username')}
                  aria-invalid={errors.username ? 'true' : 'false'}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.username ? 'border-red-500' : 'border-[#40474f]'
                    } rounded-md shadow-sm focus:outline-none focus:ring-[#3f7fbf] focus:border-[#3f7fbf] sm:text-sm bg-[#1f2328] text-white placeholder-[#a2abb3]/70`}
                  placeholder="admin, shipper, o carrier"
                />
              </div>
              {errors.username && (
                <FormError message={errors.username.message} />
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a2abb3]">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-[#40474f]'
                    } rounded-md shadow-sm focus:outline-none focus:ring-[#3f7fbf] focus:border-[#3f7fbf] sm:text-sm bg-[#1f2328] text-white placeholder-[#a2abb3]/70`}
                  placeholder="password123"
                />
              </div>
              {errors.password && (
                <FormError message={errors.password.message} />
              )}
            </div>

            {/* Root/General Error */}
            {errors.root && (
              <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                {errors.root.message}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Iniciar sesión"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#3f7fbf] hover:bg-[#3f7fbf]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3f7fbf] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
              >
                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#a2abb3]">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
                Regístrate aquí
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              <Link to="/" className="hover:underline">Volver al Inicio</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
