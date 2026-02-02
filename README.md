# HirezApp Content Generation Engine

An AI-powered LinkedIn content automation platform that generates and schedules personalized posts with images every 24 hours.

## Features

- **LinkedIn OAuth Authentication** - Secure authorization with LinkedIn
- **Dynamic AI Questionnaire** - 10 adaptive questions that learn your preferences
- **AI Content Generation** - Creates personalized LinkedIn posts with Unicode formatting
- **Automatic Image Generation** - Every post includes a relevant image
- **Auto-Posting Scheduler** - Posts automatically every 24 hours
- **Dashboard** - View and manage scheduled and published posts

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Amazon DynamoDB (NoSQL)
- **AI**: Vercel AI SDK with OpenAI GPT-4o
- **Authentication**: LinkedIn OAuth 2.0
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Deployment**: Vercel with Cron Jobs

## Environment Variables

You need to set up the following environment variables:

```env
# AWS DynamoDB
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_USERS_TABLE=hirezapp-users
DYNAMODB_POSTS_TABLE=hirezapp-scheduled-posts
DYNAMODB_JOBS_TABLE=hirezapp-jobs

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://yourdomain.com/api/auth/callback

# Cron Job Security
CRON_SECRET=your-secret-key-for-cron-jobs

# Optional: OpenAI (if not using Vercel AI Gateway)
OPENAI_API_KEY=your-openai-api-key
```

## Database Setup

### DynamoDB Tables

Create three DynamoDB tables:

#### 1. Users Table
- **Table Name**: `hirezapp-users`
- **Partition Key**: `id` (String)
- **GSI**: `linkedinId-index` with partition key `linkedinId` (String)

#### 2. Scheduled Posts Table
- **Table Name**: `hirezapp-scheduled-posts`
- **Partition Key**: `id` (String)
- **GSI**: `userId-index` with partition key `userId` (String)

#### 3. Jobs Table
- **Table Name**: `hirezapp-jobs`
- **Partition Key**: `id` (String)
- **GSI**: `userId-index` with partition key `userId` (String)

## LinkedIn App Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add these redirect URLs:
   - `http://localhost:3000/api/auth/callback` (development)
   - `https://yourdomain.com/api/auth/callback` (production)
4. Request access to the following scopes:
   - `openid`
   - `profile`
   - `email`
   - `w_member_social` (for posting)
5. Copy your Client ID and Client Secret

## How It Works

### 1. User Onboarding Flow

1. User clicks "Sign in with LinkedIn"
2. LinkedIn OAuth authorization
3. User is redirected to dynamic questionnaire
4. AI generates 10 personalized questions
5. Each question adapts based on previous answers
6. System analyzes answers to create content preferences

### 2. Content Generation

- AI analyzes user preferences
- Generates LinkedIn post (200-300 words)
- Applies Unicode formatting (bold, italic)
- Creates contextual image prompt
- Generates image using AI
- Adds relevant hashtags

### 3. Scheduling System

**Two Cron Jobs**:

1. **Generate Posts** (`/api/cron/generate-posts`)
   - Runs every 12 hours
   - Checks active jobs
   - Generates posts for users
   - Creates scheduled posts

2. **Post to LinkedIn** (`/api/cron/post-to-linkedin`)
   - Runs every 5 minutes
   - Checks pending posts
   - Posts to LinkedIn API
   - Updates post status

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

The cron jobs in `vercel.json` will automatically be configured.

### Manual Cron Testing

You can manually trigger cron jobs:

```bash
# Generate posts
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://yourdomain.com/api/cron/generate-posts

# Post to LinkedIn
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://yourdomain.com/api/cron/post-to-linkedin
```

## API Routes

- `GET /api/auth/linkedin` - Start LinkedIn OAuth
- `GET /api/auth/callback` - OAuth callback
- `POST /api/questionnaire/next-question` - Get next AI question
- `POST /api/questionnaire/complete` - Submit questionnaire
- `POST /api/generate-post` - Manually generate post
- `POST /api/generate-image` - Generate post image
- `GET /api/cron/generate-posts` - Cron: Generate posts
- `GET /api/cron/post-to-linkedin` - Cron: Post to LinkedIn

## Architecture

```
User Flow:
1. LinkedIn Auth → 2. Questionnaire → 3. Dashboard

Automation:
Cron → Generate Post → Schedule → Post to LinkedIn

Database:
Users ← Jobs → Scheduled Posts
```

## Unicode Formatting

Posts use Unicode characters for formatting:
- **Bold**: Mathematical Sans-Serif Bold (𝗕𝗼𝗹𝗱)
- **Italic**: Mathematical Sans-Serif Italic (𝘐𝘵𝘢𝘭𝘪𝘤)

This ensures formatting works on LinkedIn without markdown.

## Security

- HTTP-only cookies for sessions
- CSRF protection with state parameter
- Cron job secret authorization
- Secure token storage in DynamoDB

## Troubleshooting

### Posts not generating
- Check cron job logs in Vercel
- Verify CRON_SECRET is set correctly
- Check DynamoDB connection

### LinkedIn auth failing
- Verify redirect URIs match exactly
- Check LinkedIn app scopes
- Ensure client ID/secret are correct

### Images not generating
- Check OpenAI API key
- Verify image generation service is working
- Check error logs

## Future Enhancements

- Analytics and engagement tracking
- Multiple post templates
- A/B testing for content
- Team management features
- Custom posting schedules
- Post editing before publishing

## License

MIT
