/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",      // Để Tailwind quét các file trong thư mục app
      "./pages/**/*.{js,ts,jsx,tsx}",    // Quét các file trong thư mục pages (nếu có)
      "./components/**/*.{js,ts,jsx,tsx}" // Quét các file trong thư mục components
    ],
   
  }