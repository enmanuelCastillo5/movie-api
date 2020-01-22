const { config } = require('../config')

function cacheResponse(request, seconds) {
    if (!config.dev) {
        request.set("Cache-Control", `public, max-age=${seconds}`);

    }
}

module.exports = cacheResponse