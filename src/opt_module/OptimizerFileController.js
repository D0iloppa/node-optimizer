const OptimizerError = require('./OptimizerError');
const FileVO = require("./FileVO");


/**
 * Optimizer에서 사용할 파일을 다루기 위한 컨트롤러
 * 파일들을 다룰 때 공통의 인터페이스(FileVO)를 갖춤
 */
class OptimizerFileController {
  constructor() { }

  async fileLoading(file) {

    const fs = require('fs');
    const path = require('path');

    let result = new FileVO();
    

    try {
      let filePath, encoding;
      if (typeof file === 'object') {
        // 객체인 경우 파싱
        ({
          filePath,
          encoding = 'utf-8'
        } = file);

        if (!filePath)
        throw new OptimizerError({
          status: 'error',
          msg: 'Invalid object format. "filePath" properties are required.'
        });
        
      } else if (typeof file === 'string') {
        filePath = file;
        encoding = 'utf-8';
      } else {
        throw new OptimizerError({
          status: 'error',
          msg: 'Invalid input format. Provide either a file path (string) or an object.'
        });
      }

      const fileStats = fs.statSync(filePath);

      let fileContent = fs.readFileSync(filePath, encoding);


      // 파일 로딩 결과 셋팅
      result.status = true;

      result.fileSize = fileStats.size;

      result.fileFullPath = filePath;
      result.filePath = path.dirname(filePath);
      result.fileName = path.basename(filePath); // 파일명 가져오기
      result.extension = path.extname(filePath).toLowerCase(); // 확장자 가져오기
      result.fileType = this.checkFileType(result.extension);

      result.fileContent = fileContent;



    } catch (e) {
      console.error(e);
      result.msg = e;
    }

    return result;


  }
  /**
   * 확장자를 통해 파일의 타입[video,image,text]을 결정
   * @param {*} ext 
   * @returns 
   */
  checkFileType(ext) {
    ext = ext.toLowerCase();
    ext = ext.replace('.', '');

    const typeMap = {
      "video": ["mp4"],
      "image": ["jpg", "jpeg", "png", "bmp", "gif", "webp", "avif"],
      "text" : ["html", "js", "css"],
    }

    let type = "etc";


    for (let key in typeMap) {
      const list = typeMap[key];
      if (list.includes(ext)) {
        type = key;
        break;
      }
    }

    return type;
  }



  formatFileSize(fileSizeInBytes) {
    if (fileSizeInBytes >= 1073741824) {
      return (fileSizeInBytes / 1073741824).toFixed(2) + ' GB';
    } else if (fileSizeInBytes >= 1048576) {
      return (fileSizeInBytes / 1048576).toFixed(2) + ' MB';
    } else {
      return (fileSizeInBytes / 1024).toFixed(2) + ' KB';
    }
  }




  /**
   * binary 파일을 지정된 경로에 저장한다.
   * @param {*} filePath 
   * @param {*} fileName 
   * @param {*} fileContent 
   */
  async makeFile(filePath, fileName, fileContent) {

    if (!filePath || !fileName || !fileContent) {
      throw new Error(`filePath, fileName, fileContent은 반드시 입력되어야 합니다.
             your Params = {
              filePath:'${filePath}' , 
              fileName:'${fileName}' , 
              fileContent: ${fileContent ? 
                (fileContent.length > 30 ? fileContent.substring(0, 30) + '...' : fileContent) 
                : 'null'}
        }`);
    }

    const path = require('path');
    const fs = require('fs');

    const fullFilePath = path.join(filePath, fileName);

    try {

      // 확장자에 의한 파일 저장 방식 결정
      let encoding = 'utf-8';
      let ext = fileName.split('.').pop();
      let fileType = await this.checkFileType(ext);


      function makeTextFile(fullFilePath, fileContent, encoding = 'utf-8') {
        // 파일 생성
        fs.writeFileSync(fullFilePath, fileContent, encoding);
      }

      async function makeImageFile(fullFilePath, fileContent) {
        // 파일 생성
        fs.writeFileSync(fullFilePath, fileContent);
      }


      switch (fileType) {
        case 'image':
          makeImageFile(fullFilePath, fileContent);
          break;

        case 'video':
          break;

        case 'text':
          makeTextFile(fullFilePath, fileContent, encoding);
          break;
        case 'etc':
        default:
          makeTextFile(fullFilePath, fileContent, 'utf-8')
          break;
      }
    } catch (err) {
      throw new Error(`파일 생성 실패[${fullFilePath}] : ${err}`);
    }
  }

  



}

module.exports = new OptimizerFileController();