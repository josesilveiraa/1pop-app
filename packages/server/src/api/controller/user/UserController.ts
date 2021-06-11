import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import User from '../../../database/model/User';

class UserController {
  store = async (req: Request, res: Response) => {
    const { minecraftUsername, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existsUser = await User.exists({ minecraftUsername });

    if (existsUser) {
      return res
        .status(409)
        .json({ message: 'There is already a player with this username.' });
    }

    const user = new User({
      minecraftUsername,
      password,
      hardwareId: null,
    });

    await user.save();

    return res.status(200).json({ user });
  };

  indexAll = async (req: Request, res: Response) => {
    const users = await User.find().select('password isAdmin isBanned').exec();

    return res.status(200).json({ users });
  };

  indexOne = async (req: Request, res: Response) => {
    const { minecraftUsername } = req.body;

    const user = await User.findOne({ minecraftUsername })
      .select('password isAdmin isBanned')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  };

  delete = async (req: Request, res: Response) => {
    const { minecraftUsername } = req.body;

    const user = await User.findOne({ minecraftUsername }).exec();

    if (!user) {
      return res.sendStatus(404);
    }

    await user.deleteOne();

    return res.status(200).json({ message: 'User deleted successfully.' });
  };

  update = async (req: Request, res: Response) => {
    const { minecraftUsername, hardwareId } = req.body;

    const user = await User.findOne({ minecraftUsername })
      .select('password')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.minecraftUsername = minecraftUsername;
    user.hardwareId = hardwareId;

    await user.save();

    return res.status(200).json({ user });
  };

  adminUpdate = async (req: Request, res: Response) => {
    const { target } = req.body;

    const { minecraftUsername, hardwareId, isAdmin } = req.body.newData;

    const user = await User.findOne({ minecraftUsername: target })
      .select('isAdmin password isBanned')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.minecraftUsername = minecraftUsername;
    user.hardwareId = hardwareId;
    user.isAdmin = isAdmin;

    await user.save();

    return res.status(200).json({ user });
  };

  ban = async (req: Request, res: Response) => {
    const { minecraftUsername } = req.body;

    const user = await User.findOne({ minecraftUsername })
      .select('isAdmin password isBanned')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User Not found.' });
    }

    user.isBanned = true;

    await user.save();
    return res.status(200).json({ user });
  };
}

export default new UserController();
