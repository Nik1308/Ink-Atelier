// Consent statements for both forms
export const consentStatementsTattoo = [
  "I acknowledge that I have been fully informed of the inherent risks associated with getting a tattoo, including but not limited to, infection, allergic reactions, scarring, and potential dissatisfaction with the design or placement.",
  "I confirm that the tattoo design, spelling, and placement have been approved by me before the procedure begins.",
  "I understand that the tattoo is permanent and may only be removed by surgical means, which can be costly and leave scars.",
  "I acknowledge that INK ATELIER and the tattoo artist are not responsible for the meaning or spelling of the symbols, words, or designs that I have provided or chosen.",
  "I confirm that I do not have any conditions that may impair healing and that I have disclosed all necessary medical information.",
  "I have been informed that the needles and inks used are within their expiry dates, and I have been shown the entire process. I understand that INK ATELIER uses a professional kit only.",
  "I agree to follow the aftercare instructions provided by the tattoo artist to ensure proper healing of my tattoo.",
  "I consent to the tattoo being photographed for INK ATELIER's portfolio, website, and social media, with the understanding that my identity will be kept confidential unless I give explicit permission otherwise.",
  "I release INK ATELIER, its owners, employees, and contractors from all liability, claims, demands, damages, costs, and expenses related to the tattoo procedure.",
  "I confirm that I am of legal age to receive a tattoo and that the information provided on this form is accurate and truthful."
];

export const consentStatementsPiercing = [
  "I acknowledge that I have been fully informed of the inherent risks associated with body piercing, including but not limited to, infection, allergic reactions, scarring, and potential dissatisfaction with the placement or jewelry.",
  "I confirm that the piercing location and jewelry have been approved by me before the procedure begins.",
  "I understand that body piercings can take several weeks to months to heal, depending on the location, and that I must follow the aftercare instructions provided to ensure proper healing.",
  "I have been informed that the needles and equipment used are sterile, single-use, and within their expiry dates. I have been shown the entire process, and I understand that INK ATELIER uses a professional kit only.",
  "I acknowledge that INK ATELIER and the piercing artist are not responsible for any complications that may arise if aftercare instructions are not followed or if the piercing is tampered with during the healing process.",
  "I consent to the piercing being photographed for INK ATELIER's portfolio, website, and social media, with the understanding that my identity will be kept confidential unless I give explicit permission otherwise.",
  "I release INK ATELIER, its owners, employees, and contractors from all liability, claims, demands, damages, costs, and expenses related to the piercing procedure.",
  "I confirm that I am of legal age to receive a body piercing and that the information provided on this form is accurate and truthful."
];

export const piercingTypes = [
  "Ear Piercings",
  "Nose Piercings",
  "Oral/Lip Piercings",
  "Tongue & Oral Cavity",
  "Eyebrow & Face",
  "Nipple Piercings",
  "Navel (Belly Button)",
  "Surface & Dermal Piercings"
];

export const piercingSubtypes = {
  "Ear Piercings": [
    "Lobe (Standard, Upper, Transverse, Stacked)",
    "Helix (Upper outer cartilage)",
    "Forward Helix",
    "Industrial (Two helix piercings connected by a bar)",
    "Tragus",
    "Anti-Tragus",
    "Daith (Inner cartilage fold)",
    "Rook (Inner cartilage ridge)",
    "Conch (Inner or outer)",
    "Snug",
    "Orbital (Two piercings connected by a ring)",
    "Flat"
  ],
  "Nose Piercings": [
    "Nostril (Standard)",
    "High Nostril",
    "Septum",
    "Bridge (Surface piercing across the nasal bridge)",
    "Nasallang (Goes through both nostrils and septum)"
  ],
  "Oral/Lip Piercings": [
    "Labret (Below the bottom lip)",
    "Vertical Labret",
    "Medusa/Philtrum (Center above the upper lip)",
    "Monroe (Upper lip, left side)",
    "Madonna (Upper lip, right side)",
    "Ashley (Single vertical piercing through lower lip)",
    "Snake Bites (Both sides of lower lip)",
    "Spider Bites (Two close piercings on one side of the lip)",
    "Angel Bites (Both sides of upper lip)",
    "Dahlia Bites (Corners of the mouth)",
    "Jestrum (Vertical upper lip)"
  ],
  "Tongue & Oral Cavity": [
    "Tongue Piercing (Midline)",
    "Horizontal Tongue Piercing",
    "Venom Bites (Double tongue piercings)",
    "Frenulum (Smiley) (Under upper lip)",
    "Frowny (Under lower lip)",
    "Tongue Web"
  ],
  "Eyebrow & Face": [
    "Eyebrow",
    "Anti-Eyebrow (Beside/under the eye)",
    "Bridge (Across the bridge of the nose)",
    "Cheek/Dimple",
    "Third Eye (Between brows, surface piercing)",
    "Teardrop"
  ],
  "Nipple Piercings": [
    "Standard (Horizontal, Vertical, or Diagonal)"
  ],
  "Navel (Belly Button)": [
    "Standard Navel (Top)",
    "Lower Navel",
    "Double (Top + Bottom)",
    "Floating Navel"
  ],
  "Surface & Dermal Piercings": [
    "Surface Piercings (Anywhere on flat skin – e.g., collarbone, hips, back, neck)",
    "Dermal Anchors (Single-point piercings, often with gems – e.g., chest, face, finger)"
  ]
};

