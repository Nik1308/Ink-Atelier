import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FormField, FormSection, RadioGroup, SEO, MedicalConditionModal } from '../../../shared';
import { CUSTOMER_API_URL } from '../../../shared/api';
import { fetchApi } from '../../../shared/utils/fetch';
import { normalizePhoneNumber, validateInternationalPhone } from '../../../shared/utils/phone';
import { submitTattooConsentForm } from '../../../shared/utils/consentFormOperations';
import { consentStatementsTattoo } from '../../../shared/constants';

function formatDateForInput(date) {
  if (!date) return '';
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

// Allow international phone format (with + and country code)
const isValidPhone = (value) => {
  if (!value) return true; // Allow empty during typing
  // Allow digits, +, spaces, hyphens, parentheses for international format
  return /^[\d\s\+\-\(\)]{0,20}$/.test(value);
};

const TattooConsentFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [tattooDesignPreview, setTattooDesignPreview] = useState(null);
  const tattooDesignInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [artistCodeVerified, setArtistCodeVerified] = useState(false);
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

  // Validation functions for each step
  const validateStep1 = () => {
    if (!form.phone) return false;
    // Support both old 10-digit format and new international format
    if (/^\d{10}$/.test(form.phone)) return true; // Old format
    return validateInternationalPhone(normalizePhoneNumber(form.phone) || form.phone);
  };

  const validateStep2 = () => {
    // Only check mandatory fields: name, dob (email and address are optional)
    const baseFields = form.name && form.dob;
    
    // For new customers, "heard about us" is required
    const heardAboutUs = form.isExistingCustomer || form.heardAboutUs;
    
    // For friend recommendation, referral phone is required
    const referralValid = form.isExistingCustomer || 
                         form.heardAboutUs !== 'friend-recommendation' || 
                         (form.heardAboutUs === 'friend-recommendation' && form.referralPhone);
    
    return baseFields && heardAboutUs && referralValid;
  };

  const validateStep3 = () => {
    return form.tattooDesign && form.tattooLocation && form.tattooArtist && form.tattooDate;
  };

  const validateStep4 = () => {
    const healthFields = ['medications', 'allergies', 'medicalConditions', 'alcoholDrugs', 'pregnantNursing'];
    return healthFields.every(field => form[field] && form[field].length > 0);
  };

  const validateStep5 = () => {
    return form.agree;
  };

  // Step navigation with validation
  const nextStep = () => {
    let isValid = false;
    let errorMessage = '';

    switch (step) {
      case 1:
        isValid = validateStep1();
        errorMessage = 'Please enter a valid phone number with country code (e.g., +919876543210 or 919876543210).';
        break;
      case 2:
        isValid = validateStep2();
        if (!form.name || !form.dob) {
          errorMessage = 'Please fill in all required fields (Name and Date of Birth).';
        } else if (!form.isExistingCustomer && !form.heardAboutUs) {
          errorMessage = 'Please select how you heard about us.';
        } else if (!form.isExistingCustomer && form.heardAboutUs === 'friend-recommendation' && !form.referralPhone) {
          errorMessage = "Please enter your friend's phone number.";
        }
        break;
      case 3:
        isValid = validateStep3();
        errorMessage = 'Please fill in all required tattoo details.';
        break;
      case 4:
        isValid = validateStep4();
        errorMessage = 'Please answer all health questions before proceeding.';
        break;
      case 5:
        isValid = validateStep5();
        errorMessage = 'You must agree to the consent statement.';
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      setError(errorMessage);
      return false;
    }

    setError(null);
    setStep((s) => Math.min(s + 1, 5));
    return true;
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Phone step logic - allow international format
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!isValidPhone(value)) return;
    setForm((f) => ({ ...f, phone: value }));
  };
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!validateStep1()) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError(null);
    setPhoneLoading(true);
    
    fetchApi(CUSTOMER_API_URL, { method: "GET" })
      .then(customers => {
        const normalizedPhone = normalizePhoneNumber(form.phone);
        if (!normalizedPhone) {
          setError("Invalid phone number format. Please enter with country code (e.g., +919876543210).");
          setPhoneLoading(false);
          return;
        }
        const existingCustomer = Array.isArray(customers)
          ? customers.find(c => c.phone === normalizedPhone)
          : null;
        if (existingCustomer) {
          setForm((f) => ({
            ...f,
            name: existingCustomer.name || "",
            dob: formatDateForInput(existingCustomer.dateOfBirth) || "",
            address: existingCustomer.address || "",
            email: existingCustomer.email || "",
            isExistingCustomer: true,
            heardAboutUs: existingCustomer.heardAboutUs || ""
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
        setPhoneLoading(false);
        setStep(2); // Directly go to step 2 after successful phone validation
      })
      .catch(error => {
        setError("Error looking up customer");
        setPhoneLoading(false);
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
      // Support both old 10-digit format and new international format
      const isValid = /^\d{10}$/.test(form.phone) || validateInternationalPhone(normalizePhoneNumber(form.phone) || form.phone);
      if (form.phone && isValid) setError(null);
    } else if (step === 2) {
      if (form.name && form.dob) {
        setError(null);
      }
    } else if (step === 3) {
      if (form.tattooDesign && form.tattooLocation && form.tattooArtist && form.tattooDate) {
        setError(null);
      }
    } else if (step === 4) {
      const healthFields = ['medications', 'allergies', 'medicalConditions', 'alcoholDrugs', 'pregnantNursing'];
      if (healthFields.every(field => form[field] && form[field].length > 0)) {
        setError(null);
      }
    }
  }, [step, form]);

  // Check if any medical condition is selected
  const hasMedicalCondition = () => {
    return form.medications === "yes" ||
           form.allergies === "yes" ||
           form.medicalConditions === "yes" ||
           form.alcoholDrugs === "yes" ||
           form.pregnantNursing === "yes";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep5()) {
      setError("You must agree to the consent statement.");
      return;
    }

    // Check for medical conditions
    if (hasMedicalCondition() && !artistCodeVerified) {
      setShowMedicalModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await submitTattooConsentForm(form, setLoading, setError);
      setSuccess("Consent submitted successfully!");
      setForm(initialForm);
      setTattooDesignPreview(null);
      setArtistCodeVerified(false);
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

  const handleCodeVerified = async () => {
    setArtistCodeVerified(true);
    setShowMedicalModal(false);
    
    // Submit the form after code verification
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await submitTattooConsentForm(form, setLoading, setError);
      setSuccess("Consent submitted successfully!");
      setForm(initialForm);
      setTattooDesignPreview(null);
      setArtistCodeVerified(false);
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
      <MedicalConditionModal
        open={showMedicalModal}
        onClose={() => setShowMedicalModal(false)}
        onCodeVerified={handleCodeVerified}
      />
      <SEO 
        title="Tattoo Consent Form - Ink Atelier | Online Tattoo Waiver & Booking Form"
        description="Complete your tattoo consent form online. Required legal document for all tattoo procedures at Ink Atelier. Safe and secure form submission. Book your tattoo appointment with our professional tattoo artists."
        keywords="tattoo consent form, tattoo waiver, tattoo legal document, tattoo consent online, ink atelier consent form, tattoo procedure consent, tattoo booking form, tattoo appointment form, custom tattoo consent, tattoo artist consent, tattoo safety form, tattoo medical form, tattoo consultation form, tattoo design consent"
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
              handlePhoneSubmit(e);
            }} className="flex flex-col gap-8 w-full items-center">
              <div className="w-full flex flex-col items-center gap-6">
                <div className="w-full max-w-[400px]">
                  <FormField
                    label=""
                    name="phone"
                    type="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="Phone number"
                    inputClassName="w-full"
                    containerClassName="w-full"
                  />
                </div>
                {error && <div className="text-red-600 text-center w-full text-sm">{error}</div>}
              </div>
              <div className="flex gap-4 w-full max-w-[400px] mt-8">
                <button 
                  type="submit" 
                  disabled={phoneLoading}
                  className="bg-black text-white rounded-lg font-semibold transition w-full h-12 flex items-center justify-center text-base shadow-none hover:bg-opacity-90 disabled:opacity-50"
                >
                  {phoneLoading ? 'Checking...' : 'Next'}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form className="flex flex-col gap-6 w-full max-w-[400px] mx-auto" onSubmit={e => {
              e.preventDefault();
              nextStep();
            }}>
              <FormField label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Full Name" inputClassName="w-full max-w-[400px]" />
              <FormField label="Date of Birth" name="dob" type="date" value={formatDateForInput(form.dob)} onChange={handleChange} required placeholder="Date of Birth" inputClassName="w-full max-w-[400px]" />
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