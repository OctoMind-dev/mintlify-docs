# Mintlify Starter Kit

Click on `Use this template` to copy the Mintlify starter kit. The starter kit contains examples including

- Guide pages
- Navigation
- Customizations
- API Reference pages
- Use of popular components

### Contributing

- screenshots can be done on Mac via Ctrl+Shift+4+Spacebar and selecting the right window
- to have the app appear as in the existing screenshots, you can install/ run our app as a PWA: in Chrome there is an icon for this within the URL bar on the right ("install Octomind"/ launch from same place)
- for simple highlighting such as boxes and arrows, you can use MacOS Preview -> Markup tools
- to update the [feature drops](https://octomind.dev/docs/changelog), take a look at the past [releases](https://github.com/OctoMind-dev/automagically/releases)

### 👩‍💻 Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where mint.json is)

```
mintlify dev
```

### Linting

install pnpm once

```shell
npm i -g pnpm
pnpm i
```

execute `pnpm lint`. _Note_ for pull requests we require that all linting errors have been resolved

### 😎 Publishing Changes

Changes will be deployed to production automatically after pushing to the default branch.

You can also preview changes using PRs, which generates a preview link of the docs.

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`
