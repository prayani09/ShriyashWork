import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import {
  Star,
  ExternalLink,
  ArrowLeft,
  Truck,
  RotateCcw,
  Shield,
  Award,
  Package,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingCart,
  Share2
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (!productId) return;

    const productRef = ref(database, `products/${productId}`);
    const unsubscribe = onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProduct(data);
        // For demo, check if product is in wishlist
        setIsWishlisted(Math.random() > 0.7);
      } else {
        setProduct(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;

    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const related = Object.entries(data)
          .filter(([pid, prod]) =>
            pid !== productId &&
            prod.category === product.category &&
            prod.subcategory === product.subcategory
          )
          .slice(0, 4);
        setRelatedProducts(related);
      }
    });

    return () => unsubscribe();
  }, [product, productId]);

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

  // Handle quantity changes
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      { position: 'bottom-right' }
    );
  };

  // Share product
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied to clipboard', { position: 'bottom-right' });
    }
  };

  // Product images (for future multiple images support)
  const productImages = product ? [product.imageUrl, ...(product.additionalImages || [])] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <Link
            to="/products"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2 font-medium shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Products</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={shareProduct}
                className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-2 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              <img
                src={productImages[selectedImage] || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
                }}
              />

              {/* Navigation arrows for multiple images */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-orange-500 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Breadcrumb */}
            <div className="flex items-center text-sm text-gray-600">
              <Link to="/" className="hover:text-orange-500">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-orange-500">Products</Link>
              <span className="mx-2">/</span>
              <Link to={`/products?category=${product.category}`} className="hover:text-orange-500 capitalize">{product.category}</Link>
              {product.subcategory && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-orange-500 capitalize">{product.subcategory}</span>
                </>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            {/* Rating and Brand */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600 text-sm">({product.reviews || 0} reviews)</span>
              </div>

              {product.topBrand && (
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Top Brand
                </div>
              )}

              <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                In Stock
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </div>
              {product.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-green-600 font-medium">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {product.highlights?.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                )) || <li>Premium quality product</li>}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={product.referralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 px-6 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </a>
            </div>

            {/* Delivery & Offers */}
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-4 flex items-start gap-3">
                <Truck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">Get free delivery on this item</p>
                </div>
              </div>

              {product.returnAvailable && (
                <div className="p-4 flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              )}

              <div className="p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% secure payment options</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button className="py-4 px-6 border-b-2 font-medium text-sm border-orange-500 text-orange-600">
                Description
              </button>
            </nav>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.details}</p>

            {product.specifications && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.specifications.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
              <Link
                to={`/products?category=${product.category}`}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(([id, relatedProduct]) => (
                <div
                  key={id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow hover:border-orange-200"
                >
                  <Link to={`/product/${id}`} className="block">
                    <div className="relative pt-[100%]">
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        className="absolute top-0 left-0 w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                      {relatedProduct.topBrand && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Top Brand
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {relatedProduct.name}
                      </h3>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {renderStars(relatedProduct.rating)}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({relatedProduct.rating})</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-lg font-bold text-gray-900">₹{relatedProduct.price.toLocaleString()}</div>
                        {relatedProduct.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">₹{relatedProduct.originalPrice.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;