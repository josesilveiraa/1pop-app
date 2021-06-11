import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../../../database/model/User';

class AuthController {
  authenticate = async (req: Request, res: Response) => {
    const { minecraftUsername, password } = req.body;

    const user = await User.findOne({ minecraftUsername })
      .select('password isAdmin hardwareId')
      .exec();

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (user.isBanned) {
      return res
        .status(401)
        .json({ message: "You're banned from the client." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign(
      { id: user.get('_id'), isAdmin: user.isAdmin },
      process.env.SECRET,
    );

    return res.json({
      token,
    });
  };
}

export default new AuthController();
