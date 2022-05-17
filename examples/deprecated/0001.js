//////////////////////////////////////////////////////////////
//
//  file :
//      0001.js
//  desc :
//      픽셀드로잉-봄버맨
//  date :
//      2022.05.17
//

/*
    reference :
        - links
*/

///////////////////////////////////////////////////////////////
//
//  require
//
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

///////////////////////////////////////////////////////////////
//
//  const
//
const { APP_ROOT, OUTPUT } = require("../../src/util/path");
const {
  BOMB_JACK_01,
  BOMB_JACK_02,
} = require(`${APP_ROOT}/src/colormap/bomb.jack`);

const INFO = {
  FILE_FILE: "0001.js",
  FILE_DESC: "픽셀드로잉-봄버맨",
  FILE_DATE: "2022.05.17",
};

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
const BOX_SIZE = 100;
async function init() {
  // print info
  console.log(INFO.FILE_FILE, INFO.FILE_DESC, INFO.FILE_DATE);

  // create canvas
  const canvas = createCanvas(BOX_SIZE * 16, BOX_SIZE * 16);
  const context = canvas.getContext("2d");

  // draw rect
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      let color = BOMB_JACK_02[i * 16 + j];
      context.fillStyle = `#${color.toString(16).padStart(6, "0")}`; // "#764abc";
      context.fillRect(BOX_SIZE * j, BOX_SIZE * i, BOX_SIZE, BOX_SIZE); // x, y, width, height
    }
  }

  // write buffer image file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`${OUTPUT}/image.png`, buffer);
}
init().catch(err => {
  console.log(err);
});
