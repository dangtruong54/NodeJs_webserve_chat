import firebase from '../firebase';

export default (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'No headers!' });
    } else {
        firebase.auth().verifyIdToken(req.headers.authorization.replace(/\bBearer+\s/, ''))
            .then((decodedToken) => {
                // console.log('Uid: ' + decodedToken.uid);
                req.uid = decodedToken.uid;
                return next();
            })
            .catch((err) => {
                res.status(401).json({ error: err });
            });
    }
};
