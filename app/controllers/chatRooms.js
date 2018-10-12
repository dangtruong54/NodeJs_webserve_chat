import firebase from '../firebase';
import * as constants from '../constants/constants'
let database = firebase.database();
let availableRooms = database.ref(constants.REALTIME_HREF_AVAILABLE_ROOMS);

export function getAvailableRooms(req, res) {
    availableRooms.on('value', (snapshot) => {
        res.status(200).json({ availableRooms: snapshot.val() });
    }, (error) => {
        res.status(400).json({ error: error });
    });
}

export function requestJoinRoom(req, res) {
    availableRooms.on('value', (snapshot) => {
        // if (snapshot.val().includes(req.body.room) === false) {
        //     res.status(400).json({ error: req.body.room + constants.NOTICE_UNAVALIABLE_ROOM });
        // } else {
        //     res.status(200).json({ notice: constants.NOTICE_JOIN_SUCCESS_ROOM });
        // }
        if (snapshot.val().hasOwnProperty(req.body.room) === false) {
            res.status(400).json({ error: req.body.room + constants.NOTICE_UNAVALIABLE_ROOM });
        } else {
            res.status(200).json({ notice: constants.NOTICE_JOIN_SUCCESS_ROOM });
        }
    }, (error) => {
        res.status(400).json({ error: error });
    });
}
