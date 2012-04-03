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

/*

  TamSVG - Javascript+SVG implementation of the original TAMination.java

*/

// Use jQuery to make a deep copy
function clone(obj)
{
  return jQuery.extend(true,{},obj);
}

var popupMenuHTML =
  '<div id="popup">'+
  '<input id="HexagonPopupItem" type="checkbox"/> Hexagon<br/>'+
  '<input id="BigonPopupItem" type="checkbox"/> Bi-gon<br/>'+
  '<hr/>'+
  '<input id="BarstoolPopupItem" type="checkbox"/> Barstool<br/>'+
  '<input id="CompassPopupItem" type="checkbox"/> Compass<br/>'+
  '</div>';

var popupMenuTitleHTML =
  '<div id="titlepopup">'+
  '<a href="javascript:showDefinition()">Definition</a><br/>'+
  '<hr/>'+
  '<input id="HexagonTitlePopupItem" type="checkbox"/> '+
  '<a href="javascript:tamsvg.toggleHexagon()">'+
  'Hexagon</a><br/>'+
  '<input id="BigonTitlePopupItem" type="checkbox"/> '+
  '<a href="javascript:tamsvg.toggleBigon()">'+
  'Bi-gon<br/>'+
  '</div>';

function showDefinition()
{
  $('#titlepopup').hide();
  $('#definition').slideDown();
}

