import { abi } from './templates/views/music_index';

Meteor.startup(function() {

    // SET default language
    if(Cookie.get('TAPi18next')) {
        TAPi18n.setLanguage(Cookie.get('TAPi18next'));
    } else {
        var userLang = navigator.language || navigator.userLanguage,
        availLang = TAPi18n.getLanguages();

        // set default language
        if (_.isObject(availLang) && availLang[userLang]) {
            TAPi18n.setLanguage(userLang);
        } else if (_.isObject(availLang) && availLang[userLang.substr(0,2)]) {
            TAPi18n.setLanguage(userLang.substr(0,2));
        } else {
            TAPi18n.setLanguage('en');
        }
    }
    // change moment and numeral language, when language changes
    Tracker.autorun(function(){
        if(_.isString(TAPi18n.getLanguage())) {
            var lang = TAPi18n.getLanguage().substr(0,2);
            moment.locale(lang);
            try {
                numeral.language(lang);
            } catch (err) {
                console.warn('numeral.js couldn\'t set number formating: ', err.message);
            }
            EthTools.setLocale(lang);
        }

        // If on the mainnet, this will add the unicorn token by default, only once.
        if (!localStorage['dapp_hasMusicIndexContract'] && Session.get('network') === 'ropsten'){
            localStorage.setItem('dapp_hasMusicIndexContract', true);

            // wait 5s, to allow the tokens to be loaded from the localstorage first
            Meteor.setTimeout(function(){
                var musicIndexContract = '0x0ea6d6f0561bc1339fe0b7b71f1de21b3c6799ff';
                CustomContracts.upsert(null, {$set: {
                    address: musicIndexContract,
                    name: 'Music Index',
                    jsonInterface: abi
                }});
            }, 5000);
        }
    });


});
