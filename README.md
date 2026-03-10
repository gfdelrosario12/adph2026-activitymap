# 🏢 Arduino Day Philippines 2026 - Interactive 3D Activity Map

A modern, interactive 3D building visualization system for navigating event venues, activities, and livestreams at Arduino Day Philippines 2026.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![React](https://img.shields.io/badge/React-18.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-R3F-orange.svg)

## 🌟 Features

### 🏗️ 3D Building Visualization
- **Realistic Architecture**: Detailed 12-floor building with modern design elements
- **Interactive Navigation**: Click and drag to rotate, zoom, and explore
- **Floor-by-Floor View**: Navigate through floors with intuitive controls
- **Venue Highlighting**: Hover and click on rooms to see details
- **Real-time Updates**: Dynamic venue and activity information

### 🎨 Architectural Details
- **Penthouse Suite**: Glass penthouse on rooftop
- **HVAC Systems**: Realistic rooftop ventilation units
- **Communication Tower**: Antenna mast with beacon lights
- **Helipad**: Functional landing pad with markings
- **Balconies**: Every 3rd floor features outdoor balconies
- **Accent Lighting**: LED strips and corner illumination
- **Modern Entrance**: Glass doors with canopy and steps

### 📺 Livestreaming Integration
- **Live Streams**: Real-time event broadcasting
- **Activity Links**: Watch streams directly from activity cards
- **Stream Status**: Live, Upcoming, and Ended indicators
- **Modal Player**: Full-screen video player with autoplay
- **Search & Filter**: Find streams by title, speaker, or description

### 🎯 Activity Management
- **Session Tracking**: View all activities per venue
- **Capacity Monitoring**: See registration vs. capacity
- **Speaker Information**: Display speaker names and details
- **Time Scheduling**: Start and end times for each activity
- **Category Tags**: Color-coded activity types

### 📱 Responsive Design
- **Mobile Optimized**: Touch-friendly controls and layouts
- **Tablet Support**: Adaptive UI for medium screens
- **Desktop Experience**: Full-featured 3D navigation
- **Progressive Enhancement**: Works on all screen sizes
- **Breakpoints**: `xs` (375px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18.0 or higher
npm or yarn package manager
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/adph-activitymap.git
cd adph-activitymap
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
adph-activitymap/
├── app/
│   ├── page.tsx                 # Main 3D map page
│   ├── livestreams/
│   │   └── page.tsx            # Livestreams page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── Building3D.tsx          # 3D building component
│   ├── StreamCard.tsx          # Stream card component
│   ├── StreamModal.tsx         # Stream modal player
│   └── ...                     # Other components
├── lib/
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── hooks/
│   │   └── useData.ts          # Data fetching hooks
│   ├── utils/
│   │   └── helpers.ts          # Helper functions
│   └── constants/
│       └── config.ts           # App configuration
├── public/
│   ├── data/
│   │   ├── venues.json         # Venue data
│   │   ├── activities.json     # Activity data
│   │   ├── floors.json         # Floor data
│   │   └── livestreams.json    # Livestream data
│   └── images/                 # Static images
├── tailwind.config.ts          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── package.json                # Dependencies
```

## 🗄️ Data Structure

### Venues (`/public/data/venues.json`)
```json
{
  "id": "venue1",
  "name": "Main Auditorium",
  "floor": 0,
  "capacity": 500,
  "color": "#10b981",
  "position": { "x": 0, "y": 2, "z": 0 },
  "size": { "width": 15, "height": 4, "depth": 12 }
}
```

### Activities (`/public/data/activities.json`)
```json
{
  "id": "activity1",
  "title": "Arduino Workshop",
  "description": "Hands-on workshop...",
  "speaker": "John Doe",
  "venue": "venue1",
  "startTime": "10:00 AM",
  "endTime": "12:00 PM",
  "capacity": 50,
  "registered": 48,
  "category": "Workshop",
  "livestreamId": "stream1"
}
```

### Livestreams (`/public/data/livestreams.json`)
```json
{
  "id": "stream1",
  "title": "Opening Ceremony",
  "description": "Grand opening...",
  "speaker": "Dr. Maria Santos",
  "thumbnail": "/images/stream1.jpg",
  "embedUrl": "https://youtube.com/embed/VIDEO_ID",
  "status": "live",
  "quality": "1080p",
  "viewers": 2847,
  "startTime": "9:00 AM",
  "venue": "Main Auditorium"
}
```

### Floors (`/public/data/floors.json`)
```json
{
  "id": "floor0",
  "level": 0,
  "name": "Ground Floor",
  "description": "Main entrance and lobby"
}
```

## 🎨 Customization

### Building Configuration
Edit `/lib/constants/config.ts`:
```typescript
export const APP_CONFIG = {
  app: {
    name: 'Arduino Day Philippines 2026',
    description: 'Interactive Activity Map'
  },
  building: {
    floors: 12,
    name: 'Arduino Day Venue'
  }
}
```

### Colors & Theming
Venue types are color-coded:
- 🟢 Green (`#10b981`) - Workshops
- 🔵 Blue (`#3b82f6`) - Seminars
- 🟣 Purple (`#8b5cf6`) - Exhibitions
- 🟡 Yellow (`#f59e0b`) - Networking Areas

### 3D View Settings
Adjust in `Building3D.tsx`:
```typescript
camera: {
  position: [30, 25, 30],
  fov: 50
}
OrbitControls: {
  minDistance: 30,
  maxDistance: 180
}
```

## 🎬 Livestream Setup

### Adding Streams

1. **Prepare Video**
   - Upload to YouTube, Vimeo, or streaming platform
   - Get embed URL

2. **Create Thumbnail**
   - Recommended: 1920x1080px
   - Save to `/public/images/streams/`

3. **Add to JSON**
```json
{
  "id": "stream-new",
  "embedUrl": "https://youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=0",
  "thumbnail": "/images/streams/your-thumbnail.jpg"
}
```

### Linking Activities to Streams
Add `livestreamId` to activity:
```json
{
  "id": "activity1",
  "livestreamId": "stream1"
}
```

## 🎯 Key Features Explained

### Hover Tooltips
- Compact design with key information
- Capacity, dimensions, active sessions
- Color-coded by venue type
- Responsive sizing for all screens

### Floor Navigation
- **Desktop**: Sidebar with up/down buttons + quick jump menu
- **Mobile**: Bottom drawers for floor and venue selection
- Current floor highlighted in 3D view

### Stream Integration
- Click play button on activities with streams
- Opens modal with autoplay enabled
- Shows live status, viewer count, quality
- Fallback to thumbnail if no embed URL

### 3D Lighting System
- Ambient light for base illumination
- Directional sun light with shadows
- Fill lights for depth
- Hemisphere for natural gradient
- Spot lights for dramatic effect
- Environment map for reflections

## 🔧 Technical Stack

### Core Technologies
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Three.js**: 3D graphics engine
- **React Three Fiber**: React renderer for Three.js

### Key Libraries
- **@react-three/fiber**: 3D scene management
- **@react-three/drei**: 3D helpers and components
- **framer-motion**: Smooth animations
- **lucide-react**: Icon library
- **next/image**: Optimized images

### Performance Features
- Dynamic imports for code splitting
- Image optimization with Next.js
- Shadow map optimization
- Responsive 3D quality (desktop vs mobile)
- Efficient re-renders with React hooks

## 📊 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | 14+ | ✅ Full |
| Chrome Mobile | 90+ | ✅ Full |

## 🐛 Troubleshooting

### 3D Not Rendering
- Check WebGL support in browser
- Update graphics drivers
- Try different browser

### Streams Not Playing
- Verify embedUrl format
- Check CORS settings
- Ensure autoplay is allowed

### Performance Issues
- Reduce shadow quality in Building3D.tsx
- Lower maxDistance for OrbitControls
- Use mobile optimization flag

### Data Not Loading
- Check JSON file syntax
- Verify file paths in public/data/
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions/changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Arduino Day Philippines 2026 Organizing Committee**

## 🙏 Acknowledgments

- Three.js community for 3D graphics support
- React Three Fiber for React integration
- Next.js team for excellent framework
- Tailwind CSS for styling system
- Open source contributors

## 📧 Contact

For questions or support:
- Email: support@arduinoday.ph
- Website: https://arduinoday.ph
- Twitter: @ArduinoDayPH

## 🗺️ Roadmap

- [ ] AR mode for on-site navigation
- [ ] QR code venue check-ins
- [ ] Real-time capacity updates
- [ ] Interactive chat during streams
- [ ] Speaker profiles and bios
- [ ] Event calendar integration
- [ ] Downloadable floor plans
- [ ] Multi-language support

---

**Built with ❤️ for Arduino Day Philippines 2026**

*Experience Innovation in 3D**
