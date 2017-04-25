//Client main.js
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import fbgraph from 'fbgraph';
import './main.html';

Meteor.absoluteUrl.defaultOptions.rootUrl = 'https://cec-marcosfelt.c9users.io:8080'

//Server login event
Template.login.events({
    'click .login-facebook': function(e) {
        e.preventDefault();

        Meteor.loginWithFacebook({
          requestPermissions: [
            'public_profile', 
            'user_friends', 
            'user_about_me'],
          loginStyle: 'popup',
          redirectUrl:'https://cec-marcosfelt.c9users.io:8080'
        }, 
        function(err){
            if (err) {
                console.log('Handle errors here: ', err);
            }
        });
    }
});


// Add friends to database everytime someone logs in
Tracker.autorun(gefriends =>{
    if (this.userID()){
        // Set access token
        const id = this.userID();
        const user = Meteor.users.findOne(id);
        const fbAccessToken = user.services.facebook.accessToken;
        graph.setaccesstoken(fbAccessToken)
        
        //Get facebook friends and insert to friends collections
        var options = {
          timeout:  3000
          , pool:     { maxSockets:  Infinity }
          , headers:  { connection:  "keep-alive" }
        };
        graph
          .setOptions(options)
          .get("me/friends", function(err, res) {
              if (res.statuscode == 200) {
                  for (var i=0; i<res.data.res.length; i++) {
                      Friends.insert(res.data.res[i])
                  }
              }
              else
                console.log(res); // if error, log to console
          });
    }
});
//Searching setup
Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'friends', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});

// Searching helpers
Template.search.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  friends() {
    let friends = Friends.find();
    if ( friends ) {
      return friends;
    }
  }
});

//Searching events
