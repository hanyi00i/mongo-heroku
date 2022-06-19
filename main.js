const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Visitor = require("./visitor");
const Departmental = require("./department");

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
	Departmental.injectDB(client);
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

app.get('/', (req, res) => {
	res.send('Remember to add the endpoint of "/api-docs" to the URL')
})

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
 *         inputby:
 *           type: string
 *         date: 
 *           type: integer
 *         checkin: 
 *           type: integer
 *         checkout:
 *           type: integer
 *     Department:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         code: 
 *           type: string
 *         department: 
 *           type: string
 *         floor: 
 *           type: string
 *         visitors: 
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
 *          description: Not authorized with admin role
 *        403:
 *          description: Forbidden
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
			console.log("Forbidden");
			res.status(403).json( {error : "Forbidden"} );
		}
	} else {
		console.log("Not authorized with admin role");
		res.status(401).json( {error : "Not authorized with admin role"} );
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
 *          description: Not authorized with user role
 *        403:
 *          description: Forbidden
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
			console.log("Forbidden");
			res.status(403).json( {error : "Forbidden"} );
		}
	} else {
		console.log("Not authorized with user role");
		res.status(401).json( {error : "Not authorized with user role"} );
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
 *          description: Not authorized with security role
 *        403:
 *          description: Forbidden
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
				username: security.username,
				role: security.role
			})
		})
		} else {
			console.log("Forbidden");
			res.status(403).json( {error : "Forbidden"} );
		}
	} else {
		console.log("Not authorized with security role");
		res.status(401).json( {error : "Not authorized with security role"} );
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
 *       404:
 *         description: Invalid ID
 */

 app.get('/visitors/:id', async (req, res) => {
	const {id} = req.params;
	const visitor = await Visitor.getVisitor(id);
	console.log("this is the visitor", visitor);
	if (visitor != null ) {
		console.log("Get Visitor info Successfully");
		res.status(200).json({visitor})
	} else {
		console.log("Failed to get visitor");
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
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        409:
 *          description: Conflict with Duplicate username
 */
app.post('/register', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const user = await User.register(req.body.username, req.body.password, req.body.email, req.body.role);
	if (user != null ) {
		console.log("User Register Successfully");
		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
		})
	} else {
		console.log("Conflict with Duplicate username");
		res.status(409).json( {error : "Conflict with Duplicate username"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 */
 app.get('/get', async (req, res) => {
	if (req.user.role == "admin") {
	const admin = await User.getAllUsers();
	if (admin != null ) {
		console.log("Get Successfully with", admin);
		res.status(200).json({admin})
	} else {
		console.log("Failed to get user");
		res.status(404).send("Failed to get user");
	}
	} else {
		console.log("Get Failed");
		res.status(403).json( {error : "Forbidden"} );
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
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not Found
 */
 app.patch('/update', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const user = await User.update(req.body.username, req.body.email, req.body.role);
	if (user != null ) {
		console.log("User Update Successfully");
		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
		})
	} else {
		console.log("User not found");
		res.status(404).json( {error : "User not found"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *          description: User Delete Successfully
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not Found
 */
 app.delete('/delete', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const user = await User.delete(req.body.username);
	if (user != null ) {
		console.log("User Delete Successfully");
		res.status(200).json({ delete : "User Delete Successfully"});
	} else {
		console.log("User not found");
		res.status(404).json( {error : "User not found"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Visitor Not Found
 */
 app.get('/getvisitor', async (req, res) => {
	if (req.user.role == "admin") {
	const visitor = await Visitor.getAllVisitors();
	if (visitor != null ) {
		console.log("Get Successfully with", visitor);
		res.status(200).json({visitor})
	} else {
		console.log("Visitor not found");
		res.status(404).send("Visitor not found");
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
	}
})

/**
 * @swagger
 * /department/create:
 *   post:
 *      security: 
 *          - BearerAuth: []
 *      summary: Create Depertment Details by Admin
 *      tags: [Admin Interface]
 *      description: Only Admin can create department details
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                code: 
 *                  type: string
 *                department: 
 *                  type: string
 *                floor:
 *                  type: string
 *      responses:
 *        200:  
 *          description: Department Created Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Department'
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        409:
 *          description: Conflict with Duplicate Department Code
 */
 app.post('/department/create', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const depart = await Departmental.createdepartment(req.body.code, req.body.department, req.body.floor);
	if (depart != null ) {
		console.log("Department Create Successfully");
		res.status(200).json({
			_id: depart._id,
			code: depart.code,
			department: depart.department,
			floor: depart.floor
		})
	} else {
		console.log("Conflict with Duplicate Department Code");
		res.status(409).json( {error : "Conflict with Duplicate Department Code"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
	}
})

/**
 * @swagger
 * /department/delete:
 *   delete:
 *      security: 
 *          - BearerAuth: []
 *      summary: Delete Department by Admin
 *      tags: [Admin Interface]
 *      description: Only Admin can delete department
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                code: 
 *                  type: string
 *      responses:
 *        200:  
 *          description: Department Deleted Successfully
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not Found
 */
 app.delete('/department/delete', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const depart = await Departmental.deletedepartment(req.body.code);
	if (depart != null ) {
		console.log("Delete Successfully");
		res.status(200).json({ delete : "Department Delete Successfully"});
	} else {
		console.log("Delete Failed");
		res.status(404).json( {error : "Department Not Found"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
	}
})

/**
 * @swagger
 * /department/get:
 *   get:
 *     security:
 *         - BearerAuth: []
 *     summary: Get All the Departments Information 
 *     tags: [Admin Interface]
 *     description: Only Admin can get all the departments information
 *     responses:
 *       200:
 *         description: Get Departments Details Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Department Not Found
 */
 app.get('/department/get', async (req, res) => {
	if (req.user.role == "admin") {
	const admin = await Departmental.getdepartment();
	if (admin != null ) {
		console.log("Get Successfully with", admin);
		res.status(200).json({admin})
	} else {
		console.log("Department not found");
		res.status(404).send("Department Not Found");
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *                  type: integer
 *                checkin:
 *                  type: integer
 *      responses:
 *        200:  
 *          description: Create Visitor Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Visitor'
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        409:
 *          description: Conflict with Duplicate ID
 */
 app.post('/visitor/create', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "user") {
	const visitor = await Visitor.createVisitor(req.body.name, req.body.id, req.body.phone, req.user.username, req.body.date, req.body.checkin);
	if (visitor != null ) {
		console.log("Visitor Create Successfully");
		console.log("What is send to test : " + visitor._id, visitor.name, visitor.id, visitor.phone, visitor.inputby, visitor.date, visitor.checkin);
		res.status(200).json({
			_id: visitor._id,
			name: visitor.name,
			id: visitor.id,
			phone: visitor.phone,
			inputby: visitor.inputby,
			date: visitor.date,
			checkin: visitor.checkin
		})
	} else {
		console.log("Conflict with Duplicate ID");
		res.status(409).json( {error : "Conflict with Duplicate ID"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Visitor Not Found
 */
 app.get('/visitor/read', async (req, res) => {
	if (req.user.role == "user") {
	const username = req.user.username;
	const visitor = await Visitor.UsergetVisitors(username);
	if (visitor != null ) {
		console.log("Get Successfully with", visitor);
		res.status(200).json({visitor})
	} else {
		console.log("Visitor not found");
		res.status(404).send("Visitor Not Found");
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *                checkout:
 *                  type: integer
 *      responses:
 *        200:  
 *          description: Update Visitor Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Visitor'
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not Found
 */
 app.patch('/visitor/update', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "user") {
	const visitor = await Visitor.updateVisitor(req.body.id, req.body.checkout, req.user.username);
	if (visitor != null ) {
		console.log("Update Successfully");
		console.log("What is send to test : " + visitor._id, visitor.checkout);
		res.status(200).json({
			_id: visitor._id,
			name: visitor.name,
			id: visitor.id,
			phone: visitor.phone,
			inputby: visitor.inputby,
			date: visitor.date,
			checkin: visitor.checkin,
			checkout: visitor.checkout,
		})
	} else {
		console.log("Visitor Not Found");
		res.status(404).json( {error : "Visitor Not Found"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not Found
 */
 app.delete('/visitor/delete', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "admin") {
	const visitor = await Visitor.deleteVisitor(req.body.id, req.user.username);
	if (visitor != null ) {
		console.log("Delete Successfully");
		console.log("What is send to test : " + visitor._id);
		console.log("User Deleted");
		res.status(200).json({ delete : "success"})
	} else {
		console.log("Visitor Not Found");
		res.status(404).json( {error : "Visitor Not Found"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
	}
})

/**
 * @swagger
 * /department/insert:
 *   patch:
 *      security: 
 *          - BearerAuth: []
 *      summary: Insert visitor id in Department by User
 *      tags: [User Interface]
 *      description: Only User can insert visitor id in Department
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                code: 
 *                  type: string
 *                visitors:
 *                  type: string
 *      responses:
 *        200:  
 *          description: Visitor ID insert Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Department'
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not Found
 */
 app.patch('/department/insert', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "user") {
	const user = await Departmental.updatedepartmentid(req.body.code, req.body.visitors);
	if (user != null ) {
		console.log("Visitor ID insert Successfully");
		res.status(200).json({
			_id: user._id,
			code: user.code,
			departmet: user.department,
			floor: user.floor,
			visitors: user.visitors
		})
	} else {
		console.log("Department Not Found");
		res.status(404).json( {error : "Department Not Found"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
	}
})

/**
 * @swagger
 * /department/remove:
 *   patch:
 *      security: 
 *          - BearerAuth: []
 *      summary: Remove visitor id in Department by User
 *      tags: [User Interface]
 *      description: Only User can remove visitor id in Department
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                code: 
 *                  type: string
 *                visitors:
 *                  type: string
 *      responses:
 *        200:  
 *          description: Visitor ID remove Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Department'
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not Found
 */
 app.patch('/department/remove', async (req, res) => {
	console.log("Request Body : ", req.body);
	if (req.user.role == "user") {
	const user = await Departmental.deletedepartmentid(req.body.code, req.body.visitors);
	if (user != null ) {
		console.log("Visitor ID remove Successfully");
		res.status(200).json({
			_id: user._id,
			code: user.code,
			departmet: user.department,
			floor: user.floor,
			visitors: user.visitors
		})
	} else {
		console.log("Department Not Found");
		res.status(404).json( {error : "Department Not Found"} );
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 */
 app.get('/security', async (req, res) => {
	if (req.user.role == "security") {
	const visitor = await Visitor.getAllVisitors();
	if (visitor != null ) {
		console.log("Get Successfully with", visitor);
		res.status(200).json({visitor})
	} else {
		console.log("Visitor Not Found");
		res.status(404).send("Visitor Not Found");
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
	}
})

/**
 * @swagger
 * /dataanalytics:
 *   get:
 *     security:
 *         - BearerAuth: []
 *     summary: Data analytics that can be generated from the database through the RESTful API
 *     tags: [Data Analytics for Admin Only]
 *     description: Data analytics of the department that will have visitors before 11:00 AM
 *     responses:
 *       200:
 *         description: The department that will have visitors before 11:00 AM
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data Not Found
 */
 app.get('/dataanalytics', async (req, res) => {
	if (req.user.role == "admin") {
	const data = await Departmental.data();
	if (data != null ) {
		console.log("Get Successfully with", data);
		res.status(200).json({data})
	} else {
		console.log("Data not found");
		res.status(404).send("Data not found");
	}
	} else {
		console.log("Forbidden");
		res.status(403).json( {error : "Forbidden"} );
	}
})

//***********************************************************************************************/

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

// JSON Web Token
const jwt = require('jsonwebtoken');
const Department = require("./department");
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