const path = require('path')
const loaderUtils = require('loader-utils')

module.exports = function process(content) {
  if (this.cacheable) {
    this.cacheable()
  }

  // default config
  const config = {
    name: "[hash].[ext]",
    nativePath: '.'
  };

  const query = loaderUtils.getOptions(this) || {};

  // query takes precedence over config and options
  Object.keys(query).forEach(function (attr) {
    config[attr] = query[attr];
  });

  let outfile = loaderUtils.interpolateName(this, config.name, {
    context: config.context || this.rootContext,
    content,
  })
  outfile = outfile.replace(/[\\/]/g, '_')
  // must be a relative path
  outfile = config.nativePath ? path.relative(this.rootContext, path.join(config.outputPath, config.nativePath, outfile)) : outfile
  this.emitFile(outfile, content)
  let relativePath =
    path.relative(config.outputPath, outfile)
  if (path.sep !== '/') {
    // require always uses posix separators
    relativePath = relativePath.replace('\\', '/')
  }
  if (relativePath[0] !== '.') {
    // Node needs all relative paths to start with a '.'
    relativePath = './' + relativePath
  }
  const modulePath = JSON.stringify(relativePath)
  return 'module.exports = __non_webpack_require__(' + modulePath + ')'
}
module.exports.raw = true
