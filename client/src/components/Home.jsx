import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FiSearch, FiShoppingCart, FiChevronDown } from "react-icons/fi";
import {  ToastContainer } from 'react-toastify';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaMailBulk,
  FaClipboardList,
} from "react-icons/fa";
import { StarIcon } from '@heroicons/react/solid';

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { RiRobot2Line, RiAiGenerate } from "react-icons/ri";
import { BsStars } from "react-icons/bs";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import CartPage from "./Cart";

import WishlistPage from "./WishlistPage";
import axios from "axios";
import Contactme from "./Contact";
import SignUp from "./Signup";
import { toast } from "react-toastify";
import ProductList from "./ProductList";

import BookDetail from "./BookDetail";
import ReturnsAndRefund from "./ReturnsAndRefunds";
import {  FiMenu, FiX } from "react-icons/fi";
import HeroImage from "../Images/heroImage.png"
import ShippingPolicy from "./ShippingPolicy";
import Faqs from "./FAQS";
import Aboutus from "./Aboutus";
import AIChatAssistant from "./AIChatAssistant";
import AIRecommendations from "./AIRecommendations";
import BookSummaryModal from "./BookSummaryModal";
import AOS from "aos";
import "aos/dist/aos.css";
import BookClubPage from "./BookClubPage";
import UserOrders from "./Orders";
import PaymentSuccess from "./PaymentSuccessPage";
import TermsAndConditions from "./TermsConditions";

// 3D Book Model Component
function BookModel() {
  <mesh>
    <boxGeometry args={[1, 5, 2, 0.3]} />
    <meshStandardMaterial color="#6366f1" />
  </mesh>;
}

function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productList, setproductList] = useState([]);
  const [imageCarouselList,setImageCarouselList]=useState([]);
