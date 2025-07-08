import React from "react";
import { Link } from "react-router-dom";
import { SEO } from '../features/common/ui';

const FormsPage = () => (
  <>
    <SEO 
      title="Consent Forms - Ink Atelier"
      description="Complete your tattoo consent form or piercing consent form. Required forms for all body art procedures at Ink Atelier."
      keywords="tattoo consent form, piercing consent form, body art consent, tattoo waiver, piercing waiver, ink atelier forms"
              image="/assets/images/logo.jpg"
              url="https://inkatelier.in/forms"
      type="website"
    />
    <section className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-2 relative">
      <img src="/assets/images/logo.jpg" alt="Ink Atelier Logo" className="w-20 h-20 object-contain rounded-full absolute left-8 top-8" style={{ zIndex: 10 }} />
      <div className="max-w-xl w-full p-8 mx-auto flex flex-col items-center bg-white justify-center" style={{ minHeight: '60vh' }}>
        <div className="flex flex-col gap-6 w-full items-center">
          <Link to="/tattoo-consent" className="bg-white text-black border border-black rounded-lg font-normal transition w-full max-w-[320px] h-10 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white">Tattoo Consent Form</Link>
          <Link to="/piercing-consent" className="bg-white text-black border border-black rounded-lg font-normal transition w-full max-w-[320px] h-10 flex items-center justify-center text-base shadow-none hover:bg-black hover:text-white">Piercing Consent Form</Link>
        </div>
      </div>
    </section>
  </>
);

export default FormsPage; 