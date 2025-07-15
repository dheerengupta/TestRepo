// Meditation App Main Script

class MeditationApp {
    constructor() {
        this.currentMeditation = null;
        this.timer = null;
        this.timerDuration = 0;
        this.timeRemaining = 0;
        this.isTimerRunning = false;
        
        // Audio properties
        this.audioElement = null;
        this.currentTrack = null;
        this.isAudioMuted = false;
        this.audioVolume = 0.5;
        
        // Initialize the app
        this.init();
    }

    init() {
        this.loadTodaysMeditation();
        this.updateStreakDisplay();
        this.updateProgressStats();
        this.createCalendar();
        this.setupEventListeners();
        this.initializeAudio();
    }

    // Load and display today's meditation
    loadTodaysMeditation() {
        const today = new Date();
        this.currentMeditation = getMeditationForDay(today);
        
        // Update the display
        document.getElementById('dateDisplay').textContent = this.formatDate(today);
        document.getElementById('meditationTitle').textContent = this.currentMeditation.title;
        document.getElementById('meditationDescription').textContent = this.currentMeditation.description;
        document.getElementById('meditationDuration').textContent = `${this.currentMeditation.duration} min`;
        
        this.timerDuration = this.currentMeditation.duration * 60; // Convert to seconds
        this.timeRemaining = this.timerDuration;
        this.updateTimerDisplay();
    }

