import firebase from '../firebase';
import * as constants from '../constants/constants'

let db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export function getMessages(req, res) {
    let data = [];
    db.collection(constants.COLLECTION_CHAT_MESSAGE_ROOM).doc(req.body.room).collection(constants.COLLECTION_CHAT_MESSAGE_MESSAGE).get()
        .then((snapshot) => {
            snapshot.forEach(doc => {
                let mess = doc.data();
                data.push({ message: mess });
            });
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
}
