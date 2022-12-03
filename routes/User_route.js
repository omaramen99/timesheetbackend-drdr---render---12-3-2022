const User_controller  = require('../controllers/User_controller');
// const middleware= require('./middleware');
module.exports = (app) =>{
  
  app.get('/api/AllUsers',
  User_controller.allUsers);
  app.get('/api/GetUser',
  User_controller.GetUser);
  app.get('/api/GetUserData',
  User_controller.GetUserData);
  
  app.post('/api/GetUsers',
  User_controller.GetUsers);
  app.post('/api/Login',
  User_controller.Login);
  // //
  app.post('/api/AddUser',
  User_controller.AddUser);


  app.post('/api/AddNewUser',
  User_controller.AddNewUser);
  
  // //
  app.post('/api/EditCurrentUser',
  User_controller.EditCurrentUser);

  app.put('/api/EditUser',
  User_controller.EditUser);
  app.put('/api/EditUserPasswordOrPhoto',
  User_controller.EditUserPasswordOrPhoto);
  
  app.put('/api/UpdateWeeklyHours',
  User_controller.UpdateWeeklyHours);
  // //
  app.delete('/api/deleteUser',
  User_controller.delete)




}
