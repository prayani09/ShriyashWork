import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import {
  Star,
  ExternalLink,
  ArrowRight,
  Heart,
  ShoppingBag,
  Zap,
  Award,
  Shield,
  Truck,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  ThumbsUp,
  FileChartPie,
  ToolCaseIcon,
  ShieldCheckIcon,
  StarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const featuresRef = useRef(null);
  const categoryRefs = useRef({});

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        organizeByCategoryForHome(data);
        extractFavoriteProducts(data);
      } else {
        setProducts({});
        setCategorizedProducts({});
        setFavoriteProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Banner rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Organize products by category and get latest 5 for home page
  const organizeByCategoryForHome = (productsData) => {
    const organized = {};

    Object.entries(productsData).forEach(([productId, product]) => {
      const category = product.category || 'Uncategorized';

      if (!organized[category]) {
        organized[category] = [];
      }

      organized[category].push({ id: productId, ...product });
    });

    // Sort each category by creation date (newest first) and take only 5
    Object.keys(organized).forEach(category => {
      organized[category] = organized[category]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
    });

    setCategorizedProducts(organized);
  };

  // Extract favorite products
  const extractFavoriteProducts = (productsData) => {
    const favorites = Object.entries(productsData)
      .filter(([_, product]) => product.favorite)
      .map(([productId, product]) => ({ id: productId, ...product }));

    setFavoriteProducts(favorites);
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-amber-200 text-amber-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Banner data
  const banners = [
    {
      id: 1,
      title: "Premium Tech Components Curated by Experts",
      subtitle: "Our engineering team handpicks the highest quality components from trusted suppliers for your projects",
      bgImage: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
      buttonText: "Explore Components",
      buttonColor: "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transition-all duration-300",
      icon: <FileChartPie className="w-12 h-12 text-orange-400" />,
      overlay: "bg-gradient-to-br from-orange-900/10 to-pink-800/10",
      textColor: "text-white",
      badge: "Expert Verified",
      badgeColor: "bg-orange-500/30 text-orange-100 border border-orange-400/50",
      accentColor: "orange"
    },
    {
      id: 2,
      title: "Complete Project Kits & Bundles",
      subtitle: "Everything you need in one package - from microcontrollers to sensors and detailed instructions",
      bgImage: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      buttonText: "Browse Project Kits",
      buttonColor: "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transition-all duration-300",
      icon: <ToolCaseIcon className="w-12 h-12 text-orange-400" />,
       overlay: "bg-gradient-to-br from-orange-900/10 to-pink-800/10",
      textColor: "text-white",
      badge: "Complete Solution",
      badgeColor: "bg-purple-500/30 text-purple-100 border border-purple-400/50",
      highlight: "Beginner Friendly",
      highlightColor: "bg-orange-500/30 text-orange-100 border border-orange-400/50",
      accentColor: "orange"
    },
    {
      id: 3,
      title: "Industrial Grade Components",
      subtitle: "Premium quality components rated for commercial applications and advanced projects",
      bgImage: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg",
      buttonText: "View Industrial Range",
      buttonColor: "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transition-all duration-300",
      icon: <ShieldCheckIcon className="w-12 h-12 text-orange-400" />,
      overlay: "bg-gradient-to-br from-orange-900/10 to-pink-800/10",
      textColor: "text-white",
      badge: "Industrial Grade",
      badgeColor: "bg-pink-500/30 text-pink-100 border border-pink-400/50",
      stats: {
        rating: "4.8+",
        durability: "10,000+ hrs",
        warranty: "2 Years"
      },
      accentColor: "orange"
    },
    {
      id: 4,
      title: "SAMRATHA TECH Exclusive Bundles",
      subtitle: "Special curated packages with premium components, tools, and step-by-step project guides",
      bgImage: "https://images.pexels.com/photos/5474295/pexels-photo-5474295.jpeg",
      buttonText: "Shop Exclusive Bundles",
      buttonColor: "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transition-all duration-300",
      icon: <StarIcon className="w-12 h-12 text-orange-400" />,
      overlay: "bg-gradient-to-br from-orange-900/10 to-pink-800/10",
      textColor: "text-white",
      badge: "SAMRATHA Exclusive",
      badgeColor: "bg-orange-500/30 text-orange-100 border border-orange-400/50",
      highlight: "Limited Availability",
      highlightColor: "bg-pink-500/10 text-pink-100 border border-pink-400/10",
      accentColor: "orange"
    }
  ];

  // Product Card Component
  const ProductCard = ({ product }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-72 flex-shrink-0 overflow-hidden border border-gray-100 relative group"
    >
      <div className="relative">
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
        </div>

        {product.topBrand && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
            <Award className="w-3 h-3 mr-1" />
            Top Brand
          </div>
        )}

        {product.favorite && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white p-2 rounded-full shadow-md">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-md font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500 ml-1">({product.ratingCount || 0})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
            )}
          </div>
          {product.freeDelivery && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center">
              <Truck className="w-3 h-3 mr-1" />
              Free Delivery
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            View Details
          </Link>
          <a
            href={product.referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-14 w-14 border-4 border-amber-500 border-t-transparent mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600 font-medium">Loading curated products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Banner with Background Images */}
      <div className="relative h-[32rem] md:h-[40rem] overflow-hidden">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentBanner === index ? 1 : 0,
              transition: { duration: 1 }
            }}
            className={`absolute inset-0 flex items-center`}
            style={{
              backgroundImage: `url(${banner.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Background overlay with gradient */}
            <div className={`absolute inset-0 ${banner.overlay}`}></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 mb-6"
                >
                  {banner.icon}
                  <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${banner.textColor}`}>
                    {banner.title}
                  </h1>
                </motion.div>

                

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-xl md:text-2xl mb-8 ${banner.textColor}`}
                >
                  {banner.subtitle}
                </motion.p>

                {banner.highlight && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className={`inline-block ${banner.highlightColor} rounded-full px-5 py-2 mb-8 text-sm font-medium shadow-md`}
                  >
                    {banner.highlight}
                  </motion.div>
                )}

                {banner.partners && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mb-8"
                  >
                    <p className={`text-sm ${banner.textColor} mb-3`}>Trusted Partners:</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {banner.partners.map((partner, i) => (
                        <div key={i} className="bg-white/20 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="h-6 object-contain max-w-[100px]"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x30?text=' + partner.name;
                              e.target.className = 'h-6 object-contain max-w-[100px] bg-white p-1';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <Link
                    to="/products"
                    className={`${banner.buttonColor} px-8 py-3.5 rounded-lg text-lg font-medium transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg`}
                  >
                    {banner.buttonText}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}

      </div>

      {/* Favorites Section */}
      {favoriteProducts.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-full mr-4">
                  <Heart className="w-8 h-8 text-amber-600 fill-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Expert's Top Picks
                  </h2>
                  <p className="text-gray-600">Hand-selected by our product specialists</p>
                </div>
              </div>
              <Link
                to="/products?favorites=true"
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm md:text-base px-5 py-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                View All Favorites
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6">
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 bg-gray-50">
        {Object.keys(categorizedProducts).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Available</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">Our experts are curating the best products for you</p>
            <Link
              to="/products"
              className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Check Back Soon
            </Link>
          </div>
        ) : (
          Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-16">
              {/* Category Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {category}
                  </h2>
                  <p className="text-gray-600">Top picks in {category.toLowerCase()}</p>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm md:text-base px-5 py-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Products Grid - Horizontal Scrolling */}
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}

                  {/* View All Card */}
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8 text-center group"
                  >
                    <div className="bg-amber-100/50 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
                      <ChevronRight className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">View All {category}</h3>
                    <p className="text-sm text-gray-600">Browse our full collection</p>
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We take the hassle out of online shopping by providing expert-curated selections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted Reviews</h3>
              <p className="text-gray-600 text-sm">
                All products are tested and reviewed by our expert team before recommendation.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Deals</h3>
              <p className="text-gray-600 text-sm">
                We constantly monitor prices to bring you the best available deals.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Direct links to retailers with the fastest shipping options available.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600 text-sm">
                We only recommend products that meet our strict quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your perfect product?
          </h2>
          <p className="text-amber-100 mb-8 text-lg max-w-2xl mx-auto">
            Our experts have curated the best products from trusted partners to save you time and money
          </p>
          <Link
            to="/products"
            className="bg-amber-500 text-white hover:bg-amber-600 px-8 py-4 rounded-lg text-lg font-medium transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="w-6 h-6" />
            Explore All Products
          </Link>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <p className="text-amber-300 text-sm mb-2 font-medium">TRUSTED BY</p>
              <p className="text-white font-bold text-3xl mb-1">10,000+</p>
              <p className="text-gray-300 text-sm">Happy Customers</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <p className="text-amber-300 text-sm mb-2 font-medium">PRODUCTS FROM</p>
              <p className="text-white font-bold text-3xl mb-1">50+</p>
              <p className="text-gray-300 text-sm">Top Brands</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <p className="text-amber-300 text-sm mb-2 font-medium">AVERAGE RATING</p>
              <p className="text-white font-bold text-3xl mb-1">4.8/5</p>
              <p className="text-gray-300 text-sm">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;