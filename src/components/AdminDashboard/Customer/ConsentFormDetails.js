import React from 'react';

const ConsentFormDetails = ({ form }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const formatBoolean = (value) => {
    if (value === true || value === 'Yes' || value === 'yes') return 'Yes';
    if (value === false || value === 'No' || value === 'no') return 'No';
    return 'Not specified';
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {form.type === 'tattoo' ? 'Tattoo' : 'Piercing'} Consent Form Details
        </h3>
      </div>

      {/* Service Details */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Service Details</h4>
        <div className="grid grid-cols-1 gap-4">
          {form.type === 'tattoo' ? (
            <>
              <div>
                <span className="font-medium text-gray-600">Tattoo Location:</span>
                <span className="ml-2">{form.tattoo_location || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tattoo Artist:</span>
                <span className="ml-2">{form.tattoo_artist || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tattoo Date:</span>
                <span className="ml-2">{formatDate(form.tattoo_date)}</span>
              </div>
              {form.tattoo_design && (
                <div>
                  <span className="font-medium text-gray-600">Design Uploaded:</span>
                  <span className="ml-2">Yes</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <span className="font-medium text-gray-600">Piercing Type:</span>
                <span className="ml-2">{form.piercing_type || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Piercing Subtype:</span>
                <span className="ml-2">{form.piercing_subtype || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Piercing Artist:</span>
                <span className="ml-2">{form.piercing_artist || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Piercing Date:</span>
                <span className="ml-2">{formatDate(form.piercing_date)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Health Information */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Health Information</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="font-medium text-gray-600">Medications:</span>
            <span className="ml-2">{formatBoolean(form.medications || form.has_medications)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Allergies:</span>
            <span className="ml-2">{formatBoolean(form.allergies || form.has_allergies)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Medical Conditions:</span>
            <span className="ml-2">{formatBoolean(form.medical_conditions || form.has_medical_conditions)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Alcohol/Drugs (24h):</span>
            <span className="ml-2">{formatBoolean(form.alcohol_drugs)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Pregnant/Nursing:</span>
            <span className="ml-2">{formatBoolean(form.pregnant_nursing)}</span>
          </div>
        </div>

        {/* Detailed Lists */}
        {(form.medications_list || form.medicationsList) && (
          <div className="mt-3">
            <span className="font-medium text-gray-600">Medications List:</span>
            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{form.medications_list || form.medicationsList}</p>
          </div>
        )}
        {(form.allergies_list || form.allergiesList) && (
          <div className="mt-3">
            <span className="font-medium text-gray-600">Allergies List:</span>
            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{form.allergies_list || form.allergiesList}</p>
          </div>
        )}
        {(form.medical_conditions_list || form.medicalConditionsList) && (
          <div className="mt-3">
            <span className="font-medium text-gray-600">Medical Conditions List:</span>
            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{form.medical_conditions_list || form.medicalConditionsList}</p>
          </div>
        )}
      </div>

      {/* Consent Information */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Consent Information</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="font-medium text-gray-600">Consent Given:</span>
            <span className="ml-2">{formatBoolean(form.agree)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Date Signed:</span>
            <span className="ml-2">{formatDate(form.date_signed)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Form ID:</span>
            <span className="ml-2">{form.id || 'Not available'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Created:</span>
            <span className="ml-2">{formatDate(form.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormDetails; 