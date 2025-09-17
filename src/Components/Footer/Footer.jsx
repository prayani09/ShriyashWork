import { 
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  Mail, Phone, MapPin, CreditCard, Truck, Shield, 
  RefreshCw, Award, ChevronUp, Heart, Star
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        "About Us",
        "Contact Us",
        "Track Your Order",
        "Size Guide",
        "FAQs",
        "Customer Reviews"
      ]
    },
    {
      title: "Categories",
      links: [
        "Living Room",
        "Bedroom",
        "Kitchen & Dining",
        "Home Décor",
        "Lighting",
        "Storage Solutions"
      ]
    },
    {
      title: "Customer Care",
      links: [
        "Shipping Info",
        "Returns & Exchanges",
        "Payment Methods",
        "Customer Support",
        "Bulk Orders",
        "Gift Cards"
      ]
    },
    {
      title: "Company",
      links: [
        "Careers",
        "Press",
        "Investor Relations",
        "Affiliate Program",
        "Become a Seller",
        "Privacy Policy"
      ]
    }
  ];

  const serviceFeatures = [
    {
      icon: <Truck size={28} />,
      title: "Free Shipping",
      description: "On orders above ₹999"
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <Shield size={28} />,
      title: "Secure Payment",
      description: "100% secure checkout"
    },
    {
      icon: <Award size={28} />,
      title: "Quality Promise",
      description: "Premium home products"
    }
  ];

  const socialLinks = [
    { icon: <Facebook size={24} />, name: "Facebook", url: "#", color: "hover:bg-blue-600" },
    { icon: <Twitter size={24} />, name: "Twitter", url: "#", color: "hover:bg-blue-400" },
    { icon: <Instagram size={24} />, name: "Instagram", url: "#", color: "hover:bg-pink-600" },
    { icon: <Youtube size={24} />, name: "YouTube", url: "#", color: "hover:bg-red-600" },
    { icon: <Linkedin size={24} />, name: "LinkedIn", url: "#", color: "hover:bg-blue-700" }
  ];

  const paymentMethods = [
    "Visa", "Mastercard", "UPI", "Paytm", "GPay", "PhonePe"
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      {/* Back to Top Button */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={scrollToTop}
            className="w-full py-4 text-sm font-semibold flex items-center justify-center gap-2 text-white hover:scale-105 transition-transform"
          >
            <ChevronUp size={18} />
            Back to top
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
    
      {/* Payment Methods & Bottom Bar */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900 to-black border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Payment Methods */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <CreditCard size={24} className="text-orange-400" />
              <span className="font-semibold text-lg">Secure Payments:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-600/50">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 <span className="text-orange-400 font-semibold">EmergeHome</span>. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Making homes beautiful, one piece at a time.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Cookie Policy</a>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-center mt-6 pt-6 border-t border-gray-600/30">
            <p className="text-sm text-gray-400">
              Developed with by 
              <span className="text-orange-400 font-semibold ml-1">WebReich Technologies</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;