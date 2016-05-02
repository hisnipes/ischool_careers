
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/18ZE7q38ce1jsqNekTzw1lklHe2wm1N0S407SCmBNQqM/pubhtml';
var data_model;

// Helper function to fetch details
function fetch_detail(model, val, key){
  for(var i = 0; i < model.length; i++){
    if(model[i][key] == val)
      return model[i];
  }
}

// Helper function to aggregate details
function aggregate_project_details(project, user, track, skill){
  aggregate = {};

  aggregate['project_title'] = project['project_title']
  aggregate['project_subtitle'] = project['project_subtitle']
  aggregate['project_media_url'] = project['project_media_url']
  aggregate['project_image_url'] = project['project_image_url']
  aggregate['project_article'] = project['project_article']

  aggregate['user_name'] = user['user_name'];
  aggregate['user_email'] = user['user_email'];
  aggregate['user_tagline'] = user['user_tagline'];
  aggregate['user_linkedin'] = user['user_linkedin'];

  aggregate['track_name'] = track['track_name'];
  aggregate['track_description'] = track['track_description'];

  aggregate['skill_name'] = skill['skill_name'];
  aggregate['skill_description'] = skill['skill_description'];

  return aggregate;
}

// Helper function to aggregate details
function aggregate_video_details(video, user, track){
  aggregate = {};

  aggregate['video_title'] = video['video_title']
  aggregate['video_text'] = video['video_text']
  aggregate['video_url'] = video['video_url']

  aggregate['user_id'] = user['id'];
  aggregate['user_name'] = user['user_name'];
  aggregate['user_email'] = user['user_email'];
  aggregate['user_tagline'] = user['user_tagline'];
  aggregate['user_linkedin'] = user['user_linkedin'];

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
    user_detail = fetch_detail(users, videos[i]['video_speaker_id'], 'user_name');
    track_detail = fetch_detail(tracks, videos[i]['video_track_ids'], 'track_name');
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
  skills = data_model.Skills.all();

  var ret_detail = [];
  for(var i = 0; i < projects.length; i++){
    // console.log(i, projects[i]);
    user_detail = fetch_detail(users, projects[i]['project_owner_ids'], 'user_name');
    track_detail = fetch_detail(tracks, projects[i]['project_track_ids'], 'track_name');
    skill_detail = fetch_detail(skills, projects[i]['project_skills'], 'skill_name');
    loop_field = aggregate_project_details(projects[i], user_detail, track_detail, skill_detail);
    ret_detail.push(loop_field);
  }
  return ret_detail;
}

// Automatically populate filters in sidebar based on data
function get_all_skills() {
  projects = data_model.Projects.all();
  var all_skills = [];
  for (var i = 0; i < projects.length; i++){
    all_skills.push(projects[i]['project_skills']);
  }
  all_skills = jQuery.unique(all_skills);

  console.log("all_skills", all_skills);

  var all_skills_proper = [];
  for (var i = 0; i < all_skills.length; i++){
    skill = all_skills[i];
    skill = toTitleCase(skill.replace("-"," "));
    all_skills_proper.push(skill);
  };

  console.log("all_skills_proper", all_skills_proper);

  for (i = 0; i < all_skills_proper.length; i++){
    var li = $('<li/>', {
    });
    var skillLink = $('<a/>', {
      'class': 'filter',
      'href': '#',
      'data-filter': '.' + all_skills[i],
      html: all_skills_proper[i]
    });
    skillLink.click({skill_name: all_skills[i]}, function(event){
      var projects = fetch_projects_by_skill(event.data.skill_name);
      load_projects(projects);
      return false;
    });
    skillLink.appendTo(li);
    li.appendTo($(".sidebar ul"));
  }
// ex: <li><a href="#" class="filter" data-filter=".data-science">Data Science</a></li>
}

  // Title Case helper function
  function toTitleCase(string) {
      // \u00C0-\u00ff for a happy Latin-1
      return string.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
          return initial.toUpperCase();
      }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
          return match.toLowerCase();
      });
  }

// Fetch Videos by track
function fetch_videos_by_track(track_id){
  $.grep( fetch_videos(), function( n, i ) {
    return n.track_id === track_id;
  });
}


