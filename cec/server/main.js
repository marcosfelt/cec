//Server main.js
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import { ServiceConfiguration } from 'meteor/service-configuration';
import fbgraph from 'fbgraph';

//Meteor.absoluteUrl([{rootUrl: 'facebook.com'}]);


//Absolute URL to app
//Meteor.absoluteUrl([{rootUrl: 'https://cec-marcosfelt.c9users.io:8080'}]);
//Meteor.absoluteUrl.defaultOptions.rootUrl = 'https://cec-marcosfelt.c9users.io:'

var app_id = process.env.APP_ID
var secret = process.env.SECRET

//Facebook App Configuration info
ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: app_id,
    secret: secret
});


//Create friends collection and pre-index
export const Friends = new Mongo.Collection( 'friends' );
Friends._ensureIndex( { name: 1, id: 1 } );

//Add account from Facebook Login
Accounts.onCreateUser(function (options, user) {

    if (!user.services.facebook) {
        return user;
    }
    user.username = user.services.facebook.name;
    return user;
    
});


Meteor.startup(() => {
  // code to run on server at startup
});
