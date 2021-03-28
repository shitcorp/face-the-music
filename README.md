# Face The Music

> An overkill Discord bot

## Development

### Setting up enviroment

Run:

```bash
yarn
```

(Note you must have yarn installed via npm)

## Infrastructure

### Carmen

It is the traditional bot application, and the main interaction point for the end user. It is built using eris-fleet to provide effortless sharding across mulitple cores.

### Canto

The api application. It serves as a central shared service providing a wide range of services to each applicaiton.

### Logging

A package containing a preconfigured winston logger with many quality of life changes.

### Types

Central package containing many shared types across applications.
