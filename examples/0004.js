//////////////////////////////////////////////////////////////
//
//  file :
//      0004.js
//  desc :
//      16x16 스프라이트 이미지를 로드하여 N개의 IMAGE_MAP으로 전환시켜준다
//  date :
//      2022.05.17
//

/*
    reference :
        - https://www.piskelapp.com/p/create/sprite
*/

///////////////////////////////////////////////////////////////
//
//  require
//
require("dotenv").config();
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs");

///////////////////////////////////////////////////////////////
//
//  const
//
const { APP_ROOT, OUTPUT } = require("../src/util/path");
const INFO = {
  FILE_FILE: "0004.js",
  FILE_DESC:
    "16x16 스프라이트 이미지를 로드하여 N개의 IMAGE_MAP으로 전환시켜준다",
  FILE_DATE: "2022.05.17",
};
const ASSETS_IGNORE_IMG = `${APP_ROOT}/assets/ignore/${process.env.ASSETS_IGNORE_SPRITE_0004}.png`;
const FILE_NAME = `${process.env.ASSETS_IGNORE_SPRITE_0004}.ino`;
const FILE_OUTPUT_PATH = `${OUTPUT}/${FILE_NAME}`;
const BOX_SIZE = 16;
const BLOCK_SIZE = 25;
///////////////////////////////////////////////////////////////
//
//  variable
//

///////////////////////////////////////////////////////////////
//
//  class
//

///////////////////////////////////////////////////////////////
//
//  private function
//

///////////////////////////////////////////////////////////////
//
//  public function
//

///////////////////////////////////////////////////////////////
//
//  exports
//

///////////////////////////////////////////////////////////////
//
//  init
//

function toHexString(rgba, prefix = "0x") {
  // return `#${rgba
  //   .slice(0, 3)
  //   .map(x => parseInt(x.toString()).toString(16).padStart(2, "0"))}`;

  // rgba 값이 순차적으로 들어옴, alpha 는 무시함.

  return `${prefix}${rgba[0].toString(16).padStart(2, "0")}${rgba[1]
    .toString(16)
    .padStart(2, "0")}${rgba[2].toString(16).padStart(2, "0")}`;
}

function getHeader() {
  let buf = [];

  buf.push(`/* `);
  buf.push(`  Arduino 256 RGB LEDs Matrix Animation Frame `);
  buf.push(`  Using WS2812 LED Strips`);
  buf.push(`  Created by Yvan / https://Brainy-Bits.com`);
  buf.push(`*/`);
  buf.push(``);
  buf.push(
    `#include <avr/pgmspace.h>  // Needed to store stuff in Flash using PROGMEM`
  );
  buf.push(`#include "FastLED.h"       // Fastled library to control the LEDs`);
  buf.push(``);
  buf.push(`// LED 연결 수량`);
  buf.push(`#define NUM_LEDS 256`);
  buf.push(``);
  buf.push(`// 데이터 핀 설정 `);
  buf.push(
    `#define DATA_PIN 3  // Connected to the data pin of the first LED strip`
  );
  buf.push(``);
  buf.push(`// 이미지 SET 반복 표시 횟수`);
  buf.push(`#define REPEAT_TIME 1`);
  buf.push(``);
  buf.push(`// LED 배열 정의 `);
  buf.push(`CRGB leds[NUM_LEDS];`);
  buf.push(``);

  return buf.join("\n");
}

function getTail(count = 1, set = 1) {
  let buf = [];
  buf.push(`// 설정`);
  buf.push(`void setup() { `);
  buf.push(
    `  FastLED.addLeds<NEOPIXEL,DATA_PIN>(leds, NUM_LEDS);  // Fastled 라이브러리 초기화`
  );
  buf.push(`  FastLED.setBrightness(15);`);
  buf.push(`}`);
  buf.push(``);
  buf.push(`// 반복 `);
  buf.push(`void loop() { `);
  buf.push(``);
  buf.push(
    `  // SET ${set}, 여러 개인 경우 아래 블록을 복제하여 처리(보드 메모리 한계치에 유의)`
  );
  buf.push(
    `  for(int passtime = 0; passtime < REPEAT_TIME; passtime++) { // 화면에 REPEAT_TIME(N) 회 보여준다.`
  );
  buf.push(``);

  // 이미지 기준 반복처리
  for (let i = 0; i < count; i++) {
    buf.push(`      // SET ${set}, IMAGE ${i}`);
    buf.push(`      FastLED.clear();`);
    buf.push(`      for(int i = 0; i < NUM_LEDS; i++) {`);
    buf.push(
      `        leds[i] = pgm_read_dword(&(IMG${set}_${i}[i]));  // 플레시 메모리에서 로딩`
    );
    buf.push(`      }`);
    buf.push(`      FastLED.show();`);
    buf.push(`      delay(500);`);
    buf.push(``);
  }

  buf.push(`  }`);
  buf.push(``);
  buf.push(`}`);

  return buf.join("\n");
}