//  Setup - called when page is loaded
function TamSVG(svg_in)
{
  if (this instanceof TamSVG)
    this.init(svg_in);
  else
    window.tamsvg = new TamSVG(svg_in);
}
TamSVG.prototype = {
  init: function(svg_in)
  {
    var me = this;
    cookie = new Cookie(document,"TAMination",365*24,'/');
    cookie.load();
    this.cookie = cookie;
    $(document).bind("contextmenu",function() { return false });
    //  Get initial values from cookie
    //  This is a hook to test hexagon
    this.hexagon = cookie.hexagon == "true";
    if (typeof args != 'undefined' && args.hexagon)
      this.hexagon = true;
    this.bigon = cookie.bigon == "true";
    if (typeof args != 'undefined' && args.bigon)
      this.bigon = true;
    this.loop = cookie.loop == "true" || args.loop;
    this.grid = cookie.grid == "true";
    this.numbers = cookie.numbers == 'true' || args.numbers;
    this.showPhantoms = cookie.phantoms == "true";
    if (cookie.svg != 'true') {
      cookie.svg = "true";
      cookie.store();
    }
    this.currentpart = 0;
    this.barstool = 0;
    this.compass = 0;
    this.animationStopped = function() { };
    this.goHexagon = function() { };
    this.goBigon = function() { };
    //  Set up the dance floor
    this.svg = svg_in;
    this.svg.configure({width: '100%', height:'100%', viewBox: '0 0 100 100'});
    floorsvg = this.svg.svg(null,0,0,100,100,-6.5,-6.5,13,13);
    floorsvg.setAttribute('width','100%');
    floorsvg.setAttribute('height','100%');
    this.allp = tam.getPath(tam.xmldoc);
    this.parts = tam.getParts().split(/;/);
    for (var i in this.parts)
      this.parts[i] = Number(this.parts[i]);
    //  first token is 'Formation', followed by e.g. boy 1 2 180 ...
    var tokens = getFormation(tam.callnum).split(/\s+/);
    //  Flip the y direction on the dance floor to match our math
    this.floor = this.svg.group(floorsvg);
    this.floor.setAttribute('transform',AffineTransform.getScaleInstance(1,-1).toString());
    this.svg.rect(this.floor,-6.5,-6.5,13,13,{fill:'#ffffc0'});
    this.svg.text(floorsvg,0,0,"Copyright 2012 Brad Christie",{fontSize: "10", transform:"translate(-6.5,6.4) scale(0.04)"});
    this.gridgroup = this.svg.group(this.floor,{fill:"none",stroke:"black",strokeWidth:0.01});
    this.hexgridgroup = this.svg.group(this.floor,{fill:"none",stroke:"black",strokeWidth:0.01});
    this.bigongridgroup = this.svg.group(this.floor,{fill:"none",stroke:"black",strokeWidth:0.01});
    this.bigoncentergroup = this.svg.group(this.floor,{fill:"none",stroke:"black",strokeWidth:0.01});
    this.drawGrid();
    if (!this.grid || this.hexagon || this.bigon)
      this.gridgroup.setAttribute('visibility','hidden');
    if (!this.grid || !this.hexagon)
      this.hexgridgroup.setAttribute('visibility','hidden');
    if (!this.grid || !this.bigon)
      this.bigongridgroup.setAttribute('visibility','hidden');
    if (!this.bigon)
      this.bigoncentergroup.setAttribute('visibility','hidden');
    this.pathparent = this.svg.group(this.floor);
    if (!this.showPaths)
      this.pathparent.setAttribute('visibility','hidden');
    this.handholds = this.svg.group(this.floor);
    this.dancegroup = this.svg.group(this.floor);
    this.dancers = [];
    var dancerColor = [ Color.red, Color.yellow, Color.lightGray ];
    var numbers = tam.getNumbers();
    for (var i=1; i<tokens.length; i+=4) {
      var d = new Dancer(this,Dancer.genders[tokens[i]],
              -Number(tokens[i+2]),-Number(tokens[i+1]),
              Number(tokens[i+3])+180,
              dancerColor[i>>3],this.allp[i>>2],numbers[this.dancers.length]);
      if (d.gender == Dancer.PHANTOM && !this.showPhantoms)
        d.hide();
      this.dancers.push(d);
      d = new Dancer(this,Dancer.genders[tokens[i]],
              Number(tokens[i+2]),Number(tokens[i+1]),
              Number(tokens[i+3]),
              dancerColor[i>>3].rotate(),this.allp[i>>2],numbers[this.dancers.length]);
      if (d.gender == Dancer.PHANTOM && !this.showPhantoms)
        d.hide();
      this.dancers.push(d);

    }
    this.barstoolmark = this.svg.circle(this.floor,0,0,0.2,{fill:'black'});
    var pth = this.svg.createPath();
    this.compassmark = this.svg.path(this.floor,
        pth.move(0,-0.5).line(0,0.5).move(-0.5,0).line(0.5,0),
        {stroke:'black',strokeWidth:0.05});
    this.barstoolmark.setAttribute('visibility','hidden');
    this.compassmark.setAttribute('visibility','hidden');

    //  Compute animation length
    this.beats = 0.0;
    for (var d in this.dancers)
      this.beats = Math.max(this.beats,this.dancers[d].beats());
    this.beats += 2.0;

    //  Mouse wheel moves the animation
    if (typeof $(floorsvg).mousewheel == 'function')
      $(floorsvg).mousewheel(function(event,delta) {
        me.beat -= delta * 0.2;
        me.animate();
      });

    //  Initialize the animation
    if (this.hexagon)
      this.convertToHexagon();
    else if (this.bigon)
      this.convertToBigon();
    this.beat = -2.0;
    this.prevbeat = -2.0;
    this.speed = 500;
    this.running = false;
    for (var i in this.dancers)
      this.dancers[i].recalculate();
    this.animate();
  },

  toggleHexagon: function()
  {
    $('#titlepopup').hide();
    this.setHexagon(!this.hexagon);
    if (this.hexagon)
      this.goHexagon();
  },

  toggleBigon: function()
  {
    $('#titlepopup').hide();
    this.setBigon(!this.bigon);
    if (this.bigon)
      this.goBigon();
  },

  //  This function is called repeatedly to move the dancers
  animate: function()
  {
    //  Update the animation time
    now = new Date().getTime();
    diff = now - this.lastPaintTime;
    if (this.running)
      this.beat += diff/this.speed;
    //  Update the dancers
    this.paint();
    this.lastPaintTime = now;
    //  Update the slider
    //  would probably be better to do this with a callback
    $('#playslider').slider('value',this.beat*100);
    $('#animslider').val(Math.floor(this.beat*100)).slider('refresh');
    if (this.beat >= this.beats) {
      if (this.loop)
        this.beat = -2;
      else
        this.stop();
    }
    if (this.beat > this.beats)
      this.beat = this.beats;
    if (this.beat < -2)
      this.beat = -2;
    //  Update the definition highlight
    var thispart = 1;
    var partsum = 0;
    for (var i in this.parts) {
      if (this.parts[i]+partsum < this.beat)
        thispart++
      partsum += this.parts[i];
    }
    if (this.beat < 0 || this.beat > this.beats-2)
      thispart = 0;
    if (thispart != this.currentpart) {
      setPart(thispart);
      this.currentpart = thispart;
    }
  },

  setBeat: function(b)
  {
    this.beat = b;
    this.animate();
  },

  paint: function(beat)
  {
    if (arguments.length == 0)
      beat = this.beat;
    //  If a big jump from the last hexagon animation, calculate some
    //  intervening ones so the wrap works
    while (this.hexagon && Math.abs(beat-this.prevbeat) > 1.1)
      this.paint(this.prevbeat + (beat > this.prevbeat ? 1.0 : -1.0));
    this.prevbeat = beat;

    //  Move dancers
    for (var i in this.dancers)
      this.dancers[i].animate(beat);

    //  If hexagon, rotate relative to center
    if (this.hexagon) {
      for (var i in this.dancers) {
        var d = this.dancers[i];
        var a0 = Math.atan2(d.starty,d.startx);  // hack
        var a1 = Math.atan2(d.tx.getTranslateY(),d.tx.getTranslateX());
        //  Correct for wrapping around +/- pi
        if (this.beat <= 0.0)
          d.prevangle = a1;
        var wrap = Math.round((a1-d.prevangle)/(Math.PI*2));
        a1 -= wrap*Math.PI*2;
        var a2 = -(a1-a0)/3;
        d.concatenate(AffineTransform.getRotateInstance(a2));
        d.prevangle = a1;
      }
    }
    //  If bigon, rotate relative to center
    if (this.bigon) {
      for (var i in this.dancers) {
        var d = this.dancers[i];
        var a0 = Math.atan2(d.starty,d.startx);  // hack
        var a1 = Math.atan2(d.tx.getTranslateY(),d.tx.getTranslateX());
        //  Correct for wrapping around +/- pi
        if (this.beat <= 0.0)
          d.prevangle = a1;
        var wrap = Math.round((a1-d.prevangle)/(Math.PI*2));
        a1 -= wrap*Math.PI*2;
        var a2 = +(a1-a0);
        d.concatenate(AffineTransform.getRotateInstance(a2));
        d.prevangle = a1;
      }
    }

    //  If barstool, translate to keep the barstool dancer stationary in center
    if (this.barstool) {
      var tx = AffineTransform.getTranslateInstance(
          -this.barstool.tx.getTranslateX(),
          -this.barstool.tx.getTranslateY());
      for (var i in this.dancers) {
        this.dancers[i].concatenate(tx);
      }
      this.barstoolmark.setAttribute('cx',0);
      this.barstoolmark.setAttribute('cy',0);
      this.barstoolmark.setAttribute('visibility','visible');
    }
    else
      this.barstoolmark.setAttribute('visibility','hidden');

    //  If compass, rotate relative to compass dancer
    if (this.compass) {
      var tx = AffineTransform.getRotateInstance(
          this.compass.startangle*Math.PI/180-this.compass.tx.getAngle());
      for (var i in this.dancers) {
        this.dancers[i].concatenate(tx);
      }
      this.compassmark.setAttribute('transform',
          AffineTransform.getTranslateInstance(
              this.compass.tx.getTranslateX(),
              this.compass.tx.getTranslateY()));
      this.compassmark.setAttribute('visibility','visible');
    }
    else
      this.compassmark.setAttribute('visibility','hidden');

    //  Compute handholds
    Handhold.dfactor0 = this.hexagon ? 1.15 : 1.0;
    var hhlist = [];
    for (var i0 in this.dancers) {
      var d0 = this.dancers[i0];
      d0.rightdancer = d0.leftdancer = null;
      d0.rightHandNewVisibility = false;
      d0.leftHandNewVisibility = false;
    }
    for (var i1=0; i1<this.dancers.length-1; i1++) {
      var d1 = this.dancers[i1];
      if (d1.gender==Dancer.PHANTOM && !this.showPhantoms)
        continue;
      for (var i2=i1+1; i2<this.dancers.length; i2++) {
        var d2 = this.dancers[i2];
        if (d2.gender==Dancer.phantom && !this.showPhantoms)
          continue;
        var hh = Handhold.getHandhold(d1,d2);
        if (hh != null)
          hhlist.push(hh);
      }
    }

    hhlist.sort(function(a,b) { return a.score - b.score; });
    for (var h in hhlist) {
      var hh = hhlist[h];
      /*if (this.bigon) {
        if (Math.abs(hh.d1.centerAngle()-3*Math.PI/2) < 3 &&
            hh.d1.hands == Movement.RIGHTHAND)
          continue;
      }*/
      //  Check that the hands aren't already used
      var incenter = this.hexagon && hh.inCenter();
      if (incenter ||
          (hh.h1 == Movement.RIGHTHAND && hh.d1.rightdancer == null ||
              hh.h1 == Movement.LEFTHAND && hh.d1.leftdancer == null) &&
              (hh.h2 == Movement.RIGHTHAND && hh.d2.rightdancer == null ||
                  hh.h2 == Movement.LEFTHAND && hh.d2.leftdancer == null)) {
        hh.paint();
        if (incenter)
          continue;
        if (hh.h1 == Movement.RIGHTHAND) {
          hh.d1.rightdancer = hh.d2;
          if ((hh.d1.hands & Movement.GRIPRIGHT) == Movement.GRIPRIGHT)
            hh.d1.rightgrip = hh.d2;
        } else {
          hh.d1.leftdancer = hh.d2;
          if ((hh.d1.hands & Movement.GRIPLEFT) == Movement.GRIPLEFT)
            hh.d1.leftgrip = hh.d2;
        }
        if (hh.h2 == Movement.RIGHTHAND) {
          hh.d2.rightdancer = hh.d1;
          if ((hh.d2.hands & Movement.GRIPRIGHT) == Movement.GRIPRIGHT)
            hh.d2.rightgrip = hh.d1;
        } else {
          hh.d2.leftdancer = hh.d1;
          if ((hh.d2.hands & Movement.GRIPLEFT) == Movement.GRIPLEFT)
            hh.d2.leftgrip = hh.d1;
        }
      }
    }
    //  Clear handholds no longer visible
    for (var i in this.dancers) {
      var d = this.dancers[i];
      if (d.rightHandVisibility && !d.rightHandNewVisibility) {
        d.righthand.setAttribute('visibility','hidden');
        d.rightHandVisibility = false;
      }
      if (d.leftHandVisibility && !d.leftHandNewVisibility) {
        d.lefthand.setAttribute('visibility','hidden');
        d.leftHandVisibility = false;
      }
    }

    //  Paint dancers with hands
    //$('#animslider').val(this.beat);
    for (var i in this.dancers)
      this.dancers[i].paint();
  },

  rewind: function()
  {
    this.stop();
    this.beat = -2;
    this.animate();
  },

  prev: function()
  {
    var b = 0;
    var best = this.beat;
    for (var i in this.parts) {
      b += this.parts[i];
      if (b < this.beat)
        best = b;
    }
    if (best == this.beat && best > 0)
      best = 0;
    else if (this.beat <= 0)
      best = -2;
    this.beat = best;
    this.animate();
  },

  backward: function()
  {
    this.stop();
    if (this.beat > 0.1)
      this.beat -= 0.1;
    this.animate();
  },

  stop: function()
  {
    if (this.timer != null)
      clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    this.animationStopped();
    //$('#playButton').attr('value','Play'); // for mobile .button('refresh');
  },

  start: function()
  {
    this.lastPaintTime = new Date().getTime();
    if (this.timer == null) {
      var me = this;
      this.timer = setInterval(function() { me.animate(); },25);
    }
    if (this.beat >= this.beats)
      this.beat = -2;
    this.running = true;
    $('#playButton').attr('value','Stop');
  },

  play: function()
  {
    if (this.running)
      this.stop();
    else
      this.start();
  },

  forward: function()
  {
    this.stop();
    if (this.beat < this.beats)
      this.beat += 0.1;
    this.animate();
  },

  next: function()
  {
    var b = 0;
    for (var i in this.parts) {
      b += this.parts[i];
      if (b > this.beat) {
        this.beat = b;
        b = -1000;
      }
    }
    if (b >= 0 && b < this.beats-2)
      this.beat = this.beats-2;
    this.animate();
  },

  end: function()
  {
    this.stop();
    if (this.beat < this.beats-2)
      this.beat = this.beats-2;
    this.animate();
  },

  slow: function()
  {
    this.speed = 1500;
  },
  normal: function()
  {
    this.speed = 500;
  },
  fast: function()
  {
    this.speed = 200;
  },
  isSlow: function()
  {
    return this.speed == 1500;
  },
  isNormal: function()
  {
    return this.speed == 500;
  },
  isFast: function()
  {
    return this.speed == 200;
  },

  setLoop: function(v) {
    if (arguments.length > 0)
      this.loop = v;
    this.cookie.loop = this.loop;
    this.cookie.store();
    return this.loop;
  },

  setGrid: function(v) {
    if (arguments.length > 0) {
      this.grid = v;
      this.hexgridgroup.setAttribute('visibility','hidden');
      this.bigongridgroup.setAttribute('visibility','hidden');
      this.gridgroup.setAttribute('visibility','hidden');
      if (this.grid) {
        if (tamsvg.hexagon)
          tamsvg.hexgridgroup.setAttribute('visibility','visible');
        else if (tamsvg.bigon)
          tamsvg.bigongridgroup.setAttribute('visibility','visible');
        else
          tamsvg.gridgroup.setAttribute('visibility','visible');
      }
    }
    this.cookie.grid = this.grid;
    this.cookie.store();
    return this.grid;
  },

  setPaths: function(v) {
    if (arguments.length > 0)
      this.showPaths = v;
    this.pathparent.setAttribute('visibility',this.showPaths ? 'visible' : 'hidden');
    for (var i in this.dancers) {
      this.dancers[i].pathgroup.setAttribute('visibility',this.showPaths ? 'visible' : 'hidden');
      this.dancers[i].pathVisible = this.showPaths;
    }
    return this.showPaths;
  },

  setNumbers: function(v)
  {
    if (arguments.length > 0)
      this.numbers = v;
    if (this.hexagon || this.bigon)
      this.numbers = false;
    for (var i in this.dancers) {
      var d = this.dancers[i];
      if (this.numbers)
        d.showNumber();
      else
        d.hideNumber();
    }
    this.cookie.numbers = this.numbers;
    this.cookie.store();
    return this.numbers;
  },


  setHexagon: function(v)
  {
    if (arguments.length > 0) {
      this.hexagon = v;
      if (this.hexagon) {
        //  For now, no numbers for hex or bigon
        this.setNumbers(false);
        if (this.bigon) {
          this.bigon = false;
          this.revertFromBigon();
        }
        this.convertToHexagon();
        this.animate();
        if (this.grid) {
          this.gridgroup.setAttribute('visibility','hidden');
          this.bigongridgroup.setAttribute('visibility','hidden');
          this.hexgridgroup.setAttribute('visibility','visible');
        }
      } else {
        this.revertFromHexagon();
        this.animate();
        if (this.grid) {
          this.hexgridgroup.setAttribute('visibility','hidden');
          this.gridgroup.setAttribute('visibility','visible');
        }
      }
      for (var i in this.dancers)
        this.dancers[i].paintPath();
      this.setNumbers();
      this.animate();
      this.cookie.hexagon = this.hexagon;
      this.cookie.store();
    }
    return this.hexagon;
  },

  setBigon: function(v)
  {
    if (arguments.length > 0) {
      this.bigon = v;
      if (this.bigon) {
        //  For now, no numbers for hex or bigon
        this.setNumbers(false);
        if (this.hexagon) {
          this.hexagon = false;
          this.revertFromHexagon();
        }
        this.convertToBigon();
        this.animate();
        if (this.grid) {
          this.gridgroup.setAttribute('visibility','hidden');
          this.hexgridgroup.setAttribute('visibility','hidden');
          this.bigongridgroup.setAttribute('visibility','visible');
        }
      } else {
        this.revertFromBigon();
        this.animate();
        if (this.grid) {
          this.bigongridgroup.setAttribute('visibility','hidden');
          this.gridgroup.setAttribute('visibility','visible');
        }
      }
      for (var i in this.dancers)
        this.dancers[i].paintPath();
      this.animate();
      this.cookie.bigon = this.bigon;
      this.cookie.store();
    }
    return this.bigon;
  },


  drawGrid: function()
  {
    //  Square grid
    for (var x=-7.5; x<=7.5; x+=1)
      this.svg.line(this.gridgroup,x,-7.5,x,7.5);
    for (var y=-7.5; y<=7.5; y+=1)
      this.svg.line(this.gridgroup,-7.5,y,7.5,y);

    //  Hex grid
    for (var x0=0.5; x0<=8.5; x0+=1) {
      var points = [];
      // moveto 0, x0
      points.push([0,x0]);
      for (var y0=0.5; y0<=8.5; y0+=0.5) {
        var a = Math.atan2(y0,x0)*2/3;
        var r = Math.sqrt(x0*x0+y0*y0);
        var x = r*Math.sin(a);
        var y = r*Math.cos(a);
        // lineto x,y
        points.push([x,y]);
      }
      //  reflect and rotate the result
      for (var a=0; a<6; a++) {
        var t = "rotate("+(a*60)+")";
        this.svg.polyline(this.hexgridgroup,points,{transform:t});
        this.svg.polyline(this.hexgridgroup,points,{transform:t+" scale(1,-1)"});
      }
    }

    //  Bigon grid
    for (var x1=-7.5; x1<=7.5; x1+=1) {
      var points = [];
      points.push([0,Math.abs(x1)]);
      for (var y1=0.2; y1<=7.5; y1+=0.2) {
        var a = 2*Math.atan2(y1,x1);
        var r = Math.sqrt(x1*x1+y1*y1);
        var x = r*Math.sin(a);
        var y = r*Math.cos(a);
        points.push([x,y]);
      }
      this.svg.polyline(this.bigongridgroup,points);
      this.svg.polyline(this.bigongridgroup,points,{transform:"scale(1,-1)"});
    }

    //  Bigon center mark
    this.svg.line(this.bigoncentergroup,0,-0.5,0,0.5);
    this.svg.line(this.bigoncentergroup,-0.5,0,0.5,0);

  },

  convertToHexagon: function()
  {
    //  Save current dancers
    for (var i in this.dancers)
      this.dancers[i].hide();
    this.saveDancers = this.dancers;
    this.dancers = [];
    var dancerColor = [ Color.red, Color.yellow, Color.green, Color.blue,
                        Color.magenta, Color.cyan ];
    //  Generate hexagon dancers
    for (var i=0; i<this.saveDancers.length; i+=2) {
      var j = Math.floor(i/4);
      this.dancers.push(new Dancer(this.saveDancers[i],0,0,0,30,dancerColor[j]));
      this.dancers.push(new Dancer(this.saveDancers[i],0,0,0,150,dancerColor[j+2]));
      this.dancers.push(new Dancer(this.saveDancers[i],0,0,0,270,dancerColor[j+4]));
    }
    //  Convert to hexagon positions and paths
    for (var i=0; i<this.dancers.length; i++) {
      this.hexagonify(this.dancers[i],30+(i%3)*120);
    }
  },

  convertToBigon: function()
  {
    //  Save current dancers
    for (var i in this.dancers)
      this.dancers[i].hide();
    this.saveDancers = this.dancers;
    this.dancers = [];
    var dancerColor = [ Color.red, Color.yellow, Color.green, Color.blue,
                        Color.magenta, Color.cyan ];
    for (var i=0; i<this.saveDancers.length; i+=2) {
      var j = Math.floor(i/2);
      this.dancers.push(new Dancer(this.saveDancers[i],0,0,0,0,dancerColor[j]));
    }
    //  Generate BIgon dancers
    for (var i=0; i<this.dancers.length; i++) {
      this.bigonify(this.dancers[i]);
    }
    this.bigoncentergroup.setAttribute('visibility','visible');

  },

  revertFromHexagon: function()
  {
    for (var i in this.dancers)
      this.dancers[i].hide();
    this.dancers = this.saveDancers;
    for (var i in this.dancers)
      this.dancers[i].show();
    this.animate();
  },

  revertFromBigon: function()
  {
    this.bigoncentergroup.setAttribute('visibility','hidden');
    //  Just restore the saved dancers
    this.revertFromHexagon();
  },

  //  Moves the position and angle of a dancer from square to hexagon
  hexagonify: function(d,a)
  {
    a = a*Math.PI/180;
    var x = d.startx;
    var y = d.starty;
    var r = Math.sqrt(x*x+y*y);
    var angle = Math.atan2(y,x);
    var dangle = 0.0;
    if (angle < 0)
      dangle = -(Math.PI+angle)/3;
    else
      dangle = (Math.PI-angle)/3;
    d.startx = r*Math.cos(angle+dangle+a);
    d.starty = r*Math.sin(angle+dangle+a);
    d.startangle += dangle*180/Math.PI;
    d.computeStart();
    d.recalculate();
  },

  bigonify: function(d)
  {
    var cangle = Math.PI/2.0
    var x = d.startx;
    var y = d.starty;
    var r = Math.sqrt(x*x+y*y);
    var angle = Math.atan2(y,x)+cangle;
    var bigangle = angle*2-cangle;
    d.startx = r*Math.cos(bigangle);
    d.starty = r*Math.sin(bigangle);
    d.startangle += angle*180/Math.PI;
    d.computeStart();
    d.recalculate();
  }


};
////////////////////////////////////////////////////////////////////////////////
//  Handhold class for computing the potential handhold between two dancers
//  The actual graphic hands are part of the Dancer object

