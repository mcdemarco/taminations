/*

    Copyright 2012 Brad Christie

    This file is part of TAMinations.

    TAMinations is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    TAMinations is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with TAMinations.  If not, see <http://www.gnu.org/licenses/>.

 */
var currentmenu = 0;
var callnumber = -1;
var currentcall = "";
var titleob = 0;
var tamsvg = 0;
var cookie = 0;
var animationNumber = {};
var here = document.URL.split(/\?/)[0];
var search = document.URL.split(/\?/)[1];
var isSmall = false;
if (search != null)
  search = search.split(/\&/);
else
  search = [];
args = {};
for (var i=0; i<search.length; i++) {
  var arg1 = search[i].split(/=/);
  if (arg1.length > 1)
    args[arg1[0]] = arg1[1];
  else
    args[search[i]] = true;
}
var difficultText = [ ' <font color="blue">&diams;</font>',
                      ' <font color="red">&diams;&diams;</font>',
                      ' <font color="black">&diams;&diams;&diams;</font>' ];


// Body onload function
$(document).ready(
  function() {
    var w = (window.innerWidth ? window.innerWidth : document.body.clientWidth);
    if (w < 500)
      isSmall = true;
    $(".noshow").hide();
    //  These need to be set for component scrolling to work
    //$('html').height('100%');
    //$('body').height('100%');
    //  Load the menus
    $("body").prepend('<div style="width:100%; height:24px" id="menudiv"></div>');
    $("#menudiv").hide();  // so we don't flash all the menus
    $("#menuload").addClass("menutitle");
    //  Insert title
    if (!isSmall)
      $("body").prepend(getTitle());
    //  Build the document structure
    var htmlstr = '<table id="deftable" cellspacing="0" cellpadding="4" width="100%">'+
                    '<tr valign="top">'+
                      '<td width="40%">'+
                        '<div id="definition">'+
                          '<span class="level"></span>'+
                        '</div>'+
                      '</td>'+
                      '<td width="30%" class="animation"><div id="appletcontainer"></div></td>'+
                      '<td class="animation">'+
                        '<div id="animationlist"></div>'+
                      '</td>'+
                    '</tr>'+
                  '</table>';

    $("#menudiv").append('<table cellpadding="0" cellspacing="0" width="100%" summary="">'+
    '<tr></tr></table>');
    for (var m in tamination_menu) {
      var tm = tamination_menu[m];
      $('#menudiv tr:first').append('<td class="menutitle">'+tm.title+'<br/>'+
          '<div><table class="menu" cellpadding="0" cellspacing="0" summary="">'+
      '</table></div></td>');
      $('.menutitle:last').data('menu',m)
      $('.menutitle:last').click(function() {
        var tm = tamination_menu[$(this).data('menu')];
        var menuhtml = '';
        var rows = Math.floor((tm.menu.length + tm.columns - 1) / tm.columns);
        for (var r = 0; r < rows; r++) {
          menuhtml += '<tr>';
          for (var c = 0; c < tm.columns; c++) {
            var mi = c*rows + r;
            if (mi < tm.menu.length)
              menuhtml += '<td onclick="document.location=\'../'+
              tm.menu[mi].link+'\'">'+tm.menu[mi].text+'</td>';
          }
          menuhtml += '</tr>';
        }
        $('.menu',this).empty();
        $('.menu',this).append(menuhtml);
        $("div td",this).addClass("menuitem");
        $(".menuitem").hover(
            function() { $(this).addClass("menuitem-highlight"); },
            function() { $(this).removeClass("menuitem-highlight"); })
            .bind("mousedown",
                function() { return false; });

        //  Position off the screen to get the width without flashing it in the wrong position
        $("div",this).css("left","-1000px").show();
        var mw = $("div",this).width();
        var mh = $("div",this).height();
        var sw = $('body').width();
        var sh = $('body').height();
        var ml = $(this).offset().left;
        var mt = $(this).offset().top + $(this).height() + 4;
        //        Generally the menu goes below the title
        //        But if it pushes the menu off the right side of the screen shift it left
        if (ml+mw > sw)
          ml = sw - mw;
        //    and push it up if it flows below the screen
        if (mt+mh > sh)
          mt = sh - mh;
        $("td:has(applet)").addClass("invisible");  // need to hide the applet to see the menus
        $("div",this).css("top",mt+"px");
        $("div",this).css("left",ml+"px");
      });
    }

    //  Hide all the menus
    $(".menutitle > div").addClass("menutitlediv").hide();
    //  Remove any visible menus when user clicks elsewhere
    $(document).bind("mousedown",clearMenus);
    //  Everything's ready, show the menus
    $("#menuload").hide();
    if (!isSmall)
      $("#menudiv").show();

    sizeBody();
    //  Load XML documents that define the animations
    var docname = document.URL.match(/(\w+)\.html/)[1];
    $.ajax({url:docname+".xml",dataType:"xml",
      success:function(a) {
        $("#menudiv").after(htmlstr);
        animations = a;
        generateAnimations();
      },
    });
    //  end of menu load function

  });  // end of document ready function

