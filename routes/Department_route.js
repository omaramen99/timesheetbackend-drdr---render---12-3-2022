const Department_controller  = require('../controllers/Department_controller');
// const middleware= require('./middleware');
module.exports = (app) =>{
  
  app.get('/api/AllDepartments',
  Department_controller.AllDepartments);
  app.get('/api/GetDepartment',
  Department_controller.GetDepartment);
  
  // app.get('/api/GetUser',
  // Department_controller.GetUser);
  // app.get('/api/Login',
  // Department_controller.Login);
  // // //
  app.post('/api/AddDepartment',
  Department_controller.AddDepartment);
  // // //
  app.put('/api/EditDepartment',
  Department_controller.EditDepartment);
  
  app.put('/api/EditDepartmentMembers',
  Department_controller.EditDepartmentMembers);
  // app.put('/api/UpdateWeeklyHours',
  // Department_controller.UpdateWeeklyHours);
  // // //
  // app.delete('/api/deleteUser',
  // Department_controller.delete)




}
