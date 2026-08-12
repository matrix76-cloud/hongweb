import { v4 as uuidv4 } from 'uuid';
import { imageDB } from '../utility/imageData';


// 카드 종류
const baseItems = [
    { image: imageDB.game1, index: 1 },
    { image: imageDB.game2, index: 2 },
    { image: imageDB.game3, index: 3 },
    { image: imageDB.game4, index: 4 },
    { image: imageDB.game5, index: 5 },
    { image: imageDB.game6, index: 6 },
    { image: imageDB.game7, index: 7 },
    { image: imageDB.game8, index: 8 },
    { image: imageDB.game9, index: 9 },
    { image: imageDB.game10, index: 10 },
    { image: imageDB.game11, index: 11 },
    { image: imageDB.bombblack, index: 99 },
    { image: imageDB.bombred, index: 100 },
];

// 카드 2장씩 복제 (폭탄 제외 시 원하시는대로 조절)
const duplicatedItems = baseItems.flatMap((item) => {
    if (item.index < 99) {
        return [
            { ...item, id: uuidv4(), open: false },
            { ...item, id: uuidv4(), open: false },
        ];
    } else {
        return [{ ...item, id: uuidv4(), open: false }];
    }
});

// 섞기
export const GameItems = duplicatedItems.sort(() => Math.random() - 0.5);
