# Arduino Day Philippines 2026 - Activity Site Map 🇵🇭

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-8.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

An interactive 3D venue visualization platform for Arduino Day Philippines 2026 at Asia Pacific College. Features real-time event tracking, livestream integration, floor plan navigation, and a mobile-first responsive design with Arduino's iconic green theme.

## 📑 Table of Contents

- [🎯 About](#-about)
- [🌟 Key Features](#-key-features)
- [🏗️ Architecture & Design](#️-architecture--design)
- [🎨 Color System & Theme](#-color-system--theme)
- [🚀 Getting Started](#-getting-started)
- [📊 Data Structure & Customization](#-data-structure--customization)
- [🛠️ Development Guide](#️-development-guide)
- [📱 Responsive Design & Mobile Optimization](#-responsive-design--mobile-optimization)
- [🎬 Livestream System](#-livestream-system)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🤝 Contributing](#-contributing)
- [🚢 Deployment](#-deployment)
- [📄 License](#-license)
- [🛠️ Tech Stack](#️-tech-stack)
- [👥 Team & Credits](#-team--credits)
- [📞 Support & Contact](#-support--contact)
- [🗺️ Roadmap](#️-roadmap)
- [🔗 Useful Links](#-useful-links)

## 🎯 About

This web application provides an immersive way to explore the Arduino Day Philippines 2026 event venue at Asia Pacific College. Built with Next.js 14 and React Three Fiber, it offers a stunning 3D visualization of the entire building with 129+ venues across 12 floors, complete with activity scheduling and live streaming capabilities.

## 🌟 Key Features

### 3D Visualization
- **Interactive Building Model** - Navigate through Asia Pacific College in stunning 3D
- **Dual View Modes** - Switch between perspective (3D) and top-down (floor plan) views
- **129+ Venues** - Labs, classrooms, event spaces, and workshops across 12 floors
- **Enhanced Hover Effects** - Glowing highlights, scale animations, spotlights, and rings
- **Floating Labels** - Clear, always-visible venue labels for easy identification
- **Venue Details** - Comprehensive information drawer with capacity, activities, and specs

### Event Management
- **Activity Scheduling** - View events, workshops, and sessions per venue
- **Real-time Status** - Track ongoing, upcoming, and completed activities
- **Category Badges** - Visual indicators for workshops, talks, exhibitions, and demos
- **Capacity Tracking** - Monitor registration numbers vs. venue capacity
- **Time Management** - Formatted time displays and duration tracking

### Livestream System
- **Multiple Playback Options**:
  - 🎬 **Play Here** - Native embedded player in modal
  - 🔲 **Fullscreen** - New tab with fullscreen player
  - 📺 **YouTube** - Open directly on YouTube.com
- **Activity Mapping** - Streams linked to specific activities and venues
- **Live Status Indicators** - 🔴 Live, 🟡 Upcoming, ⚪ Ended
- **Viewer Count** - Real-time audience tracking
- **Quality Indicators** - 4K, 1080p, 720p stream quality badges

### Design & Performance
- **Mobile-First Responsive** - Optimized for devices from 320px to 4K displays
- **Arduino Green Theme** - Emerald green (#10b981) primary color throughout
- **Performance Optimized** - Adaptive rendering, reduced shadows/geometry on mobile
- **Touch-Friendly** - 44px+ tap targets, active states, disabled hover on touch
- **Accessibility** - WCAG compliant, keyboard navigation, screen reader support
- **Loading States** - Skeleton loaders and spinners with green theme

## 🏗️ Architecture & Design

### Project Structure

```
adph-activitymap/
├── app/                          # Next.js 14 app directory
│   ├── layout.tsx               # Root layout with metadata and theme
│   ├── page.tsx                 # Main application page (3D view)
│   ├── globals.css              # Global styles and Tailwind
│   ├── activity-map/
│   │   └── page.tsx            # Activity map route
│   └── livestreams/
│       └── page.tsx            # Livestreams page with modal viewer
│
├── components/                   # React components
│   ├── Building3D.tsx           # 3D building renderer (React Three Fiber)
│   ├── StreamCard.tsx           # Livestream card component
│   ├── StreamModal.tsx          # Stream modal with playback options
│   ├── VenueDrawer.tsx          # Venue details drawer
│   ├── theme-provider.tsx       # Dark mode theme provider
│   └── ui/                      # Shadcn UI component library
│       ├── button.tsx
│       ├── card.tsx
│       ├── drawer.tsx
│       ├── dialog.tsx
│       └── ... (40+ components)
│
├── lib/                         # Core utilities and configurations
│   ├── constants/
│   │   ├── colors.ts           # Color palette (Arduino green theme)
│   │   └── config.ts           # Application configuration
│   ├── hooks/
│   │   └── useData.ts          # Custom data fetching hooks
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── utils/
│       ├── helpers.ts          # Helper functions (venue/stream mapping)
│       └── utils.ts            # Utility functions (Shadcn)
│
├── public/                      # Static assets
│   ├── data/                   # JSON data files (data source)
│   │   ├── activities.json     # Event activities and sessions
│   │   ├── floors.json         # Floor definitions (Ground-Rooftop)
│   │   ├── livestreams.json    # Stream data with YouTube URLs
│   │   └── venues-apc.json     # Venue data (129 venues)
│   └── *.png, *.svg            # Images and icons
│
├── styles/
│   └── globals.css              # Additional global styles
│
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
└── package.json                 # Dependencies and scripts
```

### Design Patterns & Best Practices

#### 1. **Separation of Concerns**
- **Business Logic**: `/lib/utils/helpers.ts` - venue filtering, stream mapping
- **Configuration**: `/lib/constants/` - colors, app settings
- **Type Definitions**: `/lib/types/` - TypeScript interfaces
- **Components**: `/components/` - UI and 3D rendering
- **Data**: `/public/data/` - JSON data files

#### 2. **Custom Hooks Pattern**
All data fetching uses custom hooks with loading/error states:
```typescript
// Data fetching hooks with TypeScript
const { venues, loading, error } = useVenues()
const { activities } = useActivities()
const { floors } = useFloors()
const { streams } = useLiveStreams()

// Responsive design hook
const isMobile = useIsMobile()
```

#### 3. **Configuration-Driven Development**
Centralized configuration for easy customization:
```typescript
// App configuration
import { APP_CONFIG } from '@/lib/constants/config'
// Color system
import { COLORS } from '@/lib/constants/colors'
```

#### 4. **Type Safety First**
Strict TypeScript throughout the codebase:
```typescript
// Strongly typed interfaces
import type { Venue, Activity, LiveStream, Floor } from '@/lib/types'
```

#### 5. **Modular Data Management**
- All data separated into JSON files
- No inline data in components
- Easy to update without code changes
- JSON structure follows TypeScript types

#### 6. **Performance Optimization**
- Adaptive rendering based on device capabilities
- Lazy loading for heavy components
- Memoization with React.memo
- Reduced geometry/shadows on mobile
- Code splitting with Next.js dynamic imports

## 🎨 Color System & Theme

### Arduino Green Theme
The entire application uses Arduino's iconic green color palette:

```typescript
// Primary Color Palette
primary: {
  50:  '#f0fdf4',   // Lightest green
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',   // Main Arduino Green ⭐
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
}

// Venue Type Colors
venue: {
  lab:       '#10b981',  // Emerald 500 - Computer Labs
  event:     '#22c55e',  // Green 500 - Event Spaces
  classroom: '#059669',  // Emerald 600 - Classrooms
  workshop:  '#34d399',  // Emerald 400 - Workshop Areas
}

// UI Colors
ui: {
  background:     '#ffffff',
  backgroundDark: '#0a0a0a',
  text:           '#171717',
  textDark:       '#fafafa',
  border:         '#e5e5e5',
  borderDark:     '#262626',
}
```

### Venue Type Legend
- 🧪 **Labs** - `#10b981` (Emerald 500) - Computer & Engineering Labs
- 🎤 **Events** - `#22c55e` (Green 500) - Auditoriums & Event Halls
- 📚 **Classrooms** - `#059669` (Emerald 600) - Lecture Rooms
- 🛠️ **Workshops** - `#34d399` (Emerald 400) - Workshop Spaces

### Theme Application
- Navigation bar: Green gradient background
- Buttons: Primary green with hover states
- Venue highlights: Glowing green borders and fills
- Live status indicators: Green for active streams
- Loading spinners: Animated green theme
- Badges: Green variants for categories

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **Package Manager**: npm, yarn, or pnpm (pnpm recommended)
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/adph-activitymap.git
cd adph-activitymap
```

2. **Install dependencies**
```bash
# Using npm (with legacy peer deps for React Three Fiber)
npm install --legacy-peer-deps

# Using yarn
yarn install

# Using pnpm
pnpm install
```

> **Note**: The `--legacy-peer-deps` flag is required for npm due to peer dependency conflicts with React Three Fiber packages. This is already configured in `.npmrc` for automatic use.

3. **Run development server**
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start

# Or build and preview
npm run build && npm run start
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## 📊 Data Structure & Customization

### Venues (`/public/data/venues-apc.json`)

Each venue includes comprehensive information for 3D rendering and display:

```json
{
  "id": "floor2-comlab204",
  "name": "Com Lab 204",
  "floor": 1,
  "position": {
    "x": -8,
    "y": 4.5,
    "z": 10
  },
  "size": {
    "width": 10,
    "height": 3,
    "depth": 10
  },
  "capacity": 40,
  "color": "#10b981",
  "type": "lab",
  "description": "Computer laboratory with 40 workstations"
}
```

**Key Fields:**
- `id`: Unique identifier (format: `floor{N}-{type}-{name}`)
- `name`: Display name of venue
- `floor`: Floor number (0=Ground, 1-10=Floors, 11=Rooftop)
- `position`: 3D coordinates (x, y, z) in scene space
- `size`: Dimensions (width, height, depth) in meters
- `capacity`: Maximum occupancy
- `color`: Hex color code (matches venue type)
- `type`: Category (lab, event, classroom, workshop)
- `description`: Optional detailed description

### Activities (`/public/data/activities.json`)

Event activities and sessions mapped to venues:

```json
{
  "id": "activity-1",
  "title": "Introduction to Arduino",
  "venue": "floor2-comlab204",
  "startTime": "09:00",
  "endTime": "11:00",
  "speaker": "John Doe",
  "description": "Beginner-friendly Arduino programming workshop",
  "category": "workshop",
  "capacity": 40,
  "registered": 35,
  "status": "upcoming"
}
```

**Key Fields:**
- `id`: Unique activity identifier
- `title`: Activity name
- `venue`: Reference to venue ID
- `startTime`/`endTime`: Time in HH:MM format
- `speaker`: Speaker/instructor name
- `description`: Detailed description
- `category`: workshop, talk, exhibition, demo, networking
- `capacity`: Max participants
- `registered`: Current registrations
- `status`: upcoming, ongoing, completed

### Livestreams (`/public/data/livestreams.json`)

Streaming data with multiple playback options:

```json
{
  "id": "stream-1",
  "title": "Main Auditorium - Opening Ceremony",
  "speaker": "Arduino Day Team",
  "venue": "floor6-auditorium",
  "activity": "activity-1",
  "status": "live",
  "youtubeUrl": "https://youtube.com/watch?v=VIDEO_ID",
  "embedUrl": "https://youtube.com/embed/VIDEO_ID",
  "quality": "1080p",
  "viewers": 2340,
  "thumbnail": "/placeholder.jpg"
}
```

**Key Fields:**
- `id`: Unique stream identifier
- `title`: Stream title
- `speaker`: Presenter name
- `venue`: Reference to venue ID (where it's being broadcasted from)
- `activity`: Reference to activity ID (what's being streamed)
- `status`: live, upcoming, ended
- `youtubeUrl`: Full YouTube watch URL
- `embedUrl`: YouTube embed URL
- `quality`: Video quality (4K, 1080p, 720p)
- `viewers`: Current viewer count
- `thumbnail`: Preview image path

### Floors (`/public/data/floors.json`)

Floor metadata for navigation:

```json
{
  "level": 0,
  "name": "Ground Floor",
  "abbreviation": "GF"
}
```

**Key Fields:**
- `level`: Floor number (0-11)
- `name`: Full floor name
- `abbreviation`: Short name for mobile display

## 🛠️ Development Guide

### Adding New Venues

1. **Open venues data file**
```bash
# Edit the JSON file
code public/data/venues-apc.json
```

2. **Add venue object**
```json
{
  "id": "floor3-newroom",
  "name": "New Room Name",
  "floor": 2,
  "position": { "x": 0, "y": 8.5, "z": 0 },
  "size": { "width": 12, "height": 3, "depth": 8 },
  "capacity": 50,
  "color": "#10b981",
  "type": "lab",
  "description": "Description of the new venue"
}
```

3. **Position Guidelines**
- `x`: Left (-) to Right (+), range: -40 to 40
- `y`: Floor level (floor × 4.0) + 1.5, e.g., Floor 3 = 8.5
- `z`: Back (-) to Front (+), range: -30 to 30

4. **Color Codes**
- Labs: `#10b981`
- Events: `#22c55e`
- Classrooms: `#059669`
- Workshops: `#34d399`

5. **Test the venue**
- Run dev server: `npm run dev`
- Navigate to the floor
- Verify position and appearance
- Check hover effects and info drawer

### Adding Activities

1. **Edit activities file**
```bash
code public/data/activities.json
```

2. **Add activity object**
```json
{
  "id": "activity-new",
  "title": "Activity Title",
  "venue": "floor3-newroom",
  "startTime": "14:00",
  "endTime": "16:00",
  "speaker": "Speaker Name",
  "description": "Activity description",
  "category": "workshop",
  "capacity": 50,
  "registered": 0,
  "status": "upcoming"
}
```

3. **Activity will automatically appear**
- In venue info drawer
- On activity map page
- Linked to the specified venue

### Adding Livestreams

1. **Edit livestreams file**
```bash
code public/data/livestreams.json
```

2. **Add livestream object**
```json
{
  "id": "stream-new",
  "title": "Stream Title",
  "speaker": "Speaker Name",
  "venue": "floor3-newroom",
  "activity": "activity-new",
  "status": "upcoming",
  "youtubeUrl": "https://youtube.com/watch?v=YOUR_VIDEO_ID",
  "embedUrl": "https://youtube.com/embed/YOUR_VIDEO_ID",
  "quality": "1080p",
  "viewers": 0,
  "thumbnail": "/placeholder.jpg"
}
```

3. **Stream features**
- Automatically linked to venue and activity
- Shows on livestreams page
- Three playback options (native, fullscreen, YouTube)

### Customizing Colors

**Edit color constants:**
```typescript
// lib/constants/colors.ts
export const COLORS = {
  primary: {
    500: '#yourcolor',  // Change main brand color
  },
  venue: {
    lab: '#yourcolor',
    event: '#yourcolor',
    classroom: '#yourcolor',
    workshop: '#yourcolor',
  }
}
```

**Apply globally:**
- Navigation bars
- Buttons and CTAs
- Venue highlights
- Loading indicators
- Status badges

### Customizing Configuration

**Edit app configuration:**
```typescript
// lib/constants/config.ts
export const APP_CONFIG = {
  app: {
    name: 'Your Event Name',
    shortName: 'Short Name',
    description: 'Event description',
    version: '1.0.0',
  },
  building: {
    floors: 12,           // Total number of floors
    floorHeight: 4,       // Height of each floor (meters)
    groundFloorName: 'Ground Floor',
    rooftopFloorName: 'Rooftop',
  },
  camera: {
    defaultFov: 55,       // Field of view (degrees)
    minDistance: 20,
    maxDistance: 150,
  },
  performance: {
    targetFps: 60,
    adaptiveRendering: true,
  }
}
```

## 📱 Responsive Design & Mobile Optimization

### Mobile-First Approach
Built from the ground up for mobile devices (320px+), then enhanced for larger screens.

### Breakpoints
```typescript
xs:  '475px'   // Extra small phones (iPhone SE)
sm:  '640px'   // Small phones (iPhone 12/13)
md:  '768px'   // Tablets (iPad Mini)
lg:  '1024px'  // Laptops (iPad Pro, small desktops)
xl:  '1280px'  // Desktops (HD displays)
2xl: '1536px'  // Large displays (2K+)
```

### Component Adaptations

#### Navigation Bar
- **Mobile**: Compact logo ("AD 2026"), smaller buttons, hidden venue count
- **Tablet+**: Full logo ("Arduino Day 2026"), larger buttons, venue count badge
- **Touch**: Active states with scale-95 for haptic feedback

#### 3D Canvas Performance
- **Mobile (< 768px)**:
  - Shadows disabled
  - DPR: [1, 1.5] (lower resolution)
  - 2 light sources (vs 4 on desktop)
  - Hover effects disabled
  - Interior details hidden
  - Camera distance: 90/45/90
  - FOV: 65°
  
- **Desktop (≥ 768px)**:
  - Full shadow rendering
  - DPR: [1, 2] (high resolution)
  - 4 light sources + spotlight
  - Full hover effects (glow, scale, rings)
  - Interior grid and furniture
  - Camera distance: 70/35/70
  - FOV: 55°

#### Floor Controls
- **Mobile**: Compact padding, hidden view mode indicator
- **Desktop**: Larger buttons, view mode label visible
- **All devices**: Minimum 44px tap targets (WCAG/Apple standards)

#### Venue Info Panel
- **Mobile**: 
  - Width: calc(100vw - 5rem)
  - Max height: 40vh
  - Compact padding (p-3)
  - Truncated text
  - Smaller icons (h-3 w-3)
  
- **Tablet**: 
  - Width: 20rem (80)
  - Max height: 50vh
  - Medium padding (p-4)
  
- **Desktop**: 
  - Width: 24rem (96)
  - Max height: 70vh
  - Full padding (p-6)
  - Full text display
  - Larger icons (h-4 w-4)

#### Quick Navigation Panel
- **Mobile**: 
  - Hidden by default, use hamburger menu
  - Compact design, vertical list
  - Smooth slide-in/out animation
  - Tappable areas: minimum 44px height

- **Tablet+**: 
  - Always visible on right side
  - Expanded view with icons
  - Quick access to floors and venues

#### Hover Tooltip
- **Mobile**: Fixed centered overlay, max-w-[90vw]
- **Desktop**: Follows cursor, max-w-md
- **Touch devices**: No hover effects (better performance)

### Performance Targets

| Device Type | FPS | Initial Load | Memory Usage |
|-------------|-----|--------------|--------------|
| Mobile      | 30+ | < 3s         | < 200MB      |
| Tablet      | 45+ | < 2.5s       | < 300MB      |
| Desktop     | 60  | < 2s         | < 400MB      |

### Touch Optimizations
- ✅ Minimum 44×44px tap targets
- ✅ Active states for feedback
- ✅ Disabled hover effects
- ✅ Simplified geometry
- ✅ Reduced animation complexity
- ✅ Haptic feedback (scale animations)

## 🎬 Livestream System

### Overview
Comprehensive streaming system with multiple playback options, activity mapping, and real-time status tracking.

### Playback Options

When users click a livestream, they see three options:

1. **🎬 Play Here (Native)**
   - Embedded player directly in modal
   - No page navigation
   - Smooth viewing experience
   - Can switch to other options anytime

2. **🔲 Fullscreen (New Tab)**
   - Opens embed in new browser tab
   - Full screen experience
   - Ideal for multitasking

3. **📺 YouTube (External)**
   - Opens on YouTube.com
   - Full YouTube features (comments, likes, subscriptions)
   - Best for users who prefer YouTube platform

### Stream States

- 🔴 **Live** - Currently broadcasting (green badge)
- 🟡 **Upcoming** - Scheduled for later (yellow badge)
- ⚪ **Ended** - Recording available (gray badge)

### Activity & Venue Mapping

Streams are connected to both activities and venues:

```typescript
// Find streams for specific activity
const activityStreams = getStreamsByActivity(streams, 'activity-1')

// Find streams for specific venue
const venueStreams = getStreamsByVenue(streams, 'floor6-auditorium')

// Check if activity has live stream
const hasStream = hasLiveStream(streams, 'activity-1')
```

### Data Structure

```json
{
  "id": "stream-1",
  "title": "Opening Ceremony",
  "speaker": "Arduino Team",
  "venue": "floor6-auditorium",
  "activity": "activity-1",
  "status": "live",
  "youtubeUrl": "https://youtube.com/watch?v=VIDEO_ID",
  "embedUrl": "https://youtube.com/embed/VIDEO_ID",
  "quality": "1080p",
  "viewers": 2340
}
```

### Helper Functions

**`/lib/utils/helpers.ts`**

- `getStreamsByActivity()` - Get all streams for an activity
- `getStreamsByVenue()` - Get all streams from a venue
- `hasLiveStream()` - Check if activity has live stream
- `getStreamStatus()` - Get stream status badge
- `formatViewerCount()` - Format viewer numbers (1.2K, 3.4M)

### Custom Hook

**`/lib/hooks/useData.ts`**

```typescript
const { streams, loading, error } = useLiveStreams()
```

Provides:
- Automatic data fetching from JSON
- Loading states
- Error handling
- TypeScript type safety

### UI Components

**`StreamCard.tsx`**
- Displays stream thumbnail
- Shows live status badge
- Displays viewer count
- Links to modal viewer

**`StreamModal.tsx`**
- Three playback options
- Embedded video player
- Stream information
- Venue and activity links
- Quality indicators

## � Testing & Quality Assurance

### Type Checking
```bash
# Run TypeScript type checking
npm run type-check

# Watch mode for development
tsc --watch
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint --fix
```

### Build Testing
```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

### Device Testing Checklist

**Mobile Devices:**
- [ ] iPhone SE (375px) - Smallest modern phone
- [ ] iPhone 12/13/14 (390px) - Standard iPhone
- [ ] iPhone 14 Pro Max (430px) - Large iPhone
- [ ] Samsung Galaxy S21 (360px) - Standard Android
- [ ] Small Android (320px) - Minimum support

**Tablets:**
- [ ] iPad Mini (768px) - Small tablet
- [ ] iPad (820px) - Standard iPad
- [ ] iPad Pro 11" (834px) - Mid-size tablet
- [ ] iPad Pro 12.9" (1024px) - Large tablet

**Desktops:**
- [ ] Laptop (1366px) - Common laptop resolution
- [ ] Desktop HD (1920px) - Full HD
- [ ] Desktop 2K (2560px) - 2K displays
- [ ] Desktop 4K (3840px) - 4K displays

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Performance Metrics

**Mobile (< 768px):**
- Initial load: < 3s
- Time to Interactive: < 4s
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- FPS: 30+ (stable)

**Desktop (≥ 768px):**
- Initial load: < 2s
- Time to Interactive: < 3s
- First Contentful Paint: < 1s
- Largest Contentful Paint: < 2s
- FPS: 60 (stable)

### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast (WCAG AA)
- [ ] Touch target sizes (44×44px minimum)
- [ ] Focus indicators
- [ ] Alt text for images

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
```bash
# Click "Fork" on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/adph-activitymap.git
cd adph-activitymap
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
- Follow existing code style
- Add TypeScript types
- Update documentation
- Test on multiple devices

4. **Commit your changes**
```bash
git add .
git commit -m "Add: Amazing new feature"
```

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
- Go to the original repository
- Click "New Pull Request"
- Select your fork and branch
- Describe your changes clearly

### Contribution Guidelines

#### Code Style
- ✅ Use TypeScript strict mode
- ✅ Follow functional programming patterns
- ✅ Implement proper error handling
- ✅ Document complex logic with comments
- ✅ Use meaningful variable/function names
- ✅ Keep functions small and focused (< 50 lines)

#### Component Guidelines
- ✅ Keep components small (< 200 lines)
- ✅ Extract reusable logic to custom hooks
- ✅ Use proper TypeScript types (no `any`)
- ✅ Implement loading and error states
- ✅ Add accessibility features (ARIA labels, keyboard nav)
- ✅ Use React.memo for expensive renders

#### Git Commit Messages
Follow conventional commits:
```
feat: Add new 3D venue visualization
fix: Correct mobile navigation issue
docs: Update README with livestream info
style: Format code with Prettier
refactor: Simplify venue filtering logic
perf: Optimize 3D rendering for mobile
test: Add unit tests for helpers
```

#### Pull Request Checklist
- [ ] Code builds without errors (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tested on mobile and desktop
- [ ] Documentation updated (if needed)
- [ ] Responsive on all breakpoints
- [ ] Accessibility maintained

### Areas for Contribution

**Features:**
- [ ] Real-time attendance tracking
- [ ] QR code check-in system
- [ ] Push notifications
- [ ] User authentication
- [ ] Personalized schedules
- [ ] Social features (comments, reactions)

**Improvements:**
- [ ] Performance optimization
- [ ] Additional 3D effects
- [ ] More venue types
- [ ] Enhanced mobile UX
- [ ] Better error handling
- [ ] Unit/integration tests

**Documentation:**
- [ ] API documentation
- [ ] Component storybook
- [ ] Video tutorials
- [ ] Deployment guides
- [ ] Troubleshooting guides

### Development Best Practices

#### Performance
- ✅ Lazy load components when possible
- ✅ Optimize images (WebP, proper sizing)
- ✅ Use React.memo for expensive renders
- ✅ Implement proper cleanup in useEffect
- ✅ Monitor bundle size (< 500KB gzipped)
- ✅ Use dynamic imports for routes

#### Security
- ✅ Sanitize user inputs
- ✅ Use environment variables for secrets
- ✅ Validate data from external sources
- ✅ Keep dependencies updated
- ✅ Follow OWASP guidelines

#### Testing
- ✅ Test on real devices (not just emulators)
- ✅ Check all breakpoints
- ✅ Verify accessibility
- ✅ Test with slow network
- ✅ Check memory leaks

### Questions or Issues?

- 📧 Email: arduino@example.com
- 💬 Discord: [Join our server](#)
- 🐛 GitHub Issues: Report bugs or request features
- 📖 Discussions: Ask questions or share ideas

## � Deployment

### Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect Next.js

3. **Configure (if needed)**
- Environment variables (if any)
- Build settings (usually auto-detected)

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Get your live URL

**Automatic Deployments:**
- Every push to `main` branch auto-deploys
- Preview deployments for pull requests

### Netlify

1. **Build Command:** `npm run build`
2. **Publish Directory:** `.next`
3. **Node Version:** 18+

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t adph-activitymap .
docker run -p 3000:3000 adph-activitymap
```

### Static Export (Optional)

For static hosting (GitHub Pages, AWS S3, etc.):

```javascript
// next.config.mjs
export default {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

```bash
npm run build
# Output in 'out' directory
```

### Environment Variables

If using environment variables, create `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=Arduino Day Philippines 2026
NEXT_PUBLIC_API_URL=https://api.example.com
```

**For production**, add these to your hosting platform's environment settings.

### Performance Optimization

Before deployment:

1. **Optimize images**
```bash
# Install sharp for Next.js image optimization
npm install sharp
```

2. **Analyze bundle**
```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Add to next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
export default withBundleAnalyzer({...})

# Run analysis
ANALYZE=true npm run build
```

3. **Check Lighthouse scores**
- Aim for 90+ on all metrics
- Test on mobile and desktop
- Optimize based on recommendations

### Post-Deployment Checklist

- [ ] Test all routes
- [ ] Verify 3D rendering works
- [ ] Check mobile responsiveness
- [ ] Test livestream playback
- [ ] Verify data loading from JSON
- [ ] Check performance (Lighthouse)
- [ ] Test on multiple browsers
- [ ] Verify SSL certificate
- [ ] Set up custom domain (if applicable)
- [ ] Configure analytics (if needed)

## � Deployment to Vercel

This project is optimized for **Vercel** deployment with zero configuration required.

### Quick Deploy

**Option 1: Deploy Button** (Fastest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/adph-activitymap)

Click the button above to deploy instantly to Vercel.

**Option 2: Vercel CLI**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Option 3: GitHub Integration** (Recommended for continuous deployment)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js and configures everything
6. Click "Deploy"

### Automatic Features on Vercel

- ✅ **Automatic SSL** - HTTPS enabled by default
- ✅ **CDN** - Global edge network
- ✅ **Continuous Deployment** - Auto-deploy on git push
- ✅ **Preview Deployments** - Every PR gets a preview URL
- ✅ **Image Optimization** - Automatic image optimization
- ✅ **Analytics** - Built-in web analytics (optional)
- ✅ **Zero Config** - Works out of the box
- ✅ **Legacy Peer Deps** - Configured for React Three Fiber

### Build Settings (Auto-detected)

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install --legacy-peer-deps (configured in .npmrc)
Node Version: 18.x
```

> **Important**: The project includes `.npmrc` and `vercel.json` with `--legacy-peer-deps` configured to handle React Three Fiber peer dependency conflicts. Vercel will automatically use these settings.

### Environment Variables (Optional)

If you need environment variables, add them in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_ENABLE_LIVESTREAMS`
   - `NEXT_PUBLIC_ENABLE_ACTIVITIES`

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL is automatically provisioned

### Post-Deployment Checklist

- [ ] Visit deployment URL and test all features
- [ ] Verify 3D rendering works
- [ ] Check mobile responsiveness
- [ ] Test livestream playback
- [ ] Verify all routes (/, /activity-map, /livestreams)
- [ ] Check Lighthouse scores (aim for 90+)
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)

### Performance on Vercel

Expected metrics:
- **Build Time**: ~5-10 seconds
- **First Load JS**: ~200KB (optimized)
- **Lighthouse Score**: 90+
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **Global CDN**: Edge network

### Troubleshooting

**Build fails?**
- Run `npm run build` locally first
- Check for TypeScript errors: `npm run type-check`
- Verify all dependencies installed

**Routes not working?**
- Check file structure in `app/` directory
- Ensure all page.tsx files are present

**Images not loading?**
- Verify image paths in `/public` directory
- Check Next.js image configuration

**Need help?**
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs

## �📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Arduino Day Philippines 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Utility-first CSS

### 3D Graphics
- **React Three Fiber 8** - React renderer for Three.js
- **Three.js** - WebGL 3D library
- **@react-three/drei** - Useful helpers for R3F

### UI Components
- **Shadcn UI** - Accessible component system
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Vaul** - Drawer component

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **pnpm** - Package manager

## 👥 Team & Credits

### Arduino Day Philippines 2026 Organizing Committee
- Event planning and coordination
- Venue partnership with Asia Pacific College
- Content curation and speaker management

### Development Team
- Lead Developer: [Your Name]
- 3D Design: [Designer Name]
- UI/UX: [Designer Name]
- QA Testing: [Tester Name]

### Open Source Contributors
This project wouldn't be possible without:
- **Vercel** - Next.js framework and hosting
- **Pmndrs** - React Three Fiber ecosystem
- **Shadcn** - UI component system
- **Three.js Team** - 3D graphics library
- **Arduino Community** - Inspiration and support

## 🙏 Acknowledgments

- **Asia Pacific College** - Venue partnership and support
- **Arduino Community Philippines** - Community engagement and feedback
- **Open Source Contributors** - Libraries and tools
- **Early Testers** - Bug reports and feature suggestions

## 📞 Support & Contact

### Get Help
- 📧 **Email**: arduino@example.com
- 💬 **Discord**: [Join our server](#)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/adph-activitymap/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/yourusername/adph-activitymap/discussions)

### Social Media
- 🐦 **Twitter**: [@ArduinoDayPH](https://twitter.com/arduinodayph)
- 📘 **Facebook**: [Arduino Day Philippines](https://facebook.com/arduinodayph)
- 📸 **Instagram**: [@arduinodayph](https://instagram.com/arduinodayph)
- 🎥 **YouTube**: [Arduino Day PH](https://youtube.com/@arduinodayph)

### Event Information
- 🌐 **Website**: [arduinoday.ph](https://arduinoday.ph)
- 📅 **Date**: [Event Date]
- 📍 **Venue**: Asia Pacific College, Makati, Philippines

## 🗺️ Roadmap

## 📝 Changelog

### Latest Updates (March 2026)
**UI/UX Improvements - Collapsible Quick Navigation**
- 🎯 Quick Navigation now a collapsible dropdown above Floor Controls
- 🔘 "Jump to Floor" button to toggle navigation panel on/off
- 📐 Venue Info Panel uses full available height (top to bottom)
- ✨ Clean, minimal layout - navigation hidden by default
- 🎨 Auto-closes when floor is selected for streamlined UX
- 📱 Mobile drawers remain unchanged for optimal touch experience
- ✅ No overflow, no clutter - opens only when needed
- ✅ Verified production build and TypeScript compilation

**Previous Updates**
- 🍔 Added hamburger menu for main navigation on mobile devices
- 🎛️ Implemented floating action buttons for floor/venue controls (mobile)
- 📲 Created slide-up drawers for floor and venue menus on mobile
- 🖥️ Desktop layout optimized with collapsible navigation controls
- 📦 Consolidated documentation and removed backup files
- 🚀 Enhanced Vercel deployment configuration with legacy peer deps support
- 🎨 Updated branding: "ADPH 2026" shortcut on mobile

### Version 1.0 (Current) ✅
- [x] Interactive 3D building visualization
- [x] Floor plan navigation
- [x] Venue information system
- [x] Activity scheduling
- [x] Livestream integration
- [x] Mobile-first responsive design
- [x] Green Arduino theme

### Version 1.1 (Planned)
- [ ] Real-time attendance tracking
- [ ] QR code check-in system
- [ ] Push notifications
- [ ] User authentication
- [ ] Personalized schedules
- [ ] Social features (comments, reactions)

### Version 2.0 (Future)
- [ ] Multi-language support (Filipino, English)
- [ ] AR navigation with device camera
- [ ] Analytics dashboard for organizers
- [ ] Integration with ticketing systems
- [ ] Mobile app (React Native)
- [ ] Virtual reality mode

### Future Enhancements
- [ ] Gamification (badges, achievements)
- [ ] Networking features (attendee profiles)
- [ ] Live Q&A during streams
- [ ] Post-event photo gallery
- [ ] Certificate generation
- [ ] Feedback and surveys

## 📊 Project Statistics

- **Lines of Code**: ~5,000+
- **Components**: 50+
- **Venues**: 129+
- **Floors**: 12
- **JSON Data Files**: 4
- **Type Definitions**: 10+
- **Custom Hooks**: 5
- **Helper Functions**: 15+

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI Docs](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Three.js Documentation](https://threejs.org/docs)

---

<div align="center">

**Built with ❤️ for the Philippine Arduino Community** 🇵🇭

### [⭐ Star this repo](https://github.com/yourusername/adph-activitymap) | [🐛 Report Bug](https://github.com/yourusername/adph-activitymap/issues) | [💡 Request Feature](https://github.com/yourusername/adph-activitymap/issues)

**Arduino Day Philippines 2026** | Making Innovation Accessible

</div>
