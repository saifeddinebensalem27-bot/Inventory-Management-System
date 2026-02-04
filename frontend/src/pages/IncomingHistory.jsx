import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import '../style/IncomingHistory.css';

const BASE_URL = 'http://localhost:8000';

export default function IncomingHistory() {
  const [entrees, setEntrees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch entrees on mount
  useEffect(() => {
    fetchEntreesAndSuppliers();
  }, []);

  const fetchEntreesAndSuppliers = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching from:', `${BASE_URL}/api/entrees`, `${BASE_URL}/api/fournisseurs`, `${BASE_URL}/api/entree_lignes`, `${BASE_URL}/api/article_codes`);
      
      // Fetch entrees, suppliers, line items, article codes, and users in parallel
      const [entreesResponse, suppliersResponse, lignesesResponse, articleCodesResponse, usersResponse] = await Promise.all([
        fetch(`${BASE_URL}/api/entrees`),
        fetch(`${BASE_URL}/api/fournisseurs`),
        fetch(`${BASE_URL}/api/entree_lignes`),
        fetch(`${BASE_URL}/api/article_codes`),
        fetch(`${BASE_URL}/api/users`)
      ]);
      
      // Check if responses are ok
      if (!entreesResponse.ok || !suppliersResponse.ok || !lignesesResponse.ok || !articleCodesResponse.ok || !usersResponse.ok) {
        throw new Error(`Failed to fetch: Entrees ${entreesResponse.status}, Suppliers ${suppliersResponse.status}, Lines ${lignesesResponse.status}, ArticleCodes ${articleCodesResponse.status}, Users ${usersResponse.status}`);
      }
      
      const entreesData = await entreesResponse.json();
      const suppliersData = await suppliersResponse.json();
      const lignesData = await lignesesResponse.json();
      const articleCodesData = await articleCodesResponse.json();
      const usersData = await usersResponse.json();
      
      console.log('Entrees response:', entreesData);
      console.log('Suppliers response:', suppliersData);
      console.log('Line items response:', lignesData);
      console.log('Article codes response:', articleCodesData);
      
      // Extract data from response
      const entreeList = Array.isArray(entreesData) 
        ? entreesData 
        : entreesData['hydra:member'] || entreesData.member || [];
      
      const supplierList = Array.isArray(suppliersData)
        ? suppliersData
        : suppliersData['hydra:member'] || suppliersData.member || [];
      
      const lignesList = Array.isArray(lignesData)
        ? lignesData
        : lignesData['hydra:member'] || lignesData.member || [];
      
      const articleCodesList = Array.isArray(articleCodesData)
        ? articleCodesData
        : articleCodesData['hydra:member'] || articleCodesData.member || [];
      
      const usersList = Array.isArray(usersData)
        ? usersData
        : usersData['hydra:member'] || usersData.member || [];
      
      // Create maps for quick lookup
      const articleCodesMap = {};
      articleCodesList.forEach(code => {
        articleCodesMap[code.id_code] = code;
      });
      console.log('Article codes map:', articleCodesMap);
      
      const usersMap = {};
      usersList.forEach(user => {
        usersMap[user.id_user || user.id] = user;
      });
      console.log('Users map:', usersMap);
      
      // Group line items by entree ID and merge with article codes
      const lignesByEntree = {};
      lignesList.forEach(ligne => {
        // Extract entree ID from the URI reference or direct ID
        let entreeId = null;
        if (typeof ligne.entree === 'string') {
          // URI format: "/api/entrees/12"
          entreeId = ligne.entree.split('/').pop();
        } else if (ligne.entree?.id_entre) {
          // Direct object with id_entre
          entreeId = ligne.entree.id_entre;
        }
        
        // Extract article code ID
        let articleCodeId = null;
        if (typeof ligne.articleCode === 'string') {
          // URI format: "/api/article_codes/1"
          articleCodeId = ligne.articleCode.split('/').pop();
        } else if (ligne.articleCode?.id_code) {
          articleCodeId = ligne.articleCode.id_code;
        }
        
        // Merge with full article code data
        const fullLigne = {
          ...ligne,
          articleCode: articleCodesMap[articleCodeId] || ligne.articleCode
        };
        
        if (entreeId) {
          if (!lignesByEntree[entreeId]) {
            lignesByEntree[entreeId] = [];
          }
          lignesByEntree[entreeId].push(fullLigne);
          console.log(`Added ligne ${ligne.id_entre_ligne} to entree ${entreeId}`);
        }
      });
      
      console.log('Grouped lines by entree:', lignesByEntree);
      
      // Add line items and user data to each entree
      const entreesWithLines = entreeList.map(entree => {
        const lines = lignesByEntree[entree.id_entre] || [];
        console.log(`Entree ${entree.id_entre} has ${lines.length} lines`);
        
        // Extract user ID
        let userId = entree.id_user;
        if (!userId && typeof entree.user === 'string') {
          userId = entree.user.split('/').pop();
        }
        
        const user = usersMap[userId] || entree.user;
        
        return {
          ...entree,
          entreeLignes: lines,
          user: user
        };
      });
      
      console.log('Processed Entrees:', entreesWithLines);
      console.log('Processed Suppliers:', supplierList);
      console.log('First entree details:', entreesWithLines[0]);
      console.log('First entree entreeLignes:', entreesWithLines[0]?.entreeLignes);
      
      setEntrees(Array.isArray(entreesWithLines) ? entreesWithLines : []);
      setSuppliers(Array.isArray(supplierList) ? supplierList : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setEntrees([]);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Filter entrees
  const filteredEntrees = entrees.filter((entree) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      entree.num_facture?.toString().includes(searchLower) ||
      entree.fournisseur?.nom_fr?.toLowerCase().includes(searchLower);

    const matchesSupplier =
      selectedSupplier === 'all' ||
      String(entree.fournisseur?.id_fr) === selectedSupplier;

    const entreeDate = new Date(entree.date_entre);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDateFrom = !fromDate || entreeDate >= fromDate;
    const matchesDateTo = !toDate || entreeDate <= toDate;

    return matchesSearch && matchesSupplier && matchesDateFrom && matchesDateTo;
  });

  // Total cost is now retrieved from entree.achat_total database column

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(value || 0);
  };

  return (
    <div className="incoming-history-container">
      <h1>Incoming Inventory History</h1>

      {/* Debug Info */}
      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
        Loaded: {entrees.length} entrees, {suppliers.length} suppliers
      </div>

      {/* Advanced Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <Filter size={20} />
          <span>Advanced Filters</span>
        </div>

        <div className="filters-grid">
          {/* Search Input */}
          <div className="filter-group">
            <label>Search Invoice/Supplier</label>
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by invoice number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Supplier Filter */}
          <div className="filter-group">
            <label>Filter by Supplier</label>
            <div className="select-wrapper">
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="all">All Suppliers</option>
                {suppliers && suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <option key={supplier.id_fr} value={String(supplier.id_fr)}>
                      {supplier.nom_fr}
                    </option>
                  ))
                ) : (
                  <option disabled>No suppliers available</option>
                )}
              </select>
            </div>
          </div>

          {/* Date From */}
          <div className="filter-group">
            <label>Date From</label>
            <div className="date-input-wrapper">
              <Calendar size={18} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
          </div>

          {/* Date To */}
          <div className="filter-group">
            <label>Date To</label>
            <div className="date-input-wrapper">
              <Calendar size={18} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading entrees data...</div>
        ) : filteredEntrees.length === 0 ? (
          <div className="no-data">
            {entrees.length === 0 
              ? 'No incoming records found. Please make sure data exists in the database.' 
              : 'No records match your filters'}
          </div>
        ) : (
          <table className="entrees-table">
            <thead>
              <tr>
                <th></th>
                <th>Invoice Number</th>
                <th>Entry Date</th>
                <th>Storekeeper Name</th>
                <th>Supplier</th>
                <th>Global Fees</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntrees.map((entree) => (
                <React.Fragment key={entree.id_entre}>
                  {/* Main Row */}
                  <tr className="entree-row">
                    <td className="expand-cell">
                      <button
                        className="expand-btn"
                        onClick={() => toggleRowExpand(entree.id_entre)}
                      >
                        {expandedRows.has(entree.id_entre) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </td>
                    <td className="invoice-number">
                      <span className="invoice-link">INV-{entree.num_facture}</span>
                    </td>
                    <td>{formatDate(entree.date_entre)}</td>
                    <td>
                      <span className="storekeeper-badge">
                        {entree.user?.nom_user || entree.user?.email || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="supplier-badge">
                        {entree.fournisseur?.nom_fr || 'N/A'}
                      </span>
                    </td>
                    <td>{formatCurrency(entree.frais_global)}</td>
                    <td className="total-cost">
                      {formatCurrency(entree.achat_total || 0)}
                    </td>
                  </tr>

                  {/* Expanded Row - Details */}
                  {expandedRows.has(entree.id_entre) && (
                    <tr className="details-row">
                      <td colSpan="7">
                        <div className="details-container">
                          <h3>Purchase Line Items</h3>
                          {entree.entreeLignes && entree.entreeLignes.length > 0 ? (
                            <table className="details-table">
                              <thead>
                                <tr>
                                  <th>Part Reference</th>
                                  <th>Quantity</th>
                                  <th>Purchase Price</th>
                                  <th>Subtotal</th>
                                  <th>Calculated Real Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entree.entreeLignes.map((ligne) => (
                                  <tr key={ligne.id_entre_ligne}>
                                    <td>
                                      <span>{ligne.articleCode?.code_article || 'N/A'}</span>
                                    </td>
                                    <td>{ligne.quantite} units</td>
                                    <td>{formatCurrency(ligne.prix_achat_unitaire)}</td>
                                    <td>
                                      {formatCurrency(
                                        ligne.quantite * ligne.prix_achat_unitaire
                                      )}
                                    </td>
                                    <td className="real-cost">
                                      {formatCurrency(ligne.cout_unitaire)} / unit
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="no-items">No line items</p>
                          )}
                          <div className="subtotal-row">
                            <span>Subtotal + Global Fees ({formatCurrency(entree.frais_global)}):</span>
                            <span className="subtotal-amount">
                              {formatCurrency(entree.achat_total || 0)}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
