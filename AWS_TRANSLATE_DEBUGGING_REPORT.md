# AWS Translate Debugging Report

## Issue Summary
AWS Translate was not working with error: **"The security token included in the request is invalid" (UnrecognizedClientException)**

---

## Root Cause Analysis

### Problem Identified
The AWS credentials stored in `server/.env` were **expired or invalid**.

### Why This Happened
The credentials in `.env` were temporary AWS credentials (they included `AWS_SESSION_TOKEN`), which have a limited Time-To-Live (TTL):
- Typical TTL: 1 hour for STS assume-role, up to 12 hours maximum
- The credentials had expired since they were created

### Error Evidence
```
Error: UnrecognizedClientException
Message: "The security token included in the request is invalid"
HTTP Status: 400
AWS Error Code: UnrecognizedClientException
```

---

## Solutions Implemented

### 1. Updated `.env` Configuration
**File**: `server/.env`

**Changes**:
- Removed expired credentials
- Added comprehensive inline documentation
- Provided three different ways to get fresh credentials:
  1. AWS CLI (recommended)
  2. AWS Management Console
  3. Temporary credentials via STS

**New .env structure**:
```
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=              # Leave empty if not using AWS Translate
AWS_SECRET_ACCESS_KEY=          # Leave empty if not using AWS Translate
AWS_SESSION_TOKEN=              # Optional for temporary credentials
```

### 2. Improved Error Handling in Backend
**File**: `server/server.js`

**Changes**:
1. **getAwsTranslateClient()** function:
   - Added explicit credential validation
   - Provides specific error messages for missing credentials
   - Includes reference to AWS_SETUP_GUIDE.md for help

2. **translateWithAWS()** function:
   - Added detection for common AWS errors
   - Provides helpful messages for:
     - Invalid/expired credentials
     - Permission issues
     - Other AWS Translate failures
   - Returns error details to client

3. **/get-started endpoint**:
   - Now returns detailed error messages to frontend
   - Includes stack trace in development mode
   - Helps with debugging credential issues

### 3. Created AWS Setup Guide
**File**: `server/AWS_SETUP_GUIDE.md`

**Contents**:
- **Problem explanation**: Why credentials expire
- **4 different solutions**:
  1. Using AWS CLI (recommended)
  2. Using AWS Management Console
  3. Getting temporary credentials with STS
  4. Disabling AWS Translate and using free Hugging Face API
- **Testing instructions**: How to verify credentials work
- **Common issues**: Troubleshooting guide with solutions
- **IAM permissions**: Required policies for AWS Translate

---

## How to Fix AWS Translate

### Quick Start (Recommended)

**Step 1**: Get fresh AWS credentials
```powershell
# Option A: Using AWS CLI (simplest)
aws configure
# Enter your Access Key ID and Secret Access Key

# Option B: Get from IAM Console
# Visit: https://console.aws.amazon.com/iam/
# Users → Your User → Security Credentials → Access Keys
```

**Step 2**: Update `server/.env`
```
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIA...                    # Your access key
AWS_SECRET_ACCESS_KEY=...                    # Your secret key
AWS_SESSION_TOKEN=                           # Leave empty if not using temporary credentials
```

**Step 3**: Restart the backend
```powershell
cd d:\PROJECT\LINGOPAD\server
npm run dev
```

**Step 4**: Test with frontend
- Open http://localhost:5173/get-started
- Select "AWS Translate (requires AWS credentials)" from dropdown
- Try a translation

### Alternative: Disable AWS Translate

If you don't want to set up AWS credentials:

**In `server/.env`**:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

**Result**: The app will use free Hugging Face API instead (no credentials needed)

---

## Testing Instructions

### Backend Test (Before Frontend)

```powershell
cd d:\PROJECT\LINGOPAD\server

# Start backend
npm run dev

# In another terminal, test with curl/PowerShell
$body = @{
    inputText = "Hello"
    targetLanguage = "hindi"
    translationMethod = "aws"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/get-started" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Expected Response (Success)
```json
{
  "status": "success",
  "message": "Translation successful!",
  "data": {
    "inputText": "Hello",
    "translatedText": "नमस्ते",
    "pronunciation": "namaste",
    "targetLanguage": "hindi",
    "translationMethod": "aws"
  }
}
```

### Expected Response (Invalid Credentials)
```json
{
  "status": "error",
  "message": "AWS Translate failed: Invalid or expired AWS credentials. Please check your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN in server/.env..."
}
```

---

## Code Changes Summary

### Modified Files

1. **server/.env**
   - Cleared expired credentials
   - Added detailed setup instructions
   - 3 different methods documented

2. **server/server.js**
   - `getAwsTranslateClient()`: Enhanced with validation and better error messages
   - `translateWithAWS()`: Added AWS error detection and helpful messages
   - `/get-started` endpoint: Improved error response with details

3. **NEW: server/AWS_SETUP_GUIDE.md**
   - Comprehensive guide for setting up AWS credentials
   - Multiple setup methods
   - Troubleshooting section
   - Testing instructions

---

## Key Learnings

### AWS Credentials Types

1. **Permanent Credentials** (IAM Users)
   - Access Key ID (starts with AKIA...)
   - Secret Access Key
   - Format: `AKIA...` access key + long secret key
   - Don't expire unless manually revoked
   - Use for long-term API access

2. **Temporary Credentials** (STS)
   - Access Key ID (starts with ASIA...)
   - Secret Access Key
   - **Session Token** (required)
   - Expire after set duration (1 hour - 12 hours)
   - Use for: EC2 roles, cross-account access, short-lived access
   - **These are what we had, and they expired!**

### Why the Transition is Important

- **Local Development**: Use permanent credentials (IAM access keys)
- **Production**: Use temporary credentials with STS (IAM roles on EC2)
- **AWS Lambda**: Automatically handled (role-based)
- **CI/CD**: Usually temporary credentials from provider

---

## Prevention for Future

### Best Practices Implemented

1. **Clear error messages**: Users know exactly what went wrong
2. **Helpful documentation**: Guide file provided
3. **Fallback mechanism**: App doesn't crash, uses Hugging Face API
4. **Credential validation**: Check before attempting translation
5. **Development mode**: Show stack traces for debugging

### Recommendations

1. Store credentials securely (never commit to Git)
2. Use environment variables for all sensitive data
3. Implement credential rotation for temporary credentials
4. Monitor AWS API usage for suspicious activity
5. Use IAM policies with least privilege principle

---

## Files Modified

```
server/
  ├── .env                      # Updated with fresh credential instructions
  ├── server.js                 # Enhanced error handling and validation
  ├── AWS_SETUP_GUIDE.md        # NEW: Comprehensive setup guide
  └── [other files unchanged]
```

---

## Next Steps

1. **Get fresh AWS credentials** following the guide in `server/AWS_SETUP_GUIDE.md`
2. **Update `server/.env`** with valid credentials
3. **Restart backend**: `npm run dev`
4. **Test translation** from frontend at http://localhost:5174/get-started
5. **Verify**: Select "AWS Translate" method and test a translation

---

## Support Resources

- **AWS Translate Docs**: https://docs.aws.amazon.com/translate/
- **AWS CLI Configuration**: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html
- **IAM Access Keys**: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
- **STS AssumeRole**: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html

---

## Questions?

Check:
1. `server/AWS_SETUP_GUIDE.md` - Detailed setup instructions
2. `server/.env` - Configuration comments
3. Backend logs (`npm run dev` output) - Error details
4. Browser console - Frontend error messages
