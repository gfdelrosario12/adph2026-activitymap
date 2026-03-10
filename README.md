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
- **Penthouse Suite**: Modern glass penthouse on rooftop (60% building footprint)
- **HVAC Systems**: 4 industrial AC units on rooftop corners
- **Ventilation**: 2 cylindrical vents with industrial grills
- **Communication Tower**: 6-meter antenna mast with red beacon light and satellite dishes
- **Helipad**: Yellow circular landing pad with white "H" marking and glow effect
- **Building Signage**: Green illuminated logo panel on top facade with emissive glow
- **Balconies**: Every 3rd floor features outdoor balconies with glass/metal railings
- **Accent Lighting**: Green LED strips every 4 floors, blue vertical corner lighting
- **Modern Entrance**: 6m wide glass doors with blue tint, 3-tier steps, and canopy
- **Facade Details**: Horizontal bands, corner accent strips, window frames

### 📺 Livestreaming Integration
- **Autoplay Video**: Videos automatically play when modal opens
- **Live Streams**: Real-time event broadcasting with status indicators
- **Activity Links**: Watch streams directly from activity cards with play button
- **Stream Status**: Live (red pulse), Upcoming (yellow), and Ended (gray) badges
- **Modal Player**: Full-screen responsive video player with iframe embedding
- **Thumbnail Fallbacks**: Black background with icon if no video/thumbnail available
- **Search & Filter**: Find streams by title, speaker, or description
- **Viewer Count**: Real-time viewer statistics display
- **Quality Indicators**: HD, 1080p, 720p quality badges
- **Responsive Player**: Adapts to mobile, tablet, and desktop screens

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

### How Autoplay Works
The system automatically adds autoplay parameters to video URLs:
```typescript
// Automatic URL modification
"https://youtube.com/embed/VIDEO_ID" 
→ "https://youtube.com/embed/VIDEO_ID?autoplay=1&mute=0"
```

### Adding Streams

1. **Prepare Video**
   - Upload to YouTube, Vimeo, or streaming platform
   - Get embed URL (not regular watch URL)
   - Example: `https://youtube.com/embed/YOUR_VIDEO_ID`

2. **Create Thumbnail**
   - Recommended: 1920x1080px (16:9 aspect ratio)
   - Formats: JPG, PNG, WebP
   - Save to `/public/images/streams/`
   - Use external URLs (configured in next.config.mjs)

3. **Add to JSON** (`/public/data/livestreams.json`)
```json
{
  "id": "stream-new",
  "title": "Workshop Title",
  "description": "Detailed description...",
  "speaker": "Speaker Name",
  "embedUrl": "https://youtube.com/embed/YOUR_VIDEO_ID",
  "thumbnail": "https://images.unsplash.com/photo-xxx",
  "status": "live",
  "quality": "1080p",
  "viewers": 150,
  "startTime": "2:00 PM",
  "venue": "Main Hall"
}
```

### Stream Status Options
- `"live"` - Currently broadcasting (red badge with pulse)
- `"upcoming"` - Scheduled but not started (yellow badge)
- `"ended"` - Past broadcast/recording (gray badge)

### Linking Activities to Streams
Add `livestreamId` to activity in `/public/data/activities.json`:
```json
{
  "id": "activity1",
  "title": "Arduino Workshop",
  "venue": "venue1",
  "livestreamId": "stream1",
  ...
}
```

When linked:
- Play button appears on activity card
- "STREAMING NOW" or "Stream Available" badge shown
- Clicking button opens modal with autoplay

### Thumbnail Requirements
- **With embedUrl**: Thumbnail shows before clicking, video autoplays in modal
- **Without embedUrl**: Only thumbnail shown with "Stream Preview" message
- **Neither**: Black background with "No video available" message

## 🎯 Key Features Explained

### Compact Hover Tooltips
- **Size-Optimized Design**: Compact layout with essential information only
- **Max Width**: 90vw mobile → 85vw xs → 448px sm → 512px md
- **Content**: Venue name, floor, capacity, dimensions, active sessions
- **Visual Indicators**: Color-coded dots, badges, and stats
- **Responsive Sizing**: Scales perfectly from 320px to 2560px+ screens
- **Action Prompt**: "Click to view details" with pointer emoji