const [websiteratingList, setWebsiteratingList]=useState([]);

  const [isLogined, setIsLogined] = useState(false);
 const token=localStorage.getItem("token");
  //Ai Related-States
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showSummaryModel, setShowSummaryModel] = useState(false);
  const [currentBookSummary, setCurrentBookSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [nlpSearchResults, setNlpSearchResults] = useState([]);
  const [isNlpSearching, setIsNlpSearching] = useState(false);


  const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
   
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
     const [menuOpen, setMenuOpen] = useState(false);
  
   const[websiteData,setWebsiteData]=useState({author:"",reviewText:""})
const navigate=useNavigate();
  let [email, setEmail] = useState({
    email: "",
  });
  //Ai chat handler
  const handleAIChatSubmit = async (message) => {
    try {
      const response = await mockAIChatAPI(message);
      return response;
    } catch (e) {
      console.error("AI Chat Error :", e);
      return "Sorry,I'm having trouble understanding,Could your try again?";
    }
  };
  useEffect(()=>{
    AOS.init({duration :800});
  },[]);
  const mockAIChatAPI = async (message) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerMessage = message.toLowerCase();

  // Mapping of categories to book recommendations
  const recommendations = {
    all: [
      "Project Hail Mary (Sci-Fi)",
      "Klara and the Sun (Literary Fiction)",
      "The Midnight Library (Contemporary)"
    ],
    classic: [
      "Pride and Prejudice - Jane Austen",
      "1984 - George Orwell",
      "To Kill a Mockingbird - Harper Lee"
    ],
    fiction: [
      "The Kite Runner - Khaled Hosseini",
      "The Book Thief - Markus Zusak",
      "Life of Pi - Yann Martel"
    ],
    dystopian: [
      "1984 - George Orwell",
      "Brave New World - Aldous Huxley",
      "The Hunger Games - Suzanne Collins"
    ],
    fantasy: [
      "The Name of the Wind - Patrick Rothfuss",
      "Mistborn - Brandon Sanderson",
      "The Way of Kings - Brandon Sanderson"
    ],
    romance: [
      "The Hating Game - Sally Thorne",
      "Beach Read - Emily Henry",
      "Red, White & Royal Blue - Casey McQuiston"
    ],
    "literary fiction": [
      "Klara and the Sun - Kazuo Ishiguro",
      "Normal People - Sally Rooney",
      "The Goldfinch - Donna Tartt"
    ],
    mythology: [
      "Circe - Madeline Miller",
      "The Song of Achilles - Madeline Miller",
      "The Ramayana - R.K. Narayan"
    ],
    manga: [
      "Dragon Ball - Akira Toriyama",
      "Demon Slayer: Kimetsu no Yaiba - Koyoharu Gotouge",
      "Hunter x Hunter - Yoshihiro Togashi"
    ],
    thriller: [
      "Gone Girl - Gillian Flynn",
      "The Silent Patient - Alex Michaelides",
      "The Girl with the Dragon Tattoo - Stieg Larsson"
    ],
    contemporary: [
      "The Midnight Library - Matt Haig",
      "Where the Crawdads Sing - Delia Owens",
      "Little Fires Everywhere - Celeste Ng"
    ],
    science: [
      "A Brief History of Time - Stephen Hawking",
      "Sapiens - Yuval Noah Harari",
      "Astrophysics for People in a Hurry - Neil deGrasse Tyson"
    ]
  };

  // Greetings
  const greetings = ["hello", "hi"];
  const farewells = ["bye", "goodbye"];
  const ownerQueries = ["owner", "own", "who is the owner of this website?"];

  // Check for greetings
  if (greetings.some(word => lowerMessage.includes(word))) {
    return "Hello! I'm BookVerse AI. I can help you:\n- Find book recommendations\n- Get book summaries\n- Suggest books based on your preferences";
  }

  // Check for farewells
  if (farewells.some(word => lowerMessage.includes(word))) {
    return "Bye! See you later. Have a nice day!";
  }

  // Check for owner queries
  if (ownerQueries.some(word => lowerMessage.includes(word))) {
    return "The owner of BookVerse is 'Sanju'.";
  }

  // Check for book summary request
  if (lowerMessage.includes("summary") && lowerMessage.includes("book")) {
    return "I can provide summaries for books in our collection. Please mention the book title you're interested in.";
  }

  // Check for recommendations
  if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest")) {
    const category = Object.keys(recommendations).find(cat => lowerMessage.includes(cat));
    const books = recommendations[category] || recommendations.all;
    return `Here are some ${category || "popular"} book recommendations:\n- ${books.join("\n- ")}`;
  }

  // Default response
  return "I'm here to help you discover great books! You can ask me for:\n- Genre recommendations\n- Book summaries\n- Popular titles\nWhat are you in the mood to read today?";
};
  // Generate AI Book Summary
  const generateBookSummary = async (book) => {
    setIsGeneratingSummary(true);
    try {
      const summary = await mockSummaryAPI(book);
      setCurrentBookSummary(summary);
      setShowSummaryModel(true);
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error("Summary generation error:", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Mock Summary API
  const mockSummaryAPI = async (book) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return `${book.title} by ${book.author} is a ${
      book.category
    } book that has received an average rating of ${book.ratings}. 
    ${book.description.substring(
      0,
      300
    )}... [This is an AI-generated summary based on the book's metadata.]`;
  };

  const getAIRecommendations = async () => {
    try {
      // Only proceed if we have products
      if (productList.length === 0) {
        setAiRecommendations([]);
        return;
      }

      // Get user preferences
      const userPrefs = JSON.parse(localStorage.getItem("userPreferences")) || {
        preferredCategories: [],
        pastPurchases: [],
        wishlist: wishlist,
        browsingHistory: [],
      };

      // Get recommendations
      const recommendations = await mockRecommendationAPI(userPrefs);
      setAiRecommendations(recommendations || []); // Ensure we always set an array
    } catch (error) {
      console.error("Recommendation error:", error);
      toast.error("Failed to load recommendations");
      setAiRecommendations([]);
    }
  };

  const mockRecommendationAPI = async (userPrefs) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return empty array if no products
    if (productList.length === 0) {
      return [];
    }

    // Priority 1: Recommendations based on wishlist
    if (userPrefs.wishlist && userPrefs.wishlist.length > 0) {
      const similarToWishlist = productList.filter(
        (book) =>
          userPrefs.wishlist.some((w) => w.category === book.category) &&
          !userPrefs.wishlist.some((w) => w._id === book._id)
      );

      if (similarToWishlist.length > 0) {
        return similarToWishlist
          .sort((a, b) => b.ratings - a.ratings)
          .slice(0, 4)
          .map((book) => ({
            ...book,
            reason: `Similar to books in your wishlist`,
          }));
      }
    }

    // Priority 3: Recommendations based on browsing history
    if (userPrefs.browsingHistory && userPrefs.browsingHistory.length > 0) {
      const historyCategories = [
        ...new Set(userPrefs.browsingHistory.map((h) => h.category)),
      ];
      const recommendedByHistory = productList.filter((book) =>
        historyCategories.includes(book.category)
      );

      if (recommendedByHistory.length > 0) {
        return recommendedByHistory
          .sort((a, b) => b.ratings - a.ratings)
          .slice(0, 4)
          .map((book) => ({
            ...book,
            reason: `Based on your browsing history`,
          }));
      }
    }

    // Priority 4: Recommendations based on preferred categories
    if (userPrefs.preferredCategories.length > 0) {
      const recommendedByPref = productList.filter((book) =>
        userPrefs.preferredCategories.includes(book.category)
      );

      if (recommendedByPref.length > 0) {
        return recommendedByPref
          .sort((a, b) => b.ratings - a.ratings)
          .slice(0, 4)
          .map((book) => ({
            ...book,
            reason: `Matches your preferred categories`,
          }));
      }
    }

    // Default: General recommendations (top rated + popular)
    return productList
      .sort(
        (a, b) =>
          b.ratings * 0.7 +
          (b.popularity || 0) * 0.3 -
          (a.ratings * 0.7 + (a.popularity || 0) * 0.3)
      )
      .slice(0, 4)
      .map((book) => ({
        ...book,
        reason: `Popular in ${book.category}`,
      }));
  };

  // Usage in component - call this when user preferences change or component mounts
  useEffect(() => {
    getAIRecommendations();

    const handleRouteChange = () => {
      try {
        // Initialize currentBook as null
        let currentBook = null;
        const path = window.location.pathname;

        // Check if we're on a book detail page (route like '/book/:id')
        if (path.startsWith("/book/")) {
          // Extract book ID from URL
          const bookId = path.split("/").pop(); // More reliable than split('/')[2]

          // Find the book in productList (make sure productList is accessible in scope)
          currentBook = productList?.find((book) => book._id === bookId);
        }

        // If we found a book, update browsing history
        if (currentBook) {
          // Get existing preferences or initialize empty object
          const userPrefs =
            JSON.parse(localStorage.getItem("userPreferences")) || {};

          // Get existing history or initialize empty array
          const history = Array.isArray(userPrefs.browsingHistory)
            ? userPrefs.browsingHistory
            : [];

          // Create updated history:
          // 1. Filter out this book if it already exists
          // 2. Add current book to beginning (newest first)
          // 3. Limit to 10 most recent items
          const updatedHistory = [
            {
              _id: currentBook._id,
              title: currentBook.title,
              author: currentBook.author,
              category: currentBook.category,
              image: currentBook.image,
              price: currentBook.price,
              viewedAt: new Date().toISOString(),
            },
            ...history.filter((b) => b._id !== currentBook._id),
          ].slice(0, 10);

          // Save updated preferences
          localStorage.setItem(
            "userPreferences",
            JSON.stringify({
              ...userPrefs,
              browsingHistory: updatedHistory,
            })
          );
        }
      } catch (error) {
        console.error("Error handling route change:", error);
        
      }
    };

    // Add event listener for route changes
    window.addEventListener("routeChange", handleRouteChange);
    return () => window.removeEventListener("routeChange", handleRouteChange);
  }, [wishlist, productList]); // Re-run when wishlist or productList changes

  const handleNlpSearch = async (query) => {
    if (!query.trim()) {
      setNlpSearchResults([]);
      return;
    }

    setIsNlpSearching(true);
    try {
      const results = await mockNlpSearchAPI(query);
      setNlpSearchResults(results);
    } catch (error) {
      console.error("NLP Search error:", error);
      setNlpSearchResults([]);
    } finally {
      setIsNlpSearching(false);
    }
  };
  // Mock NLP Search API
  const mockNlpSearchAPI = async (query) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lowerQuery = query.toLowerCase();

    // Simple mock logic - in a real app this would be much more sophisticated
    if (lowerQuery.includes("best rated") || lowerQuery.includes("top rated")) {
      return productList.sort((a, b) => b.ratings - a.ratings).slice(0, 5);
    } else if (lowerQuery.includes("under") && lowerQuery.includes("rs")) {
      const price = parseInt(query.match(/under rs? ?(\d+)/i)?.[1] || 300);
      return productList.filter((book) => book.price < price);
    } else if (lowerQuery.includes("romance")) {
      return productList.filter((book) =>
        book.category.toLowerCase().includes("romance")
      );
    } else {
      return productList
        .filter(
          (book) =>
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      getAllproductList();
      await getAIRecommendations();
    };
    fetchData();

   
  }, []);

  useEffect(() => {
    if (productList.length > 0) {
      getAIRecommendations();
    }
  }, [wishlist, productList]);

  let handleSubmit = (e) => {
    e.preventDefault();
    if (!email.email.endsWith("@gmail.com")) {
      toast.error("incorrect email!!");
      return;
    }

    axios
      .post("http://localhost:8000/web/api/subscriber/subscriber-insert", email)
      .then((res) => {
       
        toast.success("You are Subscribed!!");

        setEmail({ email: "" });
        setSubscribed(true);
      });
  };
