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
            console.error('[multipartParser] Invalid Content-Type:', contentType);
            reject(new Error('Content-Type must be multipart/form-data'));
            return;
        }

        const boundary = '--' + contentType.split('boundary=')[1];
        const endBoundary = boundary + '--';

        console.log('[multipartParser] Starting multipart parsing');
        console.log('[multipartParser] Boundary:', boundary.substring(0, 50) + '...');

        let data = Buffer.alloc(0);
        let chunkCount = 0;
        const startTime = Date.now();

        // Collect data chunks
        req.on('data', (chunk) => {
            chunkCount++;
            data = Buffer.concat([data, chunk]);
            console.log(`[multipartParser] Received chunk ${chunkCount}, size: ${chunk.length} bytes, total: ${data.length} bytes`);
        });

        req.on('end', () => {
            const duration = Date.now() - startTime;
            console.log(`[multipartParser] All chunks received after ${duration}ms, total: ${data.length} bytes in ${chunkCount} chunks`);

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

                console.log(`[multipartParser] Found ${parts.length} parts in multipart data`);

                const fields = {};
                const files = {};

                // Process each part
                parts.forEach((part, index) => {
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

                        console.log(`[multipartParser] Part ${index + 1}: FILE upload`);
                        console.log(`[multipartParser]   - Field: ${fieldName}`);
                        console.log(`[multipartParser]   - Original filename: ${originalFilename}`);
                        console.log(`[multipartParser]   - Content-Type: ${contentType}`);
                        console.log(`[multipartParser]   - Size: ${content.length} bytes`);

                        // Generate unique filename
                        const timestamp = Date.now();
                        const extension = path.extname(originalFilename);
                        const basename = path.basename(originalFilename, extension);
                        const safeBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
                        const filename = `${safeBasename}_${timestamp}${extension}`;

                        // Save file
                        const filepath = path.join(uploadDir, filename);
                        fs.writeFileSync(filepath, content);

                        console.log(`[multipartParser]   - Saved to: ${filepath}`);

                        files[fieldName] = {
                            originalFilename,
                            filename,
                            filepath,
                            contentType,
                            size: content.length
                        };
                    } else {
                        // This is a regular field
                        const value = content.toString('utf-8');
                        fields[fieldName] = value;

                        console.log(`[multipartParser] Part ${index + 1}: FIELD`);
                        console.log(`[multipartParser]   - Name: ${fieldName}`);
                        console.log(`[multipartParser]   - Value length: ${value.length} chars`);
                    }
                });

                const parseTime = Date.now() - startTime;
                console.log(`[multipartParser] Parsing complete in ${parseTime}ms`);
                console.log(`[multipartParser] Result: ${Object.keys(fields).length} fields, ${Object.keys(files).length} files`);

                resolve({ fields, files });
            } catch (error) {
                console.error('[multipartParser] Parse error:', error.message);
                reject(error);
            }
        });

        req.on('error', (error) => {
            console.error('[multipartParser] Request error:', error.message);
            reject(error);
        });
    });
}

module.exports = {
    parseMultipartForm
};
