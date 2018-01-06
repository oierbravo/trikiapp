(function (){
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function note2MIDInumber(note) {
    var noteValue = {
      A:9,
      B:11,
      C:0,
      D:2,
      E:4,
      F:5,
      G:7
    }
    var output;
    if(note.length == 2){
      output = 12 + parseInt(noteValue[note.charAt(0)]) + 12 * parseInt(note.charAt(1));
    } else if(note.length == 3) {
      output = 12 + parseInt(noteValue[note.charAt(0)]) + 1 + 12 * parseInt(note.charAt(2));
    } else {
        output = '@#';
    }
    return output;
  }
  $(document).ready(function(){
    var sounds = {}

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
        //var pianoZenbakiaItxi = notaMap["KeyItxi"];
        var pianoNotaItxi = nota.data('itxi');

        $(".piano-nota[data-nota='" + pianoNotaItxi + "']").addClass(classes.colorItxi);
          var pianoNotaIreki = nota.data('ireki');

        $(".piano-nota[data-nota='" + pianoNotaIreki + "']").addClass(classes.colorIreki);
        sounds[trikiZenbakia].itxi.seek(0);
        sounds[trikiZenbakia].itxi.play();
        sounds[trikiZenbakia].ireki.seek(0);
        sounds[trikiZenbakia].ireki.play();
      } else {
        //var pianoZenbakia = notaMap["Key" + capitalizeFirstLetter(norabidea)];
        var pianoZenbakia = nota.data(norabidea);
        $(".piano-nota[data-nota='" + pianoZenbakia + "']").addClass(classes.pianoActive);
        sounds[trikiZenbakia][norabidea].seek(0);
        sounds[trikiZenbakia][norabidea].play();
      }




    }
    var trikiMouseUpEv = function(e){
      var nota = $(this);
      var trikiZenbakia = nota.data('zenbakia');
      var notaMap = notakMap[afinazioa][trikiZenbakia];

      if(norabidea == "biak"){
        var pianoNotaItxi = nota.data('itxi');
        $(".piano-nota[data-nota='" + pianoNotaItxi + "']").removeClass(classes.colorItxi);
        //var pianoZenbakiaIreki = notaMap["KeyIreki"];
        var pianoNotaIreki = nota.data('ireki');
        $(".piano-nota[data-nota='" + pianoNotaIreki + "']").removeClass(classes.colorIreki);

        sounds[trikiZenbakia].itxi.stop();
        sounds[trikiZenbakia].ireki.stop();;
      } else {
        var pianoNota = nota.data(norabidea);
        $(".piano-nota[data-nota='" + pianoNota + "']").removeClass(classes.pianoActive);
        sounds[trikiZenbakia][norabidea].stop();
      }


    }
    var pianoMouseDownEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      if($(".triki-nota[data-keyitxi='" + pianoNota + "']").length == 0 && $(".triki-nota[data-keyireki='" + pianoZenbakia + "']").length == 0){
        nota.addClass(classes.pianoNone);
      }
      $(".triki-nota[data-nota='" + pianoNota + "']").addClass(classes.colorItxi);
      $(".triki-nota[data-nota='" + pianoNota + "']").addClass(classes.colorIreki);

    }
    var pianoMouseUpEv = function(e){
      var nota = $(this);
      var pianoZenbakia = nota.data('key');
      var pianoNota = nota.data('nota');
      if($(".triki-nota[data-keyitxi='" + pianoZenbakia + "']").length == 0 && $(".triki-nota[data-keyireki='" + pianoZenbakia + "']").length == 0){
        nota.removeClass(classes.pianoNone);
      }
      $(".triki-nota[data-nota='" + pianoNota + "']").removeClass(classes.colorItxi);
      $(".triki-nota[data-nota='" + pianoNota + "']").removeClass(classes.colorIreki);

    }


    var notakMap;
    var notaMapLoaded = false;

    //Cargamos el JSON
    $.getJSON("Notak.json",function(data){
      notakMap = data;
      notaMapLoaded = true;
      _.forEach(notakMap[afinazioa],function(element,index){
        var soundIreki = new Howl({
          src: ['./samples/triki/' + element.Zenbakia + ' - Ireki.ogg']
        });
        var soundItxi = new Howl({
          src: ['./samples/triki/' + element.Zenbakia + ' - Itxi.ogg']
        });
        sounds[element.Zenbakia] = {
          ireki:soundIreki,
          itxi:soundItxi,
        }
        var keyItxi = note2MIDInumber(element.Itxi);
        var keyIreki = note2MIDInumber(element.Ireki);
        notakMap[afinazioa][element.Zenbakia].KeyItxi = keyItxi;
        notakMap[afinazioa][element.Zenbakia].keyIreki = keyIreki;
        $('.triki-nota[data-zenbakia=' + element.Zenbakia + ']').attr('data-keyitxi',keyItxi);
        $('.triki-nota[data-zenbakia=' + element.Zenbakia + ']').attr('data-keyireki',keyIreki);
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
