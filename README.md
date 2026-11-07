# Pixel Demo Board

A local, browser-based demo controller for 32 × 32 iDotMatrix Bluetooth LED displays. Built and tested on the screen of an Enventor Pixel mini fridge.

**30 demos across five categories**, a live preview, keyboard shortcuts, GIF downloads, and direct Bluetooth pixel playback. No account, cloud service, microphone, package installation, or build step is required.

## Open the board

Download **Pixel Demo Board.html** and open it in Google Chrome or Microsoft Edge. It is a self-contained file; keep it open while playing demos. Browser and platform support for Web Bluetooth varies.

Alternatively, with Node.js installed:

```sh
node server.cjs
```

Then open http://127.0.0.1:17432 in Chrome or Edge. Stop the server with Ctrl+C.

## Connect a display

1. Disconnect the Android/iOS iDotMatrix app and any other controller from the display.
2. Click **Connect display** and select your device in the browser's Bluetooth picker.
3. Choose a demo. The selected demo starts playing at **75% brightness** by default.

The picker allows all device names because some compatible displays advertise names such as `32*32J-…` rather than `IDM-…`. Only select a display you own or are authorized to control. The controller expects service `000000fa-0000-1000-8000-00805f9b34fb` and write characteristic `0000fa02-0000-1000-8000-00805f9b34fb`.

Direct pixel playback is the working default. Native GIF upload is experimental and did not render reliably on the tested fridge. Downloading a GIF is separate from uploading one to the device.

## Library and shortcuts

| Category | Demos | Keys |
| --- | --- | --- |
| Faces | Curious, Happy, Suspicious, Angry, Sleepy, Shocked, In Love, Brain Freeze | 1–8 |
| Arcade | Midnight Maze, Barrel Rescue, Block Drop, Asteroid Patrol, Alien Defense, Neon Rally, Doom Patrol | Q W E R T Y U |
| Playground | Pocket Fireworks, Warp Drive, Lava Lamp, Bouncing Logo, Ryan Mercer name card | A S D F G |
| Screen Savers | 3D Pipes, Flying Windows, Starfield, Mystify, 3D Maze | Z X C V B |
| Tiny Worlds | Desktop Aquarium, Campfire Night, Rainy Window, Rocket Launch, Midnight Express | H J K L N |

Keep the page focused for shortcuts. Space pauses/resumes when focus is on the page rather than a button. Click **Restart** to replay the selected demo. Maze and Barrel Rescue play once unless their loop option is checked; other animated demos loop. Ryan Mercer is a static name card.

The game and Windows-era scenes are original small pixel animations inspired by familiar classics. They do not run the original games or screensaver programs and are not affiliated with their publishers.

## Troubleshooting

- **Nothing in the Bluetooth picker:** close other controllers, confirm Bluetooth is on, move closer, and power-cycle the display.
- **Screen black:** select Direct pixels under Connection options, then try **Test red square**. Select a demo afterward to resume playback.
- **Transfer errors:** try a smaller chunk size. The default is 180 bytes; a 20-byte fallback is available.
- **Animation pauses in the background:** keep the controller tab active. Browsers may throttle background tabs; playback speed also depends on Bluetooth throughput.
- **Page unavailable on localhost:** start `node server.cjs`, or use the self-contained HTML file instead.

## Development

Edit `index.html` for layout and `puppet.js` for demos and Bluetooth transport. Demos use an eight-color palette and send changed pixels in serialized packets, capped at 120 coordinates per command. The preview and live scheduler target four frames per second.

Run the dependency-free checks with Node.js:

```sh
node --check puppet.js
node tests/pixels.cjs
node tests/controller.cjs
```

Checks reconstruct frames from the generated pixel packets and exercise categories, hotkeys, looping, and playback controls with a simulated DOM. These checks do not replace hardware verification.

After editing, rebuild the standalone file:

```sh
node build.cjs
```

## Credits

The iDotMatrix packet format and Bluetooth service identifiers were adapted from [iDotMatrix Web](https://github.com/udivankin/idotmatrix-web), licensed under MIT. Its copyright and license are retained in `THIRD_PARTY_NOTICES.md`.
