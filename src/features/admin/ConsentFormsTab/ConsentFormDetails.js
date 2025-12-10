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
                <span className="ml-2">{form.tattooLocation || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tattoo Artist:</span>
                <span className="ml-2">{form.tattooArtist || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tattoo Date:</span>
                <span className="ml-2">{formatDate(form.tattooDate)}</span>
              </div>
              {form.tattooDesign && (
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
                <span className="ml-2">{form.piercingType || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Piercing Subtype:</span>
                <span className="ml-2">{form.piercingSubtype || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Piercing Artist:</span>
                <span className="ml-2">{form.piercingArtist || 'Not provided'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Piercing Date:</span>
                <span className="ml-2">{formatDate(form.piercingDate)}</span>
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
            <span className="ml-2">{formatBoolean(form.medications || form.hasMedications)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Allergies:</span>
            <span className="ml-2">{formatBoolean(form.allergies || form.hasAllergies)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Medical Conditions:</span>
            <span className="ml-2">{formatBoolean(form.medicalConditions || form.hasMedicalConditions)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Alcohol/Drugs (24h):</span>
            <span className="ml-2">{formatBoolean(form.alcoholDrugs)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Pregnant/Nursing:</span>
            <span className="ml-2">{formatBoolean(form.pregnantNursing)}</span>
          </div>
        </div>

        {/* Detailed Lists */}
        {(form.medicationsList || form.medications_list) && (
          <div className="mt-3">
            <span className="font-medium text-gray-600">Medications List:</span>
            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{form.medicationsList || form.medications_list}</p>
          </div>
        )}
        {(form.allergiesList || form.allergies_list) && (
          <div className="mt-3">
            <span className="font-medium text-gray-600">Allergies List:</span>
            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{form.allergiesList || form.allergies_list}</p>
          </div>
        )}
        {(form.medicalConditionsList || form.medical_conditions_list) && (
          <div className="mt-3">
            <span className="font-medium text-gray-600">Medical Conditions List:</span>
            <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{form.medicalConditionsList || form.medical_conditions_list}</p>
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
            <span className="ml-2">{formatDate(form.dateSigned || form.date_signed)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Form ID:</span>
            <span className="ml-2">{form.id || 'Not available'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Created:</span>
            <span className="ml-2">{formatDate(form.createdAt || form.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormDetails; 