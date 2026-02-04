import React, { useState, useEffect, useCallback } from 'react';
import './../style/ProductList.css';
import axios from 'axios';
import { 
    ChevronDown, 
    ChevronRight, 
    Plus, 
    Edit2, 
    Trash2, 
    Search, 
    X, 
    Loader2,
    Package,
    Tag,
    Layers,
    DollarSign,
    Hash,
    AlertCircle,
    Save,
    Check,
    AlertTriangle
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Accept': 'application/ld+json',
        'Content-Type': 'application/ld+json'
    }
});

// --- New Modal Components for Category and Unit ---

const AddCategoryModal = ({ onClose, onSubmit }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = () => {
        if (categoryName.trim()) {
            onSubmit(categoryName);
            setCategoryName('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-sm">
                <div className="modal-header">
                    <div className="modal-title"><Tag size={20} /> <h2>Add New Category</h2></div>
                    <button className="btn-close" onClick={onClose}><X size={24} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Category Name *</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Electronics, Automotive" 
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-submit" onClick={handleSubmit}>Add Category</button>
                </div>
            </div>
        </div>
    );
};

const AddUnitModal = ({ onClose, onSubmit }) => {
    const [unitName, setUnitName] = useState('');

    const handleSubmit = () => {
        if (unitName.trim()) {
            onSubmit(unitName);
            setUnitName('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-sm">
                <div className="modal-header">
                    <div className="modal-title"><Hash size={20} /> <h2>Add New Unit</h2></div>
                    <button className="btn-close" onClick={onClose}><X size={24} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Unit Name *</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Pieces, Boxes, Liters" 
                            value={unitName}
                            onChange={(e) => setUnitName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-submit" onClick={handleSubmit}>Add Unit</button>
                </div>
            </div>
        </div>
    );
};

// --- Updated AddArticleModal with Add buttons ---

const AddArticleModal = ({ newArticle, setNewArticle, categories, units, onClose, onSubmit, isEditing, onUpdate, onAddCategory, onAddUnit }) => (
    <div className="modal-overlay">
        <div className="modal">
            <div className="modal-header">
                <div className="modal-title"><Package size={20} /> <h2>{isEditing ? 'Edit Article' : 'Add New Article'}</h2></div>
                <button className="btn-close" onClick={onClose}><X size={24} /></button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Article Name *</label>
                    <input type="text" placeholder="e.g., Brake Pads" value={newArticle.nom_article}
                        onChange={(e) => setNewArticle({...newArticle, nom_article: e.target.value})} />
                </div>
                
                <div className="form-group">
                    <div className="select-with-button">
                        <label>Category *</label>
                        <div className="input-group">
                            <select value={newArticle.category} onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}>
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id_category || cat.id} value={cat.id_category || cat.id}>{cat.name_category || cat.nameCategory}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                className="btn-add-inline" 
                                onClick={onAddCategory}
                                title="Add new category"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <div className="select-with-button">
                        <label>Unit *</label>
                        <div className="input-group">
                            <select value={newArticle.unit} onChange={(e) => setNewArticle({...newArticle, unit: e.target.value})}>
                                <option value="">Select unit</option>
                                {units.map(unit => (
                                    <option key={unit.id_unit || unit.id} value={unit.id_unit || unit.id}>{unit.name_unit || unit.nameUnit}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                className="btn-add-inline" 
                                onClick={onAddUnit}
                                title="Add new unit"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-submit" onClick={isEditing ? onUpdate : onSubmit}>
                    {isEditing ? 'Update Article' : 'Create Article'}
                </button>
            </div>
        </div>
    </div>
);

// ... (rest of the modal components remain the same)
const AddVersionModal = ({ newVersion, setNewVersion, article, onClose, onSubmit, isEditing, onUpdate }) => (
    <div className="modal-overlay">
        <div className="modal">
            <div className="modal-header">
                <div className="modal-title"><Layers size={20} /> <h2>
                    {isEditing ? 'Edit Version' : `Add Version for ${article?.nom_article || article?.nomArticle || ''}`}
                </h2></div>
                <button className="btn-close" onClick={onClose}><X size={24} /></button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Brand (Marque) *</label>
                    <input type="text" placeholder="Bosch" value={newVersion.marque} onChange={(e) => setNewVersion({...newVersion, marque: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Reference (Code) *</label>
                    <input type="text" placeholder="BP-001" value={newVersion.code_article} onChange={(e) => setNewVersion({...newVersion, code_article: e.target.value})} />
                </div>
                <div className="form-group-row">
                    <div className="form-group">
                        <label>Price (DT)</label>
                        <input type="number" value={newVersion.cout_unitaire} onChange={(e) => setNewVersion({...newVersion, cout_unitaire: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input type="number" value={newVersion.quantite} onChange={(e) => setNewVersion({...newVersion, quantite: parseInt(e.target.value) || 0})} />
                    </div>
                </div>
            </div>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-submit" onClick={isEditing ? onUpdate : onSubmit}>
                    {isEditing ? 'Update Version' : 'Add Version'}
                </button>
            </div>
        </div>
    </div>
);

const DeleteConfirmationModal = ({ itemType, itemName, onClose, onConfirm }) => (
    <div className="modal-overlay">
        <div className="modal modal-sm">
            <div className="modal-header">
                <div className="modal-title"><AlertTriangle size={20} color="#ef4444" /> <h2>Confirm Delete</h2></div>
            </div>
            <div className="modal-body">
                <p>Are you sure you want to delete this {itemType}?</p>
                {itemName && <p className="delete-item-name"><strong>{itemName}</strong></p>}
                <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-delete" onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

// --- Main Component ---

const ProductsList = () => {
    const [articles, setArticles] = useState([]);
    const [articleCodes, setArticleCodes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedArticles, setExpandedArticles] = useState({});
    const [loading, setLoading] = useState({ initial: true, versions: false });
    const [error, setError] = useState(null);

    // Modal States
    const [showAddArticleModal, setShowAddArticleModal] = useState(false);
    const [showAddVersionModal, setShowAddVersionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showAddUnitModal, setShowAddUnitModal] = useState(false);
    
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [deleteItem, setDeleteItem] = useState({ type: '', id: '', name: '' });

    const [newArticle, setNewArticle] = useState({ nom_article: '', category: '', unit: '' });
    const [newVersion, setNewVersion] = useState({ code_article: '', marque: '', quantite: 0, cout_unitaire: 0 });

    const fetchData = useCallback(async () => {
        try {
            const [artRes, codeRes, catRes, unitRes] = await Promise.all([
                api.get('/api/articles'),
                api.get('/api/article_codes'),
                api.get('/api/categories'),
                api.get('/api/units')
            ]);
            setArticles(artRes.data['hydra:member'] || artRes.data['member'] || []);
            setArticleCodes(codeRes.data['hydra:member'] || codeRes.data['member'] || []);
            setCategories(catRes.data['hydra:member'] || catRes.data['member'] || []);
            setUnits(unitRes.data['hydra:member'] || unitRes.data['member'] || []);
            setError(null);
        } catch (err) {
            setError("Failed to fetch data from server.");
        } finally {
            setLoading(prev => ({ ...prev, initial: false }));
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAddCategory = async (categoryName) => {
        try {
            if (!categoryName.trim()) {
                alert("⚠️ Please enter category name!");
                return;
            }
            
            const payload = {
                name_category: categoryName
            };
            await api.post('/api/categories', payload);
            fetchData();
            
            alert("✅ Category added successfully!");
            
        } catch (err) { 
            alert("❌ Error: Unable to add category. Please try again.");
            console.error("API Error adding category:", err.response?.data || err.message);
        }
    };

    const handleAddUnit = async (unitName) => {
        try {
            if (!unitName.trim()) {
                alert("⚠️ Please enter unit name!");
                return;
            }
            
            const payload = {
                name_unit: unitName
            };
            await api.post('/api/units', payload);
            fetchData();
            
            alert("✅ Unit added successfully!");
            
        } catch (err) { 
            alert("❌ Error: Unable to add unit. Please try again.");
            console.error("API Error adding unit:", err.response?.data || err.message);
        }
    };

    const handleAddArticle = async () => {
        try {
            if (!newArticle.nom_article.trim()) {
                alert("⚠️ Please enter article name!");
                return;
            }
            
            if (!newArticle.category) {
                alert("⚠️ Please select a category!");
                return;
            }
            
            if (!newArticle.unit) {
                alert("⚠️ Please select a unit!");
                return;
            }

            const payload = {
                nom_article: newArticle.nom_article,
                category: `/api/categories/${newArticle.category}`,
                unit: `/api/units/${newArticle.unit}`
            };
            
            await api.post('/api/articles', payload);
            setShowAddArticleModal(false);
            setNewArticle({ nom_article: '', category: '', unit: '' });
            fetchData();
            
            alert("✅ Article added successfully!");
            
        } catch (err) { 
            alert("❌ Error: Unable to add article. Please try again.");
            
            console.error("API Error adding article:", err.response?.data || err.message);
        }
    };

    const handleEditArticle = (article) => {
        setSelectedArticle(article);
        setModalMode('edit');
        setNewArticle({
            nom_article: article.nom_article || article.nomArticle,
            category: article.category?.id_category || article.category?.id || '',
            unit: article.unit?.id_unit || article.unit?.id || ''
        });
        setShowAddArticleModal(true);
    };

    const handleUpdateArticle = async () => {
        try {
            const articleId = selectedArticle.id_article || selectedArticle.id;
            const payload = {
                nom_article: newArticle.nom_article,
                category: `/api/categories/${newArticle.category}`,
                unit: `/api/units/${newArticle.unit}`
            };
            await api.put(`/api/articles/${articleId}`, payload);
            setShowAddArticleModal(false);
            setNewArticle({ nom_article: '', category: '', unit: '' });
            fetchData();
        } catch (err) { 
            alert("Error updating article: " + (err.response?.data?.message || err.message)); 
        }
    };

    const handleAddVersion = async () => {
        try {
            const payload = {
                ...newVersion,
                article: `/api/articles/${selectedArticle.id_article || selectedArticle.id}`
            };
            await api.post('/api/article_codes', payload);
            setShowAddVersionModal(false);
            setNewVersion({ code_article: '', marque: '', quantite: 0, cout_unitaire: 0 });
            fetchData();
        } catch (err) { 
            alert("Error adding version: " + (err.response?.data?.message || err.message)); 
        }
    };

    const handleEditVersion = (version, article) => {
        setSelectedArticle(article);
        setSelectedVersion(version);
        setModalMode('edit');
        setNewVersion({
            code_article: version.code_article || version.codeArticle,
            marque: version.marque,
            quantite: version.quantite || 0,
            cout_unitaire: version.cout_unitaire || 0
        });
        setShowAddVersionModal(true);
    };

    const handleUpdateVersion = async () => {
        try {
            const versionId = selectedVersion.id_code || selectedVersion.id;
            const payload = {
                ...newVersion,
                article: `/api/articles/${selectedArticle.id_article || selectedArticle.id}`
            };

            await api.patch(`/api/article_codes/${versionId}`, payload, {
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    'Accept': 'application/ld+json'
                }
            });

            setShowAddVersionModal(false);
            setNewVersion({ code_article: '', marque: '', quantite: 0, cout_unitaire: 0 });
            setSelectedVersion(null);
            fetchData();
        } catch (err) { 
            alert("Error updating version: " + (err.response?.data?.message || err.message)); 
        }
    };

    const handleDeleteItem = (type, id, name) => {
        setDeleteItem({ type, id, name });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteItem.type === 'article') {
                await api.delete(`/api/articles/${deleteItem.id}`);
            } else if (deleteItem.type === 'version') {
                await api.delete(`/api/article_codes/${deleteItem.id}`);
            }
            setShowDeleteModal(false);
            setDeleteItem({ type: '', id: '', name: '' });
            fetchData();
        } catch (err) {
            alert("Error deleting item: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteArticle = async (id, name) => {
        handleDeleteItem('article', id, name);
    };

    const handleDeleteVersion = async (id, name) => {
        handleDeleteItem('version', id, name);
    };

    const toggleArticle = (id) => {
        setExpandedArticles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getArticleVersions = (articleId) => {
        return articleCodes.filter(c => {
            const artId = c.article?.id_article || c.article?.id || (typeof c.article === 'string' && c.article.split('/').pop());
            return artId == articleId;
        });
    };

    // Search in article name, category name, and unit name
    const filteredArticles = articles.filter(article => {
        if (!searchTerm.trim()) return true;
        
        const searchLower = searchTerm.toLowerCase();
        
        // Search in article name
        const articleName = (article.nom_article || article.nomArticle || '').toLowerCase();
        if (articleName.includes(searchLower)) return true;
        
        // Search in category name
        const categoryName = (article.category?.name_category || 
                            article.category?.nameCategory || '').toLowerCase();
        if (categoryName.includes(searchLower)) return true;
        
        // Search in unit name
        const unitName = (article.unit?.name_unit || 
                         article.unit?.nameUnit || '').toLowerCase();
        if (unitName.includes(searchLower)) return true;
        
        // Search in article ID (optional)
        const articleId = (article.id_article || article.id || '').toString();
        if (articleId.includes(searchLower)) return true;
        
        return false;
    });

    if (loading.initial) return <div className="loading-state"><Loader2 className="spinner" /> Loading...</div>;

    return (
        <div className="products-list-container">
            <div className="header-section">
                <h1>Products List</h1>
                <button className="btn-add-main" onClick={() => {
                    setModalMode('add');
                    setNewArticle({ nom_article: '', category: '', unit: '' });
                    setShowAddArticleModal(true);
                }}>
                    <Plus size={18} /> Add New Article
                </button>
            </div>

            <div className="search-container">
                <div className="search-wrapper">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search articles by name or category..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="main-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Article Name</th>
                            <th>Category</th>
                            <th>Unit</th>
                            <th>Versions</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map(article => {
                            const id = article.id_article || article.id;
                            const name = article.nom_article || article.nomArticle;
                            const versions = getArticleVersions(id);
                            const isExpanded = expandedArticles[id];

                            return (
                                <React.Fragment key={id}>
                                    <tr className={`article-row ${isExpanded ? 'active' : ''}`}>
                                        <td>
                                            <button className="btn-toggle" onClick={() => toggleArticle(id)}>
                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </button>
                                        </td>
                                        <td className="font-bold">{name}</td>
                                        <td>{article.category?.name_category || article.category?.nameCategory || 'N/A'}</td>
                                        <td>{article.unit?.name_unit || article.unit?.nameUnit || 'N/A'}</td>
                                        <td>
                                            <span className="version-badge" onClick={() => toggleArticle(id)}>
                                                {versions.length} versions
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button className="btn-icon edit" onClick={() => handleEditArticle(article)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn-icon delete" onClick={() => handleDeleteArticle(id, name)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="expanded-row">
                                            <td colSpan="6">
                                                <div className="expanded-container">
                                                    <div className="expanded-header">
                                                        <span>Article Versions</span>
                                                        <button className="btn-add-version" onClick={() => { 
                                                            setSelectedArticle(article); 
                                                            setModalMode('add');
                                                            setNewVersion({ code_article: '', marque: '', quantite: 0, cout_unitaire: 0 });
                                                            setShowAddVersionModal(true); 
                                                        }}>
                                                            <Plus size={14} /> Add Version
                                                        </button>
                                                    </div>
                                                    <table className="sub-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Brand</th>
                                                                <th>Reference</th>
                                                                <th>Sale Price</th>
                                                                <th>Stock</th>
                                                                <th className="text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {versions.length > 0 ? versions.map(v => {
                                                                const versionId = v.id_code || v.id;
                                                                const versionCode = v.code_article || v.codeArticle;
                                                                return (
                                                                    <tr key={versionId}>
                                                                        <td>{v.marque}</td>
                                                                        <td><span className="code-tag">{versionCode}</span></td>
                                                                        <td>{(v.cout_unitaire || 0).toFixed(2)}DT</td>
                                                                        <td>
                                                                            <span className={`stock-label ${v.quantite > 10 ? 'in-stock' : 'low-stock'}`}>
                                                                                {v.quantite} units
                                                                            </span>
                                                                        </td>
                                                                        <td className="text-right">
                                                                            <button className="btn-icon-small edit" onClick={() => handleEditVersion(v, article)}>
                                                                                <Edit2 size={14} />
                                                                            </button>
                                                                            <button className="btn-icon-small delete" onClick={() => handleDeleteVersion(versionId, versionCode)}>
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }) : (
                                                                <tr><td colSpan="5" className="empty-msg">No versions added yet.</td></tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showAddArticleModal && (
                <AddArticleModal 
                    newArticle={newArticle} 
                    setNewArticle={setNewArticle} 
                    categories={categories} 
                    units={units} 
                    onClose={() => {
                        setShowAddArticleModal(false);
                        setNewArticle({ nom_article: '', category: '', unit: '' });
                    }} 
                    onSubmit={handleAddArticle}
                    isEditing={modalMode === 'edit'}
                    onUpdate={handleUpdateArticle}
                    onAddCategory={() => setShowAddCategoryModal(true)}
                    onAddUnit={() => setShowAddUnitModal(true)}
                />
            )}

            {showAddVersionModal && (
                <AddVersionModal 
                    newVersion={newVersion} 
                    setNewVersion={setNewVersion} 
                    article={selectedArticle} 
                    onClose={() => {
                        setShowAddVersionModal(false);
                        setNewVersion({ code_article: '', marque: '', quantite: 0, cout_unitaire: 0 });
                        setSelectedVersion(null);
                    }} 
                    onSubmit={handleAddVersion}
                    isEditing={modalMode === 'edit'}
                    onUpdate={handleUpdateVersion}
                />
            )}

            {showAddCategoryModal && (
                <AddCategoryModal 
                    onClose={() => setShowAddCategoryModal(false)}
                    onSubmit={handleAddCategory}
                />
            )}

            {showAddUnitModal && (
                <AddUnitModal 
                    onClose={() => setShowAddUnitModal(false)}
                    onSubmit={handleAddUnit}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmationModal 
                    itemType={deleteItem.type}
                    itemName={deleteItem.name}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setDeleteItem({ type: '', id: '', name: '' });
                    }}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default ProductsList;