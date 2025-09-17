import { useState, useEffect, useMemo } from 'react';
import { database } from '../../Firebase/Firebase';
import { ref, push, set, remove, onValue, update } from 'firebase/database';
import { Plus, Search, Edit, Trash2, Package, Star, Check, X, ExternalLink, ChevronDown, ChevronUp, IndianRupee, StepBack, FerrisWheelIcon, Truck, RefreshCw } from 'lucide-react';

// Updated categories data with proper hierarchy
const categoriesData = {
  "Home Appliances": {
    "Kitchen Appliances": [
      "Mixer Grinder",
      "Juicers",
      "Hand Blenders",
      "Food Processor",
      "Oven Toaster Grilss",
      "Rice And Pasta Cookers",
      "Deep Fryers",
      "Hand Mixers",
      "Coffee Machines",
      "Wet Grinders",
      "Induction Cooktops",
      "Sandwich Makers",
      "Electric Kettles",
      "Refrigerator",
      "Chimney",
      "Dishwasher",
      "Microwave Oven"
    ],
    "Other Appliances": [
      "Air Conditioner",
      "Washing Machine",
      "Dishwasher",
      "Water Purifier",
      "Vacuum Cleaners",
      "Sewing Machines And Accessories",
      "Irons",
      "Inverters",
      "Fans",
      "Water Heaters",
      "Air Coolers",
      "Air Purifier",
      "Dehumidifiers",
      "Humidifier"
    ]
  },
  "Kitchen Tools": {
    "_uncategorized": [
      "Cookware sets",
      "Frying Pans",
      "Tawas",
      "Kadhai",
      "Pressure Cookers",
      "Water Bottle And Flasks",
      "Jars And Container",
      "Lunch Boxes",
      "Chopper and Chippers",
      "Graters And Slicers",
      "Knives",
      "Baking Tools",
      "Dinner Sets",
      "Dining Tables",
      "Kitchen Cabinet",
      "Crockery Unit",
      "Bar stool",
      "Bar cabinet",
      "Serving Trolley"
    ]
  },
  "Furniture": {
    "Living Room Furniture": [
      "Sofa Beds",
      "Sofa Sets",
      "L-Shaped Sofas",
      "Recliners",
      "Tv And Entertainment Units",
      "Centre Tables",
      "Nested Tables",
      "Chairs",
      "Shoe Rack",
      "Footstool",
      "Pouffes And Ottomans",
      "Bean Bags",
      "Wall Shelves",
      "Magazine Racks"
    ],
    "Bedroom Furniture": [
      "Beds",
      "Mattresses",
      "Wardrobes",
      "Bedside Tables",
      "Dressing Tables",
      "Chest Of Drawers"
    ],
    "Kitchen And Dining": [
      "Dining Table Sets",
      "Dining Chairs",
      "Kitchen Cabintes"
    ],
    "Study Room Furniture": [
      "Desks",
      "Office Chiars",
      "Bookcases"
    ],
    "Outdoor Furniture": [
      "Hammocks",
      "Swing Chairs",
      "Outdoor Furniture Sets",
      "Patio Umbrella"
    ]
  },
  "Linen And Rugs": {
    "Bedroom Linen": [
      "Bedsheets",
      "Bed Pillow",
      "Speciality Pillow",
      "Blankets And Quilts",
      "Mattresses Protectors",
      "Bedding Sets",
      "Duvet Covers",
      "Fitted Bedsheets",
      "Pillow Cases",
      "Cushion Covers",
      "Cushions",
      "Slipcovers",
      "Diwan Sets"
    ],
    "Bathroom Linen": [
      "Bath Mats",
      "Bath Pillow",
      "Bathrobes",
      "Shower Curtains",
      "Bath Towels"
    ]
  },
  "Curtians And Accessories": {
    "_uncategorized": [
      "Curtains",
      "Blinds",
      "Valances",
      "Tiers",
      "Swags",
      "Accessories",
      "Carpet And Rugs",
      "Carpets",
      "Rugs",
      "Doormats",
      "Stair Carpets",
      "Kitchen Linen",
      "Aprons",
      "Table Cloth",
      "Place Mats",
      "Table Runners",
      "Oven Gloves"
    ]
  },
  "Bathroom And Kitchen Fixtures": {
    "_uncategorized": [
      "Bathroom Basin Taps",
      "Bathroom Hardware",
      "Health Fausets",
      "Shower And Bath Taps",
      "Shower Heads",
      "Kitchen Fixtures"
    ]
  },
  "Safes And Security": {
    "_uncategorized": [
      "Safes",
      "Video Door Phone",
      "Alarms",
      "Home Security System"
    ]
  },
  "Door Locks And Hardware": {
    "_uncategorized": [
      "Ladders",
      "Door Locks",
      "Hooks",
      "Door Hardware",
      "Furniture Hardware",
      "Cabinet Hardware"
    ]
  },
  "Outdoor Decor": {
    "_uncategorized": [
      "Decorative Pots",
      "Sculptures",
      "Fountains",
      "Wind Chimes",
      "Birdbaths",
      "Solar Garden Lights"
    ]
  },
  "Lights": {
    "Functional Lighting": [
      "Light Bulbs",
      "LED Bulbs",
      "Emergency Lights",
      "Clip Lights",
      "Desk Lights",
      "Working Lights",
      "Wall Lights",
      "Reading Lights",
      "Wall Spotlights"
    ],
    "Decorative Lighting": [
      "Standing Lights",
      "Table lamps",
      "Floor lamps",
      "Lamp Shades"
    ],
    "Speciality Lighting": [
      "Book Lights",
      "Lava Lamps",
      "Night Lights",
      "Seasonal Lights",
      "Lamp Bases"
    ],
    "Fixtures": [
      "Bathroom Lights",
      "Ceiling Lights",
      "Chandeliers",
      "Picture And Display Lights",
      "Recessed lights",
      "Track, Rail And Cable Lighting System"
    ]
  }
}

