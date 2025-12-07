# VeStream - Modern Streaming Platform

![VeStream Banner](https://via.placeholder.com/1200x300/000000/00ff88?text=VeStream+-+Stream+Movies+%26+TV+Shows)

> A cutting-edge streaming platform built with Next.js 15, TMDB API, and modern web technologies. Stream unlimited movies and TV shows with a cinematic user experience.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

### Core Features
- **🎬 Cinematic Hero Section** - Auto-rotating featured content with embedded trailers
- **🔍 Advanced Search** - Real-time search with multi-filter support (genre, year, rating)
- **📚 Personal Library** - Continue watching, watch history, liked & saved content
- **🎯 Smart Discovery** - Trending, popular, top-rated content sections
- **📱 Progressive Web App** - Install on any device for native-like experience
- **🎨 Beautiful UI** - Modern, responsive design with Tailwind CSS and shadcn/ui

### Premium Features
- **🤖 VeBot AI Assistant** - Intelligent chatbot for content recommendations
- **📊 Analytics Dashboard** - Track your viewing habits and statistics
- **🎮 Advanced Video Player** - Custom controls, quality selection, keyboard shortcuts
- **💾 Offline Support** - Continue browsing even without internet connection
- **🌐 Internationalization** - Multi-language support (coming soon)
- **⚡ Performance Optimized** - Image optimization, code splitting, lazy loading

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **UI Library**: [React 18](https://reactjs.org/) - Component-based UI
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) - Utility-first CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) - Accessible components
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management

### Data & APIs
- **Movie Database**: [TMDB API](https://www.themoviedb.org/documentation/api) - Comprehensive movie/TV data
- **Streaming Sources**: Gifted Movies API - Video streaming links
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query) - Async state management

