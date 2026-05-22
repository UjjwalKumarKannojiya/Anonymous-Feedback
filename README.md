# Mystery Message - Anonymous Feedback Platform

A full-stack web application for secure anonymous messaging. Create a public profile, share your link, and receive honest feedback while maintaining complete anonymity.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## About

**Mystery Message** is a platform designed for users to receive anonymous feedback and messages. Whether you're a content creator, manager, or anyone seeking honest input, Mystery Message provides a secure, private way to collect feedback from others while protecting their anonymity.

### Use Cases

- **Workplace Feedback**: Managers collect anonymous team feedback
- **Content Creation**: Creators receive viewer suggestions and comments
- **Education**: Teachers gather anonymous student feedback
- **Personal Growth**: Get honest opinions from your network
- **Community Input**: Gather anonymous suggestions from community members

---

## Features

✅ **User Authentication**
- Secure email-based registration
- Email verification with OTP
- Bcryptjs password hashing
- JWT-based session management

✅ **Anonymous Messaging**
- Send messages without authentication
- No identity tracking or IP logging
- Optional custom message suggestions
- Real-time message delivery

✅ **Message Management**
- View all received messages
- Sort by recency
- Delete unwanted messages
- Message count tracking

✅ **Privacy Controls**
- Toggle message acceptance on/off
- Share unique profile links
- No message history without account
- No tracking of message senders

✅ **Security & Performance**
- End-to-end encryption ready
- CSRF protection
- Secure HTTP-only cookies
- Optimized database queries

✅ **User Experience**
- Dark theme with glassmorphism design
- Fully responsive (mobile/tablet/desktop)
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications
- Form validation with real-time feedback

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **React Hook Form** - Form state management
- **Zod** - Schema validation & type inference
- **shadcn/ui** - Accessible component library
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js** - Authentication & sessions
- **Mongoose** - MongoDB object modeling
- **Bcryptjs** - Password hashing
- **Resend** - Transactional email service

### Database
- **MongoDB** - NoSQL database
- **MongoDB Atlas** - Cloud-hosted MongoDB (optional)

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Build bundler

---

## Installation

### Prerequisites

Ensure you have the following installed:
- Node.js 18.0 or higher
- npm or yarn package manager
- MongoDB (local or MongoDB Atlas account)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mstrymessage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env .env.local
   # Edit .env.local with your credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# MongoDB Connection
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/mstrymessage?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Email Service (Resend)
RESEND_API_KEY="re_your_api_key_here"

# Optional: AI-powered message suggestions
OPENAI_API_KEY="sk_your_openai_key_here"

# Environment
NODE_ENV="development"
```

### MongoDB Atlas Setup (Cloud)

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create a free M0 cluster
3. Create database user with strong password
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Copy connection string and add to `.env.local`

### MongoDB Local Setup

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # macOS
   brew services start mongodb-community
   ```
3. Use connection string:
   ```
   MONGODB_URI="mongodb://localhost:27017/mstrymessage"
   ```

### NextAuth Secret Generation

```bash
# Generate secure secret
openssl rand -base64 32
```

---

## Usage

### For End Users

#### 1. Create Account
- Visit homepage and click "Get Started"
- Enter username, email, and password
- Verify email with OTP code
- Account is now active

#### 2. Share Your Profile
- After login, go to Dashboard
- Copy your unique profile link
- Share via social media, email, or messaging
- Friends can visit your link and send messages

#### 3. Receive Messages
- Messages appear in your dashboard inbox
- See message timestamps
- Read feedback from anonymous senders
- Delete messages you don't want

#### 4. Manage Settings
- Toggle "Accept Messages" on/off
- When off, no one can send you messages

### For Developers

#### Building for Production
```bash
npm run build
npm start
```

#### Development Mode
```bash
npm run dev
# Server runs on http://localhost:3000
```

#### Linting
```bash
npm run lint
```

---

## Project Structure

