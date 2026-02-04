import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Search } from 'lucide-react';
import '../style/User.css';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [formData, setFormData] = useState({
    nom_user: '',
    email: '',
    password: '',
    roles: ['ROLE_ADMIN'],
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle API Platform JSON-LD format
      let usersArray = [];
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data.member && Array.isArray(data.member)) {
        usersArray = data.member;
      }
      
      // Ensure each user has an id field
      usersArray = usersArray.map((user, index) => ({
        ...user,
        id: user.id || user.id_user || user['@id']?.split('/').pop() || `user-${index}`,
      }));
      
      console.log('Users Array:', usersArray);
      setUsers(usersArray);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setFormData({
      nom_user: '',
      email: '',
      password: '',
      roles: ['ROLE_USER'],
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      nom_user: user.nom_user,
      email: user.email,
      password: '',
      roles: user.roles,
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'roles') {
      setFormData({ ...formData, [name]: [value] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create user');
      }

      const newUser = result.user || result;
      console.log('New user created:', newUser);
      
      // Ensure users is an array before spreading
      const updatedUsers = Array.isArray(users) ? users : [];
      setUsers([...updatedUsers, newUser]);
      setShowAddModal(false);
      setFormData({
        nom_user: '',
        email: '',
        password: '',
        roles: ['ROLE_ADMIN'],
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error creating user:', err);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        nom_user: formData.nom_user,
        email: formData.email,
        roles: formData.roles,
      };

      // Only include password if it's not empty
      if (formData.password) {
        payload.password = formData.password;
      }

      console.log('Edit payload being sent:', payload);

      const response = await fetch(`http://localhost:8000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const result = await response.json();
      const updatedUser = result.user || result;
      
      // Ensure users is an array before mapping
      const updatedUsers = Array.isArray(users) ? users : [];
      setUsers(
        updatedUsers.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({
        nom_user: '',
        email: '',
        password: '',
        roles: ['ROLE_USER'],
      });
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Ensure users is an array before filtering
      const updatedUsers = Array.isArray(users) ? users : [];
      setUsers(updatedUsers.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
    }
  };

  const getRoleColor = (roles) => {
    if (!Array.isArray(roles)) return 'role-user';
    // Check for specific roles first (they take priority over ROLE_USER)
    if (roles.some(r => r === 'ROLE_ADMIN')) return 'role-admin';
    if (roles.some(r => r === 'ROLE_VENDOR')) return 'role-vendor';
    if (roles.some(r => r === 'ROLE_MAGASINIER')) return 'role-magasinier';
    return 'role-user';
  };

  const getRoleLabel = (roles) => {
    if (!Array.isArray(roles)) return 'User';
    // Check for specific roles first (they take priority over ROLE_USER)
    if (roles.some(r => r === 'ROLE_ADMIN')) return 'Admin';
    if (roles.some(r => r === 'ROLE_VENDOR')) return 'Vendeur';
    if (roles.some(r => r === 'ROLE_MAGASINIER')) return 'Magasinier';
    return 'User';
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          (user.nom_user?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
          (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      )
    : [];

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <div className="user-management-container">
      <div className="user-header">
        <div>
          <h1>User Management</h1>
          <p className="subtitle">Manage system users and role-based access control</p>
        </div>
        <button className="btn-add-user" onClick={handleAddUser}>
          <Plus size={20} />
          Add User
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search users by username, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="role-permissions">
        <h3>Role Permissions</h3>
        <div className="roles-container">
          <div className="role-card role-card-admin">
            <div className="role-card-badge">Admin</div>
            <div className="role-card-content">
              <h4>Administrator</h4>
              <p>Full system access - Can manage all modules</p>
            </div>
          </div>
          <div className="role-card role-card-vendor">
            <div className="role-card-badge">Vendeur</div>
            <div className="role-card-content">
              <h4>Sales Person</h4>
              <p>Access to Sales and Clients modules</p>
            </div>
          </div>
          <div className="role-card role-card-magasinier">
            <div className="role-card-badge">Magasinier</div>
            <div className="role-card-content">
              <h4>Warehouse Manager</h4>
              <p>Access to Inventory, Entries, and Suppliers</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="id-cell">{user.id || 'N/A'}</td>
                    <td className="username-cell">
                      <strong>{user.nom_user}</strong>
                    </td>
                    <td className="email-cell">
                      <small>{user.email}</small>
                    </td>
                    <td>
                      <div className="password-cell">
                        {visiblePasswords[user.id] ? (
                          <span className="password-text">{user.password || '••••••'}</span>
                        ) : (
                          <span className="password-dots">•••••••</span>
                        )}
                        <button
                          className="btn-icon"
                          title={visiblePasswords[user.id] ? 'Hide password' : 'Show password'}
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {visiblePasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleColor(user.roles)}`}>
                        {getRoleLabel(user.roles)}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-action edit"
                          onClick={() => handleEditUser(user)}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteUser(user)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-users">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <span className="modal-subtitle">
                Create a new user account with role-based permissions.
              </span>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="user-form">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="nom_user"
                  placeholder="Enter username"
                  value={formData.nom_user}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="user@autoparts.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="roles"
                  value={formData.roles[0]}
                  onChange={handleFormChange}
                  required
                >
                  <option value="ROLE_ADMIN">Admin - Full system access</option>
                  <option value="ROLE_VENDOR">Vendeur - Sales and Clients</option>
                  <option value="ROLE_MAGASINIER">
                    Magasinier - Inventory and Stock
                  </option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <span className="modal-subtitle">Update the user information and role.</span>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="user-form">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="nom_user"
                  value={formData.nom_user}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Leave empty to keep current password"
                  value={formData.password}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="roles"
                  value={formData.roles[0]}
                  onChange={handleFormChange}
                  required
                >
                  <option value="ROLE_ADMIN">Admin - Full system access</option>
                  <option value="ROLE_VENDOR">Vendeur - Sales and Clients</option>
                  <option value="ROLE_MAGASINIER">
                    Magasinier - Inventory and Stock
                  </option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-delete" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User</h2>
              <span className="modal-subtitle">
                Are you sure you want to delete this user? This action cannot be undone.
              </span>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="delete-user-info">
              <strong>{selectedUser.nom_user}</strong>
              <small>{selectedUser.email}</small>
              <span className={`role-badge ${getRoleColor(selectedUser.roles)}`}>
                {getRoleLabel(selectedUser.roles)}
              </span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={handleConfirmDelete}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
