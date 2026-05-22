# Vercel Deployment Configuration

This project is configured for deployment on Vercel (recommended for Next.js).

## Deployment Steps

### 1. Push to GitHub (When repository is created)
```bash
git push -u origin main
```

### 2. Deploy on Vercel

1. Visit https://vercel.com/new
2. Click "Import Git Repository"
3. Select "Anonymous-Feedback" repository
4. Vercel will auto-detect it's a Next.js project
5. Click "Deploy"

### 3. Configure Environment Variables in Vercel

In your Vercel project settings, add the following environment variables:

**Production Environment:**
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/mstrymessage?retryWrites=true&w=majority
NEXTAUTH_SECRET = generate-with-openssl-rand-base64-32
NEXTAUTH_URL = https://your-vercel-domain.vercel.app
RESEND_API_KEY = re_your_api_key
OPENAI_API_KEY = sk_your_openai_key
NODE_ENV = production
```

**Development Environment (Optional):**
```
NODE_ENV = development
```

### 4. Automatic Deployments

- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Automatic rollback on failed builds

## Security Notes

✅ **Secure Configuration:**
- `.env` file is in `.gitignore` - never committed
- Environment variables set in Vercel dashboard
- No secrets in repository
- `.env.example` provided as reference (no real keys)

✅ **After Deployment:**
- MongoDB credentials are environment variables
- Resend API keys are secure
- NextAuth secret is protected
- No sensitive data in git history

## Custom Domain (Optional)

1. In Vercel project settings
2. Go to "Domains"
3. Add your custom domain
4. Follow DNS configuration steps
5. Update `NEXTAUTH_URL` with new domain

## Monitoring & Support

- View logs: https://vercel.com/dashboard
- Analytics: Built-in performance monitoring
- Error tracking: Integrated error reporting
- Support: https://vercel.com/support
