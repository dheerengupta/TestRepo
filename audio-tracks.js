// Meditation Audio Tracks Data - Using Web URLs for immediate functionality
const MEDITATION_TRACKS = [
    {
        id: 1,
        name: "Peaceful Forest",
        description: "Gentle forest sounds with birds and flowing water",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600, // 10 minutes
        type: "nature"
    },
    {
        id: 2,
        name: "Ocean Waves",
        description: "Soothing ocean waves on a peaceful shore",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600,
        type: "nature"
    },
    {
        id: 3,
        name: "Rain & Thunder",
        description: "Gentle rain with distant thunder",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600,
        type: "nature"
    },
    {
        id: 4,
        name: "Tibetan Bowls",
        description: "Harmonious Tibetan singing bowls",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600,
        type: "instrumental"
    },
    {
        id: 5,
        name: "Soft Piano",
        description: "Calming piano melodies for deep relaxation",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600,
        type: "instrumental"
    },
    {
        id: 6,
        name: "Wind Chimes",
        description: "Gentle wind chimes in a summer breeze",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600,
        type: "nature"
    },
    {
        id: 7,
        name: "White Noise",
        description: "Pure white noise for focused meditation",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600,
        type: "ambient"
    },
    {
        id: 8,
        name: "Zen Garden",
        description: "Peaceful sounds of a Japanese zen garden",
        file: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 600,
        type: "nature"
    }
];

// Fallback URLs for demonstration (royalty-free sources)
const FALLBACK_AUDIO_URLS = [
    "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    "https://www.soundjay.com/misc/sounds/chime-01.wav"
];

// Function to get random track
function getRandomTrack() {
    const randomIndex = Math.floor(Math.random() * MEDITATION_TRACKS.length);
    return MEDITATION_TRACKS[randomIndex];
}

// Function to get track by ID
function getTrackById(id) {
    return MEDITATION_TRACKS.find(track => track.id === id);
}

// Function to get tracks by type
function getTracksByType(type) {
    return MEDITATION_TRACKS.filter(track => track.type === type);
}

// Function to get next track
function getNextTrack(currentId) {
    const currentIndex = MEDITATION_TRACKS.findIndex(track => track.id === currentId);
    const nextIndex = (currentIndex + 1) % MEDITATION_TRACKS.length;
    return MEDITATION_TRACKS[nextIndex];
}

// Function to get previous track
function getPreviousTrack(currentId) {
    const currentIndex = MEDITATION_TRACKS.findIndex(track => track.id === currentId);
    const prevIndex = currentIndex === 0 ? MEDITATION_TRACKS.length - 1 : currentIndex - 1;
    return MEDITATION_TRACKS[prevIndex];
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MEDITATION_TRACKS,
        getRandomTrack,
        getTrackById,
        getTracksByType,
        getNextTrack,
        getPreviousTrack
    };
}