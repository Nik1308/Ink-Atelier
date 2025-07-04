import React from "react";
import { artists } from "../../data/dummyData";

const MeetTheArtists = () => (
  <section className="bg-offwhite text-black py-12 px-2 text-center">
    <h2 className="text-3xl font-serif font-bold mb-8 text-black drop-shadow">Meet the Artists</h2>
    <div className="flex gap-6 overflow-x-auto px-4 pb-2">
      {artists.map((artist, idx) => (
        <div className={
          `rounded-xl border-2 shadow-lg min-w-[260px] max-w-xs flex flex-col items-center p-6 hover:scale-105 transition ` +
          (idx === 0 ? 'bg-gray-400 border-gray-500' : idx === 1 ? 'bg-pink-300 border-pink-400' : 'bg-offwhite border-black')
        } key={artist.id}>
          <img src={artist.image} alt={artist.name} className={`w-28 h-28 object-cover rounded-full border-2 mb-4 bg-white ${idx === 0 ? 'border-gray-500' : idx === 1 ? 'border-pink-400' : 'border-black'}`} />
          <div className="flex flex-col items-center">
            <h3 className={`text-xl font-serif font-semibold mb-1 ${idx === 1 ? 'text-black' : 'text-black'}`}>{artist.name}</h3>
            <p className={`text-base mb-2 ${idx === 1 ? 'text-black' : 'text-black'}`}>{artist.bio}</p>
            <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className={`bg-black text-offwhite px-4 py-1 rounded-full font-bold text-sm shadow hover:bg-gray-800 transition`}>Instagram</a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default MeetTheArtists; 