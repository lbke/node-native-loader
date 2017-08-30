# node-native-loader

A webpack loader for node native modules (.node/C++ binaries).

## What it does

This loader moves all relevant files (generally, `.node` files) to the output path, then uses
relative paths to load them, so that they can be loaded in a consistent location across different
builds of an app (development vs packaged, etc.).

It is similar to [node-relative-loader](https://www.npmjs.com/package/node-relative-loader), but
has a number of problematic options removed, and works consistently on Windows (whereas the
aforementioned module often generates non-working require statements).

## Differences with [tec27/note-native-loader](https://github.com/tec27/node-native-loader)

### Webpack 2
This is a webpack 2 loader, so you can't define a `nodeNativeLoader` key in the webpack config anymore.
Instead, you can directly pass an `options` object in the loader definition:

```javascript
const config = {
  // ...
  module: {
    loaders: {
      // ...
      {
        test: /\.node$/,
        loader: 'node-native',
        options:{
          from: 'app',
          to: './natives',
        }
      },
    }
  }
}
```

**Note that you can't override `output.path` options, in order to avoid inconsistencies.**
Use `from` and `to` options instead if you want the native modules to be put elsewhere.

### `from` defaults to output dir

`config.from` now defaults to the webpack output path.
This way the loader works as expected even when `from` is absent.

### New option `to`

The `to` options is a relative to the webpack output path.
It allow to put the `.node` files in a specific, separate folder.

**NOTE: `from` is relative **to your webpack config**, in order to be consistent with
the [tec27/note-native-loader](https://github.com/tec27/node-native-loader),
 whereas `to` is relative to the **output.path** option.

```javascript
const config = {
  // ...
  output:{
    path: path.join(__dirname, 'app'),
  },
  module: {
    loaders: {
      // ...
      {
        test: /\.node$/,
        loader: 'node-native',
        options:{
          // .node files will be put in ${output.path}/natives folder
          to: './natives',
        }
      },
    }
  }
}
```

## Usage

```javascript
// In your webpack config
// For an application that outputs files to ./app/dist, and starts from ./app/index:
const config = {
  // ...
  module: {
    loaders: {
      // ...
      {
        test: /\.node$/,
        // `from` is where paths will be made relative to
        loader: 'node-native?from=app',
      },
    }
  }
}
```

## A note on webpack-dev-server

If you're using `webpack-dev-server` (or `webpack-dev-middleware`), you probably also want to add
[write-file-webpack-plugin](https://www.npmjs.com/package/write-file-webpack-plugin) to your
configuration for all `.node` files, so that they still get written to the filesystem and can be
required consistently.

## License

MIT
