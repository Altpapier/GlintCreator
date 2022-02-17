# GlintCreator

### Lets you put the Minecraft enchantment glint onto an image

## Install

npm install

## Start

1. Go to the `config.json` file and edit it to your liking.

| Paramter | Description                                                                                                                                                                                             | Type      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| url      | The url to an image or a path to an image                                                                                                                                                               | `String`  |
| name     | The name of the output file                                                                                                                                                                             | `String`  |
| size     | The size of the gif (pixels)                                                                                                                                                                            | `Integer` |
| sequence | Choose between the `short` or `long` sequence. The short sequence makes the file sizes much lower which can be used for discord emojis while the long sequence allows to show the entire glint sequence | `String`  |

2. Run `node .` to start the program. Wait a bit and the image should come out in the `images/original` folder as well as in the `images/compressed` folder for a compressed version of the gif.

## Discord Emojis

If you want to use this to generate Discord emojis I recommend choosing these settings and using the compressed version of the gif:
| Parameter | Value |
| --- | --- |
| size | 64 |
| sequence | short |

## Credit

The enchantment glint this is using is from https://minecraft.fandom.com/wiki/User:MrJam003/Animated_Sprites_Render. Thanks to https://github.com/FlorianWendelborn for helping me make the glint more accurate.
