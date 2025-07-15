// Meditation data with various types and themes
const MEDITATION_DATA = [
    {
        id: 1,
        title: "Morning Breath Awareness",
        description: "Begin your day with gentle breath awareness. Focus on the natural rhythm of your breathing, allowing each inhale to bring calm and each exhale to release tension. This simple practice helps center your mind and prepare you for the day ahead.",
        duration: 5,
        type: "breathing",
        theme: "morning"
    },
    {
        id: 2,
        title: "Body Scan Relaxation",
        description: "Take a journey through your body, noticing areas of tension and consciously releasing them. Start from your toes and work your way up, bringing awareness and relaxation to each part of your body.",
        duration: 8,
        type: "body-scan",
        theme: "relaxation"
    },
    {
        id: 3,
        title: "Loving-Kindness Meditation",
        description: "Cultivate compassion for yourself and others. Begin by sending loving thoughts to yourself, then extend these feelings to loved ones, acquaintances, and eventually all beings. This practice opens your heart and builds emotional resilience.",
        duration: 7,
        type: "loving-kindness",
        theme: "compassion"
    },
    {
        id: 4,
        title: "Mindful Observation",
        description: "Practice present-moment awareness by observing your thoughts, emotions, and sensations without judgment. Like clouds passing in the sky, allow your experiences to come and go naturally while maintaining gentle awareness.",
        duration: 6,
        type: "mindfulness",
        theme: "awareness"
    },
    {
        id: 5,
        title: "Gratitude Reflection",
        description: "Take time to appreciate the good in your life. Reflect on three things you're grateful for today, no matter how small. This practice shifts your focus to abundance and cultivates a positive mindset.",
        duration: 5,
        type: "gratitude",
        theme: "positivity"
    },
    {
        id: 6,
        title: "Walking Meditation",
        description: "If possible, take this practice outdoors or simply walk slowly in place. Focus on each step, the sensation of your feet touching the ground, and the rhythm of your movement. This brings mindfulness to everyday activities.",
        duration: 10,
        type: "walking",
        theme: "movement"
    },
    {
        id: 7,
        title: "Evening Wind-Down",
        description: "Prepare for restful sleep with this gentle evening practice. Release the day's stress and tension while cultivating a sense of peace and calm. Allow yourself to transition from the active day to peaceful rest.",
        duration: 8,
        type: "evening",
        theme: "sleep"
    },
    {
        id: 8,
        title: "Stress Release Breathing",
        description: "Use the power of conscious breathing to release stress and anxiety. Practice deep, slow breaths while visualizing tension leaving your body with each exhale. This technique helps reset your nervous system.",
        duration: 6,
        type: "breathing",
        theme: "stress-relief"
    },
    {
        id: 9,
        title: "Inner Strength Meditation",
        description: "Connect with your inner wisdom and strength. Visualize yourself as calm, confident, and capable of handling whatever comes your way. This practice builds self-confidence and emotional resilience.",
        duration: 7,
        type: "visualization",
        theme: "strength"
    },
    {
        id: 10,
        title: "Mindful Eating Preparation",
        description: "Before your next meal, take a moment to appreciate your food. Notice colors, textures, and aromas. This practice helps you eat more mindfully and appreciate the nourishment you're about to receive.",
        duration: 4,
        type: "mindfulness",
        theme: "eating"
    },
    {
        id: 11,
        title: "Forgiveness Practice",
        description: "Practice letting go of resentment and hurt. Start by forgiving yourself for any mistakes, then extend forgiveness to others. This doesn't mean condoning harmful behavior, but freeing yourself from the burden of anger.",
        duration: 9,
        type: "forgiveness",
        theme: "healing"
    },
    {
        id: 12,
        title: "Energy Cleansing",
        description: "Visualize bright, cleansing light flowing through your body, clearing away negative energy and thoughts. Imagine this light filling you with renewed vitality and positive energy for the day ahead.",
        duration: 6,
        type: "visualization",
        theme: "energy"
    },
    {
        id: 13,
        title: "Patience Cultivation",
        description: "Practice developing patience with yourself and others. Notice any feelings of impatience or frustration, and breathe through them with acceptance. This builds emotional regulation and inner peace.",
        duration: 5,
        type: "mindfulness",
        theme: "patience"
    },
    {
        id: 14,
        title: "Nature Connection",
        description: "Whether indoors or outdoors, connect with the natural world. Visualize yourself in a peaceful natural setting, or simply notice any plants, sky, or natural elements around you. This practice grounds you in the present moment.",
        duration: 7,
        type: "nature",
        theme: "grounding"
    },
    {
        id: 15,
        title: "Creativity Awakening",
        description: "Open your mind to creative possibilities. Breathe deeply and allow your imagination to flow freely. This meditation helps clear mental blocks and invites fresh ideas and inspiration into your life.",
        duration: 8,
        type: "creativity",
        theme: "inspiration"
    },
    {
        id: 16,
        title: "Compassionate Self-Talk",
        description: "Notice your inner dialogue and practice speaking to yourself with kindness. Replace harsh self-criticism with gentle, supportive words. This builds self-compassion and emotional wellbeing.",
        duration: 6,
        type: "self-compassion",
        theme: "self-love"
    },
    {
        id: 17,
        title: "Mindful Listening",
        description: "Practice deep listening to the sounds around you. Notice nearby sounds, distant sounds, and the spaces of silence between them. This enhances your ability to be present and aware.",
        duration: 5,
        type: "mindfulness",
        theme: "listening"
    },
    {
        id: 18,
        title: "Confidence Building",
        description: "Recall a time when you felt confident and capable. Relive that feeling in your body and mind. Anchor this sense of confidence within yourself, knowing you can access it whenever needed.",
        duration: 7,
        type: "confidence",
        theme: "empowerment"
    },
    {
        id: 19,
        title: "Emotional Balance",
        description: "Practice observing your emotions without being overwhelmed by them. Notice feelings as they arise, acknowledge them with kindness, and allow them to pass naturally. This builds emotional intelligence and stability.",
        duration: 8,
        type: "emotional",
        theme: "balance"
    },
    {
        id: 20,
        title: "Mindful Technology Break",
        description: "Take a conscious break from digital devices. Notice any urges to check your phone or computer, and instead focus on your breath and immediate surroundings. This helps create healthy boundaries with technology.",
        duration: 5,
        type: "mindfulness",
        theme: "digital-detox"
    },
    {
        id: 21,
        title: "Inner Peace Cultivation",
        description: "Settle into a deep sense of inner peace. Imagine a calm lake within your heart, undisturbed by the storms of daily life. Rest in this tranquil space and know that this peace is always available to you.",
        duration: 9,
        type: "peace",
        theme: "tranquility"
    },
    {
        id: 22,
        title: "Mindful Movement",
        description: "Bring awareness to simple movements like stretching your arms, rolling your shoulders, or gently moving your neck. Notice how movement affects your energy and mood. This connects mind and body.",
        duration: 6,
        type: "movement",
        theme: "embodiment"
    },
    {
        id: 23,
        title: "Wisdom Meditation",
        description: "Connect with your inner wisdom. Pose a question to yourself and listen deeply for the answer that arises from within. Trust your intuition and the guidance that emerges from quiet contemplation.",
        duration: 8,
        type: "wisdom",
        theme: "intuition"
    },
    {
        id: 24,
        title: "Letting Go Practice",
        description: "Practice releasing what no longer serves you. With each exhale, let go of worries, expectations, or negative thoughts. Create space for new possibilities and fresh perspectives to enter your life.",
        duration: 7,
        type: "letting-go",
        theme: "release"
    },
    {
        id: 25,
        title: "Joy Cultivation",
        description: "Recall moments of pure joy and happiness in your life. Allow these feelings to fill your heart and body. Practice generating joy from within, independent of external circumstances.",
        duration: 6,
        type: "joy",
        theme: "happiness"
    },
    {
        id: 26,
        title: "Mindful Breathing Space",
        description: "Take a three-minute breathing space. First, notice what's happening in your mind and body. Then, focus on your breath. Finally, expand your awareness to your whole being. This mini-meditation fits into any busy day.",
        duration: 3,
        type: "breathing",
        theme: "quick-reset"
    },
    {
        id: 27,
        title: "Anxiety Relief",
        description: "Practice techniques to calm anxiety and worry. Use slow, deep breathing combined with gentle self-reassurance. Remember that anxiety is temporary and you have the tools to navigate through it.",
        duration: 8,
        type: "anxiety-relief",
        theme: "calm"
    },
    {
        id: 28,
        title: "Compassion for Difficulty",
        description: "Practice holding difficult emotions or situations with compassion. Instead of fighting or avoiding challenges, offer yourself the same kindness you'd give a good friend facing difficulties.",
        duration: 7,
        type: "compassion",
        theme: "difficulty"
    },
    {
        id: 29,
        title: "Mindful Appreciation",
        description: "Take time to truly appreciate something in your immediate environment. It could be a plant, a piece of art, or even the light coming through a window. Practice seeing beauty in the ordinary.",
        duration: 5,
        type: "appreciation",
        theme: "beauty"
    },
    {
        id: 30,
        title: "New Beginning Meditation",
        description: "Each moment offers a fresh start. Practice seeing this moment as a new beginning, free from past mistakes or future worries. Embrace the infinite potential that exists in the present moment.",
        duration: 6,
        type: "new-beginning",
        theme: "fresh-start"
    },
    {
        id: 31,
        title: "Heart Opening Practice",
        description: "Focus on your heart center and breathe into this space. With each breath, imagine your heart opening like a flower, expanding your capacity for love, compassion, and connection with others.",
        duration: 8,
        type: "heart-opening",
        theme: "love"
    }
];

// Function to get meditation for a specific day
function getMeditationForDay(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const meditationIndex = (dayOfYear - 1) % MEDITATION_DATA.length;
    return MEDITATION_DATA[meditationIndex];
}

// Function to get today's meditation
function getTodaysMeditation() {
    return getMeditationForDay(new Date());
}

// Function to get meditation by ID
function getMeditationById(id) {
    return MEDITATION_DATA.find(meditation => meditation.id === id);
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MEDITATION_DATA,
        getMeditationForDay,
        getTodaysMeditation,
        getMeditationById
    };
}