const upload = require('../configs/multer');
const { Product, File } = require('../models/product');

const handleFileUpload = (uploadType) => {
    return async (req, res, next) => {
        try {
            if (uploadType === 'single') {
                if (!req.file) {
                    return next(new Error('No file uploaded'));
                }

                const { productname, productdesc, price, category } = req.body;
                const productImage=req.file?.filename;

                if (!productname || !productdesc || !price ) {
                    return next(new Error('Missing Required Fields'));
                }

                // Create the product
                const product = await Product.create({
                    productName: productname, // Ensure the column names match
                    productDesc: productdesc,
                    price,
                    category,
                    productImage
                });

                // Create the associated file record
                const file = req.file;
                const createdFile = await File.create({
                    fileName: file.filename,
                    filePath: file.path,
                    fileSize: file.size,
                    productId: product.productId
                });

                return res.status(201).json({
                    message: 'Product and File uploaded successfully!',
                    product,
                    file: createdFile
                });
            }

            if (uploadType === 'multiple') {
                if (!req.files || req.files.length === 0) {
                    return next(new Error('No files uploaded'));
                }

                const { productname, productdesc, price, category } = req.body;
                const productImages=req.files?.map(file => file.filename);

                if (!productname || !productdesc || !price || !category) {
                    return next(new Error('Missing Required Fields'));
                }

                // Create the product
                const product = await Product.create({
                    productName: productname, // Ensure the column names match
                    productDesc: productdesc,
                    price,
                    category,
                    productImage:productImages
                });

                // Handle multiple file uploads
                const files = req.files;
                const createdFiles = [];

                for (const file of files) {
                    if (file) {
                        const createdFile = await File.create({
                            fileName: file.filename,
                            filePath: file.path,
                            fileSize: file.size,
                            productId: product.productId
                        });
                        createdFiles.push(createdFile);
                    }
                }

                return res.status(201).json({
                    message: 'Product and Files uploaded successfully!',
                    product,
                    files: createdFiles
                });
            }

            // Handle invalid upload type
            return next(new Error('Invalid upload type'));
        } catch (error) {
            // Catch unexpected errors
            return next(error);
        }
    };
};

exports.uploadSingleFile = handleFileUpload('single');
exports.uploadMultipleFile = handleFileUpload('multiple');

