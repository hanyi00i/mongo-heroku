const ObjectId = require("mongodb").ObjectId;

let departments;
class Departmental {
	static async injectDB(conn) {
		departments = await conn.db("vms").collection("departments")
	}

	static async getdepartment() {
        let depart = await departments.find({ }).toArray();
        if (depart) {
            return departments.aggregate([
                {$lookup:{
                    from:"visitors",
                    localField:"visitors",
                    foreignField:"id",
                    as: "visitors"
                }}
            ]).toArray();
        } else {
            return null
        }
	}

	static async createdepartment(code, department, floor) {
		let depart = await departments.findOne({ "code": code });
		if (depart) {
			return null;
		} else {
			await departments.insertOne({ "code": code, "department": department, "floor": floor  });
		}
		return depart = await departments.findOne({ "code": code });
	}

    static async deletedepartment(code) {
		let depart = await departments.findOne({ "code": code });
		if (depart) {
			await departments.deleteOne({ "code": code });
			return true;
		} else {
			return null;
		}
	}

	static async updatedepartmentid(code, visitors) {
		let depart = await departments.findOne({ "code": code });
        if (depart) {
			await departments.updateOne({"code": code }, { $push: { "visitors": visitors } });
			return depart = await departments.findOne({ "code": code });
		} else {
			return null;
		}
	}

    static async deletedepartmentid(code, visitors) {
		let depart = await departments.findOne({ "code": code });
		if (depart) {
			await departments.updateOne({"code": code }, { $pull: { "visitors": visitors } });
			return depart = await departments.findOne({ "code": code });
		} else {
			return null;
		}
	}

	static async data() {
        let depart = await departments.find({ }).toArray();
        if (depart) {
            return departments.aggregate([
                {$lookup:{
                    from:"visitors",
                    localField:"visitors",
                    foreignField:"id",
                    as: "visitors"
                }},
				{$match:{
					visitors: { $elemMatch: { checkin:{ $lte: 1100 } } }
				  }}
            ]).toArray();
        } else {
            return null
        }
	}

}
module.exports = Departmental;