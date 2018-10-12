import * as ChatRoomsController from '../controllers/chatRooms';
import * as AuthController from '../controllers/regAndLogin';
import * as MessagesController from '../controllers/chatMessages';
import * as StatusController from '../controllers/status';
import * as AssetController from '../controllers/userAsset';

import express from 'express';
import checkAuth from '../middleware/authentication';

export default (app) => {
    const roomRoutes = express.Router();
    const messageRoutes = express.Router();
    const statusRoutes = express.Router();
    app.post('/auth/reg', AuthController.reg);
    app.post('/auth/login', AuthController.login);

    // Room Routes
    app.use('/room', roomRoutes);
    roomRoutes.get('/available', checkAuth, ChatRoomsController.getAvailableRooms);
    roomRoutes.post('/join', checkAuth, ChatRoomsController.requestJoinRoom);

    // Message Routes
    app.use('/message', messageRoutes);
    messageRoutes.post('/get', checkAuth, MessagesController.getMessages);

    //Status routes
    app.use('/status', statusRoutes);
    statusRoutes.post('/new', checkAuth, StatusController.postStatus);
    statusRoutes.post('/comment', checkAuth, StatusController.postComment);
    statusRoutes.get('/:id', StatusController.getStatus);

    // User-asset
    app.use('/asset', assetRoutes);
    assetRoutes.post('/buy/money', checkAuth, AssetController.buyMoney);
    assetRoutes.post('/buy/gift', checkAuth, AssetController.buyGift);
    assetRoutes.post('/send/gift', checkAuth, AssetController.sendGift);
};
