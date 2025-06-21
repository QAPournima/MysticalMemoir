# ✨ Mystical Memoir - Enchanted Digital Journal

A beautiful, feature-rich digital journal application with mystical themes and magical elements. Create memoir entries, manage enchanted todo lists, add images, draw artwork, use mystical stickers, and share your memories with friends!

## ✨ Features

### 📖 Memoir & Journal
- **Rich Text Editor**: Write memoir entries with full text formatting
- **Mood & Weather Tracking**: Record your mood and the weather for each entry
- **Mystical Elements**: Choose between Moonlight, Ember, Nature, or Starlight themes
- **Bookmarking**: Mark important entries for easy access
- **Search & Filter**: Find entries by title, content, element, mood, or date
- **Auto-save**: Never lose your thoughts with automatic saving

### ✅ Enchanted Todo Lists
- **Quest Management**: Create and organize your daily quests and tasks
- **Progress Tracking**: Visual progress bars for each todo list
- **Element Integration**: Todo lists themed by your selected mystical element
- **Interactive Items**: Check off completed tasks with magical animations

### 🎨 Creative Features
- **Image Upload**: Add photos to your memoir entries
- **Drawing Canvas**: Create mystical artwork
- **Magical Stickers**: Choose from 20+ mystical themed stickers
- **Emoji Support**: Express yourself with emojis in your entries

### 📤 Sharing & Export
- **WhatsApp Sharing**: Share memoir entries directly to WhatsApp
- **Social Sharing**: Share your mystical moments on social media
- **Screenshot Export**: Convert entries to beautiful images

### 📱 Progressive Web App (PWA)
- **Mobile Responsive**: Perfect experience on phones, tablets, and desktops
- **Offline Support**: Access your memoir even without internet
- **Install as App**: Add to home screen for native app experience
- **Cross-Platform**: Works on iOS, Android, Windows, macOS, and Linux

## 🌟 Mystical Elements

Choose your mystical element to customize your entire experience:

- **🌙 Moonlight**: Serene blues and silvers - *Wisdom, Serenity*
- **🔥 Ember**: Passionate reds and oranges - *Passion, Courage*
- **🌿 Nature**: Harmonious greens and browns - *Growth, Harmony*
- **⭐ Starlight**: Dreamy purples and golds - *Dreams, Magic*

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:QAPournima/MysticalMemoir.git
   cd MysticalMemoir
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🛠️ Development Setup

### Backend Setup
```bash
# Install backend dependencies
npm install

# Start the backend server
npm run server
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start the frontend development server
npm start
```

### Database
The application uses SQLite for data storage. The database file (`memoir.db`) will be automatically created in the `server/database` directory when you first run the server.

## 📦 Production Deployment

### Building for Production
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

### Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=production
PORT=5001
REACT_APP_API_URL=http://localhost:5001/api
```

## 🏗️ Project Structure

```
mystical-memoir/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── manifest.json  # PWA manifest
│   │   └── sw.js         # Service worker
│   └── src/
│       ├── components/    # React components
│       │   ├── Diary/    # Memoir-related components
│       │   ├── Todo/     # Todo list components
│       │   ├── Drawing/  # Drawing canvas components
│       │   ├── Gallery/  # Image gallery components
│       │   ├── Settings/ # Settings components
│       │   ├── Navbar/   # Navigation components
│       │   └── UI/       # Reusable UI components
│       ├── context/      # React Context providers
│       ├── App.js        # Main app component
│       └── index.js      # App entry point
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   │   ├── diary.js     # Memoir endpoints
│   │   ├── todo.js      # Todo endpoints
│   │   ├── images.js    # Image upload endpoints
│   │   └── drawings.js  # Drawing endpoints
│   ├── database/        # Database setup
│   │   └── db.js        # SQLite configuration
│   └── index.js         # Server entry point
├── package.json          # Root package.json
└── README.md            # This file
```

## 🎨 Customization

### Adding New Stickers
Edit `client/src/context/ThemeContext.js` and add new stickers to the `MAGICAL_STICKERS` array:

```javascript
{ id: 21, emoji: '✨', name: 'Sparkles', category: 'magical' }
```

### Adding New Moods
Add new mood options in `client/src/context/ThemeContext.js`:

```javascript
{ id: 'inspired', emoji: '💫', name: 'Inspired', color: '#9B59B6' }
```

### Customizing Element Themes
Modify element colors and properties in `client/src/context/ThemeContext.js`.

## 🔧 API Endpoints

### Memoir Entries
- `GET /api/diary` - Get all memoir entries
- `GET /api/diary/:id` - Get single memoir entry
- `POST /api/diary` - Create new memoir entry
- `PUT /api/diary/:id` - Update memoir entry
- `DELETE /api/diary/:id` - Delete memoir entry
- `PATCH /api/diary/:id/bookmark` - Toggle bookmark

### Todo Lists
- `GET /api/todo` - Get all todo lists
- `POST /api/todo` - Create new todo list
- `PUT /api/todo/:id` - Update todo list
- `DELETE /api/todo/:id` - Delete todo list

### Images
- `POST /api/images/upload` - Upload single image
- `POST /api/images/upload-multiple` - Upload multiple images
- `GET /api/images` - Get all images
- `DELETE /api/images/:id` - Delete image

### Drawings
- `GET /api/drawings` - Get all drawings
- `POST /api/drawings` - Save new drawing
- `PUT /api/drawings/:id` - Update drawing
- `DELETE /api/drawings/:id` - Delete drawing

## 🎯 Roadmap

### Upcoming Features
- [ ] **Advanced Drawing Canvas**: Full-featured drawing tools with mystical brushes
- [ ] **Gallery Enhancement**: Beautiful image and drawing gallery with filters
- [ ] **Cloud Sync**: Sync data across devices
- [ ] **Export Options**: PDF export, backup/restore functionality
- [ ] **Social Features**: Share memoir entries with friends
- [ ] **Additional Themes**: New mystical and seasonal themes
- [ ] **Voice Notes**: Record and attach voice memos
- [ ] **Calendar View**: Monthly calendar view of memoir entries
- [ ] **Data Analytics**: Mood trends and writing statistics
- [ ] **Element Discovery**: Interactive quiz to find your mystical element

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Add comments for complex functionality
3. Test your changes thoroughly
4. Update documentation as needed

## 📱 Mobile Installation

### iOS
1. Open Safari and navigate to your memoir app
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add" to install

### Android
1. Open Chrome and navigate to your memoir app
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Tap "Add" to install

## 🐛 Troubleshooting

### Common Issues

**App won't start:**
- Ensure Node.js is installed (version 14+)
- Run `npm run install-all` to install dependencies
- Check that ports 3000 and 5001 are available

**Images not uploading:**
- Check server console for errors
- Ensure the uploads directory has write permissions
- Verify file size is under 10MB

**Database errors:**
- Delete `server/database/memoir.db` to reset the database
- Restart the server to recreate tables

## 📄 License

This project is licensed under a Proprietary Commercial License - see the LICENSE file for details.

Copyright (c) 2025 Zap⚡️ (Advanced AI Tools for Software Quality). All rights reserved.

## 🙏 Acknowledgments

- Original mystical design and concept
- Icons and emojis from various open-source projects
- React and Node.js communities for excellent documentation

---

Made with ✨ mystical magic and ❤️

*"In every moment of wonder, there lies the spark of infinite possibilities."* 