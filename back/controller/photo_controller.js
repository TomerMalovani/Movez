const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = 'Your_Azure_Storage_Connection_String'; //change later
const containerName = 'photos';

const uploadPhoto = async (file) => {
    try{
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);
    return blockBlobClient.url;
    }
    catch(error){
        throw new Error(error.message);
    }
}

const deletePhoto = async (photoUrl) => {
    if(!photoUrl || photoUrl == null || photoUrl == undefined || photoUrl == ''){
        throw new Error('No photo url provided');
    }
    try{
        const blockBlobClient = getBlobClient(photoUrl);
        await blockBlobClient.delete();
    }
    catch(error){
        throw new Error(error.message);
    }
}

const updatePhoto = async (newPhoto, oldPhotoUrl) => {
    let newUrl = '';
    try{
    newUrl = await uploadPhoto(newPhoto);
    await deletePhoto(oldPhotoUrl);
    }
    catch(error){
        throw new Error(error.message);
    }
    finally{
        return newUrl;
    }
}

//probably wont be used.
const getPhoto = async (photoUrl) => {
    const blockBlobClient = getBlobClient(photoUrl);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
  
    return downloaded;
}

function getBlobClient(photoUrl) {
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/');
    const blobName = pathParts.slice(2).join('/'); // The rest is the blob name

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    return blockBlobClient;
}

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }

  module.exports = { uploadPhoto, deletePhoto, updatePhoto, getPhoto };