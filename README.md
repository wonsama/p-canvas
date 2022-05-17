# p-canvas

node-canvas 예제 모음집

node-canvas 를 활용하여 이미지 생성을 background 또는 batch 형태로 손쉽게 만들어 사용하기 위함.

web 기반이라면 다른 이미지 라이브러리를 사용하길 권장

- https://konvajs.org/ : 추천

## 16 x 16 LED

1. `https://www.piskelapp.com/p/create/sprite` 사이트에서 16x16 이미지를 드로잉
2. 생성된 이미지를 `assets/ignore` 폴더에 넣고 .env `0003` 에 파일명을 지정
3. `node ./exmaples/0003` 실행 하여 이미지 맵 생성 (해당 소스의 배열 부분을 복제하여 ino 파일에 삽입)
4. 테스트가 필요한 경우 .env `0002` 에 파일명을 지정 후 `node ./exmaples/0002` 를 수행하여 1600 x 1600 이미지가 정상적으로 생성되었는지 확인
