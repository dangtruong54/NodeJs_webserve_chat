import firebase from '../firebase';

let db = firebase.firestore();

async function buyMoney (req, res) {
  let uid = req.uid;
  try {
    let currentAsset = await getAsset(uid);
    let result = await addMoney(req, currentAsset);
    res.send(result);
  }
  catch (err) {
    res.send(err);
  }
}

async function buyGift (req, res) {
  let uid = req.uid;
  try {
    let currentAsset = await getAsset(uid);
    let giftId = await addGift(req, currentAsset);
    let result = await giftUpdateUserAsset(req, currentAsset, giftId);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
}

async function sendGift (req, res) {
  let uid = req.uid;
  try {
    let sender = await getAsset(uid);
    await send(req, sender);
    let reciver = await getAsset(req.body.reciver);
    let recived = await recive(req, reciver);
    res.send(recived);
  } catch (err) {
    res.send(err);
  }
}

// Get user 's asset
function getAsset (uid) {
  return new Promise ((resolve, reject) => {
    db.collection('user-asset').doc(uid).get()
      .then(snapshot => {
        let userAsset = snapshot.data();
        resolve(userAsset);
      })
      .catch(err => {
        reject(err);
      });
  });
}

//
// Helper buyMoney
//
function addMoney (req, asset) {
  return new Promise ((resolve, reject) => {
    if (!asset.money) {
      db.collection('user-asset').doc(req.uid).update({
        money: req.body.receipt.money
      })
        .then(() => {
          resolve({money: req.body.receipt.money});
        })
        .catch(err => {
          reject(err);
        });
    } else {
      let money = asset.money + req.body.receipt.money;
      db.collection('user-asset').doc(req.uid).update({
        money: money
      })
        .then(() => {
          resolve({money: money});
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

//
// Helper buyGift
//
function addGift (req, asset) {
  return new Promise ((resolve, reject) => {
    let currentMoney = asset.money;
    let totalPrice = req.body.price * req.body.quantity;
    let giftId = [];
    if (currentMoney < totalPrice) {
      reject('Not enough money');
    } else {
      for (let i = 0; i < req.body.quantity; i++) {
        db.collection('gift').add({buyer: req.uid, name: req.body.name, purchasedAt: new Date(Date.now())})
          .then(ref => {
            giftId.push(ref.id);
            if (giftId.length == req.body.quantity) {
              resolve(giftId);
            }
          })
          .catch(err => {
            reject(err);
          });
      }
    }
  });
}

function giftUpdateUserAsset (req, asset, gift) {
  return new Promise ((resolve, reject) => {
    if (!asset.gift || asset.gift.length == 0) {
      db.collection('user-asset').doc(req.uid).update({
        money: asset.money - req.body.price * req.body.quantity,
        gift: gift
      })
        .then(() => {
          resolve({
            money: asset.money - req.body.price * req.body.quantity,
            gift: gift
          });
        })
        .catch (err => {
          reject(err);
        });
    } else {
      db.collection('user-asset').doc(req.uid).update({
        money: asset.money - req.body.price * req.body.quantity,
        gift: asset.gift.concat(gift)
      })
        .then(() => {
          resolve({
            money: asset.money - req.body.price * req.body.quantity,
            gift: asset.gift.concat(gift)
          });
        })
        .catch (err => {
          reject(err);
        });
    }
  });
}

//
// Helper sendGift
//
function send (req, asset) {
  return new Promise ((resolve, reject) => {
    if (!asset.gift || asset.gift.length == 0) {
      reject('You have no items');
    } else if (asset.gift.includes(req.body.giftId) === false) {
      reject('You do not have this gift');
    } else {
      let indexOfGift = asset.gift.indexOf(req.body.giftId);
      if (indexOfGift > -1) {
        asset.gift.splice(indexOfGift, 1);
      }
      db.collection('user-asset').doc(req.uid).update({gift: asset.gift})
        .then(() => {
          resolve({gift: asset.gift});
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

function recive (req, asset) {
  return new Promise ((resolve, reject) => {
    if (!asset.gift || asset.gift.length == 0) {
      db.collection('user-asset').doc(req.body.reciver).update({gift: [req.body.giftId]})
        .then(() => {
          resolve({gift: [req.body.giftId]});
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      let gift = asset.gift.concat([req.body.giftId]);
      db.collection('user-asset').doc(req.body.reciver).update({gift: gift})
        .then(() => {
          resolve({gift: gift});
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

module.exports = {buyGift, buyMoney, sendGift};