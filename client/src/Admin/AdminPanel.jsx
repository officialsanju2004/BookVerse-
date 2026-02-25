import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Menu, X, TrendingUp, DollarSign, Package, Users, Calendar, Download, Filter } from "lucide-react";
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminPanel({ setIsAdmin }) {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [otpModal, setOtpModal] = useState({
    open: false,
    orderId: null,
    actualpayment: "",
  });
  const [otpInput, setOtpInput] = useState("");
  const [activeTab, setActiveTab] = useState("admin");
  const [subscriberList, setSubscriberList] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    dailySales: [],
    monthlySales: [],
    topProducts: [],
    paymentMethodStats: { cod: 0, online: 0 },
    recentTransactions: []
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    ratings: "",
    isbn: "",
    description: "",
    category: "",
    image: "",
    publicationDate: "",
    dimensions: "",
    pages: "",
    publisher: "",
    stock: "",
    _id: "",
    cost: "", // Adding cost field for profit calculation
  });
  const [ImageCarousel, setImageCarousel] = useState([]);
  const [ImageCarouselData, setImageCarouselData] = useState({ image: "" });

  // Calculate sales data from orders
  useEffect(() => {
    if (orders.length > 0) {
      calculateSalesData();
    }
  }, [orders]);

  const calculateSalesData = () => {
    // Filter only delivered orders
    const deliveredOrders = orders.filter(order => order.orderStatus === "delivered");
    
    // Calculate total revenue
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate total profit (assuming 40% margin on books)
    const totalProfit = deliveredOrders.reduce((sum, order) => {
  const orderProfit = order.items.reduce((itemSum, item) => {

    const book = books.find(b => b._id === item.bookId?._id);

    const price = Number(book?.price || item.bookId?.price || 0);
    const cost = Number(book?.cost || 0);
    const quantity = Number(item.quantity || 0);

    if (!price || !quantity) return itemSum;

    const profitPerItem = cost > 0
      ? (price - cost)
      : (price * 0.4); // fallback 40% margin

    return itemSum + (profitPerItem * quantity);

  }, 0);

  return sum + orderProfit;

}, 0);

    // Calculate average order value
    const averageOrderValue = deliveredOrders.length > 0 
      ? totalRevenue / deliveredOrders.length 
      : 0;

    // Prepare daily sales for last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailySales = last7Days.map(date => {
      const dayOrders = deliveredOrders.filter(order => 
        order.createdAt?.split('T')[0] === date
      );
      return {
        date,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length
      };
    });

    // Calculate payment method stats
    const paymentMethodStats = deliveredOrders.reduce((stats, order) => {
      const method = order.actualpaymentMethod || order.paymentMethod;
      if (method === 'cod') stats.cod++;
      else if (method === 'online') stats.online++;
      return stats;
    }, { cod: 0, online: 0 });

    // Get top products
    const productSales = {};
    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.bookId?._id;
        const productName = item.bookId?.title || 'Unknown Book';
        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.bookId?.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get recent transactions
    const recentTransactions = deliveredOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(order => ({
        id: order._id,
        date: order.createdAt,
        customer:  order.userId?._id|| "Guest"|| order.userId,
        amount: order.total,
        paymentMethod: order.actualpaymentMethod || order.paymentMethod,
        items: order.items.length
      }));

    setSalesData({
      totalRevenue,
      totalProfit,
      totalOrders: deliveredOrders.length,
      averageOrderValue,
      dailySales,
      monthlySales: [], // Can be implemented similarly
      topProducts,
      paymentMethodStats,
      recentTransactions
    });
  };

  // Chart configurations
  const revenueChartData = {
    labels: salesData.dailySales.map(d => d.date),
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: salesData.dailySales.map(d => d.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const paymentChartData = {
    labels: ['Cash on Delivery', 'Online'],
    datasets: [
      {
        data: [salesData.paymentMethodStats.cod, salesData.paymentMethodStats.online],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      }
    ]
  };

  const topProductsChartData = {
    labels: salesData.topProducts.map(p => p.name.substring(0, 15) + '...'),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: salesData.topProducts.map(p => p.revenue),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Revenue Trend',
        color: 'white'
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const handleImageCarouselSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("http://localhost:8000/web/api/ImageCarousel/ImageCarousel-insert", ImageCarouselData);
      setImageCarouselData({ image: "" });
      toast.success("Image Added Successfully!");
    } catch (error) {
      toast.error("Error in adding Image to Carousel!: ", error);
    }
  };

  const getImageCarousel = async () => {
    axios
      .get("http://localhost:8000/web/api/ImageCarousel/ImageCarousel-view")
      .then((res) => {
        if (res.data.status === 1) {
          setImageCarousel(res.data.imageCarouselList);
        } else {
          setImageCarousel([]);
        }
      })
      .catch((err) => {
        setImageCarousel([]);
      });
  };

  const handleImageCarouselDelete = async (id) => {
    try {
      Swal.fire({
        title: "Do you want to delete this Image from Image Carousel?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `http://localhost:8000/web/api/ImageCarousel/ImageCarousel-view/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          getImageCarousel();
          Swal.fire("Deleted!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("image is not deleted", "", "info");
        }
      });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleImageChange = (e) => {
    setImageCarouselData({ ...ImageCarouselData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/admin/order/order-view"
      );
      setOrders(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateStatus = async (orderId, status, actualpayment = null) => {
    try {
      await axios.put(`http://localhost:8000/admin/order/${orderId}/status`, {
        status,
        actualpayment,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleOtpSubmit = (order) => {
    if (!order.otp) {
      alert("⚠ OTP not generated yet. Wait until order is 'on-the-way'.");
      return;
    }
    if (!otpModal.actualpayment) {
      alert("⚠ Please select actual payment method before confirming.");
      return;
    }

    if (parseInt(otpInput) === order.otp) {
      updateStatus(order._id, "delivered", otpModal.actualpayment);
      setOtpModal({ open: false, orderId: null, actualpayment: "" });
      setOtpInput("");
    } else {
      alert("❌ Invalid OTP! Delivery cannot be confirmed.");
    }
  };

  const fetchBooks = async () => {
    axios
      .get("http://localhost:8000/web/api/books/books-view")
      .then((res) => {
        if (res.data.status === 1) {
          setBooks(res.data.productList);
        } else {
          setBooks([]);
        }
      })
      .catch((err) => {
        setBooks([]);
      });
  };

  const fetchsubscriberList = async () => {
    axios
      .get("http://localhost:8000/web/api/subscriber/subscriber-view")
      .then((res) => {
        if (res.data.status === 1) {
          setSubscriberList(res.data.subscriberList);
        } else {
          setSubscriberList([]);
        }
      })
      .catch((err) => {
        setSubscriberList([]);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.ratings < 0 || formData.ratings > 5) {
      toast.error("Ratings must be between 0 and 5!");
      return;
    }

    try {
      if (formData._id) {
        const result = await Swal.fire({
          title: "Do you want to update this Book and it's details?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
        });

        if (result.isConfirmed) {
          try {
            await axios.put(
              ` http://localhost:8000/web/api/books/product-update/${formData._id}`,
              formData,
              { headers: { Authorization: `Bearer ${token} ` } }
            );

            toast.success("Book Updated Successfully");
            fetchBooks();
            setFormData({
              title: "",
              author: "",
              price: "",
              ratings: "",
              isbn: "",
              description: "",
              category: "",
              image: "",
              publicationDate: "",
              dimensions: "",
              pages: "",
              publisher: "",
              stock: "",
              cost: "",
              _id: "",
            });
          } catch (err) {
            if (err.response && err.response.status === 401) {
              alert("⚠ Token Expired, Please Login Again!");
              localStorage.removeItem("token");
              setIsAdmin(false);
            } else {
              toast.error("Error updating book!");
            }
            console.error(err);
          }
        } else if (result.isDenied) {
          Swal.fire("Book is not updated", "", "info");
        }
      } else {
        const { _id, ...dataToInsert } = formData;

        try {
          await axios.post(
            `http://localhost:8000/web/api/books/books-insert`,
            dataToInsert,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success("Book Inserted Successfully");
          fetchBooks();
          setFormData({
            title: "",
            author: "",
            price: "",
            ratings: "",
            isbn: "",
            description: "",
            category: "",
            image: "",
            publicationDate: "",
            dimensions: "",
            pages: "",
            publisher: "",
            stock: "",
            cost: "",
            _id: "",
          });
        } catch (err) {
          if (err.response && err.response.status === 401) {
            alert("⚠ Token Expired, Please Login Again!");
            localStorage.removeItem("token");
            setIsAdmin(false);
          } else {
            toast.error("Error inserting book!");
          }
          console.error(err);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong!");
    }
  };

  const handleUpdate = (book) => {
    axios
      .get(`http://localhost:8000/web/api/books/books-update/${book}`)
      .then((res) => {
        let data = res.data.product;
        if (data.publicationDate) {
          data.publicationDate = new Date(data.publicationDate)
            .toISOString()
            .split("T")[0];
        }
        setFormData(data);
      });
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Do you want to delete this Book and it's details?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `http://localhost:8000/web/api/books/books-delete/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchBooks();
          Swal.fire("Deleted!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Book is not deleted", "", "info");
        }
      });
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const logOut = () => {
    Swal.fire({
      title: "Do you want to Log Out?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setIsAdmin(false);
        Swal.fire("Log Out!!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Log Out is not performed", "", "info");
      }
    });
  };

  const handleDeleteSubscriber = async (id) => {
    try {
      Swal.fire({
        title: "Do you want to delete this Subscriber and it's details?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `http://localhost:8000/web/api/subscriber/subscriber-delete/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchsubscriberList();
          Swal.fire("Deleted!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Subscriber is not deleted", "", "info");
        }
      });
    } catch (error) {
      console.error("Error deleting Subscriber:", error);
    }
  };

  const handleSendingOffers = async (email) => {
    if (!email || !email.includes("@")) {
      console.error("Invalid Email Address!");
      return;
    }
    const mailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    window.open(mailLink, "_blank");
  };

  const exportSalesData = () => {
    const dataStr = JSON.stringify(salesData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `sales-data-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    fetchBooks();
    fetchsubscriberList();
    getImageCarousel();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans p-8">
     
      {/* ✅ Responsive Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 shadow-lg">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-extrabold text-white drop-shadow-lg">
            Admin Control of BookVerse
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => setActiveTab("sales")}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === "sales"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-purple-50"
              }`}
            >
              📊 Sales Dashboard
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === "delivery"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-emerald-50"
              }`}
            >
              🚚 Delivery Panel
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-rose-50"
              }`}
            >
              ⚙ Admin Panel
            </button>
            <button
              onClick={() => setActiveTab("Subscriber Emails")}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === "Subscriber Emails"
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-rose-50"
              }`}
            >
              🔔 Subscriber Emails Panel
            </button>
            <button
              onClick={() => setActiveTab("ImageCarousel")}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === "ImageCarousel"
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-rose-50"
              }`}
            >
              🖼️ Image Carousel Panel
            </button>
            <button
              onClick={logOut}
              className="h-10 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-700 text-white transition-all hover:scale-105"
            >
              🚪 Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-rose-600" />
              ) : (
                <Menu className="w-7 h-7 text-rose-600" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3">
            <button
              onClick={() => {
                setActiveTab("sales");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-purple-500 text-white font-medium shadow"
            >
              📊 Sales Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("admin");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-rose-500 text-white font-medium shadow"
            >
              ⚙ Admin Panel
            </button>
            <button
              onClick={() => {
                setActiveTab("ImageCarousel");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-rose-500 text-white font-medium shadow"
            >
              🖼️ Image Carousel Panel
            </button>
            <button
              onClick={() => {
                setActiveTab("Subscriber Emails");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-rose-500 text-white font-medium shadow"
            >
              🔔 Subscriber Emails Panel
            </button>
            <button
              onClick={logOut}
              className="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow"
            >
              🚪 Logout
            </button>
            <button
              onClick={() => {
                setActiveTab("delivery");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium shadow"
            >
              🚚 Delivery Panel
            </button>
          </div>
        )}
      </header>
      
      <ToastContainer />

      {/* Sales Dashboard Tab */}
      {activeTab === "sales" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 mt-6"
        >
          {/* Header with Export */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
              📊 Sales Dashboard
            </h1>
            <button
              onClick={exportSalesData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all transform hover:scale-105"
            >
              <Download size={20} />
              Export Data
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-400">
                    ₹{salesData.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-green-400 opacity-50" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Profit</p>
                  <p className="text-3xl font-bold text-blue-400">
                    ₹{salesData.totalProfit.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-400 opacity-50" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {salesData.totalOrders}
                  </p>
                </div>
                <Package className="w-12 h-12 text-purple-400 opacity-50" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    ₹{salesData.averageOrderValue.toLocaleString()}
                  </p>
                </div>
                <Users className="w-12 h-12 text-yellow-400 opacity-50" />
              </div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-4">Revenue Trend (Last 7 Days)</h3>
              <div className="h-64">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Payment Methods Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-4">Payment Methods Distribution</h3>
              <div className="h-64">
                <Pie data={paymentChartData} options={{
                  plugins: {
                    legend: { labels: { color: 'white' } }
                  }
                }} />
              </div>
            </motion.div>

            {/* Top Products Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2"
            >
              <h3 className="text-xl font-bold mb-4">Top 5 Products by Revenue</h3>
              <div className="h-64">
                <Bar data={topProductsChartData} options={chartOptions} />
              </div>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Items</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {salesData.recentTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="p-3">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-mono">{transaction.id.slice(-6)}</td>
                        <td className="p-3">{transaction.customer}</td>
                        <td className="p-3">{transaction.items} items</td>
                        <td className="p-3 font-semibold text-green-400">
                          ₹{transaction.amount}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.paymentMethod === 'online' 
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {transaction.paymentMethod?.toUpperCase()}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}

      {activeTab === "admin" && (
        <>
          {/* Form Section */}
          <div className="bg-white/20 m-5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-extrabold text-white text-center mb-10 drop-shadow-lg">
              📚 Admin Panel - BookVerse
            </h1>
            <h2 className="text-2xl font-bold text-white mb-4">
              ➕ Add a New Book
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                { label: "Title", name: "title", type: "text" },
                { label: "Author", name: "author", type: "text" },
                { label: "Price", name: "price", type: "number" },
                { label: "Cost Price (for profit calc)", name: "cost", type: "number" },
                { label: "Ratings (Max - 5)", name: "ratings", type: "number" },
                { label: "Image URL", name: "image", type: "text" },
                { label: "Category", name: "category", type: "text" },
                { label: "ISBN", name: "isbn", type: "text" },
                { label: "Publisher", name: "publisher", type: "text" },
                { label: "Dimensions", name: "dimensions", type: "text" },
                { label: "Pages", name: "pages", type: "number" },
                { label: "Stock", name: "stock", type: "number" },
                {
                  label: "Publication Date",
                  name: "publicationDate",
                  type: "date",
                },
              ].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col">
                  <label
                    htmlFor={name}
                    className="text-sm font-semibold text-white mb-1"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${label}`}
                    required
                    className="px-4 py-2 rounded-xl border border-white/40 bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>
              ))}

              {/* Description as textarea */}
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-white mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Enter description"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-white/40 bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 mt-4 text-lg font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 hover:from-blue-500 hover:to-green-400 transition-all duration-500 transform hover:scale-105"
                >
                  {formData._id ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
          {/* Books List Section */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">📖 All Books</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-3">Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Cost</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 ? (
                    books.map((book) => (
                      <tr
                        key={book._id}
                        className="hover:bg-white/10 transition duration-200"
                      >
                        <td className="p-3">{book.title}</td>
                        <td className="p-3">{book.author}</td>
                        <td className="p-3">₹{book.price}</td>
                        <td className="p-3">₹{book.cost || 'N/A'}</td>
                        <td className="p-3">{book.category}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
                          >
                            ❌ Delete
                          </button>
                          <button
                            onClick={() => handleUpdate(book._id)}
                            className="px-7 mx-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition"
                          >
                            ✏️Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-200"
                      >
                        No books found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {activeTab === "Subscriber Emails" && (
        <> 
          <div className="bg-white/20 backdrop-blur-md my-15 rounded-2xl p-6 shadow-lg border border-white/30 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">📧 Subscriber Emails</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-white">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-3">Email</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriberList.length > 0 ? (
                    subscriberList.map((i) => (
                      <tr
                        key={i._id}
                        className="hover:bg-white/10 transition duration-200"
                      >
                        <td className="p-3">{i.email}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteSubscriber(i._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
                          >
                            ❌ Delete
                          </button>
                          <button
                            onClick={() => handleSendingOffers(i.email)}
                            className="px-7 mx-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition"
                          >
                            📩 Send Offers
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center py-6 text-gray-200"
                      >
                        No Subscriber found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {activeTab === "ImageCarousel" && (
        <>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md transition-transform duration-300 hover:scale-105">
              <h2 className="text-3xl font-bold text-center text-white mb-6">
                Add Image to Carousel
              </h2>
              <form onSubmit={handleImageCarouselSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-200 mb-2 font-medium">
                    Enter the Image URL for Carousel
                  </label>
                  <input
                    type="text"
                    name="image"
                    placeholder="Enter the url"
                    value={ImageCarouselData.image}
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 
                    focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300 
                  text-white font-semibold py-2 rounded-lg shadow-lg"
                >
                  Add to Carousel
                </button>
              </form>
            </div>
          </div>
      
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">📖 Carousel Images</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-3">Image</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ImageCarousel.length > 0 ? (
                    ImageCarousel.map((i) => (
                      <tr
                        key={i._id}
                        className="hover:bg-white/10 transition duration-200"
                      >
                        <td className="p-3">
                          <img
                            src={i.image}
                            alt="Carousel Image"
                            className="w-50 h-50 object-fill"
                          />
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleImageCarouselDelete(i._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
                          >
                            ❌ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center py-6 text-gray-200"
                      >
                        No images found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {activeTab === "delivery" && (
        <div className="text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
          <div className="p-6 min-h-screen">
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg overflow-hidden bg-white/20 rounded-2xl backdrop-blur-md shadow-lg border border-purple/30">
              <h1 className="mt-5 text-4xl font-extrabold text-white text-center mb-10 drop-shadow-lg">
                📦 Delivery Panel - BookVerse
              </h1>
              <table className="min-w-full">
                <thead className="bg-white/20">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Landmark</th>
                    <th className="p-3">Actual Payment Method</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3">Order Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="text-center p-6 text-gray-500">
                        🚫 No Orders Found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b text-center hover:bg-gray-50 hover:bg-white/10"
                      >
                        <td className="p-3 font-mono">{order._id.slice(-6)}</td>
                        <td className="p-3 font-semibold">
                          {order.userId?._id|| "Guest"|| order.userId}
                        </td>
                        <td className="p-3 text-left">
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.bookId?.title || "Book"} (x{item.quantity})
                            </div>
                          ))}
                        </td>
                        <td className="p-3 font-semibold">₹{order.total}</td>
                        <td className="p-3">
                          {order.paymentMethod?.toUpperCase()}
                        </td>
                        <td className="p-3">{order.address?.toUpperCase()}</td>
                        <td className="p-3">{order.phone?.toUpperCase()}</td>
                        <td className="p-3">{order.landmark?.toUpperCase()}</td>
                        <td className="p-3">
                          {order.actualpaymentMethod
                            ? order.actualpaymentMethod.toUpperCase()
                            : "--"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-white font-medium ${
                              order.paymentStatus === "paid"
                                ? "bg-green-500"
                                : order.paymentStatus === "pending"
                                ? "bg-yellow-500"
                                : order.paymentStatus === "failed"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          >
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">
                          {order.orderStatus.toUpperCase()}
                        </td>
                        <td className="p-3 flex flex-wrap justify-center gap-2">
                          {order.orderStatus === "placed" && (
                            <button
                              onClick={() => updateStatus(order._id, "shipped")}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg"
                            >
                              Ship
                            </button>
                          )}
                          {order.orderStatus === "shipped" && (
                            <button
                              onClick={() =>
                                updateStatus(order._id, "on-the-way")
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg"
                            >
                              On the Way
                            </button>
                          )}
                          {order.orderStatus === "on-the-way" && (
                            <button
                              onClick={() =>
                                setOtpModal({
                                  open: true,
                                  orderId: order._id,
                                  actualpayment: "",
                                })
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg"
                            >
                              Deliver
                            </button>
                          )}
                          {order.orderStatus !== "delivered" &&
                            order.orderStatus !== "cancelled" && (
                              <button
                                onClick={() =>
                                  updateStatus(order._id, "cancelled")
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
                              >
                                Cancel
                              </button>
                            )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {otpModal.open && (
              <div className="fixed inset-0 flex items-center justify-center text-black bg-opacity-50 z-50 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 p-6 rounded-lg shadow-xl w-96">
                  <h2 className="text-xl font-bold mb-4">
                    Enter OTP to Confirm Delivery
                  </h2>
                  <input
                    type="number"
                    placeholder="Enter OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-4"
                  />
                  <label className="block mb-2 font-semibold">
                    Select Actual Payment Method:
                  </label>
                  <select
                    value={otpModal.actualpayment}
                    onChange={(e) =>
                      setOtpModal({
                        ...otpModal,
                        actualpayment: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded mb-4"
                  >
                    <option value="">-- Select --</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="online">Online</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        setOtpModal({
                          open: false,
                          orderId: null,
                          actualpayment: "",
                        })
                      }
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleOtpSubmit(
                          orders.find((o) => o._id === otpModal.orderId)
                        )
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}