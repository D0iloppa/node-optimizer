class FileVO {
    constructor() {
      // 파일 로딩 상태
      this.status = false;
      this.msg = null;
  
      // 파일 사이즈
      this.fileSize = null;
      // 파일명 포함 파일 경로
      this.fileFullPath = null;
      // 파일 경로
      this.filePath = null;
      // 파일명
      this.fileName = null;
      // 확장자
      this.extension = null;
  
      // 파일 내용
      this.fileContent = null;
      this.fileType = null;
    }

  static create() {
    return new FileVO();
  }
}

module.exports = FileVO;