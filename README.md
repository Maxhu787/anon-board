# g4o2.me - Anonymous Student Message Board

A lightweight, modern web platform for students to share posts and comments anonymously or publicly. Built with Next.js, Supabase, and Tailwind CSS.

## Live Demo

- https://g4o2.me
- Next.js app hosted on Vercel free tier
- Database hosted on supabase free tier

## Features

- Anonymous or public posting and commenting
- User authentication (sign up, login, profile, google oauth)
- Voting (like/dislike) on posts and comments
- Responsive UI with dark mode
- Internationalization (i18n) support (English, Chinese Traditional)
- Privacy Policy and Terms of Service pages
- Simple analytics integration

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/) (database & auth)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn](https://shadcn.com/) for ui
- [i18next](https://www.i18next.com/) for translations

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Maxhu787/anon-board.git
   cd anon-board
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create `.env.local` and fill in your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

- `/app` - Next.js app directory (pages, layouts, routes)
- `/components` - ui components
- `/lib` - Utility functions and i18n setup and translations
- `/utils` - Supabase client/server utilities
- `/public` - Static files
- `/sql` - Sql schema designs for supabase

## License

CC BY-NC
(https://creativecommons.org/licenses/by-nc/4.0/)

---

For questions or feedback, you can contact me via social links on my website [maxhu787.github.io](https://maxhu787.github.io).
