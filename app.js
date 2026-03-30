const express = require('express');
const ejs = require('ejs');
const path = require('path');
const appConfig = require('./config/config.js');
const { logger, logFormat } = require('./config/logger.js');
const fileUpload = require('express-fileupload');
const moment = require('moment');
const fs = require('fs');


const app = express();
const runPort = appConfig.PORT || 8080;
const contextRoot = path.join(__dirname, '/public');

app.use(express.json()); // x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false })); // application/json

app.use(express.static(contextRoot));  //  정적파일(image, css ....) 경로 설정 
app.set('views', contextRoot);  // html view  폴더 셋팅 


app.set('view engine', 'ejs'); // 렌더링 엔진 설정 

app.engine('html', require('ejs').renderFile);  // html 파일도 


// // java was proxy  설정 START
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({
    target: appConfig.wasUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '',
    },
    on: {
        proxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader("x-forwarded-for", '127.0.0.1');
            fixRequestBody(proxyReq, req, res);  // Body Data Patch
            // logger.info(logFormat.reqFormat(req, res, proxyReq.body));
        },
        proxyRes: (proxyRes, req, res) => {
            // logger.warn(logFormat.reqFormat(req, res, proxyRes.body))
        },
        error: (err, req, res) => {
            logger.error(err);
        }

    }

}));

app.use(fileUpload({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 
    }
}))
app.use('/upload', async (req, res) => {

    logger.info("Start Upload Process !");

    if (appConfig.UploadAccessIPs.findIndex((item) => { return item == req.ip }) < 0) {
        logger.error("Cann't Access IPs : " + req.ip);
        return res.status("500").json(Object.assign(req.body, { "datas": "Fail 3!" }));
    }

    if ((req.body.SENDER || '') != "S&C Homepage WAS") {
        logger.error("Not enought params!")
        return res.status("500").json(Object.assign(req.body, { "datas": "Fail 1!" }));
    }
    let rtnParam = Object.assign(req.body, { SENDER: '' });



    if (req.files == null) return res.status("500").json(Object.assign(rtnParam, { "datas": "Fail 2!" }));
    const savePath = req.body.savePath || 'upload';
    const arrKeys = Object.keys(req.files);
    const arrPrms = [];
    arrKeys.forEach((strKey) => {

        const tmpFile = req.files[strKey];
        // const tmpFileNm = Buffer.from(tmpFile.name, "latin1").toString("utf8");
        const tmpFileNm = decodeURI(tmpFile.name);
        const uploadFolder = path.join(contextRoot, savePath);
        const uploadFile = path.join(uploadFolder, tmpFileNm);
        const folderExists = fs.existsSync(uploadFolder);
        if (!folderExists) {
            fs.mkdirSync(uploadFolder);
        }


        arrPrms.push(
            new Promise((resolve, reject) => {

                const exists = fs.existsSync(uploadFile);
                if (exists) {
                    const backPath = path.join(contextRoot, savePath, 'backup');
                    const backFile = path.join(backPath, tmpFileNm + '.' + moment(new Date()).format("YYYYMMDDHHmmss"));
                    const backexists = fs.existsSync(backPath);
                    if (!backexists) {
                        fs.mkdirSync(backPath, { recursive: true })
                    }
                    fs.renameSync(uploadFile, backFile);
                    logger.info("BACK FILE : " + backFile);
                }

                logger.info("MOVE FILE : " + uploadFile);
                tmpFile.mv(uploadFile, (error) => {
                    if (error) {
                        console.log("Copy Fail !");
                        reject({ rescd: '0001' });
                    } else {
                        console.log("Copy Complete!");
                        resolve({ rescd: '0000', filepath: uploadFile.replace(contextRoot, ''), filename: tmpFileNm });
                    }
                })



            })
        )
    })
    await Promise.all(arrPrms).then(
        (datas) => {
            console.log(datas);
            let error = false;
            datas.forEach((data) => {
                if (data['rescd'] != "0000") {
                    error = true;
                }
            })

            if (error) {
                return res.status(500).json(Object.assign(rtnParam, { "datas": datas }));
            } else {
                return res.status(200).json(Object.assign(rtnParam, { "datas": datas }));
            }
        }, (errors) => {
            return res.status(500).json(Object.assign(rtnParam, { 'error': errors }));
        }
    );
    logger.info("Finish Upload Process ! ")
})


// // // java was proxy  설정 END

// app.get('/:path1', (req, res) => {
//     res.render('./' + req.params.path1 + '.html');
// });

// app.get('/:path1/:path2', (req, res)=>{
//     res.render('./' + req.params.path1 + '/' + req.params.path2 +'.html');
// });

// app.get('/:path1/:path2/:path3', (req, res)=>{
//     res.render('./' + req.params.path1 + '/' + req.params.path2 + '/' + req.params.path3 +'.html');
// });

app.use((req, res, next) => {
    res.redirect("/");//404페이지 리다이렉트 처리
});

app.listen(runPort, '0.0.0.0', () => {
    logger.info("Server Start " + runPort + " port !");
});









