import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import LOGO from '../Assets/imgs/my.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isResearchPage = location.pathname === '/research';

  const navigationLinks = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Dataset', href: '/dataset', id: 'dataset' },
    { name: 'Ground Research', href: '/research', id: 'research' },
    { name: 'Architecture', href: '/architecture', id: 'architecture' }
  ];

  useEffect(() => {
    const current = navigationLinks.find(link => link.href === location.pathname);
    if (current) {
      setActiveSection(current.id);
    }
  }, [location]);

  const scrollToSection = (href) => {
    navigate(href);
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.w-[60%]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 900;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='flex justify-center items-center'>
      <nav className={`fixed top-0 z-50 transition-all duration-300 ${
        (isHomePage && isScrolled) || isResearchPage
          ? 'rounded-4xl border-[1px] border-zinc-700 hover-target bg-white/20 text-black mt-2 md:w-[35%] backdrop-blur-md'
          : 'bg-transparent md:w-full border-none rounded-none backdrop-blur-md text-white'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('/')}>
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <img
                  src={LOGO}
                  alt="Wichain Logo"
                  onClick={() => navigate('/')}
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition duration-300 ease-in-out hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center mr24">
              {navigationLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-4 py-2 rounded-lg m-2 text-sm font-medium transition-all duration-200  ${
                    activeSection === link.id ? 'border-[1px] border-zinc-700' : 'hover:text-white'
                  } ${
                    (isHomePage && isScrolled) || isResearchPage ? 'text-black' : 'text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-end space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-black backdrop-blur-md border-t border-gray-800/50 shadow-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navigationLinks.map((link, index) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800/50 hover:translate-x-2 ${
                      activeSection === link.id
                        ? 'text-cyan-400 bg-gray-800/30 border-l-2 border-cyan-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.name}</span>
                      {activeSection === link.id && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </nav>
    </div>
  );
};

export default Navbar;