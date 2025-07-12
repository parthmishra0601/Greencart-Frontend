import React, { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

// Define the ALL_PRODUCTS array OUTSIDE the component to prevent re-creation on re-renders.
const ALL_PRODUCTS = [
  { id: 1, name: "Reusable Bottle", price: 10, category: "Kitchen", isSustainable: true, impact: { plastic: 0.1, water: 0.5, co2: 0.2, score: 5 } },
  { id: 2, name: "Bamboo Toothbrush", price: 5, category: "Personal Care", isSustainable: true, impact: { plastic: 0.05, water: 0.2, co2: 0.1, score: 4 } },
  { id: 3, name: "Organic T-Shirt", price: 15, category: "Clothing", isSustainable: true, impact: { plastic: 0, water: 10, co2: 1.5, score: 7 } },
  { id: 4, name: "Compost Bin", price: 25, category: "Home", isSustainable: true, impact: { plastic: 0.5, water: 0, co2: 0.5, score: 6 } },
  { id: 5, name: "Solar Light", price: 18, category: "Electronics", isSustainable: true, impact: { plastic: 0.02, water: 0, co2: 0.3, score: 5 } },
  { id: 6, name: "Eco Bag", price: 7, category: "Accessories", isSustainable: true, impact: { plastic: 0.08, water: 0.3, co2: 0.1, score: 4 } }, // Corrected impact to be an object
  { id: 7, name: "Recycled Plastic Pen", price: 3, category: "Stationery", isSustainable: true, impact: { plastic: 0.01, water: 0.1, co2: 0.05, score: 3 } },
  { id: 8, name: "Biodegradable Phone Case", price: 20, category: "Electronics", isSustainable: true, impact: { plastic: 0.03, water: 0, co2: 0.2, score: 6 } },
  { id: 9, name: "Upcycled Denim Pouch", price: 12, category: "Accessories", isSustainable: true, impact: { plastic: 0, water: 5, co2: 0.8, score: 7 } },
  { id: 10, name: "Disposable Plastic Cutlery", price: 8, category: "Kitchen", isSustainable: false, impact: { plastic: -0.2, water: -0.1, co2: -0.3, score: -2 } },
  { id: 11, name: "Conventional Toothpaste", price: 4, category: "Personal Care", isSustainable: false, impact: { plastic: -0.1, water: -0.05, co2: -0.1, score: -1 } },
  { id: 12, name: "Fast Fashion Jeans", price: 30, category: "Clothing", isSustainable: false, impact: { plastic: -0.3, water: -20, co2: -3, score: -5 } },
];

export default function Home() {
  const navigate = useNavigate();
  const { cartItems, addToCart, favoriteItems, toggleFavorite } = useCart();

  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedItemForAlternatives, setSelectedItemForAlternatives] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [showUserId, setShowUserId] = useState(false); // State for showing User ID
  const [userId, setUserId] = useState(""); // State for User ID

  // Environmental impact state, loaded from local storage
  const [environmentalImpact, setEnvironmentalImpact] = useState(
    JSON.parse(localStorage.getItem('environmentalImpact')) || { plastic: 0, water: 0, co2: 0, ecoScore: 0 }
  );

  const categories = ["All", "Kitchen", "Personal Care", "Clothing", "Home", "Electronics", "Accessories", "Stationery"];

  useEffect(() => {
    const parsedBudget = parseFloat(budget) || Infinity;
    const filtered = ALL_PRODUCTS.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const withinBudget = item.price <= parsedBudget;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && withinBudget && matchesSearch;
    });
    setFilteredItems(filtered);
    setAiSuggestions([]);
    // This was the problematic line:
    // setSelectedIte mForAlternatives(null);
    // Corrected to:
    setSelectedItemForAlternatives(null);
  }, [budget, category, searchTerm]); // Added searchTerm to dependency array

  // Effect to save environmental impact to local storage
  useEffect(() => {
    localStorage.setItem('environmentalImpact', JSON.stringify(environmentalImpact));
  }, [environmentalImpact]);

  // Effect to generate user ID on component mount (or refresh)
  useEffect(() => {
    // Generate a simple random alphanumeric ID
    const generateRandomId = () => {
      return 'user_' + Math.random().toString(36).substring(2, 11);
    };
    setUserId(generateRandomId());
  }, []); // Empty dependency array means this runs once on mount


  const suggestAlternatives = (item) => {
    const altMap = {
      "Reusable Bottle": [
        { id: 101, name: "Insulated Steel Bottle", price: 18, category: "Kitchen", reason: "Keeps drinks hot/cold for longer, reducing need for disposable cups.", isSustainable: true, impact: { plastic: 0.15, water: 0.7, co2: 0.3, score: 6 } },
        { id: 1012, name: "Collapsible Silicone Bottle", price: 14, category: "Kitchen", reason: "Space-saving and ideal for travel, reducing plastic use on the go.", isSustainable: true, impact: { plastic: 0.1, water: 0.4, co2: 0.25, score: 5 } },
      ],
      "Bamboo Toothbrush": [
        { id: 102, name: "Bioplastic Toothbrush", price: 8, category: "Personal Care", reason: "Made from plant-based materials, a more durable sustainable option.", isSustainable: true, impact: { plastic: 0.07, water: 0.25, co2: 0.15, score: 5 } },
        { id: 1022, name: "Recycled Plastic Toothbrush", price: 6, category: "Personal Care", reason: "Reduces plastic waste by using existing materials.", isSustainable: true, impact: { plastic: 0.06, water: 0.22, co2: 0.12, score: 4 } },
      ],
      "Organic T-Shirt": [
        { id: 103, name: "Hemp T-Shirt", price: 20, category: "Clothing", reason: "Hemp requires less water and no pesticides, highly durable.", isSustainable: true, impact: { plastic: 0, water: 12, co2: 1.8, score: 8 } },
        { id: 1032, name: "Linen T-Shirt", price: 22, category: "Clothing", reason: "Linen is durable, breathable, and made from flax, a low-impact crop.", isSustainable: true, impact: { plastic: 0, water: 11, co2: 1.6, score: 7 } },
      ],
      "Compost Bin": [
        { id: 104, name: "Vermicompost Bin", price: 40, category: "Home", reason: "Uses worms to process food scraps efficiently into nutrient-rich compost.", isSustainable: true, impact: { plastic: 0.6, water: 0, co2: 0.6, score: 7 } },
        { id: 1042, name: "Bokashi Composting Kit", price: 30, category: "Home", reason: "Ferments food waste, including meat and dairy, before burial or further composting.", isSustainable: true, impact: { plastic: 0.55, water: 0, co2: 0.55, score: 6 } },
      ],
      "Solar Light": [
        { id: 105, name: "Crank LED Lantern", price: 25, category: "Electronics", reason: "Hand-cranked, offering light without batteries or solar charging.", isSustainable: true, impact: { plastic: 0.03, water: 0, co2: 0.4, score: 6 } },
        { id: 1052, name: "Gravity Light", price: 30, category: "Electronics", reason: "Powers LED light using the force of gravity and a falling weight.", isSustainable: true, impact: { plastic: 0.04, water: 0, co2: 0.5, score: 7 } },
      ],
      "Eco Bag": [
        { id: 106, name: "Organic Cotton Mesh Bag", price: 8, category: "Accessories", reason: "Great for produce, breathable, and made from sustainable cotton.", isSustainable: true, impact: { plastic: 0.02, water: 0.4, co2: 0.15, score: 5 } },
        { id: 1062, name: "Recycled Sailcloth Tote", price: 25, category: "Accessories", reason: "Upcycled material, extremely durable and unique.", isSustainable: true, impact: { plastic: 0.1, water: 0.5, co2: 0.2, score: 8 } },
      ],
      "Recycled Plastic Pen": [
        { id: 107, name: "Sugar Cane Pen", price: 5, category: "Stationery", reason: "Made from renewable sugar cane, reducing reliance on fossil fuels.", isSustainable: true, impact: { plastic: 0.015, water: 0.12, co2: 0.07, score: 4 } },
        { id: 1072, name: "Seed Paper Pen", price: 6, category: "Stationery", reason: "Contains seeds to plant after use, leaving no waste.", isSustainable: true, impact: { plastic: 0.005, water: 0.08, co2: 0.03, score: 5 } },
      ],
      "Biodegradable Phone Case": [
        { id: 108, name: "Cork Phone Case", price: 25, category: "Electronics", reason: "Renewable, sustainable, and offers good protection.", isSustainable: true, impact: { plastic: 0.04, water: 0, co2: 0.25, score: 7 } },
        { id: 1082, name: "Plant-based Polymer Case", price: 20, category: "Electronics", reason: "Breaks down naturally, made from corn starch or similar plant materials.", isSustainable: true, impact: { plastic: 0.035, water: 0, co2: 0.22, score: 6 } },
      ],
      "Upcycled Denim Pouch": [
        { id: 109, name: "Recycled Plastic Bottle Pouch", price: 15, category: "Accessories", reason: "Turns ocean-bound plastic into a useful product.", isSustainable: true, impact: { plastic: 0.1, water: 0, co2: 0.1, score: 6 } },
        { id: 1092, name: "Hemp Zipper Pouch", price: 12, category: "Accessories", reason: "Durable and environmentally friendly material.", isSustainable: true, impact: { plastic: 0, water: 6, co2: 0.9, score: 7 } },
      ],
      "Disposable Plastic Cutlery": [
        { id: 110, name: "Compostable Cutlery Set (Corn Starch)", price: 10, category: "Kitchen", reason: "Breaks down naturally in industrial compost facilities.", isSustainable: true, impact: { plastic: 0.2, water: 0.1, co2: 0.3, score: 5 } },
        { id: 1102, name: "Reusable Bamboo Cutlery Set", price: 15, category: "Kitchen", reason: "Durable and can be used repeatedly, drastically reducing waste.", isSustainable: true, impact: { plastic: 0.3, water: 0.5, co2: 0.4, score: 7 } },
        { id: 1103, name: "Edible Cutlery (Wheat Flour)", price: 12, category: "Kitchen", reason: "You can eat them after use, leaving zero waste.", isSustainable: true, impact: { plastic: 0.25, water: 0.3, co2: 0.35, score: 8 } },
      ],
      "Conventional Toothpaste": [
        { id: 111, name: "Toothpaste Tablets with Fluoride", price: 7, category: "Personal Care", reason: "Plastic-free packaging and natural ingredients. Reduces water consumption.", isSustainable: true, impact: { plastic: 0.15, water: 0.08, co2: 0.12, score: 6 } },
        { id: 1112, name: "Natural Toothpowder", price: 6, category: "Personal Care", reason: "Often comes in glass jars, completely plastic-free and uses natural minerals.", isSustainable: true, impact: { plastic: 0.12, water: 0.06, co2: 0.09, score: 7 } },
        { id: 1113, name: "Refillable Toothpaste Dispenser", price: 18, category: "Personal Care", reason: "Reduces single-use plastic tubes by offering refillable options.", isSustainable: true, impact: { plastic: 0.2, water: 0.1, co2: 0.15, score: 8 } },
      ],
      "Fast Fashion Jeans": [
        { id: 112, name: "Second-hand Denim", price: 20, category: "Clothing", reason: "Extends product life and significantly reduces environmental impact of new production.", isSustainable: true, impact: { plastic: 0.1, water: 25, co2: 4, score: 9 } },
        { id: 1122, name: "Organic Hemp Jeans", price: 50, category: "Clothing", reason: "Hemp is an extremely sustainable crop, requiring less water and no pesticides.", isSustainable: true, impact: { plastic: 0.05, water: 22, co2: 3.5, score: 8 } },
        { id: 1123, name: "Recycled Denim Jeans", price: 40, category: "Clothing", reason: "Made from post-consumer denim, saving resources and reducing textile waste.", isSustainable: true, impact: { plastic: 0.08, water: 20, co2: 3.2, score: 8 } },
      ],
    };

    const parsedBudget = parseFloat(budget) || Infinity;
    const alternatives = (altMap[item.name] || []).filter(alt => alt.price <= parsedBudget);

    setAiSuggestions(alternatives);
  };

  const isFavorite = (item) => {
    return favoriteItems.some((fav) => fav.id === item.id);
  };

  const handleItemClick = (item) => {
    setSelectedItemForAlternatives(item);
    suggestAlternatives(item);
  };

  // Update environmental impact when adding sustainable alternative
  const handleAddToCartFromSuggestion = (item) => {
    addToCart(item); // Add to cart context
    if (item.isSustainable) {
      alert(`Added sustainable alternative "${item.name}" to cart!`);

      // Update environmental impact
      setEnvironmentalImpact(prevImpact => ({
        plastic: prevImpact.plastic + (item.impact?.plastic || 0),
        water: prevImpact.water + (item.impact?.water || 0),
        co2: prevImpact.co2 + (item.impact?.co2 || 0),
        ecoScore: prevImpact.ecoScore + (item.impact?.score || 0)
      }));
    } else {
      alert(`Added "${item.name}" to cart.`);
      // If a non-sustainable item is somehow added from suggestions (unlikely with current logic but good to handle)
      setEnvironmentalImpact(prevImpact => ({
        plastic: prevImpact.plastic + (item.impact?.plastic || 0),
        water: prevImpact.water + (item.impact?.water || 0),
        co2: prevImpact.co2 + (item.impact?.co2 || 0),
        ecoScore: prevImpact.ecoScore + (item.impact?.score || 0)
      }));
    }
    setAiSuggestions([]);
    setSelectedItemForAlternatives(null);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  // Function to reset environmental impact
  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your environmental impact data? This cannot be undone.")) {
      setEnvironmentalImpact({ plastic: 0, water: 0, co2: 0, ecoScore: 0 });
      localStorage.removeItem('environmentalImpact');
      alert("Your progress has been reset!");
    }
  };

  return (
    <div className="flex min-h-screen h-screen w-full overflow-hidden bg-gray-50 font-sans">
      <main className="flex-grow p-0 overflow-y-auto bg-gray-50">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-5 bg-white shadow-lg z-10 sticky top-0">
          <div className="flex items-center w-full max-w-lg relative">
            <FaSearch className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg" />
            <input
              type="text"
              placeholder="Search sustainable items..."
              value={searchTerm} // Bind input value to searchTerm state
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
          {/* Avatar with Tooltip */}
          <div
            className="relative"
            onMouseEnter={() => setShowUserId(true)}
            onMouseLeave={() => setShowUserId(false)}
          >
            <button className="text-4xl text-emerald-600 hover:text-emerald-700 transition-colors duration-200 ml-4">
              <FaUserCircle />
            </button>
            {showUserId && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white text-base rounded-md py-2 px-4 shadow-lg z-20">
                User ID: <span className="font-semibold">{userId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid for content sections */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Header Section */}
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 mb-4">
            <h2 className="text-5xl font-extrabold text-emerald-800 leading-tight">
              Shop Smart. <br className="hidden md:inline" /> Shop Green.
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Track your spending and save the planet — one cart at a time.
            </p>
          </div>

          {/* Budget & Category Filter Section */}
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 bg-white shadow-xl p-6 rounded-xl border border-gray-100">
            <label htmlFor="budget-input" className="block text-gray-800 mb-3 text-xl font-semibold">
              Enter Your Shopping Budget
            </label>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <input
                id="budget-input"
                type="number"
                placeholder="$0.00"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-5 py-3 text-lg text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-5 py-3 text-lg text-gray-700 bg-white appearance-none pr-10 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Suggested Items (Filtered Products) */}
          <div className="lg:col-span-2 xl:col-span-3">
            <h3 className="text-2xl font-bold mb-4 text-emerald-800">Explore Our Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="relative h-28 bg-emerald-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <span className="text-emerald-300 text-6xl group-hover:scale-110 transition-transform duration-300">
                        {item.isSustainable ? "🌿" : "⚠️"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite(item) ? 'text-red-500' : 'text-gray-400'} hover:text-red-600 transition-colors duration-200`}
                      >
                        <FaHeart className="text-xl" />
                      </button>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h4>
                    <p className="text-md text-emerald-600 font-semibold">Price: ${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    <p className="text-sm text-gray-600 font-medium mt-2">
                      Click to see alternatives!
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-lg text-gray-600 col-span-full py-8 text-center bg-white rounded-xl shadow-lg border border-gray-100">
                  <span className="text-5xl mb-4 block">😔</span>
                  No items match your criteria. Try adjusting your budget or category!
                </p>
              )}
            </div>
          </div>

          {/* AI Suggestions Section (conditionally rendered) */}
          {aiSuggestions.length > 0 && (
            <div className="lg:col-span-2 xl:col-span-3 bg-white p-6 shadow-xl rounded-xl border border-gray-100 mt-8">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">
                Sustainable Alternatives for {selectedItemForAlternatives ? selectedItemForAlternatives.name : "Selected Item"}
              </h3>
              <p className="text-md text-gray-700 mb-6">
                Consider these greener options instead:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {aiSuggestions.map((suggestion, idx) => (
                  <div key={suggestion.id || `sugg-${idx}`} className="bg-emerald-50 p-5 shadow-lg rounded-xl border border-emerald-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-28 bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <span className="text-emerald-400 text-6xl">🌎</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(suggestion);
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite(suggestion) ? 'text-red-500' : 'text-gray-400'} hover:text-red-600 transition-colors duration-200`}
                      >
                        <FaHeart className="text-xl" />
                      </button>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">{suggestion.name}</h4>
                    <p className="text-md text-emerald-600 font-semibold">Price: ${suggestion.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{suggestion.category}</p>
                    {suggestion.reason && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        🌟 <strong>Why better:</strong> {suggestion.reason}
                      </p>
                    )}
                    <button
                      className="mt-3 bg-white text-emerald-700 py-2 px-4 rounded-lg border border-emerald-300 hover:bg-emerald-100 transition-all duration-200"
                      onClick={() => handleAddToCartFromSuggestion(suggestion)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Your Favorite Items Section (displays favorites from context) */}
          <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100 self-start">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
              <FaHeart className="text-red-500 mr-2 text-3xl" /> Your Favorites
            </h3>
            {favoriteItems.length > 0 ? (
              <div className="space-y-3">
                {favoriteItems.map((item) => (
                  <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-emerald-400 mr-3 text-3xl">🌿</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} - {item.category}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                      className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <FaHeart className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-600">No favorite items yet. Click the <FaHeart className="inline text-red-400" /> on items you love!</p>
            )}
          </div>

          {/* Environmental Impact Section */}
          <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100 self-start">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Your Environmental Impact</h3>
            <ul className="text-lg text-gray-700 space-y-3">
              <li className="flex items-center"><span className="text-green-500 mr-3 text-2xl">♻️</span>Plastic Saved: <span className="font-semibold ml-2">{environmentalImpact.plastic.toFixed(2)}kg</span></li>
              <li className="flex items-center"><span className="text-blue-500 mr-3 text-2xl">💧</span>Water Saved: <span className="font-semibold ml-2">{environmentalImpact.water.toFixed(2)}L</span></li>
              <li className="flex items-center"><span className="text-gray-500 mr-3 text-2xl">💨</span>CO₂ Reduced: <span className="font-semibold ml-2">{environmentalImpact.co2.toFixed(2)}kg</span></li>
              <li className="flex items-center pt-2 border-t border-gray-200 mt-2">
                <span className="text-yellow-600 mr-3 text-2xl">🌟</span>Eco-Score:
                <span className={`font-extrabold text-xl ml-2 ${environmentalImpact.ecoScore >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {environmentalImpact.ecoScore}
                </span>
              </li>
            </ul>
            {/* Reset Environmental Impact Button */}
            <button
              onClick={resetProgress}
              className="mt-6 w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg border border-red-300 hover:bg-red-200 transition-all duration-200 flex items-center justify-center"
            >
              Reset Impact Data
            </button>
          </div>

          {/* Sustainability Tips Section */}
          <div className="bg-white p-6 shadow-xl rounded-xl lg:col-span-2 xl:col-span-3 border border-gray-100">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Sustainability Tips</h3>
            <ul className="text-lg text-gray-700 list-disc list-inside space-y-2">
              <li>Use **reusable shopping bags** when you go out.</li>
              <li>Opt for products with **biodegradable or minimal packaging**.</li>
              <li>**Buy local and seasonal products** to reduce carbon footprint.</li>
              <li>Reduce, Reuse, Recycle - in that order!</li>
            </ul>
          </div>

          {/* Cart Summary Section */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 shadow-xl rounded-xl border border-emerald-400 self-start">
            <h3 className="text-2xl font-bold mb-4">Your Cart Summary</h3>
            <div className="space-y-2 text-lg">
              <p className="flex justify-between items-center">Items: <span className="font-semibold text-xl">{cartItems.length}</span></p>
              <p className="flex justify-between items-center">Total: <span className="font-semibold text-xl">${cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2)}</span></p>
              <p className="flex justify-between items-center pt-2 border-t border-emerald-400 mt-2">
                Remaining Budget:
                <span className={`font-extrabold text-xl ${((parseFloat(budget) || 0) - cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)) < 0 ? 'text-red-200' : 'text-green-100'}`}>
                  {((parseFloat(budget) || 0) - cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)).toFixed(2)}
                </span>
              </p>
            </div>
            <button
              className="mt-6 w-full bg-white text-emerald-700 py-3 rounded-lg font-bold text-lg hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300 shadow-md"
              onClick={handleGoToCart}
            >
              Go to Cart ({cartItems.length})
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}