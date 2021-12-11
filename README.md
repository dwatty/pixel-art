# Pixel Art

![Screenshot](/readme.png)

A very small app for learning how [Orleans](https://github.com/dotnet/orleans) works.  The idea is that each pixel on the grid represents a grain.  The client builds a grid of 100 grains each with an ID and color.

When a user clicks on a cell in the grid, they can pick a new color which will send a request back to the server and have the grain state updated.  There are a couple of "quick" buttons that will paint a heart or smiley face as well.

Currently, there is no persistance layer on the server side, so stopping and restarting the server will generate clean state of pixels.

## Tech Stack
Current stack for the client and server are as follows:

### Client:
* React
* Typescript
* CSS

### Server
* C#
* Orleans