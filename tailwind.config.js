/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        offwhite: '#F8F6F2',
      },
      backgroundImage: {
        texture: "url('data:image/svg+xml;utf8,<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"40\" height=\"40\" fill=\"%23F8F6F2\"/><circle cx=\"20\" cy=\"20\" r=\"1.5\" fill=\"%23e5e5e5\" fill-opacity=\"0.25\"/></svg>')"
      },
    },
  },
  plugins: [],
}

