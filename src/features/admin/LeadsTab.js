import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchApi } from '../../utils/Fetch';
import { LEADS_API_URL, ADVANCE_PAYMENT_API_URL } from '../../utils/apiUrls';
import GlassModal from '../common/ui/GlassModal';
import FormField from '../forms/components/FormField';
import LoadingSpinner from '../common/ui/LoadingSpinner';
import ErrorMessage from '../common/ui/ErrorMessage';
import DateRangeSelector from '../common/ui/DateRangeSelector';
import { useLazyAdminResources } from './hooks/useLazyAdminResources';
import usePagination from '../common/hooks/usePagination';
import { startOfDay, endOfDay, isWithinInterval, isSameDay, startOfMonth, format, addDays, differenceInDays, parse, getYear, setYear } from 'date-fns';
import GlassCard from './components/GlassCard';
import { normalizePhoneNumber } from '../../utils/phoneUtils';

const LeadsTab = () => {
  const { leads, advancePayments: advancePaymentsQuery, customers: customersQuery } = useLazyAdminResources({
    enableLeads: true,
    enableAdvancePayments: true,
    enableCustomers: true,
  });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    serviceDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [togglingButtons, setTogglingButtons] = useState(new Set());
  const [dateRange, setDateRange] = useState([
    { startDate: startOfMonth(new Date()), endDate: endOfDay(new Date()), key: 'selection' }
  ]);
  const [filters, setFilters] = useState({
    isConverted: false, // false = not selected, true = show only converted
    followUp1: false,
    followUp2: false,
    followUp3: false,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef(null);
  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'bookings', or 'birthdays'
  const [bookingsPage, setBookingsPage] = useState(1);
  const [birthdaysPage, setBirthdaysPage] = useState(1);
  const [fulfillingId, setFulfillingId] = useState(null);
  const rowsPerPage = 10;

  const fulfillMutation = useMutation({
    mutationFn: async (booking) => {
      setFulfillingId(booking.id);
      await fetchApi(`${ADVANCE_PAYMENT_API_URL}/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillment: true }),
      });
    },
    onSuccess: () => {
      setFulfillingId(null);
      queryClient.invalidateQueries(['advancePayments']);
    },
    onError: () => {
      setFulfillingId(null);
    }
  });

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
      // Convert camelCase to snake_case for API
      const apiData = {
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
        service_date: formData.serviceDate,
      };
      
      await fetchApi(LEADS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      setSuccess('Lead added successfully!');
      setFormData({
        name: '',
        phone: '',
        service: '',
        serviceDate: '',
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
      // Convert camelCase field name to snake_case for API
      // Handles both uppercase letters and numbers: followUp1 -> follow_up_1
      const snakeCaseField = field
        .replace(/([A-Z])/g, '_$1')  // Add underscore before uppercase
        .replace(/(\d)/g, '_$1')      // Add underscore before numbers
        .toLowerCase()
        .replace(/^_/, '');           // Remove leading underscore if any
      await fetchApi(`${LEADS_API_URL}/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [snakeCaseField]: newValue }),
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

  // Filter and sort leads by createdAt and filters
  const filteredAndSortedLeads = useMemo(() => {
    if (!leads?.data) return [];
    const { startDate, endDate } = dateRange[0];
    
    return leads.data
      .filter((lead) => {
        // Date filter
        if (!lead.createdAt) return false;
        const leadDate = new Date(lead.createdAt);
        const dateMatch = (
          isWithinInterval(leadDate, { start: startOfDay(startDate), end: endOfDay(endDate) }) ||
          isSameDay(leadDate, startDate) ||
          isSameDay(leadDate, endDate)
        );
        if (!dateMatch) return false;

        // Filter by isConverted (only show if filter is enabled and value is true)
        if (filters.isConverted && !lead.isConverted) {
          return false;
        }

        // Filter by followUp1 (only show if filter is enabled and value is true)
        if (filters.followUp1 && !lead.followUp1) {
          return false;
        }

        // Filter by followUp2 (only show if filter is enabled and value is true)
        if (filters.followUp2 && !lead.followUp2) {
          return false;
        }

        // Filter by followUp3 (only show if filter is enabled and value is true)
        if (filters.followUp3 && !lead.followUp3) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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

  // Upcoming bookings data processing
  const allCustomers = (customersQuery?.data || []);
  const upcomingBookings = (advancePaymentsQuery?.data || []).filter(b => !b.fulfillment && b.appointmentDate).sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);
    return dateA - dateB; // Sort ascending (earliest first)
  });
  
  // Pagination window helper
  const getPaginationWindow = (current, total) => {
    const window = [];
    if (total <= 7) {
      for (let i = 1; i <= total; ++i) window.push(i);
      return window;
    }
    let left = Math.max(2, current - 2);
    let right = Math.min(total - 1, current + 2);
    if (current <= 4) {
      left = 2; right = 5;
    } else if (current >= total - 3) {
      left = total - 4; right = total - 1;
    }
    window.push(1);
    if (left > 2) window.push('...');
    for (let i = left; i <= right; ++i) window.push(i);
    if (right < total - 1) window.push('...');
    window.push(total);
    return window;
  };
  
  const paginatedBookings = upcomingBookings.slice((bookingsPage-1) * rowsPerPage, bookingsPage * rowsPerPage);
  const totalBookingsPages = Math.ceil(upcomingBookings.length / rowsPerPage) || 1;
  const bookingsPagesWindow = getPaginationWindow(bookingsPage, totalBookingsPages);

  // Function to send WhatsApp birthday message
  const sendWhatsAppMessage = (customer) => {
    const phone = customer.phone || '';
    // Normalize phone number to international format
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      alert('Invalid phone number format');
      return;
    }
    
    // Remove + for WhatsApp URL (WhatsApp expects format without +)
    const cleanPhone = normalizedPhone.replace(/^\+/, '');
    
    // Check if birthday is today (daysUntil === 0)
    const isToday = customer.daysUntil === 0;
    
    // WhatsApp Web has known issues with emojis in URL parameters showing as question marks
    // Using text-only message for reliable compatibility
    const message = isToday 
      ? `Happy Birthday from Ink Atelier!

It's your day — and we're celebrating with you!

Enjoy a massive 25% OFF tattoos + 15% OFF piercings valid once during your birthday month.

This is your sign to get that tattoo or piercing you've been thinking about.

Let's make your birthday unforgettable!`
      : `Happy Birthday from Ink Atelier!

Your birthday is coming up soon… and we couldn't wait!

Here's your early birthday treat: 25% OFF tattoos + 15% OFF piercings, valid once during your birthday month.

Go ahead — plan something bold, fun, and unforgettable.

Your birthday month deserves fresh ink or a new piercing!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Upcoming birthdays data processing
  const getUpcomingBirthdays = () => {
    const today = startOfDay(new Date()); // Normalize today to midnight local time
    
    return (allCustomers || []).filter(customer => {
      // Handle both date_of_birth and dateOfBirth formats
      const dob = customer.date_of_birth || customer.dateOfBirth;
      if (!dob) return false;
      
      try {
        // Parse the date string to extract year, month, day
        // Handle ISO format (YYYY-MM-DD) or ISO timestamp (YYYY-MM-DDTHH:mm:ss.sssZ)
        let birthDate;
        if (typeof dob === 'string') {
          // Extract date part from ISO timestamp (e.g., "1999-11-01T00:00:00.000Z" -> "1999-11-01")
          const datePart = dob.split('T')[0];
          if (datePart.includes('-')) {
            // Parse ISO format string (YYYY-MM-DD) as local date
            const [year, month, day] = datePart.split('-').map(Number);
            birthDate = new Date(year, month - 1, day); // month is 0-indexed
          } else {
            // Fallback to Date constructor
            birthDate = new Date(dob);
          }
        } else {
          // Fallback to Date constructor
          birthDate = new Date(dob);
        }
        
        if (isNaN(birthDate.getTime())) return false;
        
        // Normalize birth date to midnight local time
        birthDate = startOfDay(birthDate);
        
        // Get this year's birthday (normalized to midnight)
        const thisYearBirthday = startOfDay(setYear(birthDate, getYear(today)));
        const nextYearBirthday = startOfDay(setYear(birthDate, getYear(today) + 1));
        
        // Check if birthday is within next 15 days (this year or next year)
        const daysUntilThisYear = differenceInDays(thisYearBirthday, today);
        const daysUntilNextYear = differenceInDays(nextYearBirthday, today);
        
        // Birthday is upcoming if it's within 15 days (either this year or next year)
        return (daysUntilThisYear >= 0 && daysUntilThisYear <= 15) || 
               (daysUntilNextYear >= 0 && daysUntilNextYear <= 15);
      } catch (e) {
        return false;
      }
    }).map(customer => {
      const dob = customer.date_of_birth || customer.dateOfBirth;
      
      // Parse the date string to extract year, month, day
      // Handle ISO format (YYYY-MM-DD) or ISO timestamp (YYYY-MM-DDTHH:mm:ss.sssZ)
      let birthDate;
      if (typeof dob === 'string') {
        // Extract date part from ISO timestamp (e.g., "1999-11-01T00:00:00.000Z" -> "1999-11-01")
        const datePart = dob.split('T')[0];
        if (datePart.includes('-')) {
          // Parse ISO format string (YYYY-MM-DD) as local date
          const [year, month, day] = datePart.split('-').map(Number);
          birthDate = new Date(year, month - 1, day); // month is 0-indexed
        } else {
          // Fallback to Date constructor
          birthDate = new Date(dob);
        }
      } else {
        // Fallback to Date constructor
        birthDate = new Date(dob);
      }
      
      // Normalize birth date to midnight local time
      birthDate = startOfDay(birthDate);
      
      // Get this year's and next year's birthdays (normalized to midnight)
      const thisYearBirthday = startOfDay(setYear(birthDate, getYear(today)));
      const nextYearBirthday = startOfDay(setYear(birthDate, getYear(today) + 1));
      
      const daysUntilThisYear = differenceInDays(thisYearBirthday, today);
      const daysUntilNextYear = differenceInDays(nextYearBirthday, today);
      
      let upcomingBirthday;
      let daysUntil;
      
      if (daysUntilThisYear >= 0 && daysUntilThisYear <= 15) {
        upcomingBirthday = thisYearBirthday;
        daysUntil = daysUntilThisYear;
      } else {
        upcomingBirthday = nextYearBirthday;
        daysUntil = daysUntilNextYear;
      }
      
      return {
        ...customer,
        upcomingBirthday,
        daysUntil,
        date_of_birth: dob
      };
    }).sort((a, b) => a.daysUntil - b.daysUntil); // Sort by days until birthday
  };
  
  const upcomingBirthdays = getUpcomingBirthdays();
  const paginatedBirthdays = upcomingBirthdays.slice((birthdaysPage-1) * rowsPerPage, birthdaysPage * rowsPerPage);
  const totalBirthdaysPages = Math.ceil(upcomingBirthdays.length / rowsPerPage) || 1;
  const birthdaysPagesWindow = getPaginationWindow(birthdaysPage, totalBirthdaysPages);

  // Dynamic heading based on active tab
  const getHeadingText = () => {
    if (activeTab === 'bookings') {
      return 'Upcoming Bookings';
    }
    if (activeTab === 'birthdays') {
      return 'Upcoming Birthdays';
    }
    return 'Leads';
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight mb-2 md:mb-0">
          {getHeadingText()}
        </h1>
        {activeTab === 'leads' && (
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
                      <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('isConverted')}>
                        Is Converted
                      </label>
                      <button
                        onClick={() => handleFilterToggle('isConverted')}
                        className={`relative w-12 h-6 rounded-full transition ${
                          filters.isConverted ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            filters.isConverted ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Follow Up 1 Filter */}
                    <div className="flex items-center justify-between">
                      <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('followUp1')}>
                        Follow Up 1
                      </label>
                      <button
                        onClick={() => handleFilterToggle('followUp1')}
                        className={`relative w-12 h-6 rounded-full transition ${
                          filters.followUp1 ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            filters.followUp1 ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Follow Up 2 Filter */}
                    <div className="flex items-center justify-between">
                      <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('followUp2')}>
                        Follow Up 2
                      </label>
                      <button
                        onClick={() => handleFilterToggle('followUp2')}
                        className={`relative w-12 h-6 rounded-full transition ${
                          filters.followUp2 ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            filters.followUp2 ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Follow Up 3 Filter */}
                    <div className="flex items-center justify-between">
                      <label className="text-white/90 text-sm font-medium cursor-pointer flex-1" onClick={() => handleFilterToggle('followUp3')}>
                        Follow Up 3
                      </label>
                      <button
                        onClick={() => handleFilterToggle('followUp3')}
                        className={`relative w-12 h-6 rounded-full transition ${
                          filters.followUp3 ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            filters.followUp3 ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Clear All Button */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setFilters({ isConverted: false, followUp1: false, followUp2: false, followUp3: false });
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
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 border-b border-white/20">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-3 text-base font-semibold transition-all rounded-t-lg ${
              activeTab === 'leads'
                ? 'bg-white/20 text-white border-b-2 border-sky-400'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Leads
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 text-base font-semibold transition-all rounded-t-lg ${
              activeTab === 'bookings'
                ? 'bg-white/20 text-white border-b-2 border-sky-400'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Upcoming Bookings
          </button>
          <button
            onClick={() => setActiveTab('birthdays')}
            className={`px-6 py-3 text-base font-semibold transition-all rounded-t-lg ${
              activeTab === 'birthdays'
                ? 'bg-white/20 text-white border-b-2 border-sky-400'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Upcoming Birthday
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
              placeholder="Country code and number (e.g., 919876543210)"
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
              name="serviceDate"
              type="date"
              value={formData.serviceDate}
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

      {/* Leads Tab Content */}
      {activeTab === 'leads' && (
        <>
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
                    {lead.serviceDate
                      ? new Date(lead.serviceDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'isConverted')}
                      disabled={lead.isConverted || togglingButtons.has(`${lead.id}-isConverted`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.isConverted
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.isConverted ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'followUp1')}
                      disabled={lead.followUp1 || togglingButtons.has(`${lead.id}-followUp1`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.followUp1
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.followUp1 ? 'Done' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'followUp2')}
                      disabled={lead.followUp2 || togglingButtons.has(`${lead.id}-followUp2`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.followUp2
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.followUp2 ? 'Done' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(lead.id, 'followUp3')}
                      disabled={lead.followUp3 || togglingButtons.has(`${lead.id}-followUp3`)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow transition ${
                        lead.followUp3
                          ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lead.followUp3 ? 'Done' : 'Pending'}
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
        </>
      )}

      {/* Upcoming Bookings Tab Content */}
      {activeTab === 'bookings' && (
        <div className="w-full">
          <div className="w-full overflow-x-auto pb-2">
            <table className="w-full min-w-[900px] glass-table rounded-2xl overflow-hidden border-collapse">
              <thead className="bg-white/10 sticky top-0 z-10">
                <tr className="text-white/80 text-base font-bold">
                  <th className="px-4 py-3 text-left">Customer Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-center">Appointment Date</th>
                  <th className="px-4 py-3 text-center">Advance Amount</th>
                  <th className="px-4 py-3 text-center">Due Amount</th>
                  <th className="px-4 py-3 text-center">Service</th>
                  <th className="px-4 py-3 text-center">Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-white/60 text-center">No upcoming bookings found.</td></tr>
                ) : paginatedBookings.map((b, idx) => {
                  const customer = allCustomers.find(c => c.id === b.customerId) || {};
                  return (
                    <tr key={b.id || idx} className="bg-white/5 border-b border-white/15 last:border-b-0 text-white hover:bg-white/10 transition">
                      <td className="px-4 py-3 text-left font-bold text-white">{customer.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-left font-mono text-sky-200">{customer.phone || ''}</td>
                      <td className="px-4 py-3 text-center text-white/90">{b.appointmentDate ? new Date(b.appointmentDate).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}) : '-'}</td>
                      <td className="px-4 py-3 text-center font-semibold">{b.advanceAmount ? `₹${parseFloat(b.advanceAmount).toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-center font-semibold">{b.dueAmount ? `₹${parseFloat(b.dueAmount).toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-center">{b.service || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => fulfillMutation.mutate(b)}
                          disabled={fulfillingId === b.id || b.fulfillment}
                          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {fulfillingId === b.id ? 'Fulfilling...' : b.fulfillment ? 'Fulfilled' : 'Fulfill'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalBookingsPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                <button
                  onClick={() => setBookingsPage(p => Math.max(1, p-1))}
                  disabled={bookingsPage===1}
                  className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${bookingsPage === 1 ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                  style={{minWidth:44}}
                >Prev</button>
                {bookingsPagesWindow.map((num, idx) => num === '...'
                  ? <span key={`dots${idx}`} className="mx-1 text-gray-300 text-lg px-1 font-bold">…</span>
                  : <button
                      key={num}
                      onClick={() => setBookingsPage(num)}
                      className={`mx-[2px] px-4 py-2 rounded-2xl border-none font-bold text-base transition shadow backdrop-blur ${bookingsPage===num ? 'bg-sky-500 text-white' : 'bg-white/12 text-white/70 hover:bg-sky-400 hover:text-white'}`}
                      style={{minWidth:44}}
                    >{num}</button>
                )}
                <button
                  onClick={() => setBookingsPage(p => Math.min(totalBookingsPages, p+1))}
                  disabled={bookingsPage===totalBookingsPages}
                  className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${bookingsPage === totalBookingsPages ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                  style={{minWidth:44}}
                >Next</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Birthdays Tab Content */}
      {activeTab === 'birthdays' && (
        <div className="w-full">
          <div className="w-full overflow-x-auto pb-2">
            <table className="w-full min-w-[800px] glass-table rounded-2xl overflow-hidden border-collapse">
              <thead className="bg-white/10 sticky top-0 z-10">
                <tr className="text-white/80 text-base font-bold">
                  <th className="px-4 py-3 text-left">Customer Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-center">Date of Birth</th>
                  <th className="px-4 py-3 text-center">Upcoming Birthday</th>
                  <th className="px-4 py-3 text-center">Days Until</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBirthdays.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-white/60 text-center">No upcoming birthdays in the next 15 days.</td></tr>
                ) : paginatedBirthdays.map((customer, idx) => {
                  return (
                    <tr key={customer.id || idx} className="bg-white/5 border-b border-white/15 last:border-b-0 text-white hover:bg-white/10 transition">
                      <td className="px-4 py-3 text-left font-bold text-white">{customer.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-left font-mono text-sky-200">{customer.phone || ''}</td>
                      <td className="px-4 py-3 text-center text-white/90">
                        {customer.date_of_birth ? format(new Date(customer.date_of_birth), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-4 py-3 text-center text-white/90">
                        {customer.upcomingBirthday ? format(customer.upcomingBirthday, 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                          customer.daysUntil === 0 
                            ? 'bg-green-500 text-white' 
                            : customer.daysUntil <= 3 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {customer.daysUntil === 0 ? 'Today' : customer.daysUntil === 1 ? 'Tomorrow' : `${customer.daysUntil} days`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => sendWhatsAppMessage(customer)}
                          className="bg-green-600 text-white px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition flex items-center gap-2 mx-auto"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          Send Message
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalBirthdaysPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                <button
                  onClick={() => setBirthdaysPage(p => Math.max(1, p-1))}
                  disabled={birthdaysPage===1}
                  className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${birthdaysPage === 1 ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                  style={{minWidth:44}}
                >Prev</button>
                {birthdaysPagesWindow.map((num, idx) => num === '...'
                  ? <span key={`dots${idx}`} className="mx-1 text-gray-300 text-lg px-1 font-bold">…</span>
                  : <button
                      key={num}
                      onClick={() => setBirthdaysPage(num)}
                      className={`mx-[2px] px-4 py-2 rounded-2xl border-none font-bold text-base transition shadow backdrop-blur ${birthdaysPage===num ? 'bg-sky-500 text-white' : 'bg-white/12 text-white/70 hover:bg-sky-400 hover:text-white'}`}
                      style={{minWidth:44}}
                    >{num}</button>
                )}
                <button
                  onClick={() => setBirthdaysPage(p => Math.min(totalBirthdaysPages, p+1))}
                  disabled={birthdaysPage===totalBirthdaysPages}
                  className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${birthdaysPage === totalBirthdaysPages ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                  style={{minWidth:44}}
                >Next</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTab;

