// Homepage content and configuration
// Update this file to change all copy, images, and data

export const homepageContent = {
  // Header/Navbar
  header: {
    logo: "/assets/images/logo.jpg", // Logo image path
    logoText: "INK ATELIER", // Fallback text if image doesn't load
    navItems: [
      { label: "Services", link: "#services" },
      { label: "Portfolio", link: "#portfolio" },
      { label: "About", link: "#about" },
    ],
    bookAppointmentText: "Book",
    bookAppointmentLink: "/forms",
  },

  // Hero Section
  hero: {
    heading: "Where art meets precision",
    description: "Every tattoo we create is intentional — crafted with clean hands, sterile equipment, and a deep respect for your lived story. Your skin is sacred ground, and we honor it with technique rooted in care, confidence, and permanence.",
    primaryCta: "Book",
    primaryCtaLink: "/forms",
    secondaryCta: "Explore",
    secondaryCtaLink: "#portfolio",
    // Media items can be images or videos
    // Add your images to: public/assets/images/
    // Add your videos to: public/assets/videos/
    // For images: { type: 'image', url: '/assets/images/filename.jpg', alt: '...' }
    // For videos: { type: 'video', url: '/assets/videos/filename.mp4', poster: '/assets/images/thumbnail.jpg' (optional), alt: '...' }
    media: [
      {
        type: 'image',
        url: '/assets/images/dog-tattoo.jpg', // Add dog-tattoo.jpg to public/assets/images/
        alt: 'Black and grey realism tattoo of a dog portrait',
      },
      {
        type: 'image',
        url: '/assets/images/hero-2.jpg', // Add angel-tattoo.jpg to public/assets/images/
        alt: 'Black and grey tattoo of an angelic figure',
      },
      {
        type: 'video',
        url: '/assets/videos/hero-video.mov', // Add hero-video.mp4 to public/assets/videos/
        poster: '/assets/images/hero-video-poster.jpg', // Optional: Add thumbnail image to public/assets/images/
        alt: 'Tattoo studio video showcase',
      },
    ],
  },

  // Services Section
  services: {
    sectionLabel: "SERVICES",
    heading: "What We Do Best",
    description: "We specialize in custom tattoo and piercing work that reflects who you are. Every piece is created with clean technique, thoughtful design, and a deep respect for your story — ensuring results that feel personal, intentional, and timeless.",
    supportingLine: "From concept to aftercare, our artists guide you through every step with clarity, comfort, and care.",
    exploreText: "Explore All Services",
    exploreLink: "#services-detail",
    items: [
      {
        title: "CUSTOM TATTOOS",
        description: "Original, one-of-a-kind tattoo designs crafted in collaboration with you. Each piece is thoughtfully designed to align with your vision, style, and meaning — resulting in artwork that feels truly personal.",
        cta: "View Tattoo Services",
        ctaLink: "#custom-tattoos",
        // Multiple images for carousel - add as many as you want
        // Each image should have: { url: '/assets/images/filename.jpg', alt: '...' }
        images: [
          {
            url: '/assets/images/custom-tattoo-1.jpg',
            alt: 'Custom Tattoos - Design 1',
          },
          {
            url: '/assets/images/custom-tattoo-2.JPEG',
            alt: 'Custom Tattoos - Design 2',
          },
          {
            url: '/assets/images/custom-tattoo-3.jpg',
            alt: 'Custom Tattoos - Design 3',
          },
          // Add more images here:
          // { url: '/assets/images/custom-tattoo-2.jpg', alt: 'Custom Tattoos - Design 2' },
          // { url: '/assets/images/custom-tattoo-3.jpg', alt: 'Custom Tattoos - Design 3' },
        ],
      },
      {
        title: "PROFESSIONAL PIERCINGS",
        description: "Performed using industry-approved sterile techniques and high-quality jewelry. We focus on precision, safety, and comfort to ensure a clean experience and proper healing.",
        cta: "View Piercing Services",
        ctaLink: "#professional-piercings",
        images: [
          {
            url: '/assets/images/piercing-1.JPEG',
            alt: 'Professional Piercings 1',
          },
          {
            url: '/assets/images/piercing-2.JPEG',
            alt: 'Professional Piercings 2',
          },
          {
            url: '/assets/images/piercing-3.jpg',
            alt: 'Professional Piercings 3',
          },
          // Add more images here:
          // { url: '/assets/images/piercing-2.jpg', alt: 'Professional Piercings - Example 2' },
        ],
      },
      {
        title: "AFTERCARE & CONSULTATION",
        description: "Personalized consultations and clear aftercare guidance designed to support healing and preserve your tattoo or piercing for years to come.",
        cta: "Learn About Aftercare",
        ctaLink: "#aftercare-consultation",
        images: [
          {
            url: '/assets/images/consultation.jpg',
            alt: 'Aftercare and Consultation',
          },
          // Add more images here:
          // { url: '/assets/images/consultation-2.jpg', alt: 'Aftercare and Consultation - Example 2' },
        ],
      },
    ],
    // Detailed Services Section
    detailSection: {
      heading: "Our Craft & Expertise",
      description: "Discover our comprehensive range of tattoo and piercing services, each delivered with precision, care, and artistic excellence.",
      services: [
        {
          id: "custom-tattoos",
          title: "Custom Tattoo Design & Execution",
          description: "Our custom tattoos are designed from scratch, tailored to your ideas, style, and placement. We collaborate closely with you to ensure every detail is intentional and meaningful.",
          includes: [
            "One-on-one consultation",
            "Custom design process",
            "Precision tattooing with sterile equipment",
          ],
          cta: "Book a Tattoo Consultation",
          ctaLink: "#consultation",
          // Media can be either image or video
          // For image: { type: 'image', url: '/assets/images/filename.jpg', alt: '...' }
          // For video: { type: 'video', url: '/assets/videos/filename.mp4', poster: '/assets/images/thumbnail.jpg' (optional), alt: '...' }
          media: {
            type: 'video', // Videos go in detailSection
            url: '/assets/videos/custom-tattoo.MOV', // Add video to public/assets/videos/
            poster: '', // Optional: thumbnail image for video
            alt: 'Custom Tattoo Design Process',
          },
        },
        {
          id: "professional-piercings",
          title: "Safe & Professional Body Piercing",
          description: "All piercings are performed following strict hygiene protocols using sterilized equipment and premium jewelry for safe healing.",
          includes: [
            "Industry-approved sterilization",
            "Expert placement",
            "Aftercare instructions",
          ],
          cta: "Book a Piercing Appointment",
          ctaLink: "#consultation",
          media: {
            type: 'video', // Videos go in detailSection
            url: '/assets/videos/piercing.mp4', // Add video to public/assets/videos/
            poster: '', // Optional: thumbnail image for video
            alt: 'Professional Body Piercing',
          },
        },
        {
          id: "aftercare-consultation",
          title: "Tattoo & Piercing Aftercare Support",
          description: "We provide clear, personalized aftercare guidance to help your tattoo or piercing heal properly and retain its quality over time.",
          includes: [
            "Healing timeline guidance",
            "Product recommendations",
            "Follow-up support",
          ],
          cta: "Learn About Aftercare",
          ctaLink: "#aftercare-consultation",
          media: {
            type: 'video', // Videos go in detailSection
            url: '/assets/videos/consultation.mov', // Add video to public/assets/videos/
            poster: '/assets/images/consultation.jpg', // Optional: thumbnail image for video
            alt: 'Aftercare and Consultation',
          },
        },
      ],
    },
  },

  // About Section
  about: {
    sectionLabel: "About",
    heading: "Built on craft and respect",
    description: "We believe in the permanence of what we do. That means clean hands, sterile equipment, and artists who understand that your skin is sacred ground.",
    bulletPoints: [
      "Meticulous attention to detail",
      "Highest standards of hygiene",
      "Collaborative design process",
    ],
    ctaText: "Learn",
    ctaLink: "#about",
    // Media can be either image or video
    // For image: { type: 'image', url: '/assets/images/filename.jpg', alt: '...' }
    // For video: { type: 'video', url: '/assets/videos/filename.mp4', poster: '/assets/images/thumbnail.jpg' (optional), alt: '...' }
    media: {
      type: 'video', // Change to 'video' if you want to use a video
      url: '/assets/videos/about-us.MP4', // Add image to public/assets/images/ or use video path
      poster: '', // Optional: thumbnail image for video
      alt: 'About Ink Atelier',
    },
  },

  // Artists Section
  artists: {
    sectionLabel: "Artists",
    heading: "The hands behind it",
    subtext: "Each artist brings years of discipline and a steady hand to the work.",
    items: [
      {
        name: "Marcus Reid",
        role: "Lead tattoo artist",
        description: "Specializing in realism and portrait work",
        image: "https://picsum.photos/300/300?random=10",
        imageAlt: "Marcus Reid",
      },
      {
        name: "Rina Vasquez",
        role: "Piercing specialist",
        description: "Expert in all types of body piercings",
        image: "https://picsum.photos/300/300?random=11",
        imageAlt: "Rina Vasquez",
      },
      {
        name: "James Chan",
        role: "Tattoo artist",
        description: "Master of geometric and minimalist designs",
        image: "https://picsum.photos/300/300?random=12",
        imageAlt: "James Chan",
      },
      {
        name: "Sofia Morelli",
        role: "Tattoo artist",
        description: "Traditional and neo-traditional specialist",
        image: "https://picsum.photos/300/300?random=13",
        imageAlt: "Sofia Morelli",
      },
      {
        name: "David Park",
        role: "Piercing artist",
        description: "Focused on ear curation and body modifications",
        image: "https://picsum.photos/300/300?random=14",
        imageAlt: "David Park",
      },
      {
        name: "Eva Thompson",
        role: "Tattoo artist",
        description: "Fine line and delicate work expert",
        image: "https://picsum.photos/300/300?random=15",
        imageAlt: "Eva Thompson",
      },
      {
        name: "Lucas Hoffman",
        role: "Lead piercer",
        description: "Advanced piercing techniques and jewelry",
        image: "https://picsum.photos/300/300?random=16",
        imageAlt: "Lucas Hoffman",
      },
      {
        name: "Iris Bennett",
        role: "Tattoo artist",
        description: "Watercolor and abstract style specialist",
        image: "https://picsum.photos/300/300?random=17",
        imageAlt: "Iris Bennett",
      },
    ],
  },

  // Hiring Section
  hiring: {
    heading: "We're hiring",
    description: "Join a team that respects the craft and the client.",
    ctaText: "Apply",
    ctaLink: "#hiring",
  },

  // Portfolio Section
  portfolio: {
    heading: "Our work",
    subtext: "A collection of pieces that show what we do and how we do it.",
    images: [
      { src: "https://picsum.photos/400/400?random=20", alt: "Portfolio 1" },
      { src: "https://picsum.photos/400/400?random=21", alt: "Portfolio 2" },
      { src: "https://picsum.photos/400/400?random=22", alt: "Portfolio 3" },
      { src: "https://picsum.photos/400/400?random=23", alt: "Portfolio 4" },
      { src: "https://picsum.photos/400/400?random=24", alt: "Portfolio 5" },
      { src: "https://picsum.photos/400/400?random=25", alt: "Portfolio 6" },
    ],
  },

  // Testimonials
  testimonials: {
    items: [
      {
        rating: 5,
        text: "I came in with a rough idea and left with exactly what I needed. Marcus understood the vision before I could even explain it.",
        author: "Sarah Johnson",
        role: "Client",
        source: "Yelp",
        image: "https://picsum.photos/400/400?random=30",
        imageAlt: "Testimonial",
      },
    ],
  },

  // Final CTA Section
  finalCta: {
    heading: "Ready to make it permanent",
    subtext: "Book a consultation and let's talk about what you want to carry with you.",
    primaryCta: "Book",
    primaryCtaLink: "/forms",
    secondaryCta: "Portfolio",
    secondaryCtaLink: "#portfolio",
    image: "https://picsum.photos/800/600?random=40",
    imageAlt: "Final CTA Image",
  },

  // Footer
  footer: {
    logo: "/assets/images/logo.jpg", // Logo image path
    location: "764/A, 22nd cross road, Parangipalya Main Rd, 2nd Sector, HSR Layout, Bangalore - 560102",
    timing: "Monday - Sunday: 12:00 PM - 9:00 PM",
    instagramLink: "https://www.instagram.com/inkatelier/",
    copyright: "© 2025 Ink Atelier. All rights reserved.",
  },
};
