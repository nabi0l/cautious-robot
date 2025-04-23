import '../CSS/output.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full py-4 px-4 sm:px-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          AI responses may be inaccurate. Verify important details.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; All rights reserved {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer;