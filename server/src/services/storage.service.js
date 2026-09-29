import ImageKit, { toFile } from '@imagekit/nodejs';
import config from "../config/config.js"

let client

function getClient() {
    if (!client) {
        client = new ImageKit({
            privateKey: config.IMAGEKIT_PRIVATE_KEY
        })
    }

    return client
}



/**
 * @description Uploads a file to ImageKit
 * @param {Object} param0
 * @param {Buffer} param0.buffer - The file buffer to upload
 * @param {string} param0.fileName - The name of the file to upload
 * @returns {Promise<Object>} The response from ImageKit after uploading the file
 */
export async function uploadFile({ buffer, fileName }) {
    const response = await getClient().files.upload({
        file: await toFile(buffer),
        fileName: fileName,
        folder: "snitch"
    })

    return response;
}