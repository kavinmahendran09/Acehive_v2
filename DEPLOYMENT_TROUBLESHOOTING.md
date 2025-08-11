# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 1. "No Output Directory named 'dist' found" Error

**Problem**: Vercel is looking for a "dist" directory but Next.js builds to ".next"

**Solution**: 
- The `vercel.json` file has been created to specify the correct output directory
- Make sure your Vercel project is configured as a Next.js project

### 2. Package Manager Conflicts

**Problem**: Mixed package managers (npm and pnpm)

**Solution**:
- Use `pnpm` consistently (as configured in `vercel.json`)
- Delete `package-lock.json` if you want to use pnpm exclusively
- Or delete `pnpm-lock.yaml` if you want to use npm

### 3. Environment Variables Missing

**Problem**: Build succeeds but app doesn't work due to missing environment variables

**Solution**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all required environment variables (see ANALYTICS.md)
3. Redeploy the project

### 4. Build Failures

**Common causes**:
- Missing dependencies
- TypeScript errors
- ESLint errors

**Solution**:
- Check build logs for specific error messages
- The project is configured to ignore TypeScript and ESLint errors during build
- Make sure all dependencies are properly installed

## Vercel Configuration

The `vercel.json` file specifies:
- **Framework**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

## Manual Steps if Issues Persist

1. **Clear Vercel Cache**:
   - Go to Project Settings → General → Clear Build Cache

2. **Redeploy**:
   - Go to Deployments → Redeploy

3. **Check Project Settings**:
   - Ensure Framework Preset is set to "Next.js"
   - Verify Build Command is `pnpm run build`
   - Check Output Directory is `.next`

4. **Environment Variables**:
   - Verify all `NEXT_PUBLIC_*` variables are set
   - Make sure they're available for all environments (Production, Preview, Development)
