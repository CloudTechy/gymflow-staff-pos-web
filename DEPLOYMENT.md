# Deployment Guide

This guide covers deploying the GymFlow Staff POS application to production.

## Prerequisites

- Node.js 18+ installed
- Access to a web server or hosting platform
- Django REST API backend deployed and accessible
- SSL certificate for production (HTTPS required)

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Configure Environment Variables:**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_URL`: Your API URL (e.g., `https://api.gymflow.com/api`)
     - `NEXT_PUBLIC_WS_URL`: Your WebSocket URL (e.g., `https://api.gymflow.com`)

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build the project:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=.next
```

4. **Configure Environment Variables:**
   - Go to Netlify Dashboard > Site Settings > Environment Variables
   - Add the same variables as Vercel

### Option 3: Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. **Update next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // For Docker
}

module.exports = nextConfig
```

3. **Build and run:**
```bash
docker build -t gymflow-pos .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.gymflow.com/api \
  -e NEXT_PUBLIC_WS_URL=https://api.gymflow.com \
  gymflow-pos
```

### Option 4: Traditional Web Server (Nginx)

1. **Build the application:**
```bash
npm run build
npm run start
```

2. **Use PM2 to keep it running:**
```bash
npm install -g pm2
pm2 start npm --name "gymflow-pos" -- start
pm2 save
pm2 startup
```

3. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name pos.gymflow.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d pos.gymflow.com
```

## Environment Configuration

### Required Environment Variables

Create `.env.production` file:

```env
NEXT_PUBLIC_API_URL=https://api.gymflow.com/api
NEXT_PUBLIC_WS_URL=https://api.gymflow.com
```

### Environment-Specific Settings

**Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

**Staging:**
```env
NEXT_PUBLIC_API_URL=https://staging-api.gymflow.com/api
NEXT_PUBLIC_WS_URL=https://staging-api.gymflow.com
```

**Production:**
```env
NEXT_PUBLIC_API_URL=https://api.gymflow.com/api
NEXT_PUBLIC_WS_URL=https://api.gymflow.com
```

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] API endpoint accessible from deployment environment
- [ ] WebSocket endpoint accessible
- [ ] SSL certificate configured (production)
- [ ] CORS properly configured on API
- [ ] Database backups in place
- [ ] Monitoring tools set up

## Post-Deployment Steps

1. **Verify Deployment:**
   - Open the application URL
   - Test login functionality
   - Create a test shift
   - Make a test sale
   - Verify offline mode works
   - Check WebSocket connection

2. **Monitor Logs:**
   - Check application logs
   - Monitor API requests
   - Watch for errors or warnings

3. **Performance Testing:**
   - Test load times
   - Verify caching works
   - Check IndexedDB functionality
   - Test sync operations

4. **User Acceptance Testing:**
   - Have staff test the application
   - Verify all features work as expected
   - Gather feedback

## Troubleshooting Deployment Issues

### Build Fails

**Issue:** Build errors during deployment

**Solutions:**
- Check Node.js version compatibility
- Ensure all dependencies are installed
- Review error messages carefully
- Verify environment variables are set
- Check for syntax errors in code

### API Connection Issues

**Issue:** Cannot connect to API

**Solutions:**
- Verify API URL is correct
- Check CORS settings on API
- Ensure API is accessible from deployment server
- Verify SSL certificates are valid
- Check firewall rules

### WebSocket Connection Fails

**Issue:** Real-time features not working

**Solutions:**
- Verify WebSocket URL is correct
- Check if WebSocket port is open
- Ensure proxy (if any) supports WebSocket
- Check authentication token is valid
- Review WebSocket server logs

### Offline Mode Not Working

**Issue:** App doesn't work offline

**Solutions:**
- Verify Service Worker is registered
- Check IndexedDB is enabled in browser
- Ensure browser supports required features
- Check for errors in browser console
- Test in different browsers

## Security Considerations

### HTTPS Only

Always use HTTPS in production:
- Protects user credentials
- Required for Service Workers
- Ensures data integrity
- Builds user trust

### API Security

- Use JWT tokens for authentication
- Implement rate limiting
- Enable CORS properly
- Validate all inputs
- Keep dependencies updated

### Environment Variables

- Never commit `.env.local` or `.env.production`
- Use platform-specific secret management
- Rotate tokens regularly
- Limit access to sensitive variables

## Monitoring and Maintenance

### Recommended Monitoring

1. **Application Performance Monitoring (APM):**
   - New Relic
   - Datadog
   - Sentry for error tracking

2. **Server Monitoring:**
   - CPU usage
   - Memory usage
   - Disk space
   - Network traffic

3. **Application Metrics:**
   - Response times
   - Error rates
   - API call success/failure
   - User sessions

### Regular Maintenance

- **Daily:**
  - Check error logs
  - Monitor performance metrics
  - Verify sync operations

- **Weekly:**
  - Review security alerts
  - Check for dependency updates
  - Analyze usage patterns

- **Monthly:**
  - Update dependencies
  - Review and optimize performance
  - Backup and verify data integrity
  - Security audit

## Scaling Considerations

### Horizontal Scaling

- Use load balancer
- Deploy multiple instances
- Ensure session persistence
- Scale API backend accordingly

### Performance Optimization

- Enable CDN for static assets
- Implement proper caching strategies
- Optimize images and assets
- Use code splitting
- Enable compression

### Database Scaling

- Monitor IndexedDB usage
- Implement data cleanup strategies
- Consider sync optimization
- Plan for data migration if needed

## Rollback Procedure

If deployment fails or issues arise:

1. **Immediate Rollback:**
   - Vercel/Netlify: Use dashboard to rollback
   - Docker: Switch to previous image tag
   - PM2: `pm2 reload gymflow-pos --update-env`

2. **Verify Rollback:**
   - Test application functionality
   - Check logs for errors
   - Notify users if necessary

3. **Investigate Issues:**
   - Review deployment logs
   - Check recent code changes
   - Test in staging environment
   - Fix issues before redeploying

## Support Contacts

- **Development Team:** dev@gymflow.com
- **DevOps Team:** devops@gymflow.com
- **Support:** support@gymflow.com

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Netlify Deployment Guide](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Last Updated:** February 2026  
**Version:** 1.0
