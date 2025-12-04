import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../utils/Fetch';
import { LEADS_API_URL } from '../../utils/apiUrls';
import GlassModal from '../common/ui/GlassModal';
import FormField from '../forms/components/FormField';
import LoadingSpinner from '../common/ui/LoadingSpinner';
import ErrorMessage from '../common/ui/ErrorMessage';
import DateRangeSelector from '../common/ui/DateRangeSelector';
import { useAdminResources } from './hooks/useAdminResources';
import usePagination from '../common/hooks/usePagination';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';

const LeadsTab = () => {
  const { leads } = useAdminResources();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    service_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [togglingButtons, setTogglingButtons] = useState(new Set());
  const [dateRange, setDateRange] = useState([
    { startDate: startOfDay(new Date()), endDate: endOfDay(new Date()), key: 'selection' }
  ]);
  const [filters, setFilters] = useState({
    is_converted: false, // false = not selected, true = show only converted
    follow_up_1: false,
    follow_up_2: false,
    follow_up_3: false,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef(null);

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Close filters dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setFiltersOpen(false);
      }
    }
    if (filtersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [filtersOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await fetchApi(LEADS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setSuccess('Lead added successfully!');
      setFormData({
        name: '',
        phone: '',
        service: '',
        service_date: '',
      });
      setIsModalOpen(false);
      // Refetch leads
      queryClient.invalidateQueries(['leads']);
    } catch (err) {
      setError(err.message || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (leadId, field) => {
    const toggleKey = `${leadId}-${field}`;
    
    // Prevent clicking if already toggling or if value is already true
    const lead = leads?.data?.find((l) => l.id === leadId);
    if (!lead || lead[field] === true || togglingButtons.has(toggleKey)) return;

    setTogglingButtons((prev) => new Set(prev).add(toggleKey));
    
    try {
      const newValue = !lead[field];
      await fetchApi(`${LEADS_API_URL}/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: newValue }),
      });

      // Refetch leads
      queryClient.invalidateQueries(['leads']);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    } finally {
      setTogglingButtons((prev) => {
        const next = new Set(prev);
        next.delete(toggleKey);
        return next;
      });
    }
  };

  // Filter and sort leads by created_at and filters
  const filteredAndSortedLeads = useMemo(() => {
    if (!leads?.data) return [];
    const { startDate, endDate } = dateRange[0];
    
    return leads.data
      .filter((lead) => {
        // Date filter
        if (!lead.created_at) return false;
        const leadDate = new Date(lead.created_at);
        const dateMatch = (
          isWithinInterval(leadDate, { start: startOfDay(startDate), end: endOfDay(endDate) }) ||
          isSameDay(leadDate, startDate) ||
          isSameDay(leadDate, endDate)
        );
        if (!dateMatch) return false;

        // Filter by is_converted (only show if filter is enabled and value is true)
        if (filters.is_converted && !lead.is_converted) {
          return false;
        }

        // Filter by follow_up_1 (only show if filter is enabled and value is true)
        if (filters.follow_up_1 && !lead.follow_up_1) {
          return false;
        }

        // Filter by follow_up_2 (only show if filter is enabled and value is true)
        if (filters.follow_up_2 && !lead.follow_up_2) {
          return false;
        }

        // Filter by follow_up_3 (only show if filter is enabled and value is true)
        if (filters.follow_up_3 && !lead.follow_up_3) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
  }, [leads?.data, dateRange, filters]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dateRange]);

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(filteredAndSortedLeads, ITEMS_PER_PAGE);

  if (leads?.isLoading) {
    return (
      <div className="max-w-7xl mx-auto pt-8 pb-12">
        <div className="text-center py-8">
          <LoadingSpinner text="Loading leads..." />
        </div>
      </div>
    );
  }

  if (leads?.isError) {
    return (
      <div className="max-w-7xl mx-auto pt-8 pb-12">
        <ErrorMessage
          error={leads.error?.message || leads.error?.toString() || String(leads.error) || 'Failed to load leads'}
          title="Error loading leads"
          onRetry={() => queryClient.invalidateQueries(['leads'])}
        />
      </div>
    );
  }

  const handleFilterToggle = (field) => {
    setFilters((prev) => ({
      ...prev,
      [field]: !prev[field], // Toggle the filter
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight mb-2 md:mb-0">
          Leads
        </h1>
        <div className="flex items-center gap-4">
          <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} months={1} direction="horizontal" />
          
          {/* Filters Button */}
          <div className="relative" ref={filtersRef}>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`px-6 py-3 rounded-xl text-base font-bold shadow transition flex items-center gap-2 ${
                activeFiltersCount > 0
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FiFilter className="text-lg" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Filters Dropdown */}
            {filtersOpen && (
              <div className="absolute right-0 mt-2 bg-gradient-to-br from-slate-900/95 to-black/95 border border-white/10 rounded-xl shadow-2xl p-4 min-w-[240px] z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-base">Filters</h3>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="text-white/70 hover:text-white transition"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Is Converted Filter */}
                  <div className="flex items-center justify-between">
                    <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('is_converted')}>
                      Is Converted
                    </label>
                    <button
                      onClick={() => handleFilterToggle('is_converted')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        filters.is_converted ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          filters.is_converted ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Follow Up 1 Filter */}
                  <div className="flex items-center justify-between">
                    <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('follow_up_1')}>
                      Follow Up 1
                    </label>
                    <button
                      onClick={() => handleFilterToggle('follow_up_1')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        filters.follow_up_1 ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          filters.follow_up_1 ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Follow Up 2 Filter */}
                  <div className="flex items-center justify-between">
                    <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('follow_up_2')}>
                      Follow Up 2
                    </label>
                    <button
                      onClick={() => handleFilterToggle('follow_up_2')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        filters.follow_up_2 ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          filters.follow_up_2 ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Follow Up 3 Filter */}
                  <div className="flex items-center justify-between">
                    <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('follow_up_3')}>
                      Follow Up 3
                    </label>
                    <button
                      onClick={() => handleFilterToggle('follow_up_3')}
                      className={`relative w-12 h-6 rounded-full transition ${
                        filters.follow_up_3 ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          filters.follow_up_3 ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Clear All Button */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setFilters({ is_converted: false, follow_up_1: false, follow_up_2: false, follow_up_3: false });
                    }}
                    className="mt-4 w-full px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white/70 hover:bg-white/20 transition"
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-white text-black text-base font-bold shadow hover:bg-gray-100 transition"
          >
            Add Lead
          </button>
        </div>
      </div>

      {/* Add Lead Modal */}
      <GlassModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-6">Add New Lead</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter lead name"
              inputClassName="w-full bg-white/10 text-white border-white/30 placeholder:text-white/50"
              labelClassName="text-white font-semibold"
            />
            <FormField
              label="Phone"
              name="phone"
              type="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="10-digit mobile number"
              inputClassName="w-full bg-white/10 text-white border-white/30 placeholder:text-white/50"
              labelClassName="text-white font-semibold"
            />
            <FormField
              label="Service"
              name="service"
              type="select"
              value={formData.service}
              onChange={handleChange}
              required
              options={[
                { value: 'tattoo', label: 'Tattoo' },
                { value: 'piercing', label: 'Piercing' },
              ]}
              inputClassName="w-full bg-white/10 text-white border-white/30"
              labelClassName="text-white font-semibold"
            />
            <FormField
              label="Service Date"
              name="service_date"
              type="date"
              value={formData.service_date}
              onChange={handleChange}
              required
              inputClassName="w-full bg-white/10 text-white border-white/30"
              labelClassName="text-white font-semibold"
            />
            {error && (
              <div className="text-red-400 text-sm bg-red-500/20 p-3 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-400 text-sm bg-green-500/20 p-3 rounded-md">
                {success}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-white text-black font-bold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Lead'}
              </button>
            </div>
          </form>
        </div>
      </GlassModal>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] rounded-2xl overflow-hidden border-collapse">
          <thead className="bg-white/10 rounded-2xl">
            <tr className="text-white/80 text-lg font-bold">
              <th className="px-4 py-3 text-left font-bold">Name</th>
              <th className="px-4 py-3 text-left font-bold">Phone</th>
              <th className="px-4 py-3 text-left font-bold">Service</th>
              <th className="px-4 py-3 text-left font-bold">Service Date</th>
              <th className="px-4 py-3 text-center font-bold">Converted</th>
              <th className="px-4 py-3 text-center font-bold">Follow Up 1</th>
              <th className="px-4 py-3 text-center font-bold">Follow Up 2</th>
              <th className="px-4 py-3 text-center font-bold">Follow Up 3</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-9 py-12 text-left text-white/60 text-xl font-semibold"
                >
                  No leads found.
                </td>
              </tr>
            ) : (
              paginatedData.map((lead) => (
                <tr
                  key={lead.id}
                  className="bg-white/5 border-b border-white/15 last:border-b-0 transition text-white"
                >
                  <td className="px-4 py-3 text-left font-extrabold text-white text-[1.18rem]">
                    {lead.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-left font-mono text-sky-200 text-[1.13rem]">
                    {lead.phone || '—'}
                  </td>
                  <td className="px-4 py-3 text-left text-white/80 text-base capitalize">
                    {lead.service || '—'}
                  </td>
                  <td className="px-4 py-3 text-left text-white/80 text-base">
                    {lead.service_date
                      ? new Date(lead.service_date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'is_converted')}
                      disabled={lead.is_converted || togglingButtons.has(`${lead.id}-is_converted`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.is_converted
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.is_converted ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'follow_up_1')}
                      disabled={lead.follow_up_1 || togglingButtons.has(`${lead.id}-follow_up_1`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.follow_up_1
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.follow_up_1 ? 'Done' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'follow_up_2')}
                      disabled={lead.follow_up_2 || togglingButtons.has(`${lead.id}-follow_up_2`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.follow_up_2
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.follow_up_2 ? 'Done' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'follow_up_3')}
                      disabled={lead.follow_up_3 || togglingButtons.has(`${lead.id}-follow_up_3`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.follow_up_3
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.follow_up_3 ? 'Done' : 'Pending'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-10 mb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white/70 text-sm font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} leads
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 select-none flex-wrap">
                <button
                  className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-white/70 hover:text-white disabled:opacity-40 font-semibold text-base"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-lg text-base font-semibold transition border-2 ${
                      currentPage === i + 1
                        ? 'bg-sky-500 border-sky-400 text-white'
                        : 'bg-white/10 border-white/15 text-white/70 hover:text-white'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-white/70 hover:text-white disabled:opacity-40 font-semibold text-base"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTab;