// Fetch Videos by track
function fetch_videos_by_speaker(owner_name){
  $.grep( fetch_videos(), function( n, i ) {
    return n.video_speaker_id === owner_name;
  });
}

// Fetch Projects by track
function fetch_projects_by_skill(skill_name){
  var all_projects = fetch_projects();
  matched_projects = [];
  $.grep( all_projects, function( n, i ) {
    if(n.skill_name === skill_name)
      matched_projects.push(n);
  });
  return matched_projects;
}

function load_projects(projects){
    projects = data_model.Projects.all();
    $('#projects ul').empty();
    for(var i = 0; i < projects.length; i++){
      var li = $('<li/>', {
    		'class': 'project ' + "mix " + projects[i]['project_skills'],
        'data-myorder': i,
    		});
      var outerDiv = $('<div/>', {
        'class': 'project-caption-wrapper',
      });
      var innerDiv = $('<div/>', {
        'class': 'project-caption',
      });
      var image = $('<img/>', {
        'src': projects[i]['project_image_url'],
        'width': '100%',
        'height': '180'
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
      title.appendTo(li);
      image.appendTo(li);
      subtitle.appendTo(innerDiv);
      innerDiv.appendTo(outerDiv);
      outerDiv.appendTo(li);
      li.appendTo($('#projects ul'));
    }
}

function get_n_randoms(model, n){
  var rands = [];
  var ret_model = [];
  rands.push(Math.floor((Math.random() * model.length)));
  var counter = 1;
  while(1){
    var rand_index = Math.floor((Math.random() * model.length));
    if($.inArray(rand_index, rands) === -1){
      rands.push(rand_index);
      counter = counter + 1;
      if(counter == n)
        break;
    }
  }
  for(var i = 0; i < rands.length; i++){
    ret_model.push(model[rands[i]]);
  }
  console.log(ret_model);
  return ret_model;
}


function get_spotlight_students(){
  users = data_model.Users.all();
  spot_users = get_n_randoms(users, 3);
  $('#student_spotlight_1_name').html(spot_users[0].user_name + ", ");
  $('#student_spotlight_1_year').html(spot_users[0].user_details);
  $('#student_spotlight_1_subtext').html(spot_users[0].user_tagline);

  $('#student_spotlight_2_name').html(spot_users[1].user_name + ", ");
  $('#student_spotlight_2_year').html(spot_users[1].user_details);  
  $('#student_spotlight_2_subtext').html(spot_users[1].user_tagline);

  var video_url = fetch_videos_by_speaker(spot_users[0].user_name);
  console.log(video_url);
  $('#student_spotlight_1_video').attr('href', video_url);

  video_url = fetch_videos_by_speaker(spot_users[1].user_name);
  console.log(video_url);
  $('#student_spotlight_2_video').attr('href', video_url);
}

function get_spotlight_projects(){
  projects = data_model.Projects.all();
  spot_projects =  get_2_randoms(projects);

  $('#project_spotlight_1_subtitle').html(spot_projects[0].project_subtitle);
  document.getElementById('project_spotlight_1').style.backgroundImage = "url(" + spot_projects[0].project_image_url + ")";
  $('#project_spotlight_1_title').html(spot_projects[0].project_title);
  $('#project_spotlight_1_article').html(spot_projects[0].project_article);
  document.getElementById('project_spotlight_1_btn').href = spot_projects[0].project_media_url;

  $('#project_spotlight_2_subtitle').html(spot_projects[1].project_subtitle);
  document.getElementById('project_spotlight_2').style.backgroundImage = "url(" + spot_projects[1].project_image_url + ")";
  $('#project_spotlight_2_title').html(spot_projects[1].project_title);
  $('#project_spotlight_2_article').html(spot_projects[1].project_article);
  document.getElementById('project_spotlight_2_btn').href = spot_projects[1].project_media_url;

}
// Called when tabletop loads the spreadsheet
function on_data_load(data, tabletop){
  data_model = data;
  get_all_skills();
  get_spotlight_students();
  get_spotlight_projects();
  load_projects(fetch_projects());
  $('#projects').mixItUp();
}

$(document).ready(function(){
  Tabletop.init( { key: public_spreadsheet_url,
                   callback: on_data_load } );
});
