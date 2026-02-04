import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import '../style/SalesHistory.css';

const BASE_URL = 'http://localhost:8000';

export default function SalesHistory() {
  const [ventes, setVentes] = useState([]);
  const [clients, setClients] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch ventes on mount
  useEffect(() => {
    fetchVentesAndClients();
  }, []);

  const fetchVentesAndClients = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching from:', `${BASE_URL}/api/ventes`, `${BASE_URL}/api/clients`, `${BASE_URL}/api/vente_lignes`, `${BASE_URL}/api/article_codes`, `${BASE_URL}/api/users`);
      
      // Fetch ventes, line items, article codes, clients, and users in parallel
      const [ventesResponse, lignesResponse, articleCodesResponse, clientsResponse, usersResponse] = await Promise.all([
        fetch(`${BASE_URL}/api/ventes`),
        fetch(`${BASE_URL}/api/vente_lignes`),
        fetch(`${BASE_URL}/api/article_codes`),
        fetch(`${BASE_URL}/api/clients`),
        fetch(`${BASE_URL}/api/users`)
      ]);
      
      // Check if responses are ok
      if (!ventesResponse.ok || !lignesResponse.ok || !articleCodesResponse.ok || !clientsResponse.ok || !usersResponse.ok) {
        throw new Error(`Failed to fetch: Ventes ${ventesResponse.status}, Lines ${lignesResponse.status}, ArticleCodes ${articleCodesResponse.status}, Clients ${clientsResponse.status}, Users ${usersResponse.status}`);
      }
      
      const ventesData = await ventesResponse.json();
      const lignesData = await lignesResponse.json();
      const articleCodesData = await articleCodesResponse.json();
      const clientsData = await clientsResponse.json();
      const usersData = await usersResponse.json();
      
      console.log('Ventes response:', ventesData);
      console.log('Line items response:', lignesData);
      console.log('Article codes response:', articleCodesData);
      
      // Extract data from response
      const venteList = Array.isArray(ventesData) 
        ? ventesData 
        : ventesData['hydra:member'] || ventesData.member || [];
      
      const lignesList = Array.isArray(lignesData)
        ? lignesData
        : lignesData['hydra:member'] || lignesData.member || [];
      
      const articleCodesList = Array.isArray(articleCodesData)
        ? articleCodesData
        : articleCodesData['hydra:member'] || articleCodesData.member || [];
      
      const clientList = Array.isArray(clientsData)
        ? clientsData
        : clientsData['hydra:member'] || clientsData.member || [];
      
      const usersList = Array.isArray(usersData)
        ? usersData
        : usersData['hydra:member'] || usersData.member || [];
      
      // Create maps for quick lookup
      const articleCodesMap = {};
      articleCodesList.forEach(code => {
        articleCodesMap[code.id_code] = code;
      });
      
      const usersMap = {};
      usersList.forEach(user => {
        usersMap[user.id_user || user.id] = user;
        console.log(`User ${user.id_user || user.id}:`, user);
      });
      
      const clientsMap = {};
      clientList.forEach(client => {
        clientsMap[client.id_client] = client;
      });
      
      console.log('Users map:', usersMap);
      console.log('Clients map:', clientsMap);
      
      // Group line items by vente ID and merge with article codes
      const lignesByVente = {};
      lignesList.forEach(ligne => {
        // Extract vente ID from the URI reference or direct ID
        let venteId = null;
        if (typeof ligne.vente === 'string') {
          // URI format: "/api/ventes/12"
          venteId = ligne.vente.split('/').pop();
        } else if (ligne.vente?.id_vente) {
          // Direct object with id_vente
          venteId = ligne.vente.id_vente;
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
        
        if (venteId) {
          if (!lignesByVente[venteId]) {
            lignesByVente[venteId] = [];
          }
          lignesByVente[venteId].push(fullLigne);
          console.log(`Added ligne ${ligne.id_vente_ligne} to vente ${venteId}`);
        }
      });
      
      console.log('Grouped lines by vente:', lignesByVente);
      
      // Add line items to each vente
      const ventesWithLines = venteList.map(vente => {
        const lines = lignesByVente[vente.id_vente] || [];
        console.log(`Vente ${vente.id_vente} has ${lines.length} lines`);
        
        // Extract user ID (handle both direct ID and URI format)
        let userId = vente.id_user;
        if (!userId && typeof vente.user === 'string') {
          // URI format: "/api/users/1"
          userId = vente.user.split('/').pop();
        }
        
        // Extract client ID (handle both direct ID and URI format)
        let clientId = vente.id_client;
        if (!clientId && typeof vente.client === 'string') {
          // URI format: "/api/clients/1"
          clientId = vente.client.split('/').pop();
        }
        
        // Merge user and client data
        const user = usersMap[userId] || vente.user;
        const client = clientsMap[clientId] || vente.client;
        
        console.log(`Vente ${vente.id_vente}: userId=${userId}, clientId=${clientId}, user=${JSON.stringify(user)}, client=${JSON.stringify(client)}`);
        
        return {
          ...vente,
          user: user,
          client: client,
          venteLignes: lines
        };
      });
      
      console.log('Processed Ventes:', ventesWithLines);
      console.log('First vente details:', ventesWithLines[0]);
      console.log('First vente venteLignes:', ventesWithLines[0]?.venteLignes);
      
      setVentes(Array.isArray(ventesWithLines) ? ventesWithLines : []);
      setClients(Array.isArray(clientList) ? clientList : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setVentes([]);
      setClients([]);
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

  // Filter ventes
  const filteredVentes = ventes.filter((vente) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      vente.id_vente?.toString().includes(searchLower) ||
      vente.client?.nom_client?.toLowerCase().includes(searchLower) ||
      vente.user?.nom_user?.toLowerCase().includes(searchLower);

    const matchesClient =
      selectedClient === 'all' ||
      String(vente.client?.id_client) === selectedClient;

    const venteDate = new Date(vente.date_vente);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDateFrom = !fromDate || venteDate >= fromDate;
    const matchesDateTo = !toDate || venteDate <= toDate;

    return matchesSearch && matchesClient && matchesDateFrom && matchesDateTo;
  });

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

  // Calculate subtotal for line items
  const calculateLineSubtotal = (ligne) => {
    return (ligne.quantite || 0) * (ligne.prix_vente_unitaire || 0);
  };

  return (
    <div className="sales-history-container">
      <h1>Sales History (Historique des Sorties)</h1>

      {/* Debug Info */}
      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
        Loaded: {ventes.length} ventes, {clients.length} clients
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
            <label>Search Sale/Client/Seller</label>
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by sale ID, client or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Client Filter */}
          <div className="filter-group">
            <label>Filter by Client</label>
            <div className="select-wrapper">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="all">All Clients</option>
                {clients && clients.length > 0 ? (
                  clients.map((client) => (
                    <option key={client.id_client} value={String(client.id_client)}>
                      {client.nom_client}
                    </option>
                  ))
                ) : (
                  <option disabled>No clients available</option>
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
          <div className="loading">Loading sales data...</div>
        ) : filteredVentes.length === 0 ? (
          <div className="no-data">
            {ventes.length === 0 
              ? 'No sales records found. Please make sure data exists in the database.' 
              : 'No records match your filters'}
          </div>
        ) : (
          <table className="ventes-table">
            <thead>
              <tr>
                <th></th>
                <th>Sale ID</th>
                <th>Date</th>
                <th>Seller Name (Vendeur)</th>
                <th>Client Name</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredVentes.map((vente) => (
                <React.Fragment key={vente.id_vente}>
                  {/* Main Row */}
                  <tr className="vente-row">
                    <td className="expand-cell">
                      <button
                        className="expand-btn"
                        onClick={() => toggleRowExpand(vente.id_vente)}
                      >
                        {expandedRows.has(vente.id_vente) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </td>
                    <td className="sale-id">
                      <span className="sale-link">SALE-{vente.id_vente.toString().padStart(4, '0')}</span>
                    </td>
                    <td>{formatDate(vente.date_vente)}</td>
                    <td>
                      <span className="seller-badge">
                        {vente.user?.nom_user || vente.user?.email || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="client-badge">
                        {vente.client?.nom_client || 'N/A'}
                      </span>
                    </td>
                    <td className="total-amount">
                      {formatCurrency(vente.total_vente || 0)}
                    </td>
                  </tr>

                  {/* Expanded Row - Details */}
                  {expandedRows.has(vente.id_vente) && (
                    <tr className="details-row">
                      <td colSpan="6">
                        <div className="details-container">
                          <h3>Sale Line Items</h3>
                          {vente.venteLignes && vente.venteLignes.length > 0 ? (
                            <table className="details-table">
                              <thead>
                                <tr>
                                  <th>Product Name (Article Code)</th>
                                  <th>Reference</th>
                                  <th>Quantity Sold</th>
                                  <th>Applied Margin</th>
                                  <th>Final Unit Price</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vente.venteLignes.map((ligne) => (
                                  <tr key={ligne.id_vente_ligne}>
                                    <td>
                                      <span>{ligne.articleCode?.marque || 'N/A'}</span>
                                    </td>
                                    <td>
                                      <span className="reference-badge">{ligne.articleCode?.code_article || 'N/A'}</span>
                                    </td>
                                    <td>{ligne.quantite} units</td>
                                    <td><span className="margin-badge">{ligne.marge ? `${ligne.marge.toFixed(2)}%` : 'N/A'}</span></td>
                                    <td>{formatCurrency(ligne.prix_vente_unitaire)}</td>
                                    <td className="subtotal">
                                      {formatCurrency(calculateLineSubtotal(ligne))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="no-items">No line items</p>
                          )}
                          <div className="subtotal-row">
                            <span>Total Amount:</span>
                            <span className="subtotal-amount">
                              {formatCurrency(vente.total_vente || 0)}
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
