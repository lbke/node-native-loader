const path = require('path')
const loaderUtils = require('loader-utils')

module.exports = function process(content) {
  if (this.cacheable) {
    this.cacheable()
  }

  const query = loaderUtils.getOptions(this) || {};

  const config = {
    name: "[hash].[ext]",
    // default is the webpack output path
    from: this.options.output.path,
  };

  // query takes precedence over config and options
  Object.keys(query).forEach(function(attr) {
    config[attr] = query[attr];
  });

  let outfile = loaderUtils.interpolateName(this, config.name, {
    context: config.context || this.options.context,
    content,
  })
  outfile = outfile.replace(/[\\/]/g, '_')
  outfile = config.to ? path.join(config.to, outfile) : outfile
  this.emitFile(outfile, content)
  let relativePath = 
      path.relative(config.from, path.resolve(this.options.output.path, outfile))
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
