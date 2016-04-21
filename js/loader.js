
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/18ZE7q38ce1jsqNekTzw1lklHe2wm1N0S407SCmBNQqM/pubhtml';
var data_model;

// Helper function to fetch details
function fetch_detail(model, id){
  for(var i = 0; i < model.length; i++){
    if(model[i]['id'] == id)
      return model[i];
  }
}

// Helper function to aggregate details
function aggregate_project_details(project, user, track){
  aggregate = {};

  aggregate['project_id'] = project['id'];
  aggregate['project_title'] = project['project_title']
  aggregate['project_subtitle'] = project['project_subtitle']
  aggregate['project_video_url'] = project['project_video_url']
  aggregate['project_image_url'] = project['project_image_url']
  aggregate['project_article'] = project['project_article']

  aggregate['user-id'] = user['id'];
  aggregate['user_name'] = user['user_name'];
  aggregate['user_email'] = user['user_email'];
  aggregate['user_tagline'] = user['user_tagline'];
  aggregate['user_linkedin'] = user['user_linkedin'];

  aggregate['track_id'] = track['id'];
  aggregate['track_name'] = track['track_name'];
  aggregate['track_description'] = track['track_description'];
  return aggregate;
}

// Helper function to aggregate details
function aggregate_video_details(video, user, track){
  aggregate = {};

  aggregate['video_id'] = video['id'];
  aggregate['video_title'] = video['video_title']
  aggregate['video_text'] = video['video_text']
  aggregate['video_url'] = video['video_url']

  aggregate['user-id'] = user['id'];
  aggregate['user_name'] = user['user_name'];
  aggregate['user_email'] = user['user_email'];
  aggregate['user_tagline'] = user['user_tagline'];
  aggregate['user_linkedin'] = user['user_linkedin'];

  aggregate['track_id'] = track['id'];
  aggregate['track_name'] = track['track_name'];
  aggregate['track_description'] = track['track_description'];
  return aggregate;
}
// Fetch videos
// Output: Video details, User details, Track details
function fetch_videos(){
  videos = data_model.Videos.all();
  users = data_model.Users.all();
  tracks = data_model.Tracks.all();

  var ret_detail = [];
  for(var i = 0; i < videos.length; i++){
    user_detail = fetch_detail(users, videos[i]['video_speaker_id']);
    track_detail = fetch_detail(tracks, videos[i]['video_track_ids']);
    loop_field = aggregate_video_details(videos[i], user_detail, track_detail);
    ret_detail.push(loop_field);
  }
  return ret_detail;
}

// Fetch Projects
// Output: Project details, User details, Track details
function fetch_projects(){
  projects = data_model.Projects.all();
  users = data_model.Users.all();
  tracks = data_model.Tracks.all();

  var ret_detail = [];
  for(var i = 0; i < projects.length; i++){
    console.log(i, projects[i]);
    user_detail = fetch_detail(users, projects[i]['project_owner_ids']);
    track_detail = fetch_detail(tracks, projects[i]['project_track_ids']);
    loop_field = aggregate_project_details(projects[i], user_detail, track_detail);
    ret_detail.push(loop_field);
  }
  return ret_detail;
}

// Fetch Videos by track
function fetch_videos_by_track(track_id){
  $.grep( fetch_videos(), function( n, i ) {
    return n.track_id === track_id;
  });
}

// Fetch Projects by track
function fetch_projects_by_track(track_id){
  $.grep( fetch_projects(), function( n, i ) {
    return n.track_id === track_id;
  });
}

function load_projects(){
    projects = fetch_projects();
    // $('#projects')
    //
    for(i = 0; i < projects.length; i++){
      var li = $('<li/>', {
    		 'class': 'project',
    		});
      var image = $('<img/>', {
        'src': projects[i]['project_image_url'],
        'width': '100%',
        'height': '200'
      });
      var title = $('<h1>',{
        html : projects[i]['project_title'],
      });
      var subtitle = $('<p>',{
        html: projects[i]['project_subtitle'],
      });
      var readMore = $('<a>', {
        'class': 'btn btn-default project-btn',
        'href': '#',
        html: 'View &rarr;'
      });

      readMore.appendTo(li);
      image.appendTo(li);
      title.appendTo(li);
      subtitle.appendTo(li);
      li.appendTo($('#projects ul'));
    }
}

// Called when tabletop loads the spreadsheet
function on_data_load(data, tabletop){
  data_model = data;
  sanity_check(data, tabletop);
  load_projects();
}

$(document).ready(function(){
  Tabletop.init( { key: public_spreadsheet_url,
                   callback: on_data_load } );
});
