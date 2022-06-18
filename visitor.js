const ObjectId = require("mongodb").ObjectId;

let visitors;
class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("vms").collection("visitors")
	}

	static async getVisitor(id) {
        let visitor = await visitors.findOne({ "id": id });
        if(visitor){
            return visitors.find({"id": id}).toArray();
        }
        else {
            return null
        }
	}

	static async createVisitor(name, id, phone, date, inputby) {
		let visitor = await visitors.findOne({ "id": id });
		if (visitor) {
			return null;
		} else {
			await visitors.insertOne({ "name": name, "id": id, "phone": phone, "date": date, "inputby": inputby });
		}
		return visitor = await visitors.findOne({ "id": id });
	}

	static async updateVisitor(id, phone, inputby) {
		let visitor = await visitors.findOne({ "id": id });
		if (visitor.inputby == inputby) {
			await visitors.updateOne({"id": id }, { $set: { "phone": phone } });
			return visitor = await visitors.findOne({ "id": id });
		} else {
			return null;
		}
	}

	static async deleteVisitor(id, inputby) {
		let visitor = await visitors.findOne({ "id": id });
		if (visitor.inputby == inputby) {
			await visitors.deleteOne({ "id": id });
			return true;
		} else {
			return null;
		}
	}

	static async UsergetVisitors(inputby) {
		let visitor = await visitors.find({ "inputby": inputby }).toArray();
		if(visitor){
			return visitor;
		}
		else {
			return null
		}
	}

	static async getAllVisitors() {
        let visitor = await visitors.find({ }).toArray();
		console.log("this is what i get", visitor);
        if(visitor){
            return visitor;
        }
        else {
            return null
        }
	}
}

module.exports = Visitor;