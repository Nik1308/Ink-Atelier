import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { submitTattooConsentForm, consentStatementsTattoo } from "../../utils";
import FormField from "../../components/forms/FormField";
import FormSection from "../../components/forms/FormSection";
import RadioGroup from "../../components/forms/RadioGroup";

const initialForm = {
  name: "",
  dob: "",
  address: "",
  phone: "",
  email: "",
  tattooDesign: null,
  tattooLocation: "",
  tattooArtist: "",
  tattooDate: new Date().toISOString().slice(0, 10),
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

const TattooConsentFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [tattooDesignPreview, setTattooDesignPreview] = useState(null);
  const tattooDesignInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm((f) => ({ ...f, [name]: file }));
      if (file) {
        const url = URL.createObjectURL(file);
        setTattooDesignPreview(url);
      } else {
        setTattooDesignPreview(null);
      }
    } else {
      setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    }
  };

  // Clean up preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (tattooDesignPreview) {
        URL.revokeObjectURL(tattooDesignPreview);
      }
    };
  }, [tattooDesignPreview]);

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
      await submitTattooConsentForm(form, setLoading, setError);
      setSuccess("Consent submitted successfully!");
      setForm(initialForm);
      setTattooDesignPreview(null);
      if (tattooDesignInputRef.current) {
        tattooDesignInputRef.current.value = "";
      }
      setTimeout(() => navigate("/forms"), 500); // short delay for UX
    } catch (err) {
      // setError is already handled in submitTattooConsentForm
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-center py-16 px-2">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-black max-w-3xl w-full p-10 mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">Permanent Tattoo Consent Form</h2>
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

          {/* Tattoo Information */}
          <FormSection title="Tattoo Information">
            <div className="flex flex-col gap-2">
              <FormField
                label="Tattoo Design"
                name="tattooDesign"
                type="file"
                value={form.tattooDesign}
                onChange={handleChange}
                required
                accept="image/*"
                ref={tattooDesignInputRef}
              />
              {tattooDesignPreview && (
                <div className="mt-2">
                  <img src={tattooDesignPreview} alt="Tattoo Design Preview" className="max-w-xs max-h-48 object-contain border border-gray-300 rounded" />
                </div>
              )}
            </div>
            <FormField
              label="Tattoo Location"
              name="tattooLocation"
              type="text"
              value={form.tattooLocation}
              onChange={handleChange}
              required
              placeholder="Tattoo Location"
            />
            <FormField
              label="Tattoo Artist"
              name="tattooArtist"
              type="text"
              value={form.tattooArtist}
              onChange={handleChange}
              required
              placeholder="Tattoo Artist"
            />
            <FormField
              label="Date of Tattoo"
              name="tattooDate"
              type="date"
              value={form.tattooDate}
              onChange={handleChange}
              required
              placeholder="Date of Tattoo"
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
              question="2. Do you have any allergies (including to latex or ink)?"
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
            {consentStatementsTattoo.map((statement, idx) => (
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

export default TattooConsentFormPage; 