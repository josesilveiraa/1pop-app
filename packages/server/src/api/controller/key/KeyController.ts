import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Key from '../../../database/model/Key';
import UserController from '../user/UserController';

import random from '../../../util/randomStringGenerator';

class KeyController {
  store = async (req: Request, res: Response) => {
    const { content, expirationDate } = req.body;

    const splitDate = expirationDate.split('/');

    //                                     Year          Month          Date
    const dateExpiration = new Date(splitDate[0], splitDate[1], splitDate[2]);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existsKey = await Key.findOne({ content }).exec();

    if (existsKey) {
      return res
        .status(409)
        .json({ message: 'A key with this content already exists.' });
    }

    const key = new Key({
      content,
      expirationDate: dateExpiration,
    });

    await key.save();

    return res.status(200).json({ key });
  };

  storeRandom = async (req: Request, res: Response) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);

    const content = random(32);

    const existsKey = await Key.findOne({ content }).exec();

    if (existsKey) {
      return res
        .status(409)
        .json({ message: 'A key with this content already exists.' });
    }

    const key = new Key({
      content,
      expirationDate,
    });

    await key.save();

    return res.status(200).json({ key });
  };

  redeem = async (req: Request, res: Response) => {
    const { content } = req.body;

    const key = await Key.findOne({ content }).exec();

    if (!key) {
      return res
        .status(404)
        .json({ message: 'Cannot find a key with the specified content.' });
    }

    const { expirationDate } = key;
    const now = new Date();

    if (now > expirationDate) {
      return res.status(400).json({ message: 'Code expired.' });
    }

    await UserController.store(req, res);

    await key.deleteOne();

    return res.status(200).json({
      message:
        'Done! Now download the client and log in to save your HWID into our database.',
    });
  };

  indexAll = async (req: Request, res: Response) => {
    const users = await Key.find();

    return res.status(200).json({ users });
  };

  indexOne = async (req: Request, res: Response) => {
    const { content } = req.body;

    const key = await Key.findOne({ content }).exec();

    if (!key) {
      return res
        .status(404)
        .json({ message: 'Key with the specified content not found.' });
    }

    return res.status(200).json({ key });
  };

  delete = async (req: Request, res: Response) => {
    const { content } = req.body;

    const key = await Key.findOne({ content }).exec();

    if (!key) {
      return res
        .status(404)
        .json({ message: 'Key with the specified content not found.' });
    }

    await key.deleteOne();

    return res.status(200).json({ message: 'Key deleted successfully.' });
  };
}

export default new KeyController();
