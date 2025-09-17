import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import { Star, ExternalLink, Search, Filter, X, SlidersHorizontal, Package } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [ratingFilter, setRatingFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Get search and category from URL parameters
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
      } else {
        setProducts({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Set initial filters from URL
  useEffect(() => {
    setLocalSearch(urlSearch);
    setSelectedCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  // Get unique categories and subcategories
  const categories = useMemo(() => {
    const cats = new Set();
    Object.values(products).forEach(product => {
      if (product.category) cats.add(product.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const subcats = new Set();
    Object.values(products).forEach(product => {
      if (product.category === selectedCategory && product.subcategory) {
        subcats.add(product.subcategory);
      }
    });
    return Array.from(subcats).sort();
  }, [products, selectedCategory]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = Object.entries(products);

    // Search filter
    const searchTerm = localSearch.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(([id, product]) => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.details?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm) ||
        product.item?.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(([id, product]) => product.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter(([id, product]) => product.subcategory === selectedSubcategory);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(([id, product]) => 
        parseFloat(product.price) >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(([id, product]) => 
        parseFloat(product.price) <= parseFloat(priceRange.max)
      );
    }

    // Rating filter
    if (ratingFilter) {
      filtered = filtered.filter(([id, product]) => 
        parseFloat(product.rating) >= parseFloat(ratingFilter)
      );
    }

    // Sort products
    filtered.sort(([idA, productA], [idB, productB]) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(productA.price) - parseFloat(productB.price);
        case 'price-high':
          return parseFloat(productB.price) - parseFloat(productA.price);
        case 'rating':
          return parseFloat(productB.rating) - parseFloat(productA.rating);
        case 'name':
          return productA.name.localeCompare(productB.name);
        case 'newest':
        default:
          return new Date(productB.createdAt || 0) - new Date(productA.createdAt || 0);
      }
    });

    return filtered;
  }, [products, localSearch, selectedCategory, selectedSubcategory, priceRange, ratingFilter, sortBy]);

  // Handle search
  const handleSearch = (searchValue) => {
    setLocalSearch(searchValue);
    const newParams = new URLSearchParams(searchParams);
    if (searchValue) {
      newParams.set('search', searchValue);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalSearch('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setPriceRange({ min: '', max: '' });
    setRatingFilter('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-orange-200 text-orange-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Product Card Component
  const ProductCard = ({ productId, product }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
          }}
        />
        {product.topBrand && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Top Brand
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-xs text-orange-600 font-medium mb-1">
          {product.category} {product.subcategory && `> ${product.subcategory}`}
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <div className="flex gap-1">
            {product.freeDelivery && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Free Delivery
              </span>
            )}
            {product.returnAvailable && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Returns
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.details}
        </p>
        
        <div className="flex gap-2">
          <Link
            to={`/product/${productId}`}
            className="flex-1 bg-gray-900 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            View Details
          </Link>
          <a
            href={product.referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors flex items-center"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
            {(urlSearch || urlCategory) && (
              <span className="ml-2">
                {urlSearch && `for "${urlSearch}"`}
                {urlCategory && `in ${urlCategory}`}
              </span>
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              </button>
            </div>

            {/* Filters */}
            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              {selectedCategory && subcategories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Subcategory</h3>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Subcategories</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating</h3>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4 stars & above</option>
                  <option value="3">3 stars & above</option>
                  <option value="2">2 stars & above</option>
                  <option value="1">1 star & above</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(([productId, product]) => (
                  <ProductCard key={productId} productId={productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;