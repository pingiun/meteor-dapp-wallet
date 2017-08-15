# Music Index Ðapp

Music Index runs on the ethereum test network. It is an index which connects [musicbrainz](https://musicbrainz.org) uuids with arbitrary URIs. For now the app can only understand YouTube urls (with an embedded player). Other URIs are just shown to the user.

Music Index has a voting system which makes sure connection submitters are rewarded for good submissions and enables sorting the connection submissions based on quality. The Ðapp currently only shows the top submission.

Casting votes or adding connections is currently only supported through the contract page. As this Ðapp is a fork of the ethereum wallet, the contract page can be found on the 'contracts' tab.

## Running
1. Install [meteor](https://www.meteor.com/install).
2. Clone this repo: `git clone https://github.com/pingiun/meteor-dapp-wallet.git`
3. Run the meteor app: `cd meteor-dapp-wallet/app && meteor`

Either install [MetaMask](https://metamask.io/) for Google Chrome (this is the easiest) or use the mist browser and go to http://localhost:3000.
Make sure to select the Ropsten (test network) in mist or metamask.
