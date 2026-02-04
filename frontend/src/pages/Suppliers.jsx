import React, { useState, useEffect, useCallback } from 'react';
import '../style/Suppliers.css';
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
    Building,
    Loader2,
    AlertTriangle,
    Filter,
    AlertCircle
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

// Special instance for PATCH requests with correct content-type
const apiPatch = axios.create({
    baseURL: API_BASE,
    headers: {
        'Accept': 'application/ld+json',
        'Content-Type': 'application/merge-patch+json' // Required for PATCH in Symfony/API Platform
    }
});

// Phone validation helper function
const isValidPhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    
    // Remove spaces for validation but keep original for display
    const cleanedPhone = phone.trim();
    
    // Check if phone has at least 8 digits (excluding + and spaces)
    const digitCount = cleanedPhone.replace(/[^\d]/g, '').length;
    
    // Basic validation - at least 8 digits and starts with + or has digits
    return digitCount >= 8 && cleanedPhone.length > 0;
};

// Format phone number for display
const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone;
};

// --- Modal Components ---
const AddSupplierModal = ({ 
    newSupplier, 
    setNewSupplier, 
    onClose, 
    onSubmit, 
    isEditing, 
    onUpdate,
    validationError 
}) => (
    <div className="modal-overlay">
        <div className="modal">
            <div className="modal-header">
                <div className="modal-title">
                    <Building size={20} />
                    <h2>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                </div>
                <button className="btn-close" onClick={onClose}><X size={24} /></button>
            </div>
            <div className="modal-body">
                {validationError && (
                    <div className="validation-error">
                        <AlertCircle size={16} />
                        <span>{validationError}</span>
                    </div>
                )}
                <div className="form-group">
                    <label>Supplier Name *</label>
                    <input
                        type="text"
                        placeholder="e.g., Auto Parts Co."
                        value={newSupplier.nom_fr}
                        onChange={(e) => setNewSupplier({...newSupplier, nom_fr: e.target.value})}
                        className={!newSupplier.nom_fr?.trim() ? 'error' : ''}
                    />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        placeholder="email@example.com"
                        value={newSupplier.email}
                        onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                        className={!newSupplier.email?.trim() ? 'error' : ''}
                    />
                </div>
                <div className="form-group">
                    <label>Phone *</label>
                    <input
                        type="text"
                        placeholder="Example: +33 6 12 34 56 78"
                        value={newSupplier.telephone}
                        onChange={(e) => setNewSupplier({...newSupplier, telephone: e.target.value})}
                        className={!isValidPhoneNumber(newSupplier.telephone) ? 'error' : ''}
                    />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <textarea
                        placeholder="Street, City, Country"
                        value={newSupplier.adresse}
                        onChange={(e) => setNewSupplier({...newSupplier, adresse: e.target.value})}
                        rows="3"
                    />
                </div>
            </div>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-submit" onClick={isEditing ? onUpdate : onSubmit}>
                    {isEditing ? 'Save Changes' : 'Create Supplier'}
                </button>
            </div>
        </div>
    </div>
);

