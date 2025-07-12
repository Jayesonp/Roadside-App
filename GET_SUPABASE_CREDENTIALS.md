# 🚀 Complete Guide: Get Supabase Credentials

## Step 1: Create Supabase Account

1. **Visit Supabase Website**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Click "Start your project" or "Sign In"

2. **Sign Up Options**
   - **GitHub** (Recommended): Click "Continue with GitHub"
   - **Email**: Enter email and password
   - **Google**: Click "Continue with Google"

3. **Verify Email** (if using email signup)
   - Check your email inbox
   - Click the verification link

## Step 2: Create Your Project

1. **Click "New Project"**
   - You'll see a green "+ New project" button
   - If you don't have an organization, create one first

2. **Project Configuration**
   ```
   Project Name: roadside-emergency-app
   Database Password: [Generate a strong password]
   Region: [Choose closest to your location]
   Plan: Free (perfect for development)
   ```

3. **Important: Save Your Database Password!**
   - Write it down securely
   - You'll need it for database access

4. **Click "Create new project"**
   - Wait 2-3 minutes for project setup
   - You'll see a progress indicator

## Step 3: Get Your Credentials

### 🔗 Project URL
1. **From Project Dashboard**
   - Look at the URL bar: `https://app.supabase.com/project/YOUR_PROJECT_ID`
   - Your project URL is: `https://YOUR_PROJECT_ID.supabase.co`

2. **Alternative Method**
   - Go to Settings → General
   - Find "Reference ID" section
   - Your URL is: `https://[Reference ID].supabase.co`

### 🔑 API Keys
1. **Navigate to API Settings**
   - Click "Settings" (gear icon) in left sidebar
   - Click "API" in the settings menu

2. **Copy These Two Keys**
   ```
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role/secret key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **⚠️ Security Note**
   - **anon key**: Safe for frontend use
   - **service_role key**: Keep secret! Server-side only

## Step 4: Update Your .env File

1. **Open your .env file** (in project root)

2. **Replace the placeholder values**:
   ```env
   # Replace with YOUR actual credentials
   SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Keep these as they are
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   PORT=3000
   API_VERSION=v1
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Save the file**

## Step 5: Test Connection

1. **Restart Your Development Server**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Check Console Output**
   Look for these messages:
   ```
   ✅ Environment configuration validated
   🔍 Testing Supabase connection...
   ✅ Supabase connection successful!
   🎉 Database connected and ready to use
   ```

3. **Success Indicators**
   - No error messages in console
   - App loads normally
   - Authentication features work

## 📋 Quick Reference

### Your Project Information
```
Project Name: roadside-emergency-app
Project URL: https://YOUR_PROJECT_ID.supabase.co
Dashboard: https://app.supabase.com/project/YOUR_PROJECT_ID
```

### Required Environment Variables
```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🛠 Troubleshooting

### ❌ "Invalid API key" Error
- **Solution**: Double-check you copied the service_role key correctly
- **Check**: Ensure no extra spaces or line breaks in .env file

### ❌ "Project not found" Error
- **Solution**: Verify your SUPABASE_URL is correct
- **Check**: Make sure URL starts with `https://`

### ❌ "Connection timeout" Error
- **Solution**: Check your internet connection
- **Check**: Verify Supabase service status at [status.supabase.com](https://status.supabase.com)

### ❌ Environment Variables Not Loading
- **Solution**: Restart your development server after editing .env
- **Check**: Make sure .env file is in the project root directory

## 🎯 Next Steps After Connection

1. **Test Authentication**
   - Try registering a new user
   - Test login/logout functionality

2. **Explore Database**
   - Go to Table Editor in Supabase dashboard
   - See your `users` and `tasks` tables

3. **View API Documentation**
   - Visit `http://localhost:3000/api-docs`
   - Test API endpoints

## 🆘 Need Help?

- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Community Support**: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Check Project Logs**: In Supabase dashboard → Logs

---

**🎉 Once you see "Supabase connection successful!" your app will be fully connected and ready to use!**