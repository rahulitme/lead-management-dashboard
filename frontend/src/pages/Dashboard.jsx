import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsAPI } from '../api';

const Dashboard = ({ user, onLogout }) => {
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Filters and search
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState({});

  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const sources = ['Website', 'Email', 'Social Media', 'Referral', 'Event', 'Other'];

  useEffect(() => {
    fetchLeads();
    fetchAnalytics();
  }, [search, stage, source, status, sortBy, order, page, limit]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadsAPI.getLeads({
        search,
        stage,
        source,
        status,
        sortBy,
        order,
        page,
        limit
      });
      setLeads(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await leadsAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (err) {
      console.error('Failed to load analytics');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, <strong>{user?.fullName || user?.username}</strong></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Analytics Cards */}
      {analytics && (
        <div className="bg-white shadow mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalLeads}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Converted Leads</p>
                <p className="text-3xl font-bold text-green-600">{analytics.convertedLeads}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.conversionRate}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-orange-600">${(analytics.totalValue / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search (name, email, company)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={stage}
              onChange={(e) => {
                setStage(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Stages</option>
              {stages.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Sources</option>
              {sources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="createdAt">Newest</option>
              <option value="firstName">Name</option>
              <option value="value">Value</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No leads found
                        </td>
                      </tr>
                    ) : (
                      leads.map(lead => (
                        <tr key={lead._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.company}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              lead.stage === 'Won' ? 'bg-green-100 text-green-800' :
                              lead.stage === 'Lost' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {lead.stage}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${lead.value.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => navigate(`/lead/${lead._id}`)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white border-t px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {leads.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, pagination.total)} of {pagination.total} leads
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, pagination.pages || 1) }, (_, i) => {
                    const pageNum = Math.max(1, page - 2) + i;
                    return pageNum <= (pagination.pages || 1) ? (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ) : null;
                  })}
                  <button
                    onClick={() => setPage(Math.min(pagination.pages || 1, page + 1))}
                    disabled={page === pagination.pages}
                    className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
