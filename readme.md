# jade-to-handlebars

Convert jade templates to their corresponding handlebars version.

## Install

```shell
npm install -g jade-to-handlebars
```

## Usage

```
Usage: jade-to-handlebars [path...]

Options:
  -h, --help               output usage information
  -V, --version            output the version number
  -o, --out <destination>  destination folder (defaults to current directory)
```

`*.jade` files specified at path argument will be transformed to `*.hbs` files.

## Examples
Transform all `*.jade` files in current directory to `*.hbs` files at the same directory.
```
$ jade-to-handlebars
```
---
Transform all `*.jade` files in current directory to `*.hbs` files at directory `./hbs-templates`.
```
$ jade-to-handlebars -o ./hbs-templates
```
---
Transform `./jade-templates/index.jade` file to `*.hbs` file at directory `./hbs-templates`.
```
$ jade-to-handlebars -o ./hbs-templates ./jade-templates/index.jade
```
---
Transform all `*.jade` files of `./jade-templates` directory to `*.hbs` files at the same directory.
```
$ jade-to-handlebars ./jade-templates
```
---
Transform multiple `*.jade` files to `*.hbs` files at directory `./hbs-templates`.
```
$ jade-to-handlebars -o ./hbs-templates ./jade-templates ./other/about.jade ./another/some-file.jade
```
---
For features that can't be translated from jade to handlebars a comment will be inserted, for example `<!-- TODO: Fix unsupported jade mixin -->`.
