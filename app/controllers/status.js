import firebase from '../firebase';
import * as constants from '../constants/constants'

let db = firebase.firestore();

export function postStatus(req, res) {
    const data = {
        caption: req.body.caption,
        user_id: req.body.user_id,
        time_up: Date.now()
    }
    db.collection(constants.COLLECTION_STATUS_CAPTION).add(data)
        .then(ref => {
            res.status(200).json({ 'status_id': ref.id })
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
}

export function getStatus(req, res) {
    db.collection(constants.COLLECTION_STATUS_CAPTION).doc(req.params.id).get()
        .then(doc => {
            if (!doc.exists) {
                res.status(400).json({ notice: constants.NOTICE_STATUS_ID_NOT_FOUND });
            } else {
                res.status(200).json(doc.data());
            }
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        })
}

export function postComment(req, res) {
    const data = {
        comment: req.body.comment,
        user_id: req.body.user_id,
        time_up: Date.now()
    }
    db.collection(constants.COLLECTION_STATUS_CAPTION).doc(req.body.status_id).collection(constants.COLLECTION_STATUS_COMMENT).add(data)
        .then(ref => {
            res.status(200).json({ 'comment_id': ref.id })
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        })
}