const AdminPanel = () => {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    aboutItem: '',
    price: '',
    rating: '',
    category: '',
    subcategory: '',
    item: '',
    imageUrl: '',
    referralLink: '',
    returnAvailable: false,
    freeDelivery: false,
    topBrand: false,
    favorite: false // Add this line
  });

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts({});
        setFilteredProducts({});
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter products based on search term and category filters
  useEffect(() => {
    let filtered = products;

    if (searchTerm.trim() !== '') {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const product = filtered[key];
        if (
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.details && product.details.toLowerCase().includes(searchTerm.toLowerCase()))
        ) {
          acc[key] = product;
        }
        return acc;
      }, {});
    }

    if (selectedCategory) {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const product = filtered[key];
        if (product.category === selectedCategory) {
          if (!selectedSubcategory || product.subcategory === selectedSubcategory) {
            if (!selectedItem || product.item === selectedItem) {
              acc[key] = product;
            }
          }
        }
        return acc;
      }, {});
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedCategory, selectedSubcategory, selectedItem]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      details: '',
      aboutItem: '',
      price: '',
      rating: '',
      category: '',
      subcategory: '',
      item: '',
      imageUrl: '',
      referralLink: '',
      returnAvailable: false,
      freeDelivery: false,
      topBrand: false,
      favorite: false // Add this line
    });
    setEditingProduct(null);
    setShowAddForm(false);
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedItem('');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle category selection
  const handleCategorySelect = (category, subcategory = '', item = '') => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: subcategory === '_uncategorized' ? '' : subcategory,
      item
    }));
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory === '_uncategorized' ? '' : subcategory);
    setSelectedItem(item);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        // Update existing product
        const productRef = ref(database, `products/${editingProduct}`);
        await update(productRef, {
          ...productData,
          createdAt: products[editingProduct].createdAt
        });
        alert('Product updated successfully!');
      } else {
        // Add new product
        const productsRef = ref(database, 'products');
        await push(productsRef, productData);
        alert('Product added successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (productId) => {
    const product = products[productId];
    setFormData({
      name: product.name || '',
      details: product.details || '',
      aboutItem: product.aboutItem || '',
      price: product.price?.toString() || '',
      rating: product.rating?.toString() || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      item: product.item || '',
      imageUrl: product.imageUrl || '',
      referralLink: product.referralLink || '',
      returnAvailable: product.returnAvailable || false,
      freeDelivery: product.freeDelivery || false,
      topBrand: product.topBrand || false,
      favorite: product.favorite || false // Add this line
    });
    setEditingProduct(productId);
    setSelectedCategory(product.category || '');
    setSelectedSubcategory(product.subcategory || '');
    setSelectedItem(product.item || '');
    setShowAddForm(true);
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = ref(database, `products/${productId}`);
        await remove(productRef);
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categoriesData;

    const searchTerm = categorySearch.toLowerCase();
    const result = {};

    Object.keys(categoriesData).forEach(category => {
      const categoryLower = category.toLowerCase();
      if (categoryLower.includes(searchTerm)) {
        result[category] = categoriesData[category];
        return;
      }

      const subcategories = {};
      Object.keys(categoriesData[category]).forEach(subcategory => {
        const subcategoryLower = subcategory.toLowerCase();
        if (subcategoryLower.includes(searchTerm)) {
          subcategories[subcategory] = categoriesData[category][subcategory];
          return;
        }

        const items = categoriesData[category][subcategory].filter(item =>
          item.toLowerCase().includes(searchTerm)
        );
        if (items.length > 0) {
          subcategories[subcategory] = items;
        }
      });

      if (Object.keys(subcategories).length > 0) {
        result[category] = subcategories;
      }
    });

    return result;
  }, [categorySearch]);

  // Get all items from categories for the select dropdowns
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    return Object.keys(categoriesData[selectedCategory] || {});
  };

  const getItems = () => {
    if (!selectedSubcategory) {
      // If no subcategory selected, return all items from all subcategories
      if (!selectedCategory) return [];
      const allItems = [];
      Object.values(categoriesData[selectedCategory] || {}).forEach(subcategoryItems => {
        allItems.push(...subcategoryItems);
      });
      return allItems;
    }
    return categoriesData[selectedCategory]?.[selectedSubcategory] || [];
  };

  // Render category selector
  const renderCategorySelector = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                handleInputChange(e);
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
                setSelectedItem('');
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {Object.keys(categoriesData).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={(e) => {
                handleInputChange(e);
                setSelectedSubcategory(e.target.value);
                setSelectedItem('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              disabled={!formData.category}
            >
              <option value="">All Subcategories</option>
              {getSubcategories().map(subcategory => (
                <option key={subcategory} value={subcategory}>
                  {subcategory === '_uncategorized' ? 'General' : subcategory}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item*</label>
            <select
              name="item"
              value={formData.item}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              disabled={!formData.category}
            >
              <option value="">Select Item</option>
              {getItems().map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="font-medium text-blue-900">
            Selected: {formData.category || 'None'}
            {formData.subcategory && ` > ${formData.subcategory}`}
            {formData.item && ` > ${formData.item}`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Package className="w-8 h-8" />
                Admin Panel
              </h1>
              <p className="text-blue-100 mt-1">Manage your affiliate products with ease</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg w-auto md:w-auto"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6 max-w-full overflow-hidden">
          {/* Search Section */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Filters</h3>

            {/* Category Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('');
                    setSelectedItem('');
                  }}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                >
                  <option value="">All Categories</option>
                  {Object.keys(categoriesData).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              {selectedCategory && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setSelectedItem('');
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                  >
                    <option value="">All Subcategories</option>
                    {getSubcategories().map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory === '_uncategorized' ? 'General' : subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Item Filter */}
              {(selectedCategory && selectedSubcategory) && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Item</label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
                  >
                    <option value="">All Items</option>
                    {getItems().map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Results and Clear Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {Object.keys(filteredProducts).length} products
              </span>
              {(selectedCategory || selectedSubcategory || selectedItem) && (
                <span className="text-xs text-gray-500">filtered</span>
              )}
            </div>

            {(selectedCategory || selectedSubcategory || selectedItem) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  setSelectedItem('');
                }}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)*</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)*</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL*</label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link*</label>
                      <input
                        type="url"
                        name="referralLink"
                        value={formData.referralLink}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  {renderCategorySelector()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Details*</label>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        rows={3}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">About This Item</label>
                      <textarea
                        name="aboutItem"
                        value={formData.aboutItem}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="returnAvailable"
                        checked={formData.returnAvailable}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Return Available</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="freeDelivery"
                        checked={formData.freeDelivery}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Free Delivery</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="favorite"
                        checked={formData.favorite}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Favorite Product</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="topBrand"
                        checked={formData.topBrand}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Top Brand</span>
                    </label>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading || !formData.category || !formData.item}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingProduct ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-900" />
              Product Inventory
            </h2>
          </div>

          <div className="p-6">
            {Object.keys(filteredProducts).length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm || selectedCategory ? 'No matching products found' : 'No products available'}
                </p>
                <p className="text-gray-400 mt-2">
                  {!searchTerm && !selectedCategory && 'Add your first product to get started'}
                </p>
                {searchTerm || selectedCategory ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedSubcategory('');
                      setSelectedItem('');
                    }}
                    className="mt-4 text-blue-900 hover:text-blue-700 font-medium"
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(filteredProducts).map(([productId, product]) => (
                  <div
                    key={productId}
                    className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white group hover:border-blue-100 relative"
                  >
                    {/* Badges Container (Top) */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                      {product.favorite && (
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          <span>FAV</span>
                        </div>
                      )}
                      {product.topBrand && (
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>TOP</span>
                        </div>
                      )}
                    </div>

                    {/* Image Section */}
                    <div className="relative bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          e.target.className = 'w-full h-full object-contain opacity-75';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-4">
                      {/* Category & Name */}
                      <div className="space-y-2">
                        <p className="text-blue-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {product.category}
                        </p>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      {/* Rating & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-blue-50/80 px-3 py-1 rounded-full backdrop-blur-sm">
                          {renderStars(product.rating)}
                          <span className="text-xs text-blue-800 font-medium ml-1">
                            {product.rating}
                          </span>
                        </div>
                        <p className="text-xl font-extrabold text-blue-900">
                          ₹{product.price}
                        </p>
                      </div>

                      {/* Delivery Badges */}
                      <div className="flex flex-wrap gap-2">
                        {product.freeDelivery && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>FREE</span>
                          </span>
                        )}
                        {product.returnAvailable && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            <span>RETURN</span>
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {product.details}
                      </p>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleEdit(productId)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-900 p-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-all hover:shadow-inner"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only sm:not-sr-only sm:text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(productId)}
                          className="bg-red-50 hover:bg-red-100 text-red-900 p-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-all hover:shadow-inner"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only sm:not-sr-only sm:text-xs">Delete</span>
                        </button>
                        <a
                          href={product.referralLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-50 hover:bg-orange-100 text-orange-900 p-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-all hover:shadow-inner"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="sr-only sm:not-sr-only sm:text-xs">View</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;