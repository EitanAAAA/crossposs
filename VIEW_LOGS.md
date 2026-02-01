# How to View Backend Logs

## Option 1: Run Backend in Separate Terminal (Recommended)

Open a **new terminal window** and run:

```bash
npm run dev:server
```

This will show you all backend logs in real-time, including:
- Server startup messages
- All API requests (GET, POST, etc.)
- Database operations
- Errors and warnings

## Option 2: Run Both Servers with Visible Logs

Stop the current servers and run:

```bash
npm run dev:all
```

This runs both servers in the same terminal with colored output.

## Option 3: View Logs from Background Process

If servers are running in background, you can:

1. **Find the process:**
   ```powershell
   Get-Process -Name node | Where-Object {$_.Id -eq 37716}
   ```

2. **Check if server is responding:**
   ```powershell
   Invoke-WebRequest http://localhost:3000/api/users
   ```

## What You'll See in Logs

When you sign up or log in, you'll see:

```
[2026-01-01T23:33:54.123Z] POST /api/users
Creating user: { email: 'user@example.com', name: 'John Doe' }
User created successfully: abc123-uuid
```

When you log in:

```
[2026-01-01T23:33:54.123Z] GET /api/users/email/user@example.com
Finding user by email: user@example.com
User found: abc123-uuid
```

## Quick Start

**Best way to see logs:**

1. Open **Terminal 1** (for backend):
   ```bash
   npm run dev:server
   ```

2. Open **Terminal 2** (for frontend):
   ```bash
   npm run dev
   ```

Now you can watch both servers' logs separately!










