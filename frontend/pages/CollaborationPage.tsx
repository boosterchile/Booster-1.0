
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, PlatformSettings, MockUserCredentials, BlockchainEvent } from '../types'; 
import { 
    UsersIcon, 
    LockIcon, 
    InfoIconPhosphor, 
    BriefcaseIcon,
    UserCircleIcon,
    AlertTriangleIcon,
} from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiService } from '../services/apiService';

const initialUserForm: MockUserCredentials = {
  username: '',
  name: '',
  email: '',
  role: 'Shipper',
  companyName: '',
  status: 'Active',
};

const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings | null>(null);
  const [blockchainLog, setBlockchainLog] = useState<BlockchainEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userFormData, setUserFormData] = useState<MockUserCredentials>(initialUserForm);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        if (currentUser?.role === 'Admin') {
            const [usersRes, settingsRes, logRes] = await Promise.all([
                apiService.getUsers(),
                apiService.getData<PlatformSettings>('settings'),
                apiService.getData<BlockchainEvent[]>('blockchain')
            ]);
            if(usersRes.success) setUsersList(usersRes.data!);
            if(settingsRes.success) setPlatformSettings(settingsRes.data!);
            if(logRes.success) setBlockchainLog(logRes.data!.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } else {
             const settingsRes = await apiService.getData<PlatformSettings>('settings');
             if(settingsRes.success) setPlatformSettings(settingsRes.data!);
        }
        setIsLoading(false);
    };
    loadData();
  }, [currentUser]);

  const cardBaseStyle = "bg-[#1a1f25] border border-[#40474f] shadow-lg rounded-xl p-4 sm:p-6 text-white";
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-[#40474f] rounded-md shadow-sm focus:outline-none focus:ring-[#3f7fbf] focus:border-[#3f7fbf] sm:text-sm bg-[#1f2328] text-white placeholder-[#a2abb3]/70";
  const labelStyle = "block text-sm font-medium text-[#a2abb3]";
  const buttonPrimaryStyle = "w-full sm:w-auto bg-[#3f7fbf] hover:bg-[#3f7fbf]/80 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition duration-150 disabled:opacity-60 flex items-center justify-center mobile-tap-target";
  const buttonSecondaryStyle = "w-full sm:w-auto bg-[#2c3035] hover:bg-[#40474f] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition duration-150 disabled:opacity-60 flex items-center justify-center mobile-tap-target";

  const adminTabs = [ 
    { id: 'users', label: 'Gestión de Usuarios', icon: UsersIcon },
    { id: 'blockchainlog', label: 'Log Blockchain (Sim.)', icon: LockIcon },
    { id: 'general', label: 'Info. Plataforma', icon: InfoIconPhosphor },
  ];
  const userTabs = [
    { id: 'profile', label: 'Mi Perfil', icon: UserCircleIcon },
    { id: 'tools', label: 'Herramientas Colab.', icon: BriefcaseIcon },
  ];
  const tabItems = currentUser?.role === 'Admin' ? adminTabs : userTabs;
  
  useEffect(() => {
      setActiveTab(currentUser?.role === 'Admin' ? 'users' : 'profile');
  }, [currentUser]);

  const handleOpenUserModal = (user: UserProfile | null = null) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({ ...user, username: user.id, password: '' });
    } else {
      setEditingUser(null);
      setUserFormData({ ...initialUserForm, username: `newuser_${Math.random().toString(36).substring(2, 9)}` });
    }
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => setIsUserModalOpen(false);

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    const { username, name, email, role, companyName, password } = userFormData;
    if (!username || !name || !email || !role || !companyName) {
        addToast("Complete los campos obligatorios.", 'error');
        return;
    }
     if (!editingUser && (!password || password.length < 8)) { 
        addToast("La contraseña es obligatoria (mín. 8 caracteres) para nuevos usuarios.", 'error');
        return;
    }

    if (editingUser) {
      const res = await apiService.updateUser({ ...editingUser, ...userFormData });
      if (res.success) {
          setUsersList(prev => prev.map(u => u.id === editingUser.id ? res.data! : u));
          addToast("Usuario actualizado correctamente.", 'success');
      } else {
          addToast(res.message || "Error al actualizar.", 'error');
      }
    } else { 
      const res = await apiService.register(userFormData);
      if (res.success) {
          setUsersList(prev => [...prev, res.data!]);
          addToast("Usuario creado correctamente.", 'success');
      } else {
          addToast(res.message || "Error al crear.", 'error');
      }
    }
    handleCloseUserModal();
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
        addToast("No puedes eliminar tu propia cuenta.", "error");
        return;
    }
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.")) {
        const res = await apiService.deleteUser(userId);
        if (res.success) {
            setUsersList(prev => prev.filter(u => u.id !== userId));
            addToast("Usuario eliminado.", "success");
        } else {
            addToast(res.message || "Error al eliminar usuario.", "error");
        }
    }
  };

  const filteredUsers = useMemo(() => usersList.filter(user => 
    Object.values(user).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [usersList, searchTerm]);

  if (isLoading || !platformSettings) return <div className="text-center p-10">Cargando configuración...</div>;
  
  const renderUserManagement = () => (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <input
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuarios..." className={`${inputStyle} w-full sm:w-2/3 lg:w-1/2 text-sm`}
            />
            <button onClick={() => handleOpenUserModal(null)} className={buttonPrimaryStyle}>
                Crear Usuario
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
                <div key={user.id} className="bg-[#1f2328] p-4 rounded-xl border border-[#40474f] shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between">
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3"/>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-indigo-300 truncate">{user.name}</h3>
                                <p className="text-xs text-[#a2abb3] truncate">{user.email}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-500/20 text-green-300' : user.status === 'Inactive' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                {user.status}
                            </span>
                        </div>
                        <p className="text-xs text-[#a2abb3]/80 mt-1.5">{user.companyName} - {user.role}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button onClick={() => handleOpenUserModal(user)} className={`${buttonSecondaryStyle} !text-xs !py-1.5 flex-1`}>Editar</button>
                        <button onClick={() => handleDeleteUser(user.id)} className={`${buttonSecondaryStyle} !bg-red-800 hover:!bg-red-700 !text-xs !py-1.5 flex-1`} disabled={user.id === currentUser?.id}>Eliminar</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
  
  const renderBlockchainLog = () => (
    <div>
        <h3 className="text-lg font-medium text-white mb-4">Log de Eventos Blockchain (Simulado)</h3>
        {blockchainLog.length === 0 ? <p className="text-[#a2abb3]/80">No hay eventos.</p> : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {blockchainLog.map(event => (
                    <div key={event.id} className="p-3 bg-[#1f2328] border border-[#40474f] rounded-lg text-xs">
                        <p className="font-semibold text-blue-300">Tipo: {event.eventType}</p>
                        <p className="text-[#a2abb3]">Timestamp: {new Date(event.timestamp).toLocaleString('es-CL')}</p>
                        <details className="mt-1 text-[#a2abb3]"><summary className="cursor-pointer text-blue-400 hover:underline text-xs">Detalles</summary><pre className="mt-1 p-2 bg-[#2c3035] rounded text-xs overflow-x-auto">{JSON.stringify(event.details, null, 2)}</pre></details>
                    </div>
                ))}
            </div>
        )}
    </div>
  );

  return (
    <div className={cardBaseStyle}>
      <div className="mb-6 border-b border-[#40474f]">
        <nav className="-mb-px flex flex-wrap gap-x-4 gap-y-2" aria-label="Tabs">
          {tabItems.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm mobile-tap-target flex items-center gap-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-[#a2abb3] hover:text-white hover:border-gray-500'}`}>
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-blue-400' : 'text-[#a2abb3]'}`}/> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {/* Render content based on activeTab */}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'blockchainlog' && renderBlockchainLog()}
        {/* Other tabs... */}
      </div>

      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={handleCloseUserModal}>
          <div className={`${cardBaseStyle} w-full max-w-lg max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-white">{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
             <div className="space-y-4 text-sm mt-4">
              <div><label className={labelStyle}>Nombre:</label><input type="text" name="name" value={userFormData.name} onChange={handleUserFormChange} className={inputStyle} /></div>
              <div><label className={labelStyle}>ID/Username:</label><input type="text" name="username" value={userFormData.username} onChange={handleUserFormChange} className={inputStyle} disabled={!!editingUser} /></div>
              {!editingUser && (<div><label className={labelStyle}>Contraseña:</label><input type="password" name="password" value={userFormData.password || ''} onChange={handleUserFormChange} className={inputStyle} /></div>)}
              <div><label className={labelStyle}>Email:</label><input type="email" name="email" value={userFormData.email} onChange={handleUserFormChange} className={inputStyle} /></div>
              <div><label className={labelStyle}>Compañía:</label><input type="text" name="companyName" value={userFormData.companyName} onChange={handleUserFormChange} className={inputStyle} /></div>
              <div><label className={labelStyle}>Rol:</label>
                <select name="role" value={userFormData.role} onChange={handleUserFormChange} className={inputStyle}>
                  <option value="Shipper">Shipper</option><option value="Carrier">Carrier</option><option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={handleCloseUserModal} className={buttonSecondaryStyle}>Cancelar</button>
              <button onClick={handleSaveUser} className={buttonPrimaryStyle}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
