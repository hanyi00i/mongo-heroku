const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('Express Route Test', function () {
	// it('should return hello world', async () => {
	// 	return request
	// 		.get('/hello')
	// 		.expect(200)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('Hello BENR2423');
	// 		});
	// })

	it('login successfully', async () => {
		return request
			.post('/login')
			.send({username: 'tony', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					_id: expect.any(String),
					name: expect.stringMatching("tony"),
					email: expect.stringMatching("tony@gmail.com"),
					//age: expect.any(Number),
					})
			});
	});

	it('login username failed', async () => {
		return request
			.post('/login')
			.send({username: 'ynot', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Login Failed"});
			});
	});

	it('login password failed', async () => {
		return request
			.post('/login')
			.send({username: 'tony', password: "abc123" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Login Failed"});
			});
	});

	it('register', async () => {
		return request
			.post('/register')
			.send({ username: 'user1', password: "123abc" , email: "test@gmail.com"})
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					_id: expect.any(String),
					name: expect.any(String),
					email: expect.any(String),
					//age: expect.any(Number),
				})
			});
	});

	it('register failed', async () => {
		return request
			.post('/register')
			.send({username: 'tony', password: "123abc" ,email: "tony@gmail.com" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Register Failed"});
			});
	})
});