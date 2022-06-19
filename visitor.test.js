const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")

describe("Visitor Info Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.te4xf.mongodb.net/Sandbox?retryWrites=true&w=majority",
             //"my-mongodb+srv-connection-string",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("Find visitor by Id Successfully", async () => {
		const res = await Visitor.getVisitor("020307-05-0958");
		expect(res[0].name).toBe("tony");
		expect(res[0].id).toBe("020307-05-0958");
		expect(res[0].phone).toBe("+018-255-6325");
		expect(res[0].inputby).toBe("ooi");
		expect(res[0].date).toBe(20220503);
		expect(res[0].checkin).toBe(1015);
	})

	test("Find visitor by Id Failed", async () => {
		const res = await Visitor.getVisitor("000000-00-0000");
		expect(res).toBe(null);
	})

	test("Create visitor Successfully", async () => {
		const res = await Visitor.createVisitor("john", "000101-01-0101", "+010-222-3333", "testsuite", 20200101, 1100);
		expect(res.name).toBe("john");
		expect(res.id).toBe("000101-01-0101");
		expect(res.phone).toBe("+010-222-3333");
		expect(res.inputby).toBe("testsuite");
		expect(res.date).toBe(20200101);
		expect(res.checkin).toBe(1100);
	})

	test("Create visitor Failed", async () => {
		const res = await Visitor.createVisitor("john", "020307-05-0958", "+010-222-3333", "testsuite", 20200101, 1100);
		expect(res).toBe(null);
	})

	test("Update visitor Successfully", async () => {
		const res = await Visitor.updateVisitor("000101-01-0101", 1450, "testsuite");
		expect(res.name).toBe("john");
		expect(res.id).toBe("000101-01-0101");
		expect(res.phone).toBe("+010-222-3333");
		expect(res.inputby).toBe("testsuite");
		expect(res.date).toBe(20200101);
		expect(res.checkin).toBe(1100);
		expect(res.checkout).toBe(1450);
	})

	test("Update visitor Failed", async () => {
		const res = await Visitor.updateVisitor("000101-01-0101", 1450, "nobody");
		expect(res).toBe(null);
	})

	test("Delete visitor Successfully", async () => {
		const res = await Visitor.deleteVisitor("000101-01-0101", "testsuite");
		expect(res).toBe(true);
	})

	test("Delete visitor Failed", async () => {
		const res = await Visitor.deleteVisitor("020307-05-0958", "nobody");
		expect(res).toBe(null);
	})

	test("Get visitors by user", async () => {
		const res = await Visitor.UsergetVisitors("ooi");
		expect(res.length).toBe(3);
	})

	test("Get all visitors", async () => {
		const res = await Visitor.getAllVisitors();
		expect(res.length).toBe(6);
	})
}); 