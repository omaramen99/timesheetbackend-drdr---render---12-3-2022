const Team_controller  = require('../controllers/Team_controller');
// const middleware= require('./middleware');
module.exports = (app) =>{
  
  app.get('/api/allTeams',
  Team_controller.allTeams);
    app.get('/api/allTeamss',
  Team_controller.allTeamss);
  
  app.get('/api/allUserTeams',
  Team_controller.allUserTeams);
  
  app.get('/api/GetTeam',
  Team_controller.GetTeam);
  
  app.post('/api/GetTeams',
  Team_controller.GetTeams);

  app.get('/api/AddAllUsersToTeam',
  Team_controller.AddAllUsersToTeam);
  
  // app.get('/api/Login',
  // Team_controller.Login);
  // // //
  app.post('/api/AddTeam',
  Team_controller.AddTeam);
  app.post('/api/AddTeamm',
  Team_controller.AddTeamm);
  // // //
  app.put('/api/EditTeam',
  Team_controller.EditTeam);
  app.put('/api/EditTeamLeader',
  Team_controller.EditTeamLeader);
  app.put('/api/ChangeTeamLeader',
  Team_controller.ChangeTeamLeader);
  app.put('/api/AddTeamMember',
  Team_controller.AddTeamMember);
  app.put('/api/RemoveTeamMember',
  Team_controller.RemoveTeamMember);
  
  
  // app.put('/api/UpdateWeeklyHours',
  // Team_controller.UpdateWeeklyHours);
  // // //
  app.delete('/api/deleteTeam',
  Team_controller.delete)




}
