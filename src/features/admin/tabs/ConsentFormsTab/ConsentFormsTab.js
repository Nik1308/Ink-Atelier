import React, { useState } from 'react';
import ConsentFormsTable from './ConsentFormsTable';
import ConsentFormDetails from './ConsentFormDetails';
import { Pagination, Drawer, DateRangeSelector } from '../../../../shared';
import { usePagination } from '../../../../shared/hooks';
import { usePdfDownload } from '../../hooks/usePdfDownload';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';

const ConsentFormsTab = ({ forms, customers, loading, error }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      key: 'selection',
    },
  ]);
  const [selectedForm, setSelectedForm] = useState(null);
  const { handleDownload, downloading } = usePdfDownload();
  const ITEMS_PER_PAGE = 10;

  // Filter forms by date
  const filteredForms = React.useMemo(() => {
    const { startDate, endDate } = dateRange[0];
    if (!Array.isArray(forms)) return [];
    return forms.filter(f => {
      if (!f.createdAt) return false;
      const d = new Date(f.createdAt);
      return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startDate) || isSameDay(d, endDate);
    });
  }, [forms, dateRange]);

  // Pagination
  const {
    paginatedData: paginatedForms,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(filteredForms, ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Date Range Selector */}
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      {/* Consent Forms Table */}
      <div className="bg-white rounded-xl pt-8 overflow-x-auto">
        <ConsentFormsTable
          forms={paginatedForms}
          customers={customers}
          onDownload={handleDownload}
          downloading={downloading}
          onViewDetails={setSelectedForm}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          showCustomerPhone={true}
        />
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}
      </div>
      {/* Drawer for form details */}
      <Drawer isOpen={!!selectedForm} onClose={() => setSelectedForm(null)}>
        {selectedForm && (
          <ConsentFormDetails form={selectedForm} customers={customers} />
        )}
      </Drawer>
    </div>
  );
};

export default ConsentFormsTab; 