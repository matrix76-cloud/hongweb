export const getRandomMood = () => {
    const moods = [
        "cheerful", "friendly", "focused", "confident",
        "gentle", "warm-hearted", "enthusiastic", "relaxed"
    ];
    return moods[Math.floor(Math.random() * moods.length)];
};

export const getRandomPose = () => {
    const poses = [
        "standing with folded arms", "holding a notepad",
        "smiling with hands on hips", "sitting at a table",
        "waving hand", "gently leaning on a counter"
    ];
    return poses[Math.floor(Math.random() * poses.length)];
};

export const getRandomBackground = () => {
    const backgrounds = [
        "in a cozy home setting", "inside a clean kitchen",
        "in a simple living room", "in front of a small shop",
        "in a calm garden", "at a tidy office desk"
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
};
  