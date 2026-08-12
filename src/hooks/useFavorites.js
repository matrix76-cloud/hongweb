// hooks/useFavorites.js
import { useEffect, useState } from "react";
import localforage from "localforage";

const FAVORITE_KEY = "hongyeosa_favorites";

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        localforage.getItem(FAVORITE_KEY).then((data) => {
            setFavorites(data || []);
        });
    }, []);

    const isFavorite = (item) =>
        favorites.some((f) => f.link === item.link);

    const toggleFavorite = async (item) => {
        const updated = isFavorite(item)
            ? favorites.filter((f) => f.link !== item.link)
            : [...favorites, item];
        setFavorites(updated);
        await localforage.setItem(FAVORITE_KEY, updated);
    };

    return { favorites, isFavorite, toggleFavorite };
};

export default useFavorites;
