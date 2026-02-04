import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, ShoppingCart, Users } from 'lucide-react';
import '../style/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const userData = JSON.parse(loggedInUser);
            setUser(userData);
            
            // Fetch user details from API to get nom_user
            if (userData.id) {
                fetch(`http://localhost:8000/api/users/${userData.id}`)
                    .then(res => res.json())
                    .then(data => {
                        setUser(prev => ({
                            ...prev,
                            nom_user: data.nom_user || data.email
                        }));
                    })
                    .catch(err => console.error('Error fetching user details:', err));
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    console.error('Failed to fetch dashboard stats');
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'TND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatGrowth = (value) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}% vs last month`;
    };

    const getGrowthClass = (value) => {
        return value >= 0 ? 'positive' : 'negative';
    };

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="greeting">
                    <h1>Welcome back, {user?.nom_user || 'User'}! 👋</h1>
                    <p>Here is what happened this month in your business.</p>
                </div>
            </div>

            {/* Stats Cards Section */}
            <div className="stats-grid">
                {/* Total Revenue Card */}
                <div className="stat-card">
                    <div className="stat-icon revenue"><DollarSign size={32} /></div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">{stats ? formatCurrency(stats.totalRevenue) : '€0'}</p>
                        <p className={`stat-growth ${getGrowthClass(stats?.revenueGrowth || 0)}`}>
                            {stats ? formatGrowth(stats.revenueGrowth) : '+0% vs last month'}
                        </p>
                    </div>
                </div>

                {/* Net Profit Card */}
                <div className="stat-card">
                    <div className="stat-icon profit"><TrendingUp size={32} /></div>
                    <div className="stat-content">
                        <h3>Net Profit</h3>
                        <p className="stat-value">{stats ? formatCurrency(stats.netProfit) : '€0'}</p>
                        <p className={`stat-growth ${getGrowthClass(stats?.profitGrowth || 0)}`}>
                            {stats ? formatGrowth(stats.profitGrowth) : '+0% vs last month'}
                        </p>
                    </div>
                </div>

                {/* Total Sales Card */}
                <div className="stat-card">
                    <div className="stat-icon sales"><ShoppingCart size={32} /></div>
                    <div className="stat-content">
                        <h3>Total Sales</h3>
                        <p className="stat-value">{stats ? stats.totalSales : '0'}</p>
                        <p className={`stat-growth ${getGrowthClass(stats?.salesGrowth || 0)}`}>
                            {stats ? formatGrowth(stats.salesGrowth) : '+0% vs last month'}
                        </p>
                    </div>
                </div>

                {/* New Clients Card */}
                <div className="stat-card">
                    <div className="stat-icon clients"><Users size={32} /></div>
                    <div className="stat-content">
                        <h3>New Clients</h3>
                        <p className="stat-value">{stats ? stats.newClients : '0'}</p>
                        <p className={`stat-growth ${getGrowthClass(stats?.clientsGrowth || 0)}`}>
                            {stats ? formatGrowth(stats.clientsGrowth) : '+0% vs last month'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Critical Stock Alerts Section */}
            <div className="alerts-section">
                <h2>Critical Stock Alerts</h2>
                <div className="alerts-list">
                    {stats && stats.lowStockAlerts && stats.lowStockAlerts.length > 0 ? (
                        stats.lowStockAlerts.map((alert, index) => (
                            <div key={index} className="alert-item">
                                <div className="alert-left">
                                    <p className="alert-brand">{alert.marque}</p>
                                    <p className="alert-article">{alert.article?.nom_article || 'Article'}</p>
                                </div>
                                <div className="alert-right">
                                    <span className="alert-status">Status: High Risk</span>
                                    <span className="alert-quantity">Only {alert.quantite} units left</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-alerts">
                            <p>✓ All stock levels are healthy!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