function clearMenus()
{
  $(".menutitle > div").hide();
  $("td:has(applet)").removeClass("invisible");
}

//  Generate the title above the menus
function getTitle()
{
  return '<div class="title">' +
         '<a href="../../index.html">'+
         '<img height="72" border="0" align="right" src="../../badge.gif"></a>'+
         '<a href="../info/index.html">TAMinations</a></div>';
}

//Set height of page sections to fit the window
function sizeBody()
{
  var h = (window.innerHeight ? window.innerHeight : document.body.clientHeight);
  if (!isSmall)
    h -= 116;
  $('#definition').height(h);
  $('#calllist').height(h);
  $('#animationlist').height(h);
  $('#iframeleft').height(h);
  $('#iframeright').height(h);
}

function appletSize()
{
  var aw = 100;
  var ah = 100;
  var h = window.innerHeight ? window.innerHeight : document.body.offsetHeight;
  var w = window.innerWidth ? window.innerWidth : document.body.offsetWidth;
  if (typeof h == "number" && typeof w == "number") {
    if (isSmall)
      aw = ah = w;
    else {
      ah = h - 150;
      aw = (w * 30) / 100;
      if (ah * 350 > aw * 420)
        ah = (aw * 420) / 350;
    }
  }
  aw = Math.floor(aw);
  ah = Math.floor(ah);
  return { width: aw, height: ah };
}