//  Properties of Handhold object
//  Dancer d1,d2;
//  int h1,h2;
//  angle ah1, ah2; (in radians)
//  double score;
//  private boolean isincenter = false;
//  public static double dfactor0 = 1.0;

function Handhold(/*Dancer*/ dd1, /*Dancer*/ dd2,
         /*int*/ hh1, /*int*/ hh2, /*angle*/ ahh1, ahh2, /*distance*/ d, s)
{
  this.d1 = dd1;
  this.d2 = dd2;
  this.h1 = hh1;
  this.h2 = hh2;
  this.ah1 = ahh1;
  this.ah2 = ahh2;
  this.distance = d;
  this.score = s;
}

  //  If two dancers can hold hands, create and return a handhold.
  //  Else return null.
Handhold.getHandhold = function(/*Dancer*/ d1, /*Dancer*/ d2)
{
  if (d1.hidden || d2.hidden)
    return null;
  //  Turn off grips if not specified in current movement
  if ((d1.hands & Movement.GRIPRIGHT) != Movement.GRIPRIGHT)
    d1.rightgrip = null;
  if ((d1.hands & Movement.GRIPLEFT) != Movement.GRIPLEFT)
    d1.leftgrip = null;
  if ((d2.hands & Movement.GRIPRIGHT) != Movement.GRIPRIGHT)
    d2.rightgrip = null;
  if ((d2.hands & Movement.GRIPLEFT) != Movement.GRIPLEFT)
    d2.leftgrip = null;


  //  Check distance
  var x1 = d1.tx.getTranslateX();
  var y1 = d1.tx.getTranslateY();
  var x2 = d2.tx.getTranslateX();
  var y2 = d2.tx.getTranslateY();
  var dx = x2-x1;
  var dy = y2-y1;
  var dfactor1 = 0.1;  // for distance up to 2.0
  var dfactor2 = 2.0;  // for distance past 2.0
  var cutover = 2.0;
  if (d1.tamsvg.hexagon)
    cutover = 2.5;
  if (d1.tamsvg.bigon)
    cutover = 3.7;
  var d = Math.sqrt(dx*dx+dy*dy);
  var d0 = d*Handhold.dfactor0;
  var score1 = d0 > cutover ? (d0-cutover)*dfactor2+2*dfactor1 : d0*dfactor1;
  var score2 = score1;
  //  Angle between dancers
  var a0 = Math.atan2(dy,dx);
  //  Angle each dancer is facing
  var a1 = Math.atan2(d1.tx.getShearY(),d1.tx.getScaleY());
  var a2 = Math.atan2(d2.tx.getShearY(),d2.tx.getScaleY());
  //  For each dancer, try left and right hands
  var h1 = 0;
  var h2 = 0;
  var ah1 = 0;
  var ah2 = 0;
  var afactor1 = 0.2;
  var afactor2 = 1.0;
  if (d1.tamsvg.bigon)
    afactor2 = 0.6;
  //  Dancer 1
  var a = Math.abs(Math.IEEEremainder(Math.abs(a1-a0+Math.PI*3/2),Math.PI*2));
  var ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                                : a*afactor1;
  if (score1+ascore < 1.0 && (d1.hands & Movement.RIGHTHAND) != 0 &&
      d1.rightgrip==null || d1.rightgrip==d2) {
    score1 = d1.rightgrip==d2 ? 0.0 : score1 + ascore;
    h1 = Movement.RIGHTHAND;
    ah1 = a1-a0+Math.PI*3/2;
  } else {
    a = Math.abs(Math.IEEEremainder(Math.abs(a1-a0+Math.PI/2),Math.PI*2));
    ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                           : a*afactor1;
    if (score1+ascore < 1.0 && (d1.hands & Movement.LEFTHAND) != 0 &&
        d1.leftgrip==null || d1.leftgrip==d2) {
      score1 = d1.leftgrip==d2 ? 0.0 : score1 + ascore;
      h1 = Movement.LEFTHAND;
      ah1 = a1-a0+Math.PI/2;
    } else
      score1 = 10;
  }
  //  Dancer 2
  a = Math.abs(Math.IEEEremainder(Math.abs(a2-a0+Math.PI/2),Math.PI*2));
  ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                         : a*afactor1;
  if (score2+ascore < 1.0 && (d2.hands & Movement.RIGHTHAND) != 0 &&
      d2.rightgrip==null || d2.rightgrip==d1) {
    score2 = d2.rightgrip==d1 ? 0.0 : score2 + ascore;
    h2 = Movement.RIGHTHAND;
    ah2 = a2-a0+Math.PI/2;
  } else {
    a = Math.abs(Math.IEEEremainder(Math.abs(a2-a0+Math.PI*3/2),Math.PI*2));
    ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                           : a*afactor1;
    if (score2+ascore < 1.0 && (d2.hands & Movement.LEFTHAND) != 0 &&
        d2.leftgrip==null || d2.leftgrip==d1) {
      score2 = d2.leftgrip==d1 ? 0.0 : score2 + ascore;
      h2 = Movement.LEFTHAND;
      ah2 = a2-a0+Math.PI*3/2;
    } else
      score2 = 10;
  }

  if (d1.rightgrip == d2 && d2.rightgrip == d1)
    return new Handhold(d1,d2,Movement.RIGHTHAND,Movement.RIGHTHAND,ah1,ah2,d,0);
  if (d1.rightgrip == d2 && d2.leftgrip == d1)
    return new Handhold(d1,d2,Movement.RIGHTHAND,Movement.LEFTHAND,ah1,ah2,d,0);
  if (d1.leftgrip == d2 && d2.rightgrip == d1)
    return new Handhold(d1,d2,Movement.LEFTHAND,Movement.RIGHTHAND,ah1,ah2,d,0);
  if (d1.leftgrip == d2 && d2.leftgrip == d1)
    return new Handhold(d1,d2,Movement.LEFTHAND,Movement.LEFTHAND,ah1,ah2,d,0);

  //window.alert(score1+" "+score2);
  if (score1 > 1.0 || score2 > 1.0 || score1+score2 > 1.2)
    return null;
  return new Handhold(d1,d2,h1,h2,ah1,ah2,d,score1+score2);
}

/* boolean */
Handhold.prototype.inCenter = function()
{
  var x1 = this.d1.tx.getTranslateX();
  var y1 = this.d1.tx.getTranslateY();
  var x2 = this.d2.tx.getTranslateX();
  var y2 = this.d2.tx.getTranslateY();
  this.isincenter = Math.sqrt(x1*x1+y1*y1) < 1.1 &&
         Math.sqrt(x2*x2+y2*y2) < 1.1;
  if (this.isincenter) {
    this.ah1 = 0;
    this.ah2 = 0;
    this.distance = 2.0;
  }
  return this.isincenter;
}

//  Make the handhold visible
Handhold.prototype.paint = function()
{
  //  Scale should be 1 if distance is 2
  var scale = this.distance/2;
  if (this.h1 == Movement.RIGHTHAND || this.h1 == Movement.GRIPRIGHT) {
    if (!this.d1.rightHandVisibility) {
      this.d1.righthand.setAttribute('visibility','visible');
      this.d1.rightHandVisibility = true;
    }
    this.d1.rightHandNewVisibility = true;
    this.d1.rightHandTransform = AffineTransform.getRotateInstance(-this.ah1)
      .concatenate(AffineTransform.getScaleInstance(scale,scale));
  }
  if (this.h1 == Movement.LEFTHAND || this.h1 == Movement.GRIPLEFT) {
    if (!this.d1.leftHandVisibility) {
      this.d1.lefthand.setAttribute('visibility','visible');
      this.d1.leftHandVisibility = true;
    }
    this.d1.leftHandNewVisibility = true;
    this.d1.leftHandTransform = AffineTransform.getRotateInstance(-this.ah1)
      .concatenate(AffineTransform.getScaleInstance(scale,scale));
  }
  if (this.h2 == Movement.RIGHTHAND || this.h2 == Movement.GRIPRIGHT) {
    if (!this.d2.rightHandVisibility) {
      this.d2.righthand.setAttribute('visibility','visible');
      this.d2.rightHandVisibility = true;
    }
    this.d2.rightHandNewVisibility = true;
    this.d2.rightHandTransform = AffineTransform.getRotateInstance(-this.ah2)
      .concatenate(AffineTransform.getScaleInstance(scale,scale));
  }
  if (this.h2 == Movement.LEFTHAND || this.h2 == Movement.GRIPLEFT) {
    if (!this.d2.leftHandVisibility) {
      this.d2.lefthand.setAttribute('visibility','visible');
      this.d2.leftHandVisibility = true;
    }
    this.d2.leftHandNewVisibility = true;
    this.d2.leftHandTransform = AffineTransform.getRotateInstance(-this.ah2)
      .concatenate(AffineTransform.getScaleInstance(scale,scale));
  }
}
////////////////////////////////////////////////////////////////////////////////
//  Dancer class
function Dancer(tamsvg,sex,x,y,angle,color,p,number)
{
  if (tamsvg instanceof Dancer) {
    var d = tamsvg;
    var props = ['tamsvg','fillcolor','drawcolor','startx','starty','startangle','gender','number'];
    for (var i in props)
      this[props[i]] = d[props[i]];
    this.path = new Path(d.path);
    if (sex)
      this.gender = sex;
    if (x || y) {
      this.startx = x;
      this.starty = -y;
    }
    this.startangle += angle;
    if (d.gender != Dancer.PHANTOM && color) {
      this.fillcolor = color;
      this.drawcolor = color.darker();
    }
  } else {
    this.tamsvg = tamsvg;
    if (color) {
      this.fillcolor = color;
      this.drawcolor = color.darker();
    }
    this.startx = x;
    this.starty = -y;
    this.startangle = angle-90;
    this.path = new Path(p);
    this.gender = sex;
    this.number = number;
  }
  //if (tamsvg.numbers)
  //  this.fillcolor = 'white';
  this.hidden = false;
  this.pathVisible = this.tamsvg.showPaths;
  this.leftgrip = null;
  this.rightgrip = null;
  this.rightHandVisibility = false;
  this.leftHandVisibility = false;
  this.rightHandTransform = new AffineTransform();
  this.leftHandTransform = new AffineTransform();
  this.prevangle = 0;
  this.computeStart();
  if (!color)
    return;
  //  Create SVG representation
  this.svg = this.tamsvg.svg.group(this.tamsvg.dancegroup);
  var dancer = this;
  var me = dancer.tamsvg;
  //  Show popup on shift-click or right-click
  $(document).bind("contextmenu",function() { return false });
  $(this.svg).mousedown(function(ev) {
    $('#popup').hide();
    if (ev.shiftKey || ev.ctrlKey || ev.which==3) {

      $('#HexagonPopupItem').attr("checked",dancer.tamsvg.hexagon);
      $('#HexagonPopupItem').unbind();
      $('#HexagonPopupItem').change(function() {
        dancer.tamsvg.toggleHexagon();
        $('#popup').hide();
      });

      $('#BigonPopupItem').attr("checked",dancer.tamsvg.bigon);
      $('#BigonPopupItem').unbind();
      $('#BigonPopupItem').change(function() {
        dancer.tamsvg.toggleBigon();
        $('#popup').hide();
      });

      $('#BarstoolPopupItem').attr("checked",dancer==dancer.tamsvg.barstool);
      $('#BarstoolPopupItem').unbind();
      $('#BarstoolPopupItem').change(function() {
        if ($(this).attr("checked"))
          dancer.tamsvg.barstool = dancer;
        else
          dancer.tamsvg.barstool = 0;
        $('#popup').hide();
        dancer.tamsvg.animate();
      });

      $('#CompassPopupItem').attr("checked",dancer==dancer.tamsvg.compass);
      $('#CompassPopupItem').unbind();
      $('#CompassPopupItem').change(function() {
        if ($(this).attr("checked"))
          dancer.tamsvg.compass = dancer;
        else
          dancer.tamsvg.compass = 0;
        $('#popup').hide();
        dancer.tamsvg.animate();
      });
      $('#popup').css("top",ev.pageY).css("left",ev.pageX).show();
      return false;  // prevent interception by dance floor
    }
    else {
      if (dancer.pathVisible)
        dancer.hidePath();
      else
        dancer.showPath();
    }
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  });
  //  handholds
  this.lefthand = this.tamsvg.svg.group(this.tamsvg.handholds,{visibility:'hidden'});
  this.tamsvg.svg.circle(this.lefthand,0,1,1/8,{fill:Color.orange.toString()});
  this.tamsvg.svg.line(this.lefthand,0,0,0,1,{stroke:Color.orange.toString(),'stroke-width':0.05});
  this.righthand = this.tamsvg.svg.group(this.tamsvg.handholds,{visibility:'hidden'});
  this.tamsvg.svg.circle(this.righthand,0,-1,1/8,{fill:Color.orange.toString()});
  this.tamsvg.svg.line(this.righthand,0,0,0,-1,{stroke:Color.orange.toString(),'stroke-width':0.05});
  //  body
  this.tamsvg.svg.circle(this.svg,.5,0,1/3,{fill:this.drawcolor.toString()});
  if (this.gender == Dancer.BOY)
    this.body = this.tamsvg.svg.rect(this.svg,-.5,-.5,1,1,
             {fill:this.fillcolor.toString(),
              stroke:this.drawcolor.toString(),'stroke-width':0.1});
  if (this.gender == Dancer.GIRL)
    this.body = this.tamsvg.svg.circle(this.svg,0,0,.5,
               {fill:this.fillcolor.toString(),
                stroke:this.drawcolor.toString(),'stroke-width':0.1});
  this.numbersvg = false;
  if (this.gender == Dancer.PHANTOM)
    this.body = this.tamsvg.svg.rect(this.svg,-.5,-.5,1,1,.2,.2,      // with rounded corners
             {fill:this.fillcolor.toString(),
              stroke:this.drawcolor.toString(),'stroke-width':0.1});
  this.numbersvg = this.tamsvg.svg.text(this.svg,-4,5,this.number+'',{fontSize: "14",transform:"scale(0.04 -0.04)"});
  if (tamsvg.numbers)
    this.body.setAttribute('fill','white');
  else
    this.numbersvg.setAttribute('visibility','hidden');
  //  path
  this.pathgroup = this.tamsvg.svg.group(this.tamsvg.pathparent);
  this.paintPath();
}
Dancer.BOY = 1;
Dancer.GIRL = 2;
Dancer.PHANTOM = 3;
Dancer.genders =
  { 'boy':Dancer.BOY, 'girl':Dancer.GIRL, 'phantom':Dancer.PHANTOM };

Dancer.prototype.hidePath = function()
{
  this.pathgroup.setAttribute('visibility','hidden');
  this.pathVisible = false;
}

Dancer.prototype.showPath = function()
{
  this.pathgroup.setAttribute('visibility','visible');
  this.pathVisible = true;
}

Dancer.prototype.hide = function()
{
  this.hidden = true;
  this.svg.setAttribute('visibility','hidden');
  this.lefthand.setAttribute('visibility','hidden');
  this.righthand.setAttribute('visibility','hidden');
  this.pathgroup.setAttribute('visibility','hidden');
}

Dancer.prototype.show = function()
{
  this.hidden = false;
  this.svg.setAttribute('visibility','visible');
  if (this.leftHandVisibility)
    this.lefthand.setAttribute('visibility','visible');
  if (this.rightHandVisibility)
    this.righthand.setAttribute('visibility','visible');
  this.pathgroup.setAttribute('visibility','inherit');
}

Dancer.prototype.computeStart = function()
{
  this.start = new AffineTransform();
  this.start.translate(this.startx,this.starty);
  this.start.rotate(Math.toRadians(this.startangle));
  if (this.svg)
    this.svg.setAttribute('transform',this.start.toString());
}

Dancer.prototype.beats = function()
{
  var b = 0;
  if (this.path != null) {
    for (var i in this.path.movelist)
      b += this.path.movelist[i].beats;
  }
  return b;
}

Dancer.prototype.showNumber = function()
{
  this.body.setAttribute('fill','white');
  this.numbersvg.setAttribute('visibility','visible');
  this.paint();
}

Dancer.prototype.hideNumber = function()
{
  this.body.setAttribute('fill',this.fillcolor.toString());
  this.numbersvg.setAttribute('visibility','hidden');
}

Dancer.prototype.recalculate = function()
{
  this.path.recalculate();
  this.paintPath();
}

//  Return distance from center
Dancer.prototype.distance = function()
{
  var x = this.tx.getTranslateX();
  var y = this.tx.getTranslateY();
  return Math.sqrt(x*x+y*y);
}

//  Return angle from dancer's facing direction to center
Dancer.prototype.centerAngle = function()
{
  var a1 = Math.atan2(this.tx.getTranslateY(),this.tx.getTranslateX());
  return this.tx.getAngle() + a1;
}

Dancer.prototype.concatenate = function(tx2)
{
  this.tx.preConcatenate(tx2);
  this.svg.setAttribute('transform',tx2.toString());
}

Dancer.prototype.paintPath = function()
{
  this.tamsvg.svg.remove(this.pathgroup);
  this.pathgroup = this.tamsvg.svg.group(this.tamsvg.pathparent);
  var points=[];
  for (var b=0; b<this.beats(); b+=0.1) {
    this.animate(b);
    if (this.tamsvg.hexagon)
      this.hexagonify(b);
    if (this.tamsvg.bigon)
      this.bigonify(b);
    points.push([this.tx.getTranslateX(),this.tx.getTranslateY()]);
  }
  this.tamsvg.svg.polyline(this.pathgroup,points,
      {fill:'none',stroke:this.drawcolor.toString(),strokeWidth:0.1,strokeOpacity:.3});
}

//  Compute and apply the transform for a specific time
var count = 0;
Dancer.prototype.animate = function(beat)
{
  // Be sure to reset grips at start
  if (beat == 0)
    this.rightgrip = this.leftgrip = null;
  //  Start to build transform
  //  Apply all completed movements
  this.tx = new AffineTransform(this.start);
  var m = null;
  var retval = 0;
  if (this.path != null) {
    for (var i=0; i<this.path.movelist.length; i++) {
      m = this.path.movelist[i];
      retval = 1;
      if (beat >= this.path.movelist[i].beats) {
        this.tx = new AffineTransform(this.start);
        this.tx.concatenate(this.path.transformlist[i]);
        beat -= this.path.movelist[i].beats;
        m = null;
        retval = 0;
      } else
        break;
    }
  }
  //  Apply movement in progress
  if (m != null) {
    this.tx.concatenate(m.translate(beat));
    this.tx.concatenate(m.rotate(beat));
    if (beat < 0)
      this.hands = Movement.BOTHHANDS;
    else
      this.hands = m.usehands;
    if ((m.usehands & Movement.GRIPLEFT) == 0)
      this.leftgrip = null;
    if ((m.usehands & Movement.GRIPRIGHT) == 0)
      this.rightgrip = null;
    if (this.tamsvg.numbers)
      this.numbersvg
  }
  else  // End of movement
    this.hands = Movement.BOTHHANDS;  // hold hands in ending formation
}

Dancer.prototype.hexagonify = function(beat)
{
  var a0 = Math.atan2(this.starty,this.startx);  // hack
  var a1 = Math.atan2(this.tx.getTranslateY(),this.tx.getTranslateX());
  //  Correct for wrapping around +/- pi
  if (beat <= 0.0)
    this.prevangle = a1;
  var wrap = Math.round((a1-this.prevangle)/(Math.PI*2));
  a1 -= wrap*Math.PI*2;
  var a2 = -(a1-a0)/3;
  this.concatenate(AffineTransform.getRotateInstance(a2));
  this.prevangle = a1;
}

Dancer.prototype.bigonify = function(beat)
{
  var a0 = Math.atan2(this.starty,this.startx);  // hack
  var a1 = Math.atan2(this.tx.getTranslateY(),this.tx.getTranslateX());
  //  Correct for wrapping around +/- pi
  if (beat <= 0.0)
    this.prevangle = a1;
  var wrap = Math.round((a1-this.prevangle)/(Math.PI*2));
  a1 -= wrap*Math.PI*2;
  var a2 = +(a1-a0);
  this.concatenate(AffineTransform.getRotateInstance(a2));
  this.prevangle = a1;
}

Dancer.prototype.paint = function()
{
  //$('#animslider').val(this.tx.x2);
  this.svg.setAttribute('transform',this.tx.toString());
  this.righthand.setAttribute('transform',
      new AffineTransform(this.tx).concatenate(this.rightHandTransform).toString());
  this.lefthand.setAttribute('transform',
      new AffineTransform(this.tx).concatenate(this.leftHandTransform).toString());
  if (this.tamsvg.numbers) {
    var a = this.tx.getAngle();
    var t1 = AffineTransform.getScaleInstance(0.04,-0.04);
    var t2 = AffineTransform.getRotateInstance(a);
    this.numbersvg.setAttribute('transform',t1.concatenate(t2).toString());
  }
}

////////////////////////////////////////////////////////////////////////////////
//  Path class
function Path(p)
{
  this.movelist = [];
  this.transformlist = [];
  this.pathlist = [];
  if (p instanceof Path) {
    for (var m in p.movelist)
      this.add(p.movelist[m].clone());
  }
  else if (p) {
    for (var i=0; i<p.length; i++) {
      var m = p[i].cx3 == undefined
          ? new Movement(p[i].hands,
                         p[i].beats,
                         p[i].cx1,p[i].cy1,
                         p[i].cx2,p[i].cy2,
                         p[i].x2,p[i].y2)
          : new Movement(p[i].hands,
                         p[i].beats,
                         p[i].cx1,p[i].cy1,
                         p[i].cx2,p[i].cy2,
                         p[i].x2,p[i].y2,
                         p[i].cx3,0,   // cy3 is always 0
                         p[i].cx4,p[i].cy4,
                         p[i].x4,p[i].y4);
      this.add(m);
    }
  }
}

Path.prototype.recalculate = function()
{
  this.transformlist = [];
  var tx = new AffineTransform();
  for (var i in this.movelist) {
    tx.concatenate(this.movelist[i].translate(999));
    tx.concatenate(this.movelist[i].rotate(999));
    this.transformlist.push(new AffineTransform(tx));
  }
}
//  Return total number of beats in path
Path.prototype.beats = function()
{
  var b = 0.0;
  if (this.movelist != null) {
    for (var i in this.movelist)
      b += this.movelist[i].beats;
  }
  return b;
}

//  Make the path run slower or faster to complete in a given number of beats
Path.prototype.changebeats = function(newbeats)
{
  if (this.movelist != null) {
    var factor = newbeats/this.beats();
    for (var i in this.movelist)
      this.movelist[i].beats *= factor;
  }
}

//  Change hand usage
Path.prototype.changehands = function(hands)
{
  if (this.movelist != null) {
    for (var i in this.movelist)
      this.movelist[i].useHands(hands);
  }
}

//  Change the path by scale factors
Path.prototype.scale = function(x,y)
{
  if (this.movelist != null) {
    for (var i in this.movelist)
      this.movelist[i].scale(x,y);
  }
}

//  Skew the path by translating the destination point
Path.prototype.skew = function(x,y)
{
  if (self.movelist != null) {
    for (var i in this.movelist)
      this.movelist[i].skew(x,y);
  }
}

//  Append one movement to the end of the Path
Path.prototype.add = function(m)
{
  if (m instanceof Movement)
    this.movelist.push(m);
  if (m instanceof Path)
    this.movelist = this.movelist.concat(m.movelist);
  this.recalculate();
  return this;
}

//  Reflect the path about the x-axis
Path.prototype.reflect = function()
{
  for (var i in this.movelist)
    this.movelist[i].reflect();
  this.recalculate();
  return this;
}

////////////////////////////////////////////////////////////////////////////////
//  Movement class
//  Constructor for independent heading and movement
function Movement(h,b,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2,
                    ctrlx3,ctrly3,ctrlx4,ctrly4,x4,y4)
{
  this.btranslate = new Bezier(0,0,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2);
  if (arguments.length > 8)
    this.brotate = new Bezier(0,0,ctrlx3,ctrly3,ctrlx4,ctrly4,x4,y4);
  else
    this.brotate = new Bezier(0,0,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2);
  this.beats = b;
  if (typeof h == "string")
    this.usehands = Movement.setHands[h];
  else
    this.usehands = h;
}
Movement.NOHANDS = 0;
Movement.LEFTHAND = 1;
Movement.RIGHTHAND = 2;
Movement.BOTHHANDS = 3;
Movement.GRIPLEFT = 5;
Movement.GRIPRIGHT = 6;
Movement.GRIPBOTH = 7;
Movement.ANYGRIP = 4;

Movement.setHands = { "none": Movement.NOHANDS,
                      "left": Movement.LEFTHAND,
                      "right": Movement.RIGHTHAND,
                      "both": Movement.BOTHHANDS,
                      "gripleft": Movement.GRIPLEFT,
                      "gripright": Movement.GRIPRIGHT,
                      "gripboth": Movement.GRIPBOTH,
                      "anygrip": Movement.ANYGRIP };

Movement.prototype.useHands = function(h)
{
  this.usehands = h;
  return this;
}

Movement.prototype.clone = function()
{
  var m = new Movement(this.usehands,
                       this.beats,
                       this.btranslate.ctrlx1,this.btranslate.ctrly1,
                       this.btranslate.ctrlx2,this.btranslate.ctrly2,
                       this.btranslate.x2,this.btranslate.y2,
                       this.brotate.ctrlx1,this.brotate.ctrly1,
                       this.brotate.ctrlx2,this.brotate.ctrly2,
                       this.brotate.x2,this.brotate.y2);
  return m;
}

Movement.prototype.translate = function(t) {
  t = Math.min(Math.max(0,t),this.beats);
  return this.btranslate.translate(t/this.beats);
}

Movement.prototype.reflect = function()
{
  return this.scale(1,-1);
}

Movement.prototype.rotate = function(t)
{
  t = Math.min(Math.max(0,t),this.beats);
  return this.brotate.rotate(t/this.beats);
}

Movement.prototype.scale = function(x,y)
{
  this.btranslate = new Bezier(0,0,this.btranslate.ctrlx1*x,
                                   this.btranslate.ctrly1*y,
                                   this.btranslate.ctrlx2*x,
                                   this.btranslate.ctrly2*y,
                                   this.btranslate.x2*x,
                                   this.btranslate.y2*y);
  this.brotate = new Bezier(0,0,this.brotate.ctrlx1*x,
                                this.brotate.ctrly1*y,
                                this.brotate.ctrlx2*x,
                                this.brotate.ctrly2*y,
                                this.brotate.x2*x,
                                this.brotate.y2*y);
  if (y < 0) {
    if (this.usehands == Movement.LEFTHAND)
      this.usehands = Movement.RIGHTHAND;
    else if (this.usehands == Movement.RIGHTHAND)
      this.usehands = Movement.LEFTHAND;
  }
  return this;
}

//  Skew the movement by translating the destination point
Movement.prototype.skew = function(x,y)
{
  this.btranslate = new Bezier(0,0,this.btranslate.ctrlx1,
                                   this.btranslate.ctrly1,
                                   this.btranslate.ctrlx2+x,
                                   this.btranslate.ctrly2+y,
                                   this.btranslate.x2+x,
                                   this.btranslate.y2+y);
  return this;
}

////////////////////////////////////////////////////////////////////////////////
//  Bezier class
function Bezier(x1,y1,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2)
{
  this.x1 = x1;
  this.y1 = y1;
  this.ctrlx1 = ctrlx1;
  this.ctrly1 = ctrly1;
  this.ctrlx2 = ctrlx2;
  this.ctrly2 = ctrly2;
  this.x2 = x2;
  this.y2 = y2;
  this.calculatecoefficients();
}

Bezier.prototype.calculatecoefficients = function()
{
  this.cx = 3.0*(this.ctrlx1-this.x1);
  this.bx = 3.0*(this.ctrlx2-this.ctrlx1) - this.cx;
  this.ax = this.x2 - this.x1 - this.cx - this.bx;

  this.cy = 3.0*(this.ctrly1-this.y1);
  this.by = 3.0*(this.ctrly2-this.ctrly1) - this.cy;
  this.ay = this.y2 - this.y1 - this.cy - this.by;
}
//  Return the movement along the curve given "t" between 0 and 1
Bezier.prototype.translate = function(t)
{
  var x = this.x1 + t*(this.cx + t*(this.bx + t*this.ax));
  var y = this.y1 + t*(this.cy + t*(this.by + t*this.ay));
  return AffineTransform.getTranslateInstance(x,y);
}

