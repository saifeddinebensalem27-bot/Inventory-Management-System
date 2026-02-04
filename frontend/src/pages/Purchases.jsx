import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Search, X, Package, 
  Truck, Calculator, Save, AlertCircle, Loader2 
} from 'lucide-react';
import '../style/Purchases.css';

const BASE_URL = 'http://localhost:8000'; 

const Purchases = () => {
  const [dbSuppliers, setDbSuppliers] = useState([]);
  const [dbArticles, setDbArticles] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [bdlNumber, setBdlNumber] = useState('');
  const [globalFees, setGlobalFees] = useState(0);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);





  useEffect(() => {
    // Get the actual logged-in user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      console.log('Current user:', user);
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        const [resFr, resArt] = await Promise.all([
          fetch(`${BASE_URL}/api/fournisseurs`),
          fetch(`${BASE_URL}/api/articles`)
        ]);
        const dataFr = await resFr.json();
        const dataArt = await resArt.json();

        setDbSuppliers(dataFr.member || []);
        setDbArticles(dataArt.member || []);
      } catch (err) {
        setError("Connection Error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);




  const handleArticleChange = async (tempId, articleId) => {
    if (!articleId) return;
    try {
      const res = await fetch(`${BASE_URL}/api/article_codes?article=${articleId}`);
      const data = await res.json();
      const codes = data.member || [];

      setPurchaseItems(prev => prev.map(item => {
        if (item.tempId === tempId) {
          return { 
            ...item, 
            id_article: articleId, 
            availableCodes: codes,
            id_code: '', 
            reference: '', 
            purchasePrice: 0 
          };
        }
        return item;
      }));
    } catch (err) { console.error(err); }
  };




  const handleBrandSelect = (tempId, codeId) => {
    setPurchaseItems(prev => prev.map(item => {
      if (item.tempId === tempId) {
        const selected = item.availableCodes.find(c => c.id_code === parseInt(codeId));
        return {
          ...item,
          id_code: codeId,
          reference: selected?.code_article || '',
          purchasePrice: selected?.cout_unitaire || 0,
        };
      }
      return item;
    }));
  };



  const handleAddRow = () => {
    setPurchaseItems([...purchaseItems, {
      tempId: Date.now(),
      id_article: '',
      availableCodes: [],
      id_code: '',
      reference: '',
      purchasePrice: 0,
      quantity: 1
    }]);
  };




  const totals = useMemo(() => {
    const subtotal = purchaseItems.reduce((acc, i) => acc + (i.purchasePrice * i.quantity), 0);
    const totalQty = purchaseItems.reduce((acc, i) => acc + i.quantity, 0);
    const fees = parseFloat(globalFees || 0);
    


    const itemsWithRealCost = purchaseItems.map(item => {
      const shareOfFees = totalQty > 0 ? (fees / totalQty) : 0;
      return { ...item, realCost: item.purchasePrice + shareOfFees };
    });

    return { subtotal, totalQty, totalCost: subtotal + fees, itemsWithRealCost };
  }, [purchaseItems, globalFees]);




  const handleSave = async () => {
    if (!selectedSupplier) return alert("Please select a supplier!");
    if (!selectedSupplier.id_fr) {
      console.error("Selected Supplier object:", selectedSupplier);
      return alert("Supplier ID is missing! Please select a valid supplier.");
    }
    if (purchaseItems.length === 0) return alert("Add at least one item!");

    // Validate rows: remove or reject incomplete rows
    const validItems = totals.itemsWithRealCost.filter(item => item.id_code && item.quantity > 0);
    if (validItems.length === 0) return alert('No valid items to save. Check brand and quantity.');

    setLoading(true);

    const dateOnly = (d) => new Date(d).toISOString().split('T')[0];

    const payload = {
      date_entre: dateOnly(new Date()),
      date_livraison: dateOnly(new Date()),
      num_facture: invoiceNumber ? parseInt(invoiceNumber) : null,
      num_bdl: bdlNumber ? parseInt(bdlNumber) : null,
      frais_global: parseFloat(globalFees) || 0,
      achat_total: totals.totalCost,
      fournisseur: `/api/fournisseurs/${selectedSupplier.id_fr}`,
      user: `/api/users/${currentUser.id_user || currentUser.id}`,
      entreeLignes: validItems.map(item => ({
        quantite: parseInt(item.quantity),
        prix_achat_unitaire: parseFloat(item.purchasePrice) || 0,
        cout_unitaire: parseFloat(item.realCost) || 0,
        articleCode: `/api/article_codes/${parseInt(item.id_code)}`
      }))
    };

    console.log("Payload being sent:", payload);

    try {
      const res = await fetch(`${BASE_URL}/api/entrees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/ld+json, application/json'
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch (e) { data = text; }

      if (res.ok) {
        alert("Stock Entry saved successfully! Stock quantities updated.");
        window.location.reload();
      } else {
        console.error("Server Error:", data);
        const msg = (data && data['hydra:description']) || (data && data.detail) || typeof data === 'string' && data || 'Server rejected the request';
        alert(`Error saving: ${msg}`);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Connection error. Is the Symfony server running?");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="purchases-wrapper">
      <div className="page-header">
        <h1>Stock Entry</h1>
        {loading && <Loader2 className="animate-spin" />}
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <Truck size={18} /> 
          Purchase Information
        </div>
        <div className="p-card-body grid-3">
          <div className="form-group">
            <label>Supplier *</label>
            <button 
              className="select-btn-trigger" 
              onClick={() => setShowSupplierModal(true)}
            >
              <Search size={16} /> 
              {selectedSupplier ? selectedSupplier.nom_fr : "Select Supplier..."}
            </button>
          </div>
          
          <div className="form-group">
            <label>Invoice Number</label>
            <input 
              type="number" 
              value={invoiceNumber} 
              onChange={e => setInvoiceNumber(e.target.value)}
              placeholder="e.g., 2026001"
            />
          </div>
          
          <div className="form-group">
            <label>BDL Number</label>
            <input 
              type="number" 
              value={bdlNumber} 
              onChange={e => setBdlNumber(e.target.value)}
              placeholder="e.g., 2026001"
            />
          </div>
        </div>
      </div>

      <div className="p-card mt-20">
        <div className="p-card-header flex-between">
          <span>
            <Package size={18} /> 
            Purchase Items
          </span>
          <button className="add-row-btn" onClick={handleAddRow}>
            <Plus size={16} /> 
            Add Item
          </button>
        </div>
        
        <div className="p-card-body">
          <table className="items-table">
            <thead>
              <tr>
                <th>Article Type</th>
                <th>Brand</th>
                <th>Reference</th>
                <th>Purchase Price (DT)</th>
                <th>Quantity</th>
                <th>Real Cost/Unit (DT)</th>
                <th>Subtotal (DT)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseItems.map(item => (
                <tr key={item.tempId}>
                  <td>
                    <select 
                      value={item.id_article} 
                      onChange={e => handleArticleChange(item.tempId, e.target.value)}
                    >
                      <option value="">-- Select Article --</option>
                      {dbArticles.map(a => (
                        <option key={a.id_article} value={a.id_article}>
                          {a.nom_article}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  <td>
                    <select 
                      disabled={!item.id_article} 
                      value={item.id_code} 
                      onChange={e => handleBrandSelect(item.tempId, e.target.value)}
                    >
                      <option value="">-- Select Brand --</option>
                      {item.availableCodes.map(c => (
                        <option key={c.id_code} value={c.id_code}>
                          {c.marque}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  <td>
                    <span className="reference-display">
                      {item.reference || "Auto-filled from DB"}
                    </span>
                  </td>
                  
                  <td>
                    <input 
                      type="number" 
                      step="0.01"
                      value={item.purchasePrice} 
                      onChange={e => setPurchaseItems(prev => prev.map(p => 
                        p.tempId === item.tempId ? 
                        {...p, purchasePrice: parseFloat(e.target.value) || 0} : p
                      ))} 
                    />
                  </td>
                  
                  <td>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity} 
                      onChange={e => setPurchaseItems(prev => prev.map(p => 
                        p.tempId === item.tempId ? 
                        {...p, quantity: parseInt(e.target.value) || 1} : p
                      ))} 
                    />
                  </td>
                  
                  <td className="real-cost-td">
                    DT{(totals.itemsWithRealCost.find(i => i.tempId === item.tempId)?.realCost || 0).toFixed(2)}
                  </td>
                  
                  <td>
                    DT{(item.purchasePrice * item.quantity).toFixed(2)}
                  </td>
                  
                  <td>
                    <button 
                      onClick={() => setPurchaseItems(purchaseItems.filter(p => p.tempId !== item.tempId))}
                      title="Delete row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {purchaseItems.length === 0 && (
            <div className="empty-state">
              <Package size={40} />
              <p>No items added. Click "Add Row" to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Section with Global Fees */}
      <div className="summary-section mt-20">
        <div className="p-card">
          <div className="p-card-header">
            <Calculator size={18} /> 
            Summary
          </div>
          
          <div className="p-card-body summary-flex">
            <div className="fees-input">
              <label>Global Fees (DT)</label>
              <p className="fees-description">
                Shipping, customs, or other fees distributed across all items
              </p>
              <input 
                type="number" 
                step="0.01"
                value={globalFees} 
                onChange={e => setGlobalFees(e.target.value)} 
                placeholder="0.00" 
              />
            </div>
            
            <div className="totals-box">
              <div className="total-row">
                <span>Total Units:</span>
                <strong>{totals.totalQty}</strong>
              </div>
              
              <div className="total-row">
                <span>Subtotal (Items):</span>
                <strong>{totals.subtotal.toFixed(2)} DT</strong>
              </div>
              
              <div className="total-row">
                <span>Global Fees:</span>
                <strong>{parseFloat(globalFees || 0).toFixed(2)} DT</strong>
              </div>
              
              <div className="grand-total">
                Total Cost: {totals.totalCost.toFixed(2)} DT
              </div>
            </div>
          </div>
          
          <div className="p-card-footer">
            <div className="note">
              <AlertCircle size={16} />
              <span>
                The "Real Cost/Unit" includes the purchase price plus a proportional share of the global fees, 
                giving you the true cost per unit for accurate margin calculations.
              </span>
            </div>
          </div>
        </div>
      </div>

      <button className="main-save-btn" onClick={handleSave}>
        <Save size={20} /> 
        Save Stock Entry
      </button>

      {/* Supplier Modal بدون Contact Person */}
      {showSupplierModal && (
        <div className="modal-overlay">
          <div className="modal-content supplier-modal">
            <div className="modal-head">
              <div className="modal-title">
                <Truck size={20} />
                <div>
                  <h3>Select Supplier</h3>
                  <p className="modal-subtitle">Choose a supplier from the list below</p>
                </div>
              </div>
              <button 
                className="modal-close" 
                onClick={() => setShowSupplierModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by Name or Company..."
                  className="modal-search-input"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="suppliers-table-container">
                <table className="suppliers-table">
                  <thead>
                    <tr>
                      <th>Supplier ID</th>
                      <th>Supplier Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbSuppliers
                      .filter(s => 
                        s.nom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.company_name && s.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map(s => (
                        <tr key={s.id_fr}>
                          <td className="supplier-id">#{s.id_fr || "N/A"}</td>
                          <td className="company-name">
                            {s.nom_fr || s.company_name || "No Name"}
                          </td>
                          <td>
                            <button 
                              className="select-supplier-btn"
                              onClick={() => {
                                setSelectedSupplier(s);
                                setShowSupplierModal(false);
                              }}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {dbSuppliers.length === 0 && (
                <div className="no-suppliers">
                  <Package size={40} />
                  <p>No suppliers found. Add suppliers first.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Purchases;