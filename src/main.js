const TextOptimizer = require('./opt_module/TextOptimizer');
const FileController = require('./opt_module/OptimizerFileController');
const ImageOptimizer = require('./opt_module/ImageOptimizer');

const fs = require('fs');
const path = require('path');



/**
 * 
 * @param {*} task : 수행할 작업을 명시
 */
async function doOptTask(task) {
  const {
    src,              // 파일 위치 (str)
    outDir,           // 저장 경로
    // task 이후 실행할 작업
    after = {
      logging: false
    },
    // 수행할 작업
    // 기본적인 구조는 command(args) 형태이며, args에 기본적으로 file은 전달됨
    // Optimizer 인스턴스로 file을 전달하여 binary 형태의 최적화된 결과물을 return 받는다.
    command = async (args) => { 
      console.log(`
      command 함수를 구현해주세요
      args에 fileVO 클래스의 file과 필요한 경우 options을 정의하여 넘겨주세요.

      const { file , options } = args;
      
      // Optimizer 인스턴스에 file을 전달하여 원하는 최적화 작업을 수행하고 binary 형태로 결과물을 받게됩니다.
      let optimized = TextOptimizer.js_minify(file);

      // 이미지 처리의 경우 비동기 작업을 수행할 수 있어서 async 함수로 구현합니다.
      최종 결과물은 optimized 객체로 리턴합니다.
      return optimized; // {status , result(결과물 객체) , binary , type}
      /*
      예시 {
                status: 'success',
                result: image,
                binary: await image.toBuffer(), // 바이너리 파일 리턴
                type: 'image'
            };
      */
      `);
    },
    args = {}              // command의 args
  } = task;


  // src 파일 로딩
  FileController.fileLoading(src).then((loadedFile) => {
    // 파일 파라미터 전달
    args.file = loadedFile;
    // default
    let outFileName = `opt_${loadedFile.fileName}`;


    // (command로 정의된) 최적화 작업 수행
    // 최적화 작업 이후, 최적화 객체, 파일 바이너리가 리턴됨

    command(args).then( async (optimized) => {

      const { status, result, binary, type = 'text' } = optimized;

      if (status != 'success') {
        console.error('작업 수행 실패', loadedFile.fileName);
        return;
      }

      if(type == 'image'){
        let ext = result.options.formatOut;


        if(ext == 'heif') ext = 'avif';
        if(outFileName.lastIndexOf(".") > -1){
          outFileName = outFileName.substring(0, outFileName.lastIndexOf(".")) + "." + ext;
        } ;


      }

      // 최적화 작업 수행 후, 파일 저장
      await FileController.makeFile(outDir, outFileName, binary).then(() => {
        // 최적화 효율 확인
        if (after.logging)
          FileController.fileLoading(path.join(outDir, outFileName)).then((optFile) => {
            console.log(`${loadedFile.fileName} -> ${outFileName} : [ orgSize = ${FileController.formatFileSize(loadedFile.fileSize)} , optSize = ${FileController.formatFileSize(optFile.fileSize)} ]`);
          });
        });
      });


  });

}



function test() {
  try {



    const inputPath = path.join(__dirname, 'input');
    const outputPath = path.join(__dirname, 'output');

    // 커스텀 펑션
    const customTask = (file) => {

      let task = {
        src: file.fileFullPath,
        outDir: outputPath,
        after: {
          logging: true
        },
        args: {}
      }

      let fileType = file.fileType;

      let ext = file.extension.split('.');
      ext = ext.pop();


      // 최적화 작업 명령 설정
      let optimized;
      switch (fileType) {
        case 'text':
          task.command = async (args) => {

            const { file } = args;


            let ext = file.extension.split('.');
            ext = ext.pop();

            switch (ext) {
              case 'js':
                optimized = TextOptimizer.js_minify(file);

                break;
              case 'html':
                optimized = TextOptimizer.html_opt(file);
                break;

              case 'css':
                optimized = TextOptimizer.css_optimize(file);
                break;
            }

            return optimized;
          };

          break;
        case 'image':

          task.command = async (args) => {

            const { file } = args;

            optimized = await ImageOptimizer.imageOptimizing(file, {
              // resize : {width:500 , height:500},
              // withMetadata: true,
              // toFormat: { format: 'avif' },
              optimizedFormat: true,
              
              // 필요한 경우 options 적용 가능
              options : {
                  // quality : 100,       // quality, integer 1-100
                  // alphaQuality : 100,  // quality of alpha layer, integer 0-100
                  // lossless : true,     // use lossless compression mode
                  // nearLossless : true, // use near_lossless compression mode
                  // effort : 6           // CPU effort, between 0 (fastest) and 6 (slowest)
              }
              
            });

            return optimized
          };

          break;
        case 'video':
          task.command = async () => {

          };
          break;

        default:
          break;
      }

      return task;
    }

    const files = fs.readdirSync(inputPath);

    // files 배열에 디렉토리 내의 파일 목록이 들어 있음
    console.log('input 디렉토리 내의 파일 목록 : ', files);

    (async () => {
      for (let fileName of files) {
        const filePath = path.join(inputPath, fileName);

        try {
          const loadedFile = await FileController.fileLoading(filePath);


          const task = customTask(loadedFile);
          doOptTask(task);

        } catch (e) {
          console.error(e);
        }
      }
    })();

    // 이곳에서 files 배열을 활용하여 원하는 작업을 수행할 수 있음
  } catch (err) {
    console.error('디렉토리를 읽을 수 없음:', err);
  }
}


function test2(){
  const inputPath = path.join(__dirname, 'input');
  const outputPath = path.join(__dirname, 'output');


  doOptTask({
    src: inputPath + "/" + 'tt.png',
    outDir: outputPath,
    after: {
      logging: true
    },
    command :  async (args) => {

      const { file } = args;

      let optimized = await ImageOptimizer.imageOptimizing(file, {
        // resize : {width:500 , height:500},
        // withMetadata: true,
        toFormat: { format: 'webp' },
        optimizedFormat: true,
        
        // 필요한 경우 options 적용 가능
        options : {
            // quality : 100,       // quality, integer 1-100
            // alphaQuality : 100,  // quality of alpha layer, integer 0-100
            // lossless : true,     // use lossless compression mode
            // nearLossless : true, // use near_lossless compression mode
            // effort : 6           // CPU effort, between 0 (fastest) and 6 (slowest)
        }
        
      });

      return optimized
    },
    args: {}
  });
}





// test();
test2();

