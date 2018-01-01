(function (){
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function getSound(key){
    var sound = document.getElementById('sound-' + key);
    if(typeof sound != null){
      return sound;
    } else {
      console.log("no sound: " + key);
      return false;
    }
  }
  $(document).ready(function(){
    var currentSound;
    var currentSoundKey;
    var playing = false;
    var afinazioa = "BbEb";
    
    var norabidea = "ireki";
    
    //Verificamos si es mobil.
    var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
  	if(isMobile) { var evtListener = ['touchstart', 'touchend']; } else { var evtListener = ['mousedown', 'mouseup']; }
    //  console.log('start');
    
    var classes = {
      colorItxi:'color-itxi',
      colorIreki:'color-ireki',
      pianoActive:'piano-active',
      pianoNone:'piano-none'
    }
    
    var trikiMouseDownEv = function(e){
      var nota = $(this);
      var trikiZenbakia = nota.data('zenbakia');
      var notaMap = notakMap[afinazioa][trikiZenbakia];
      if(norabidea == "biak"){
        var pianoZenbakiaItxi = notaMap["KeyItxi"];
        $(".piano-nota[data-key='" + pianoZenbakiaItxi + "']").addClass(classes.colorItxi);
        var pianoZenbakiaIreki = notaMap["KeyIreki"];
        $(".piano-nota[data-key='" + pianoZenbakiaIreki + "']").addClass(classes.colorIreki);
      } else {
        var pianoZenbakia = notaMap["Key" + capitalizeFirstLetter(norabidea)];
        $(".piano-nota[data-key='" + pianoZenbakia + "']").addClass(classes.pianoActive);
      }
      
    }
    var trikiMouseUpEv = function(e){
      var nota = $(this);
      var trikiZenbakia = nota.data('zenbakia');
      var notaMap = notakMap[afinazioa][trikiZenbakia];

      if(norabidea == "biak"){
        var pianoZenbakiaItxi = notaMap["KeyItxi"];
        $(".piano-nota[data-key='" + pianoZenbakiaItxi + "']").removeClass(classes.colorItxi);
        var pianoZenbakiaIreki = notaMap["KeyIreki"];
        $(".piano-nota[data-key='" + pianoZenbakiaIreki + "']").removeClass(classes.colorIreki);
      } else {
        var pianoZenbakia = notaMap["Key" + capitalizeFirstLetter(norabidea)];
        $(".piano-nota[data-key='" + pianoZenbakia + "']").removeClass(classes.pianoActive);
      }
    }
    var pianoMouseDownEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      if($(".triki-nota[data-keyitxi='" + pianoZenbakia + "']").length == 0 && $(".triki-nota[data-keyireki='" + pianoZenbakia + "']").length == 0){
        nota.addClass(classes.pianoNone);
      }
      $(".triki-nota[data-keyitxi='" + pianoZenbakia + "']").addClass(classes.colorItxi);
      $(".triki-nota[data-keyireki='" + pianoZenbakia + "']").addClass(classes.colorIreki);
      var sound = getSound(pianoNota);
      if(sound){
    
          sound.currentTime = 0;
          sound.volume = 1.0;
          sound.play();
          
          currentSound = sound;
          currentSoundKey = pianoNota;
      } else {
        currentSound = false;
      }
    }
    var pianoMouseUpEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      if($(".triki-nota[data-keyitxi='" + pianoZenbakia + "']").length == 0 && $(".triki-nota[data-keyireki='" + pianoZenbakia + "']").length == 0){
        nota.removeClass(classes.pianoNone);
      }
      $(".triki-nota[data-keyitxi='" + pianoZenbakia + "']").removeClass(classes.colorItxi);
      $(".triki-nota[data-keyireki='" + pianoZenbakia + "']").removeClass(classes.colorIreki);
      if(currentSound){
          currentSound.pause();
      }
    


    }
    
    
    var notakMap;
    var notaMapLoaded = false;
    
    //Cargamos el JSON
    $.getJSON("Notak.json",function(data){
      notakMap = data;
      notaMapLoaded = true;
      _.forEach(notakMap[afinazioa],function(element,index){
        _.forEach(element,function(value,key){
          //ponemos todos los valores de cada nota como attribute.
            $('.triki-nota[data-zenbakia=' + element.Zenbakia + ']').attr('data-' + key.toLowerCase(),value);
          });
      
        });
      //Bindeamos los eventos.
      $('.triki-nota').on(evtListener[0],trikiMouseDownEv).on(evtListener[1],trikiMouseUpEv);
      $('.piano-nota').on(evtListener[0],pianoMouseDownEv).on(evtListener[1],pianoMouseUpEv);
      $('.btn').click(function(){
        if(!$(this).hasClass('active')){
          $(".btn.active").removeClass("color-" + $(".btn.active").data('action'));
          var action = $(this).data('action');
          norabidea = action;
          $(".btn").removeClass('active');
          $(this).addClass('active').addClass('color-' + action);
        }
      });
    
      })
    .fail(function() {
      console.log( "JSON error" );
    });
  
  });
  
})()