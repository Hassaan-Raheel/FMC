/* ---Dashboard Section--- */
import Dashboard from "../Pages/Dashbaord";

/* ---Page Section--- */
import Header from "../Pages/Page/Header";
import HomePage from "../Pages/Page/Home";
import Categories from "../Pages/Page/Categories";
import ActiveSale from "../Pages/Page/ActiveSale";
import AboutPage from "../Pages/Page/About";
import Contact from "../Pages/Page/Contact";
import Financing from "../Pages/Page/Financing";
import ShippingDelivery from "../Pages/Page/Shipping";
import TermsConditions from "../Pages/Page/Terms";
import PrivacyPolicy from "../Pages/Page/PrivacyPolicy";
import ReturnPolicy from "../Pages/Page/ReturnPolicy";
import FAQs from "../Pages/Page/FAQs";
import FaqEdit from "../Components/FAQ-Components/FaqEdit/FaqEdit";
/* Sub-Component Page */
import EditSingleCategory from "../Components/CategoriesPageComponents/EditSingleCategory/EditSingleCategory";

/* ---E-Commerce Section--- */
import AllProducts from "../Pages/ECommerce/AllProducts";
import AllOrders from "../Pages/ECommerce/AllOrders";
import AddProducts from "../Pages/ECommerce/AddProducts";
import ProductsCat from "../Pages/ECommerce/ProductCat";
import ProductsTag from "../Pages/ECommerce/ProductTags";
import ProductsAttr from "../Pages/ECommerce/ProductAttr";
import ProductsFilters from "../Pages/ECommerce/ProductFilters";
import AllProductReviews from "../Pages/ECommerce/ProductReviews";
import AllCustomers from "../Pages/ECommerce/AllCustomers";
import ECommerceSettings from "../Pages/ECommerce/Settings";
/* CRUD Component E-Commerce */
import EditOrders from "../Components/ECommerceComponents/EditOrder";
import ViewOrders from "../Components/ECommerceComponents/ViewOrder";
import EditReviews from "../Components/ECommerceComponents/EditReviews";
import ViewReviews from "../Components/ECommerceComponents/ViewReviews";

/* ---Security Section--- */
import RateLimit from "../Pages/Security/RateLimit";
import FireWall from "../Pages/Security/FireWall";

/* ---Appointments Section--- */
import AllAppointments from "../Pages/Appointments/AllAppointments";
import AppointmentsPlanner from "../Pages/Appointments/AppointmentsPlan";

/* ---Analytics Section--- */
import OverviewAnalytics from "../Pages/Analytics/Overview";
import ProductsAnalytics from "../Pages/Analytics/Products";
import RevenueAnalytics from "../Pages/Analytics/Revenue";
import OrderAnalytics from "../Pages/Analytics/Order";

/* ---Marketing Section--- */
import Email from "../Pages/Marketing/Email";
import Facebook from "../Pages/Marketing/Facebook";
import Instagram from "../Pages/Marketing/Instagram";
import TikTokMarketing from "../Pages/Marketing/TikTok";
import GoogleMarketing from "../Pages/Marketing/Google";
import PostsPage from "../Marketing/Facebook/PostsPage";
import ReelsPage from "../Marketing/Facebook/ReelsPage";
import Covers from "../Marketing/Covers/Covers"
import InstagramPostsPage from "../Marketing/Instagram/InstagramPostsPage"
import InstagramReelsPage from "../Marketing/Instagram/InstagramReelsPage"
import AdsReportPage from "../Marketing/AdsReports/AdsReportsPage"
import GoogleAdsOverviewPage from "../Marketing/GoogleAds/GoogleAdsOverviewPage"
import MetaAdsPage from "../Marketing/MetaAds/MetaAdsPage"
import MetaAdsInsights from "../Marketing/InstagramAds/InstagramAds"
/* ---Settings Section--- */
import AllUsers from "../Pages/Users/AllUsers";
import UserHistory from "../Pages/Settings/UserHistory";
import TimeZones from "../Pages/Settings/TimeZones";

/* ---Forms Section--- */
import AllForms from "../Pages/Forms/AllForms";
import AddForm from "../Pages/Forms/AddForm";

/* ---Blogs Section--- */
import AllBlogs from "../Pages/Blogs/AllBlogs";
import AddBlogs from "../Pages/Blogs/AddBlogs";
import BlogCategories from "../Pages/Blogs/Categories";
import BlogTags from "../Pages/Blogs/BlogTags";

