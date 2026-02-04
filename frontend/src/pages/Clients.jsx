import React, { useState, useEffect, useCallback } from 'react';
import '../style/Clients.css';
import axios from 'axios';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    X,
    Phone,
    Mail,
    MapPin,
    User,
    Loader2,
    AlertTriangle,
    Filter,
    FileText
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

// Create separate axios instances for different operations
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Accept': 'application/ld+json',
        'Content-Type': 'application/ld+json'
    }
});

// Special instance for PATCH requests
const apiPatch = axios.create({
    baseURL: API_BASE,
    headers: {
        'Accept': 'application/ld+json',
        'Content-Type': 'application/merge-patch+json' // Required for PATCH
    }
});

// --- Modal Components ---
const AddClientModal = ({ 
    newClient, 
    setNewClient, 
    onClose, 
    onSubmit, 
    isEditing, 
    onUpdate 
}) => (
    <div className="modal-overlay">
        <div className="modal">
            <div className="modal-header">
                <div className="modal-title">
                    <User size={20} />
                    <h2>{isEditing ? 'Edit Client' : 'Add New Client'}</h2>
                </div>
                <button className="btn-close" onClick={onClose}><X size={24} /></button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Client Name *</label>
                    <input
                        type="text"
                        placeholder="Enter client name"
                        value={newClient.nom_client}
                        onChange={(e) => setNewClient({...newClient, nom_client: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                        type="text"
                        placeholder="+33 1 23 45 67 89"
                        value={newClient.telephone}
                        onChange={(e) => setNewClient({...newClient, telephone: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        placeholder="client@example.com"
                        value={newClient.email}
                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Address *</label>
                    <textarea
                        placeholder="Street, City, Country"
                        value={newClient.adresse}
                        onChange={(e) => setNewClient({...newClient, adresse: e.target.value})}
                        rows="3"
                    />
                </div>
            </div>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-submit" onClick={isEditing ? onUpdate : onSubmit}>
                    {isEditing ? 'Save Changes' : 'Add Client'}
                </button>
            </div>
        </div>
    </div>
);

const DeleteConfirmationModal = ({ client, onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal modal-sm">
            <div className="modal-header">
                <div className="modal-title">
                    <AlertTriangle size={20} color="#ef4444" />
                    <h2>Delete Client</h2>
                </div>
            </div>
            <div className="modal-body">
                <p>Are you sure you want to delete this client? This action cannot be undone.</p>
                <div className="delete-client-details">
                    <h3>{client?.nom_client}</h3>
                    <p><Mail size={14} /> {client?.email}</p>
                </div>
            </div>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-delete" onClick={onConfirm}>Delete Client</button>
            </div>
        </div>
    </div>
);

// --- Main Component ---
const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedClient, setSelectedClient] = useState(null);
    const [deleteClient, setDeleteClient] = useState(null);

    const [newClient, setNewClient] = useState({
        nom_client: '',
        telephone: '',
        email: '',
        adresse: ''
    });

    const fetchClients = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/clients');
            
            const data = response.data['hydra:member'] || response.data['member'] || response.data || [];
            setClients(Array.isArray(data) ? data : [data]);
            setError(null);
        } catch (err) {
            setError("Failed to fetch clients from server.");
            console.error("Error fetching clients:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleAddClient = async () => {
        try {
            // Validation
            if (!newClient.nom_client?.trim()) {
                alert("⚠️ Please enter client name!");
                return;
            }
            if (!newClient.email?.trim()) {
                alert("⚠️ Please enter email!");
                return;
            }
            if (!newClient.telephone) {
                alert("⚠️ Please enter phone number!");
                return;
            }
            if (!newClient.adresse?.trim()) {
                alert("⚠️ Please enter address!");
                return;
            }

            const payload = {
                nom_client: newClient.nom_client,
                email: newClient.email,
                telephone: newClient.telephone,
                adresse: newClient.adresse
            };

            await api.post('/api/clients', payload);
            setShowAddClientModal(false);
            setNewClient({ nom_client: '', email: '', telephone: '', adresse: '' });
            fetchClients();
            alert("✅ Client added successfully!");
        } catch (err) {
            alert("❌ Error: Unable to add client. Please try again.");
            console.error("API Error adding client:", err.response?.data || err.message);
        }
    };

    const handleEditClient = (client) => {
        setSelectedClient(client);
        setModalMode('edit');
        setNewClient({
            nom_client: client.nom_client || '',
            email: client.email || '',
            telephone: client.telephone || '',
            adresse: client.adresse || ''
        });
        setShowAddClientModal(true);
    };

    const handleUpdateClient = async () => {
        try {
            if (!selectedClient) return;

            // Validation
            if (!newClient.nom_client?.trim()) {
                alert("⚠️ Please enter client name!");
                return;
            }
            if (!newClient.email?.trim()) {
                alert("⚠️ Please enter email!");
                return;
            }
            if (!newClient.telephone) {
                alert("⚠️ Please enter phone number!");
                return;
            }
            if (!newClient.adresse?.trim()) {
                alert("⚠️ Please enter address!");
                return;
            }

            const clientId = selectedClient.id_client || selectedClient.id;
            const payload = {
                nom_client: newClient.nom_client,
                email: newClient.email,
                telephone: newClient.telephone,
                adresse: newClient.adresse
            };

            // FIXED: Use apiPatch with correct content-type for PATCH
            await apiPatch.patch(`/api/clients/${clientId}`, payload);
            
            setShowAddClientModal(false);
            setNewClient({ nom_client: '', email: '', telephone: '', adresse: '' });
            fetchClients();
            alert("✅ Client updated successfully!");
        } catch (err) {
            alert("❌ Error: Unable to update client. Please try again.");
            console.error("API Error updating client:", err.response?.data || err.message);
        }
    };

    const handleDeleteClient = (client) => {
        setDeleteClient(client);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const clientId = deleteClient.id_client || deleteClient.id;
            await api.delete(`/api/clients/${clientId}`);
            setShowDeleteModal(false);
            setDeleteClient(null);
            fetchClients();
            alert("✅ Client deleted successfully!");
        } catch (err) {
            alert("❌ Error: Unable to delete client. Please try again.");
            console.error("API Error deleting client:", err.response?.data || err.message);
        }
    };

    // Search functionality
    const filteredClients = clients.filter(client => {
        if (!searchTerm.trim()) return true;
        
        const searchLower = searchTerm.toLowerCase();
        const clientName = client.nom_client || '';
        
        return (
            clientName.toLowerCase().includes(searchLower) ||
            (client.email || '').toLowerCase().includes(searchLower) ||
            (client.telephone || '').toString().includes(searchLower) ||
            (client.adresse || '').toLowerCase().includes(searchLower)
        );
    });

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 className="spinner" size={32} />
                <p>Loading clients...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <AlertTriangle size={48} color="#ef4444" />
                <h3>Error Loading Clients</h3>
                <p>{error}</p>
                <button onClick={fetchClients} className="btn-retry">Retry</button>
            </div>
        );
    }

    return (
        <div className="clients-container">
            <div className="header-section">
                <h1>Client Management</h1>
                <button 
                    className="btn-add-main" 
                    onClick={() => {
                        setModalMode('add');
                        setNewClient({ nom_client: '', email: '', telephone: '', adresse: '' });
                        setShowAddClientModal(true);
                    }}
                >
                    <Plus size={18} /> Add New Client
                </button>
            </div>

            <div className="search-container">
                <div className="search-wrapper">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search clients by name, phone, email, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            className="clear-search-btn" 
                            onClick={() => setSearchTerm('')}
                            title="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="table-responsive">
                <table className="main-table">
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client) => {
                                const id = client.id_client || client.id;
                                const clientName = client.nom_client || 'N/A';
                                
                                return (
                                    <tr key={id} className="client-row">
                                        <td className="font-bold">{clientName}</td>
                                        <td>
                                            <div className="client-detail">
                                                <Phone size={14} />
                                                <span>{client.telephone || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="client-detail">
                                                <Mail size={14} />
                                                <span>{client.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="client-detail">
                                                <MapPin size={14} />
                                                <span>{client.adresse || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="actions-container">
                                                <button 
                                                    className="btn-icon edit" 
                                                    onClick={() => handleEditClient(client)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="btn-icon delete" 
                                                    onClick={() => handleDeleteClient(client)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-results">
                                    <FileText size={48} />
                                    <h3>No Clients Found</h3>
                                    {searchTerm ? (
                                        <p>No clients found matching "<strong>{searchTerm}</strong>"</p>
                                    ) : (
                                        <p>No clients available. Add your first client!</p>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddClientModal && (
                <AddClientModal
                    newClient={newClient}
                    setNewClient={setNewClient}
                    onClose={() => {
                        setShowAddClientModal(false);
                        setNewClient({ nom_client: '', email: '', telephone: '', adresse: '' });
                    }}
                    onSubmit={handleAddClient}
                    isEditing={modalMode === 'edit'}
                    onUpdate={handleUpdateClient}
                />
            )}

            {showDeleteModal && deleteClient && (
                <DeleteConfirmationModal
                    client={deleteClient}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setDeleteClient(null);
                    }}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default Clients;