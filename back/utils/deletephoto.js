const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = ''; //change later
const containerName = 'photos';

const deletePhoto = async (photoUrl) => {
    try{
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/');
    const blobName = pathParts.slice(2).join('/'); // The rest is the blob name

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();
    }
    catch(error){
        throw new Error(error.message);
    }
}