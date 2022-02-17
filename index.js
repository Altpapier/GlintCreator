const GIFEncoder = require('gif-encoder-2');
const compress_images = require('compress-images');
const progress = require('progress');
const { createCanvas, loadImage } = require('canvas');
const colorConvert = require('color-convert');
const config = require('./config.json');
const fs = require('fs');
const Jimp = require('jimp');

function convertColor(from, to, color) {
    let alpha = null;

    if (from === 'hex' && color.length === 9) {
        alpha = color.slice(1, 3);
        color = color.slice(0, 1) + color.slice(3);
        alpha = parseInt(alpha, 16);
    }

    if (from === 'rgb' && color.length === 4) {
        alpha = color.pop();
        alpha = Math.round(alpha * 255);
    }

    if (from === to) return [...color, alpha];
    return [...colorConvert[from][to](color), alpha];
}

async function generateGIFItem({ image, name, size, sequence, output, compressed_output, show_progress }) {
    if (!size) size = 160;
    if (!image) throw new Error('Image is required.');
    if (!name) throw new Error('Name is required.');

    if (!sequence || sequence === 'short') sequence = 'glint/SHORT_GLINT';
    else if (sequence === 'long') sequence = 'glint/FULL_GLINT';

    const encoder = new GIFEncoder(size, size, 'octree', true);

    encoder.setDelay(50);
    encoder.setQuality(30);
    encoder.setThreshold(100);
    encoder.setRepeat(0);
    encoder.setTransparent(0xff000000);
    encoder.start();

    const files = fs.readdirSync(`./${sequence}/`);
    const loadedImage = await loadImage(image);

    let bar;
    if (show_progress) {
        bar = new progress(':bar :percent :eta', {
            total: files.length,
            width: 30,
            incomplete: '▒',
            complete: '█',
        });
    }

    for (const file of files) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'screen';
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(loadedImage, 0, 0, size, size);
        const buffer = canvas.toBuffer();

        const TRANSPARENT = [0, 0, 0, 0];
        const TRANSPARENT_PIXELS = [];

        const jimpObject = await Jimp.read(buffer);
        jimpObject.scan(0, 0, jimpObject.bitmap.width, jimpObject.bitmap.height, (x, y, idx) => {
            const currentLABColor = convertColor('rgb', 'lab', [jimpObject.bitmap.data[idx], jimpObject.bitmap.data[idx + 1], jimpObject.bitmap.data[idx + 2]]);

            if (currentLABColor[0] === TRANSPARENT[0] && currentLABColor[1] === TRANSPARENT[1] && currentLABColor[2] === TRANSPARENT[2]) {
                TRANSPARENT_PIXELS.push(idx);
            }
        });

        const img = await loadImage(`./${sequence}/${file}`);
        ctx.drawImage(img, 0, 0, size, size);
        const buffer2 = canvas.toBuffer();
        const jimpObject2 = await Jimp.read(buffer2);

        for (const PIXEL of TRANSPARENT_PIXELS) {
            jimpObject2.bitmap.data[PIXEL] = TRANSPARENT[0];
            jimpObject2.bitmap.data[PIXEL + 1] = TRANSPARENT[1];
            jimpObject2.bitmap.data[PIXEL + 2] = TRANSPARENT[2];
            jimpObject2.bitmap.data[PIXEL + 3] = TRANSPARENT[3];
        }
        const jimpBuffer = await jimpObject2.getBufferAsync('image/png');

        const secondCanvas = createCanvas(size, size);
        const secondCtx = secondCanvas.getContext('2d');
        const out = await loadImage(jimpBuffer);
        secondCtx.drawImage(out, 0, 0, size, size);

        encoder.addFrame(secondCtx);
        if (show_progress) bar.tick();
    }
    encoder.finish();

    const encodedBuffer = encoder.out.getData();
    if (output) fs.writeFileSync(`${output}/${name}.gif`, encodedBuffer);

    if (compressed_output) {
        compress_images(
            output + '/*.gif',
            compressed_output + '/',
            {
                compress_forge: true,
                statistic: true,
                autoupdate: true,
            },
            false,
            { jpg: { engine: false, command: false } },
            { png: { engine: false, command: false } },
            { svg: { engine: false, command: false } },
            { gif: { engine: 'gifsicle', command: ['-O3', '--lossy=10', '--colors', '512'] } }, //Edit the compression level here
            function (error, completed, statistic) {
                /* optional callback */
            }
        );
    }
    return encodedBuffer;
}

/*
    generateGIFItem function:
    image: The url to an image or a path to an image        String
    name: The name of the gif file                          String
    size: The size of the gif                               Integer        
    sequence: Whether to use the short or long sequence     String ('short' or 'long')
    output: The path to the output directory                String
    compressed_output: The path to the compressed output    String
    show_progress: Whether to show the progress bar         Boolean
*/

if (require.main === module) {
    (async () => {
        await generateGIFItem(config);
    })();
}

module.exports = generateGIFItem;
