const supertest = require('supertest');
const request = supertest('http://localhost:3000');
const admin_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFjMzM5YmNmYmI0OWJmNjUyOWIyMTQiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU1NjM5OTI1LCJleHAiOjE2NTU2NDM1MjV9.-bTHMqXIzPrUgMEpfoneiWqf4QOKpEvd_9NDvzgB538'
const user_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFlYjc3ODExNjMzOGIxZTQxNDE5N2MiLCJ1c2VybmFtZSI6InVzZXIiLCJyb2xlIjoidXNlciIsImlhdCI6MTY1NTYxOTg0NSwiZXhwIjoxNjU1NzA2MjQ1fQ.gKucBGSslUllZPwbw40TY2QUHzuuxTZj0-F0klGClCY'

describe('Express Route Test', function () {

	it('Admin login successfully', async () => {
		return request
			.post('/adminlogin')
			.send({username: 'admin', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					_id: expect.any(String),
					username: expect.stringMatching("admin"),
					email: expect.stringMatching("admin@gmail.com"),
					role: expect.stringMatching("admin"),
					token: expect.any(String)
					})
			});
	});

	it('Admin login username failed', async () => {
		return request
			.post('/adminlogin')
			.send({username: 'ynot', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Not authorized with admin role"});
			});
	});

	it('Admin login password failed', async () => {
		return request
			.post('/adminlogin')
			.send({username: 'admin', password: "wrongpassword" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Not authorized with admin role"});
			});
	});

	it('Admin login with wrong role', async () => {
		return request
			.post('/adminlogin')
			.send({username: 'user', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(403)
			.then(res => {
				expect(res.body).toEqual({error : "Forbidden"});
			});
	});

	it('User login successfully', async () => {
		return request
			.post('/userlogin')
			.send({username: 'user', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					_id: expect.any(String),
					username: expect.stringMatching("user"),
					email: expect.stringMatching("user@gmail.com"),
					role: expect.stringMatching("user"),
					token: expect.any(String)
					})
			});
	});

	it('User login username failed', async () => {
		return request
			.post('/userlogin')
			.send({username: 'ynot', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Not authorized with user role"});
			});
	});

	it('User login password failed', async () => {
		return request
			.post('/userlogin')
			.send({username: 'user', password: "wrongpassword" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Not authorized with user role"});
			});
	});

	it('User login with wrong role', async () => {
		return request
			.post('/userlogin')
			.send({username: 'admin', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(403)
			.then(res => {
				expect(res.body).toEqual({error : "Forbidden"});
			});
	});

	it('Security login successfully', async () => {
		return request
			.post('/securitylogin')
			.send({username: 'security', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					_id: expect.any(String),
					username: expect.stringMatching("security"),
					email: expect.stringMatching("security@gmail.com"),
					role: expect.stringMatching("security"),
					token: expect.any(String)
					})
			});
	});

	it('Security login username failed', async () => {
		return request
			.post('/securitylogin')
			.send({username: 'ynot', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Not authorized with security role"});
			});
	});

	it('Security login password failed', async () => {
		return request
			.post('/securitylogin')
			.send({username: 'security', password: "wrongpassword" })
			.expect('Content-Type', /json/)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual({error : "Not authorized with security role"});
			});
	});

	it('Security login with wrong role', async () => {
		return request
			.post('/securitylogin')
			.send({username: 'admin', password: "123abc" })
			.expect('Content-Type', /json/)
			.expect(403)
			.then(res => {
				expect(res.body).toEqual({error : "Forbidden"});
			});
	});

	it('User register successfully', async () => {
		return request
			.post('/register')
			.set('authorization', 'Bearer '+ admin_token) //set token to header
			.send({ username: 'test', password: "123abc" , email: "test@gmail.com", role: "user"})
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					_id: expect.any(String),
					username: expect.stringMatching("test"),
					email: expect.stringMatching("test@gmail.com"),
					role: expect.stringMatching("user"),
				})
			});
	});

	it('User register failed', async () => {
		return request
			.post('/register')
			.set('authorization', 'Bearer '+ admin_token) //set token to header
			.send({ username: 'test', password: "123abc" , email: "test@gmail.com", role: "user"})
			.expect('Content-Type', /json/)
			.expect(409)
			.then(res => {
				expect(res.body).toEqual({error : "Conflict with Duplicate username"});
			});
	})

	it('User updated successfully', async () => {
		return request
			.patch('/update')
			.set('authorization', 'Bearer '+ admin_token) //set token to header
			.send({ username: 'test', email: "testing@gmail.com", role: "admin"})
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					_id: expect.any(String),
					username: expect.stringMatching("test"),
					email: expect.stringMatching("testing@gmail.com"),
					role: expect.stringMatching("admin"),
				})
			});
	})

	it('User updated failed', async () => {
		return request
			.patch('/update')
			.set('authorization', 'Bearer '+ admin_token) //set token to header
			.send({ username: 'nothing', email: "test@gmail.com", role: "admin"})
			.expect('Content-Type', /json/)
			.expect(404)
			.then(res => {
				expect(res.body).toEqual({error : "User not found"});
			});
	})

	it('User deleted successfully', async () => {
		return request
			.delete('/delete')
			.set('authorization', 'Bearer '+ admin_token) //set token to header
			.send({ username: 'test'})
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({ delete : "User Delete Successfully"})
			});
	})

	it('User deleted failed', async () => {
		return request
			.delete('/delete')
			.set('authorization', 'Bearer '+ admin_token) //set token to header
			.send({ username: 'test'})
			.expect('Content-Type', /json/)
			.expect(404)
			.then(res => {
				expect(res.body).toEqual({error : "User not found"} )
			});
	})

});