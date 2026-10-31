# Added dependency provenance

The follow-up uses packages from the public npm registry with committed lockfile integrity, rather than an unreviewed browser extension or downloaded executable. Preserve each package's installed license/notice when redistributing its code.

| Package             | Use                                                                      | Version | License/source                                                                                                  |
| ------------------- | ------------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------- |
| qrcode              | On-demand local QR in downloaded cards; no external QR service           | 1.5.4   | [MIT](https://github.com/soldair/node-qrcode/blob/master/license)                                               |
| jsqr                | Development-only decoding of the actual generated image                  | 1.4.0   | [Apache2.0](https://github.com/cozmo/jsQR/blob/master/LICENSE)                                                  |
| google-auth-library | Local-only reporting OAuth/refresh; excluded from browser/Worker bundles | 11.3.2  | [Apache2.0](https://github.com/googleapis/google-cloud-node/tree/main/core/packages/google-auth-library-nodejs) |
| lighthouse          | Isolated development lab, not connected to the owner's browser           | 13.5.0  | [Apache2.0](https://github.com/GoogleChrome/lighthouse/blob/main/LICENSE)                                       |

Lighthouse13.6 introduced moderate advisory paths at installation time;13.5 was selected after comparing the actual dependency audit. This is a dated choice, not a claim that a pin never needs review. Check the current lockfile audit before release.
