import NB from 'nodebrainz';

import { ReactiveVar } from 'meteor/reactive-var';

const nb = new NB({userAgent: 'eth-music/0.0.1 ( http://github.com/pingiun/eth-music )'});

abi = [ { "constant": false, "inputs": [ { "name": "uuid", "type": "uint128" }, { "name": "index", "type": "uint128" }, { "name": "voteType", "type": "uint8" } ], "name": "addVote", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "withdraw", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newPayoutPrice", "type": "uint256" } ], "name": "updatePayoutPrice", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newVotePrice", "type": "uint256" } ], "name": "updateVotePrice", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "uuid", "type": "uint128" } ], "name": "getLength", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "uuid", "type": "uint128" } ], "name": "getBest", "outputs": [ { "name": "", "type": "bytes", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x96ada2b73e5e7346164966b3108fd1e78848cfa1" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "uuid", "type": "uint128" }, { "name": "index", "type": "uint256" } ], "name": "getByIndex", "outputs": [ { "name": "", "type": "bytes" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newPayoutKarma", "type": "int256" } ], "name": "updatePayoutKarma", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newUpvoteValue", "type": "int256" }, { "name": "newDownvoteValue", "type": "int256" }, { "name": "newInvalidValue", "type": "int256" } ], "name": "updateVoteValues", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "uuid", "type": "uint128" }, { "name": "uri", "type": "bytes" } ], "name": "addConnection", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "upvoteValue", "type": "int256", "index": 0, "typeShort": "int", "bits": "256", "displayName": "upvote Value", "template": "elements_input_int", "value": "1" }, { "name": "downvoteValue", "type": "int256", "index": 1, "typeShort": "int", "bits": "256", "displayName": "downvote Value", "template": "elements_input_int", "value": "-1" }, { "name": "invalidValue", "type": "int256", "index": 2, "typeShort": "int", "bits": "256", "displayName": "invalid Value", "template": "elements_input_int", "value": "-2" }, { "name": "initVotePrice", "type": "uint256", "index": 3, "typeShort": "uint", "bits": "256", "displayName": "init Vote Price", "template": "elements_input_uint", "value": "1000000000000000000" }, { "name": "initPayoutPrice", "type": "uint256", "index": 4, "typeShort": "uint", "bits": "256", "displayName": "init Payout Price", "template": "elements_input_uint", "value": "5000000000000000000" }, { "name": "initPayoutKarma", "type": "int256", "index": 5, "typeShort": "int", "bits": "256", "displayName": "init Payout Karma", "template": "elements_input_int", "value": "10" } ], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "uuid", "type": "uint128" }, { "indexed": false, "name": "uri", "type": "bytes" } ], "name": "LogConnection", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "uuid", "type": "uint128" }, { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "voteType", "type": "uint8" } ], "name": "LogVote", "type": "event" } ];

MusicIndex = web3.eth.contract(abi);

contractInstance = MusicIndex.at("0x0ea6D6f0561Bc1339Fe0b7B71F1DE21b3C6799FF");

Template['views_music_index'].onCreated(function bodyOnCreated() {
  this.results = new ReactiveArray();
  this.connections = new ReactiveVar({});
});

Template['views_music_index'].helpers({
  results() {
    return Template.instance().results.get();
  },
  amountOfURIs(uuid) {
    let instance = Template.instance();
    let newC = instance.connections.get();
    uuid = "0x" + uuid.replace(/\-/g, '');
    if (Template.instance().connections.get()[uuid] === undefined) {
        contractInstance.getLength(uuid, (err, length) => {
            newC[uuid] = {amount: length};
            instance.connections.set(newC);
        });
        return "...";
    }
    return Template.instance().connections.get()[uuid].amount;
  }
});

Template['views_music_index'].events({
  'submit .search'(event, instance) {
    event.preventDefault();
    const text = event.target.text.value;

    nb.search('recording', {recording: text}, function(err, response) {
        console.log(response);
        response.recordings.sort(function(a, b) {
            if (b.releases === undefined) {
                return 1;
            }
            if (a.releases === undefined) {
                return -1;
            }
            return b.releases.length - a.releases.length;
            });
        console.log(response.recordings);
        instance.results.set(response.recordings);
    })
  }
});
