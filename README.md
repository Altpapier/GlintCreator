# GlintCreator

### Lets you put the Minecraft enchantment glint onto an image

## Install

npm install

## Start

1. Go to the `config.json` file and edit it to your liking. If you are using the NPM package pass through an object with these parameters to generate the gif.

| Paramter          | Description                                                                                                                                                                                             | Type      | Required |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- |
| image             | The url to an image or a path to an image                                                                                                                                                               | `String`  | `true`   |
| name              | The name of the output file                                                                                                                                                                             | `String`  | `true`   |
| size              | The size of the gif (pixels)                                                                                                                                                                            | `Integer` | `false`  |
| sequence          | Choose between the `short` or `long` sequence. The short sequence makes the file sizes much lower which can be used for discord emojis while the long sequence allows to show the entire glint sequence | `String`  | `false`  |
| output            | Output of the gif                                                                                                                                                                                       | `String`  | `false`  |
| compressed_output | Output of the compressed gif                                                                                                                                                                            | `String`  | `false`  |
| show_progress     | If to show the progress on generating the gif in the console or not                                                                                                                                     | `Boolean` | `false`  |

2. Run `node .` to start the program. Wait a bit and the image should come out in the `images/original` folder as well as in the `images/compressed` folder for a compressed version of the gif.
   If you are using the NPM package, call the function to start generating the gif. At the end, the function will not return any data.

## NPM Package Example

```
const glintCreator = require('glintcreator');

glintCreator({
	image: './example.png',
	name: 'example',
	size: 160,
	sequence: 'long',
	output: 'images/output',
	compressed_output: 'images/compressed_output',
	show_progress: true
})
```

## Discord Emojis

If you want to use this to generate Discord emojis I recommend choosing these settings and using the compressed version of the gif:
| Parameter | Value |
| --- | --- |
| size | 64 |
| sequence | short |

## Credit

The enchantment glint this is using is from https://minecraft.fandom.com/wiki/User:MrJam003/Animated_Sprites_Render.
