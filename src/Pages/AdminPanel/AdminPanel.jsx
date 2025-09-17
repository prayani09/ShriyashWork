import { useState, useEffect, useMemo } from 'react';
import { database } from '../../Firebase/Firebase';
import { ref, push, set, remove, onValue, update } from 'firebase/database';
import { Plus, Search, Edit, Trash2, Package, Star, Check, X, ExternalLink, Truck, RefreshCw, TrendingUp } from 'lucide-react';

const AdminPanel = () => {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    price: '',
    rating: '',
    category: '',
    imageUrl: '',
    referralLink: '',
    returnAvailable: false,
    freeDelivery: false,
    topBrand: false,
    bestSeller: false
  });

  // Fetch products and categories from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const categoriesRef = ref(database, 'categories');
    
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts({});
        setFilteredProducts({});
      }
    });

    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array of category names
        const categoryList = Object.values(data).map(item => item.name);
        setCategories(categoryList);
      } else {
        setCategories([]);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
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

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      details: '',
      price: '',
      rating: '',
      category: '',
      imageUrl: '',
      referralLink: '',
      returnAvailable: false,
      freeDelivery: false,
      topBrand: false,
      bestSeller: false
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle new category creation
  const handleNewCategory = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  // Save new category to Firebase
  const saveCategory = async (categoryName) => {
    if (!categoryName.trim() || categories.includes(categoryName)) return;
    
    try {
      const categoriesRef = ref(database, 'categories');
      const newCategoryRef = push(categoriesRef);
      await set(newCategoryRef, { name: categoryName.trim() });
      
      // Update local state
      setCategories(prev => [...prev, categoryName.trim()]);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save category if it's new
      if (formData.category && !categories.includes(formData.category)) {
        await saveCategory(formData.category);
      }

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
      price: product.price?.toString() || '',
      rating: product.rating?.toString() || '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      referralLink: product.referralLink || '',
      returnAvailable: product.returnAvailable || false,
      freeDelivery: product.freeDelivery || false,
      topBrand: product.topBrand || false,
      bestSeller: product.bestSeller || false
    });
    setEditingProduct(productId);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl shadow-lg p-6 mb-6">
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
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {Object.keys(filteredProducts).length} products found
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)*</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter price"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter rating"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter image URL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleNewCategory}
                        list="categories"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter or select category"
                      />
                      <datalist id="categories">
                        {categories.map((category, index) => (
                          <option key={index} value={category} />
                        ))}
                      </datalist>
                      <p className="text-xs text-gray-500 mt-1">
                        Type to create a new category or select from existing ones
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link*</label>
                      <input
                        type="url"
                        name="referralLink"
                        value={formData.referralLink}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter referral link"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Details*</label>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        rows={3}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product details"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="returnAvailable"
                        checked={formData.returnAvailable}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                      <span className="text-sm font-medium text-gray-700">Return Available</span>
                    </label>

                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="freeDelivery"
                        checked={formData.freeDelivery}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                      <span className="text-sm font-medium text-gray-700">Free Delivery</span>
                    </label>

                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="bestSeller"
                        checked={formData.bestSeller}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                      <span className="text-sm font-medium text-gray-700">Best Seller</span>
                    </label>

                    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="topBrand"
                        checked={formData.topBrand}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                      <span className="text-sm font-medium text-gray-700">Top Brand</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
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
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-3 sm:mb-0">
              <Package className="w-5 h-5 text-blue-600" />
              Product Inventory
            </h2>
            <div className="text-sm text-gray-600">
              {Object.keys(filteredProducts).length} products
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {Object.keys(filteredProducts).length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No matching products found' : 'No products available'}
                </p>
                <p className="text-gray-400 mt-2">
                  {!searchTerm && 'Add your first product to get started'}
                </p>
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Object.entries(filteredProducts).map(([productId, product]) => (
                  <div
                    key={productId}
                    className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white group hover:border-blue-200 relative"
                  >
                    {/* Badges Container (Top) */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                      <div className="flex flex-col gap-2">
                        {product.bestSeller && (
                          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 w-fit">
                            <TrendingUp className="w-3 h-3" />
                            <span>BEST SELLER</span>
                          </div>
                        )}
                        {product.topBrand && (
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" />
                            <span>TOP BRAND</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative bg-gray-100 h-56 sm:h-64 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          e.target.className = 'w-full h-full object-contain opacity-75';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 space-y-4">
                      {/* Category & Name */}
                      <div className="space-y-2">
                        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
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
                        <p className="text-xl font-extrabold text-blue-600">
                          ₹{product.price}
                        </p>
                      </div>

                      {/* Delivery Badges */}
                      <div className="flex flex-wrap gap-2">
                        {product.freeDelivery && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>FREE DELIVERY</span>
                          </span>
                        )}
                        {product.returnAvailable && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            <span>RETURN AVAILABLE</span>
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
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-all hover:shadow-inner"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only sm:not-sr-only sm:text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(productId)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-all hover:shadow-inner"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only sm:not-sr-only sm:text-xs">Delete</span>
                        </button>
                        <a
                          href={product.referralLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-50 hover:bg-orange-100 text-orange-600 p-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-all hover:shadow-inner"
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