### Floor Navigation
- **Desktop**: Sidebar with up/down buttons + quick jump menu
- **Mobile**: Bottom drawers for floor and venue selection
- **Visual Feedback**: Current floor highlighted in 3D view with glow
- **Quick Jump**: All floors list with venue count badges
- **Smooth Transitions**: Animated floor changes with ease

### Stream Integration
- **One-Click Play**: Click activity play button to open stream
- **Autoplay Modal**: Video starts automatically when modal opens
- **Live Indicators**: Real-time "STREAMING NOW" badges
- **Multiple States**: Shows live status, viewer count, quality
- **Error Handling**: Graceful fallbacks for missing content
- **ESC to Close**: Keyboard shortcut for quick modal dismissal

### 3D Lighting System
- **Ambient Light**: Base illumination at 0.35 intensity
- **Directional Sun**: Main light at 1.5 intensity with 2048x2048 shadow maps
- **Fill Lights**: Blue-tinted secondary light at 0.6 intensity
- **Point Lights**: Purple accent from above at 0.5 intensity
- **Spot Lights**: Green and indigo dramatic lighting
- **Hemisphere Light**: Sky/ground gradient at 0.4 intensity
- **Environment Map**: City preset with custom light formers
- **ACES Tone Mapping**: Cinematic color grading at 1.2 exposure

### 3D Building Details
- **12 Floors**: Full building with Ground to 11th floor
- **55m × 55m**: Large footprint to accommodate all venues
- **Penthouse**: Glass structure at 60% building width
- **Rooftop Elements**: HVAC units, vents, antenna, helipad
- **Windows**: 12 per side per floor with blue tint
- **Dynamic Opacity**: Current floor more transparent for viewing
- **Balconies**: Every 3rd floor with railings
- **Accent Bands**: Green strips every 4 floors
- **Corner Lighting**: Blue vertical LED strips full height
- **Entrance**: Glass doors, steps, canopy with pillars

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
- Shadow map optimization (2048x2048)
- Responsive 3D quality (desktop vs mobile)
- Efficient re-renders with React hooks
- Lazy loading for livestream thumbnails
- Soft shadows for better performance
- Environment map caching
- WebGL optimizations for Three.js

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
- Clear browser cache
- Disable browser extensions

### Streams Not Playing
- Verify embedUrl format (must be embed URL, not watch URL)
- Check CORS settings
- Ensure autoplay is allowed in browser settings
- Try different browser (some block autoplay)
- Check if video URL is accessible

### Images Not Loading
- Verify thumbnail URLs are correct
- Check external image domains in next.config.mjs
- Ensure images are accessible (not behind auth)
- Try using local images in /public/images/

### Performance Issues
- Reduce shadow quality in Building3D.tsx (change shadow-mapSize)
- Lower maxDistance for OrbitControls
- Use mobile optimization flag (isMobile prop)
- Disable environment map for lower-end devices
- Reduce number of windows/architectural details

### Data Not Loading
- Check JSON file syntax (use JSON validator)
- Verify file paths in public/data/
- Check browser console for errors
- Ensure all required fields are present
- Check for trailing commas in JSON

### Modal Not Opening
- Check if stream object has valid data
- Verify StreamModal is imported correctly
- Check z-index conflicts with other elements
- Ensure isOpen state is updating properly
- Check browser console for React errors

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

### Phase 1 - Core Features (Completed ✅)
- [x] 3D building visualization with 12 floors
- [x] Interactive venue navigation and selection
- [x] Livestream integration with autoplay
- [x] Activity management and scheduling
- [x] Responsive design for all devices
- [x] Realistic building architecture

### Phase 2 - Enhanced Features (In Progress 🚧)
- [ ] AR mode for on-site navigation
- [ ] QR code venue check-ins
- [ ] Real-time capacity updates via WebSocket
- [ ] Interactive chat during streams
- [ ] Push notifications for activity reminders

### Phase 3 - Community Features (Planned 📋)
- [ ] Speaker profiles and bios with photos
- [ ] Event calendar integration with Google Calendar
- [ ] Downloadable floor plans as PDF
- [ ] Multi-language support (Filipino, English, Japanese)
- [ ] User accounts and personalized schedules
- [ ] Social sharing for activities and streams
- [ ] Feedback and rating system
- [ ] Photo gallery from events
- [ ] Networking features for attendees

---

**Built with ❤️ for Arduino Day Philippines 2026**

*Experience Innovation in 3D*
