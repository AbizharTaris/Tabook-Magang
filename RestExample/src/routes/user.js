import express from 'express';
import _ from 'lodash';
import User from '../models/user';
import dbConn from '../../config/db'; // eslint-disable-line

const router = express.Router();

router.get('/helloworld', (req, res) => {
  res.send('Test Router');
});

router.get('/users/:email', async (req, res) => {
  try {
    const users = await User.findOne({
      email: req.params.email,
    });
    if (!users) {
      return res.status(404).send();
    }
    return res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password', 'age']);
  const newUser = new User(body);

  try {
    await newUser.save();
    return res.send('Ok');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.patch('/users/:email', async (req, res) => {
  const body = _.pick(req.body, ['age']);

  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      throw new Error('User not found');
    }

    await User.findOneAndUpdate({
      email: req.params.email,
    }, {
      age: body.age,
    }, {
      new: true,
    });
    return res.send('Update Succesful!');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export default router;