const shuffleArray=(array)=>{
  if(!array) return [];
  const shuffled=[...array];
  for(let i=shuffled.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
  }
  return shuffled;
}
  let getAllproductList = () => {
    axios
      .get("http://localhost:8000/web/api/books/books-view")
      .then((res) => {
       
        if (res.data.status === 1) {
          setproductList(shuffleArray(res.data.productList));
  
          getAIRecommendations(res.data.productList);
        } else {
        
          setproductList([]);
        }
      })
      .catch((err) => {
       
        setproductList([]);
      });
  };



  const addToCart = (book) => {
    if (isLogined) {
      setCart([...cart, book]);
    } else {
      toast.error("Please SignUp First!!");
      window.location.href = "/SignUp";
    }
  };

const removeBook = (book) => {
  if (isLogined) {
    // Check if book exists in cart
    const existingBookIndex = cart.findIndex((item) => item._id === book._id);
    
    if (existingBookIndex !== -1) {
      const updatedCart = [...cart];
      
      // Agar quantity 1 se zyada hai to sirf 1 kam kar
      if (updatedCart[existingBookIndex].quantity > 1) {
        updatedCart[existingBookIndex] = {
          ...updatedCart[existingBookIndex],
          quantity: updatedCart[existingBookIndex].quantity - 1
        };
        setCart(updatedCart);
      } else {
        // Agar quantity 1 hai to poora book remove kar
        updatedCart.splice(existingBookIndex, 1);
        setCart(updatedCart);
      }
    }
  } else {
    toast.error("Please SignUp First!!");
    window.location.href = "/SignUp";
  }
};
  const toggleWishlist = (book) => {
    if (wishlist.some((item) => item._id === book._id)) {
      setWishlist(wishlist.filter((item) => item._id !== book._id));
    } else {
      setWishlist([...wishlist, book]);
    }
  };

  const filteredBooks =
    productList &&
    Array.isArray(productList) &&
    productList.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageCarouselList.length - 1 ? 0 : prevIndex + 1
    );
  };
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Categories = useRef(null);
  const ContactSection=useRef(null);
  const OrdersSection=useRef(null);
  const handlePrev = () => {
    setCurrentIndex((prev) =>
    prev===0? imageCarouselList.length-1 :prev-1
    );
  };
