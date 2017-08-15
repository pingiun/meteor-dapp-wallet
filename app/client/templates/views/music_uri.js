import { ReactiveDict } from 'meteor/reactive-dict';

Template['views_music_uri'].onCreated(function () {
    self = this;
    var uuid = "0x" + FlowRouter.getParam('uuid').replace(/\-/g, '');
    this.state = new ReactiveDict('state');
    contractInstance.getBest(uuid, (err, result) => {
        var uri = web3.toAscii(result);
        var groups = /https:\/\/(?:www.)?(?:youtu.be\/|youtube.com\/watch\?v=)([A-Za-z0-9\-]+)/.exec(uri);
        if (groups) {
            self.state.set('youtubeId', groups[1]);
            return;
        }
        var groups = /(magnet:\?(?:[a-z]+=[a-z:0-9%.+\-A-Z]+&?)+)\/(.*)/.exec(uri);
        if (groups) {
            console.log("Magnet link detected");
            self.state.set('magnetLink', groups[1]);
            self.state.set('filename', decodeURIComponent(groups[2]));
            return;
        }
        self.state.set('uri', uri);
    });
});

Template['views_music_uri'].helpers({
    youtubeId() {
        return Template.instance().state.get('youtubeId');
    },
    uri() {
        return Template.instance().state.get('uri');
    },
    magnetLink() {
        return Template.instance().state.get('magnetLink');
    },
    filename() {
        return Template.instance().state.get('filename');
    }
});
