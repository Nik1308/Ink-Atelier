import React from 'react';

const ConsentFormDetails = ({ form }) => {
  if (!form) return null;
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Consent Form Details</h3>
      <div className="mb-2"><span className="font-semibold">Type:</span> {form.type}</div>
      <div className="mb-2"><span className="font-semibold">Date:</span> {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}</div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default ConsentFormDetails; 