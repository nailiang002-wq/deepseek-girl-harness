# Outfit artwork / 换装素材

`hoodie` is the blue & white pullover outfit; `pajamas` is the lavender star-pajama outfit. The original maid outfit remains in `../frames`. These are complete outfit sets, each covering the same twelve animation states.

`hoodie` 为蓝白卫衣，`pajamas` 为紫色星星睡衣。原版女仆装保留在 `../frames`。每套衣服都覆盖相同的十二种状态。

- `source-sheets/{state}.png`: selected ImageGen output, before mechanical slicing and normalization.
- `frames/{state}/{00..}.png`: normalized 512 × 512 transparent frames, ready for the build.
- `generation-prompts.json`: prompts used for that outfit, with the existing state sheet as the pose reference and the new idle sheet as the outfit reference.

Each outfit has 78 physical frames: eleven states with six frames, plus twelve eating frames. The compiler packs each state into a 320-pixel-high WebP atlas. A meal visits the twelve eating frames three times, for 36 timed poses and 13,080 milliseconds. No extra copies of the image data are needed for the second and third bites.

每套包含 78 张实际帧图：十一种状态各六张，吃饭十二张。编译器将每种状态打包成高 320 像素的 WebP 图集。每次喂饭连续播放三口，共 36 次姿势播放、13,080 毫秒，第二和第三口复用已有图像数据。

New artwork was generated with the built-in ImageGen tool, based on the character reference supplied by the project creator and the existing project art. The original reference image is not distributed. This directory does not grant a separate artwork license.

新插画由内置 ImageGen 根据项目创建者提供的角色参考及项目已有插画生成。原始参考图未随仓库分发。本目录未另行授予插画许可。
