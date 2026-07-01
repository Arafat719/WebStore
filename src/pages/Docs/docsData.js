// WebMarketX Documentation Content Data
// Each section has subsections, each subsection has content blocks
// Block types: text, steps, list, note, tip, warning, faq

const docsData = [
  // ============================================
  // SECTION 1: WHAT IS WEBMARKETX
  // ============================================
  {
    id: "what-is-webmarketx",
    title: "What is WebMarketX?",
    icon: "Info",
    subsections: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "text",
            content:
              "WebMarketX is a digital marketplace where developers, designers, and entrepreneurs can buy and sell web-based digital products. Products include website templates, full-stack web applications, GitHub repositories, UI kits, SaaS starter kits, and more.",
          },
          {
            type: "text",
            content:
              "Every product on WebMarketX is backed by a real GitHub repository. When you purchase a product, you download the complete source code as a ZIP file — no locked files, no hidden dependencies.",
          },
          {
            type: "list",
            title: "Key Highlights",
            items: [
              {
                label: "Dual-role system",
                text: "Every user can both buy and sell. You don't need separate accounts.",
              },
              {
                label: "GitHub-verified products",
                text: "Sellers connect their GitHub repos. Buyers can preview the file structure before purchasing.",
              },
              {
                label: "Instant delivery",
                text: "Purchased products are available for immediate download as ZIP files.",
              },
              {
                label: "Free and paid products",
                text: "The marketplace supports both free and premium listings.",
              },
              {
                label: "Built-in review system",
                text: "Rate and review products after purchase to help other buyers.",
              },
              {
                label: "Custom requests",
                text: "Contact sellers directly to request modifications on any product.",
              },
              {
                label: "Smart Orders",
                text: "Request fully custom website development from the WebMarketX team.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 2: GETTING STARTED
  // ============================================
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "Rocket",
    subsections: [
      {
        id: "creating-account",
        title: "Creating an Account",
        blocks: [
          {
            type: "steps",
            items: [
              "Go to <a href='https://webmarketx.com/signup'>webmarketx.com/signup</a>.",
              "Enter your <strong>name</strong>, <strong>email address</strong>, and a <strong>password</strong> (minimum 8 characters).",
              "Click <strong>Sign Up</strong>.",
              "You're now logged in and can start browsing, purchasing, and using the marketplace.",
            ],
          },
          {
            type: "note",
            content:
              "By default, your account has the <strong>Buyer</strong> role. You can upgrade to a Seller at any time from your Settings.",
          },
        ],
      },
      {
        id: "google-signin",
        title: "Google Sign-In",
        blocks: [
          {
            type: "text",
            content:
              "You can also create an account or log in using your Google account for a faster experience.",
          },
          {
            type: "steps",
            items: [
              "On the Login or Signup page, click the <strong>Sign in with Google</strong> button.",
              "Select your Google account and authorize WebMarketX.",
              "Your account is created automatically using your Google profile information.",
            ],
          },
        ],
      },
      {
        id: "password-recovery",
        title: "Password Recovery",
        blocks: [
          {
            type: "text",
            content: "If you forget your password, you can reset it via email.",
          },
          {
            type: "steps",
            items: [
              "Go to <a href='https://webmarketx.com/forgot-password'>webmarketx.com/forgot-password</a>.",
              "Enter the email address associated with your account.",
              "Check your inbox for a reset email from WebMarketX.",
              "Click the reset link in the email. The link is valid for <strong>15 minutes</strong>.",
              "Enter your new password and confirm it.",
            ],
          },
          {
            type: "note",
            content:
              "Password recovery works for both Buyer and Seller accounts.",
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 3: BUYER GUIDE
  // ============================================
  {
    id: "buyer-guide",
    title: "Buyer Guide",
    icon: "ShoppingBag",
    subsections: [
      {
        id: "browsing-products",
        title: "Browsing Products",
        blocks: [
          {
            type: "text",
            content:
              "The homepage at <a href='https://webmarketx.com'>webmarketx.com</a> is the marketplace. All available products are displayed in a grid layout, 12 products per page.",
          },
          {
            type: "list",
            title: "Search & Filter Options",
            items: [
              {
                label: "Search",
                text: "Use the search bar to find products by name or keyword. Results update automatically as you type.",
              },
              {
                label: "Category filter",
                text: "Choose from: All, Templates, Websites, or Businesses.",
              },
              {
                label: "Price filter",
                text: "Filter by: All, Free, or Paid products.",
              },
              {
                label: "Sort",
                text: "Arrange results by newest first, oldest first, and other sorting options.",
              },
            ],
          },
          {
            type: "tip",
            content:
              "All filters work together — you can search for \"portfolio\" within \"Templates\" category, filtered to \"Free\" products, sorted by newest.",
          },
        ],
      },
      {
        id: "product-details",
        title: "Product Details Page",
        blocks: [
          {
            type: "text",
            content:
              "Click any product card to view its full details. The product page gives you all the information you need before making a decision.",
          },
          {
            type: "list",
            title: "What You'll Find",
            items: [
              {
                label: "Image gallery",
                text: "Browse through product screenshots and previews.",
              },
              {
                label: "Title & description",
                text: "Full details about what the product is and what it includes.",
              },
              {
                label: "Price",
                text: "Shows \"Free\" for free products or the price for paid ones.",
              },
              {
                label: "Live Preview",
                text: "If provided, see the product running live before buying.",
              },
              {
                label: "Tech stack",
                text: "Tags showing technologies used (e.g., React, Node.js, Tailwind).",
              },
              {
                label: "Features list",
                text: "Key features and what's included in the product.",
              },
              {
                label: "File structure viewer",
                text: "A tree view of the repository's folder and file structure — see exactly what you're getting before purchasing.",
              },
              {
                label: "Support & Documentation",
                text: "How long the seller provides support and whether docs are included.",
              },
              {
                label: "License",
                text: "The terms under which you can use the product.",
              },
              {
                label: "Reviews",
                text: "Read what other buyers have said and see the average rating.",
              },
              {
                label: "Developer info",
                text: "Seller's profile card with a link to their full profile.",
              },
              {
                label: "WhatsApp contact",
                text: "If the seller has added their number, contact them directly via WhatsApp.",
              },
            ],
          },
        ],
      },
      {
        id: "purchasing",
        title: "Purchasing a Product",
        blocks: [
          {
            type: "steps",
            items: [
              "Open the product detail page.",
              "Click the <strong>Buy Now</strong> button.",
              "The product is added to your library.",
              "Go to <a href='https://webmarketx.com/myorders'>My Orders</a> to download it.",
            ],
          },
          {
            type: "text",
            content:
              "After a successful purchase, you'll receive an in-app notification confirming the purchase.",
          },
          {
            type: "note",
            content:
              "Currently all products on WebMarketX are available for free as the platform is in its early launch phase. A paid payment system will be introduced in a future update.",
          },
        ],
      },
      {
        id: "downloading",
        title: "Downloading Your Purchase",
        blocks: [
          {
            type: "steps",
            items: [
              "Go to <strong>My Orders</strong> at <a href='https://webmarketx.com/myorders'>webmarketx.com/myorders</a>.",
              "Find your purchase in the <strong>Purchases</strong> tab.",
              "Click the <strong>Download</strong> button.",
              "The complete source code downloads as a <strong>ZIP file</strong> to your computer.",
            ],
          },
          {
            type: "tip",
            content:
              "You can download your purchased products as many times as you need. Each download is logged in your Download History.",
          },
          {
            type: "text",
            content:
              "When a seller lists a product, their GitHub repository is securely copied to WebMarketX's private storage. Sensitive files (like <code>.env</code> files) are automatically stripped for security. When you download, you receive the cleaned source code directly — you never need a GitHub account.",
          },
        ],
      },
      {
        id: "wishlist",
        title: "Wishlist",
        blocks: [
          {
            type: "text",
            content:
              "Save products you're interested in for later.",
          },
          {
            type: "list",
            title: "How It Works",
            items: [
              {
                label: "Save",
                text: "Click the Wishlist button on any product card to save it.",
              },
              {
                label: "View",
                text: "See all your wishlisted products in your Profile → Wishlist tab.",
              },
              {
                label: "Remove",
                text: "Remove items from your wishlist anytime.",
              },
            ],
          },
          {
            type: "note",
            content:
              "Your wishlist is private and visible only to you.",
          },
        ],
      },
      {
        id: "leaving-reviews",
        title: "Leaving Reviews",
        blocks: [
          {
            type: "text",
            content:
              "After purchasing a product, you can leave a review to share your experience and help other buyers.",
          },
          {
            type: "steps",
            items: [
              "Go to the product's detail page.",
              "Scroll to the <strong>Reviews</strong> section.",
              "Select a star rating (1 to 5 stars).",
              "Write your review.",
              "Click Submit.",
            ],
          },
          {
            type: "list",
            title: "Review Rules",
            items: [
              {
                label: "Purchase required",
                text: "You must have a completed purchase to review a product.",
              },
              {
                label: "One per product",
                text: "Only one review per product per user is allowed.",
              },
              {
                label: "Deletable",
                text: "You can delete your own reviews at any time.",
              },
              {
                label: "Public",
                text: "Reviews are visible to everyone. The product's rating is automatically recalculated.",
              },
            ],
          },
        ],
      },
      {
        id: "custom-requests",
        title: "Custom Requests",
        blocks: [
          {
            type: "text",
            content:
              "Want a modification or customization on an existing product? You can send a Custom Request directly to the seller.",
          },
          {
            type: "steps",
            items: [
              "On any product detail page, find the <strong>Custom Request</strong> option.",
              "Enter your <strong>name</strong>, <strong>email</strong>, and a <strong>message</strong> describing what you need.",
              "Submit the request.",
            ],
          },
          {
            type: "list",
            title: "What Happens Next",
            items: [
              {
                label: "Seller notified",
                text: "The seller receives an email notification and an in-app notification with your request details.",
              },
              {
                label: "30-minute window",
                text: "The seller has 30 minutes to respond to your request.",
              },
              {
                label: "Direct contact",
                text: "If the seller responds in time, they will contact you directly at the email you provided.",
              },
              {
                label: "Auto-escalation",
                text: "If the seller does not respond within 30 minutes, your request is automatically escalated to the WebMarketX team.",
              },
            ],
          },
          {
            type: "tip",
            content:
              "You don't need an account to submit a Custom Request — even visitors can contact sellers this way.",
          },
        ],
      },
      {
        id: "order-history",
        title: "Order History",
        blocks: [
          {
            type: "text",
            content:
              "Visit <a href='https://webmarketx.com/myorders'>webmarketx.com/myorders</a> to see your purchase activity.",
          },
          {
            type: "list",
            title: "What's Available",
            items: [
              {
                label: "Purchases tab",
                text: "All products you've purchased with order ID, product details, price, status, and download button.",
              },
              {
                label: "Transaction History",
                text: "Detailed log of all your purchase transactions with amounts and timestamps. Available in your Profile.",
              },
              {
                label: "Download History",
                text: "Record of every time you've downloaded a purchased product. Available in your Profile.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 4: SELLER GUIDE
  // ============================================
  {
    id: "seller-guide",
    title: "Seller Guide",
    icon: "Store",
    subsections: [
      {
        id: "becoming-seller",
        title: "Becoming a Seller",
        blocks: [
          {
            type: "text",
            content:
              "Any registered user can become a seller for free. No approval process, no waiting.",
          },
          {
            type: "steps",
            items: [
              "Go to <strong>Settings</strong> at <a href='https://webmarketx.com/settings'>webmarketx.com/settings</a>.",
              "Navigate to the <strong>Seller Settings</strong> section.",
              "Click <strong>Become a Seller</strong>.",
              "Your account is instantly upgraded.",
            ],
          },
          {
            type: "text",
            content:
              "After upgrading, your account has both <strong>Buyer</strong> and <strong>Seller</strong> roles — you can continue buying products while also listing your own. An <strong>\"Add Website\"</strong> button will appear in the navigation bar.",
          },
        ],
      },
      {
        id: "listing-product",
        title: "Listing a Product",
        blocks: [
          {
            type: "text",
            content:
              "To list a product on WebMarketX, click <strong>\"Add Website\"</strong> in the navbar or go to <a href='https://webmarketx.com/addproducts'>webmarketx.com/addproducts</a>.",
          },
          {
            type: "steps",
            title: "Step-by-Step Process",
            items: [
              "<strong>Connect your GitHub repository</strong> — Enter your repo URL and GitHub Personal Access Token (PAT). Click Verify to check access and retrieve repo metadata.",
              "<strong>Fill in product details</strong> — Title, description, price, category, preview links, tags, tech stack, features, support info, and license terms.",
              "<strong>Upload images</strong> — Drag and drop or click to upload product screenshots. Images are stored on Cloudinary.",
              "<strong>Submit</strong> — Agree to the terms of service and click Submit. Your product is live immediately.",
            ],
          },
          {
            type: "list",
            title: "Product Fields",
            items: [
              { label: "Title", text: "A clear, descriptive name (required)." },
              {
                label: "Description",
                text: "What the product is, what it does, and who it's for (required).",
              },
              {
                label: "Price",
                text: "Set a price or enter \"Free\" (required).",
              },
              {
                label: "Category",
                text: "Templates, Websites, Businesses, or Other.",
              },
              {
                label: "Preview Link",
                text: "A URL where buyers can preview the product.",
              },
              {
                label: "Live Preview URL",
                text: "A link to a live running instance.",
              },
              {
                label: "Tags",
                text: "Comma-separated keywords for search discoverability.",
              },
              {
                label: "Built With",
                text: "Technologies used (e.g., React, Node.js, MongoDB).",
              },
              {
                label: "Features",
                text: "A list of key features included.",
              },
              {
                label: "Support",
                text: "How long you'll provide support (e.g., \"6 months\").",
              },
              {
                label: "Documentation",
                text: "Whether documentation is included.",
              },
              {
                label: "License",
                text: "Custom license terms, or use the default Regular License.",
              },
            ],
          },
        ],
      },
      {
        id: "github-verification",
        title: "GitHub Repo Verification",
        blocks: [
          {
            type: "text",
            content:
              "WebMarketX requires every product to be backed by a real GitHub repository. Here's how the verification process works.",
          },
          {
            type: "steps",
            items: [
              "You provide your repository URL and a GitHub <strong>Personal Access Token (PAT)</strong>.",
              "WebMarketX verifies access and retrieves metadata (file count, language, stars, last commit).",
              "The repo is cloned to WebMarketX's private GitHub storage. All <code>.env</code> files are automatically removed for security.",
              "The stored copy is what buyers receive when they download the product.",
            ],
          },
          {
            type: "faq",
            items: [
              {
                q: "Why do I need a Personal Access Token?",
                a: "Your PAT allows WebMarketX to access your repo for the initial import. It's used only during the import process.",
              },
              {
                q: "What if I update my repo?",
                a: "The product reflects the version of the code at the time of import. To update, you would need to re-import the repo.",
              },
              {
                q: "Which .env files are removed?",
                a: "All variants: .env, .env.local, .env.production, .env.development, and any other .env.* files.",
              },
            ],
          },
        ],
      },
      {
        id: "managing-products",
        title: "Managing Your Products",
        blocks: [
          {
            type: "text",
            content:
              "Go to your <strong>Profile</strong> page and open the <strong>Products</strong> tab to manage your listings.",
          },
          {
            type: "list",
            title: "Available Actions",
            items: [
              {
                label: "Edit",
                text: "Click the edit button on any product to open the Edit Product modal. You can update the title, description, price, images, tech stack, features, license, and all other fields.",
              },
              {
                label: "Delete",
                text: "Remove a product listing permanently. A confirmation dialog will appear before deletion.",
              },
            ],
          },
        ],
      },
      {
        id: "handling-custom-requests",
        title: "Handling Custom Requests",
        blocks: [
          {
            type: "text",
            content:
              "When a buyer sends you a Custom Request, here's what you need to do.",
          },
          {
            type: "steps",
            items: [
              "You'll receive an <strong>email</strong> and an <strong>in-app notification</strong> with the buyer's name, email, and message.",
              "You have <strong>30 minutes</strong> to respond.",
              "Contact the buyer directly at the email they provided.",
              "Mark the request as \"replied\" in the system to prevent automatic escalation.",
            ],
          },
          {
            type: "warning",
            content:
              "If you don't respond within 30 minutes, the request is automatically escalated to the WebMarketX team, who will step in and contact the buyer on your behalf.",
          },
          {
            type: "tip",
            content:
              "Keep notifications enabled and check your email regularly so you don't miss custom requests.",
          },
        ],
      },
      {
        id: "sales-earnings",
        title: "Sales & Earnings",
        blocks: [
          {
            type: "text",
            content:
              "Track your sales through multiple views on the platform.",
          },
          {
            type: "list",
            title: "Where to Track",
            items: [
              {
                label: "My Orders → Sales Tab",
                text: "View all orders received, including buyer details, product, amount, and date.",
              },
              {
                label: "Profile → Transaction History",
                text: "Complete record of all sales and product listings with total earnings across all sales.",
              },
            ],
          },
        ],
      },
      {
        id: "public-seller-profile",
        title: "Public Seller Profile",
        blocks: [
          {
            type: "text",
            content:
              "Every seller has a public profile page that buyers can visit. It showcases your brand and products.",
          },
          {
            type: "list",
            title: "What's Displayed",
            items: [
              {
                label: "Profile info",
                text: "Your profile picture, name, bio, location, and website link.",
              },
              {
                label: "Social links",
                text: "Twitter, LinkedIn, and GitHub profiles.",
              },
              {
                label: "Ratings",
                text: "Your average rating and total reviews across all products.",
              },
              {
                label: "Products",
                text: "A grid of all your listed products.",
              },
              {
                label: "Reviews",
                text: "Customer reviews from your buyers.",
              },
            ],
          },
          {
            type: "tip",
            content:
              "Set up your seller profile from Profile → Profile Info tab. Add your name, bio, social links, WhatsApp number, shop name, and tagline to build trust with buyers.",
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 5: SMART ORDER SYSTEM
  // ============================================
  {
    id: "smart-orders",
    title: "Smart Order System",
    icon: "Wand2",
    subsections: [
      {
        id: "what-is-smart-order",
        title: "What is a Smart Order?",
        blocks: [
          {
            type: "text",
            content:
              "Smart Orders let you request fully custom website development from the WebMarketX team. This is different from Custom Requests (which go to individual sellers) — Smart Orders are handled by WebMarketX directly.",
          },
        ],
      },
      {
        id: "placing-smart-order",
        title: "Placing a Smart Order",
        blocks: [
          {
            type: "steps",
            items: [
              "Go to <a href='https://webmarketx.com/smart-order'>webmarketx.com/smart-order</a> (you must be logged in).",
              "Fill out the order form with your requirements.",
              "Submit the form.",
            ],
          },
          {
            type: "list",
            title: "Order Form Fields",
            items: [
              {
                label: "Order Type",
                text: "\"For Web Product\" (similar to an existing type) or \"For Own Business\" (fully custom).",
              },
              {
                label: "Site Type",
                text: "E-commerce, Portfolio, SaaS, Blog, Landing Page, Job Board, Directory, or Other.",
              },
              {
                label: "Features",
                text: "Describe the features you need in detail.",
              },
              {
                label: "Budget",
                text: "Enter your budget in USD.",
              },
              {
                label: "Deadline",
                text: "Choose your desired delivery date.",
              },
              {
                label: "Reference Link",
                text: "URL of a site you like as a reference (optional).",
              },
              {
                label: "UI/Design File",
                text: "Upload a mockup or reference image — JPG, PNG, WEBP, or PDF, max 10MB (optional).",
              },
              {
                label: "Notes",
                text: "Any additional information or special requirements.",
              },
            ],
          },
          {
            type: "text",
            content:
              "After submission, your order is saved with a \"Pending\" status. The WebMarketX team receives a notification, and you get an in-app confirmation. You can track your order status at any time from your profile.",
          },
          {
            type: "note",
            content:
              "Order statuses progress as: Pending → In Review → In Progress → Completed.",
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 6: ACCOUNT & SETTINGS
  // ============================================
  {
    id: "account-settings",
    title: "Account & Settings",
    icon: "Settings",
    subsections: [
      {
        id: "profile-settings",
        title: "Profile Settings",
        blocks: [
          {
            type: "text",
            content:
              "Access your settings at <a href='https://webmarketx.com/settings'>webmarketx.com/settings</a>. Update your personal information that's visible across the platform.",
          },
          {
            type: "list",
            title: "Editable Fields",
            items: [
              { label: "Name", text: "Your display name on the platform." },
              {
                label: "Bio",
                text: "A short description about yourself.",
              },
              { label: "Phone", text: "Your contact number." },
              { label: "Location", text: "Where you're based." },
              {
                label: "Website",
                text: "Your personal or business website URL.",
              },
            ],
          },
        ],
      },
      {
        id: "change-password",
        title: "Change Password",
        blocks: [
          {
            type: "text",
            content:
              "Update your account password from the Account section in Settings. Enter your current password and set a new one.",
          },
          {
            type: "note",
            content:
              "Password change is available for email/password accounts only. Google Sign-In accounts do not have a platform password.",
          },
        ],
      },
      {
        id: "notification-preferences",
        title: "Notification Preferences",
        blocks: [
          {
            type: "text",
            content:
              "Control what notifications you receive from the Preferences section in Settings.",
          },
          {
            type: "list",
            title: "Toggleable Notifications",
            items: [
              {
                label: "Messages",
                text: "Get notified about custom requests and messages.",
              },
              {
                label: "Sales",
                text: "Get notified when someone purchases your product (sellers).",
              },
              {
                label: "Purchases",
                text: "Get notified about your own purchase activity.",
              },
              {
                label: "Marketing",
                text: "Receive marketing updates and announcements.",
              },
              {
                label: "Push Notifications",
                text: "Enable or disable push notifications.",
              },
            ],
          },
        ],
      },
      {
        id: "theme",
        title: "Theme (Dark / Light Mode)",
        blocks: [
          {
            type: "text",
            content:
              "WebMarketX supports both dark and light themes. Toggle between them from the <strong>theme button</strong> in the navbar or from <strong>Settings → Preferences → Theme</strong>.",
          },
          {
            type: "note",
            content:
              "Your preference is saved automatically and persists across sessions. The default theme is dark mode.",
          },
        ],
      },
      {
        id: "seller-settings",
        title: "Seller Settings",
        blocks: [
          {
            type: "text",
            content:
              "If you're a seller, additional settings are available in the Seller Settings section.",
          },
          {
            type: "list",
            title: "Seller-Specific Settings",
            items: [
              {
                label: "Shop Name",
                text: "The name of your seller shop or brand.",
              },
              {
                label: "Tagline",
                text: "A short tagline for your shop.",
              },
              {
                label: "Category",
                text: "Your primary product category.",
              },
              {
                label: "Payout Preference",
                text: "How you'd like to receive earnings.",
              },
              {
                label: "Listing Visibility",
                text: "Control whether your listings are public or private (default: public).",
              },
            ],
          },
          {
            type: "tip",
            content:
              "If you're not yet a seller, this section shows the \"Become a Seller\" button. Becoming a seller is free and instant.",
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 7: NOTIFICATIONS
  // ============================================
  {
    id: "notifications",
    title: "Notifications",
    icon: "Bell",
    subsections: [
      {
        id: "notification-system",
        title: "How Notifications Work",
        blocks: [
          {
            type: "text",
            content:
              "WebMarketX has an in-app notification system. The notification bell icon in the navbar shows your unread count.",
          },
          {
            type: "list",
            title: "You'll Be Notified When",
            items: [
              {
                label: "Purchase successful",
                text: "You successfully purchase a product.",
              },
              {
                label: "New sale",
                text: "Someone buys your product (sellers).",
              },
              {
                label: "Custom request received",
                text: "A buyer sends you a custom request (sellers).",
              },
              {
                label: "Smart Order submitted",
                text: "Your Smart Order request is confirmed.",
              },
              {
                label: "Admin message",
                text: "The WebMarketX team sends you a message.",
              },
            ],
          },
          {
            type: "list",
            title: "Managing Notifications",
            items: [
              {
                label: "View",
                text: "Click the bell icon in the navbar to see your notifications.",
              },
              {
                label: "Mark as read",
                text: "Click a notification to mark it as read.",
              },
              {
                label: "Mark all as read",
                text: "Clear all unread notifications at once.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 8: REPORTING & SUPPORT
  // ============================================
  {
    id: "support",
    title: "Reporting & Support",
    icon: "LifeBuoy",
    subsections: [
      {
        id: "reporting-product",
        title: "Reporting a Product",
        blocks: [
          {
            type: "text",
            content:
              "If you find a product that violates platform rules, you can report it.",
          },
          {
            type: "steps",
            items: [
              "Go to the product's detail page.",
              "Click the <strong>\"Report Product\"</strong> button.",
              "Select a reason: Fake product, Wrong description, Scam/fraud, Inappropriate content, or Other.",
              "Add an optional message with more details.",
              "Submit the report.",
            ],
          },
          {
            type: "note",
            content:
              "Reports are sent to the WebMarketX admin team for review.",
          },
        ],
      },
      {
        id: "getting-help",
        title: "Getting Help",
        blocks: [
          {
            type: "text",
            content: "If you need help or have issues, we offer several support channels.",
          },
          {
            type: "list",
            title: "Support Options",
            items: [
              {
                label: "Live Chat",
                text: "Use the chat widget on the website for real-time support.",
              },
              {
                label: "Email",
                text: "Contact us at webmarketx1@gmail.com.",
              },
              {
                label: "Support Request",
                text: "Submit a support request through the platform with your subject and message.",
              },
              {
                label: "Help Page",
                text: "Visit webmarketx.com/help for guides and FAQs.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 9: LICENSE INFORMATION
  // ============================================
  {
    id: "license",
    title: "License Information",
    icon: "FileText",
    subsections: [
      {
        id: "license-overview",
        title: "Understanding Licenses",
        blocks: [
          {
            type: "text",
            content:
              "Every product on WebMarketX comes with a license that defines how you can use it. The default license is the <strong>Regular License</strong>.",
          },
          {
            type: "note",
            content:
              "Regular License: You can use the product in one personal or client project. Reselling or redistributing the product is strictly prohibited.",
          },
          {
            type: "text",
            content:
              "Individual sellers may set custom license terms for their products. Always check the License section on the product detail page before purchasing.",
          },
          {
            type: "list",
            title: "Key Points",
            items: [
              {
                label: "Per-product",
                text: "The license is displayed on every product's detail page.",
              },
              {
                label: "Seller-defined",
                text: "License terms are set by the seller and can vary between products.",
              },
              {
                label: "Need different terms?",
                text: "Contact the seller directly via Custom Request or WhatsApp for extended or commercial licensing.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // SECTION 10: FAQ
  // ============================================
  {
    id: "faq",
    title: "FAQ",
    icon: "HelpCircle",
    subsections: [
      {
        id: "general-faq",
        title: "Frequently Asked Questions",
        blocks: [
          {
            type: "faq",
            items: [
              {
                q: "How do I create an account?",
                a: "Visit webmarketx.com/signup and register with your email and password, or use Google Sign-In for instant account creation.",
              },
              {
                q: "Is it free to become a seller?",
                a: "Yes, becoming a seller is completely free. Go to Settings → Seller Settings and click \"Become a Seller.\"",
              },
              {
                q: "What types of products can I sell?",
                a: "You can sell website templates, full-stack web applications, landing pages, SaaS starter kits, UI kits, GitHub repositories, and other web-based digital products. Every product must be backed by a GitHub repository.",
              },
              {
                q: "How do I download a product after purchasing?",
                a: "Go to My Orders, find your purchase in the Purchases tab, and click the Download button. The product downloads as a ZIP file containing the complete source code.",
              },
              {
                q: "Can I download a product multiple times?",
                a: "Yes, you can re-download your purchased products as many times as you need.",
              },
              {
                q: "How does the file structure preview work?",
                a: "On every product page, there's a file tree viewer that shows the folder and file structure of the repository. This lets you see exactly what files are included before you buy.",
              },
              {
                q: "What happens to .env files?",
                a: "For security, all .env files are automatically removed when a seller imports their repository. You'll need to set up your own environment variables after downloading.",
              },
              {
                q: "How do Custom Requests work?",
                a: "On any product page, submit a Custom Request to the seller with your modification requirements. The seller has 30 minutes to respond. If they don't, the WebMarketX team steps in to help.",
              },
              {
                q: "What is a Smart Order?",
                a: "A Smart Order is a custom website development request handled by the WebMarketX team (not individual sellers). You describe what you need, set a budget and deadline, and the team builds it for you.",
              },
              {
                q: "How do reviews work?",
                a: "After purchasing a product, you can leave a star rating (1-5) and a written review. You can only review products you've purchased, and only one review per product.",
              },
              {
                q: "Can I contact a seller directly?",
                a: "Yes, in two ways: (1) Submit a Custom Request through the product page, or (2) If the seller has added their WhatsApp number, click the WhatsApp button to message them directly.",
              },
              {
                q: "How do I report a problem with a product?",
                a: "Click the \"Report Product\" button on the product page and select the appropriate reason. The WebMarketX team will review the report.",
              },
              {
                q: "Is there live chat support?",
                a: "Yes, the chat widget is available on the website for real-time support. You can also email webmarketx1@gmail.com.",
              },
              {
                q: "Can I use both dark and light mode?",
                a: "Yes, toggle between dark and light themes using the theme button in the navbar or through Settings → Preferences → Theme.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default docsData;