// WhatsApp Aftercare and Review Message Templates (personalized)
export function getTattooAftercareMessage(clientName) {
  return `Hi ${clientName},\n\nThank you for choosing INK ATELIER for your tattoo! To ensure your new tattoo heals beautifully and lasts a lifetime, please follow these aftercare guidelines carefully:\n\n• Keep the tattooed area clean and dry for the first 7 days.\n• Always wash your hands thoroughly before touching your tattoo.\n• Clean the tattoo using dry tissue only. Avoid cotton, wet tissues, towels, or cloths, as they may irritate the area or introduce bacteria.\n\n• Apply a thin layer of a fragrance-free, alcohol-free moisturizer or tattoo-specific aftercare cream only before bathing. Keep the area dry throughout the day.\n\n• After 7 days, moisturize the tattooed area twice daily using the recommended gel or ointment.\n\n• Avoid wearing tight or abrasive clothing that may rub against the tattoo.\n• Do not soak the tattoo in water — avoid baths, hot tubs, pools, and prolonged swimming sessions.\n• Refrain from strenuous activities or workouts that may cause excessive sweating or friction in the tattooed area.\n\n• Protect the tattoo from exposure to harsh chemicals such as chlorine, bleach, or cleaning agents.\n\n• Do not pick, scratch, or peel any scabs or flaking skin that may appear during the healing process.\n\n• Follow any personalized aftercare advice provided by your tattoo artist for best results.\n\n• If you observe any signs of infection — such as persistent redness, swelling, warmth, or discharge — contact your tattoo artist or a healthcare professional immediately.\n\n—\n\nINK ATELIER\nYour skin is our canvas. Treat it with care for lasting art.✨`;
}

export function getPiercingAftercareMessage(clientName) {
  return `Hi ${clientName},\n\nThank you for trusting INK ATELIER with your new piercing! Please follow these professional aftercare instructions to ensure a safe and smooth healing process:\n\n1. Cleanliness:\n• Always wash your hands thoroughly before touching your piercing.\n• Clean the area gently with a saline solution or a piercing aftercare spray (such as surgical spirit) recommended by your piercer.\n\n2. Avoid Irritants:\n• Do not use alcohol, hydrogen peroxide, or ointments, as they can delay healing and cause irritation.\n• Keep the area free from lotions, makeup, and other chemical-based products.\n\n3. Handling:\n• Avoid touching or twisting the jewelry unnecessarily.\n• Do not sleep on the piercing to prevent pressure and irritation.\n\n4. Healing Time:\n• Follow the healing timeline advised by your piercer, as it may vary based on the piercing location.\n• Be patient and avoid changing the jewelry for at least 2 months.\n\n5. Clothing and Activities:\n• Opt for loose-fitting clothing to avoid friction around the pierced area.\n• Refrain from swimming in pools, hot tubs, lakes, or oceans during the initial healing phase.\n• Avoid gym workouts or activities that cause excessive sweating around the pierced area.\n\n6. Monitor for Infection:\n• Watch for signs of infection such as excessive redness, swelling, pain, or unusual discharge.\n• If you suspect an infection, contact your piercer immediately.\n\n7. Maintain Hygiene:\n• Continue cleaning the area as advised until it is fully healed.\n• Avoid over-cleaning, as it may irritate the piercing.\n\n—\n\nINK ATELIER\nYour safety and style are our priority.\nStay clean. Heal well. Shine bright! ✨`;
}

export function getReviewWhatsappMessage(clientName) {
  return `Thank you for visiting INK ATELIER! We hope you had a wonderful experience. If you enjoyed your time with us, we would truly appreciate your feedback in a review. Your words help us maintain high standards and inspire new clients to trust our work. 😊\n\nPlease take a moment to share your thoughts:\nINK ATELIER (Tattoo Studio)\nhttps://g.page/r/CVWso4E-rCEsEBI/review\n\nAnd don't forget to follow us on Instagram for updates and inspiration:\nhttps://www.instagram.com/_ink_atelier_/profilecard/?igsh=MWt2dzA2ejQyczJqdQ==\n\nThank you again for choosing us!`;
}

export function getAdvancePaymentConfirmationMessage({ clientName = '', appointmentDate = '', advanceAmount = '', dueAmount = '' }) {
  // Format date and day
  let dateStr = appointmentDate;
  let dayStr = '';
  if (appointmentDate) {
    const dateObj = new Date(appointmentDate);
    if (!isNaN(dateObj)) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  let approxPrice = '';
  if (advanceAmount && dueAmount) {
    const adv = Number(advanceAmount);
    const due = Number(dueAmount);
    const total = adv + due;
    approxPrice = `₹${total.toLocaleString()}`;
  } else if (advanceAmount) {
    approxPrice = `₹${Number(advanceAmount).toLocaleString()}`;
  } else if (dueAmount) {
    approxPrice = `₹${Number(dueAmount).toLocaleString()}`;
  }
  return `Hi${clientName ? ' ' + clientName : ''},\n\nThank you for choosing INK ATELIER!\n\nWe're happy to confirm your tattoo appointment for${dayStr ? ' ' + dayStr + ',' : ''} ${dateStr}.\n\nAppointment Details:\n• Advance Payment Received: ₹${advanceAmount ? Number(advanceAmount).toLocaleString() : ''} (non-refundable)\n• Approximate Price: ${approxPrice} (final price may vary based on size and design details)\n• Studio Location: HSR Layout, Bangalore\n\nOur team is committed to providing a professional, hygienic, and comfortable tattooing experience.\n\nWe look forward to seeing you on the ${dateStr.split(' ')[0]}! If there are any changes or updates, please let us know ahead of time.\n\nWarm regards,\nINK ATELIER\n📞 +91 9636 301 625 `;
} 