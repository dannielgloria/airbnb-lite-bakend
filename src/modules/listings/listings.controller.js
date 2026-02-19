const multer = require('multer');
const { cloudinary } = require('../../config/cloudinary');
const ApiError = require('../../utils/ApiError');
const listingsService = require('./listings.service');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { files: 5, fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
        cb(allowedTypes ? null : new ApiError(400, 'Invalid file type'), allowedTypes); 
    }
});

const uploadMiddleware = upload.array('photos', 5);

const uploadBufferToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'airbnb-lite/listings' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

const create = async (req, res) => {
    const listing = await listingsService.createListing(req.user.sub, req.body);
    res.status(201).json(listing);
}

const list = async (req, res) => {
    const data = await listingsService.getListings(req.query);
    res.json(data);
}

const getById = async (req, res) => {
    const listing = await listingsService.getListingById(req.params.id);
    res.json(listing);
}

const update = async (req, res) => {
    const listing = await listingsService.updateListing(req.user.sub, req.params.id, req.body);
    res.json(listing);
}

const remove = async (req, res) => {
    await listingsService.deleteListing(req.user.sub, req.params.id);
    res.status(204).send();
}

const uploadPhotos = async (req, res) => {
    if (!req.files || req.files.length === 0) throw new ApiError(400, "No photos uploaded");

    const uploads = await Promise.all(
        req.files.map(async (f) => {
            const result = await uploadBufferToCloudinary(f.buffer);
            return { url: result.secure_url, publicId: result.public_id };
        })
    );

    const listing = await listingsService.addPhoto(req.user.sub, req.params.id, uploads);
    res.json(listing);
}

module.exports = {
    uploadMiddleware,
    create,
    list,
    getById,
    update,
    remove,
    uploadPhotos,
}