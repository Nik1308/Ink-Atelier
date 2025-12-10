import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from '../../../utils';
import FormField from '../components/FormField';
import FormSection from '../components/FormSection';
import RadioGroup from '../components/RadioGroup';
import SEO from '../../common/ui/SEO';
import { piercingTypes, piercingSubtypes } from '../../../utils/constants';
import { CUSTOMER_API_URL } from '../../../utils/apiUrls';

const initialForm = {
  name: "",
  dob: "",
  address: "",
  phone: "",
  email: "",
  heardAboutUs: "",
  referralPhone: "",
  isExistingCustomer: false,
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
  agree: false,
};

const PiercingConsentFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isValidPhone = (value) => /^\d{0,10}$/.test(value);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
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
    
    utils.fetchApi(CUSTOMER_API_URL, { method: "GET" })
      .then(customers => {
        const fullPhone = '+91' + form.phone;
        const existingCustomer = Array.isArray(customers)
          ? customers.find(c => c.phone === fullPhone)
          : null;
        if (existingCustomer) {
          setForm((f) => ({
            ...f,
            name: existingCustomer.name || "",
            dob: existingCustomer.dateOfBirth || "",
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
      if (form.name && form.dob) {
        setError(null);
      }
    } else if (step === 3) {
      if (form.piercingType && form.piercingSubtype && form.piercingArtist && form.piercingDate) {
        setError(null);
      }
    } else if (step === 4) {
      const healthFields = ['medications', 'allergies', 'medicalConditions', 'alcoholDrugs', 'pregnantNursing'];
      if (healthFields.every(field => form[field] && form[field].length > 0)) {
        setError(null);
      }
    }
  }, [step, form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep5()) {
      setError("You must agree to the consent statement.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await utils.submitPiercingConsentForm(form, setLoading, setError);
      setSuccess("Consent submitted successfully!");
      setForm(initialForm);
      setLoading(false);
      setStep(6);
      setTimeout(() => navigate("/forms"), 5000);
    } catch (err) {
      setLoading(false);
    }
  };

  // Validation functions for each step
  const validateStep1 = () => {
    return form.phone && form.phone.length === 10;
  };

  const validateStep2 = () => {
    // Only check mandatory fields: name, dob (email and address are optional)
    const baseFields = form.name && form.dob;
    const heardAboutUs = form.isExistingCustomer || form.heardAboutUs;
    const referralValid = form.isExistingCustomer || 
                         form.heardAboutUs !== 'friend-recommendation' || 
                         (form.heardAboutUs === 'friend-recommendation' && form.referralPhone);
    return baseFields && heardAboutUs && referralValid;
  };

  const validateStep3 = () => {
    return form.piercingType && form.piercingSubtype && form.piercingArtist && form.piercingDate;
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
        errorMessage = 'Please enter a valid 10-digit phone number.';
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
        errorMessage = 'Please fill in all required piercing details.';
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

  return (
    <>
      <SEO 
        title="Piercing Consent Form - Ink Atelier"
        description="Complete your piercing consent form online. Required legal document for all body piercing procedures at Ink Atelier. Safe and secure form submission."
        keywords="piercing consent form, body piercing waiver, piercing legal document, piercing consent online, ink atelier piercing consent, body piercing procedure consent"
        image="/assets/images/logo.jpg"
        url="https://inkatelier.in/piercing-consent"
        type="website"
      />
      <div className="w-full flex items-center px-8 pt-8 gap-4 bg-white" style={{ height: '6rem' }}>
        <img src="/assets/images/logo.jpg" alt="Ink Atelier Logo" className="w-20 h-20 object-contain rounded-full" style={{ flexShrink: 0 }} />
        <h2 className="text-xl font-serif font-bold text-center flex-1">Body Piercing Consent Form</h2>
        <div style={{ width: '5rem' }} />
      </div>
      <section className="flex flex-col items-center justify-center px-2" style={{ minHeight: 'calc(100vh - 6rem)' }}>
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center bg-white">
          {step === 1 && (
            <form onSubmit={e => {
              e.preventDefault();
              handlePhoneSubmit(e);
            }} className="flex flex-col gap-6 w-full max-w-[400px] mx-auto">
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
            <form className="flex flex-col gap-6 w-full max-w-[400px] mx-auto" onSubmit={e => {
              e.preventDefault();
              nextStep();
            }}>
              <FormSection>
                <FormField
                  label="Type of Piercing"
                  name="piercingType"
                  type="select"
                  value={form.piercingType}
                  onChange={e => {
                    handleChange(e);
                    setForm(f => ({ ...f, piercingSubtype: "" }));
                  }}
                  required
                  options={piercingTypes.map(type => ({ value: type, label: type }))}
                  placeholder="Select type"
                  inputClassName="w-full max-w-[400px]"
                />
                {form.piercingType && (
                  <FormField
                    label="Subtype"
                    name="piercingSubtype"
                    type="select"
                    value={form.piercingSubtype}
                    onChange={e => {
                      setForm(f => ({ ...f, piercingSubtype: e.target.value }));
                    }}
                    required
                    options={(piercingSubtypes[form.piercingType] || []).map(sub => ({ value: sub, label: sub }))}
                    placeholder="Select subtype"
                    inputClassName="w-full max-w-[400px]"
                  />
                )}
                <FormField label="Piercing Artist" name="piercingArtist" type="text" value={form.piercingArtist} onChange={handleChange} required placeholder="Piercing Artist" inputClassName="w-full max-w-[400px]" />
                <FormField label="Date of Piercing" name="piercingDate" type="date" value={form.piercingDate} onChange={handleChange} required placeholder="Date of Piercing" inputClassName="w-full max-w-[400px]" />
              </FormSection>
              {error && <div className="text-red-600 mt-2 text-center w-full text-sm">{error}</div>}
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-black rounded-lg font-semibold transition h-11 flex items-center justify-center text-base shadow-none">Back</button>
                <button type="submit" className="w-1/2 bg-white text-black border border-black rounded-lg font-normal transition h-12 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white">Next</button>
              </div>
            </form>
          )}
          {step === 4 && (
            <form className="flex flex-col gap-6 w-full max-w-[700px] mx-auto py-12" onSubmit={e => {
              e.preventDefault();
              nextStep();
            }}>
              <FormSection>
                <RadioGroup question="1. Are you currently taking any medications?" name="medications" value={form.medications} onChange={handleChange} required showTextarea={true} textareaName="medicationsList" textareaValue={form.medicationsList} textareaPlaceholder="If yes, please list" inputClassName="w-full max-w-[400px]" />
                <RadioGroup question="2. Do you have any allergies (including to latex or metals)?" name="allergies" value={form.allergies} onChange={handleChange} required showTextarea={true} textareaName="allergiesList" textareaValue={form.allergiesList} textareaPlaceholder="If yes, please list" inputClassName="w-full max-w-[400px]" />
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
              {/* Consent Fields */}
              <div className="font-bold text-lg mb-2 mt-4">Acknowledgement and Consent</div>
              <ul className="list-disc pl-6 text-left text-sm md:text-base text-black/90 mb-2">
                {utils.consentStatementsPiercing.map((statement, idx) => (
                  <li key={idx} className="mb-1">{statement}</li>
                ))}
              </ul>
              <label className="flex items-center gap-2 mt-2">
                <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} required inputClassName="w-full max-w-[400px]" />
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

export default PiercingConsentFormPage; 