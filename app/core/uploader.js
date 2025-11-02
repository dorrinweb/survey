import fs from 'fs';
import path from 'path';
import crypto from './crypto.js';
import { log, random, getPath, getEnv } from './utils.js';
import { mkDir, unlink, fileExists } from './fs.js';
import { exec } from 'child_process';
import datetime from './datetime.js';
import ffmpeg from 'fluent-ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import mime from 'mime-types'

export async function copyFileWithNewName(oldFolderPath, oldFilerelatedPath) {
    try {
        const fileExtension = path.extname(oldFolderPath + oldFilerelatedPath).slice(1);
        const newFileName = fileNameGenerator('steps', fileExtension);
        const newFilePath = path.join(path.dirname(oldFolderPath + oldFilerelatedPath), newFileName);

        const resultCopyFile = await new Promise((resolve, reject) => {
            fs.copyFile(oldFolderPath + oldFilerelatedPath, newFilePath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(newFilePath);
            });
        });

        return resultCopyFile.replace(oldFolderPath, "");
    } catch (error) {
        console.error('Error while copying file:', error);
        // You can return a default value or handle the error as you wish
        return null;
    }
}

/**
 * 
 * @param {*} uploadedFor 
 * @param {*} ext 
 * @returns 
 */
export function fileNameGenerator(uploadedFor,ext){
    return (uploadedFor + '-' + crypto.hash(datetime.getTimeStamp()+random(1000000000000,9999999999999)) + '.' + ext)
}

/**
 * 
 * @param {*} fileConcept 
 * @param {*} mime_type 
 * @returns 
 */
export function allowFileUpload(fileConcept,mime_type){
try{
    let allowFileTypes;
    switch(fileConcept){
        case 'picture':
           allowFileTypes = getEnv('ALLOW_PICTURE_TYPES','json');
        break;
        case 'video':
           allowFileTypes = getEnv('ALLOW_VIDEO_TYPES','json');
        break;
        case 'audio':
           allowFileTypes = getEnv('ALLOW_AUDIO_TYPES','json');
        break;
        case 'text':
           allowFileTypes = getEnv('ALLOW_TEXT_TYPES','json');
        break;      
    }
    
    const result = allowFileTypes.find((item)=>{
        return item.mime_type === mime_type;
    });
        return result?.ext ?? '';
    }catch(e){
        return '';
    }
}



/**
 * 
 * @param {*} size 
 * @param {*} type 
 * @returns 
 */
export function toByte(size,type = 'B'){
    try{
        const types = ["B", "KB", "MB", "GB", "TB"];
        const key = types.indexOf(type.toUpperCase());
        if (typeof key !== "boolean") 
            return size * 1024 ** key;    
        else
            return 0;
    }
    catch(e){
        return 0;
    }
}

/**
 * 
 * @param {*} fileConcept 
 * @param {*} uploadedFile 
 * @param {*} uploadedFor 
 * @param {*} userId 
 * @returns 
 */
