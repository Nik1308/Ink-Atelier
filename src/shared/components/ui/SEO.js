import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author = 'Ink Atelier',
  structuredData = null
}) => {
  const location = useLocation();
  
  // Normalize URL: remove trailing slash (except for root), ensure https, no www
  const normalizeUrl = (urlString) => {
    let normalized = urlString;
    // Remove trailing slash except for root
    if (normalized.endsWith('/') && normalized !== 'https://inkatelier.in/') {
      normalized = normalized.slice(0, -1);
    }
    // Ensure it starts with https://inkatelier.in (not www)
    normalized = normalized.replace(/^https?:\/\/(www\.)?inkatelier\.in/, 'https://inkatelier.in');
    return normalized;
  };
  
  const baseUrl = url || `https://inkatelier.in${location.pathname}`;
  const currentUrl = normalizeUrl(baseUrl);
  const defaultImage = image || 'https://inkatelier.in/assets/images/logo.jpg';

  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Update or create keywords meta tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;
    
    // Update or create author meta tag
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
      metaAuthor = document.createElement('meta');
      metaAuthor.name = 'author';
      document.head.appendChild(metaAuthor);
    }
    metaAuthor.content = author;
    
    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: currentUrl },
      { property: 'og:image', content: defaultImage },
      { property: 'og:site_name', content: 'Ink Atelier' },
      { property: 'og:locale', content: 'en_US' }
    ];
    
    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });
    
    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: defaultImage },
      { name: 'twitter:site', content: '@inkatelier' }
    ];
    
    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = tag.name;
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });
    
    // Canonical URL - Remove all existing canonical tags first to avoid duplicates
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(tag => tag.remove());
    
    // Create new canonical tag
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = currentUrl;
    document.head.appendChild(canonical);
    
    // Also add alternate link for consistency (prevents duplicate content issues)
    const existingAlternates = document.querySelectorAll('link[rel="alternate"]');
    existingAlternates.forEach(tag => {
      if (tag.getAttribute('hreflang') === 'x-default') {
        tag.remove();
      }
    });
    
    const alternate = document.createElement('link');
    alternate.rel = 'alternate';
    alternate.hreflang = 'x-default';
    alternate.href = currentUrl;
    document.head.appendChild(alternate);

    // Add structured data (JSON-LD)
    // Remove all existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    if (structuredData) {
      // Handle both single object and array of objects
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
      
      dataArray.forEach((data, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `structured-data-${index}`;
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }
    
  }, [title, description, keywords, image, url, type, author, structuredData, currentUrl, defaultImage]);
  
  return null;
};

export default SEO; 
