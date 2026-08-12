// imageUploadHelper.js
import imageCompression from 'browser-image-compression';


export const fixOrientationAndCompress = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;
                let orientation = 1;

                try {
                    const exif = await imageCompression.getExifOrientation(file);
                    orientation = exif;
                } catch (e) { }

                if (orientation > 4) {
                    canvas.width = height;
                    canvas.height = width;
                } else {
                    canvas.width = width;
                    canvas.height = height;
                }

                switch (orientation) {
                    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                    case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
                    case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
                    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                    case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
                    case 7: ctx.transform(0, -1, -1, 0, height, width); break;
                    case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                    default: break;
                }

                ctx.drawImage(img, 0, 0);

                canvas.toBlob(async (blob) => {
                    const rotatedFile = new File([blob], `${Date.now()}.jpg`, { type: "image/jpeg" });

                    const compressedFile = await imageCompression(rotatedFile, {
                        maxSizeMB: 0.2,
                        maxWidthOrHeight: 640,
                        useWebWorker: true,
                    });

                    resolve(compressedFile);
                }, 'image/jpeg');
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
};


export const convertUrlToFile = async (url, filename = 'image.jpg') => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };