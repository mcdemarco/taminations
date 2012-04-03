/*

    Copyright 2011 Brad Christie

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

var animations = 0;
var formations = 0;
var paths = 0;


//  This is executed when this file is read
//  Load JSON files defining formations and movements
var prefix = '';
if (document.URL.match(/\b(info|ms|plus|adv|c1|c2|c3a)\b/))
  prefix = '../';
if (document.URL.match(/tamination.embed/))
  prefix = '';
$.holdReady(true);
$.getJSON(prefix+"formations.json",function(data) {
  formations = data;
  $.holdReady(false);
});
$.holdReady(true);
$.getJSON(prefix+"movements.json",function(data) {
  paths = data;
  $.holdReady(false);
});


var TAMination = window.TAMination = function(elemid,xmldoc,call,params)
{
  var elem = document.getElementById(elemid);
  return this instanceof TAMination ?
      this.init(elem,xmldoc,call,params) :
      new TAMination(elemid,xmldoc,call,params);
}
var tam;
TAMination.prototype = {
  init: function(elem,xmldoc,call,params)
  {
    tam = this;
    tam.xmldoc = xmldoc;
    tam.callnum = 0;
    tam.call = call;
    $("tam",tam.xmldoc).each(function(n) {
      var str = $(this).attr("title") + "from" + $(this).attr("from");
      if ($(this).attr("group") != undefined)
        str = $(this).attr("title");
      //  First replace strips "(DBD)" et al
      //  Second strips all non-alphanums, not valid in html ids
      str = str.replace(/ \(DBD.*/,"").replace(/\W/g,"");
      if (str.toLowerCase() == tam.call.toLowerCase())
        tam.callnum = n;
    });
    var f = tam.getFormation(xmldoc);
    var parts = tam.getParts();
    if (elem) {
      //  IE has a hard time finding the applet, it needs to be told exacty where it is
      var archive = document.URL.replace(/(embed|info|ms|plus|adv|c1|c2|c3a).*/,"TAMination.jar");
      var appletstr = '<applet id="applet" code="TAMination" archive="'+archive+'" '+
      'width="'+elem.offsetWidth+'" '+
      'height="'+elem.offsetHeight+'" '+
      'mayscript="true">'+
      '<param name="archive" value="'+archive+'" />'+
      '<param name="java_code" value="TAMination" />'+
      '<param name="java_type" value="application/x-java-applet;jpi-version=1.3" />'+
      '<param name="parts" value="'+parts+'" />'+
      '<param name="appwidth" value="'+elem.offsetWidth+'" />'+
      '<param name="appheight" value="'+elem.offsetHeight+'" />'+
      '<param name="scriptable" value="true" />'+
      '<param name="formation" value="'+f+'" />';
      if (params.play != undefined)
        appletstr += '<param name="play" value="true" />';
      if (params.loop != undefined)
        appletstr += '<param name="loop" value="true" />';
      if (params.phantoms != undefined)
        appletstr += '<param name="phantoms" value="true" />';
      if (params.grid != undefined)
        appletstr += '<param name="grid" value="true" />';
      if (params.paths != undefined)
        appletstr += '<param name="paths" value="true" />';
      if (params.hexagon != undefined)
        appletstr += '<param name="hexagon" value="true" />';
      var p = tam.getPath(tam.xmldoc);
      for (var i=0; i<p.length; i++) {
        var str = '';
        for (var j=0; j<p[i].length; j++)
          str += movementToString(p[i][j]);
        appletstr += '<param name="dance'+(i+1)+'" value="'+str+'" />';
      }
      appletstr +=
        'Sorry, you need to <a href="http://java.com/">download Java</a> to view TAMinations.'+
        '</applet>';
      elem.innerHTML = appletstr;
    }
  },

  getFormation: function(xmldoc)
  {
    var a= $("tam",xmldoc).eq(this.callnum);
    var retval = a.attr('formation');
    if (retval && retval.indexOf('Formation') != 0)
      retval = formations[retval];
    return retval;
  },

  attrs: [ "select", "hands", "reflect" ],
  numattrs: [ "beats", "scaleX", "scaleY", "offsetX", "offsetY",
              "cx1", "cy1", "cx2", "cy2", "x2", "y2",
              "cx3", "cx4", "cy4", "x4", "y4" ],

  getParts: function()
  {
    var a = $("tam",this.xmldoc).eq(this.callnum);
    return a.attr("parts") ? a.attr("parts") : '';
  },

  getTitle: function()
  {
    var a = $("tam",this.xmldoc).eq(this.callnum);
    return a.attr("title");
  },

  getPath: function(xmldoc)
  {
    var tam = this;
    var retval = [];
    $("path",$("tam",xmldoc).eq(this.callnum)).each(function(n) {
      var onepath = [];
      $("*",this).each(function() {
        var move = {};
        for (var a in tam.attrs) {
          if ($(this).attr(tam.attrs[a]) != undefined)
            move[tam.attrs[a]] = $(this).attr(tam.attrs[a]);
        }
        for (var a in tam.numattrs) {
          if ($(this).attr(tam.numattrs[a]) != undefined)
            move[tam.numattrs[a]] = Number($(this).attr(tam.numattrs[a]));
        }
        var p = tam.translatePath(move);
        while (p.length)
          onepath.push(p.shift());
      });
      retval.push(onepath);
    });
    return retval;
  },

  getNumbers : function()
  {
    var a = $("tam",this.xmldoc).eq(this.callnum);
    // np is the number of paths not including phantoms (which raise it > 4)
    var np =  Math.min($('path',a).size(),4);
    var retval = [];
    var i = 0;
    $("path",a).each(function(n) {
      var n = $(this).attr('numbers');
      if (n) {
        var nn = n.split(/ /);
        retval[i*2] = nn[0];
        retval[i*2+1] = nn[1];
      }
      else if (i > 3) {  // phantoms
        retval[i*2] = ['a','b','c','d'][i*2-8];
        retval[i*2+1] = ['a','b','c','d'][i*2-7];
      }
      else {
        retval[i*2] = i+1;
        retval[i*2+1] = i+1+np;
      }
      i += 1;
    });
    return retval;
  },

  translatePath: function(path)
  {
    var retval = [];
    if (path instanceof Array) {
      for (var m in path) {
        var p = this.translateMovement(path[m]);
        while (p.length)
          retval.push(p.shift());
      }
    }
    else {
      var p = this.translateMovement(path);
      while (p.length)
        retval.push(p.shift());
    }
    return retval;
  },

  translateMovement: function(move)
  {
    var retval = [];
    if ("select" in move) {
      retval = this.translatePath(paths[move.select]);
      var beats = 0;
      for  (var i=0; i<retval.length; i++)
        beats += retval[i].beats;
      for  (var i=0; i<retval.length; i++) {
        if ("beats" in move)
          retval[i].beats *= move.beats / beats;
        if ("scaleX" in move) {
          retval[i].cx1 *= move.scaleX;
          retval[i].cx2 *= move.scaleX;
          retval[i].x2 *= move.scaleX;
          if (retval[i].cx3 != undefined)
            retval[i].cx3 *= move.scaleX;
          if (retval[i].cx4 != undefined)
            retval[i].cx4 *= move.scaleX;
          if (retval[i].x4 != undefined)
            retval[i].x4 *= move.scaleX;
        }
        if ("scaleY" in move) {
          retval[i].cy1 *= move.scaleY;
          retval[i].cy2 *= move.scaleY;
          retval[i].y2 *= move.scaleY;
          if (retval[i].cy4)
            retval[i].cy4 *= move.scaleY;
          if (retval[i].y4)
            retval[i].y4 *= move.scaleY;
        }
        if ("reflect" in move) {
          retval[i].cy1 *= -1;
          retval[i].cy2 *= -1;
          retval[i].y2 *= -1;
          if (retval[i].cy4 != undefined)
            retval[i].cy4 *= -1;
          if (retval[i].y4 != undefined)
            retval[i].y4 *= -1;
        }
        if ("offsetX" in move) {
          retval[i].cx2 += move.offsetX;
          retval[i].x2 += move.offsetX;
        }
        if ("offsetY" in move) {
          retval[i].cy2 += move.offsetY;
          retval[i].y2 += move.offsetY;
        }
        if ("hands" in move)
          retval[i].hands = move.hands;
        else if ("reflect" in move) {
          if (retval[i].hands == "right")
            retval[i].hands = "left";
          else if (retval[i].hands == "left")
            retval[i].hands = "right";
          else if (retval[i].hands == "gripright")
            retval[i].hands = "gripleft";
          else if (retval[i].hands == "gripleft")
            retval[i].hands = "gripright";
        }
      }
    }
    else {  // Not a reference to another movement
      retval = [ cloneObject(move) ];
    }
    return retval;
  }

};

function cloneObject(obj)
{
  retval = { };
  for (p in obj)
    retval[p] = obj[p];
  return retval;
}

function objectToString(obj)
{
  retval = '';
  for (p in obj)
    retval += p + ': ' + obj[p] + "\n";
  return retval;
}

function getParts(n)
{
  var a = $("tam",animations).eq(n);
  return a.attr("parts") ? a.attr("parts") : '';
}


function getFormation(n)
{
  var a = $("tam",animations).eq(n);
  var retval = a.attr("formation");
  if (retval && retval.indexOf('Formation') != 0)
    retval = formations[retval];
  return retval;
}

function SelectAnimation(n)
{
  tam.callnum = n;
  var applet = document.getElementById('applet');
  if (applet)
    applet.setFormation(tam.getFormation(tam.xmldoc));
  var p = tam.getPath(tam.xmldoc);
  for (var i=0; i<p.length; i++) {
    var str = '';
    for (var j=0; j<p[i].length; j++)
      str += movementToString(p[i][j]);
    var ii = i+1;
    if (applet)
      applet.addDancer(i+1,str);
  }
  if (applet) {
    applet.setParts(tam.getParts());
    applet.rebuildUI();
  }
}
function translatePath(path)
{
  var retval = [];
  $("*",path).each(function() {
    var p = translateMovement($(this));
    while (p.length)
      retval.push(p.shift());
  });
  return retval;
}

function translateMovement(move)
{
  var retval = [];
  if (move.is("move")) {
    retval = translatePath($("move[name='"+move.attr("select")+"']",paths));
    var beats = 0;
    for  (var i=0; i<retval.length; i++)
      beats += Number(retval[i].beats);
    for  (var i=0; i<retval.length; i++) {
      if (move.attr("beats"))
        retval[i].beats *= Number(move.attr("beats")) / beats;
      if (move.attr("scaleX")) {
        retval[i].cx1 *= Number(move.attr("scaleX"));
        retval[i].cx2 *= Number(move.attr("scaleX"));
        retval[i].x2 *= Number(move.attr("scaleX"));
        if (retval[i].cx3 != undefined)
          retval[i].cx3 *= Number(move.attr("scaleX"));
        if (retval[i].cx4 != undefined)
          retval[i].cx4 *= Number(move.attr("scaleX"));
        if (retval[i].x4 != undefined)
          retval[i].x4 *= Number(move.attr("scaleX"));
      }
      if (move.attr("scaleY")) {
        retval[i].cy1 *= Number(move.attr("scaleY"));
        retval[i].cy2 *= Number(move.attr("scaleY"));
        retval[i].y2 *= Number(move.attr("scaleY"));
        if (retval[i].cy4)
          retval[i].cy4 *= Number(move.attr("scaleY"));
        if (retval[i].y4)
          retval[i].y4 *= Number(move.attr("scaleY"));
      }
      if (move.attr("reflect")) {
        retval[i].cy1 *= -1;
        retval[i].cy2 *= -1;
        retval[i].y2 *= -1;
        if (retval[i].cy4 != undefined)
          retval[i].cy4 *= -1;
        if (retval[i].y4 != undefined)
          retval[i].y4 *= -1;
      }
      if (move.attr("offsetX")) {
        retval[i].cx2 += Number(move.attr("offsetX"));
        retval[i].x2 += Number(move.attr("offsetX"));
      }
      if (move.attr("offsetY")) {
        retval[i].cy2 += Number(move.attr("offsetY"));
        retval[i].y2 += Number(move.attr("offsetY"));
      }
      if (move.attr("hands"))
        retval[i].hands = move.attr("hands");
      else if (move.attr("reflect")) {
        if (retval[i].hands == "right")
          retval[i].hands = "left";
        else if (retval[i].hands == "left")
          retval[i].hands = "right";
        else if (retval[i].hands == "gripright")
          retval[i].hands = "gripleft";
        else if (retval[i].hands == "gripleft")
          retval[i].hands = "gripright";
      }
    }
  }
  else if (move.is("Movement"))
    if (move.attr("cx3") == undefined)
      retval = [{ hands: move.attr("hands"),
                 beats: Number(move.attr("beats")),
                 cx1: Number(move.attr("cx1")),
                 cy1: Number(move.attr("cy1")),
                 cx2 : Number(move.attr("cx2")),
                 cy2 : Number(move.attr("cy2")),
                 x2 : Number(move.attr("x2")),
                 y2 : Number(move.attr("y2"))}];
    else
      retval = [{ hands: move.attr("hands"),
                 beats: Number(move.attr("beats")),
                 cx1: Number(move.attr("cx1")),
                 cy1: Number(move.attr("cy1")),
                 cx2 : Number(move.attr("cx2")),
                 cy2 : Number(move.attr("cy2")),
                 x2 : Number(move.attr("x2")),
                 y2 : Number(move.attr("y2")),
                 cx3 : Number(move.attr("cx3")),
                 cx4 : Number(move.attr("cx4")),
                 cy4 : Number(move.attr("cy4")),
                 x4 :  Number(move.attr("x4")),
                 y4 : Number(move.attr("y4"))}];
  return retval;
}

function movementToString(m)
{
  var retval =  "Movement "+m.hands+" " + m.beats + " " +
                m.cx1 + " " + m.cy1 + " " + m.cx2 + " " + m.cy2 + " " + m.x2 + " " + m.y2;
  if (m.cx3 != undefined)
    retval += " " + m.cx3 + " " + m.cx4 + " " + m.cy4 + " " + m.x4 + " " + m.y4;
  return retval + ";";
}

//  The applet calls this as the animation reaches each part of the call
//  If there's an element with id or class "<call><part>" or "Part<part>" it
//  be highlighted
function setPart(part)
{
  if ($('span').length > 0) {
    //  Remove current highlights
    $('span').removeClass('definition-highlight');
    $('span').filter('.'+currentcall+part+
                    ',#'+currentcall+part+
                    ',.Part'+part+',#Part'+part).addClass('definition-highlight')
    //  hide and show is needed to force Webkit browsers to show the change
                    .hide().show();
  }
}

//Generate the correct copyright for a call at a specific level
function getCopyright(levelurl)
{
  var levelstring = " ";
  if (levelurl.match(/\bms\b/))
    levelstring = "1994, 2000-2008 by ";
  if (levelurl.match(/\bplus\b/))
    levelstring = "1997, 2001-2007 by ";
  if (levelurl.match(/\badv\b/))
    levelstring = "1982, 1986-1988, 1995, 2001-2011. Bill Davis, John Sybalsky, and ";
  if (levelurl.match(/\bc1\b/))
    levelstring = "1983, 1986-1988, 1995-2011 Bill Davis, John Sybalsky and ";
  if (levelurl.match(/\bc2\b/))
    levelstring = "1983, 1986-1988, 1995-2011 Bill Davis, John Sybalsky and ";
  if (levelurl.match(/\bc3a\b/))
    levelstring = "2004-2008 Vic Ceder and ";
  if (levelstring != ' ')
    levelstring = "<p class=\"copyright\">&copy; Copyright " +
         levelstring +
         "<a href=\"http://www.callerlab.org/\">CALLERLAB Inc.</a>, "+
         "The International Association of Square Dance Callers. Permission to reprint, republish, " +
         "and create derivative works without royalty is hereby granted, "+
         "provided this notice appears. Publication on the Internet of "+
         "derivative works without royalty is hereby granted provided this "+
         "notice appears. Permission to quote parts or all of this document "+
         "without royalty is hereby granted, provided this notice is "+
         "included. Information contained herein shall not be changed nor "+
         "revised in any derivation or publication.</p>";
  return levelstring;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Take a object describing a movement and return a string for passing to the applet
function movement(m)
{
  var str = "Movement "+m.hands+" "+m.beats+" "+m.cx1+" "+m.cy1+" "+m.cx2+" "+m.cy2+" "+m.x2+" "+m.y2;
  if (m.cx3 != undefined)
    str += " "+m.cx3+" "+m.cx4+" "+m.cy4+" "+m.x4+" "+m.y4;
  return str + ";";
}
