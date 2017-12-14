'use strict';

const _ = require('underscore');
const uuidv4 = require('uuid/v4');
const skipperBetterS3 = require('skipper-better-s3');

function validType(type, extension) {
    var acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    var acceptedExtensions = ['jpeg', 'jpg', 'png'];
    return (_.contains(acceptedTypes, type) && _.contains(acceptedExtensions, extension))
}

module.exports = {
    // Call this function before using any of the function
    init: function (config) {
        this.config = _.pick(config, 'key', 'secret', 'region', 'bucket');
        this.uploadPath = config.uploadPath;
        this.adapter = skipperBetterS3(this.config);
    },
	/**
     * generate signed url to view/download file
     * @param  {string} file file path on AWS-S3 including filename
     * @return return signed url, expiry 15min
     */
    url: function (file) {
        return this.adapter.url('getObject', { s3params: { Key: file } });
    },
    /**
	 * Get url to upload file on AWS
	 * @param {string} path file path on AWS-S3 excluding filename
	 * @param {object} file and object with keys { name: string, size: number, type: string }
	 */
    preUrl: function (path, file) {
        const fileName = file.name.split('.');
        const extension = fileName.pop();
        const contentType = file.type;

        if (!contentType || !extension || !validType(contentType, extension)) {
            return false;
        }

        const name = uuidv4() + "." + extension;
        const url = this.adapter.url('putObject', {
            s3params: {
                Key: path + '/' + name,
                ContentType: contentType
            }
        });
        return { name, url };
    }
};
