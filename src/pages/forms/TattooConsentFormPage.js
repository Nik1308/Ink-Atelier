import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { submitTattooConsentForm, consentStatementsTattoo } from "../../utils";
import { fetchApi } from "../../utils/Fetch";
import { CUSTOMER_API_URL } from "../../utils/apiUrls";
import FormField from "../../components/forms/FormField";
import FormSection from "../../components/forms/FormSection";
import RadioGroup from "../../components/forms/RadioGroup";
import SEO from "../../components/SEO/SEO";

const initialForm = {
  name: "",
  dob: "",
  address: "",
  phone: "",
  email: "",
  heardAboutUs: "",
  referralPhone: "",
  isExistingCustomer: false,
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

const isValidPhone = (value) => /^\d{0,10}$/.test(value);

const TattooConsentFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [tattooDesignPreview, setTattooDesignPreview] = useState(null);
  const tattooDesignInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (tattooDesignPreview) {
        URL.revokeObjectURL(tattooDesignPreview);
      }
      const file = files && files[0];
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

  // Step navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Phone step logic
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!isValidPhone(value)) return;
    setForm((f) => ({ ...f, phone: value }));
  };
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (form.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError(null);
    fetchApi(CUSTOMER_API_URL, { method: "GET" })
      .then(customers => {
        const fullPhone = '+91' + form.phone;
        const existingCustomer = Array.isArray(customers)
          ? customers.find(c => c.phone === fullPhone)
          : null;
        if (existingCustomer) {
          setForm((f) => ({
            ...f,
            name: existingCustomer.name || "",
            dob: existingCustomer.date_of_birth || "",
            address: existingCustomer.address || "",
            email: existingCustomer.email || "",
            isExistingCustomer: true,
            heardAboutUs: existingCustomer.heard_about_us || ""
          }));
        } else {
          setForm((f) => ({
            ...f,
            name: "",
            dob: "",
            address: "",
            email: "",
            isExistingCustomer: false,
            heardAboutUs: ""
          }));
        }
        nextStep();
      })
      .catch(error => {
        setError("Error looking up customer");
      });
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

  useEffect(() => {
    if (step === 1) {
      if (form.phone && form.phone.length === 10) setError(null);
    } else if (step === 2) {
      const base = form.name && form.dob && form.email;
      const heard = form.isExistingCustomer || form.heardAboutUs;
      const referral = form.isExistingCustomer || form.heardAboutUs !== 'friend-recommendation' || form.referralPhone;
      if (base && heard && referral) setError(null);
    } else if (step === 3) {
      if (form.tattooDesign && form.tattooLocation && form.tattooArtist && form.tattooDate) setError(null);
    } else if (step === 4) {
      const health = ['medications','allergies','medicalConditions','alcoholDrugs','pregnantNursing'].every(f => form[f] && form[f].length > 0);
      if (health) setError(null);
    }
  }, [step, form]);

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
      setLoading(false);
      if (tattooDesignInputRef.current) {
        tattooDesignInputRef.current.value = "";
      }
      setStep(6);
      setTimeout(() => navigate("/forms"), 5000);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Tattoo Consent Form - Ink Atelier"
        description="Complete your tattoo consent form online. Required legal document for all tattoo procedures at Ink Atelier. Safe and secure form submission."
        keywords="tattoo consent form, tattoo waiver, tattoo legal document, tattoo consent online, ink atelier consent form, tattoo procedure consent"
        image="/assets/images/logo.jpg"
        url="https://inkatelier.in/tattoo-consent"
        type="website"
      />
      <div className="w-full flex items-center px-8 pt-8 gap-4 bg-white" style={{ height: '6rem' }}>
        <img src="/assets/images/logo.jpg" alt="Ink Atelier Logo" className="w-20 h-20 object-contain rounded-full" style={{ flexShrink: 0 }} />
        <h2 className="text-xl font-serif font-bold text-center flex-1">Permanent Tattoo Consent Form</h2>
        <div style={{ width: '5rem' }} />
      </div>
      <section className="flex flex-col items-center justify-center px-2" style={{ minHeight: 'calc(100vh - 6rem)' }}>
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center bg-white">
          {step === 1 && (
            <form onSubmit={e => {
              e.preventDefault();
              // Validate phone number
              if (!form.phone || form.phone.length !== 10) {
                setError('Please enter a valid 10-digit phone number.');
                return;
              }
              setError(null);
              handlePhoneSubmit(e);
            }} className="flex flex-col gap-8 w-full items-center">
              <div className="w-full flex flex-col items-center gap-6">
                <div className="flex items-center w-full max-w-[400px] bg-white rounded-lg border border-black overflow-hidden">
                  <span className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold text-lg select-none">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    placeholder="10-digit mobile number"
                    className="flex-1 px-4 py-3 bg-white text-lg outline-none border-0"
                  />
                </div>
                {error && <div className="text-red-600 text-center w-full text-sm">{error}</div>}
              </div>
              <div className="flex gap-4 w-full max-w-[400px] mt-8">
                <button type="submit" className="bg-black text-white rounded-lg font-semibold transition w-full h-12 flex items-center justify-center text-base shadow-none hover:bg-opacity-90">Next</button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form className="flex flex-col gap-6 w-full max-w-[400px] mx-auto" onSubmit={e => {
              e.preventDefault();
              // Validate required fields for step 2
              if (!form.name || !form.dob || !form.email) {
                setError('Please fill in all required fields.');
                return;
              }
              if (!form.isExistingCustomer && !form.heardAboutUs) {
                setError('Please select how you heard about us.');
                return;
              }
              if (!form.isExistingCustomer && form.heardAboutUs === 'friend-recommendation' && !form.referralPhone) {
                setError("Please enter your friend's phone number.");
                return;
              }
              setError(null);
              nextStep();
            }}>
              <FormField label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Full Name" inputClassName="w-full max-w-[400px]" />
              <FormField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} required placeholder="Date of Birth" inputClassName="w-full max-w-[400px]" />
              <FormField label="Address" name="address" type="text" value={form.address} onChange={handleChange} placeholder="Address" inputClassName="w-full max-w-[400px]" />
              <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" inputClassName="w-full max-w-[400px]" />
              {!form.isExistingCustomer && (
                <>
                  <FormField label="How did you hear about us?" name="heardAboutUs" type="select" value={form.heardAboutUs} onChange={handleChange} required options={[
                    { value: 'social-media', label: 'Social Media (Instagram/Facebook)' },
                    { value: 'google-search', label: 'Google Search' },
                    { value: 'friend-recommendation', label: 'Friend/Family Recommendation' },
                    { value: 'walk-in', label: 'Walk-in' },
                    { value: 'online-advertisement', label: 'Online Advertisement' },
                    { value: 'other', label: 'Other' }
                  ]} inputClassName="w-full max-w-[400px]" />
                  {form.heardAboutUs === 'friend-recommendation' && (
                    <FormField label="Friend's Phone Number" name="referralPhone" type="tel" value={form.referralPhone} onChange={handleChange} required placeholder="Friend's phone number (10 digits)" inputClassName="w-full max-w-[400px]" />
                  )}
                </>
              )}
              {error && <div className="text-red-600 mt-2 text-center w-full text-sm">{error}</div>}
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-black rounded-lg font-semibold transition h-11 flex items-center justify-center text-base shadow-none">Back</button>
                <button type="submit" className="w-1/2 bg-white text-black border border-black rounded-lg font-normal transition h-12 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white">Next</button>
              </div>
            </form>
          )}
          {step === 3 && (
            tattooDesignPreview && typeof tattooDesignPreview === 'string' ? (
              <div className="flex flex-col md:flex-row items-start gap-8 w-full max-w-[700px] mx-auto">
                <form className="flex flex-col gap-6 w-full max-w-[400px]" onSubmit={e => {
                  e.preventDefault();
                  if (!form.tattooDesign || !form.tattooLocation || !form.tattooArtist || !form.tattooDate) {
                    setError('Please fill in all required tattoo details.');
                    return;
                  }
                  setError(null);
                  nextStep();
                }}>
                  <FormField label="Tattoo Design" name="tattooDesign" type="file" value={form.tattooDesign} onChange={handleChange} required accept="image/*" ref={tattooDesignInputRef} inputClassName="w-full max-w-[400px]" />
                  <FormField label="Tattoo Location" name="tattooLocation" type="text" value={form.tattooLocation} onChange={handleChange} required placeholder="Tattoo Location" inputClassName="w-full max-w-[400px]" />
                  <FormField label="Tattoo Artist" name="tattooArtist" type="text" value={form.tattooArtist} onChange={handleChange} required placeholder="Tattoo Artist" inputClassName="w-full max-w-[400px]" />
                  <FormField label="Date of Tattoo" name="tattooDate" type="date" value={form.tattooDate} onChange={handleChange} required placeholder="Date of Tattoo" inputClassName="w-full max-w-[400px]" />
                  {error && <div className="text-red-600 mt-2 text-center w-full text-sm">{error}</div>}
                  <div className="flex gap-4 mt-8">
                    <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-black rounded-lg font-semibold transition h-11 flex items-center justify-center text-base shadow-none">Back</button>
                    <button type="submit" className="w-1/2 bg-white text-black border border-black rounded-lg font-normal transition h-12 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white">Next</button>
                  </div>
                </form>
                <div className="w-full md:w-[180px] flex flex-col justify-center items-center mt-8">
                  <img src={tattooDesignPreview} alt="Tattoo Design Preview" className="max-w-[180px] max-h-[180px] object-contain border border-gray-300 rounded" />
                  {form.tattooDesign && (
                    <div className="mt-2 text-sm text-center break-all">
                      {form.tattooDesign.name || (typeof form.tattooDesign === 'string' ? form.tattooDesign : '')}
                    </div>
                  )}
                  <button type="button" className="mt-2 text-xs text-red-600 underline" onClick={() => {
                    if (tattooDesignPreview) URL.revokeObjectURL(tattooDesignPreview);
                    setForm(f => ({ ...f, tattooDesign: null }));
                    setTattooDesignPreview(null);
                    if (tattooDesignInputRef.current) tattooDesignInputRef.current.value = '';
                  }}>Remove</button>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-6 w-full max-w-[400px] mx-auto" onSubmit={e => {
                e.preventDefault();
                if (!form.tattooDesign || !form.tattooLocation || !form.tattooArtist || !form.tattooDate) {
                  setError('Please fill in all required tattoo details.');
                  return;
                }
                setError(null);
                nextStep();
              }}>
                <FormField label="Tattoo Design" name="tattooDesign" type="file" value={form.tattooDesign} onChange={handleChange} required accept="image/*" ref={tattooDesignInputRef} inputClassName="w-full max-w-[400px]" />
                <FormField label="Tattoo Location" name="tattooLocation" type="text" value={form.tattooLocation} onChange={handleChange} required placeholder="Tattoo Location" inputClassName="w-full max-w-[400px]" />
                <FormField label="Tattoo Artist" name="tattooArtist" type="text" value={form.tattooArtist} onChange={handleChange} required placeholder="Tattoo Artist" inputClassName="w-full max-w-[400px]" />
                <FormField label="Date of Tattoo" name="tattooDate" type="date" value={form.tattooDate} onChange={handleChange} required placeholder="Date of Tattoo" inputClassName="w-full max-w-[400px]" />
                {error && <div className="text-red-600 mt-2 text-center w-full text-sm">{error}</div>}
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-black rounded-lg font-semibold transition h-11 flex items-center justify-center text-base shadow-none">Back</button>
                  <button type="submit" className="w-1/2 bg-white text-black border border-black rounded-lg font-normal transition h-12 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white">Next</button>
                </div>
              </form>
            )
          )}
          {step === 4 && (
            <form className="flex flex-col gap-6 w-full max-w-[700px] mx-auto py-12" onSubmit={e => {
              e.preventDefault();
              // Check all required health fields before proceeding
              const requiredFields = [
                'medications',
                'allergies',
                'medicalConditions',
                'alcoholDrugs',
                'pregnantNursing',
              ];
              const allAnswered = requiredFields.every(f => form[f] && form[f].length > 0);
              if (!allAnswered) {
                setError('Please answer all health questions before proceeding.');
                return;
              }
              setError(null);
              nextStep();
            }}>
              <FormSection>
                <RadioGroup question="1. Are you currently taking any medications?" name="medications" value={form.medications} onChange={handleChange} required showTextarea={true} textareaName="medicationsList" textareaValue={form.medicationsList} textareaPlaceholder="If yes, please list" inputClassName="w-full max-w-[400px]" />
                <RadioGroup question="2. Do you have any allergies (including to latex or ink)?" name="allergies" value={form.allergies} onChange={handleChange} required showTextarea={true} textareaName="allergiesList" textareaValue={form.allergiesList} textareaPlaceholder="If yes, please list" inputClassName="w-full max-w-[400px]" />
                <RadioGroup question="3. Do you have any medical conditions (e.g., diabetes, epilepsy, heart conditions, etc.)?" name="medicalConditions" value={form.medicalConditions} onChange={handleChange} required showTextarea={true} textareaName="medicalConditionsList" textareaValue={form.medicalConditionsList} textareaPlaceholder="If yes, please specify" inputClassName="w-full max-w-[400px]" />
                <RadioGroup question="4. Have you consumed alcohol or any drugs in the past 24 hours?" name="alcoholDrugs" value={form.alcoholDrugs} onChange={handleChange} required inputClassName="w-full max-w-[400px]" />
                <RadioGroup question="5. Are you pregnant or nursing?" name="pregnantNursing" value={form.pregnantNursing} onChange={handleChange} required inputClassName="w-full max-w-[400px]" />
              </FormSection>
              {error && <div className="text-red-600 mt-2 text-center w-full text-sm">{error}</div>}
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-black rounded-lg font-semibold transition h-11 flex items-center justify-center text-base shadow-none">Back</button>
                <button type="submit" className="w-1/2 bg-white text-black border border-black rounded-lg font-normal transition h-12 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white">Next</button>
              </div>
            </form>
          )}
          {step === 5 && (
            <form className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto py-12" onSubmit={handleSubmit}>
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
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-black rounded-lg font-semibold transition h-11 flex items-center justify-center text-base shadow-none">Back</button>
                <button type="submit" className="w-1/2 bg-white text-black border border-black rounded-lg font-normal transition h-12 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Consent"}
                </button>
              </div>
              {error && <div className="text-red-600 mt-4 text-center w-full text-sm">{error}</div>}
              {success && <div className="text-green-700 mt-4 text-center w-full text-sm">{success}</div>}
            </form>
          )}
          {step === 6 && (
            <div className="flex flex-col items-center justify-center w-full py-24">
              <div className="text-green-700 text-2xl font-bold text-center mb-4">{success}</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TattooConsentFormPage; 