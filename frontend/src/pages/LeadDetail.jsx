import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadsAPI } from '../api';

const LeadDetail = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadsAPI.getLeadById(id);
      setLead(response.data.data);
      setFormData(response.data.data);
    } catch (err) {
      setError('Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await leadsAPI.updateLead(id, formData);
      setLead(formData);
      setIsEditing(false);
      alert('Lead updated successfully!');
    } catch (err) {
      setError('Failed to update lead');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsAPI.deleteLead(id);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete lead');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!lead) return <div className="text-center py-10">Lead not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <button onClick={() => navigate('/dashboard')} className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{lead.firstName} {lead.lastName}</h1>
          <div className="space-x-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(lead);
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Email', name: 'email' },
            { label: 'Phone', name: 'phone' },
            { label: 'Company', name: 'company' },
            { label: 'Job Title', name: 'jobTitle' },
            { label: 'Stage', name: 'stage', type: 'select', options: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] },
            { label: 'Source', name: 'source', type: 'select', options: ['Website', 'Email', 'Social Media', 'Referral', 'Event', 'Other'] },
            { label: 'Value', name: 'value', type: 'number' },
            { label: 'Status', name: 'status', type: 'select', options: ['Active', 'Inactive'] },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-gray-700 font-bold mb-2">{field.label}</label>
              {isEditing ? (
                field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                )
              ) : (
                <p className="text-gray-700">{lead[field.name] || '-'}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">Notes</label>
          {isEditing ? (
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          ) : (
            <p className="text-gray-700">{lead.notes || '-'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
