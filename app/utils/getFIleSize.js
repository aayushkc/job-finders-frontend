export const getFileSize = (fileSize) =>{
    //The given filesize is divded by 1024 and rounded off
    //Returned value is then compared with Mb representation in bytes
    return Math.round((fileSize / 1024))
}