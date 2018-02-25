Before proceeding create a file config.json in server/config directory, template
 for which is given in file configFormat.json located in the same directory.

 This Api returns data in json format.

 following is the list of routes along with the method and the fuction they perform.

 1. POST '/users' : to register a user (requires email and password)
 2. POST '/users/login' : to login an already registered user (requires email and password)
 3. GET '/users/me' : to fetch currently logged in user.
 4. DELETE '/users/me/token' : to log out a user.

 following methods can only be accessed by a logged in users

 5. GET '/todos' : to fetch all todos associated with a logged in user.
 6. POST '/todos' : to add a new todo (requires text)
 7. GET '/todos/:id' : to get todo by specified id.
 8. DELETE '/todos/:id' : to delete todos by id.
 9. PATCH '/todos/:id' : to edit a todo by id.
