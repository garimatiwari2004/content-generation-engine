# Setup Guide - HirezApp Content Engine

Follow these steps to get your content generation engine up and running.

## Prerequisites

- Node.js 18+ installed
- AWS Account with DynamoDB access
- LinkedIn Developer Account
- Vercel Account (for deployment)

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd hirezapp-content-engine
npm install
```

## Step 2: Set Up AWS DynamoDB

### Create Tables

You need to create 3 DynamoDB tables in your AWS account.

#### Table 1: Users

```
Table name: hirezapp-users
Partition key: id (String)
```

After creation, add a Global Secondary Index:
```
Index name: linkedinId-index
Partition key: linkedinId (String)
```

#### Table 2: Scheduled Posts

```
Table name: hirezapp-scheduled-posts
Partition key: id (String)
```

After creation, add a Global Secondary Index:
```
Index name: userId-index
Partition key: userId (String)
```

#### Table 3: Jobs

```
Table name: hirezapp-jobs
Partition key: id (String)
```

After creation, add a Global Secondary Index:
```
Index name: userId-index
Partition key: userId (String)
```

### Get AWS Credentials

1. Go to AWS IAM Console
2. Create a new IAM user with programmatic access
3. Attach the `AmazonDynamoDBFullAccess` policy
4. Save the Access Key ID and Secret Access Key

## Step 3: Set Up LinkedIn App

1. Visit https://www.linkedin.com/developers/
2. Click "Create app"
3. Fill in app details:
   - App name: HirezApp Content Engine
   - LinkedIn Page: Select your company page
   - App logo: Upload a logo
4. In the "Auth" tab:
   - Add Redirect URLs:
     - Development: `http://localhost:3000/api/auth/callback`
     - Production: `https://yourdomain.com/api/auth/callback`
5. In the "Products" tab, request access to:
   - Sign In with LinkedIn using OpenID Connect
   - Share on LinkedIn
6. Copy your Client ID and Client Secret from the "Auth" tab

## Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# AWS DynamoDB Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
DYNAMODB_USERS_TABLE=hirezapp-users
DYNAMODB_POSTS_TABLE=hirezapp-scheduled-posts
DYNAMODB_JOBS_TABLE=hirezapp-jobs

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Cron Job Security (generate a random string)
CRON_SECRET=your-random-secret-string-here

# Node Environment
NODE_ENV=development
```

For production, change `LINKEDIN_REDIRECT_URI` to your production domain.

## Step 5: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 6: Test the Flow

1. Click "Sign in with LinkedIn"
2. Authorize the app
3. Complete the 10-question questionnaire
4. View your dashboard

## Step 7: Deploy to Vercel

### Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Add all environment variables from `.env.local`
6. Click "Deploy"

### Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and add your environment variables when asked.

## Step 8: Configure Cron Jobs

The cron jobs are automatically configured via `vercel.json`:

- **Generate Posts**: Runs every 12 hours
- **Post to LinkedIn**: Runs every 5 minutes

To verify cron jobs are working:

1. Go to your Vercel project dashboard
2. Click on "Cron Jobs" tab
3. You should see two cron jobs listed
4. Check the logs to see execution history

## Step 9: Manual Testing

### Test Post Generation

You can manually trigger a post generation from the dashboard:

1. Log in to your app
2. Go to the dashboard
3. Click "Generate Post Now"

### Test Cron Jobs Manually

```bash
# Generate posts
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://yourdomain.com/api/cron/generate-posts

# Post to LinkedIn
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://yourdomain.com/api/cron/post-to-linkedin
```

## Troubleshooting

### "Unauthorized" error when signing in
- Verify LinkedIn Client ID and Secret are correct
- Check that redirect URI matches exactly (including http vs https)
- Ensure you've requested the right scopes in LinkedIn app

### Posts not being generated
- Check Vercel cron job logs
- Verify CRON_SECRET matches in environment variables
- Check that user has completed onboarding

### DynamoDB errors
- Verify AWS credentials are correct
- Check IAM user has DynamoDB permissions
- Ensure table names match in environment variables
- Verify GSI (Global Secondary Indexes) are created

### Images not generating
- Image generation uses pollinations.ai by default (free, no API key needed)
- Check network connectivity
- View browser console for errors

### LinkedIn posting fails
- Check that access token is valid (not expired)
- Verify LinkedIn app has "Share on LinkedIn" product approved
- Check error messages in DynamoDB scheduled_posts table

## Production Checklist

- [ ] All DynamoDB tables created with GSIs
- [ ] AWS IAM user created with DynamoDB access
- [ ] LinkedIn app created and approved
- [ ] All environment variables set in Vercel
- [ ] LinkedIn redirect URI updated to production domain
- [ ] Cron jobs verified in Vercel dashboard
- [ ] Test user onboarding flow
- [ ] Test post generation
- [ ] Verify posts appear on LinkedIn

## Need Help?

- Check the main README.md for architecture details
- Review API documentation in the code
- Check Vercel logs for runtime errors
- Verify all environment variables are set correctly

## Next Steps

After setup is complete:

1. Invite your team members to sign in
2. Each person completes their questionnaire
3. Monitor the dashboard for generated posts
4. Check LinkedIn to verify posts are published
5. Adjust preferences by updating the questionnaire logic

Congratulations! Your content engine is now running automatically.
