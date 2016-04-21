function is_unique(arr){
  var results = [];
  for (var i = 0; i < arr.length - 1; i++) {
      if (arr[i + 1] == arr[i]) {
          results.push(arr[i]);
      }
  }
  if(results.length == 0)
    return true;
  return false;
}

function fetch_ids(model){
  var ids = [];
  for(i = 0; i < model.length; i++){
    ids.push(model[i]['id']);
  }
  return ids.sort();
}

function check_if_unique(data){
  projects = data.Projects.all();
  users = data.Users.all();
  tracks = data.Tracks.all();
  videos = data.Videos.all();

  var is_unique_flag = is_unique(fetch_ids(projects))
                        && is_unique(fetch_ids(users))
                        && is_unique(fetch_ids(tracks))
                        && is_unique(fetch_ids(videos));
  if(!is_unique_flag)
    alert("The IDs are not unique, check the file");
}

function check_ids_exist(data){
  user_ids = fetch_ids(data.Users.all());
  track_ids = fetch_ids(data.Tracks.all());

  projects = data.Projects.all();
  videos = data.Videos.all();

  for(i = 0; i < projects.length; i++){
    if(($.inArray( projects[i]['project_owner_ids'], user_ids ) == -1)
      ||($.inArray( projects[i]['project_track_ids'], track_ids ) == -1))
      alert("Project owner/Track ID does not exist");
  }

  for(i = 0; i < videos.length; i++){
    if(($.inArray( videos[i]['video_speaker_id'], user_ids ) == -1)
      ||($.inArray( videos[i]['video_track_ids'], track_ids ) == -1))
      alert("Video owner/Track ID does not exist");
  }
}

function sanity_check(data, tabletop) {
  check_if_unique(data);
  check_ids_exist(data);
}