useEffect(()=>{
  if(imageCarouselList.length===0) return;
  const interval=setInterval(()=>{
    setCurrentIndex((prev)=>
        prev === imageCarouselList.length - 1 ? 0 : prev + 1
  );
  },3000);

return ()=>clearInterval(interval);


},[imageCarouselList]);


  const scrollToCategories = () => {
    Categories.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    ContactSection.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToOrders = () => {
    OrdersSection.current.scrollIntoView({ behavior: "smooth" });
  };

  const categories = [
    "All",
    "classic",
    "fiction",
    "dystopian",
    "fantasy",
    "romance",
    "literary fiction",
    "mythology",
    "manga",
    "thriller",
    "contemporary",
    "science",
  ];




let ImageCarouselView = () => {
    axios
      .get("http://localhost:8000/web/api/ImageCarousel/ImageCarousel-view")
      .then((res) => {
       
        if (res.data.status === 1) {
         setImageCarouselList(Object.values(res.data.imageCarouselList));
         
        } else {
        
         setImageCarouselList([]);
        }
      })
      .catch((err) => {
       
       setImageCarouselList([]);
      });
  };

const handleWebSiteRatingChange = (e) => {
    setWebsiteData({ ...websiteData, [e.target.name]: e.target.value });
  }; 

const handleWebsiteRatingSubmit = async (e) => {
    e.preventDefault();
    if (userRating > 0) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const websitRatingData = {
          stars: userRating,
          reviewText: websiteData.reviewText,
          author: websiteData.author,
      
          
        };

        const response = await axios.post('http://localhost:8000/web/api/websiterating/websiterating-insert', websitRatingData);
        
       
          toast.success('Rating submitted successfully!');
          
        
        
        setUserRating(0);
       setWebsiteData({author:"",reviewText:""});
       fetchWebsiteRatings();
      } catch (err) {
        console.error('Error submitting rating:', err);
        setError('Failed to submit rating. Please try again.');
        toast.error('Failed to submit rating');
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  // Fetch ratings from backend
  const fetchWebsiteRatings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/web/api/websiterating/websiterating-view');
      if (response.data.status === 1) {
        setWebsiteratingList(response.data.websiteratingList); 
      } else {
        toast.error('Failed to fetch ratings');
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
      toast.error('Failed to load ratings');
    } finally {
      setIsLoading(false);
    }
  };













  useEffect(()=>{
    ImageCarouselView();
    fetchWebsiteRatings();

  }, [])
  
  
  useEffect(() => {
    getAllproductList();
    const storedIsLogined = localStorage.getItem("isLogined");

    if (storedIsLogined === "true") {
      setIsLogined(true);
    }
  }, []);

  const averageRating = websiteratingList.reduce((sum,r)=>sum+r.stars,0)/websiteratingList.length;

  if (isLoading) {
    return <div className="text-center py-4">Loading websiteratingList.stars...</div>;
  }
  return (
    
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
        <ToastContainer/>
        {/* AI Assistant Floating Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className="bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center"
            aria-label="AI Assistant"
          >
            <RiRobot2Line size={24} />
            {!showAIChat && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
              >
                AI
              </motion.span>
            )}
          </button>
        </motion.div>
        {/* AI Chat Assistant Modal */}
        <AIChatAssistant
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
          onSubmit={handleAIChatSubmit}
        />
<nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div id="home"data-aos="slide-down" className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-indigo-700"
        >
          <Link to="/">BookVerse</Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-indigo-600 text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-5 justify-between items-center">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleNlpSearch(e.target.value);
              }}
              placeholder="Search books..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            {searchTerm && (
              <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                {isNlpSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    Analyzing your query with AI...
                  </div>
                ) : nlpSearchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium border-b">
                      AI-Powered Results
                    </div>
                    {nlpSearchResults.map((book) => (
                      <Link
                        key={book._id}
                        to={`/book/${book._id}#bookdetail`}
                        className="block p-3 hover:bg-gray-50 border-b last:border-b-0"
                        onClick={() => setSearchTerm("")}
                      >
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-600">
                          {book.author}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-indigo-600 font-medium">
                            Rs {book.price}
                          </span>
                          <span className="text-yellow-500 text-sm">
                            {[...Array(5)].map((_, i) =>
                              i < Math.floor(book.ratings) ? (
                                <FaStar key={i} className="inline" />
                              ) : (
                                <FaRegStar key={i} className="inline" />
                              )
                            )}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="p-4 text-gray-500">
                    No results found. Try different keywords.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart#cart" className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="text-gray-700 relative"
            >
              <FiShoppingCart size={20} className="text-indigo-600" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Cart
              </span>
            </motion.button>
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist#wishlist" className="relative group">
            <FaHeart className="text-xl text-indigo-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Wishlist
            </span>
          </Link>

          {/* Orders */}
          <Link to="/yourOrders#orders" className="relative group" >
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="text-gray-700 relative"
              
            >
              <FaClipboardList size={20} className="text-indigo-600" />
              <span className="absolute -bottom-13 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Your Orders
              </span>
            </motion.button>
          </Link>

          {/* Login / User Icon */}
          {!isLogined ? (
            <Link to="/SignUp" className="text-indigo-600">
              Sign up
            </Link>
          ) : (
            <Link to="/SignUp">
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-medium">
                  {(
                    JSON.parse(
                      localStorage.getItem("rememberedSignUpData") || "{}"
                    )?.email?.charAt(0) ||
                    localStorage.getItem("lastEmail")?.charAt(0) ||
                    ""||JSON.parse(localStorage.getItem("googleEmail") || "{}")?.email?.charAt(0)
                  ).toUpperCase()}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div data-aos="slide-down" className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 flex flex-col space-y-4">
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              🛒 Cart ({cart.length})
            </Link>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
              ❤️ Wishlist ({wishlist.length})
            </Link>
            <Link to="/yourOrders" onClick={() => setMenuOpen(false)}>
              📦 Your Orders
            </Link>
            {!isLogined ? (
              <Link
                to="/SignUp"
                className="text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            ) : (
              <Link to="/SignUp" onClick={() => setMenuOpen(false)}>
                👤 Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 mb-12 md:mb-0"
            >
              <h1 data-aos="slide-right" className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Discover Your Next{" "}
                <span className="text-indigo-700">Favorite Book</span>
              </h1>
              <p data-aos="slide-right" className="text-xl text-gray-600 mb-8">
                Explore our curated collection of over 50,000 titles. Find your
                next adventure today.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                data-aos="slide-left"
                  onClick={scrollToCategories}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-700 text-white rounded-lg font-medium shadow-lg hover:bg-indigo-800 transition-colors"
                >
                  Browse Collection
                </motion.button>
                <motion.button
                data-aos="slide-left"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                   
                    navigate('/BookClubPage#bookClub')
                  }}
                  className="flex px-8 py-4 bg-white text-indigo-700 border border-indigo-700 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition-colors"
                >
                  Join Our Book Club
                </motion.button>
              </div>
              
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2 h-96 md:h-auto"
            >
               <div className="relative bg-transparent mt-8 lg:mt-0">
            <img
              src={HeroImage} 
              alt="Professional team member"
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </div> 
            </motion.div> 
          </div>
         

          <motion.div
            animate={{
              y: [0, -15, 0],
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
          >
            <FiChevronDown size={32} className="text-gray-400 animate-bounce" />
          </motion.div>
        </section>
       
        <section>
          <motion.section>
            <div className="relative w-full h-150">
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                
                {imageCarouselList.length > 0 && ( 
                  <img
                  src={imageCarouselList[currentIndex].image}
                  alt="Carousel Image"
                  className="w-full h-full object-fill"
                />)}
               
              </div>
              <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2  text-white p-2 rounded-full "
                onClick={handlePrev}
              >
                &#10094;
              </button>
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2  text-white p-2 rounded-full"
                onClick={handleNext}
              >
                &#10095;
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {imageCarouselList.map((item, index) => (
                  <div
                    key={item._id}
                    className={`w-2 h-2 rounded-full ${
                      currentIndex === index ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        </section>
      
        {/* Featured Books */}
        <section ref={Categories} className="py-20 px-6 bg-white">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="container mx-auto">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="text-center mb-16"
                    >
                      <h2 data-aos="slide-right" className="text-4xl font-bold text-gray-900 mb-4">
                        Featured Books
                      </h2>
                      <p data-aos="slide-left" className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Handpicked selections from our collection that you might
                        love
                      </p>
                    </motion.div>{" "}
                    {/* AI Recommendations Section */}
                    {aiRecommendations.length > 0 && productList.length > 0 && (
                      <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                          <h3 data-aos="slide-right" className="text-2xl font-bold text-gray-900 flex items-center">
                            <BsStars className="text-indigo-600 mr-2" />
                            AI-Personalized For You
                          </h3>
                          <button
                          data-aos="slide-left"
                            onClick={getAIRecommendations}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                          >
                            <RiAiGenerate className="mr-1" />
                            Refresh Recommendations
                          </button>
                        </div>

                        <AIRecommendations
                          recommendations={aiRecommendations}
                          onAddToCart={addToCart}
                          onToggleWishlist={toggleWishlist}
                          wishlist={wishlist}
                          onGenerateSummary={generateBookSummary}
                        />
                      </div>
                    )}
                    {/* Category Filter */}
                    <div ref={Categories} className="mb-8">
                      <h2 data-aos="slide-right" className="text-2xl font-semibold mb-4">
                        Categories
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button 
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full ${
                              selectedCategory === category
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-800"
                            } hover:bg-indigo-500 hover:text-white transition duration-300`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    {filteredBooks.length === 0 ? (
                      <div className="text-center py-12">
                        <p data-aos="slide-right" className="text-gray-500 text-lg">
                          No productList found matching your criteria.
                        </p>
                      </div>
                    ) : (
                      <div data-aos="slide-up" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredBooks.map((book) => (
                          <motion.div
                            key={book._id}
                            whileHover={{
                              y: -5,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                            }}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                          >
                            <Link to={`/book/${book._id}#bookdetail`}>
                              <div className="relative">
                                <img
                                 src={`http://localhost:8000${book.image}`} 
                                  alt={book.title}
                                  className="w-full h-64 object-cover"
                                />
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleWishlist(book);
                                  }}
                                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
                                >
                                  {wishlist.some(
                                    (item) => item._id === book._id
                                  ) ? (
                                    <FaHeart className="text-red-500" />
                                  ) : (
                                    <FaRegHeart className="text-gray-500" />
                                  )}
                                </button>
                              </div>
                            </Link>

                            <div className="p-4">
                              <Link to={`/book/${book._id}#bookdetail`}>
                                <h3 className="font-bold text-lg mb-1 line-clamp-1">
                                  {book.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 mb-2">
                                {book.author}
                              </p>

                              <div className="flex items-center mb-3">
                                {[...Array(5)].map((_, i) =>
                                  i < Math.floor(book.ratings) ? (
                                    <FaStar
                                      key={i}
                                      className="text-yellow-400"
                                    />
                                  ) : (
                                    <FaRegStar
                                      key={i}
                                      className="text-yellow-400"
                                    />
                                  )
                                )}
                                <span className="ml-1 text-gray-600">
                                  ({book.ratings})
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="font-bold text-indigo-700">
                                  Rs {book.price.toFixed(2)}
                                </span>
                                <button
                                  onClick={() => addToCart(book)}
                                  disabled={book.stock<=0}
                                  className={`${book.stock===0?"bg-red-600 hover:bg-red-700":"bg-indigo-600"} text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300`}
                                >
                                  {book.stock<=0? "Out Of Stock":"Add to Cart"}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              }
            />
            <Route
              path="/book/:_id"
              element={
                <BookDetail
                  books={productList}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  removeBook={removeBook}
                  
                />
              }
            />
            <Route
              path="/cart"
              element={<CartPage cart={cart} setCart={setCart} />}
            />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route
              path="/wishlist"
              element={
                <WishlistPage
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                />
              }
            />

            <Route path="/contactus" element={<Contactme />} />
            <Route
              path="/SignUp"
              element={
                <SignUp isLogined={isLogined} setIsLogined={setIsLogined} />
              }
            />
            <Route path="/ProductList" element={<ProductList />} />
            <Route path="/ReturnsAndRefund" element={<ReturnsAndRefund />} />
            <Route path="/Faqs" element={<Faqs />} />
            <Route path="/termsAndConditions" element ={<TermsAndConditions/>}/>
            <Route path="/ShippingPolicy" element={<ShippingPolicy />} />

            <Route path="/BookClubPage/*" element={<BookClubPage setWishlist={setWishlist} wishlist={wishlist} removeBook={removeBook}cart={cart} setCart={setCart}/>} />
            <Route path="/Aboutus" element={<Aboutus />} />
            <Route path="/yourOrders" element={<UserOrders />} />

          </Routes>
        </section>
        {/* Book Summary Modal */}
        <BookSummaryModal
          isOpen={showSummaryModel}
          onClose={() => setShowSummaryModel(false)}
          summary={currentBookSummary}
          isLoading={isGeneratingSummary}
        />

        {/* Testimonials */}
        <section  className="py-20 px-6 bg-white">
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="container mx-auto bg-white rounded-xl shadow-md p-6"
            >
      
      <h2 data-aos="slide-left" className="text-2xl font-semibold text-indigo-700 mb-4">Ratings & Reviews</h2>
      
      <div data-aos="slide-right" className="flex items-center mb-6">
        <div className="text-4xl font-bold mr-4">{String(averageRating)}</div>
        <div  className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-8 w-8 ${
                star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-gray-600">({websiteratingList.length} reviews)</span>
      </div>
      
      <form  onSubmit={handleWebsiteRatingSubmit} className="mb-6">
         <div
              
            >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`h-8 w-8 ${
                  star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
       </div>
        <label htmlFor="author" style={{ 
                  display: 'block', 
                  marginBottom: 8, 
                  fontWeight: 500, 
                  color: '#555' 
                }}>Your Name:</label>
           <input
           id="author"
                  type="text"
                  name="author"
                  value={websiteData.author}
                  onChange={handleWebSiteRatingChange}
                  
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
        
                  required
                />
                
        <textarea
        id="reviewText"
          name="reviewText"
          value={websiteData.reviewText}
          onChange={handleWebSiteRatingChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          placeholder="Write your review (optional)..."
          rows="3"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          disabled={userRating === 0 || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
     </motion.div>
          <div className="container mx-auto my-15">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 data-aos="fade up" className="text-4xl font-bold text-gray-900 mb-4">
                What Our Readers Say
              </h2>
              <p data-aos="slide-up" className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our Customers
              </p>
            </motion.div>

            <div data-aos="slide-right" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {websiteratingList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-4">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.author}</h4>
                      <p className="text-sm text-gray-600">Customers</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mt-6">{item.reviewText} </p>
                </motion.div>
              ))}
            </div>
             </div>
               
             </section>
             
         <section ref={ContactSection}> <Contactme /></section>
      
        
        {/* Newsletter */}
        {!subscribed ? (
          <section className="py-20 px-6 bg-gradient-to-r from-indigo-700 to-purple-700">
            <div className="container mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto"
              >
                <h2 data-aos="slide-right" className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Stay Updated
                </h2>
                <p data-aos="slide-left" className="text-xl text-indigo-100 mb-8">
                  Subscribe to our newsletter for the latest releases, exclusive
                  deals, and literary news
                </p>
                <form data-aos="slide-up" onSubmit={handleSubmit}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      name="email"
                      value={email.email}
                      onChange={(e) => setEmail({ email: e.target.value })}
                      type="email"
                      placeholder="Your email address"
                      className="flex-grow px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={email !== "" ? false : true}
                      className="px-8 py-4 bg-white text-indigo-700 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      Subscribe
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </section>
        ) : (
          <div className="py-20 px-6 bg-gradient-to-r from-indigo-700 to-purple-700 text-center">
            <h4 data-aos="slide-right" className="text-white mb-4">Thank You for Subscribing!</h4>
            <div data-aos="slide-left" className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-green-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p data-aos="slide-up" className="text-white mb-4">
              You've been successfully subscribed to our newsletter with{" "}
              <span className="text-white">email:{email.email}</span>.
            </p>
            <p data-aos="slide-up" className="text-white mb-6">
              Look forward to exclusive offers and new arrivals in your inbox!
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 px-6 ">
          <div className="container mx-auto ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-50 ">
              <div>
                <h3 data-aos="slide-right" className="text-2xl font-bold text-white mb-6">
                  BookVerse
                </h3>
                <p  data-aos="slide-right" className="text-gray-400 mb-6">
                  Your gateway to a world of literature. Discover, read, and
                  enjoy.
                </p>
                <div data-aos="slide-right" className="flex space-x-4">
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="mailto:godsanju21@gmail.com"
                    target="_blank "
                    rel="noopener noreferrer"
                  >
                    <FaMailBulk
                      size={20}
                      className="text-gray-400 hover:text-white transition-colors"
                    />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="https://www.facebook.com/profile.php?id=100093137492115"
                  >
                    <FaFacebook
                      size={20}
                      className="text-gray-400 hover:text-white transition-colors"
                    />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="https://www.instagram.com/notsxnju"
                  >
                    <FaInstagram
                      size={20}
                      className="text-gray-400 hover:text-white transition-colors"
                    />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="tel:+919877583155"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp
                      size={20}
                      className="text-gray-400 hover:text-white transition-colors"
                    />
                  </motion.a>
                </div>
              </div>
              <div data-aos="slide-right" className="mb-6 ">
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 mb-6">
                  <li>
                    <Link
                      to="/#home"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ProductList#productList"
                      className="text-gray-400 hover:text-white transition"
                    >
                      productList
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={scrollToCategories}
                      className="text-gray-400 hover:text-white transition"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/Aboutus#about"
                      className="text-gray-400 hover:text-white transition"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div data-aos="slide-right">
                <h4 className="text-lg font-semibold mb-6">Help</h4>
                <div>
                  <ul className="space-y-2 ">
                    <li>
                      <span
                        onClick={scrollToContact}
                        className="cursor-pointer text-gray-400 hover:text-white transition"
                      >
                        Contact Us
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/Faqs#faqs"
                        className="text-gray-400 hover:text-white transition"
                       
                      >
                        FAQs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/ShippingPolicy#shipping"
                        className="text-gray-400 hover:text-white transition"
                      >
                        Shipping Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/ReturnsAndRefund#returns"
                        className="text-gray-400 hover:text-white transition"
                      >
                        Returns & Refunds
                      </Link>
                    </li>
                      <li>
                      <Link
                        to="/termsAndConditions#terms"
                        className="text-gray-400 hover:text-white transition"
                      >
                       Terms and Conditions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div data-aos="slide-up" className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} BookVerse. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

  );
}

export default Home;
