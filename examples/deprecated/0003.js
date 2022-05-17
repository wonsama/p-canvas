//////////////////////////////////////////////////////////////
//
//  file :
//      0003.js
//  desc :
//      16x16 이미지를 읽어들여 칼라맵 형태로 전환한다 (링크 참조)
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
const fs = require("fs");

///////////////////////////////////////////////////////////////
//
//  const
//
const { APP_ROOT, OUTPUT } = require("../src/util/path");
const INFO = {
  FILE_FILE: "0003.js",
  FILE_DESC: "16x16 이미지를 읽어들여 칼라맵 형태로 전환한다 (링크 참조)",
  FILE_DATE: "2022.05.17",
};
const ASSETS_IGNORE_IMG = `${APP_ROOT}/assets/ignore/${process.env.ASSETS_IGNORE_PNG_0003}`;
const FILE_OUTPUT_PATH = `${OUTPUT}/${process.env.ASSETS_IGNORE_PNG_0003}.colormap.js`;
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
const BOX_SIZE = 16;

function toHexString(rgba, prefix = "0x") {
  // return `#${rgba
  //   .slice(0, 3)
  //   .map(x => parseInt(x.toString()).toString(16).padStart(2, "0"))}`;

  return `${prefix}${rgba[0].toString(16).padStart(2, "0")}${rgba[1]
    .toString(16)
    .padStart(2, "0")}${rgba[2].toString(16).padStart(2, "0")}`;
}

async function init() {
  // print info
  console.log(INFO.FILE_FILE, INFO.FILE_DESC, INFO.FILE_DATE);

  // create canvas
  const canvas = createCanvas(BOX_SIZE, BOX_SIZE);
  const context = canvas.getContext("2d");

  loadImage(ASSETS_IGNORE_IMG).then(image => {
    context.drawImage(image, 0, 0, BOX_SIZE, BOX_SIZE);
    var myImageData = context.getImageData(0, 0, BOX_SIZE, BOX_SIZE); // left, top, width, height

    let res = [];
    for (let i = 0; i < myImageData.data.length / 4; i++) {
      let cut = myImageData.data.slice(0 + i * 4, 4 + i * 4);
      res.push(toHexString(cut));
    }
    let template = [];
    template.push(`// 16x16-colormap.json`);
    template.push(`const COLOR_MAP = [${res.join(", ")}];`);
    template.push(`module.exports = COLOR_MAP;`);

    fs.writeFileSync(FILE_OUTPUT_PATH, template.join("\n"), "utf-8");
    console.log(`created file : ${FILE_OUTPUT_PATH}`);
  });
}
init().catch(err => {
  console.log(err);
});
