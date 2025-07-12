# 🚀 Supabase Connection Setup Guide

## Step 1: Create a Supabase Project

1. **Go to Supabase**: Visit [https://app.supabase.com](https://app.supabase.com)
2. **Sign in/Register**: Create an account or sign in
3. **Create Project**: Click "New Project"
4. **Project Details**:
   - **Name**: `roadside-emergency-app`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your location
5. **Create**: Click "Create new project" and wait for setup

## Step 2: Get Your Credentials

1. **Project Dashboard**: Go to your new project
2. **Settings**: Click "Settings" in the left sidebar
3. **API**: Click "API" in the settings menu
4. **Copy Values**:

### Project URL
```
https://YOUR_PROJECT_ID.supabase.co
```

### API Keys
- **anon/public key**: For client-side operations
- **service_role/secret key**: For server-side operations ⚠️ Keep secret!

## Step 3: Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Replace these with your actual Supabase credentials
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

## Step 4: Test Connection

1. **Save** your `.env` file
2. **Restart** the development server:
   ```bash
   npm run dev
   ```
3. **Check Console** for connection status:
   - ✅ "Supabase connection successful!" = Working
   - ❌ "Supabase connection failed" = Check credentials

## Step 5: Database Setup

The database tables will be created automatically when you connect. The migration files include:
- `users` table for authentication
- `tasks` table for the task management API

## 🔧 Troubleshooting

### "Invalid API key" Error
- Double-check you copied the **service_role** key (not anon key)
- Ensure no extra spaces in your `.env` file

### "Project not found" Error  
- Verify your SUPABASE_URL is correct
- Make sure it starts with `https://`
- Check your project is active in Supabase dashboard

### "Connection timeout" Error
- Check your internet connection
- Verify Supabase service status
- Try a different network

## 📝 Example .env File

```env
# Working example (replace with your values)
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎉 Success!

Once connected, you'll see:
- ✅ Database connection logs
- 🎯 API endpoints working at `/api/v1/`
- 📚 Documentation at `/api-docs`

Need help? Check the console logs for detailed error messages.