const fs = require('fs');

const FileController = require('./OptimizerFileController');
const FileVO = require('./FileVO');

const OptimizerError = require('./OptimizerError');

const sharp = require('sharp');



/**
 * @Sharp 모듈을 이용한 최적화 작업을 수행
 */
class ImageOptimizer {
    constructor() { }


    /**
     * 
     * @param {*} file  : fileVO 객체
     * @param {*} image : sharp로 로딩한 image 객체
     * @param {*} options  : 작업 수행시 필요한 options
     * @returns 
     */
    async findOptimizedFormat(file, image, options) {
        const formatList = ["jpeg", "png", "gif", "webp", "avif"];
        const metadata = await image.metadata();

        let org = { format: metadata.format, image: image, desc: "org", size: { bytes: file.fileSize, label: FileController.formatFileSize(file.fileSize) } }
        const tmpList = [org];


        console.log('[최적 포맷 검색 수행]');
        if(options) console.log("수행 options:", options);
        

        let min = false;
        
        console.log("==================");
        for (let format of formatList) {
            
            try {
                // 여러 값 함께 출력
                process.stdout.write(format + " : ");

                const tmpImg = await image.toFormat(format , options);
                const buffer = await tmpImg.toBuffer();
                const fileSizeInBytes = buffer.length;
                tmpList.push({
                    format: format,
                    image: tmpImg,
                    size: fileSizeInBytes
                });

                console.log(FileController.formatFileSize(fileSizeInBytes));

                if (!min) min = fileSizeInBytes;
                if (min >= fileSizeInBytes) min = fileSizeInBytes;

            } catch (e) {
                console.error(e);
            }
        }
        console.log("==================");
        
        // 최소용량 선택
        const optimizedImg = tmpList.find((item) => item.size == min);

        return optimizedImg.image;


    }

    /**
     * 
     * @param {*} file : fileVO 형태
     * @param {*} args : 최적화를 수행할 args
     *  const {
            optimizedFormat = false,
            resize = false,
            withMetadata = false,
            toFormat = false,
            options
        } = args;

     * @returns 
     */
    async imageOptimizing(file, args) {


        if (!(file instanceof FileVO)) {
            throw new OptimizerError({
                status: 'error',
                msg: "입력받은 parameter가 FileVO type이 아닙니다."
            });
        }

        const { fileContent, fileType } = file


        const {
            optimizedFormat = false,
            resize = false,
            withMetadata = false,
            toFormat = false,
            options
        } = args;

        try {

            if (!fileType || fileType != 'image') throw "image 파일만 처리할 수 있습니다.";

            if (!fileContent) throw 'there is no CONTENT';


            // console.log("알고리즘 리스트" , sharp.kernel , sharp.strategy);
            // 이미지 로딩
            let image = await sharp(file.fileFullPath);
            const metadata = await image.metadata();

            // 작업에 따른 수행
            // 최적 포맷 설정
            if (optimizedFormat) 
                image = await this.findOptimizedFormat(file, image , options);
            

            // resize 작업
            if (resize) {
                // 잘못된 변수 입력일 경우 default
                let { width = metadata.width, height = metadata.height} = resize;

                image = await image.resize(width, height);
            }

            if (withMetadata) image = image.withMetadata();
            
            
            if (toFormat) {
                // 잘못된 변수 입력일 경우 default
                const { format = metadata.format } = toFormat;

                image = await image.toFormat(format);
            }

            return {
                status: 'success',
                result: image,
                binary: await image.toBuffer(), // 바이너리 파일 리턴
                type: 'image'
            };

        } catch (error) {
            console.log('err', error);

            throw new OptimizerError({
                status: 'error',
                msg: error
            });
        }

    }


    async test(file) {
        try {
            const image = await sharp(file)
                .resize(500, 500, { fit: 'contain' }) // fit : contain 가로 세로 비율을 강제 유지
                .withMetadata() // 원본 이미지의 메타데이터 포함
                .toFormat('jpeg', { quality: 100 }) // 포맷, 퀄리티 지정


            return {
                status: 'success',
                result: image,
                binary: image.toBuffer(), // 바이너리 파일 리턴
                type: 'image'
            };

        } catch (error) {
            console.log('err', error);

            throw new OptimizerError({
                status: 'error',
                msg: error
            });
        }
    }


}

module.exports = new ImageOptimizer();