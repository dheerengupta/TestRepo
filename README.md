# Daily Meditation Website

A modern, clean single-page meditation website that provides users with a new meditation every day and tracks their meditation streaks.

## Features

### 🧘‍♀️ Daily Meditations
- **31 unique meditations** that rotate throughout the month
- Various meditation types: breathing, body scan, loving-kindness, mindfulness, gratitude, and more
- Each meditation includes a title, description, and duration (3-10 minutes)
- Automatic daily rotation based on the day of the year

### 🔥 Streak Tracking
- Track consecutive days of meditation
- Visual streak counter with animated flame
- Streak resets if you miss a day
- Tracks longest streak achieved

### ⏱️ Built-in Timer
- Countdown timer for each meditation session
- Visual progress bar showing session progress
- Start/stop functionality
- Automatic completion when timer reaches zero

### 📊 Progress Statistics
- Total meditation sessions completed
- Total minutes meditated
- Longest streak achieved
- All data stored locally in browser

### 📅 Weekly Calendar
- Visual calendar showing the current week
- Completed days highlighted in color
- Today's date specially marked
- Quick visual reference for consistency

### 🎨 Modern Design
- Clean, minimalist interface
- Calming gradient background
- Smooth animations and transitions
- Fully responsive design for all devices
- Beautiful glass-morphism effects

## How to Use

1. **Open the website** - Simply open `index.html` in your web browser
2. **View today's meditation** - The daily meditation will automatically load
3. **Start meditating** - Click "Start Meditation" to begin the timer
4. **Complete the session** - Let the timer run out or click "Complete Session"
5. **Track your progress** - Watch your streak grow and view your statistics
6. **Come back daily** - Return each day for a new meditation and to maintain your streak

## Technical Details

### Files Structure
- `index.html` - Main HTML structure
- `style.css` - Modern CSS styling with responsive design
- `script.js` - Main JavaScript functionality
- `meditation-data.js` - Database of 31 meditation exercises

### Local Storage
The app uses browser localStorage to save:
- Completed meditation days
- Current and longest streaks
- Total sessions and minutes
- Progress statistics

### Meditation Rotation
Meditations rotate based on the day of the year, ensuring you get a different meditation each day and the same meditation on the same date each year.

## Browser Compatibility

Works in all modern browsers including:
- Chrome
- Firefox  
- Safari
- Edge

## Future Enhancements

Potential additions could include:
- More meditation types and themes
- Audio guides for meditations
- Customizable meditation durations
- Achievement badges
- Export progress data
- Dark/light theme toggle
- Meditation reminders

## License

This project is open source and available under the MIT License.

---

*Find your inner peace, one breath at a time.* 🧘‍♀️