/* ---SEO Section--- */
import HomeSEO from "../Pages/SEO/Home";
import CategorySEO from "../Pages/SEO/Category";
import ActiveSaleSEO from "../Pages/SEO/ActiveSale";
import ProductArchiveSEO from "../Pages/SEO/ProductArchive";
import ProductPageSEO from "../Pages/SEO/Product";
import CartSEO from "../Pages/SEO/Cart";
import CheckOutSEO from "../Pages/SEO/CheckOut";
import TermsConditionSEO from "../Pages/SEO/Terms&Conditions";
import PrivacyPolicySEO from "../Pages/SEO/PrivacyPolicy";
import RefundPolicySEO from "../Pages/SEO/RefundPolicy";
import FinancingSEO from "../Pages/SEO/Financing";
import CareersSEO from "../Pages/SEO/Careers";
import ContactUsSEO from "../Pages/SEO/ContactUs";
import StoreLocatorSEO from "../Pages/SEO/StoreLocator";

/* ---Integration Section (Converted from Google Ads)--- */
import SearchConsole from "../Pages/Integrations/SearchConsole";
import Google from "../Pages/Integrations/Google";
import Bing from "../Pages/Integrations/Bing";
import Yahoo from "../Pages/Integrations/Yahoo";
import GoogleAnalytics from "../Pages/Integrations/GoogleAnalytics";
import GoogleTags from "../Pages/Integrations/GoogleTags";
import Meta from "../Pages/Integrations/Meta";
import TikTok from "../Pages/Integrations/TikTok";

/* ---Performance Section--- */
import InSights from "../Pages/Performance/InSight";
import DatabaseInsight from "../Pages/Performance/DatabaseInsight/DatabaseInsight";
import ServerLogs from "../Pages/Performance/ServerInsight/ServerLogs";

/* ---Add Ons Section--- */
import Coupons from "../Pages/AddOns/Coupons";
import PriceTags from "../Pages/AddOns/PriceTags";

