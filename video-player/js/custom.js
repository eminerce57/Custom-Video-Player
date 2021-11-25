$(".custom-video-area").each(function() {
    
    var $video_container = $(this);
    var $video = $(this).find("#video-element");
  
    // Video Controls root
    var $video_controls = $(this).find(".video-controls");
    var $button_controls = $(this).find(".bottom-wrapper");
    var $progress_bar = $(this).find(".progress-bar");
    var $progress = $(this).find(".time-bar");
    var $buffer_bar = $(this).find(".buffer-bar");
    var $play_button = $(this).find("#play-button");
    var $mute_button = $(this).find("#sound-button");
    var $volume_wrapper = $(this).find(".volume");
    var $volume_bar = $(this).find(".volume-bar");
    var $full_screen_btn = $(this).find("#btnFS");
    var $current = $(this).find(".current");
    var $duration = $(this).find(".duration");
    var $fast_fwd = $(this).find("#fastFwd");
  
  
    function playVideo() {




     
      if ($video[0].paused) {
        $video[0].play();
        $video_controls.addClass("playing");
        $("#play-button").attr("class","feather-pause");
  
        if ($video_container.parents(".video-header").length) {
          $video_container.parents(".video-header").addClass("playing");
        
        }
      } else {
        $video[0].pause();
        $video_controls.removeClass("playing");
        $("#play-button").attr("class","feather-play");
        $video_container.parents(".video-header").removeClass("playing");
      }
    }
  
    function updateVolume(x, vol) {
      if (vol) {
        $percentage = vol * 100;
      } else {
        $position = x - $volume_wrapper.offset().left;
        $percentage = 100 * $position / $volume_wrapper.width();
      }
  
      if ($percentage > 100) {
        $percentage = 100;
      }
      if ($percentage < 0) {
        $percentage = 0;
      }
  
      //volume
      $volume_bar.css("width", $percentage + "%");
      $video[0].volume = $percentage / 100;
  
      if ($video[0].volume == 0) {
        $mute_button.removeClass("feather-volume-2").addClass("feather-volume");
      } else if ($video[0].volume > 0.5) {
        $mute_button.removeClass("feather-volume").addClass("feather-volume-2");
      } else {
        $mute_button.addClass("feather-volume");
        // $mute_button.removeClass("feather-volume").removeClass("feather-volume");
      }
    }
  
    function changeSpeed() {
      if ($video[0].playbackRate === 1) {
        $video[0].playbackRate = 2;
        $fast_fwd.text("2x Speed");
      } else if ($video[0].playbackRate === 2) {
        $video[0].playbackRate = 1;
        $fast_fwd.text("1x Speed");
      }
    }
  
    function launchFullscreen() {
      if ($video[0].requestFullscreen) {
        $video[0].requestFullscreen();
      } else if ($video[0].mozRequestFullScreen) {
        $video[0].mozRequestFullScreen();
      } else if ($video[0].webkitRequestFullscreen) {
        $video[0].webkitRequestFullscreen();
      } else if ($video[0].msRequestFullscreen) {
        $video[0].msRequestFullscreen();
      }
    }
  
    function time_format(seconds) {
      var m = Math.floor(seconds / 60) < 10
        ? "0" + Math.floor(seconds / 60)
        : Math.floor(seconds / 60);
      var s = Math.floor(seconds - m * 60) < 10
        ? "0" + Math.floor(seconds - m * 60)
        : Math.floor(seconds - m * 60);
      return m + ":" + s;
    }
  
    function startBuffer() {
      $current_buffer = $video[0].buffered.end(0);
      $max_duration = $video[0].duration;
      $perc = 100 * $current_buffer / $max_duration;
      $buffer_bar.css("width", $perc + "%");
  
      if ($current_buffer < $max_duration) {
        setTimeout(startBuffer, 500);
      }
    }
  
    function updatebar(x) {
      $position = x - $progress.offset().left;
      $percentage = 100 * $position / $progress_bar.width();
      if ($percentage > 100) {
        $percentage = 100;
      }
      if ($percentage < 0) {
        $percentage = 0;
      }
      $progress.css("width", $percentage + "%");
      $video[0].currentTime = $video[0].duration * $percentage / 100;
    }
  
    $video.on("loadedmetadata", function() {
      $current.text(time_format(0));
      $duration.text(time_format($video[0].duration));
      updateVolume(0, 0.7);
      setTimeout(startBuffer, 150);
    });
  
    // play/pause
    $video.click(function() {
      playVideo();
    });
  
    // time
    $video.on("timeupdate", function() {
      $current.text(time_format($video[0].currentTime));
      $duration.text(time_format($video[0].duration));
      var currentPos = $video[0].currentTime;
      var maxduration = $video[0].duration;
      var perc = 100 * $video[0].currentTime / $video[0].duration;
      $progress.css("width", perc + "%");
    });
  

    $video_container.on("mouseleave", function() {
      if ($video[0].paused === false) {
        $video_container.addClass("playing");
      }
    });
  

    $video_container.on("mouseover", function() {});
  
    // Play/pause on button click
    $play_button.click(function() {
      playVideo();
    });
  
    // Fast 
    $fast_fwd.click(function() {
      changeSpeed();
    });
  
    // Volume 
    var volumeDrag = false;
    $volume_wrapper.on("mousedown", function(e) {
      volumeDrag = true;
      $video[0].muted = false;
      $mute_button.removeClass("muted");
      updateVolume(e.pageX);
    });
  
    $(document).on("mouseup", function(e) {
      if (volumeDrag) {
        volumeDrag = false;
        updateVolume(e.pageX);
      }
    });
  
    $(document).on("mousemove", function(e) {
      if (volumeDrag) {
        updateVolume(e.pageX);
      }
    });
  

    $mute_button.click(function() {
      $video[0].muted = !$video[0].muted;
  
      if ($video[0].muted) {
        $volume_bar.css("width", 0);
        $mute_button.removeClass("feather-volume-2").addClass("feather-volume");
      } else {
        $volume_bar.css("width", $video[0].volume * 100 + "%");
        $mute_button.removeClass("feather-volume").addClass("feather-volume-2");
      }
    });
  
    // Full Screen Button
    $full_screen_btn.click(function() {
      launchFullscreen();
    });
  
    var timeDrag = false; 
    $progress_bar.on("mousedown", function(e) {
      timeDrag = true;
      updatebar(e.pageX);
    });
    $(document).on("mouseup", function(e) {
      if (timeDrag) {
        timeDrag = false;
        updatebar(e.pageX);
      }
    });
    $(document).on("mousemove", function(e) {
      if (timeDrag) {
        updatebar(e.pageX);
      }
    });
  

  });

  // dropdown toggle
  function setting(){
$(".drop-custom").toggleClass('visible');
  }
// RADİO BUTTON QUALİTY SELECT
  $('input[type=radio]').change(function() {
    if (this.value == '720') {


      $("#video-element").html("    <source id='video-source'   src='assets/video.mp4'>");
      document.getElementById("video-element").load();
    }
    if (this.value == '480') {
    
      $("#video-element").html("    <source id='video-source'   src='assets/video480.mp4'>");
      document.getElementById("video-element").load();
    }
     if (this.value == '360') {

      $("#video-element").html("    <source id='video-source'   src='assets/video360.mp4'>");
      document.getElementById("video-element").load();

    }

});


$(function() {



});