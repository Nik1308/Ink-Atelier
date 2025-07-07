import React, { useState, useRef } from 'react';
import ConsentFormsTable from './ConsentFormsTable';
import ConsentFormDetails from './ConsentFormDetails';
import Pagination from '../../common/Pagination';
import { usePdfDownload } from './hooks/usePdfDownload';
import Drawer from '../../common/Drawer';
import { DateRangePicker } from 'react-date-range';
import { startOfDay, endOfDay, isWithinInterval, isSameDay, subDays, format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { FiCalendar } from 'react-icons/fi';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const ITEMS_PER_PAGE = 10;

const customStaticRanges = [
  {
    label: 'Today',
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
    isSelected(range) {
      return isSameDay(range.startDate, startOfDay(new Date())) && isSameDay(range.endDate, endOfDay(new Date()));
    },
  },
  {
    label: 'Yesterday',
    range: () => {
      const y = subDays(new Date(), 1);
      return { startDate: startOfDay(y), endDate: endOfDay(y) };
    },
    isSelected(range) {
      const y = subDays(new Date(), 1);
      return isSameDay(range.startDate, startOfDay(y)) && isSameDay(range.endDate, endOfDay(y));
    },
  },
  {
    label: 'Last 7 days',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 6)),
      endDate: endOfDay(new Date()),
    }),
    isSelected(range) {
      return (
        isSameDay(range.startDate, startOfDay(subDays(new Date(), 6))) &&
        isSameDay(range.endDate, endOfDay(new Date()))
      );
    },
  },
  {
    label: 'Last 30 days',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 29)),
      endDate: endOfDay(new Date()),
    }),
    isSelected(range) {
      return (
        isSameDay(range.startDate, startOfDay(subDays(new Date(), 29))) &&
        isSameDay(range.endDate, endOfDay(new Date()))
      );
    },
  },
  {
    label: 'Last 90 days',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 89)),
      endDate: endOfDay(new Date()),
    }),
    isSelected(range) {
      return (
        isSameDay(range.startDate, startOfDay(subDays(new Date(), 89))) &&
        isSameDay(range.endDate, endOfDay(new Date()))
      );
    },
  },
  {
    label: 'Last 365 days',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 364)),
      endDate: endOfDay(new Date()),
    }),
    isSelected(range) {
      return (
        isSameDay(range.startDate, startOfDay(subDays(new Date(), 364))) &&
        isSameDay(range.endDate, endOfDay(new Date()))
      );
    },
  },
  {
    label: 'Last Month',
    range: () => {
      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        startDate: startOfDay(prevMonth),
        endDate: endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)),
      };
    },
    isSelected(range) {
      return false;
    },
  },
  {
    label: 'Last 12 months',
    range: () => {
      const now = new Date();
      return {
        startDate: startOfDay(subDays(now, 365)),
        endDate: endOfDay(now),
      };
    },
    isSelected(range) {
      return false;
    },
  },
  {
    label: 'Last year',
    range: () => {
      const now = new Date();
      const lastYear = now.getFullYear() - 1;
      return {
        startDate: startOfDay(new Date(lastYear, 0, 1)),
        endDate: endOfDay(new Date(lastYear, 11, 31)),
      };
    },
    isSelected(range) {
      return false;
    },
  },
  {
    label: 'Week to date',
    range: () => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
      const weekStart = new Date(now.setDate(diff));
      return {
        startDate: startOfDay(weekStart),
        endDate: endOfDay(new Date()),
      };
    },
    isSelected(range) {
      return false;
    },
  },
  {
    label: 'Month to date',
    range: () => {
      const now = new Date();
      return {
        startDate: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
        endDate: endOfDay(now),
      };
    },
    isSelected(range) {
      return false;
    },
  },
  {
    label: 'Year to date',
    range: () => {
      const now = new Date();
      return {
        startDate: startOfDay(new Date(now.getFullYear(), 0, 1)),
        endDate: endOfDay(now),
      };
    },
    isSelected(range) {
      return false;
    },
  },
];