function generateAnimations()
{
  var showDiffLegend = false;
  //  Put the call definition in the document structure
  $("#deftable").nextAll().appendTo("#definition");
  $("#radio1").attr("checked",true);
  $("#applet").width(appletSize().width+"px").height(appletSize().height+"px");
  //  Insert copyright
  $("#definition").append(getCopyright(document.URL));
  $("h2").prepend(getLevel());
  //  Build the selection list of animations
  var prevtitle = "";
  var prevgroup = "";
  $("#animationlist").empty();  //  disable to restore old animations
  $("tam",animations).each(function(n) {
    var callname = $(this).attr('title') + 'from' + $(this).attr('from');
    var name = $(this).attr('from');
    if ($(this).attr("group") != undefined) {
      if ($(this).attr("group") != prevgroup)
        $("#animationlist").append('<span class="callname">'+$(this).attr("group")+'</span><br />');
      name = $(this).attr('title').replace($(this).attr('group'),' ');
      callname = $(this).attr('title');
    }
    else if ($(this).attr("title") != prevtitle)
      $("#animationlist").append('<span class="callname">'+$(this).attr("title")+" from</span><br />");
    if ($(this).attr("difficulty") != undefined) {
      name = name + difficultText[Number($(this).attr("difficulty"))-1];
      showDiffLegend = true;
    }
    //  First replace strips "(DBD)" et al
    //  Second strips all non-alphanums, not valid in html ids
    callname = callname.replace(/ \(DBD.*/,"").replace(/\W/g,"");
    animationNumber[callname] = n;
    prevtitle = $(this).attr("title");
    prevgroup = $(this).attr('group');
    $('<input name="tamradio" type="radio" class="selectRadio"/>').appendTo("#animationlist")
      .click(function() { PickAnimation(n); });
    $("#animationlist").append('<a class="selectAnimation" href="javascript:PickAnimation('+n+')">'+
          name + '</a>');
    if ($("path",this).length == 2)
      $("#animationlist").append(' <span class="comment">(4 dancers)</span>');
    $("#animationlist").append('<br />');
  });
  $(".selectAnimation").hover(function() { $(this).addClass("selectHighlight"); },
                              function() { $(this).removeClass("selectHighlight"); });
  //  Add any comment below the animation list
  $('#animationlist').append('<br /><div id="comment" class="comment">' +
                      $('comment *',animations).text() + '</div>');
  //  Load saved options from browser cookie
  cookie = new Cookie(document,"TAMination",365*24,'/');
  cookie.load();
  //  Passed-in arg overrides cookie
  if (args.svg == 'false' || args.svg == 'true') {
    cookie.svg = args.svg;
    cookie.store();
  }
  if (showDiffLegend)
    $('#animationlist').append(
        difficultText[0]+' Common - New dancers should look at these.<br/>'+
        difficultText[1]+' More difficult - For more experienced dancers.<br/>'+
        difficultText[2]+' Most difficult - For expert dancers.<br/><br/>'
        );
  var cansvg = !$.browser.msie || $.browser.version > 8;
  if (cansvg && cookie.svg == 'false')
    $('#animationlist').append('Problems with Java? Try the <a href="'+
                               here+'?svg=true">SVG animation</a>.');
  //  If a specific animation is requested in the URL, switch to it
  callnumber = 0;
  callname = '';
  for (var arg in args) {
    if (animationNumber[arg] != undefined) {
      callnumber = animationNumber[arg];
      callname = arg;
    }
  }
  //  Insert the applet
  if ($("tam",animations).size() > 0) {
    $('#appletcontainer').height($('#appletcontainer').width()+100);
    //  For non-MSIE, SVG is now the default
    if (cansvg && cookie.svg != 'false') {
      TAMination(0,animations,callname,'');
      var dims = appletSize();
      var svgdim = dims.width;
      appletstr='<div id="svgdiv" '+
                'style="width:'+svgdim+'px; height:'+svgdim+'px;"></div>';
      $("#appletcontainer").append(appletstr);
      $('#svgdiv').svg({onLoad:TamSVG});
    }
    else
      TAMination('appletcontainer',animations,callname,'');
    if ($('tam',animations).size() <= 0) {
      appletstr = '<p style="margin: 20px">No animation for this call.</p>';
    }
    $('#appletcontainer').after('<div id="taminatorsays"></div>');
    //  Make sure the 1st radio button is turned on
    if ($(".selectRadio").get(callnumber))
      $(".selectRadio").get(callnumber).checked = true;
    $("#animationlist > a").eq(callnumber).addClass("selectedHighlight");
    $("#animationlist > a").eq(callnumber).prevAll('.callname:first').addClass("selectedHighlight");
    //  Size document components so scroll bars work ok
    currentcall = $('tam',animations).eq(callnumber)
        .attr("title").replace(/ \(DBD.*/,"").replace(/\W/g,"");
  } else {
    //  no animations
    $('#appletcontainer').append("<h3><center>No animation for this call.</center></h3>");
  }
  sizeBody();
  showTAMinator(callnumber);
  if (tamsvg)
    generateButtonPanel();
  //  For a small screen, show just the animation selection
  if (isSmall) {
    $('td:has(#definition)').hide();
    $('td:has(#appletcontainer)').hide();
    $('td:has(#animationlist)').show();
  }
}


function PickAnimation(n)
{
  //  For a small screen, switch to the animation
  if (isSmall) {
    $('td:has(#definition)').hide();
    $('td:has(#appletcontainer)').show();
    $('td:has(#animationlist)').hide();
  }
  SelectAnimation(n);
  if (tamsvg) {
    tamsvg.stop();
    $('#appletcontainer').empty();
    $('#svgdiv').empty();
    var dims = appletSize();
    var svgdim = dims.width;
    appletstr='<div id="svgdiv" '+
              'style="width:'+svgdim+'px; height:'+svgdim+'px;"></div>';
    $("#appletcontainer").append(appletstr);
    $('#svgdiv').svg({onLoad:TamSVG});
  }
  $('.selectedHighlight').removeClass("selectedHighlight");
  $("#animationlist > a").eq(n).addClass("selectedHighlight");
  $(".selectRadio").get(n).checked = true;
  //  Note that :first gets the 'first previous' when used with prevAll
  $("#animationlist > a").eq(n).prevAll('.callname:first').addClass("selectedHighlight");
  if (tamsvg)
    generateButtonPanel();
  //  Show any comments below the animation
  showTAMinator(n);
}

//Show one specific TAMinator comment
function showTAMinator(n)
{
  $('#taminatorsays').empty();
  var tamsays = false;
  if ($('tam',animations).eq(n).find('taminator').size() > 0) {
    tamsays = $('tam',animations).eq(n).find('taminator').text();
  } else if (Math.random() > 0.8) {
    var tipnum = Math.floor(Math.random()*tips.length);
    tamsays = 'Tip: '+tips[tipnum];
  }
  if (tamsays) {
    $('#taminatorsays').append('<img src="../taminator.gif" />')
                       .append('<img src="../thetaminatorsays.gif" />')
                       .append('<p class="styling" id="taminatorquote"></p>');
    if (typeof tamsays == 'string')
      $('#taminatorquote').append(tamsays);
    else
      tamsays.appendTo('#taminatorquote');
    var h = (window.innerHeight ? window.innerHeight : document.body.clientHeight)
            -appletSize().height - 116;
    $('#taminatorsays').height(h);
  }
}


function getLevel()
{
  var levelstring = " ";
  if (document.URL.match(/\/ms\//))
    levelstring = "Mainstream";
  if (document.URL.match(/\/plus\//))
    levelstring = "Plus";
  if (document.URL.match(/\/adv\//))
    levelstring = "Advanced";
  if (document.URL.match(/\/c1\//))
    levelstring = "C-1";
  if (document.URL.match(/\/c2\//))
    levelstring = "C-2";
  if (document.URL.match(/\/c3a\//))
    levelstring = "C-3A";
  return '<span class="level">'+levelstring+'</span>';
}

var tips = [
  "Right click on a dancer for special features.",
  "You can move the animation manually by dragging the slider.",
  "You can move the animation manually with the mouse wheel.",
  "Control the animation speed with the Slow and Fast buttons.",
  "Show all dancer paths with the Paths button.",
  "Use the Loop button to run the animation repeatedly."
];