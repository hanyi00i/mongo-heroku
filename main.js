const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Visitor = require("./visitor");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.te4xf.mongodb.net/Sandbox?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Visitor.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Visitor Management System API in Hospital',
			description: 'Group 10 for BENR 2423 Database and Cloud System Assignment',
			version: '1.0.0',
        	contact: { 
				name: 'Han Yi',
				email: 'b022010007@student.utem.edu.my',
				url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley'},
			license: {
				name: 'MIT',
				url: 'https://opensource.org/licenses/MIT'
			}
		},
		components: {
			securitySchemes: {
				BearerAuth: {				// arbitrary name for the security scheme
					type: "http",
					scheme: "bearer",
					in: "header",
					bearerFormat: 'JWT',	// optional, arbitrary value for documentation purposes
					description: 'JWT Authorization header using the Bearer scheme. Directly insert your token here.',
				}
			}
		}, 
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 *         email: 
 *           type: string
 *         role: 
 *           type: string
 *         token: 
 *           type: string
 *     Visitor:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         name: 
 *           type: string
 *         id: 
 *           type: string
 *         phone: 
 *           type: string
 *         date: 
 *           type: string
 *         inputby:
 *           type: string
 */


/**
 * @swagger
 * /adminlogin:
 *   post:
 *      summary: Authenticate Admin for Login
 *      tags: [Authentication for Admin / User / Security]
 *      description: Use to authorize the admin by JWT after login successfully
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                username: 
 *                  type: string
 *                password: 
 *                  type: string
 *      responses:
 *        200:  
 *          description: Admin Login Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: Invalid username or password
 */
 app.post('/adminlogin',async (req, res) => {
	console.log("Request Body : ", req.body);
	const admin = await User.login(req.body.username, req.body.password);
	if (admin != null) {
		if (admin.role == "admin") {
		console.log("What is send to test : " + admin._id, admin.username, admin.email);
		res.status(200).json({
			_id: admin._id,
			username: admin.username,
			email: admin.email,
			role: admin.role,
			token: generateAccessToken({
				_id: admin._id,
				username: admin.username,
				role: admin.role
			})
		})
		} else {
			console.log("Login Failed");
			res.status(401).json( {error : "Not authorized with admin role"} );
		}
	} else {
		console.log("Login Failed");
		res.status(401).json( {error : "Login Failed"} );
	}
})

/**
 * @swagger
 * /userlogin:
 *   post:
 *      summary: Authenticate User for Login 
 *      tags: [Authentication for Admin / User / Security]
 *      description: Use to authorize the user by JWT after login successfully
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                username: 
 *                  type: string
 *                password: 
 *                  type: string
 *      responses:
 *        200:  
 *          description: User Login Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: Invalid username or password
 */
app.post('/userlogin',async (req, res) => {
	console.log("Request Body : ", req.body);
	const user = await User.login(req.body.username, req.body.password);
	if (user != null) {
		if (user.role == "user") {
		console.log("What is send to test : " + user._id, user.username, user.email);
		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			token: generateAccessToken({
				_id: user._id,
				username: user.username,
				role: user.role
			})
		})
		} else {
			console.log("Login Failed");
			res.status(401).json( {error : "Not authorized with user role"} );
		}
	} else {
		console.log("Login Failed");
		res.status(401).json( {error : "Login Failed"} );
	}
})

/**
 * @swagger
 * /securitylogin:
 *   post:
 *      summary: Authenticate Security for Login
 *      tags: [Authentication for Admin / User / Security]
 *      description: Use to authorize the security by JWT after login successfully
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                username: 
 *                  type: string
 *                password: 
 *                  type: string
 *      responses:
 *        200:  
 *          description: Security Login Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: Invalid username or password
 */
 app.post('/securitylogin',async (req, res) => {
	console.log("Request Body : ", req.body);
	const security = await User.login(req.body.username, req.body.password);
	if (security != null) {
		if (security.role == "security") {
		console.log("What is send to test : " + security._id, security.username, security.email);
		res.status(200).json({
			_id: security._id,
			username: security.username,
			email: security.email,
			role: security.role,
			token: generateAccessToken({
				_id: security._id,
				username: securityn.username,
				role: security.role
			})
		})
		} else {
			console.log("Login Failed");
			res.status(401).json( {error : "Not authorized with security role"} );
		}
	} else {
		console.log("Login Failed");
		res.status(401).json( {error : "Login Failed"} );
	}
})

/**
 * @swagger
 * /visitors/{id}:
 *   get:
 *     summary: Get Visitors Information by ID
 *     tags: [Visitor Interface]
 *     description: Visitor can get his/her information by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Visitor ID
 *     responses:
 *       200:
 *         description: Get Visitor Information Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Invalid ID
 */

 app.get('/visitors/:id', async (req, res) => {
	const {id} = req.params;
	const visitor = await Visitor.getVisitor(id);
	if (visitor != null ) {
		console.log("Get Successfully");
		res.status(200).json({visitor})
	} else {
		console.log("Get Failed");
		res.status(404).send("Failed to get visitor");
	}
})

