import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitPiercingConsentForm } from "../utils/consentFormOperations";
import { consentStatementsPiercing, piercingTypes, piercingSubtypes } from "../utils/constants";

const initialForm = {
  name: "",
  dob: "",
  address: "",
  phone: "",
  email: "",
  piercingType: "",
  piercingSubtype: "",
  piercingArtist: "Soni Jain",
  piercingDate: new Date().toISOString().slice(0, 10),
  medications: "no",
  medicationsList: "",
  allergies: "no",
  allergiesList: "",
  medicalConditions: "no",
  medicalConditionsList: "",
  alcoholDrugs: "no",
  pregnantNursing: "no",
  agree: false
};

const PiercingConsentFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!form.agree) {
      setError("You must agree to the consent statement.");
      setLoading(false);
      return;
    }
    try {
      await submitPiercingConsentForm(form, setLoading, setError);
      setSuccess("Consent submitted successfully!");
      setForm(initialForm);
      setTimeout(() => navigate("/forms"), 500);
    } catch (err) {
      // setError is already handled in submitPiercingConsentForm
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-center py-16 px-2">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-black max-w-3xl w-full p-10 mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">Body Piercing Consent Form</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Client Information */}
          <div className="font-bold text-lg mb-2 mt-2">Client Information</div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="flex items-center gap-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input id="name" name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="dob" className="flex items-center gap-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input id="dob" name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={handleChange} required className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" placeholder="Address" value={form.address} onChange={handleChange} className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="flex items-center gap-1">
                Whatsapp Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="bg-gray-200 border border-gray-400 rounded-l px-3 py-2 text-gray-700 select-none">+91</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="bg-offwhite text-black border-t border-b border-r border-gray-400 rounded-r px-3 py-2 w-full focus:outline-none"
                  style={{ borderLeft: 'none' }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
            </div>
          </div>

          {/* Piercing Information */}
          <div className="font-bold text-lg mb-2 mt-4">Piercing Information</div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="piercingType" className="flex items-center gap-1">
                Type of Piercing <span className="text-red-500">*</span>
              </label>
              <select
                id="piercingType"
                name="piercingType"
                value={form.piercingType}
                onChange={e => {
                  setForm(f => ({ ...f, piercingType: e.target.value, piercingSubtype: "" }));
                }}
                required
                className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
              >
                <option value="" disabled>Select type...</option>
                {piercingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {form.piercingType !== "" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="piercingSubtype" className="flex items-center gap-1">
                  Subtype <span className="text-red-500">*</span>
                </label>
                <select
                  id="piercingSubtype"
                  name="piercingSubtype"
                  value={form.piercingSubtype}
                  onChange={handleChange}
                  required
                  className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
                >
                  <option value="" disabled>Select subtype...</option>
                  {form.piercingType && piercingSubtypes[form.piercingType] && 
                    piercingSubtypes[form.piercingType].map(subtype => (
                      <option key={subtype} value={subtype}>{subtype}</option>
                    ))
                  }
                </select>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="piercingArtist" className="flex items-center gap-1">
                Piercing Artist <span className="text-red-500">*</span>
              </label>
              <input id="piercingArtist" name="piercingArtist" type="text" placeholder="Piercing Artist" value={form.piercingArtist} onChange={handleChange} required className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="piercingDate" className="flex items-center gap-1">
                Date of Piercing <span className="text-red-500">*</span>
              </label>
              <input id="piercingDate" name="piercingDate" type="date" placeholder="Date of Piercing" value={form.piercingDate} onChange={handleChange} required className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
            </div>
          </div>

          {/* Health Information */}
          <div className="font-bold text-lg mb-2 mt-4">Health Information</div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="mb-1">1. Are you currently taking any medications?</label>
              <div className="flex gap-8 ml-6">
                <label htmlFor="medications-yes" className="flex items-center gap-2">
                  <input id="medications-yes" type="radio" name="medications" value="yes" checked={form.medications === "yes"} onChange={handleChange} required />
                  <span>Yes</span>
                </label>
                <label htmlFor="medications-no" className="flex items-center gap-2">
                  <input id="medications-no" type="radio" name="medications" value="no" checked={form.medications === "no"} onChange={handleChange} required />
                  <span>No</span>
                </label>
              </div>
              {form.medications === "yes" && (
                <div className="flex flex-col gap-2 mt-2">
                  <label htmlFor="medicationsList">If yes, please list</label>
                  <textarea id="medicationsList" name="medicationsList" placeholder="If yes, please list" value={form.medicationsList} onChange={handleChange} className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="mb-1">2. Do you have any allergies (including to latex or metals)?</label>
              <div className="flex gap-8 ml-6">
                <label htmlFor="allergies-yes" className="flex items-center gap-2">
                  <input id="allergies-yes" type="radio" name="allergies" value="yes" checked={form.allergies === "yes"} onChange={handleChange} required />
                  <span>Yes</span>
                </label>
                <label htmlFor="allergies-no" className="flex items-center gap-2">
                  <input id="allergies-no" type="radio" name="allergies" value="no" checked={form.allergies === "no"} onChange={handleChange} required />
                  <span>No</span>
                </label>
              </div>
              {form.allergies === "yes" && (
                <div className="flex flex-col gap-2 mt-2">
                  <label htmlFor="allergiesList">If yes, please list</label>
                  <textarea id="allergiesList" name="allergiesList" placeholder="If yes, please list" value={form.allergiesList} onChange={handleChange} className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="mb-1">3. Do you have any medical conditions (e.g., diabetes, epilepsy, heart conditions, etc.)?</label>
              <div className="flex gap-8 ml-6">
                <label htmlFor="medicalConditions-yes" className="flex items-center gap-2">
                  <input id="medicalConditions-yes" type="radio" name="medicalConditions" value="yes" checked={form.medicalConditions === "yes"} onChange={handleChange} required />
                  <span>Yes</span>
                </label>
                <label htmlFor="medicalConditions-no" className="flex items-center gap-2">
                  <input id="medicalConditions-no" type="radio" name="medicalConditions" value="no" checked={form.medicalConditions === "no"} onChange={handleChange} required />
                  <span>No</span>
                </label>
              </div>
              {form.medicalConditions === "yes" && (
                <div className="flex flex-col gap-2 mt-2">
                  <label htmlFor="medicalConditionsList">If yes, please specify</label>
                  <textarea id="medicalConditionsList" name="medicalConditionsList" placeholder="If yes, please specify" value={form.medicalConditionsList} onChange={handleChange} className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="mb-1">4. Have you consumed alcohol or any drugs in the past 24 hours?</label>
              <div className="flex gap-8 ml-6">
                <label htmlFor="alcoholDrugs-yes" className="flex items-center gap-2">
                  <input id="alcoholDrugs-yes" type="radio" name="alcoholDrugs" value="yes" checked={form.alcoholDrugs === "yes"} onChange={handleChange} required />
                  <span>Yes</span>
                </label>
                <label htmlFor="alcoholDrugs-no" className="flex items-center gap-2">
                  <input id="alcoholDrugs-no" type="radio" name="alcoholDrugs" value="no" checked={form.alcoholDrugs === "no"} onChange={handleChange} required />
                  <span>No</span>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="mb-1">5. Are you pregnant or nursing?</label>
              <div className="flex gap-8 ml-6">
                <label htmlFor="pregnantNursing-yes" className="flex items-center gap-2">
                  <input id="pregnantNursing-yes" type="radio" name="pregnantNursing" value="yes" checked={form.pregnantNursing === "yes"} onChange={handleChange} required />
                  <span>Yes</span>
                </label>
                <label htmlFor="pregnantNursing-no" className="flex items-center gap-2">
                  <input id="pregnantNursing-no" type="radio" name="pregnantNursing" value="no" checked={form.pregnantNursing === "no"} onChange={handleChange} required />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Acknowledgement and Consent */}
          <div className="font-bold text-lg mb-2 mt-4">Acknowledgement and Consent</div>
          <ul className="list-disc pl-6 text-left text-sm md:text-base text-black/90 mb-2">
            {consentStatementsPiercing.map((statement, idx) => (
              <li key={idx} className="mb-1">{statement}</li>
            ))}
          </ul>
          <label className="flex items-center gap-2 mt-2">
            <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} required />
            <span className="flex items-center gap-1">
              I have read and agree to the consent statement above. <span className="text-red-500">*</span>
            </span>
          </label>

          <button type="submit" className="bg-black text-offwhite rounded-full px-6 py-2 font-bold shadow hover:bg-gray-800 transition mt-4" disabled={loading}>
            {loading ? "Submitting..." : "Submit Consent"}
          </button>
        </form>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        {success && <div className="text-green-700 mt-4 text-center">{success}</div>}
      </div>
    </section>
  );
};

export default PiercingConsentFormPage; 