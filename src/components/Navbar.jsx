/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo from "../assets/img/Logo.png";
import { MdShoppingBag } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import User from "../assets/img/user.png";
import storageService from "../service/storage.service";
import { getCartAPI } from "../service/cart.service";
import AddressSelect from "./DrawerHero";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { searchProduct } from "../service/products.service";

const Navbar = ({ active, userClickHandler }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("home");
  const user = storageService.get("user");

  console.log("User By OAUTH: ", user)
  const [cartItems, setCartItems] = useState([]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const getMyCart = async () => {
    const data = await getCartAPI(user?._id);
    if (data) {
      setCartItems(data?.data?.items);
    }
  };

  useEffect(() => {
    if (user) {
      let interval = setInterval(() => {
        getMyCart();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // Search functionality states
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  // Handle search input change and fetch suggestions from the backend
  const handleInputChange = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      try {
        const response = await searchProduct(e.target.value);
        setSuggestions(response.data);
        setSuggestionsVisible(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestionsVisible(false);
      }
    } else {
      setSuggestions([]); // Clear suggestions
      setSuggestionsVisible(false); // Hide the dropdown
    }
  };
  

  const handleSuggestionClick = (id) => {
    setSearchTerm("");
    setSuggestionsVisible(false);
    // Navigate to the product page with the product id
    navigate(`/product/${id}`);
  };

  return (
    <div className="mainnavbar">
      <div className="upnavbar">
        <div className="leftnav">
          <div className="logo flex gap-10 items-center">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
            <div>
              <AddressSelect/>
            </div>
          </div>

          {/* Search Bar */}
          <div className="leftnav-searchbar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Product"
              className="search-input outline-black"
              value={searchTerm}
              onChange={handleInputChange}
            />
            {/* Display search suggestions */}
            {suggestionsVisible && (
              <ul className="search-suggestions active">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.id)}
                    className="search-suggestion-item"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rightnav">
          {!user ? (
            <Link className="login" to="/login">
              Login
            </Link>
          ) : (
            <div className="flex gap-3">
              <div className="cartgroup gap-2">
                {user?.role === "Admin" && (
                  <Link
                    to="/admindashboard"
                    className="border rounded-full px-3 py-2 border-gray-400"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "Admin" ? "|" : ""}

                <div
                  className="rightnav-cart"
                  onClick={() => navigate("/mycart")}
                >
                  <HiOutlineShoppingBag className="shoping-bag " size={30} />
                  <span className="cart-count"></span>
                </div>
                <div
                  className="font-semibold flex gap-4"
                  onClick={() => navigate("/mycart")}
                >
                  <div className="text-lg md:text-xl">|</div>
                  <div className="text-lg md:text-xl">
                    CART ({cartItems?.length})
                  </div>
                </div>
              </div>

              <div
                onClick={userClickHandler}
                className=""
                id="user"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FEC500",
                  cursor: "pointer",
                  width: "3.5vw",
                  height: "3.5vw",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                {active === false ? (
                  <img className="w-full h-full rounded-full" src={User} alt="" />
                ) : (
                  <IoClose className="text-3xl text-semibold text-black" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="line-56"></div>
      <div className="bottomnav" style={{ paddingBottom: 0 }}>
        <div className="bottomnav-left btmleft">
          <Link
            to="/"
            className={`text-decoration-none ${
              activeLink === "home" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("home")}
          >
            <div className="home">Home</div>
          </Link>
          <Link
            to="/products"
            className={`text-decoration-none ${
              activeLink === "products" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("products")}
          >
            <div className="product">Products</div>
          </Link>
        </div>

        <div className="bottomnav-right">
          <Link to="/faq"
            style={{ overflow: "hidden" }}
            className={activeLink === "faqs" ? "active" : ""}
            onClick={() => handleLinkClick("faqs")}
          >
            <span className="renttt text-lg">FAQs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