// Middleware Express for JWT
app.use(verifyToken);

/**
 * @swagger
 * /register:
 *   post:
 *      security: 
 *          - BearerAuth: []
 *      summary: Register new user by Admin
 *      tags: [Admin Interface]
 *      description: Only Admin can register new user with the role of Admin, User, and Security
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                username: 
 *                  type: string
 *                password: 
 *                  type: string
 *                email:
 *                  type: string
 *                role:
 *                  type: string
 *      responses:
 *        200:  
 *          description: Register Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: Invalid username or password
 */
app.post('/register', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const user = await User.register(req.body.username, req.body.password, req.body.email, req.body.role);
	if (user != null ) {
		console.log("Register Successfully");
		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
		})
	} else {
		console.log("Registered Failed");
		res.status(401).json( {error : "Register Failed"} );
	}
	} else {
		console.log("Register Failed");
		res.status(401).json( {error : "Not authorized with admin role"} );
	}
})

/**
 * @swagger
 * /get:
 *   get:
 *     security:
 *         - BearerAuth: []
 *     summary: Get All the Users Information 
 *     tags: [Admin Interface]
 *     description: Only Admin can get all the users information
 *     responses:
 *       200:
 *         description: Get User Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Not authorized with Admin role
 */
 app.get('/get', async (req, res) => {
	if (req.user.role == "admin") {
	const admin = await User.getAllVisitors();
	if (admin != null ) {
		console.log("Get Successfully with", admin);
		res.status(200).json({admin})
	} else {
		console.log("Get Failed");
		res.status(404).send("Failed to get user");
	}
	} else {
		console.log("Get Failed");
		res.status(401).json( {error : "Not authorizaed with Admin role"} );
	}
})

/**
 * @swagger
 * /update:
 *   patch:
 *      security: 
 *          - BearerAuth: []
 *      summary: Update user information by Admin
 *      tags: [Admin Interface]
 *      description: Only Admin can update new user information included the role of Admin, User, and Security
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                username: 
 *                  type: string
 *                email:
 *                  type: string
 *                role:
 *                  type: string
 *      responses:
 *        200:  
 *          description: Update Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: Invalid username
 */
 app.patch('/update', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const user = await User.update(req.body.username, req.body.email, req.body.role);
	if (user != null ) {
		console.log("Register Successfully");
		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
		})
	} else {
		console.log("Updated Failed");
		res.status(401).json( {error : "Updated Failed"} );
	}
	} else {
		console.log("Updated Failed");
		res.status(401).json( {error : "Not authorized with admin role"} );
	}
})

/**
 * @swagger
 * /delete:
 *   delete:
 *      security: 
 *          - BearerAuth: []
 *      summary: Delete user by Admin
 *      tags: [Admin Interface]
 *      description: Only Admin can delete user included the role of Admin, User, and Security
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                username: 
 *                  type: string
 *      responses:
 *        200:  
 *          description: Delete Successfully
 *        401:
 *          description: Invalid username 
 */
 app.delete('/delete', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const user = await User.delete(req.body.username);
	if (user != null ) {
		console.log("Delete Successfully");
		res.status(200).json({ delete : "success"})
	} else {
		console.log("Delete Failed");
		res.status(401).json( {error : "Delete Failed"} );
	}
	} else {
		console.log("Delete Failed");
		res.status(401).json( {error : "Not authorized with admin role"} );
	}
})

/**
 * @swagger
 * /getvisitor:
 *   get:
 *     security:
 *         - BearerAuth: []
 *     summary: Get All the Visitors Information 
 *     tags: [Admin Interface]
 *     description: Only Admin can get all the visitors information
 *     responses:
 *       200:
 *         description: Get Visitor Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Not authorized with Admin role
 */
 app.get('/getvisitor', async (req, res) => {
	if (req.user.role == "admin") {
	const visitor = await Visitor.getAllVisitors();
	if (visitor != null ) {
		console.log("Get Successfully with", visitor);
		res.status(200).json({visitor})
	} else {
		console.log("Get Failed");
		res.status(404).send("Failed to get visitor");
	}
	} else {
		console.log("Get Failed");
		res.status(401).json( {error : "Not authorizaed with Admin role"} );
	}
})