const DeleteConfirmationModal = ({ supplier, onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal modal-sm">
            <div className="modal-header">
                <div className="modal-title">
                    <AlertTriangle size={20} color="#ef4444" />
                    <h2>Delete Supplier</h2>
                </div>
            </div>
            <div className="modal-body">
                <p>Are you sure you want to delete this supplier? This action cannot be undone.</p>
                <div className="delete-supplier-details">
                    <h3>{supplier?.nom_fr}</h3>
                    <p><Mail size={14} /> {supplier?.email}</p>
                    <p><Phone size={14} /> {supplier?.telephone}</p>
                </div>
            </div>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-delete" onClick={onConfirm}>Delete Supplier</button>
            </div>
        </div>
    </div>
);

// --- Main Component ---
const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [deleteSupplier, setDeleteSupplier] = useState(null);
    const [validationError, setValidationError] = useState('');

    const [newSupplier, setNewSupplier] = useState({
        nom_fr: '',
        email: '',
        telephone: '',
        adresse: ''
    });

    const fetchSuppliers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/fournisseurs');
            const data = response.data['hydra:member'] || response.data['member'] || [];
            setSuppliers(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch suppliers from server.");
            console.error("Error fetching suppliers:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const validateSupplierForm = () => {
        setValidationError('');
        
        if (!newSupplier.nom_fr?.trim()) {
            setValidationError("⚠️ Please enter supplier name!");
            return false;
        }
        if (!newSupplier.email?.trim()) {
            setValidationError("⚠️ Please enter email!");
            return false;
        }
        if (!isValidPhoneNumber(newSupplier.telephone)) {
            setValidationError("⚠️ Please enter a valid phone number (minimum 8 digits)!");
            return false;
        }
        
        return true;
    };

    const handleAddSupplier = async () => {
        try {
            // Validation
            if (!validateSupplierForm()) {
                return;
            }

            const payload = {
                nom_fr: newSupplier.nom_fr,
                email: newSupplier.email,
                telephone: newSupplier.telephone,
                adresse: newSupplier.adresse || ''
            };

            await api.post('/api/fournisseurs', payload);
            setShowAddSupplierModal(false);
            setNewSupplier({ nom_fr: '', email: '', telephone: '', adresse: '' });
            setValidationError('');
            fetchSuppliers();
            alert("✅ Supplier added successfully!");
        } catch (err) {
            alert("❌ Error: Unable to add supplier. Please try again.");
            console.error("API Error adding supplier:", err.response?.data || err.message);
        }
    };

    const handleEditSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setModalMode('edit');
        setNewSupplier({
            nom_fr: supplier.nom_fr || '',
            email: supplier.email || '',
            telephone: supplier.telephone || '',
            adresse: supplier.adresse || ''
        });
        setValidationError('');
        setShowAddSupplierModal(true);
    };

    const handleUpdateSupplier = async () => {
        try {
            if (!selectedSupplier) return;

            // Validation
            if (!validateSupplierForm()) {
                return;
            }

            const supplierId = selectedSupplier.id_fr || selectedSupplier.id;
            const payload = {
                nom_fr: newSupplier.nom_fr,
                email: newSupplier.email,
                telephone: newSupplier.telephone,
                adresse: newSupplier.adresse || ''
            };

            // FIXED: Use apiPatch with correct content-type for PATCH
            await apiPatch.patch(`/api/fournisseurs/${supplierId}`, payload);
            
            setShowAddSupplierModal(false);
            setNewSupplier({ nom_fr: '', email: '', telephone: '', adresse: '' });
            setValidationError('');
            fetchSuppliers();
            alert("✅ Supplier updated successfully!");
        } catch (err) {
            alert("❌ Error: Unable to update supplier. Please try again.");
            console.error("API Error updating supplier:", err.response?.data || err.message);
        }
    };

    const handleDeleteSupplier = (supplier) => {
        setDeleteSupplier(supplier);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const supplierId = deleteSupplier.id_fr || deleteSupplier.id;
            await api.delete(`/api/fournisseurs/${supplierId}`);
            setShowDeleteModal(false);
            setDeleteSupplier(null);
            fetchSuppliers();
            alert("✅ Supplier deleted successfully!");
        } catch (err) {
            alert("❌ Error: Unable to delete supplier. Please try again.");
            console.error("API Error deleting supplier:", err.response?.data || err.message);
        }
    };

    // Search functionality
    const filteredSuppliers = suppliers.filter(supplier => {
        if (!searchTerm.trim()) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
            (supplier.nom_fr || '').toLowerCase().includes(searchLower) ||
            (supplier.email || '').toLowerCase().includes(searchLower) ||
            (supplier.telephone || '').toString().includes(searchLower) ||
            (supplier.adresse || '').toLowerCase().includes(searchLower)
        );
    });

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 className="spinner" size={32} />
                <p>Loading suppliers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <AlertTriangle size={48} color="#ef4444" />
                <h3>Error Loading Suppliers</h3>
                <p>{error}</p>
                <button onClick={fetchSuppliers} className="btn-retry">Retry</button>
            </div>
        );
    }

    return (
        <div className="suppliers-container">
            <div className="header-section">
                <h1>Suppliers</h1>
                <button 
                    className="btn-add-main" 
                    onClick={() => {
                        setModalMode('add');
                        setNewSupplier({ nom_fr: '', email: '', telephone: '', adresse: '' });
                        setValidationError('');
                        setShowAddSupplierModal(true);
                    }}
                >
                    <Plus size={18} /> Add New Supplier
                </button>
            </div>

            <div className="search-container">
                <div className="search-wrapper">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search suppliers by name, email, or phone..."
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

            <div className="suppliers-grid">
                {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => {
                        const id = supplier.id_fr || supplier.id;
                        return (
                            <div key={id} className="supplier-card">
                                <div className="supplier-header">
                                    <h3>{supplier.nom_fr}</h3>
                                    <div className="supplier-actions">
                                        <button 
                                            className="btn-icon edit" 
                                            onClick={() => handleEditSupplier(supplier)}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            className="btn-icon delete" 
                                            onClick={() => handleDeleteSupplier(supplier)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="supplier-details">
                                    <div className="detail-item">
                                        <Mail size={16} />
                                        <span>{supplier.email}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <Phone size={16} />
                                        <span>{formatPhoneNumber(supplier.telephone)}</span>
                                    </div>
                                    
                                    {supplier.adresse && (
                                        <div className="detail-item">
                                            <MapPin size={16} />
                                            <span>{supplier.adresse}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-results">
                        <Building size={48} />
                        <h3>No Suppliers Found</h3>
                        {searchTerm ? (
                            <p>No suppliers found matching "<strong>{searchTerm}</strong>"</p>
                        ) : (
                            <p>No suppliers available. Add your first supplier!</p>
                        )}
                    </div>
                )}
            </div>

            {showAddSupplierModal && (
                <AddSupplierModal
                    newSupplier={newSupplier}
                    setNewSupplier={setNewSupplier}
                    onClose={() => {
                        setShowAddSupplierModal(false);
                        setNewSupplier({ nom_fr: '', email: '', telephone: '', adresse: '' });
                        setValidationError('');
                    }}
                    onSubmit={handleAddSupplier}
                    isEditing={modalMode === 'edit'}
                    onUpdate={handleUpdateSupplier}
                    validationError={validationError}
                />
            )}

            {showDeleteModal && deleteSupplier && (
                <DeleteConfirmationModal
                    supplier={deleteSupplier}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setDeleteSupplier(null);
                    }}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default Suppliers;