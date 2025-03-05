import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="container mx-auto px-6 py-4">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;