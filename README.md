# CS2 Investment Portfolio

A Vue 3 + TypeScript + Vite application for tracking Counter-Strike 2 item investments with Supabase backend integration.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/shazam442/cs2-invest-portfolio
   cd cs2-invest-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔒 Security Features

This project includes comprehensive security measures to prevent sensitive data exposure:

### Environment Variables
- All sensitive configuration uses environment variables
- `.env.local` is gitignored and never committed
- `.env.example` template shows required variables
- Pre-commit hooks prevent accidental commits of sensitive data

### Security Scripts
- `npm run security:scan` - Check for .env files
- `npm run audit` - Check dependencies for vulnerabilities

### Git Hooks
- **Pre-commit hook** automatically scans staged files for sensitive data
- Blocks commits containing potential secrets, API keys, or credentials
- Provides helpful error messages and suggestions

### .gitignore Protection
Extended `.gitignore` excludes:
- All environment files (`.env*`)
- API keys, tokens, and credentials
- Database files and configurations
- Certificates and private keys
- Cloud service configurations
- IDE settings that might contain secrets

## 🛡️ Security Best Practices

### For Developers
1. **Never commit sensitive data** - Use environment variables instead
2. **Use .env.local** for local development
3. **Rotate keys regularly** in production
4. **Run security scan** before committing: `npm run security:scan`
5. **Keep dependencies updated**: `npm audit`

### For Production
1. **Use secure environment variable management**
2. **Enable Supabase RLS (Row Level Security)**
3. **Regular security audits**
4. **Monitor for exposed credentials**

## 📁 Project Structure

```
src/
├── components/          # Vue components
├── pages/              # Page components
├── composables/        # Vue composables
└── style.css          # Global styles

lib/
├── api.ts             # Supabase client
├── authentication.ts  # Auth logic
├── types/            # TypeScript types
└── utils.ts          # Utility functions
```

## 🚨 Security Incident Response

If you accidentally commit sensitive data:

1. **Immediately rotate** all exposed credentials
2. **Remove sensitive data** from git history:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.local' HEAD
   ```
3. **Force push** to update remote repository
4. **Notify team members** to update their local repositories

## 📚 Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
