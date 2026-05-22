# Deployment Guide

This guide contains all necessary steps to deploy Mystery Message to production.

## Pre-Deployment Checklist

### Security
- [ ] Generate a strong `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Set `NODE_ENV=production` in environment
- [ ] Ensure HTTPS is enabled for your domain
- [ ] Configure CORS if using a separate frontend/backend
- [ ] Review all API endpoints for proper error handling
- [ ] Remove any debug logging before production
- [ ] Enable rate limiting for API endpoints
- [ ] Set up proper authentication timeouts

### Database
- [ ] Create MongoDB database (Atlas or self-hosted)
- [ ] Set up database backups and recovery plan
- [ ] Create indexes on frequently queried fields:
  ```javascript
  db.users.createIndex({ email: 1 }, { unique: true })
  db.users.createIndex({ username: 1 }, { unique: true })
  ```
- [ ] Test database connection string in production environment
- [ ] Implement database monitoring and alerts

### Email Service
- [ ] Set up Resend account and verify domain
- [ ] Update `RESEND_API_KEY` with production key
- [ ] Configure sender email address
- [ ] Test email verification workflow end-to-end
- [ ] Set up email templates for production

### Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all required production values:
  - `MONGODB_URI` - Production database URL
  - `NEXTAUTH_SECRET` - Generated secret key
  - `NEXTAUTH_URL` - Your production domain
  - `RESEND_API_KEY` - Production API key
  - `NODE_ENV=production`

### Build & Testing
- [ ] Run `npm run build` successfully
- [ ] Test production build locally: `npm start`
- [ ] Test all critical user flows:
  - User registration
  - Email verification
  - Login/logout
  - Send message
  - Delete message
  - Toggle message acceptance
- [ ] Run ESLint: `npm run lint`
- [ ] Check for TypeScript errors
- [ ] Test on different browsers and devices

### Performance
- [ ] Enable Next.js caching headers
- [ ] Set up CDN for static assets
- [ ] Configure image optimization
- [ ] Monitor Core Web Vitals
- [ ] Test page load times

## Deployment Platforms

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   ```
   MONGODB_URI
   NEXTAUTH_SECRET
   NEXTAUTH_URL
   RESEND_API_KEY
   NODE_ENV=production
   ```
4. Set `NEXTAUTH_URL` to your production domain
5. Deploy

### Docker + Server

1. Create and test Dockerfile:
   ```bash
   docker build -t mystery-message .
   docker run -p 3000:3000 mystery-message
   ```

2. Push to Docker registry (Docker Hub, ECR, etc.)

3. Deploy to your server using docker-compose or orchestration platform

### Ubuntu/Debian Server

```bash
# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
cd /var/www
git clone <repository-url>
cd mstrymessage
npm install
npm run build

# Create .env.local with production values

# Install PM2 for process management
npm install -g pm2
pm2 start npm --name "mystery-message" -- start
pm2 save
pm2 startup
pm2 logs mystery-message
```

## Post-Deployment

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up alerts for critical errors
- [ ] Monitor database performance
- [ ] Track email delivery rates

### Security Hardening
- [ ] Set up SSL/TLS certificate (Let's Encrypt)
- [ ] Configure security headers in next.config.ts
- [ ] Enable rate limiting on API endpoints
- [ ] Set up DDoS protection
- [ ] Regular security audits and dependency updates

### Backups
- [ ] Set up automated database backups
- [ ] Test restore process
- [ ] Document backup retention policy
- [ ] Set up log retention

### Maintenance
- [ ] Schedule regular dependency updates
- [ ] Plan for security patches
- [ ] Set up automated testing for deployments
- [ ] Document runbook for common issues

## Scaling Considerations

### Database Optimization
- Add database indexing as query patterns emerge
- Monitor slow query logs
- Consider read replicas for high traffic
- Implement caching layer (Redis)

### Application Performance
- Implement image optimization
- Set up CDN for static content
- Consider database query optimization
- Implement API response caching

### Load Balancing
- Multiple app instances behind load balancer
- Auto-scaling based on CPU/memory
- Health checks configured
- Session affinity if needed

## Rollback Plan

In case of issues in production:

1. Keep previous production build backed up
2. Document changes made in each deployment
3. Have database backup ready
4. Plan for zero-downtime rollback if possible

## Environment-Specific URLs

- **Development**: http://localhost:3000
- **Staging**: https://staging.yourdomain.com
- **Production**: https://yourdomain.com

## Support & Troubleshooting

### Common Issues

**Issue**: Database connection fails
- Verify MongoDB URI is correct
- Check network access from server
- Ensure credentials are correct

**Issue**: Email verification not sending
- Verify Resend API key
- Check domain verification in Resend
- Ensure sender email is configured

**Issue**: Authentication errors
- Verify `NEXTAUTH_URL` matches actual domain
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and retry

For more issues, refer to the main [README.md](./README.md)

---

**Last Updated**: May 2024
