export const playSound = (filename, options = {}) => {
    try {
        const audio = new Audio(`/sounds/${filename}`);

        if (options.volume !== undefined) {
            audio.volume = options.volume;
        }

        if (options.playbackRate !== undefined) {
            audio.playbackRate = options.playbackRate;
        }

        if (options.startTime !== undefined) {
            audio.currentTime = options.startTime;
        }

        audio.play().catch((err) => {
            console.warn("🔇 Audio play failed:", err);
        });

        if (options.duration !== undefined) {
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, options.duration);
        }
    } catch (e) {
        console.warn("Audio system error:", e);
    }
};