### Performance & SEO
- **Image Optimization**: [Sharp](https://sharp.pixelplumbing.com/) - Next.js Image Optimization
- **Analytics**: Custom analytics with local storage
- **SEO**: Next.js metadata API, sitemap, robots.txt
- **PWA**: Service worker, manifest, offline support

## Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- npm or yarn package manager
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vestream.git
   cd vestream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # TMDB API Configuration
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   NEXT_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/original
   NEXT_PUBLIC_TMDB_POSTER_URL=https://image.tmdb.org/t/p/w500

   # Gifted Movies API Configuration
   NEXT_PUBLIC_GIFTED_SEARCH_URL=https://api.consumet.org/movies/giftmovies
   NEXT_PUBLIC_GIFTED_INFO_URL=https://api.consumet.org/movies/giftmovies/info
   NEXT_PUBLIC_GIFTED_SOURCES_URL=https://api.consumet.org/movies/giftmovies/watch

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=VeStream
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Project Structure

```
vestream/
├── app/                          # Next.js App Router
│   ├── layout.jsx               # Root layout with metadata
│   ├── page.jsx                 # Homepage with hero section
│   ├── discover/                # Discovery page
│   ├── library/                 # Personal library page
│   ├── search/                  # Search page
│   ├── watch/[type]/[id]/      # Video player page
│   ├── analytics/               # Analytics dashboard
│   └── api/                     # API routes
│
├── src/
│   ├── components/              # React components
│   │   ├── Player.js           # Video player component
│   │   ├── VeBot.jsx           # AI chatbot
│   │   ├── Navigation.jsx      # Navigation components
│   │   ├── ContinueWatching.jsx # Continue watching section
│   │   ├── AdvancedSearch.jsx  # Advanced search component
│   │   └── ui/                 # shadcn/ui components
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAnalytics.js     # Analytics tracking
│   │   ├── useRecommendations.js # Content recommendations
│   │   └── useMovieData.js     # Movie data fetching
│   │
│   ├── services/                # API services
│   │   └── movieApi.js         # TMDB & Gifted API integration
│   │
│   ├── store/                   # State management
│   │   └── usePreferences.js   # User preferences store
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── analytics.js        # Analytics utilities
│   │   ├── performance.js      # Performance monitoring
│   │   └── accessibility.js    # Accessibility helpers
│   │
│   └── constants/               # Constants and config
│       └── config.js           # API configuration
│
├── public/                      # Static assets
│   ├── manifest.json           # PWA manifest
│   ├── logo.png                # App logo
│   └── icons/                  # App icons
│
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

## Key Features Explained

### 1. Homepage with Cinematic Hero

The homepage features a stunning hero section that:
- Automatically rotates between top 5 trending content every 3 minutes
- Embeds YouTube trailers with autoplay
- Shows high-quality backdrop images with cinematic gradients
- Displays content metadata (rating, year, quality)

### 2. Advanced Search & Discovery

Discover page offers:
- **Filter by Genre**: Browse by specific genres
- **Filter by Year**: Find content from specific years
- **Filter by Rating**: Show only highly-rated content
- **Sort Options**: Popularity, rating, release date
- **Media Type Toggle**: Switch between movies and TV shows
- **View Modes**: Grid or list view

### 3. Personal Library

Track your watching journey with:
- **Continue Watching**: Resume from where you left off
- **Watch History**: See all content you've watched
- **Liked Content**: Quick access to your favorites
- **My List**: Save content to watch later
- **Remove Management**: Easy removal from lists

### 4. Video Player

Professional video player with:
- Custom controls and UI
- Quality selection (720p, 1080p, 4K)
- Keyboard shortcuts support
- Progress tracking and resume playback
- Episode navigation for TV shows
- Full-screen support

### 5. VeBot AI Assistant

Intelligent chatbot that can:
- Recommend movies based on your preferences
- Answer questions about content
- Help you discover new shows
- Provide movie information

## API Integration

### TMDB API

Used for:
- Movie and TV show metadata
- Posters, backdrops, and images
- Trending content
- Search functionality
- Recommendations and similar content
- Trailers and videos

### Gifted Movies API

Used for:
- Streaming video sources
- Download links
- Multiple quality options

## State Management

### Zustand Stores

**usePreferencesStore** - Manages user preferences:
```javascript
{
  settings: { autoplay, quality, subtitles, theme },
  watchHistory: [],
  continueWatching: {},
  likedMovies: {},
  savedMovies: {},
  recentSearches: []
}
```

All data is persisted to localStorage automatically.

## Performance Optimizations

1. **Image Optimization**: Sharp for automatic image optimization
2. **Code Splitting**: Dynamic imports for large components
3. **Lazy Loading**: Images loaded on demand
4. **Bundle Analysis**: Optional bundle analyzer
5. **React Query**: Efficient data caching and refetching
6. **Static Generation**: Pre-rendered pages where possible

## SEO Features

- Dynamic meta tags per page
- Open Graph tags for social sharing
- Twitter Card tags
- Sitemap generation
- Robots.txt configuration
- Structured data (JSON-LD)

## PWA Support

Install VeStream as a native app:
- Custom install prompt
- Offline functionality
- App icons for all devices
- Splash screens
- Share target support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Keyboard Shortcuts

### Player Controls
- `Space` - Play/Pause
- `F` - Toggle fullscreen
- `M` - Toggle mute
- `←/→` - Seek backward/forward
- `↑/↓` - Volume up/down

### Navigation
- `Esc` - Close modals/player
- `/` - Focus search (coming soon)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the amazing API
- [Consumet API](https://consumet.org/) for streaming sources
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Lucide](https://lucide.dev/) for icons
- All open source contributors

## Support

For support, email support@vestream.com or open an issue on GitHub.

## Roadmap

- [ ] User authentication and profiles
- [ ] Multi-language support
- [ ] Download manager for offline viewing
- [ ] Notification system for new episodes
- [ ] Social features (watch parties, comments)
- [ ] Mobile apps (React Native)
- [ ] Chrome extension

---

Made with ❤️ by the VeStream Team
