const { httpStatus } = require("../../constants");
const { AuthorizationError } = require("../common/customError");
const config = require("../config");
const { getHashChecksum, getHmacChecksum } = require("../utils/signatureUtils");

const verifyPlatformChecksum = (req, res, next) => {
    const request_payload = req.body;
    const checksum = getHmacChecksum(JSON.stringify(request_payload), config.extension.platform_api_salt);
    if (checksum !== req.headers.checksum)
        throw new AuthorizationError("Invalid Checksum");
    next();
};

const verifyFrontendChecksum = (req, res, next) => {
    const checksum = getHashChecksum(
        config.extension.api_secret + "|" + req.params._id, config.extension.platform_api_salt
    );
    if (checksum !== req.headers.checksum) 
        throw new AuthorizationError("Invalid Checksum");
    next();
}

const verifyExtensionAuth = (req, res, next) => {
    const basic_auth = ''
    const basicAuthHeader = "Basic " + btoa(basic_auth);
    if (basicAuthHeader !== req.headers.authorization)
        throw new AuthorizationError("Authorization failed");
    next();
}

module.exports = {
    verifyPlatformChecksum,
    verifyPGChecksum,
    verifyFrontendChecksum,
    verifyExtensionAuth
};
