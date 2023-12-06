const fs = require('fs');

const FileVO = require('./FileVO');
const OptimizerError = require('./OptimizerError');

const HtmlMinifier = require('html-minifier');
const CleanCSS = require('clean-css');
const UglifyJS = require("uglify-js");
const cheerio = require('cheerio');


/**
 * 
 */
class TextOptimizer {
    constructor() {}

    /**
     * html 텍스트를 입력하면 @HtmlMinifier 모듈을 이용하여 압축
     * 
     * @param {*} html_file 
     */
    html_opt(html_file) {


        if (! (html_file instanceof FileVO) ) {
            throw new OptimizerError({
                status: 'error',
                msg: "입력받은 parameter가 FileVO type이 아닙니다."
            });
        }

        const {fileContent , fileType} = html_file

        try {
            if(!fileType || fileType != 'text') throw "text 파일만 처리할 수 있습니다.";

            if (!fileContent) throw 'there is no CONTENT';



            // 로딩
            const $ = cheerio.load(fileContent);

            // 최적화
            const minifiedHTML = HtmlMinifier.minify(fileContent, {
                collapseWhitespace: true,
                removeComments: true
              });

            return {
                status: 'success',
                result: minifiedHTML,
                binary : minifiedHTML,
                type : 'text'
            };
            


        } catch (error) {
            throw new OptimizerError({
                status: 'error',
                msg: error
            });
        }
    }


    /**
     * html 태그를 최적화 하기 위한 룰셋을 로딩
     */
    html_loadRuleSets() {
        const releSets = [];

        return releSets;
    }

    /**
     * @CleanCSS 를 이용하여 css 텍스트 파일 최적화
     * 
     * @param {*} file : 최적화를 수행할 css 파일
     */
    css_optimize(file){
        
        if (! (file instanceof FileVO) ) {
            throw new OptimizerError({
                status: 'error',
                msg: "입력받은 parameter가 FileVO type이 아닙니다."
            });
        }

        const {fileContent , fileType} = file

        try {
            if(!fileType || fileType != 'text') throw "text 파일만 처리할 수 있습니다.";

            if (!fileContent) throw 'there is no CONTENT';


            // CleanCSS 인스턴스를 생성하고 최적화를 수행
            const minifiedCSS = new CleanCSS().minify(fileContent);

            if (minifiedCSS.errors.length) throw minifiedCSS.errors;

            return {
                status: 'success',
                result: minifiedCSS,
                binary : minifiedCSS.styles,
                type : 'text'
            };

        } catch (error) {
            throw new OptimizerError({
                status: 'error',
                msg: error
            });
        }

    }



    /**
     * @UglifyJS 를 이용하여 js파일의 minify 작업을 수행한다.
     * 
     * @param {*} content : minify를 수행할 js파일
     * @returns 
     */
    js_minify(file) {

        if (! (file instanceof FileVO) ) {
            throw new OptimizerError({
                status: 'error',
                msg: "입력받은 parameter가 FileVO type이 아닙니다."
            });
        }

        
        const {fileContent , fileType} = file

        try {
            if(!fileType || fileType != 'text') throw "text 파일만 처리할 수 있습니다.";

            if (!fileContent) throw 'there is no CONTENT';


            const minify_result = UglifyJS.minify(fileContent);

            return {
                status: 'success',
                result: minify_result,
                binary : minify_result?.code,
                type : 'text'
            };

        } catch (error) {
            throw new OptimizerError({
                status: 'error',
                msg: error
            });
        }
    }

    /**
     * @UglifyJS 를 이용하여 간단한 코드를 압축하는 기능을 시연
     */
    test() {
        // 압축할 JavaScript 코드를 정의합니다.
        const inputCode = `
            // 테스트 코드 입니다.
            function hello() {
                console.log("Hello, world!");
            }
       `;

        // UglifyJS를 사용하여 코드를 압축합니다.
        try{
            const result = this.js_minify(inputCode);
            console.log("압축된 코드:", result.code);            
        }catch(err){
            console.error(err.message);
        }
    }


}

module.exports = new TextOptimizer();

/*
  // 모듈로 내보내기
module.exports = {    
    test: () => {
         // 압축할 JavaScript 코드를 정의합니다.
        const inputCode = `
        function hello() {
        console.log("Hello, world!");
        }
        `;

        // UglifyJS를 사용하여 코드를 압축합니다.
        const result = UglifyJS.minify(inputCode);

        if (result.error)
            console.error("압축 중 오류 발생:", result.error);
        else
            // 압축된 코드를 출력합니다.
            console.log("압축된 코드:", result.code);
    }
};
*/