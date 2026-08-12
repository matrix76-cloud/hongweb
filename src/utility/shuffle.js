export const deterministicShuffle = (array, seedString) => {
    const seed = hashString(seedString);
    return [...array].sort((a, b) => {
        const aHash = hashString(a.users_id + seed);
        const bHash = hashString(b.users_id + seed);
        return aHash - bHash;
    });
};



export const timeShuffle = (array, seedString) => {
    const seed = hashString(seedString);
    return [...array].sort((a, b) => {
        const aHash = hashString(a.users_id + seed);
        const bHash = hashString(b.users_id + seed);
        return aHash - bHash;
    });
};

const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
  };