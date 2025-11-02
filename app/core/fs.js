import fs, { lstat, lstatSync } from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import { log, random, getPath, getEnv } from './utils.js';



/**
 * Checks whether the target path is a regular file or not. 
 * @param {*} path 
 * @returns true if path is a file.
          * false which means that the path is a directory or does not exist.
 */
export function isFile(path){
    try{
        return fs.lstatSync(path).isFile();
    }catch(e){
        return false;
    }
}

/**
 * Checks whether the target path is a directory or not.
 * @param {*} path 
 * @returns true if the path is a directory.
          * false which means that the path is a file or does not exist.
 */
export function isDirectory(path){
    try{

        return fs.lstatSync(path).isDirectory();
    }
    catch(e){
        return false;
    }
}

/**
 * first checks if the path is a file using isFile(path).
 * If the path is a file, then it checks if the file actually exists.
 * @param {*} path 
 * @returns true if all the conditions are true.
          * false which means that the file path does not exist or is a directory. 
 */
export function fileExists(path){
    try{
        if(isFile(path)){
            return fs.existsSync(path);
        }
        else
        return false;

    }
    catch(e){
        return false;
    }
}

/**
 * This function checks if the path is a file or not using isFile(path). 
 * If the path is a file, it tries to remove the file.
 * @param {*} path 
 * @returns true if the delete operation is successful.
          * false which means that the path was not a file or was not deleted. 
 */
export function unlink(path){
    try{
        if(isFile(path)){
             fs.unlinkSync(path);
             return true;
        }
        else
        return false;

    }
    catch(e){
        return false;
    }
}

export async function getRealFileType(filePath) {
    try {
      // خواندن اطلاعات فایل و شناسایی نوع آن
      const fileBuffer = fs.readFileSync(filePath);
      const fileType = await fileTypeFromBuffer(fileBuffer);
  
      if (!fileType) {
        return '';
      }
  
      // بررسی مطابقت نوع MIME با نوع‌های مجاز
      return fileType;
    } catch (error) {
      console.error('خطا در بررسی نوع فایل:', error.message);
      return '';
    }
  }

/**
 * This function checks whether the desired directory exists or not using isDirectory(path). 
 * If the directory does not exist, it will create it.
 * @param {*} path 
 * @returns true if the directory was created successfully or exists.
          * false If for any reason it fails to create the directory. 
 */
export function mkDir(path){
    try{
        if(!isDirectory(path))
            fs.mkdirSync(path, { recursive: true })
        return true;
    }
    catch(e){
        return false;
    }
}