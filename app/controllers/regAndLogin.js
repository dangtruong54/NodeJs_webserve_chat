import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyDVcjmbh1fSynLufh1ghfpBKtxUGJBBh9k",
    authDomain: "task-manage-with-firebase.firebaseapp.com",
    databaseURL: "https://task-manage-with-firebase.firebaseio.com",
    projectId: "task-manage-with-firebase",

};
firebase.initializeApp(config);

export function reg (req, res) {
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((acc) => {
      res.status(200).json({acc: acc});
    })
    .catch((err) => {
      res.status(400).json({error: err});
    });
}

export function login (req, res) {
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(() => {
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        res.send(idToken);
      }).catch(function(error) {
        res.status(400).json({error: error});
      });
    })
    .catch((err) => {
      res.status(400).json({error: err});
    });
}