export async function uploadFile(fileConcept,uploadedFile,uploadedFor,userId){
    try{
        const allowedFilesConcept = ['picture','video','audio','text'];
        let allowedFileSize;
        let ext;
        let filePath;
        if(!allowedFilesConcept.includes(fileConcept))
            return 3;//upload this concept is invalid;
        switch(fileConcept){
            case 'picture':
                ext = allowFileUpload(fileConcept,uploadedFile.mimetype);
                allowedFileSize = toByte(getEnv('MAX_PICTURE_SIZE'), 'MB');
                filePath = getPath() + getEnv('UPLOAD_FOLDER')+'images/';
            break;
            case 'video':
                ext = allowFileUpload(fileConcept,uploadedFile.mimetype);
                allowedFileSize = toByte(getEnv('MAX_VIDEO_SIZE'), 'MB');
                filePath = getPath() + getEnv('UPLOAD_FOLDER')+'videos/';
            break;
            case 'audio':
                ext = allowFileUpload(fileConcept,uploadedFile.mimetype);
                allowedFileSize = toByte(getEnv('MAX_AUDIO_SIZE'), 'MB');
                filePath = getPath() + getEnv('UPLOAD_FOLDER')+'audios/';
            break;
            case 'text':
                ext = allowFileUpload(fileConcept,uploadedFile.mimetype);
                allowedFileSize = toByte(getEnv('MAX_TEXT_SIZE'), 'MB');
                filePath = getPath() + getEnv('UPLOAD_FOLDER')+'texts/';
            break;

        }
        if (ext === '') {
            return 2; //upload file type invalid
        }
        if (uploadedFile.size > allowedFileSize)
            return 1; //upload file size invalid
        const fileName = fileNameGenerator(uploadedFor, ext);
        const userFolder = userId;
        const finalPhysicalPath = filePath + userFolder;
        const fileUrl = '/' + userFolder + '/' + fileName;
        const moveTo = finalPhysicalPath +'/'+ fileName;
        if(mkDir(finalPhysicalPath)){
            await uploadedFile.mv(moveTo);
            let streamInfo;
            if(fileConcept === 'video'){
                const outputFolder = `${finalPhysicalPath}`;
                const HLSName = fileName.replace(ext,'m3u8');
                const videoLength = await getVideoLength(moveTo);

                // The video streaming process was temporarily stopped! 
                // const ffmpegCommand = `ffmpeg -i ${moveTo} -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${outputFolder}/${HLSName}`;
                // exec(ffmpegCommand, (error, stdout, stderr) => {
                //     if (error) {
                //         log(error);
                //         return -3; // error in streaming video
                //     }
                // });
                streamInfo = {
                    // hlsUrl: getEnv('API_URL')+ userFolder + '/' + HLSName,
                    videoLength: videoLength, 
                };
            }
            

            return {'fileUrl' : fileUrl,'path': moveTo, 'streamInfo': streamInfo};
        }
        else 
            return -1 //The desired path for uploading the image could not be created    
    }catch(e){
        return -2;//uploading the image failed
    }

}



/**
 * 
 * @param {*} filePath 
 * @returns 
 */
export async function  getVideoLength(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const durationInSeconds = metadata.format.duration;
                const durationInMilliseconds = durationInSeconds * 1000;
                resolve(durationInMilliseconds);
            }
        });
    });
}

/**
 * 
  @param {*} filePath optional
 * @returns true if the file is removed from server
            * false if failed
 */
export async function removeFileFromServer(filePath){
    try{
       if (fileExists(filePath))
            unlink(filePath)
        return true;
    }catch(e){
        log(e)
        return false;
    }
}

/**
 *This method takes the concept of the desired file and the url address of the file 
  and returns the physical address of the file on the server.
 * @param {*} urlConcept 
 * @param {*} fileUrl 
 * @returns physical faile path if succes
            * null if failed
 */
export async function getFilePath(urlConcept,fileUrl){
    try{
        /*
          The physical address of the desired file on the server must be created according to input data.
        */
            let filePath;
            let folderName;
            switch(urlConcept){
                case 'videoUrl' :
                    folderName = 'videos'
                    break;
                case 'audioUrl' :
                    folderName = 'audios'
                    break;
                case 'pictureUrl' :
                    folderName = 'images'
                    break;
                case 'textUrl' :
                    folderName = 'texts'
                    break;         
            }
            filePath = getPath() + getEnv('UPLOAD_FOLDER')+folderName+'/' + fileUrl.replace(getEnv('API_URL'),'');
            return filePath;
    }catch(e){
        log(e)
        return null;
    }
}

/**
 * Check the duration of an audio or video file.
 * @param {string} filePath - The path to the audio or video file.
 * @returns {Promise<number>} - The duration of the file in milliseconds.
 */
export async function checkFileDuration(filePath) {
    try {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) {
                    log(err);
                    reject(-2);
                } else {
                    const durationInSeconds = metadata.format.duration;
                    const durationInMilliseconds = durationInSeconds * 1000;
                    resolve(durationInMilliseconds);
                }
            });
        });
    } catch (e) {
        log(e);
        return -1;
    }
}


export async function getFileConcept(fileData) {
    const mimeType = fileData.mimetype;
    try {
        // Check if MIME type is available
        if (!mimeType) {
            return -1; // Error code for missing MIME type
        }

        // Determine the file concept based on MIME type
        if (mimeType.startsWith('image/')) {
            return 'picture';
        } else if (mimeType.startsWith('video/')) {
            return 'video';
        } else if (mimeType.startsWith('audio/')) {
            return 'audio';
        } else if (
            mimeType.startsWith('text/') ||
            ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)
        ) {
            return 'text';
        } else {
            return -2; // Error code for unsupported file concept
        }
    } catch (e) {
        // Handle unexpected errors
        log(e)
        return -3; // Error code for unknown errors
    }
}

