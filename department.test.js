const MongoClient = require("mongodb").MongoClient;
const Departmental = require("./department")

describe("Department Info Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.te4xf.mongodb.net/Sandbox?retryWrites=true&w=majority",
             //"my-mongodb+srv-connection-string",
			{ useNewUrlParser: true },
		);
		Departmental.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("Create department Successfully", async () => {
		const res = await Departmental.createdepartment("test","testing","A24");
        expect (res.code).toBe("test");
        expect (res.department).toBe("testing");
        expect (res.floor).toBe("A24");
	})

    test("Create department Failed", async () => {
        const res = await Departmental.createdepartment("test","testing","A24");
        expect (res).toBe(null);
    })

    test("Insert id to department Successfully", async () => {
        const res = await Departmental.updatedepartmentid("test", "000000-00-0000");
        expect (res.code).toBe("test");
        expect (res.department).toBe("testing");
        expect (res.floor).toBe("A24");
        expect (res.visitors[0]).toBe("000000-00-0000");
    })

    test("Insert id to department Failed", async () => {
        const res = await Departmental.updatedepartmentid("none", "000000-00-0000");
        expect (res).toBe(null);
    })

    test("Remove id from department Successfully", async () => {
        const res = await Departmental.deletedepartmentid("test", "000000-00-0000");
        expect (res.code).toBe("test");
        expect (res.department).toBe("testing");
        expect (res.floor).toBe("A24");
        expect (res.visitors.length).toBe(0);
    })

    test("Remove id from department Failed", async () => {
        const res = await Departmental.deletedepartmentid("none", "000000-00-0000");
        expect (res).toBe(null);
    })

    test("Delete department Successfully", async () => {
        const res = await Departmental.deletedepartment("test");
        expect (res).toBe(true);
    })

    test("Delete department Failed", async () => {
        const res = await Departmental.deletedepartment("test");
        expect (res).toBe(null);
    })

}); 