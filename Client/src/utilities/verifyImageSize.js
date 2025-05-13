export const verifySize = (file, size) => {
    const sizeInBytes = file.size;
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;

    const result = sizeInMB < size ? true : false;

    return result;

}
