# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Fill in your project details:
   - Name: `roadside-emergency-api`
   - Database Password: Generate a strong password (save this!)
   - Region: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" in the settings menu
4. Copy the following values:

### Project URL
```
https://YOUR_PROJECT_ID.supabase.co
```

### API Keys
- **anon/public key**: Used for client-side operations
- **service_role/secret key**: Used for server-side operations (keep this secret!)

## Step 3: Update Your .env File

Create a `.env` file in your project root and add:

```env
# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Other required variables
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
PORT=3000
```

## Step 4: Run Database Migrations

The migrations are already created in the `supabase/migrations/` folder. They will be automatically applied when you connect to Supabase.

## Step 5: Test the Connection

Run your application:
```bash
npm run dev
```

Look for these log messages:
- ✅ Environment configuration validated
- ✅ Supabase connection successful

## Troubleshooting

### Error: "Missing required environment variables"
- Make sure your `.env` file exists in the project root
- Check that all required variables are present and have values
- Restart your development server after adding environment variables

### Error: "Invalid API key"
- Double-check your API keys from the Supabase dashboard
- Make sure you're using the **service_role** key, not the anon key for server-side operations
- Ensure there are no extra spaces or characters in your keys

### Error: "Project not found" 
- Verify your SUPABASE_URL is correct
- Make sure your project is active in the Supabase dashboard
- Check that your project hasn't been paused due to inactivity

### Error: "Connection timeout"
- Check your internet connection
- Verify the Supabase service status at https://status.supabase.com
- Try switching to a different network

## Next Steps

Once connected successfully:
1. The database tables will be created automatically
2. You can test the API endpoints using the provided documentation
3. Access the API docs at: http://localhost:3000/api-docs

## Need Help?

- Check the Supabase documentation: https://supabase.com/docs
- Review the API logs for detailed error messages
- Ensure your Supabase project has the correct database schema