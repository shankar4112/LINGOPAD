# AWS Translate Configuration Guide

## Problem: "The security token included in the request is invalid"

If you're seeing this error when trying to use AWS Translate:
```
UnrecognizedClientException: The security token included in the request is invalid
```

This means your AWS credentials in `.env` are **expired or invalid**.

---

## Why Did This Happen?

AWS temporary credentials (which include a `AWS_SESSION_TOKEN`) have a limited Time-To-Live (TTL), usually:
- **IAM temporary credentials via STS assume-role**: 1 hour default, up to 12 hours
- **AWS CLI temporary credentials**: Varies, typically a few hours

If the credentials were generated earlier and haven't been used in a while, they've likely expired.

---

## Solution: Get Fresh AWS Credentials

### Option 1: Use AWS CLI (Recommended)

1. **Install AWS CLI** (if not already installed):
   - Download from: https://aws.amazon.com/cli/
   - Or use: `choco install awscli` (on Windows with Chocolatey)
   - Or use: `brew install awscli` (on macOS with Homebrew)

2. **Configure AWS CLI**:
   ```powershell
   # For SSO (single sign-on):
   aws configure sso
   
   # OR for access keys (simpler):
   aws configure
   # Then enter your AWS Access Key ID and Secret Access Key
   ```

3. **Verify your credentials work**:
   ```powershell
   aws sts get-caller-identity
   ```
   This will show you your AWS account and user/role information.

4. **Get your credentials from AWS CLI**:
   ```powershell
   # View your current credentials
   aws configure list
   
   # Or check the credentials file directly
   cat ~/.aws/credentials
   ```

5. **Update `.env` file**:
   ```
   AWS_REGION=ap-south-1
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   # Leave AWS_SESSION_TOKEN empty if using permanent credentials
   ```

### Option 2: Use AWS Management Console

1. **Go to IAM Console**:
   - Navigate to: https://console.aws.amazon.com/iam/

2. **Get Access Keys**:
   - Users → [Your Username] → Security Credentials → Access Keys
   - Click "Create access key"
   - Copy `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

3. **Update `.env` file**:
   ```
   AWS_REGION=ap-south-1
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_SESSION_TOKEN=
   ```

### Option 3: Get Temporary Credentials with Session Token (for STS)

If you need temporary credentials (e.g., from an assumed role):

```powershell
# Assume a role and get temporary credentials
aws sts assume-role `
  --role-arn arn:aws:iam::123456789012:role/MyRole `
  --role-session-name my-session `
  --duration-seconds 3600

# Output will include:
# - AccessKeyId
# - SecretAccessKey
# - SessionToken
# - Expiration
```

Then update `.env`:
```
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=ASIA...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=...
```

---

## Option 4: Disable AWS Translate (Use Free API Instead)

If you don't want to set up AWS credentials, the app will automatically fall back to **Hugging Face API** (completely free, no credentials needed):

1. **Leave AWS credentials empty in `.env`**:
   ```
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   ```

2. **The app will automatically use**:
   - Hugging Face API (free tier, no auth required)
   - Or local NLLB model (if enough memory available)

3. **On the frontend**:
   - "AWS Translate" option won't appear in the dropdown
   - Only "AI Translation (NLLB Model)" will be available
   - Backend will use Hugging Face API as fallback

---

## Testing Your Credentials

After updating `.env`, test with:

```powershell
cd server
npm run dev
```

Then in another terminal:
```powershell
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

### Success Response:
```json
{
  "status": "success",
  "message": "Translation successful!",
  "data": {
    "inputText": "Hello",
    "translatedText": "नमस्ते",
    ...
  }
}
```

### Error Response with Helpful Message:
```json
{
  "status": "error",
  "message": "AWS Translate failed: Invalid or expired AWS credentials...",
  ...
}
```

---

## Common Issues

### "AWS_REGION is required"
**Solution**: Add `AWS_REGION=ap-south-1` to `.env`

### "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required"
**Solution**: Get fresh credentials using any of the methods above

### "Access Denied"
**Solution**: Your IAM user/role doesn't have permission for AWS Translate
- Add this IAM policy to your user/role:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "translate:TranslateText",
        "Resource": "*"
      }
    ]
  }
  ```

### "Invalid credentials" or "The security token is invalid"
**Solution**: Your temporary credentials have expired
- Refresh your credentials using AWS CLI or AWS Management Console
- Update `.env` with new credentials

---

## Need Help?

Check the error message returned by the API:
- Look for detailed error messages in the response
- Check server logs: `npm run dev` output in terminal
- Check `.env` file for proper formatting (no leading/trailing spaces)

The app includes helpful error messages to guide you in the right direction!