    // Format date for display
    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startMeditation());
        document.getElementById('completeBtn').addEventListener('click', () => this.completeMeditation());
        
        // Audio event listeners
        document.getElementById('muteBtn').addEventListener('click', () => this.toggleMute());
        document.getElementById('nextTrackBtn').addEventListener('click', () => this.nextTrack());
        document.getElementById('prevTrackBtn').addEventListener('click', () => this.previousTrack());
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.setVolume(e.target.value));
    }

    // Start meditation timer
    startMeditation() {
        if (this.isTimerRunning) return;
        
        this.isTimerRunning = true;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('completeBtn').style.display = 'inline-flex';
        document.getElementById('timerDisplay').style.display = 'block';
        
        // Start audio playback
        this.playAudio();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            this.updateProgressBar();
            
            if (this.timeRemaining <= 0) {
                this.completeMeditation();
            }
        }, 1000);
    }

    // Complete meditation session
    completeMeditation() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.isTimerRunning = false;
        document.getElementById('startBtn').style.display = 'inline-flex';
        document.getElementById('completeBtn').style.display = 'none';
        document.getElementById('timerDisplay').style.display = 'none';
        
        // Stop audio playback
        this.stopAudio();
        
        // Reset timer
        this.timeRemaining = this.timerDuration;
        this.updateTimerDisplay();
        document.getElementById('progressBar').style.width = '0%';
        
        // Update progress if session was completed
        if (this.timeRemaining <= 0 || this.timeRemaining < this.timerDuration) {
            this.updateProgress();
        }
    }

    // Update timer display
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerNumber').textContent = display;
    }

    // Update progress bar
    updateProgressBar() {
        const progress = ((this.timerDuration - this.timeRemaining) / this.timerDuration) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    // Update progress after completing session
    updateProgress() {
        const today = this.getDateKey(new Date());
        const data = this.getStoredData();
        
        // Check if already completed today
        if (data.completedDays.includes(today)) {
            return; // Already completed today
        }
        
        // Add today to completed days
        data.completedDays.push(today);
        data.totalSessions++;
        data.totalMinutes += this.currentMeditation.duration;
        
        // Update streak
        this.updateStreak(data);
        
        // Save data
        this.saveData(data);
        
        // Update displays
        this.updateStreakDisplay();
        this.updateProgressStats();
        this.createCalendar();
    }

    // Update streak calculation
    updateStreak(data) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const todayKey = this.getDateKey(today);
        const yesterdayKey = this.getDateKey(yesterday);
        
        // If completed today and yesterday, continue streak
        if (data.completedDays.includes(todayKey) && data.completedDays.includes(yesterdayKey)) {
            data.currentStreak++;
        }
        // If completed today but not yesterday, reset streak to 1
        else if (data.completedDays.includes(todayKey)) {
            data.currentStreak = 1;
        }
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak;
        }
    }

    // Get date key for storage
    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    // Get stored data
    getStoredData() {
        const defaultData = {
            completedDays: [],
            currentStreak: 0,
            longestStreak: 0,
            totalSessions: 0,
            totalMinutes: 0
        };
        
        try {
            const stored = localStorage.getItem('meditationData');
            return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
        } catch (error) {
            console.error('Error loading data:', error);
            return defaultData;
        }
    }

    // Save data to localStorage
    saveData(data) {
        try {
            localStorage.setItem('meditationData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Update streak display
    updateStreakDisplay() {
        const data = this.getStoredData();
        const today = this.getDateKey(new Date());
        
        // Calculate current streak
        let currentStreak = 0;
        const sortedDays = data.completedDays.sort();
        
        if (sortedDays.length > 0) {
            currentStreak = this.calculateCurrentStreak(sortedDays);
        }
        
        document.getElementById('streakNumber').textContent = currentStreak;
        
        // Update flame animation based on streak
        const flame = document.getElementById('streakFlame');
        if (currentStreak > 0) {
            flame.style.opacity = '1';
            flame.style.animation = 'flicker 2s infinite alternate';
        } else {
            flame.style.opacity = '0.5';
            flame.style.animation = 'none';
        }
    }

    // Calculate current streak
    calculateCurrentStreak(completedDays) {
        if (completedDays.length === 0) return 0;
        
        const today = new Date();
        let streak = 0;
        
        for (let i = 0; i <= 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateKey = this.getDateKey(checkDate);
            
            if (completedDays.includes(dateKey)) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Update progress statistics
    updateProgressStats() {
        const data = this.getStoredData();
        
        document.getElementById('totalSessions').textContent = data.totalSessions;
        document.getElementById('totalMinutes').textContent = data.totalMinutes;
        document.getElementById('longestStreak').textContent = data.longestStreak;
    }

    // Create calendar display
    createCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        
        const today = new Date();
        const data = this.getStoredData();
        
        // Create day labels
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayLabels.forEach(label => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'calendar-day';
            dayLabel.textContent = label;
            dayLabel.style.fontWeight = 'bold';
            dayLabel.style.background = 'transparent';
            dayLabel.style.border = 'none';
            dayLabel.style.fontSize = '0.8rem';
            calendarGrid.appendChild(dayLabel);
        });
        
        // Get current week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        // Create calendar days for current week
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();
            
            const dateKey = this.getDateKey(date);
            const isToday = dateKey === this.getDateKey(today);
            const isCompleted = data.completedDays.includes(dateKey);
            
            if (isToday) {
                dayElement.classList.add('today');
            }
            
            if (isCompleted) {
                dayElement.classList.add('completed');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }

    // Initialize audio system
    initializeAudio() {
        this.audioElement = document.getElementById('meditationAudio');
        this.currentTrack = getRandomTrack(); // Get random track for variety
        this.loadTrack(this.currentTrack);
        this.setupAudioVolume();
        this.updateAudioDisplay();
    }

    // Load a specific track
    loadTrack(track) {
        if (!track) return;
        
        this.currentTrack = track;
        this.audioElement.src = track.file;
        this.updateAudioDisplay();
    }

    // Setup audio volume
    setupAudioVolume() {
        this.audioElement.volume = this.audioVolume;
        document.getElementById('volumeSlider').value = this.audioVolume * 100;
    }

    // Update audio display
    updateAudioDisplay() {
        const trackNameElement = document.getElementById('audioTrackName');
        if (this.currentTrack) {
            trackNameElement.textContent = this.currentTrack.name;
        }
    }

    // Play audio
    playAudio() {
        if (this.audioElement && !this.isAudioMuted) {
            this.audioElement.play().catch(error => {
                console.log('Audio playback failed:', error);
                // Fallback: show notification that audio couldn't play
                this.showAudioNotification('Audio playback requires user interaction');
            });
        }
    }

    // Stop audio
    stopAudio() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
    }

    // Toggle mute
    toggleMute() {
        this.isAudioMuted = !this.isAudioMuted;
        const muteBtn = document.getElementById('muteBtn');
        
        if (this.isAudioMuted) {
            this.audioElement.volume = 0;
            muteBtn.textContent = '🔇';
            muteBtn.title = 'Unmute';
        } else {
            this.audioElement.volume = this.audioVolume;
            muteBtn.textContent = '🔊';
            muteBtn.title = 'Mute';
        }
    }

    // Set volume
    setVolume(value) {
        this.audioVolume = value / 100;
        if (!this.isAudioMuted) {
            this.audioElement.volume = this.audioVolume;
        }
    }

    // Next track
    nextTrack() {
        if (this.currentTrack) {
            const nextTrack = getNextTrack(this.currentTrack.id);
            this.loadTrack(nextTrack);
            
            // If currently playing, restart with new track
            if (this.isTimerRunning) {
                this.stopAudio();
                this.playAudio();
            }
        }
    }

    // Previous track
    previousTrack() {
        if (this.currentTrack) {
            const prevTrack = getPreviousTrack(this.currentTrack.id);
            this.loadTrack(prevTrack);
            
            // If currently playing, restart with new track
            if (this.isTimerRunning) {
                this.stopAudio();
                this.playAudio();
            }
        }
    }

    // Show audio notification
    showAudioNotification(message) {
        const trackNameElement = document.getElementById('audioTrackName');
        const originalText = trackNameElement.textContent;
        
        trackNameElement.textContent = message;
        trackNameElement.style.color = 'rgba(255, 255, 255, 0.6)';
        
        setTimeout(() => {
            trackNameElement.textContent = originalText;
            trackNameElement.style.color = 'rgba(255, 255, 255, 0.9)';
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MeditationApp();
});

// Add some inspiring quotes or tips (optional enhancement)
const inspirationalQuotes = [
    "Peace comes from within. Do not seek it without. - Buddha",
    "The present moment is the only time over which we have dominion. - Thích Nhất Hạnh",
    "Meditation is not a way of making your mind quiet. It is a way of entering into the quiet that is already there. - Deepak Chopra",
    "Your calm mind is the ultimate weapon against your challenges. - Bryant McGill",
    "The goal of meditation isn't to control your thoughts, it's to stop letting them control you.",
    "Wherever you are, be there totally. - Eckhart Tolle",
    "The quieter you become, the more you are able to hear. - Rumi",
    "In the midst of movement and chaos, keep stillness inside of you. - Deepak Chopra"
];

// Optional: Add a daily quote (could be enhanced further)
function getRandomQuote() {
    return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
}