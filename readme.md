# jade-to-handlebars

Convert jade templates to their corresponding handlebars version.

## Install

```shell
npm install jade-to-handlebars
```

## Usage

```
jade-to-handlebars
```

All `*.jade` files in the current directory will be transformed to `*.hbs`-files.

For features that can't be translated from jade to handlebars a comment will be inserted, for example `<!-- TODO: Fix unsupported jade mixin -->`.
