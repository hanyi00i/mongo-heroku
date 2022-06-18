const bcrypt = require('bcrypt');

let users;
class User {
	static async injectDB(conn) {
		users = await conn.db("vms").collection("users")
	}
	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 */
	
	static async register(username, password, email, role) {
		// TODO: Check if username exists
	    let user = await users.findOne({ "username": username });
		if (user) {
			return null;
		} else {
		// TODO: Hash password
        const hashpassword = await bcrypt.hash(password, 10);
		// TODO: Save user to database
        await users.insertOne({"username": username, "password": hashpassword, "email": email, "role": role});
		}
		return user = await users.findOne({ "username": username });
	}

	static async login(username, password) {
		// TODO: Check if username exists
		let user = await users.findOne({ "username": username });
		if (!user) {
			return null;
		}
		// TODO: Validate password
		const match = await bcrypt.compare(password, user.password); 
		if (!match) {
			return null;
		}
		// TODO: Return user object
		return user;
	}

	static async update(username, email, role) {
		let user = await users.findOne({ "username": username });
		if (user) {
			await users.updateOne({"username": username }, { $set: { "email": email, "role": role } });
			return user = await users.findOne({ "username": username });
		} else {
			return null;
		}
	}

	static async delete(username) {
		let user = await users.findOne({ "username": username });
		if (user) {
			await users.deleteOne({ "username": username });
			return true;
		} else {
			return null;
		}
	}

	static async getAllVisitors() {
        let user = await users.find({ }).toArray();
        if(user){
            return user;
        }
        else {
            return null
        }
	}

}

module.exports = User;