function formatRangeLabel(range) {
  const { startDate, endDate } = range;
  if (isSameDay(startDate, endDate)) {
    return format(startDate, 'PPP', { locale: enIN });
  }
  return `${format(startDate, 'PPP', { locale: enIN })} – ${format(endDate, 'PPP', { locale: enIN })}`;
}

const ConsentFormsTab = ({ customers, consentForms }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      key: 'selection',
    },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef();
  const [consentPage, setConsentPage] = useState(1);
  const [selectedConsentForm, setSelectedConsentForm] = useState(null);
  const { downloading, handleDownload } = usePdfDownload();

  // Filter consent forms by selected date range, then sort by date descending (latest first)
  const filteredConsentForms = React.useMemo(() => {
    const { startDate, endDate } = dateRange[0];
    return consentForms
      .filter(form => {
        const d = new Date(form.tattoo_date || form.piercing_date || form.date_signed || form.created_at);
        return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startDate) || isSameDay(d, endDate);
      })
      .sort((a, b) => {
        const dateA = new Date(a.tattoo_date || a.piercing_date || a.date_signed || a.created_at).getTime();
        const dateB = new Date(b.tattoo_date || b.piercing_date || b.date_signed || b.created_at).getTime();
        return dateB - dateA;
      });
  }, [consentForms, dateRange]);

  // Pagination logic for filtered forms
  const totalConsentForms = filteredConsentForms.length;
  const totalConsentPages = Math.ceil(totalConsentForms / ITEMS_PER_PAGE);
  const consentStartIndex = (consentPage - 1) * ITEMS_PER_PAGE;
  const consentEndIndex = Math.min(consentStartIndex + ITEMS_PER_PAGE, totalConsentForms);
  const paginatedConsentForms = filteredConsentForms.slice(consentStartIndex, consentEndIndex);

  React.useEffect(() => {
    setConsentPage(1);
  }, [dateRange]);

  // Click outside to close picker
  React.useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
    }
    if (pickerOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start" ref={pickerRef}>
        <button
          className="flex items-center border rounded-lg px-4 py-2 shadow-sm bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setPickerOpen((o) => !o)}
        >
          <FiCalendar className="mr-2" />
          <span>{formatRangeLabel(dateRange[0])}</span>
        </button>
        {pickerOpen && (
          <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4">
            <DateRangePicker
              ranges={dateRange}
              onChange={item => setDateRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              staticRanges={customStaticRanges}
              inputRanges={[]}
              locale={enIN}
            />
            <div className="flex justify-end mt-2">
              <button className="mr-2 px-4 py-2 rounded border" onClick={() => setPickerOpen(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setPickerOpen(false)}>Apply</button>
            </div>
          </div>
        )}
      </div>
      <ConsentFormsTable
        forms={paginatedConsentForms}
        customers={customers}
        onDownload={handleDownload}
        downloading={downloading}
        onViewDetails={setSelectedConsentForm}
        currentPage={consentPage}
        onPageChange={setConsentPage}
        totalItems={totalConsentForms}
        itemsPerPage={ITEMS_PER_PAGE}
        showCustomerPhone={true}
      />
      {totalConsentPages > 1 && (
        <Pagination
          currentPage={consentPage}
          totalPages={totalConsentPages}
          onPageChange={setConsentPage}
          totalItems={totalConsentForms}
          itemsPerPage={ITEMS_PER_PAGE}
          startIndex={consentStartIndex}
          endIndex={consentEndIndex}
        />
      )}
      <Drawer
        open={!!selectedConsentForm}
        onClose={() => setSelectedConsentForm(null)}
      >
        {selectedConsentForm && <ConsentFormDetails form={selectedConsentForm} />}
      </Drawer>
    </div>
  );
};

export default ConsentFormsTab; 