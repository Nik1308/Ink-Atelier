import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitPiercingConsentForm, consentStatementsPiercing } from "../../utils";
import FormField from "../../components/forms/FormField";
import FormSection from "../../components/forms/FormSection";
import RadioGroup from "../../components/forms/RadioGroup";

const initialForm = {
  name: "",
  dob: "",
  address: "",
  phone: "",
  email: "",
  piercingType: "",
  piercingLocation: "",
  piercingArtist: "",
  piercingDate: new Date().toISOString().slice(0, 10),
  medications: "no",
  medicationsList: "",
  allergies: "no",
  allergiesList: "",
  medicalConditions: "no",
  medicalConditionsList: "",
  alcoholDrugs: "no",
  pregnantNursing: "no",
  agree: false,
};

const PiercingConsentFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
      setTimeout(() => navigate("/forms"), 500); // short delay for UX
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
          <FormSection title="Client Information">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
            />
            <FormField
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              placeholder="Date of Birth"
            />
            <FormField
              label="Address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Phone Number"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </FormSection>

          {/* Piercing Information */}
          <FormSection title="Piercing Information">
            <FormField
              label="Type of Piercing"
              name="piercingType"
              type="text"
              value={form.piercingType}
              onChange={handleChange}
              required
              placeholder="Type of Piercing"
            />
            <FormField
              label="Piercing Location"
              name="piercingLocation"
              type="text"
              value={form.piercingLocation}
              onChange={handleChange}
              required
              placeholder="Piercing Location"
            />
            <FormField
              label="Piercing Artist"
              name="piercingArtist"
              type="text"
              value={form.piercingArtist}
              onChange={handleChange}
              required
              placeholder="Piercing Artist"
            />
            <FormField
              label="Date of Piercing"
              name="piercingDate"
              type="date"
              value={form.piercingDate}
              onChange={handleChange}
              required
              placeholder="Date of Piercing"
            />
          </FormSection>

          {/* Health Information */}
          <FormSection title="Health Information">
            <RadioGroup
              question="1. Are you currently taking any medications?"
              name="medications"
              value={form.medications}
              onChange={handleChange}
              required
              showTextarea={true}
              textareaName="medicationsList"
              textareaValue={form.medicationsList}
              textareaPlaceholder="If yes, please list"
            />
            <RadioGroup
              question="2. Do you have any allergies (including to latex or metals)?"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              required
              showTextarea={true}
              textareaName="allergiesList"
              textareaValue={form.allergiesList}
              textareaPlaceholder="If yes, please list"
            />
            <RadioGroup
              question="3. Do you have any medical conditions (e.g., diabetes, epilepsy, heart conditions, etc.)?"
              name="medicalConditions"
              value={form.medicalConditions}
              onChange={handleChange}
              required
              showTextarea={true}
              textareaName="medicalConditionsList"
              textareaValue={form.medicalConditionsList}
              textareaPlaceholder="If yes, please specify"
            />
            <RadioGroup
              question="4. Have you consumed alcohol or any drugs in the past 24 hours?"
              name="alcoholDrugs"
              value={form.alcoholDrugs}
              onChange={handleChange}
              required
            />
            <RadioGroup
              question="5. Are you pregnant or nursing?"
              name="pregnantNursing"
              value={form.pregnantNursing}
              onChange={handleChange}
              required
            />
          </FormSection>

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