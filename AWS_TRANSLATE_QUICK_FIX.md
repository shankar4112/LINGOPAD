# AWS Translate Quick Fix

## ⚠️ Problem
AWS Translate failing with: **"The security token included in the request is invalid"**

## ✅ Root Cause
Your AWS credentials in `server/.env` are **expired or invalid** (temporary credentials have limited lifetime)

## 🔧 Quick Fix (3 Steps)

### Step 1: Get Fresh Credentials
```powershell
# Option A (Easiest - AWS CLI):
aws configure
# Enter your Access Key ID and Secret Access Key

# Option B (AWS Console):
# Go to: https://console.aws.amazon.com/iam/
# Users → Your User → Security Credentials → Create access key
```

### Step 2: Update `server/.env`
```
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIA...        # Your new access key
AWS_SECRET_ACCESS_KEY=...         # Your new secret key
AWS_SESSION_TOKEN=                # Leave empty (for permanent credentials)
```

### Step 3: Restart Backend
```powershell
cd d:\PROJECT\LINGOPAD\server
npm run dev
```

## 📚 Full Documentation
- Read: `server/AWS_SETUP_GUIDE.md` for detailed setup
- Read: `AWS_TRANSLATE_DEBUGGING_REPORT.md` for technical details

## 🚀 Alternative: Disable AWS (Use Free API)
Leave credentials empty in `.env`:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
App will use free Hugging Face API instead ✨

## ✨ Done!
Open http://localhost:5173/get-started and test AWS Translate