//  Return the angle of the derivative given "t" between 0 and 1
Bezier.prototype.rotate = function(t)
{
  var x = this.cx + t*(2.0*this.bx + t*3.0*this.ax);
  var y = this.cy + t*(2.0*this.by + t*3.0*this.ay);
  var theta = Math.atan2(y,x);
  return AffineTransform.getRotateInstance(theta);
}

////////////////////////////////////////////////////////////////////////////////
//   Vector class
//  constructor
function Vector(x,y,z)
{
  if (arguments.length > 0 && x instanceof Vector) {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z;
  } else {
    this.x = arguments.length > 0 ? x : 0;
    this.y = arguments.length > 1 ? y : 0;
    this.z = arguments.length > 2 ? z : 0;
  }
}
//  Add/subtract two vectors
Vector.prototype.add = function(v)
{
  return new Vector(thix.x+v.x,this.y+v.y,this.z+v.z);
}
Vector.prototype.subtract = function(v)
{
  return new Vector(this.x-v.x,this.y-v.y,this.z-v.z);
}
//  Compute the cross product
Vector.prototype.cross = function(v)
{
  return new Vector(
    this.y*v.z - this.z*v.y,
    this.z*v.x - this.x*v.z,
    this.x*v.y - this.y*v.x
  );
}

//  Return angle of vector from the origin
Vector.prototype.angle = function()
{
  return Math.atan2(this.y,this.x);
}
//  Rotate by a given angle
Vector.prototype.rotate = function(th)
{
  var d = Math.sqrt(this.x*this.x+this.y*this.y);
  var a = this.angle() + th;
  return new Vector(
      d * Math.cos(a),
      d * Math.sin(a),
      this.z);
}
//  Apply a transform
Vector.prototype.concatenate = function(tx)
{
  var vx = AffineTransform.getTranslateInstance(this.x,this.y);
  vx = vx.concatenate(tx);
  return new Vector(vx.getTranslateX(),vx.getTranslateY());
}
Vector.prototype.preConcatenate = function(tx)
{
  var vx = AffineTransform.getTranslateInstance(this.x,this.y);
  vx = vx.preConcatenate(tx);
  return new Vector(vx.getTranslateX(),vx.getTranslateY());
}

//  Return true if this vector followed by vector 2 is clockwise
Vector.prototype.isCW = function(v)
{
  return this.cross(v).z < 0;
}
Vector.prototype.isCCW = function(v)
{
  return this.cross(v).z > 0;
}
Vector.prototype.toString = function()
{
  return "("+Math.round(this.x*10)/10+","+Math.round(this.y*10)/10+")";
}
//  Return true if the vector from this to v points left of the origin
Vector.prototype.isLeft = function(v)
{
  var v1 = new Vector().subtract(this);
  var v2 = new Vector(v).subtract(this);
  return v1.isCCW(v2);
}
////////////////////////////////////////////////////////////////////////////////
//   AffineTransform class
//   constructor
function AffineTransform(tx)
{
  if (arguments.length == 0) {
    //  default constructor - return the identity matrix
    this.x1 = 1.0;
    this.x2 = 0.0;
    this.x3 = 0.0;
    this.y1 = 0.0;
    this.y2 = 1.0;
    this.y3 = 0.0;
  }
  else if (tx instanceof AffineTransform) {
    //  return a copy
    this.x1 = tx.x1;
    this.x2 = tx.x2;
    this.x3 = tx.x3;
    this.y1 = tx.y1;
    this.y2 = tx.y2;
    this.y3 = tx.y3;
  }
}
//  Generate a new transform that moves to a new location
AffineTransform.getTranslateInstance = function(x,y)
{
  a = new AffineTransform();
  a.x3 = x;
  a.y3 = y;
  return a;
}
//  Generate a new transform that does a rotation
AffineTransform.getRotateInstance = function(theta)
{
  a = new AffineTransform();
  a.x1 = a.y2 = Math.cos(theta);
  a.x2 = -(a.y1 = Math.sin(theta));
  return a;
}

AffineTransform.getScaleInstance = function(x,y)
{
  a = new AffineTransform();
  a.scale(x,y);
  return a;
}

//  Add a translation to this transform
AffineTransform.prototype.translate = function(x,y)
{
  this.x3 += x*this.x1 + y*this.x2;
  this.y3 += x*this.y1 + y*this.y2;
}

//  Add a scaling to this transform
AffineTransform.prototype.scale = function(x,y)
{
  this.x1 *= x;
  this.y1 *= x;
  this.x2 *= y;
  this.y2 *= y;
}

//  Add a rotation to this transform
AffineTransform.prototype.rotate = function(angle)
{
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  var copy = { x1: this.x1, x2: this.x2, y1: this.y1, y2: this.y2 };
  this.x1 =  cos * copy.x1 + sin * copy.x2;
  this.x2 = -sin * copy.x1 + cos * copy.x2;
  this.y1 =  cos * copy.y1 + sin * copy.y2;
  this.y2 = -sin * copy.y1 + cos * copy.y2;
  return this;
}

AffineTransform.prototype.concatenate = function(tx)
{
  // [this] = [this] x [Tx]
  var copy = { x1: this.x1, x2: this.x2, x3: this.x3,
               y1: this.y1, y2: this.y2, y3: this.y3 };
  this.x1 = copy.x1 * tx.x1 + copy.x2 * tx.y1;
  this.x2 = copy.x1 * tx.x2 + copy.x2 * tx.y2;
  this.x3 = copy.x1 * tx.x3 + copy.x2 * tx.y3 + copy.x3;
  this.y1 = copy.y1 * tx.x1 + copy.y2 * tx.y1;
  this.y2 = copy.y1 * tx.x2 + copy.y2 * tx.y2;
  this.y3 = copy.y1 * tx.x3 + copy.y2 * tx.y3 + copy.y3;
  return this;
}

AffineTransform.prototype.preConcatenate = function(tx)
{
  // [this] = [Tx] x [this]
  var copy = { x1: this.x1, x2: this.x2, x3: this.x3,
               y1: this.y1, y2: this.y2, y3: this.y3 };
  this.x1 = tx.x1 * copy.x1 + tx.x2 * copy.y1;
  this.x2 = tx.x1 * copy.x2 + tx.x2 * copy.y2;
  this.x3 = tx.x1 * copy.x3 + tx.x2 * copy.y3 + tx.x3;
  this.y1 = tx.y1 * copy.x1 + tx.y2 * copy.y1;
  this.y2 = tx.y1 * copy.x2 + tx.y2 * copy.y2;
  this.y3 = tx.y1 * copy.x3 + tx.y2 * copy.y3 + tx.y3;
  return this;
}
AffineTransform.prototype.getScaleX = function()
{
  return this.x1;
}
AffineTransform.prototype.getScaleY = function()
{
  return this.y2;
}
AffineTransform.prototype.getShearX = function()
{
  return this.x2;
}
AffineTransform.prototype.getShearY = function()
{
  return this.y1;
}
AffineTransform.prototype.getTranslateX = function()
{
  return this.x3;
}
AffineTransform.prototype.getTranslateY = function()
{
  return this.y3;
}
AffineTransform.prototype.getAngle = function()
{
  return Math.atan2(this.y1,this.y2);
}

