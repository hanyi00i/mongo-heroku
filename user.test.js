const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

describe("User Info Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.te4xf.mongodb.net/Sandbox?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New user registration", async () => {
		const res = await User.register("test", "123abc","test@gmail.com", "user");
		expect(res.username).toBe("test");
		expect(res.email).toBe("test@gmail.com");
		expect(res.role).toBe("user");
	})

	test("Duplicate username", async () => {
		const res = await User.register("admin", "123abc","admin@gmail.com", "admin");
		expect(res).toBe(null)
	})

	test("User login invalid username", async () => {
		const res = await User.login("useless name", "123abc")
		expect(res).toBe(null)
	})

	test("User login invalid password", async () => {
		const res = await User.login("admin", "wrong password")
		expect(res).toBe(null)
	})

	test("User login successfully", async () => {
		const res = await User.login("admin", "123abc")
		expect(res.username).toBe("admin")
		expect(res.email).toBe("admin@gmail.com"),
		expect(res.role).toBe("admin")
	})
	
	test("User update Successfully", async () => {
		const res = await User.update("test", "test@gmail.com", "admin");
		expect(res.username).toBe("test");
		expect(res.email).toBe("test@gmail.com");
		expect(res.role).toBe("admin");	
	})

	test("User update Failed", async () => {
		const res = await User.update("none", "test@gmail.com", "admin");
		expect(res).toBe(null);
	})

	test("User delete Successfully", async () => {
		const res = await User.delete("test");
		expect(res).toBe(true);
	})

	test("User delete Failed", async () => {
		const res = await User.delete("none");
		expect(res).toBe(null);
	})

	test("Get all users", async () => {
		const res = await User.getAllUsers();
		expect(res.length).toBe(7);
	})

});