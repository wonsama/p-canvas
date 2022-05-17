//////////////////////////////////////////////////////////////
//
//  file :
//      path.js
//  desc :
//      경로 정보를 손쉽게 사용하기 위함
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
const path = require("path");

///////////////////////////////////////////////////////////////
//
//  const
//
const APP_ROOT = path.resolve(__dirname, "../../");
const OUTPUT = path.resolve(APP_ROOT, "output/");

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
module.exports = { APP_ROOT, OUTPUT };

///////////////////////////////////////////////////////////////
//
//  init
//