const routes = [
  { path: "/Dashboard", component: Dashboard, protected: true },
  { path: "/Header-Footer", component: Header, protected: true },

  /* Page-Section */
  { path: "/Pages/About", component: AboutPage, protected: true },
  { path: "/Pages/Home", component: HomePage, protected: true },
  { path: "/Pages/Categories", component: Categories, protected: true },
  { path: "/Pages/Active-Sale", component: ActiveSale, protected: true },
  {
    path: "/Pages/Categories/:slug",
    component: EditSingleCategory,
    protected: true,
  },
  { path: "/Pages/Financing", component: Financing, protected: true },
  {
    path: "/Pages/Shipping-&-Delivery",
    component: ShippingDelivery,
    protected: true,
  },
  { path: "/Pages/Privacy-Policy", component: PrivacyPolicy, protected: true },
  { path: "/Pages/Return-Policy", component: ReturnPolicy, protected: true },
  { path: "/Pages/Contact", component: Contact, protected: true },
  {
    path: "/Pages/Terms-&-Conditions",
    component: TermsConditions,
    protected: true,
  },
  { path: "/Pages/faqs", component: FAQs, protected: true },
  { path: "/Pages/faq-edit", component: FaqEdit, protected: true },

  /* ECommerce-Section */
  { path: "/E-Commerce/All-Products", component: AllProducts, protected: true },
  { path: "/E-Commerce/All-Orders", component: AllOrders, protected: true },
  { path: "/E-Commerce/All-Orders/Edit-Orders", component: EditOrders, protected: true, },
  { path: "/E-Commerce/All-Orders/View-Orders", component: ViewOrders, protected: true, },
  { path: "/E-Commerce/Add-Product", component: AddProducts, protected: true },
  { path: "/E-Commerce/Edit-Product/:id", component: AddProducts, protected: true, },
  { path: "/E-Commerce/View-Product/:id", component: AddProducts, protected: true, },
  { path: "/E-Commerce/Product-Categories", component: ProductsCat, protected: true, },
  { path: "/E-Commerce/Product-Tags", component: ProductsTag, protected: true },
  { path: "/E-Commerce/Product-Attributes", component: ProductsAttr, protected: true, },
  { path: "/E-Commerce/Product-Filters", component: ProductsFilters, protected: true, },
  { path: "/E-Commerce/Product-Reviews", component: AllProductReviews, protected: true, },
  { path: "/E-Commerce/Product-Reviews/Edit-Review", component: EditReviews, protected: true, },
  { path: "/E-Commerce/Product-Reviews/View-Review", component: ViewReviews, protected: true, },
  { path: "/E-Commerce/Customers", component: AllCustomers, protected: true },
  { path: "/E-Commerce/Settings/:tab", component: ECommerceSettings, protected: true, },

  /* Appointments Section */
  { path: "/Appointments/All-Appointments", component: AllAppointments, protected: true },
  { path: "/Appointments/Appointments-Planner", component: AppointmentsPlanner, protected: true, },

  /* SEO Section */
  { path: "/SEO/Home", component: HomeSEO, protected: true },
  { path: "/SEO/Category", component: CategorySEO, protected: true },
  { path: "/SEO/Active-Sale", component: ActiveSaleSEO, protected: true },
  { path: "/SEO/Product-Archive", component: ProductArchiveSEO, protected: true },
  { path: "/SEO/Product", component: ProductPageSEO, protected: true },
  { path: "/SEO/Cart", component: CartSEO, protected: true },
  { path: "/SEO/CheckOut", component: CheckOutSEO, protected: true },
  { path: "/SEO/Terms-&-Conditions", component: TermsConditionSEO, protected: true },
  { path: "/SEO/Privacy-Policy", component: PrivacyPolicySEO, protected: true },
  { path: "/SEO/Refund-Policy", component: RefundPolicySEO, protected: true },
  { path: "/SEO/Financing", component: FinancingSEO, protected: true },
  { path: "/SEO/Careers", component: CareersSEO, protected: true },
  { path: "/SEO/Contact-Us", component: ContactUsSEO, protected: true },
  { path: "/SEO/Store-Locator", component: StoreLocatorSEO, protected: true },

  /* Analytics Section*/
  { path: "/Analytics/Overview", component: OverviewAnalytics, protected: true, },
  { path: "/Analytics/Products", component: ProductsAnalytics, protected: true, },
  { path: "/Analytics/Revenue", component: RevenueAnalytics, protected: true },
  { path: "/Analytics/Order", component: OrderAnalytics, protected: true },

  /* Forms Section */
  { path: "/Forms/All-Forms", component: AllForms, protected: true },
  { path: "/Forms/Add-Form", component: AddForm, protected: true },

  /* Blogs Section */
  { path: "/Blogs/All-Blogs", component: AllBlogs, protected: true },
  { path: "/Blogs/Add-Blog", component: AddBlogs, protected: true },
  { path: "/Blogs/Edit-Blog/:id", component: AddBlogs, protected: true, },
  { path: "/Blogs/View-Blog/:id", component: AddBlogs, protected: true, },
  { path: "/Blogs/Categories", component: BlogCategories, protected: true },
  { path: "/Blogs/Tags", component: BlogTags, protected: true },

  /* Marketing Section */
  
  { path: "/Marketing/Email", component: Email, protected: true },
  { path: "/Marketing/Facebook/Posts", component: PostsPage, protected: true },
  { path: "/Marketing/Facebook/Reels", component: ReelsPage, protected: true },
  { path: "/Marketing/Instagram/Posts", component: InstagramPostsPage , protected: true },
  { path: "/Marketing/Instagram/Reels", component: InstagramReelsPage , protected: true },
  { path: "/Marketing/Covers", component: Covers , protected: true },
  { path: "/Marketing/Overview", component: AdsReportPage, protected: true },
  { path: "/Marketing/Googleads/overview", component: GoogleAdsOverviewPage, protected: true },
  { path: "/Marketing/MetaAds/FacebookAds", component: MetaAdsPage,protected: true},
  { path: "/Marketing/MetaAds/InstagramAds", component: MetaAdsInsights,protected: true},


  /* Integration Section */
  { path: "/Integration/Search-Console", component: SearchConsole, protected: true },
  { path: "/Integration/Google", component: Google, protected: true },
  { path: "/Integration/Bing", component: Bing, protected: true },
  { path: "/Integration/Yahoo", component: Yahoo, protected: true },
  { path: "/Integration/Google-Analytics", component: GoogleAnalytics, protected: true, },
  { path: "/Integration/Google-Tags-Manager", component: GoogleTags, protected: true },
  { path: "/Integration/Meta", component: Meta, protected: true },
  { path: "/Integration/Tik-Tok", component: TikTok, protected: true },

  /* Performance Section */
  { path: "/Performance/In-Sight", component: InSights, protected: true },
  { path: '/Performance/Database-In-Sight', component: DatabaseInsight, protected: true },
  { path: '/Performance/Server-Logs', component: ServerLogs, protected: true },

  /* Security Section */
  { path: "/Security/Rate-Limit", component: RateLimit, protected: true },
  { path: "/Security/FireWall", component: FireWall, protected: true, },

  /* Add Ons Section */
  { path: "/Add-Ons/Coupons", component: Coupons, protected: true },
  { path: "/Add-Ons/Price-Tags", component: PriceTags, protected: true },

  /* Settings Section */
  { path: "/Settings/Users", component: AllUsers, protected: true },
  { path: "/Settings/History", component: UserHistory, protected: true },
  { path: "/Settings/Time-Zones", component: TimeZones, protected: true },
];

export default routes;