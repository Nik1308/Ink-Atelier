import React, { useRef, useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { startOfDay, endOfDay, isSameDay, subDays, format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { FiCalendar } from 'react-icons/fi';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

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

const DateRangeSelector = ({ dateRange, setDateRange, months = 2, direction = 'horizontal', className = '' }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingRange, setPendingRange] = useState(dateRange);
  const pickerRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
    }
    if (pickerOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  useEffect(() => {
    setPendingRange(dateRange);
  }, [dateRange]);

  return (
    <div className={`flex flex-col items-start ${className}`} ref={pickerRef}>
      <button
        className="flex items-center border rounded-lg px-4 py-2 shadow-sm bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => {
          setPendingRange(dateRange);
          setPickerOpen((o) => !o);
        }}
      >
        <FiCalendar className="mr-2" />
        <span>{formatRangeLabel(dateRange[0])}</span>
      </button>
      {pickerOpen && (
        <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4">
          <DateRangePicker
            ranges={pendingRange}
            onChange={item => setPendingRange([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={months}
            direction={direction}
            staticRanges={customStaticRanges}
            inputRanges={[]}
            locale={enIN}
          />
          <div className="flex justify-end mt-2">
            <button className="mr-2 px-4 py-2 rounded border" onClick={() => setPickerOpen(false)}>Cancel</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setDateRange(pendingRange); setPickerOpen(false); }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector; 