//  Return a string that can be used as the svg transform attribute
AffineTransform.prototype.toString = function()
{
  return 'matrix('+this.x1+','+this.y1+','+
                   this.x2+','+this.y2+','+
                   this.x3+','+this.y3+')';
}
////////////////////////////////////////////////////////////////////////////////
//   Color class
function Color(r,g,b)
{
  this.r = Math.floor(r);
  this.g = Math.floor(g);
  this.b = Math.floor(b);
}
Color.FACTOR = 0.7;  // from Java
Color.hex = [ '0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
Color.black = new Color(0,0,0);
Color.red = new Color(255,0,0);
Color.green = new Color(0,255,0);
Color.blue = new Color(0,0,255);
Color.yellow = new Color(255,255,0);
Color.orange = new Color(255,200,0);
Color.lightGray = new Color(192,192,192);
Color.gray = new Color(128,128,128);
Color.magenta = new Color(255,0,255);
Color.cyan = new Color(0,255,255);
Color.prototype.invert = function()
{
  return new Color(255-this.r,255-this.g,255-this.b);
}
Color.prototype.darker = function()
{
  return new Color( Math.floor(this.r*Color.FACTOR),
                    Math.floor(this.g*Color.FACTOR),
                    Math.floor(this.b*Color.FACTOR));
}
Color.prototype.brighter = function()
{
  return this.invert().darker().invert();
}
Color.prototype.rotate = function()
{
  var c = new Color(0,0,0);
  if (this.r == 255 && this.g == 0 && this.b == 0)
    c.g = c.b = 255;
  else if (this.r == Color.lightGray.r)
    c = Color.lightGray;
  else
    c.b = 255;
  return c;
}

Color.prototype.toString = function()
{
  return '#' + Color.hex[this.r>>4] + Color.hex[this.r&0xf] +
               Color.hex[this.g>>4] + Color.hex[this.g&0xf] +
               Color.hex[this.b>>4] + Color.hex[this.b&0xf];
}
////////////////////////////////////////////////////////////////////////////////
//  Misc
Math.toRadians = function(deg)
{
  return deg * Math.PI / 180;
}
Math.IEEEremainder = function(d1,d2)
{
  var n = Math.round(d1/d2);
  return d1 - n*d2;
}


////////////////////////////////////////////////////////////////////////////////
//Build buttons and slider below animation
//Only used for SVG animation - Java codes them in the applet
//TODO this cheats a bit peeking into tamsvg data - the interface should be better
function generateButtonPanel()
{
$('#appletcontainer').append('<div id="buttonpanel" style="background-color: #c0c0c0"></div>');

$('#buttonpanel').append('<div id="optionpanel"></div>');
$('#optionpanel').append('<input type="button" class="appButton" id="slowButton" value="Slow"/>');
$('#optionpanel').append('<input type="button" class="appButton selected" id="normalButton" value="Normal"/>');
$('#optionpanel').append('<input type="button" class="appButton" id="fastButton" value="Fast"/>');
$('#optionpanel').append('<input type="button" class="appButton" id="loopButton" value="Loop"/>');
if (tamsvg.loop)
$('#loopButton').addClass('selected');
$('#optionpanel').append('<input type="button" class="appButton" id="gridButton" value="Grid"/>');
if (tamsvg.grid)
$('#gridButton').addClass('selected');
if (tamsvg.dancers.length > 8) {
$('#optionpanel').append('<input type="button" class="appButton" id="phantomButton" value="Phantoms"/>');
if (tamsvg.showPhantoms)
  $('#phantomButton').addClass('selected');
} else {
$('#optionpanel').append('<input type="button" class="appButton" id="pathsButton" value="Paths"/>');
if (tamsvg.showPaths)
  $('#pathsButton').addClass('selected');
}
$('#optionpanel').append('<input type="button" class="appButton" id="numbersButton" value="#" style="width:10%"/>');
if (tamsvg.numbers)
$('#numbersButton').addClass('selected');
tamsvg.goHexagon = tamsvg.goBigon = function() {
$('#numbersButton').removeClass('selected');
};
//  Add popup to display for extra options
$('#appletcontainer').append(popupMenuHTML);
$('#popup').hide();
$('#appletcontainer').append(popupMenuTitleHTML);
$('#titlepopup').hide();
$(tamsvg.floor).mousedown(function(ev) {
$('#popup').hide();
$('#titlepopup').hide();
});

//  Speed button actions
$('#slowButton').click(function() {
tamsvg.slow();
$('#slowButton').addClass('selected');
$('#normalButton,#fastButton').removeClass('selected');
});
$('#normalButton').click(function() {
tamsvg.normal();
$('#normalButton').addClass('selected');
$('#slowButton,#fastButton').removeClass('selected');
});
$('#fastButton').click(function() {
tamsvg.fast();
$('#fastButton').addClass('selected');
$('#slowButton,#normalButton').removeClass('selected');
});

//  Actions for other options
$('#loopButton').click(function() {
if (tamsvg.loop) {
  tamsvg.loop = false;
  $('#loopButton').removeClass('selected');
} else {
  tamsvg.loop = true;
  $('#loopButton').addClass('selected');
}
cookie.loop = tamsvg.loop;
cookie.store();
});
$('#pathsButton').click(function() {
if (tamsvg.showPaths) {
  tamsvg.showPaths = false;
  tamsvg.setPaths(false);
  //tamsvg.pathparent.setAttribute('visibility','hidden');
  $('#pathsButton').removeClass('selected');
} else {
  tamsvg.showPaths = true;
  tamsvg.setPaths(true);
  //tamsvg.pathparent.setAttribute('visibility','visible');
  $('#pathsButton').addClass('selected');
}
cookie.paths = tamsvg.showPaths;
cookie.store();
});
$('#gridButton').click(function() {
if (tamsvg.grid) {
  tamsvg.grid = false;
  tamsvg.hexgridgroup.setAttribute('visibility','hidden');
  tamsvg.bigongridgroup.setAttribute('visibility','hidden');
  tamsvg.gridgroup.setAttribute('visibility','hidden');
  $('#gridButton').removeClass('selected');
} else {
  tamsvg.grid = true;
  if (tamsvg.hexagon)
    tamsvg.hexgridgroup.setAttribute('visibility','visible');
  else if (tamsvg.bigon)
    tamsvg.bigongridgroup.setAttribute('visibility','visible');
  else
    tamsvg.gridgroup.setAttribute('visibility','visible');
  $('#gridButton').addClass('selected');
}
cookie.grid = tamsvg.grid;
cookie.store();
});
$('#phantomButton').click(function() {
if (tamsvg.showPhantoms) {
  tamsvg.showPhantoms = false;
  for (var i in tamsvg.dancers)
    if (tamsvg.dancers[i].gender == Dancer.PHANTOM)
      tamsvg.dancers[i].hide();
  tamsvg.animate();
  $('#phantomButton').removeClass('selected');
} else {
  tamsvg.showPhantoms = true;
  for (var i in tamsvg.dancers)
    if (tamsvg.dancers[i].gender == Dancer.PHANTOM)
      tamsvg.dancers[i].show();
  tamsvg.animate();
  $('#phantomButton').addClass('selected');
}
});
$('#numbersButton').click(function() {
tamsvg.setNumbers(!tamsvg.setNumbers());
if (tamsvg.numbers)
  $('#numbersButton').addClass('selected');
else
  $('#numbersButton').removeClass('selected');
cookie.numbers = tamsvg.numbers
cookie.store();
});

//  Slider
$('#buttonpanel').append('<div id="playslider" style="margin:10px 10px 0 10px"></div>');
$('#playslider').slider({min: -200, max: tamsvg.beats*100, value: -200,
slide: function(event,ui) {
  //tamsvg.beat = ui.value/100;
  //tamsvg.lastPaintTime = new Date().getTime();
  //tamsvg.animate();
  tamsvg.setBeat(ui.value/100);
}});
//  Slider tick marks
$('#buttonpanel').append('<div id="playslidertics" style="position: relative; height:10px; width:100%"></div>');
for (var i=-1; i<tamsvg.beats; i++) {
var x = (i+2) * $('#buttonpanel').width() / (tamsvg.beats+2);
$('#playslidertics').append('<div style="position: absolute; background-color: black; top:0; left:'+x+'px; height:100%; width: 1px"></div>');
}
//  "Start", "End" and part numbers below slider
$('#buttonpanel').append('<div id="playsliderlegend" style="color: black; position: relative; top:0; left:0; width:100%; height:16px"></div>');
var startx = 2 * $('#buttonpanel').width() / (tamsvg.beats+2) - 50;
var endx = tamsvg.beats * $('#buttonpanel').width() / (tamsvg.beats+2) - 50;
$('#playsliderlegend').append('<div style="position:absolute; top:0; left:'+startx+'px; width:100px; text-align: center">Start</div>');
$('#playsliderlegend').append('<div style="position:absolute;  top:0; left:'+endx+'px; width: 100px; text-align:center">End</div>');
var offset = 0;
for (var i in tamsvg.parts) {
if (tamsvg.parts[i] > 0) {
  var t = '<font size=-2><sup>'+(Number(i)+1) + '</sup>/<sub>' + (tamsvg.parts.length+1) + '</sub></font>';
  offset += tamsvg.parts[i];
  var x = (offset+2) * $('#buttonpanel').width() / (tamsvg.beats+2) - 20;
  $('#playsliderlegend').append('<div style="position:absolute; top:0; left:'+x+
      'px; width:40px; text-align: center">'+t+'</div>');
}
}

//  Bottom row of buttons
$('#buttonpanel').append('<input type="button" class="appButton" id="rewindButton" value="&lt;&lt;"/>');
$('#rewindButton').click(function() { tamsvg.rewind(); });
$('#buttonpanel').append('<input type="button" class="appButton" id="prevButton" value="|&lt;"/>');
$('#prevButton').click(function() { tamsvg.prev(); });
$('#buttonpanel').append('<input type="button" class="appButton" id="backButton" value="&lt;"/>');
$('#backButton').click(function() { tamsvg.backward(); });
$('#buttonpanel').append('<input type="button" class="appButton" id="playButton" value="Play"/>');
$('#playButton').click(function() { tamsvg.play(); });
$('#buttonpanel').append('<input type="button" class="appButton" id="forwardButton" value="&gt;"/>');
$('#forwardButton').click(function() { tamsvg.forward(); });
$('#buttonpanel').append('<input type="button" class="appButton" id="nextButton" value="&gt;|"/>');
$('#nextButton').click(function() { tamsvg.next(); });
$('#buttonpanel').append('<input type="button" class="appButton" id="endButton" value="&gt;&gt;"/>');
$('#endButton').click(function() { tamsvg.end(); });
tamsvg.animationStopped = function()
{
$('#playButton').attr('value','Play');
}

}
