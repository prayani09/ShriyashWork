import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Home, Box, ChevronDown, ChevronUp } from 'lucide-react';
import { getDatabase, ref, onValue, off } from 'firebase/database';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();

  // Fetch unique categories from products in Firebase
  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const productsData = snapshot.val();
      if (productsData) {
        // Extract unique categories from products
        const categorySet = new Set();
        Object.values(productsData).forEach(product => {
          if (product.category) {
            categorySet.add(product.category);
          }
        });
        
        // Convert Set to array of objects with id and name
        const uniqueCategories = Array.from(categorySet).map(category => ({
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category
        }));
        
        setCategories(uniqueCategories);
      }
      setLoadingCategories(false);
    }, (error) => {
      console.error("Error fetching categories:", error);
      setLoadingCategories(false);
    });

    return () => {
      off(productsRef);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  };

  return (
    <nav className={`backdrop-blur-lg bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800 transition-all duration-300 ${isScrolled ? 'py-0' : 'py-1'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center">
              {/* <img 
                src="https://emergeconstruction.in/logo.png" 
                alt="Emerge Homes Logo" 
                className='h-8 w-7 transition-transform group-hover:scale-110' 
              /> */}
              <span className="hidden md:inline-block text-white text-2xl font-bold tracking-tight ml-2">
                <span className="text-white">Samratha</span> Tech
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className={`${isMenuOpen ? 'hidden' : 'flex'} md:flex flex-1 max-w-xl mx-4 md:mx-8`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Discover premium Tech Products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2.5 pr-12 text-gray-900 bg-white/90 border-0 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm placeholder-gray-500 transition-all duration-200 hover:bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-white hover:bg-gray-800/60 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Home className="w-5 h-5" strokeWidth={2.5} />
              Home
            </Link>
            
            {/* Categories Dropdown - Desktop */}
            <div className="relative group">
              <button 
                className="text-white hover:bg-gray-800/60 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-[1.02]"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <Box className="w-5 h-5" strokeWidth={2.5} />
                Categories
                {isCategoriesOpen ? (
                  <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                )}
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute left-0 mt-2 w-56 origin-top-right rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn">
                  <div className="py-1 max-h-96 overflow-y-auto">
                    {loadingCategories ? (
                      <div className="px-4 py-2 text-white text-sm">Loading categories...</div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.name)}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700/80 transition-colors"
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-white text-sm">No categories found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {!isMenuOpen && (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-white hover:text-orange-500 p-2 transition-all transform hover:scale-110"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://emergeconstruction.in/logo.png" 
                  alt="Emerge Homes Logo" 
                  className='h-8 w-7' 
                />
                <span className="text-white text-xl font-bold tracking-tight">
                  <span className="text-white">Emerge</span> Homes
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-orange-500 p-2 transition-all transform hover:scale-110"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2.5 pr-12 text-gray-900 bg-white border-0 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-gray-800/60 block px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 transition-all"
              >
                <Home className="w-5 h-5" strokeWidth={2.5} />
                Home
              </Link>
              
              {/* Mobile Categories Dropdown */}
              <div className="text-white hover:bg-gray-800/60 block px-4 py-3 rounded-lg text-base font-medium transition-all">
                <button 
                  className="flex items-center gap-3 w-full"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <Box className="w-5 h-5" strokeWidth={2.5} />
                  Categories
                  {isCategoriesOpen ? (
                    <ChevronUp className="w-4 h-4 ml-auto" strokeWidth={2.5} />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-auto" strokeWidth={2.5} />
                  )}
                </button>
                
                {isCategoriesOpen && (
                  <div className="mt-2 ml-8 space-y-2 animate-fadeIn">
                    {loadingCategories ? (
                      <div className="text-white text-sm py-2">Loading categories...</div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.name)}
                          className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="text-white text-sm py-2">No categories found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;