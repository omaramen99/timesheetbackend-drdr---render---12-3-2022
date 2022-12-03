const Project_controller  = require('../controllers/Project_controller');
// const middleware= require('./middleware');
module.exports = (app) =>{



  
  app.get('/api/AllProjects',
  Project_controller.AllProjects);
  app.get('/api/GetProject',
  Project_controller.GetProject);
  
  // app.get('/api/GetUser',
  // Project_controller.GetUser);
  // app.get('/api/Login',
  // Project_controller.Login);
  // // //
  app.post('/api/GetProjects',
  Project_controller.GetProjects);
  app.post('/api/AddProject',
  Project_controller.AddProject);

  
  // app.get('/api/test',
  // Project_controller.test);
  // app.post('/api/test2',
  // Project_controller.test2);
  // // //
  app.put('/api/EditProject',
  Project_controller.EditProject);
  app.put('/api/UpdateProjectNewPhase',
  Project_controller.UpdateProjectNewPhase);
  app.put('/api/UpdateProjectCurrentPhase',
  Project_controller.UpdateProjectCurrentPhase);
  app.put('/api/UpdateProjectWeeklyHours',
  Project_controller.UpdateProjectWeeklyHours);
  app.put('/api/UpdateProjectTeams',
  Project_controller.UpdateProjectTeams);
  app.put('/api/UpdateProjectLeader',
  Project_controller.UpdateProjectLeader);
  
  // // //
  // app.delete('/api/deleteProjects',
  // Project_controller.delete)




}
