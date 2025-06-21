# 🏰 Magical Diary - Harry Potter Themed Digital Journal

A beautiful, feature-rich digital diary application inspired by the magical world of Harry Potter. Create diary entries, manage todo lists, add images, draw artwork, use magical stickers, and share your memories with friends!

## ✨ Features

### 📖 Diary & Journal
- **Rich Text Editor**: Write diary entries with full text formatting
- **Mood & Weather Tracking**: Record your mood and the weather for each entry
- **House Themes**: Choose between Gryffindor, Slytherin, Ravenclaw, or Hufflepuff themes
- **Bookmarking**: Mark important entries for easy access
- **Search & Filter**: Find entries by title, content, house, mood, or date
- **Auto-save**: Never lose your thoughts with automatic saving

### ✅ Magical Todo Lists
- **Quest Management**: Create and organize your daily quests and tasks
- **Progress Tracking**: Visual progress bars for each todo list
- **House Integration**: Todo lists themed by your selected Hogwarts house
- **Interactive Items**: Check off completed tasks with magical animations

### 🎨 Creative Features
- **Image Upload**: Add photos to your diary entries
- **Drawing Canvas**: Create magical artwork (coming soon!)
- **Magical Stickers**: Choose from 20+ Harry Potter themed stickers
- **Emoji Support**: Express yourself with emojis in your entries

### 📤 Sharing & Export
- **WhatsApp Sharing**: Share diary entries directly to WhatsApp
- **Social Sharing**: Share your magical moments on social media
- **Screenshot Export**: Convert entries to beautiful images

### 📱 Progressive Web App (PWA)
- **Mobile Responsive**: Perfect experience on phones, tablets, and desktops
- **Offline Support**: Access your diary even without internet
- **Install as App**: Add to home screen for native app experience
- **Cross-Platform**: Works on iOS, Android, Windows, macOS, and Linux

## 🏠 House Themes

Choose your Hogwarts house to customize your entire experience:

- **🦁 Gryffindor**: Brave reds and golds
- **🐍 Slytherin**: Ambitious greens and silvers  
- **🦅 Ravenclaw**: Wise blues and bronzes
- **🦡 Hufflepuff**: Loyal yellows and blacks

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd harry-potter-diary
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
   - Backend API: http://localhost:5000

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
The application uses SQLite for data storage. The database file (`diary.db`) will be automatically created in the `server/database` directory when you first run the server.

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
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏗️ Project Structure

```
harry-potter-diary/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── manifest.json  # PWA manifest
│   │   └── sw.js         # Service worker
│   └── src/
│       ├── components/    # React components
│       │   ├── Diary/    # Diary-related components
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
│   │   ├── diary.js     # Diary endpoints
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
{ id: 21, emoji: '⚡', name: 'Lightning Bolt', category: 'magical' }
```

### Adding New Moods
Add new mood options in `client/src/context/ThemeContext.js`:

```javascript
{ id: 'excited', emoji: '🤗', name: 'Excited', color: '#FF6347' }
```

### Customizing House Themes
Modify house colors and properties in `client/src/context/ThemeContext.js`.

## 🔧 API Endpoints

### Diary Entries
- `GET /api/diary` - Get all diary entries
- `GET /api/diary/:id` - Get single diary entry
- `POST /api/diary` - Create new diary entry
- `PUT /api/diary/:id` - Update diary entry
- `DELETE /api/diary/:id` - Delete diary entry
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
- [ ] **Advanced Drawing Canvas**: Full-featured drawing tools with magical brushes
- [ ] **Gallery Enhancement**: Beautiful image and drawing gallery with filters
- [ ] **Cloud Sync**: Sync data across devices
- [ ] **Export Options**: PDF export, backup/restore functionality
- [ ] **Social Features**: Share diary entries with friends
- [ ] **Themes**: Additional magical themes beyond Hogwarts houses
- [ ] **Spell Checker**: Magical spell checking for diary entries
- [ ] **Voice Notes**: Record and attach voice memos
- [ ] **Calendar View**: Monthly calendar view of diary entries
- [ ] **Data Analytics**: Mood trends and writing statistics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Add comments for complex functionality
3. Test your changes thoroughly
4. Update documentation as needed

## 📱 Mobile Installation

### iOS
1. Open Safari and navigate to your diary app
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add" to install

### Android
1. Open Chrome and navigate to your diary app
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Tap "Add" to install

## 🐛 Troubleshooting

### Common Issues

**App won't start:**
- Ensure Node.js is installed (version 14+)
- Run `npm run install-all` to install dependencies
- Check that ports 3000 and 5000 are available

**Images not uploading:**
- Check server console for errors
- Ensure the uploads directory has write permissions
- Verify file size is under 10MB

**Database errors:**
- Delete `server/database/diary.db` to reset the database
- Restart the server to recreate tables

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Harry Potter universe created by J.K. Rowling
- Icons and emojis from various open-source projects
- React and Node.js communities for excellent documentation

---

Made with ✨ magic and ❤️

*"Happiness can be found even in the darkest of times, if one only remembers to turn on the light."* - Albus Dumbledore 