async function writeGif() {
  const canvas = createCanvas(BLOCK_SIZE * BOX_SIZE, BLOCK_SIZE * BOX_SIZE);
  const ctx = canvas.getContext("2d");

  const encoder = new GIFEncoder(BLOCK_SIZE * BOX_SIZE, BLOCK_SIZE * BOX_SIZE);
  encoder
    .createReadStream()
    .pipe(
      fs.createWriteStream(
        `${OUTPUT}/${process.env.ASSETS_IGNORE_SPRITE_0004}.gif`
      )
    );
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(500);
  encoder.setQuality(10);

  const list = fs.readdirSync(OUTPUT);
  list.forEach(async (file, i) => {
    let dotPos = file.lastIndexOf(".");
    let ext = file.substring(dotPos); // .png

    if (
      file.indexOf(`${process.env.ASSETS_IGNORE_SPRITE_0004}.`) == 0 &&
      ext == ".png"
    ) {
      const image = await loadImage(`${OUTPUT}/${file}`);
      ctx.drawImage(image, 0, 0);
      encoder.addFrame(ctx);
      if (i === list.length - 1) {
        encoder.finish();
      }
    }
  });
}

async function init() {
  // print info
  console.log(INFO.FILE_FILE, INFO.FILE_DESC, INFO.FILE_DATE);

  // create dummy canvas
  let canvas = createCanvas(BOX_SIZE, BOX_SIZE);
  let context = canvas.getContext("2d");

  loadImage(ASSETS_IGNORE_IMG).then(async image => {
    let sprites = [];
    let total =
      parseInt(image.width / BOX_SIZE) * parseInt(image.height / BOX_SIZE);
    let count = 0;
    let exportNames = [];

    let colormaps = [];

    console.log("load sprite image size", image.width, image.height);
    console.log("sprite count", total);

    for (let i = 0; i < parseInt(image.width / BOX_SIZE); i++) {
      for (let j = 0; j < parseInt(image.height / BOX_SIZE); j++) {
        // draw sprite image from top-left
        context.drawImage(
          image,
          j * BOX_SIZE,
          i * BOX_SIZE,
          BOX_SIZE,
          BOX_SIZE,
          0,
          0,
          BOX_SIZE,
          BOX_SIZE
        );
        let myImageData = context.getImageData(0, 0, BOX_SIZE, BOX_SIZE); // left, top, width, height
        let res = [];
        for (let k = 0; k < myImageData.data.length / 4; k++) {
          let cut = myImageData.data.slice(0 + k * 4, 4 + k * 4);
          // console.log(k, 0 + k * 4, 4 + k * 4, toHexString(cut));
          res.push(toHexString(cut));
        }
        colormaps.push(myImageData.data);

        let exportName = `IMG1_${count}`;
        sprites.push(`// sprite image (${count + 1}/${total}) `);
        sprites.push(`const ${exportName} = [${res.join(", ")}];`);
        sprites.push(``);
        exportNames.push(exportName);
        count++;
      } // for-j
    } // for-i

    // WRITE FILE
    let template = [];
    template.push(getHeader());
    template.push(sprites.join("\n"));
    template.push(getTail(total));
    fs.writeFileSync(FILE_OUTPUT_PATH, template.join("\n"), "utf-8");
    console.log(`created file : ${FILE_OUTPUT_PATH}`);

    // WRITE IMAGE
    // create canvas

    canvas = createCanvas(BLOCK_SIZE * BOX_SIZE, BLOCK_SIZE * BOX_SIZE);
    context = canvas.getContext("2d");
    count = 0;
    for (let colormap of colormaps) {
      // colormap : 1024 ( 16 x 16 x 4)
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
          // rgb만 사용하고 a 값은 무시 (255)
          let r = colormap[j * 4 + i * BOX_SIZE * 4 + 0];
          let g = colormap[j * 4 + i * BOX_SIZE * 4 + 1];
          let b = colormap[j * 4 + i * BOX_SIZE * 4 + 2];
          let rgb = [r, g, b];
          let fillStyle =
            `#` + rgb.map(x => x.toString(16).padStart(2, "0")).join("");
          context.fillStyle = fillStyle; // "#764abc";
          context.fillRect(
            BLOCK_SIZE * j,
            BLOCK_SIZE * i,
            BLOCK_SIZE,
            BLOCK_SIZE
          ); // x, y, width, height
        }
      }
      const buffer = canvas.toBuffer("image/png");
      const imageOutputPath = `${OUTPUT}/${process.env.ASSETS_IGNORE_SPRITE_0004}.${count}.png`;
      fs.writeFileSync(imageOutputPath, buffer);
      console.log(`created file : ${imageOutputPath}`);
      count++;
    }

    // WRITE GIF
    await writeGif();
  });
}
init().catch(err => {
  console.log(err);
});