/**
 * @swagger
 * /visitor/create:
 *   post:
 *      security: 
 *          - BearerAuth: []
 *      summary: Create Visitor
 *      tags: [User Interface]
 *      description: User create visitor information after authorized
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                id:
 *                  type: string
 *                phone:
 *                  type: string
 *                date:
 *                  type: string
 *      responses:
 *        200:  
 *          description: Create Visitor Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Visitor'
 *        401:
 *          description: Create Visitor Failed
 */
 app.post('/visitor/create', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "user") {
	const visitor = await Visitor.createVisitor(req.body.name, req.body.id, req.body.phone, req.body.date, req.user.username);
	if (visitor != null ) {
		console.log("Create Successfully");
		console.log("What is send to test : " + visitor._id, visitor.name, visitor.id, visitor.phone, visitor.date, visitor.inputby);
		res.status(200).json({
			_id: visitor._id,
			name: visitor.name,
			id: visitor.id,
			phone: visitor.phone,
			date: visitor.date,
			inputby: visitor.inputby
		})
	} else {
		console.log("Register Failed");
		res.status(401).json( {error : "Create Visitor Failed"} );
	}
	} else {
		console.log("Register Failed");
		res.status(401).json( {error : "Not authorized with user role"} );
}
})

/**
 * @swagger
 * /visitor/read:
 *   get:
 *     security:
 *         - BearerAuth: []
 *     summary: Get User Created Visitors Information 
 *     tags: [User Interface]
 *     description: User can get all the visitor information only from the user created
 *     responses:
 *       200:
 *         description: Get Visitor Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Invalid ID
 */
 app.get('/visitor/read', async (req, res) => {
	if (req.user.role == "user") {
	const username = req.user.username;
	console.log("this is the username : " + username);
	const visitor = await Visitor.UsergetVisitors(username);
	if (visitor != null ) {
		console.log("Get Successfully with", visitor);
		res.status(200).json({visitor})
	} else {
		console.log("Get Failed");
		res.status(404).send("Failed to get visitor");
	}
	} else {
		console.log("Register Failed");
		res.status(401).json( {error : "Not authorized with user role"} );
	}
})

/**
 * @swagger
 * /visitor/update:
 *   patch:
 *      security: 
 *          - BearerAuth: []
 *      summary: Update Visitor
 *      tags: [User Interface]
 *      description: User update visitor information after authorized
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                id: 
 *                  type: string
 *                phone:
 *                  type: string
 *      responses:
 *        200:  
 *          description: Update Visitor Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Visitor'
 *        401:
 *          description: Update Visitor Failed
 */
 app.patch('/visitor/update', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "user") {
	const visitor = await Visitor.updateVisitor(req.body.id, req.body.phone, req.user.username);
	if (visitor != null ) {
		console.log("Update Successfully");
		console.log("What is send to test : " + visitor._id, visitor.phone);
		res.status(200).json({
			_id: visitor._id,
			name: visitor.name,
			id: visitor.id,
			phone: visitor.phone,
			date: visitor.date,
			inputby: visitor.inputby
		})
	} else {
		console.log("Update Failed");
		res.status(401).json( {error : "Update Visitor Failed"} );
	}
	} else {
		console.log("Update Failed");
		res.status(401).json( {error : "Not authorized with user role"} );
}
})

/**
 * @swagger
 * /visitor/delete:
 *   delete:
 *      security: 
 *          - BearerAuth: []
 *      summary: Delete Visitor
 *      tags: [User Interface]
 *      description: User delete visitor information after authorized
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                id: 
 *                  type: string
 *      responses:
 *        200:  
 *          description: Delete Visitor Successfully
 *        401:
 *          description: Delete Visitor Failed
 */
 app.delete('/visitor/delete', async (req, res) => {
	console.log("Request Body : ", req.body);
	const visitor = await Visitor.deleteVisitor(req.body.id, req.user.username);
	if (visitor != null ) {
		console.log("Delete Successfully");
		console.log("What is send to test : " + visitor._id);
		console.log("User Deleted");
		res.status(200).json({ delete : "success"})
	} else {
		console.log("Delete Failed");
		res.status(404).json( {error : "Delete Failed"} );
	}
})

/**
 * @swagger
 * /security:
 *   get:
 *     security:
 *         - BearerAuth: []
 *     summary: Get All the Visitors Information 
 *     tags: [Security Interface]
 *     description: Only Security can get all the visitors information
 *     responses:
 *       200:
 *         description: Get Visitor Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Not authorizaed with Admin role
 */
 app.get('/get', async (req, res) => {
	if (req.user.role == "security") {
	const visitor = await Visitor.getAllVisitors();
	if (visitor != null ) {
		console.log("Get Successfully with", visitor);
		res.status(200).json({visitor})
	} else {
		console.log("Get Failed");
		res.status(404).send("Failed to get visitor");
	}
	} else {
		console.log("Register Failed");
		res.status(401).json( {error : "Not authorizaed with Security role"} );
	}
})

//***********************************************************************************************/

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

// JSON Web Token
const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1d' }); //expiresIn: '60s'
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "my-super-secret", (err, user) => {
		console.log(err)
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
} 