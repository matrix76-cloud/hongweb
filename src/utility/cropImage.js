// 📍 위치: /utility/cropImage.js

export default function getCroppedImg(imageSrc, crop, rotation = 0) {
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });

    const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;

    return new Promise(async (resolve, reject) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate(getRadianAngle(rotation));
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            (safeArea - image.width) / 2,
            (safeArea - image.height) / 2
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width / 2 - crop.x),
            Math.round(0 - safeArea / 2 + image.height / 2 - crop.y)
        );

        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg');
    });
}
  