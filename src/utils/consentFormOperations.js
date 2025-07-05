import { TATTOO_CONSENT_FORM_API_URL, UPLOAD_IMAGE_API_URL, CUSTOMER_API_URL, PIERCING_CONSENT_FORM_API_URL, GENERATE_CONSENT_PDF_URL } from "./apiUrls";
import { fetchApi } from "./Fetch";

/**
 * Helper function to format phone number with +91 prefix
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  return phone.startsWith("+91") ? phone : `+91${phone}`;
};

/**
 * Helper function to handle customer lookup and creation/update
 * @param {object} customerData - Customer data from form
 * @param {function} setError - Error callback function
 * @returns {Promise<string>} - Customer ID
 */
const handleCustomerLookup = async (customerData, setError) => {
  try {
    const formattedPhone = formatPhoneNumber(customerData.phone);
    
    // Query all customers
    const customers = await fetchApi(CUSTOMER_API_URL, { method: "GET" });
    const existingCustomer = Array.isArray(customers) 
      ? customers.find(c => c.phone === formattedPhone)
      : null;

    if (existingCustomer) {
      // Update existing customer with address if provided
      if (customerData.address) {
        await fetchApi(`${CUSTOMER_API_URL}/${existingCustomer.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: customerData.address }),
        });
      }
      return existingCustomer.id;
    } else {
      // Create new customer
      const newCustomer = await fetchApi(CUSTOMER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerData.name,
          date_of_birth: customerData.dob,
          phone: formattedPhone,
          email: customerData.email,
          address: customerData.address,
        }),
      });
      return newCustomer.id;
    }
  } catch (error) {
    const errorMessage = "Customer lookup/creation failed: " + error.message;
    setError(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Helper function to upload image to Xano
 * @param {File} imageFile - Image file to upload
 * @param {function} setError - Error callback function
 * @returns {Promise<object>} - Upload response metadata
 */
const uploadImage = async (imageFile, setError) => {
  if (!imageFile) return null;
  
  try {
    const imageForm = new FormData();
    imageForm.append("content", imageFile);
    
    return await fetchApi(UPLOAD_IMAGE_API_URL, {
      method: "POST",
      body: imageForm,
    });
  } catch (error) {
    const errorMessage = "Image upload failed: " + error.message;
    setError(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Helper function to convert form boolean values to database format
 * @param {string} value - Form value ("yes"/"no")
 * @returns {boolean} - Boolean value
 */
const convertToBoolean = (value) => value === "yes";

/**
 * Helper function to create health information payload
 * @param {object} form - Form data
 * @returns {object} - Health information object
 */
const createHealthInfo = (form) => ({
  has_medications: convertToBoolean(form.medications),
  medications_list: form.medicationsList,
  has_allergies: convertToBoolean(form.allergies),
  allergies_list: form.allergiesList,
  has_medical_conditions: convertToBoolean(form.medicalConditions),
  medical_conditions_list: form.medicalConditionsList,
  alcohol_drugs: convertToBoolean(form.alcoholDrugs),
  pregnant_nursing: convertToBoolean(form.pregnantNursing),
});

/**
 * Submits the tattoo consent form, handling customer lookup/creation and image upload.
 * @param {object} form - The form data from the component state
 * @param {function} setLoading - Callback to set loading state
 * @param {function} setError - Callback to set error state
 * @returns {Promise<object>} - The API response from consent form submission
 */
export async function submitTattooConsentForm(form, setLoading, setError) {
  setLoading(true);
  setError(null);

  try {
    // Step 1: Handle customer lookup/creation
    const customerId = await handleCustomerLookup(form, setError);

    // Step 2: Upload image if provided
    const tattooDesignMeta = await uploadImage(form.tattooDesign, setError);

    // Step 3: Create consent form payload
    const healthInfo = createHealthInfo(form);
    const payload = {
      customer_id: customerId,
      tattoo_location: form.tattooLocation,
      tattoo_design: tattooDesignMeta,
      tattoo_artist: form.tattooArtist,
      tattoo_date: form.tattooDate,
      allergies: form.allergies === "yes" ? "Yes" : "No",
      medications: form.medications === "yes" ? "Yes" : "No",
      signed: !!form.agree,
      date_signed: new Date().toISOString(),
      agree: !!form.agree,
      ...healthInfo,
    };

    // Step 4: Submit consent form
    const response = await fetchApi(TATTOO_CONSENT_FORM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Step 5: Generate PDF and send via WhatsApp
    /*
    try {
      await fetchApi(GENERATE_CONSENT_PDF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: form,
          formType: "tattoo"
        }),
      });
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // Don't fail the entire submission if PDF generation fails
    }
    */ // PDF generation and WhatsApp sending is disabled for now

    setLoading(false);
    return response;
  } catch (error) {
    setLoading(false);
    // Error is already set by helper functions, just re-throw
    throw error;
  }
}

/**
 * Submits the piercing consent form, handling customer lookup/creation.
 * @param {object} form - The form data from the component state
 * @param {function} setLoading - Callback to set loading state
 * @param {function} setError - Callback to set error state
 * @returns {Promise<object>} - The API response from consent form submission
 */
export async function submitPiercingConsentForm(form, setLoading, setError) {
  setLoading(true);
  setError(null);

  try {
    // Step 1: Handle customer lookup/creation
    const customerId = await handleCustomerLookup(form, setError);

    // Step 2: Create consent form payload
    const healthInfo = createHealthInfo(form);
    const payload = {
      customer_id: customerId,
      piercing_type: form.piercingType,
      piercing_subtype: form.piercingSubtype,
      piercing_artist: form.piercingArtist,
      piercing_date: form.piercingDate,
      agree: !!form.agree,
      ...healthInfo,
    };

    // Step 3: Submit consent form
    const response = await fetchApi(PIERCING_CONSENT_FORM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Step 4: Generate PDF and send via WhatsApp
    try {
      await fetchApi(GENERATE_CONSENT_PDF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: form,
          formType: "piercing"
        }),
      });
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // Don't fail the entire submission if PDF generation fails
    }

    setLoading(false);
    return response;
  } catch (error) {
    setLoading(false);
    // Error is already set by helper functions, just re-throw
    throw error;
  }
} 