```
mstrymessage/
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication routes
│   │   │   ├── sign-up/      # User registration
│   │   │   ├── sign-in/      # User login
│   │   │   └── verify/       # Email verification
│   │   ├── (app)/            # Protected routes
│   │   │   ├── dashboard/    # User dashboard
│   │   │   └── layout.tsx
│   │   ├── api/              # API endpoints
│   │   │   ├── auth/         # Authentication
│   │   │   ├── sign-up/
│   │   │   ├── verify-code/
│   │   │   ├── send-message/
│   │   │   ├── get-messages/
│   │   │   ├── delete-message/
│   │   │   ├── accept-messages/
│   │   │   ├── check-username/
│   │   │   └── suggest-messages/
│   │   ├── u/                # Public profiles
│   │   │   └── [username]/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── page.tsx
│   ├── components/
│   │   ├── MessageCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ui/
│   ├── context/
│   │   └── AuthProvider.tsx
│   ├── helpers/
│   │   └── sendVerificationEmail.ts
│   ├── lib/
│   │   ├── dbConnect.ts
│   │   ├── resend.ts
│   │   └── utils.ts
│   ├── model/
│   │   └── User.ts
│   ├── schemas/
│   │   ├── signUpSchema.ts
│   │   ├── signInSchema.ts
│   │   ├── messageSchema.ts
│   │   ├── verifySchema.ts
│   │   └── acceptMessageSchema.ts
│   ├── types/
│   │   ├── ApiResponse.ts
│   │   └── next-auth.d.ts
│   └── messages.json
├── emails/
│   └── VerificationEmail.tsx
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
├── .env.local
└── README.md
```

---

## API Routes

### Authentication

**POST /api/auth/[...nextauth]**
- NextAuth handler for sign-in, sign-up, sessions

### User Management

**POST /api/sign-up**
- Register new user
- Request: `{ username, email, password }`

**POST /api/verify-code**
- Verify email with OTP code
- Request: `{ username, code }`

**GET /api/check-username**
- Check if username is available
- Query: `?username=desired_username`

### Messaging

**POST /api/send-message**
- Send anonymous message
- Request: `{ username, content }`

**GET /api/get-messages**
- Retrieve user's messages (requires auth)

**DELETE /api/delete-message/[messageid]**
- Delete a specific message (requires auth)

### Message Settings

**GET /api/accept-messages**
- Get message acceptance status (requires auth)

**POST /api/accept-messages**
- Toggle message acceptance (requires auth)
- Request: `{ acceptMessage: boolean }`

### Utilities

**POST /api/suggest-messages**
- Get AI-powered message suggestions

---

## Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  username: String (unique, 2-20 chars),
  email: String (unique, valid email),
  password: String (bcrypt hashed),
  verifyCode: String (6-digit OTP),
  verifyCodeExpiry: Date,
  isVerified: Boolean (default: false),
  isAcceptingMessages: Boolean (default: true),
  messages: [{
    content: String,
    createdAt: Date,
    _id: ObjectId
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security

### Implemented Measures

✅ **Authentication**
- JWT-based sessions with NextAuth
- HTTP-only secure cookies
- Email verification requirement

✅ **Password Security**
- Bcryptjs hashing (10 rounds)
- Minimum 8 characters required

✅ **Data Validation**
- Zod schema validation
- Server-side validation required

✅ **CSRF Protection**
- CSRF tokens on state-changing operations
- Same-site cookie policy

✅ **Database Security**
- MongoDB injection prevention
- Unique constraints on email/username

### Production Recommendations

- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Whitelist specific IPs in MongoDB
- [ ] Configure rate limiting
- [ ] Set up error monitoring
- [ ] Enable database backups
- [ ] Configure email rate limiting

---

## Deployment

### Environment Setup for Production

```bash
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/mstrymessage"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://yourdomain.com"
RESEND_API_KEY="re_your_production_key"
NODE_ENV="production"
```

### Build & Start

```bash
npm run build
npm start
```

### Vercel Deployment (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

---

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: bad auth : authentication failed`

**Solutions**:
1. Verify username and password are correct
2. Check if IP is whitelisted in MongoDB Atlas
3. Ensure user account hasn't been deleted

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Email Verification Not Working

1. Check RESEND_API_KEY is correct
2. Verify sender email is registered in Resend
3. Check spam folder
4. In development, check console for verification code

### TypeScript Errors

```bash
npx tsc --noEmit
```

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm start            # Start production server
npm run lint         # Lint code
```

---

## License

MIT License - see LICENSE file for details

---

**Version**: 1.0.0  
**Last Updated**: May 2026
