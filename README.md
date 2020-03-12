# Share Code

Write and share code in realtime

## Install

```bash
$ yarn install
```

### Env files

#### Server

```env
PORT=
SESSION_SECRET=

# Github
GH_CLIENT=
GH_SECRET
```

#### Client

```env
# Github
GH_CLIENT=
GH_SECRET=
```

## Run

### Prod

```bash
$ yarn start
```

### Dev

```bash
$ yarn build:watch

$ yarn server:dev
```

## Features

- [x] Code editor
- [x] Live edit
- [x] Merge on new writer joined in room
- [x] List writers
- [ ] Display writer name
- [ ] Github Login
- [ ] Update users
- [ ] Multi cursors
- [ ] Share button
