/**
 * Multipart Form Data Parser
 * 
 * Manual implementation untuk parse multipart/form-data dan file upload
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse multipart/form-data request
 * 
 * @param {Object} req - Request object
 * @param {string} uploadDir - Directory untuk save uploaded files
 * @returns {Promise<Object>} { fields: {}, files: {} }
 */
function parseMultipartForm(req, uploadDir = './images') {
    return new Promise((resolve, reject) => {
        // Get content type and boundary
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('multipart/form-data')) {
            reject(new Error('Content-Type must be multipart/form-data'));
            return;
        }

        const boundary = '--' + contentType.split('boundary=')[1];
        const endBoundary = boundary + '--';

        let data = Buffer.alloc(0);

        // Collect data chunks
        req.on('data', (chunk) => {
            data = Buffer.concat([data, chunk]);
        });

        req.on('end', () => {
            try {
                const parts = [];
                let currentIndex = 0;

                // Split by boundary
                while (currentIndex < data.length) {
                    const boundaryIndex = data.indexOf(boundary, currentIndex);
                    if (boundaryIndex === -1) break;

                    const nextBoundaryIndex = data.indexOf(boundary, boundaryIndex + boundary.length);
                    if (nextBoundaryIndex === -1) break;

                    const part = data.slice(boundaryIndex + boundary.length, nextBoundaryIndex);
                    parts.push(part);

                    currentIndex = nextBoundaryIndex;
                }

                const fields = {};
                const files = {};

                // Process each part
                parts.forEach(part => {
                    if (part.length < 4) return;

                    // Find empty line (separates headers from content)
                    const emptyLineIndex = part.indexOf('\r\n\r\n');
                    if (emptyLineIndex === -1) return;

                    const headers = part.slice(0, emptyLineIndex).toString();
                    const content = part.slice(emptyLineIndex + 4, part.length - 2); // -2 to remove trailing \r\n

                    // Parse Content-Disposition header
                    const nameMatch = headers.match(/name="([^"]+)"/);
                    if (!nameMatch) return;

                    const fieldName = nameMatch[1];
                    const filenameMatch = headers.match(/filename="([^"]+)"/);

                    if (filenameMatch) {
                        // This is a file
                        const originalFilename = filenameMatch[1];
                        const contentTypeMatch = headers.match(/Content-Type: (.+)/);
                        const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';

                        // Generate unique filename
                        const timestamp = Date.now();
                        const extension = path.extname(originalFilename);
                        const basename = path.basename(originalFilename, extension);
                        const safeBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
                        const filename = `${safeBasename}_${timestamp}${extension}`;

                        // Save file
                        const filepath = path.join(uploadDir, filename);
                        fs.writeFileSync(filepath, content);

                        files[fieldName] = {
                            originalFilename,
                            filename,
                            filepath,
                            contentType,
                            size: content.length
                        };
                    } else {
                        // This is a regular field
                        fields[fieldName] = content.toString('utf-8');
                    }
                });

                resolve({ fields, files });
            } catch (error) {
                reject(error);
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = {
    parseMultipartForm
};
