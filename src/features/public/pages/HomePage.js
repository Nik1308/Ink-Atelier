import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { homepageContent } from '../../../shared/data/homepageContent';
import Header from '../../../shared/components/layout/Header';
import Footer from '../../../shared/components/layout/Footer';
import SEO from '../../../shared/components/ui/SEO';
import { fetchInstagramPosts } from '../../../shared/utils/instagram';
import LoadingSpinner from '../../../shared/components/ui/LoadingSpinner';

const HomePage = () => {
  const {
    hero,
    services,
    about,
    artists,
    hiring,
    portfolio,
    testimonials,
    finalCta,
  } = homepageContent;

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxVideo, setLightboxVideo] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loadingInstagram, setLoadingInstagram] = useState(true);
  const [instagramError, setInstagramError] = useState(null);
  
  // Consultation form state
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    phone: '',
  });
  const [consultationError, setConsultationError] = useState('');

  // Fetch Instagram posts on component mount (only once)
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    const loadInstagramPosts = async () => {
      try {
        setLoadingInstagram(true);
        setInstagramError(null);
        const posts = await fetchInstagramPosts(12);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setInstagramPosts(posts);
        }
      } catch (error) {
        console.error('Failed to load Instagram posts:', error);
        // Only update state if component is still mounted
        if (isMounted) {
          setInstagramError(error.message);
          setInstagramPosts([]);
        }
      } finally {
        if (isMounted) {
          setLoadingInstagram(false);
        }
      }
    };

    loadInstagramPosts();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  // Comprehensive SEO keywords for tattoo and piercing with location-based terms
  const seoKeywords = [
    // General keywords
    'tattoo studio', 'tattoo artist', 'tattoo shop', 'tattoo parlor', 'custom tattoo', 'tattoo design',
    'professional tattoo', 'tattoo consultation', 'tattoo booking', 'tattoo services',
    'piercing studio', 'body piercing', 'ear piercing', 'professional piercing', 'piercing artist',
    'body art', 'tattoo and piercing', 'tattoo near me', 'piercing near me',
    'traditional tattoo', 'realism tattoo', 'geometric tattoo', 'fine line tattoo', 'watercolor tattoo',
    'tattoo aftercare', 'piercing aftercare', 'tattoo safety', 'sterile tattoo', 'hygienic tattoo',
    'ink atelier', 'tattoo ink', 'body modification', 'tattoo removal', 'tattoo touch up',
    'custom tattoo design', 'tattoo portfolio', 'tattoo gallery', 'tattoo inspiration',
    // Location-based keywords for Bangalore
    'tattoo studio in bangalore', 'tattoo artist in bangalore', 'tattoo shop in bangalore', 'tattoo parlor in bangalore',
    'best tattoo studio in bangalore', 'tattoo studio bangalore', 'tattoo artist bangalore',
    'piercing studio in bangalore', 'body piercing in bangalore', 'piercing artist in bangalore',
    'tattoo and piercing bangalore', 'tattoo near me bangalore', 'piercing near me bangalore',
    'custom tattoo bangalore', 'professional tattoo bangalore', 'tattoo consultation bangalore',
    'tattoo booking bangalore', 'ink atelier bangalore', 'tattoo studio koramangala',
    'tattoo studio indiranagar', 'tattoo studio mg road', 'tattoo studio whitefield',
    'tattoo studio jayanagar', 'tattoo studio hsr layout', 'tattoo studio btm layout'
  ].join(', ');

  // Structured Data for Local Business with Bangalore location
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    name: 'Ink Atelier - Tattoo Studio in Bangalore',
    description: 'Premium tattoo and piercing studio in Bangalore offering custom designs, traditional styles, and professional body art services. Best tattoo artists in Bangalore.',
    url: 'https://inkatelier.in',
    logo: 'https://inkatelier.in/assets/images/logo.jpg',
    image: 'https://inkatelier.in/assets/images/logo.jpg',
    telephone: '+91-9636301625',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '764/A, 22nd cross road, Parangipalya Main Rd, 2nd Sector, HSR Layout', // Add street address when available
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560102', // Add postal code when available
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '12.90898', // Bangalore approximate coordinates - update with exact location
      longitude: '77.6422817'
    },
    areaServed: {
      '@type': 'City',
      name: 'Bangalore',
      sameAs: 'https://en.wikipedia.org/wiki/Bangalore'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '12:00',
        closes: '21:00'
      }
    ],
    servesCuisine: false,
    hasMap: 'https://inkatelier.in',
    sameAs: [
      'https://www.instagram.com/inkatelier/',
      'https://www.facebook.com/inkatelier/'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '240'
    },
    offers: {
      '@type': 'Offer',
      name: 'Tattoo and Piercing Services in Bangalore',
      description: 'Custom tattoo designs and professional body piercing services in Bangalore'
    }
  };

  // Additional Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ink Atelier',
    url: 'https://inkatelier.in',
    logo: 'https://inkatelier.in/assets/images/logo.jpg',
    description: 'Premium tattoo and piercing studio specializing in custom body art and professional piercing services.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi', 'Kannada']
    },
    sameAs: [
      'https://www.instagram.com/inkatelier/',
      'https://www.facebook.com/inkatelier/'
    ]
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ink Atelier',
    url: 'https://inkatelier.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://inkatelier.in/?s={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <SEO 
        title="Custom Tattoo Studio in Bangalore | Professional Tattoo & Piercing Services | Ink Atelier"
        description="Ink Atelier is a premium tattoo and piercing studio in Bangalore offering custom tattoo designs, professional body piercing, tattoo consultation, and expert aftercare. Experienced tattoo artists near you. Book your appointment today."
        keywords={seoKeywords}
        url="https://inkatelier.in"
        type="website"
        structuredData={[structuredData, organizationSchema, websiteSchema]}
      />
      
      <div className="min-h-screen bg-black text-white">
        <Header />

        {/* Hero Section */}
        <section className="w-full py-20 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  {hero.heading}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                  {hero.description}
                </p>
                <div className="flex gap-4">
                  <a
                    href="#consultation"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector('#consultation');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
                  >
                    {hero.primaryCta}
                  </a>
                  <a
                    href={hero.secondaryCtaLink}
                    onClick={(e) => {
                      if (hero.secondaryCtaLink.startsWith('#')) {
                        e.preventDefault();
                        const element = document.querySelector(hero.secondaryCtaLink);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="px-8 py-3 bg-transparent text-white border border-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all"
                  >
                    {hero.secondaryCta}
                  </a>
                </div>
              </div>

              {/* Right: Media Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Large media item (left, spans 2 rows) */}
                <div className="col-span-1 row-span-2">
                  <div className="w-full h-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-900">
                    {hero.media && hero.media[0] ? (
                      hero.media[0].type === 'video' ? (
                        <video
                          src={hero.media[0].url}
                          poster={hero.media[0].poster}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          loading="lazy"
                          onError={(e) => {
                            console.error('Video failed to load:', hero.media[0].url);
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={hero.media[0].url}
                          alt={hero.media[0].alt || "Professional tattoo artist working on custom tattoo design"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/600x800/1a1a1a/ffffff?text=Hero+1';
                          }}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No media
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Small media item 1 (top right) */}
                <div className="col-span-1">
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-900">
                    {hero.media && hero.media[1] ? (
                      hero.media[1].type === 'video' ? (
                        <video
                          src={hero.media[1].url}
                          poster={hero.media[1].poster}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          loading="lazy"
                          onError={(e) => {
                            console.error('Video failed to load:', hero.media[1].url);
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={hero.media[1].url}
                          alt={hero.media[1].alt || "Tattoo studio interior with professional equipment"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x300/1a1a1a/ffffff?text=Hero+2';
                          }}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No media
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Small media item 2 (bottom right) */}
                <div className="col-span-1">
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-900">
                    {hero.media && hero.media[2] ? (
                      hero.media[2].type === 'video' ? (
                        <video
                          src={hero.media[2].url}
                          poster={hero.media[2].poster}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          loading="lazy"
                          onError={(e) => {
                            console.error('Video failed to load:', hero.media[2].url);
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={hero.media[2].url}
                          alt={hero.media[2].alt || "Body piercing and tattoo art showcase"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x300/1a1a1a/ffffff?text=Hero+3';
                          }}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No media
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - What We Do Best */}
        <section id="services" className="w-full py-20 md:py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
              <div className="lg:col-span-1">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                  {services.sectionLabel}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {services.heading}
                </h2>
              </div>
              <div className="lg:col-span-2">
                <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                  {services.description}
                </p>
                {services.supportingLine && (
                  <p className="text-base text-gray-400 mb-6 leading-relaxed">
                    {services.supportingLine}
                  </p>
                )}
                <a
                  href={services.exploreLink}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(services.exploreLink);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-medium"
                >
                  {services.exploreText}
                  <FiArrowRight />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.items.map((service, index) => (
                <article key={index} className="space-y-4">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-900 relative">
                    {service.images && service.images.length > 0 ? (
                      service.images.length > 1 ? (
                        // Multiple images - use Swiper carousel
                        <Swiper
                          modules={[Navigation, Pagination]}
                          navigation={true}
                          pagination={{ clickable: true }}
                          loop={true}
                          className="w-full h-full"
                        >
                          {service.images.map((image, imgIndex) => (
                            <SwiperSlide key={imgIndex}>
                              <img
                                src={image.url}
                                alt={image.alt || `${service.title} - ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src = `https://placehold.co/400x500/1a1a1a/ffffff?text=${service.title}`;
                                }}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        // Single image - no carousel needed
                        <img
                          src={service.images[0].url}
                          alt={service.images[0].alt || service.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/400x500/1a1a1a/ffffff?text=${service.title}`;
                          }}
                        />
                      )
                    ) : (
                      // Fallback for old media structure (backward compatibility)
                      service.media ? (
                        service.media.type === 'video' ? (
                          <video
                            src={service.media.url}
                            poster={service.media.poster}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            loading="lazy"
                            onError={(e) => {
                              console.error('Video failed to load:', service.media.url);
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={service.media.url}
                            alt={service.media.alt || `${service.title}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/400x500/1a1a1a/ffffff?text=${service.title}`;
                            }}
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No media
                        </div>
                      )
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                  {service.cta && (
                    <a
                      href={service.ctaLink}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.querySelector(service.ctaLink);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-medium text-sm"
                    >
                      {service.cta}
                      <FiArrowRight size={16} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Services Detail Section */}
        <section id="services-detail" className="w-full py-20 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                SERVICES
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {services.detailSection.heading}
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {services.detailSection.description}
              </p>
            </div>

            <div className="space-y-24 md:space-y-32">
              {services.detailSection.services.map((service, index) => (
                <article
                  key={service.id}
                  id={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Media (Image or Video) */}
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-900">
                      {service.media ? (
                        service.media.type === 'video' ? (
                          <video
                            src={service.media.url}
                            poster={service.media.poster}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            loading="lazy"
                            onError={(e) => {
                              console.error('Video failed to load:', service.media.url);
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={service.media.url}
                            alt={service.media.alt || service.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/600x700/1a1a1a/ffffff?text=${service.title}`;
                            }}
                          />
                        )
                      ) : (
                        // Fallback for old image property (backward compatibility)
                        <img
                          src={service.image}
                          alt={service.imageAlt || service.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/600x700/1a1a1a/ffffff?text=${service.title}`;
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      {service.title}
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-3">
                      <p className="text-white font-semibold">Includes:</p>
                      <ul className="space-y-2">
                        {service.includes.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <span className="text-white mt-1">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={service.ctaLink}
                      onClick={(e) => {
                        if (service.ctaLink.startsWith('#')) {
                          e.preventDefault();
                          const element = document.querySelector(service.ctaLink);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
                    >
                      {service.cta}
                      <FiArrowRight />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-20 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                    {about.sectionLabel}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    {about.heading}
                  </h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {about.description}
                </p>
                <ul className="space-y-3">
                  {about.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-white mt-1">•</span>
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={about.ctaLink}
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-medium"
                >
                  {about.ctaText}
                  <FiArrowRight />
                </a>
              </div>

              {/* Right: Media (Image or Video) */}
              <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-900">
                {about.media ? (
                  about.media.type === 'video' ? (
                    <video
                      src={about.media.url}
                      poster={about.media.poster}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      loading="lazy"
                      onError={(e) => {
                        console.error('Video failed to load:', about.media.url);
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={about.media.url}
                      alt={about.media.alt || 'About Ink Atelier'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x700/1a1a1a/ffffff?text=About';
                      }}
                    />
                  )
                ) : (
                  // Fallback for old image property (backward compatibility)
                  <img
                    src={about.image}
                    alt={about.imageAlt || 'About Ink Atelier'}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x700/1a1a1a/ffffff?text=About';
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Artists Section */}
        {/* <section id="artists" className="w-full py-20 md:py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                {artists.sectionLabel}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {artists.heading}
              </h2>
              <p className="text-lg text-gray-300">
                {artists.subtext}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {artists.items.map((artist, index) => (
                <article key={index} className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-700">
                    <img
                      src={artist.image}
                      alt={`${artist.name} - ${artist.role} at Ink Atelier`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/300x300/1a1a1a/ffffff?text=${encodeURIComponent(artist.name)}`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {artist.role}
                    </p>
                    <p className="text-sm text-gray-300 mb-3">
                      {artist.description}
                    </p>
                    <div className="flex justify-center gap-3">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label={`${artist.name} Instagram`}>
                        <FiInstagram size={16} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label={`${artist.name} Facebook`}>
                        <FiFacebook size={16} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label={`${artist.name} Twitter`}>
                        <FiTwitter size={16} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section> */}

        {/* Hiring Section */}
        {/* <section id="hiring" className="w-full py-20 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {hiring.heading}
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              {hiring.description}
            </p>
            <Link
              to={hiring.ctaLink}
              className="inline-block px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              {hiring.ctaText}
            </Link>
          </div>
        </section> */}

        {/* Portfolio Section - Instagram Feed */}
        <section id="portfolio" className="w-full py-20 md:py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {portfolio.heading}
              </h2>
              <p className="text-lg text-gray-300">
                {portfolio.subtext}
              </p>
            </div>

            {loadingInstagram ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : instagramError ? (
              <div className="text-center py-20">
                <p className="text-gray-400 mb-4">Unable to load Instagram posts</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {portfolio.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setLightboxImage(image)}
                    >
                      <img
                        src={image.src}
                        alt={`${image.alt} - Tattoo portfolio gallery`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/400x400/1a1a1a/ffffff?text=Portfolio+${index + 1}`;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : instagramPosts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {instagramPosts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    onClick={() => {
                      if (post.mediaType === 'VIDEO' && post.videoUrl) {
                        setLightboxVideo({ src: post.videoUrl, alt: post.caption || 'Instagram video' });
                      } else {
                        setLightboxImage({ src: post.imageUrl, alt: post.caption || 'Instagram post' });
                      }
                    }}
                  >
                    {post.mediaType === 'VIDEO' && post.videoUrl ? (
                      <video
                        src={post.videoUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                        loading="lazy"
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                        onError={(e) => {
                          // Fallback to thumbnail if video fails to load
                          const img = document.createElement('img');
                          img.src = post.imageUrl;
                          img.className = 'w-full h-full object-cover';
                          e.target.parentNode.replaceChild(img, e.target);
                        }}
                      />
                    ) : (
                      <img
                        src={post.imageUrl}
                        alt={post.caption || 'Instagram post from Ink Atelier'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x400/1a1a1a/ffffff?text=Instagram+Post';
                        }}
                      />
                    )}
                    {post.mediaType === 'VIDEO' && (
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <FiInstagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Fallback to static images if no Instagram posts
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setLightboxImage(image)}
                  >
                    <img
                      src={image.src}
                      alt={`${image.alt} - Tattoo portfolio gallery`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x400/1a1a1a/ffffff?text=Portfolio+${index + 1}`;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        {(lightboxImage || lightboxVideo) && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setLightboxImage(null);
              setLightboxVideo(null);
            }}
          >
            <button
              onClick={() => {
                setLightboxImage(null);
                setLightboxVideo(null);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 text-4xl"
              aria-label="Close lightbox"
            >
              ×
            </button>
            {lightboxVideo ? (
              <video
                src={lightboxVideo.src}
                controls
                autoPlay
                loading="lazy"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                Your browser does not support the video tag.
              </video>
            ) : lightboxImage ? (
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                loading="lazy"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            ) : null}
          </div>
        )}

        {/* Testimonials Section */}
        {/* <section id="testimonials" className="w-full py-20 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={testimonials.items[currentTestimonial].image}
                  alt={`${testimonials.items[currentTestimonial].author} testimonial`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x400/1a1a1a/ffffff?text=Testimonial';
                  }}
                />
              </div>

              <div className="space-y-6">
                <div className="flex gap-1" aria-label={`${testimonials.items[currentTestimonial].rating} star rating`}>
                  {[...Array(testimonials.items[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-white text-2xl" aria-hidden="true">
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl text-white leading-relaxed">
                  "{testimonials.items[currentTestimonial].text}"
                </blockquote>
                <div>
                  <p className="text-white font-semibold text-lg">
                    {testimonials.items[currentTestimonial].author}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {testimonials.items[currentTestimonial].role}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {testimonials.items[currentTestimonial].source}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentTestimonial(prev => Math.max(0, prev - 1))}
                    className="p-2 border border-gray-700 rounded hover:border-white transition-colors"
                    disabled={currentTestimonial === 0}
                    aria-label="Previous testimonial"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
                    {testimonials.items.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentTestimonial(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentTestimonial ? 'bg-white' : 'bg-gray-600'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                        aria-selected={i === currentTestimonial}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentTestimonial(prev => Math.min(testimonials.items.length - 1, prev + 1))}
                    className="p-2 border border-gray-700 rounded hover:border-white transition-colors"
                    disabled={currentTestimonial === testimonials.items.length - 1}
                    aria-label="Next testimonial"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Final CTA Section - Book Consultation */}
        <section id="consultation" className="w-full py-20 md:py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Left: Text Content */}
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight">
                  {finalCta.heading}
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg">
                  {finalCta.subtext}
                </p>
              </div>

              {/* Right: Consultation Form */}
              <div className="w-full max-w-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setConsultationError('');
                    
                    // Validate form
                    if (!consultationForm.name.trim()) {
                      setConsultationError('Please enter your name');
                      return;
                    }
                    
                    if (!consultationForm.phone.trim()) {
                      setConsultationError('Please enter your phone number');
                      return;
                    }
                    
                    // Format phone number (remove spaces, ensure it starts with +91 or has country code)
                    let phoneNumber = consultationForm.phone.trim().replace(/\s+/g, '');
                    if (!phoneNumber.startsWith('+')) {
                      // If no country code, assume +91 for India
                      if (phoneNumber.startsWith('0')) {
                        phoneNumber = '+91' + phoneNumber.substring(1);
                      } else if (phoneNumber.length === 10) {
                        phoneNumber = '+91' + phoneNumber;
                      } else {
                        phoneNumber = '+91' + phoneNumber;
                      }
                    }
                    
                    // Create WhatsApp message
                    const message = `Hi, I'm ${consultationForm.name.trim()}. I'd like to book a consultation for a tattoo/piercing. My phone number is ${phoneNumber}.`;
                    
                    // Encode message for URL
                    const encodedMessage = encodeURIComponent(message);
                    
                    // Open WhatsApp (phone number: +91 9636 301 625, remove + and spaces for WhatsApp URL)
                    // Using wa.me with the message parameter will open WhatsApp with the message ready to send
                    const whatsappUrl = `https://wa.me/919636301625?text=${encodedMessage}`;
                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                    
                    // Reset form
                    setConsultationForm({ name: '', phone: '' });
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="consultation-name" className="block text-white text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="consultation-name"
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="consultation-phone" className="block text-white text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="consultation-phone"
                      value={consultationForm.phone}
                      onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  {consultationError && (
                    <p className="text-red-400 text-sm">{consultationError}</p>
                  )}
                  
                  <button
                    type="submit"
                    className="block w-full text-center px-8 py-3 bg-transparent text-white border border-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all text-base"
                  >
                    {finalCta.primaryCta}
                  </button>
                  
                  {/* <a
                    href={finalCta.secondaryCtaLink}
                    onClick={(e) => {
                      if (finalCta.secondaryCtaLink.startsWith('#')) {
                        e.preventDefault();
                        const element = document.querySelector(finalCta.secondaryCtaLink);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="block w-full text-center px-8 py-3 bg-transparent text-white border border-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all text-base"
                  >
                    {finalCta.secondaryCta}
                  </a> */}
                </form>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage; 
