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
  // {
  //   label: 'Last 7 days',
  //   range: () => ({
  //     startDate: startOfDay(subDays(new Date(), 6)),
  //     endDate: endOfDay(new Date()),
  //   }),
  //   isSelected(range) {
  //     return (
  //       isSameDay(range.startDate, startOfDay(subDays(new Date(), 6))) &&
  //       isSameDay(range.endDate, endOfDay(new Date()))
  //     );
  //   },
  // },
  // {
  //   label: 'Last 30 days',
  //   range: () => ({
  //     startDate: startOfDay(subDays(new Date(), 29)),
  //     endDate: endOfDay(new Date()),
  //   }),
  //   isSelected(range) {
  //     return (
  //       isSameDay(range.startDate, startOfDay(subDays(new Date(), 29))) &&
  //       isSameDay(range.endDate, endOfDay(new Date()))
  //     );
  //   },
  // },
  // {
  //   label: 'Last 90 days',
  //   range: () => ({
  //     startDate: startOfDay(subDays(new Date(), 89)),
  //     endDate: endOfDay(new Date()),
  //   }),
  //   isSelected(range) {
  //     return (
  //       isSameDay(range.startDate, startOfDay(subDays(new Date(), 89))) &&
  //       isSameDay(range.endDate, endOfDay(new Date()))
  //     );
  //   },
  // },
  // {
  //   label: 'Last 365 days',
  //   range: () => ({
  //     startDate: startOfDay(subDays(new Date(), 364)),
  //     endDate: endOfDay(new Date()),
  //   }),
  //   isSelected(range) {
  //     return (
  //       isSameDay(range.startDate, startOfDay(subDays(new Date(), 364))) &&
  //       isSameDay(range.endDate, endOfDay(new Date()))
  //     );
  //   },
  // },
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
  // {
  //   label: 'Last 12 months',
  //   range: () => {
  //     const now = new Date();
  //     return {
  //       startDate: startOfDay(subDays(now, 365)),
  //       endDate: endOfDay(now),
  //     };
  //   },
  //   isSelected(range) {
  //     return false;
  //   },
  // },
  // {
  //   label: 'Last year',
  //   range: () => {
  //     const now = new Date();
  //     const lastYear = now.getFullYear() - 1;
  //     return {
  //       startDate: startOfDay(new Date(lastYear, 0, 1)),
  //       endDate: endOfDay(new Date(lastYear, 11, 31)),
  //     };
  //   },
  //   isSelected(range) {
  //     return false;
  //   },
  // },
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
    <div className={`flex flex-col items-start relative ${className}`} ref={pickerRef}>
      <button
        className="flex items-center bg-black/60 text-white border border-white/10 rounded-xl px-4 py-2 shadow-xl hover:bg-black/80 focus:outline-none focus:ring-0 transition font-medium text-base"
        onClick={() => {
          setPendingRange(dateRange);
          setPickerOpen((o) => !o);
        }}
      >
        <FiCalendar className="mr-2 text-sky-400" />
        <span className="font-mono tracking-tight text-white/90">{formatRangeLabel(dateRange[0])}</span>
      </button>
      {pickerOpen && (
        <div className="absolute z-[110] pointer-events-auto right-0 mt-2 bg-black/95 border border-white/15 rounded-xl shadow-2xl text-white p-3 min-w-[325px]">
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
            className="bg-transparent text-white border-0"
            rangeColors={["#38bdf8", "#22d3ee", "#818cf8"]}
            maxDate={new Date()}
          />
          <div className="flex justify-end mt-4 gap-3">
            <button className="px-4 py-2 rounded border border-white/10 bg-black/30 text-white hover:bg-black/70 transition" onClick={() => setPickerOpen(false)}>Cancel</button>
            <button className="bg-sky-500 text-white px-4 py-2 rounded shadow hover:bg-sky-600 transition" onClick={() => { setDateRange(pendingRange); setPickerOpen(false); }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector; 