import React, { useState, useEffect } from 'react';
import '../style/PointOfSale.css';
import { Search, X, PlusCircle, User, Trash2, Check, ShoppingCart } from 'lucide-react';

export default function PointOfSale() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [basket, setBasket] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [searchClient, setSearchClient] = useState('');
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showCreateClientDialog, setShowCreateClientDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClient, setNewClient] = useState({
    nom_client: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get the actual logged-in user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          console.log('Current user:', user);
        } else {
          setError('No user logged in');
          return;
        }
        await Promise.all([
          fetchArticles(),
          fetchClients()
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const fetchArticles = async () => {
    try {
      // fetch article codes so we have direct access to code, brand, price and stock
      const response = await fetch('http://localhost:8000/api/article_codes?pagination=false', {
        headers: { 'Accept': 'application/ld+json' }
      });
      if (!response.ok) {
        console.warn('fetchArticles: non-OK response', response.status);
        setArticles([]);
        return;
      }
      const data = await response.json();
      console.debug('Fetched data:', data);
      
      // Handle both Hydra format (with 'member' or 'hydra:member') and regular arrays
      let codes = data['hydra:member'] || data['member'] || (Array.isArray(data) ? data : []);
      console.debug('Extracted codes:', codes);
      
      if (!Array.isArray(codes)) {
        console.warn('Codes is not an array:', codes);
        codes = [];
      }

      // Resolve linked article IRIs (API Platform may return an IRI string)
      const resolved = await Promise.all(codes.map(async (c) => {
        try {
          if (c && typeof c.article === 'string') {
            // article IRI might be like '/api/articles/1' or full URL
            const iri = c.article;
            const articleUrl = iri.startsWith('http') ? iri : `http://localhost:8000${iri}`;
            const r = await fetch(articleUrl);
            if (r.ok) {
              const art = await r.json();
              c.article = art;
            }
          }
        } catch (e) {
          // ignore resolution errors and keep original value
          console.warn('Failed to resolve article for code', c, e);
        }
        return c;
      }));

      setArticles(resolved);
      if (!resolved || (Array.isArray(resolved) && resolved.length === 0)) {
        setError('No articles found in database. Please add articles first.');
      } else {
        console.info(`Successfully loaded ${resolved.length} articles`);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/clients?pagination=false', {
        headers: { 'Accept': 'application/ld+json' }
      });
      if (!response.ok) {
        console.warn('fetchClients: non-OK response', response.status);
        setClients([]);
        return;
      }
      const data = await response.json();
      console.debug('Fetched clients data:', data);
      
      // Handle both Hydra format (with 'member' or 'hydra:member') and regular arrays
      let all = data['hydra:member'] || data['member'] || (Array.isArray(data) ? data : []);
      console.debug('Extracted clients:', all);
      
      if (!Array.isArray(all)) {
        console.warn('Clients is not an array:', all);
        all = [];
      }
      
      setClients(all);
      if (!all || (Array.isArray(all) && all.length === 0)) {
        setError(prev => prev || 'No clients found in database.');
      } else {
        console.info(`Successfully loaded ${all.length} clients`);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  // articles now contains articleCodes (each item is an ArticleCode)
  const filteredArticles = (Array.isArray(articles) ? articles : []).filter((code) => {
    const term = (searchTerm || '').toLowerCase();
    const name = (code.article?.nom_article || '').toLowerCase();
    const brand = (code.marque || '').toLowerCase();
    const ref = (code.code_article || '').toLowerCase();
    return name.includes(term) || brand.includes(term) || ref.includes(term);
  });

  const filteredClients = (Array.isArray(clients) ? clients : []).filter((client) => {
    const term = (searchClient || '').toLowerCase();
    return (
      (client.nom_client || '').toLowerCase().includes(term) ||
      (client.email || '').toLowerCase().includes(term)
    );
  });

  const addToBasket = (articleCode) => {
    const existingItem = basket.find(item => item.id_code === articleCode.id_code);
    
    if (existingItem) {
      if (existingItem.quantite < (existingItem.stockAvailable || 0)) {
        setBasket(basket.map(item =>
          item.id_code === articleCode.id_code
            ? { ...item, quantite: item.quantite + 1 }
            : item
        ));
      } else {
        alert('Insufficient stock');
      }
    } else {
      const available = articleCode.quantite || 0;
      if (available > 0) {
        setBasket([...basket, {
          ...articleCode,
          quantite: 1,
          margin: 0,
          stockAvailable: available
        }]);
      } else {
        alert('Out of stock');
      }
    }
  };

  const removeFromBasket = (id_code) => {
    setBasket(basket.filter(item => item.id_code !== id_code));
  };

  const updateBasketItem = (id_code, field, value) => {
    setBasket(basket.map(item => {
      if (item.id_code !== id_code) return item;
      if (field === 'quantite') {
        const v = Number.isFinite(value) ? value : 1;
        if (v < 1) return { ...item, quantite: 1 };
        if (v > (item.stockAvailable || 0)) {
          alert('Insufficient stock');
          return item;
        }
        return { ...item, quantite: v };
      }
      if (field === 'margin') {
        const v = isNaN(value) ? 0 : Math.max(0, value);
        return { ...item, margin: v };
      }
      return { ...item, [field]: value };
    }));
  };

  const calculateFinalPrice = (item) => {
    const basePrice = item.cout_unitaire || 0;
    const marginAmount = (basePrice * item.margin) / 100;
    return basePrice + marginAmount;
  };

  const calculateBasketTotal = () => {
    return basket.reduce((total, item) => {
      const finalPrice = calculateFinalPrice(item);
      return total + (finalPrice * item.quantite);
    }, 0);
  };

  const calculateSubtotal = (item) => {
    return calculateFinalPrice(item) * item.quantite;
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setShowClientDialog(false);
    setSearchClient('');
  };

  const handleCreateClient = async () => {
    if (!newClient.nom_client || !newClient.email) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });

      if (response.ok) {
        const createdClient = await response.json();
        setClients([...clients, createdClient]);
        setSelectedClient(createdClient);
        setShowCreateClientDialog(false);
        setNewClient({
          nom_client: '',
          telephone: '',
          email: '',
          adresse: ''
        });
        alert('Client created successfully');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error creating client');
    }
  };

  const handleSubmitSale = async () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    if (basket.length === 0) {
      alert('Basket is empty');
      return;
    }

    if (!currentUser) {
      alert('User not authenticated');
      return;
    }

    try {
      // Step 1: Create the Vente (sale header) without venteLignes
      const vente = {
        date_vente: new Date().toISOString().split('T')[0],
        total_vente: calculateBasketTotal(),
        client: `/api/clients/${selectedClient.id_client}`,
        user: `/api/users/${currentUser.id_user || currentUser.id}`
      };

      console.log('Creating vente (sale header):', vente);

      const venteResponse = await fetch('http://localhost:8000/api/ventes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json'
        },
        body: JSON.stringify(vente)
      });

      console.log('Vente response status:', venteResponse.status);
      const venteData = await venteResponse.json();
      console.log('Vente response:', venteData);

      if (!venteResponse.ok) {
        console.error('Vente creation error:', venteData);
        alert('Error creating sale: ' + (venteData.detail || venteData.message || 'Unknown error'));
        return;
      }

      const venteId = venteData.id_vente || venteData['@id']?.split('/').pop();
      const venteIri = `/api/ventes/${venteId}`;
      console.log('Created vente with IRI:', venteIri);

      // Step 2: Create each VenteLigne (sale line item) separately
      let allLinesSucceeded = true;
      for (const item of basket) {
        const venteLigne = {
          quantite: item.quantite,
          prix_vente_unitaire: calculateFinalPrice(item),
          marge: item.margin,
          vente: venteIri,
          articleCode: `/api/article_codes/${item.id_code}`
        };

        console.log('Creating vente ligne:', venteLigne);

        const ligneResponse = await fetch('http://localhost:8000/api/vente_lignes', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json'
          },
          body: JSON.stringify(venteLigne)
        });

        const ligneData = await ligneResponse.json();
        console.log('Vente ligne response:', ligneResponse.status, ligneData);

        if (!ligneResponse.ok) {
          console.error('Vente ligne creation error:', ligneData);
          allLinesSucceeded = false;
        }
      }

      if (allLinesSucceeded) {
        // Update article stock by fetching updated data
        await fetchArticles();
        
        alert('Sale submitted successfully! Sale ID: ' + venteId);
        setBasket([]);
        setSelectedClient(null);
        setSearchClient('');
      } else {
        alert('Sale created but some items failed. Please verify the sale manually.');
      }
    } catch (error) {
      console.error('Error submitting sale:', error);
      alert('Error submitting sale: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="pos-page">
        <h1 className="pos-title">Point of Sale</h1>
        <div className="loading-message">
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pos-page">
        <h1 className="pos-title">Point of Sale (POS)</h1>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-page">
      <h1 className="pos-title">Point of Sale (POS)</h1>
      
      <div className="pos-container">
        {/* Left Side - Available Articles */}
        <div className="pos-left">
          <div className="articles-section">
            <h2>Available Articles</h2>
            <div className="search-box">
              <div className="search-with-icon">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by name, brand, or reference..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="icon-clear" onClick={() => setSearchTerm('')} aria-label="Clear search"><X size={14} /></button>
              </div>
            </div>

            <div className="articles-list">
              {filteredArticles.map((code) => (
                <div key={code.id_code} className="article-item">
                  <div className="article-content">
                    <h3>{code.article?.nom_article || 'Unknown'}</h3>
                    <p className="brand-reference">{code.marque} - {code.code_article}</p>
                    <p className="price">{Number(code.cout_unitaire || 0).toFixed(2)} DT</p>
                  </div>
                  <div className="article-actions">
                    <span className={`stock-badge ${code.quantite > 0 ? 'in-stock' : 'out-stock'}`}>{code.quantite} in stock</span>
                    <button className="add-btn" onClick={() => addToBasket(code)} disabled={code.quantite === 0}><PlusCircle size={16} /> Add</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Sales Basket */}
        <div className="pos-right">
          <div className="basket-section">
            <h2 className="basket-title"><ShoppingCart size={24} style={{display: 'inline', marginRight: '8px'}} /> Sales Basket</h2>

            {/* Client Selection */}
            <div className="client-selection-area">
              <label>Client (Customer) *</label>
              {!selectedClient ? (
                <button
                  className="select-client-btn"
                  onClick={() => setShowClientDialog(true)}
                >
                  <User size={16} /> Select Client...
                </button>
              ) : (
                <div className="selected-client-box">
                  <div className="client-info">
                    <strong>{selectedClient.nom_client}</strong>
                    <p>{selectedClient.email}</p>
                  </div>
                  <button
                    className="change-client-btn"
                    onClick={() => setSelectedClient(null)}
                    aria-label="Change client"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Basket Items */}
            <div className="basket-items-area">
              {basket.length === 0 ? (
                <div className="empty-basket">
                  <p>No items in basket</p>
                  <p className="empty-hint">Click on products to add them</p>
                </div>
              ) : (
                <div className="items-list">
                  {basket.map((item) => (
                    <div key={item.id_code} className="basket-item-card">
                      <div className="item-header">
                        <h4>{item.marque}</h4>
                        <button
                          className="delete-btn"
                          onClick={() => removeFromBasket(item.id_code)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="item-code">{item.code_article}</p>

                      <div className="item-controls-row">
                        <div className="control">
                          <label>Quantity</label>
                          <input
                            type="number"
                            min="1"
                            max={item.stockAvailable || 0}
                            value={item.quantite}
                            onChange={(e) => updateBasketItem(item.id_code, 'quantite', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="control">
                          <label>Margin %</label>
                          <input
                            type="number"
                            min="0"
                            value={item.margin}
                            onChange={(e) => updateBasketItem(item.id_code, 'margin', parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="control">
                          <label>Final Price</label>
                          <input
                            type="text"
                            value={`${calculateFinalPrice(item).toFixed(2)} DT`}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="item-subtotal">
                        Subtotal: <strong>{calculateSubtotal(item).toFixed(2)} DT</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="basket-footer">
              <div className="total-row">
                <span>Total Amount</span>
                <strong className="total-amount">{calculateBasketTotal().toFixed(2)} DT</strong>
              </div>
              <button
                className="validate-btn"
                onClick={handleSubmitSale}
                disabled={basket.length === 0 || !selectedClient}
              >
                Validate Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Select Client Dialog */}
      {showClientDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <div>
                <h2>Select Client</h2>
                <p className="dialog-subtitle">Choose a client from the list or create a new one.</p>
              </div>
              <button className="dialog-close" onClick={() => setShowClientDialog(false)} aria-label="Close dialog"><X size={20} /></button>
            </div>

            <div className="dialog-search">
              <input
                type="text"
                placeholder="Search by Name or Email..."
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
              />
            </div>

            <table className="clients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr key={client.id_client}>
                    <td>#{index + 1}</td>
                    <td>{client.nom_client}</td>
                    <td>{client.email}</td>
                    <td>
                      <button
                        className="select-btn"
                        onClick={() => handleSelectClient(client)}
                      >
                        <Check size={14} /> Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="create-client-btn"
              onClick={() => {
                setShowClientDialog(false);
                setShowCreateClientDialog(true);
              }}
            >
              <PlusCircle size={14} /> Create New Client
            </button>
          </div>
        </div>
      )}

      {/* Create Client Dialog */}
      {showCreateClientDialog && (
        <div className="dialog-overlay">
          <div className="create-dialog-box">
            <div className="dialog-header">
              <h2>Create New Client</h2>
              <button
                className="dialog-close"
                onClick={() => setShowCreateClientDialog(false)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-area">
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  value={newClient.nom_client}
                  onChange={(e) => setNewClient({ ...newClient, nom_client: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={newClient.telephone}
                  onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={newClient.adresse}
                  onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="form-buttons">
              <button
                className="btn-cancel"
                onClick={() => setShowCreateClientDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={handleCreateClient}
              >
                Create Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}