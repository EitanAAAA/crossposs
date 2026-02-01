# PostgreSQL Database Setup

## .env File Configuration

Create a `.env` file in the root directory with the following variables:

```env
DB_PASS="your_postgres_password_here"
GEMINI_API_KEY="your_gemini_api_key_here"
VITE_API_URL="http://localhost:3000/api"
PORT=3000
```

### Database Configuration

The server will automatically construct the DATABASE_URL from:
- Host: `localhost`
- User: `postgres`
- Password: From `DB_PASS` in .env
- Database: `users`
- Port: `5432`

### Example .env File

```env
DB_PASS="mypassword123"
GEMINI_API_KEY="your_actual_gemini_key"
VITE_API_URL="http://localhost:3000/api"
PORT=3000
```

**Note:** You can also set `DATABASE_URL` directly if you prefer:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/users?schema=public"
```

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create your PostgreSQL database:**
   ```bash
   createdb users
   ```
   Or use pgAdmin/SQL:
   ```sql
   CREATE DATABASE users;
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

4. **Push schema to database:**
   ```bash
   npm run db:push
   ```
   Or create a migration:
   ```bash
   npm run db:migrate
   ```

5. **Start the backend server:**
   ```bash
   npm run dev:server
   ```

6. **Start the frontend (in another terminal):**
   ```bash
   npm run dev
   ```
   
   Or run both together:
   ```bash
   npm run dev:all
   ```

## Database Management

- **View database in Prisma Studio:**
  ```bash
  npm run db:studio
  ```

- **Create a new migration:**
  ```bash
  npm run db:migrate
  ```

- **Apply schema changes without migration:**
  ```bash
  npm run db:push
  ```

## Notes

- Make sure PostgreSQL is running on your system
- The backend server runs on port 3000 by default
- The frontend runs on port 3001 by default
- Update `VITE_API_URL` if your backend runs on a different port

