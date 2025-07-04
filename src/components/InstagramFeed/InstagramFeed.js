import React from "react";
import { instagramPosts } from "../../data/dummyData";

const InstagramFeed = () => (
  <section className="bg-offwhite text-black py-12 px-2 text-center">
    <h2 className="text-3xl font-serif font-bold mb-8 text-black drop-shadow">Instagram Feed</h2>
    <div className="flex flex-wrap gap-6 justify-center">
      {instagramPosts.map((post, idx) => (
        <div className={`rounded-xl border-2 shadow-lg w-44 flex flex-col items-center p-3 hover:scale-105 transition ${idx === 0 ? 'bg-pink-300 border-pink-400' : 'bg-offwhite border-black'}`} key={post.id}>
          <img src={post.image} alt={post.caption} className="w-full h-28 object-cover rounded-lg border-2 border-gray-200 mb-2 bg-white" />
          <div className="text-sm text-black mt-1">{post.caption}</div>
        </div>
      ))}
    </div>
  </section>
);

export default InstagramFeed; 