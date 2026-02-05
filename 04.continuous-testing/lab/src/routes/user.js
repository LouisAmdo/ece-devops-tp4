const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstname
 *               - lastname
 *             properties:
 *               username:
 *                 type: string
 *                 example: sergkudinov
 *               firstname:
 *                 type: string
 *                 example: Sergei
 *               lastname:
 *                 type: string
 *                 example: Kudinov
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 msg:
 *                   type: string
 *                   example: OK
 *       400:
 *         description: Bad request - invalid parameters
 */
userRouter
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })
  
/**
 * @swagger
 * /user/{username}:
 *   get:
 *     summary: Get a user by username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username
 *         example: sergkudinov
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: sergkudinov
 *                     firstname:
 *                       type: string
 *                       example: Sergei
 *                     lastname:
 *                       type: string
 *                       example: Kudinov
 *       404:
 *         description: User not found
 */
  .get('/:username', (req, resp, next) => {
    const username = req.params.username
    
    userController.get(username, (err, user) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(404).json(respObj)
      }
      respObj = {
        status: "success",
        user: user
      }
      resp.status(200).json(respObj)
    })
  })
  
module.exports = userRouter
