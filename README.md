https://v0-blog-website-requirements-rho.vercel.app/
# Blog Website - Node.js & Express

A full-featured blog website built with Node.js, Express, and MongoDB. Features include rich text editing, image uploads, user authentication, and a complete admin dashboard.

## 🚀 Features

- **Rich Text Editor** - WYSIWYG editor using Quill.js
- **User Authentication** - Secure login/register system
- **Admin Dashboard** - Complete blog post management
- **Image Upload** - File upload with validation
- **SEO-Friendly URLs** - Automatic slug generation
- **Search Functionality** - Full-text search across posts
- **Responsive Design** - Mobile-friendly interface
- **Security** - Helmet, rate limiting, input validation

## 🛠 Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **multer** - File upload middleware
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting middleware

### Frontend
- **HTML5** - Markup language
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Client-side scripting
- **Quill.js** - Rich text editor

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd blog-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit `.env` file with your configuration:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/blog
   SESSION_SECRET=your-super-secret-session-key
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   \`\`\`

4. **Create uploads directory**
   \`\`\`bash
   mkdir uploads
   \`\`\`

5. **Start MongoDB**
   - For local MongoDB: `mongod`
   - Or use MongoDB Atlas cloud database

6. **Run the application**
   \`\`\`bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

7. **Access the application**
   - Home page: `http://localhost:3000`
   - Admin registration: `http://localhost:3000/register`
   - Admin login: `http://localhost:3000/login`
   - Admin dashboard: `http://localhost:3000/admin`

## 📁 Project Structure

\`\`\`
blog-website/
├── models/
│   ├── User.js          # User model schema
│   └── Post.js          # Blog post model schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── posts.js         # Blog post CRUD routes
│   └── upload.js        # File upload routes
├── middleware/
│   └── auth.js          # Authentication middleware
├── public/
│   ├── index.html       # Home page
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   ├── admin.html       # Admin dashboard
│   ├── create-post.html # Create post page
│   ├── edit-post.html   # Edit post page
│   ├── post.html        # Individual post view
│   └── styles.css       # Custom styles
├── uploads/             # Uploaded images directory
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md           # This file
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login admin user
- `POST /api/auth/logout` - Logout admin user

### Blog Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:slug` - Get single post by slug
- `POST /api/posts` - Create new post (admin only)
- `PUT /api/posts/:slug` - Update post (admin only)
- `DELETE /api/posts/:slug` - Delete post (admin only)
- `GET /api/posts/search?q=query` - Search posts

### File Upload
- `POST /api/upload` - Upload image file

## 🎯 Usage

### For Administrators

1. **Register an Admin Account**
   - Go to `/register`
   - Fill in username, email, and password
   - Click "Register"

2. **Login to Admin Dashboard**
   - Go to `/login`
   - Enter credentials
   - Access admin dashboard at `/admin`

3. **Create Blog Posts**
   - Click "Create New Post" in admin dashboard
   - Use the rich text editor to write content
   - Add images using the editor toolbar
   - Publish the post

4. **Manage Posts**
   - View all posts in admin dashboard
   - Edit existing posts
   - Delete posts
   - Search through posts

### For Visitors

1. **View Blog Posts**
   - Visit the home page to see all posts
   - Click on any post to read the full content
   - Use search functionality to find specific posts

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **Session Management** - Secure session handling
- **Rate Limiting** - Prevents spam and abuse
- **Input Validation** - Sanitizes user input
- **File Upload Security** - Validates file types and sizes
- **CORS Protection** - Configured for specific origins
- **Helmet Security** - Sets various HTTP headers
