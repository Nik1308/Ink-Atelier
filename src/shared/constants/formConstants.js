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

// Artist code for overriding medical condition restrictions
// This is a 6-digit code that artists can use to submit forms with medical conditions
export const ARTIST_OVERRIDE_CODE = process.env.REACT_APP_ARTIST_OVERRIDE_CODE || '724072';

