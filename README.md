# Boarding Pass Reader

[![Stars](https://img.shields.io/github/stars/jqssun/iata-web)](https://github.com/jqssun/iata-web/stargazers)
[![license](https://img.shields.io/badge/License-GPLv3-green.svg)](https://github.com/jqssun/iata-web/blob/main/LICENSE)

A FOSS web application hosted at [jqs.app/iata](https://jqs.app/iata) for reading and creating IATA Bar Coded Boarding Pass (BCBP) data, compliant with the most up-to-date version of [IATA Resolution 792](https://www.iata.org/en/programs/passenger/common-use/). This service uses [this API backend](https://github.com/jqssun/iata-api).

Scan, upload, or paste boarding pass barcodes to decode passenger, flight, and baggage details. Alternatively, create new BCBP barcodes from scratch and add them to Apple Wallet or Google Wallet.

<img alt="Read BCBP" src="https://github.com/user-attachments/assets/81775c95-f31a-4caa-9c10-75f4cdae2a82" />

Use this service to:
- check your personal information stored on a boarding pass, including passenger name, status and description, and frequent flyer details
- view your flight booking details, including your booking reference, compartment, seat number, and discount indicator
- view your checked baggage details if applicable, including check-in sequence number, tag number and allowance, and fast track status
- view or share boarding pass data in an alternative matrix barcode format for instant access and backup


## Usage

### Requirements

- [Python API backend](https://github.com/jqssun/iata-api)
- [Node.js](https://nodejs.org/) + [pnpm](https://pnpm.io/)

```bash
cp .env.example .env
pnpm i; pnpm run dev
```

### Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/decode` | POST | Decode a BCBP string into human-readable data |
| `/api/encode` | POST | Encode human-readable data into a BCBP string |
| `/api/pkpass` | POST | Create a mobile wallet `.pkpass` file from boarding pass data |

## Attribution

Additional assets from these following third parties may be used under their respective licenses but not included in the source code. This project is not affiliated with any of the third parties.

- [GOV.UK Design System](https://github.com/alphagov/govuk-frontend)
- [Apple Wallet badge](https://developer.apple.com/wallet/add-to-apple-wallet-guidelines/): `public/assets/images/US-UK_Add_to_Apple_Wallet_RGB_101421.svg`
- [Google Wallet badge](https://developers.google.com/wallet/generic/resources/brand-guidelines): `public/assets/images/enUS_add_to_google_wallet_add-wallet-badge.svg`
- [Transport New font](https://www.k-type.com/fonts/transport-new/): `public/assets/fonts/TransportNew-{Light,Heavy}.otf`
