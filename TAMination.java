
/*

    Copyright 2010 Brad Christie

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


import java.awt.BasicStroke;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.geom.AffineTransform;
import java.awt.geom.CubicCurve2D;
import java.awt.geom.Ellipse2D;
import java.awt.geom.GeneralPath;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.awt.geom.RoundRectangle2D;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.ListIterator;
import java.util.StringTokenizer;
import javax.swing.SwingUtilities;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JCheckBoxMenuItem;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import javax.swing.JSlider;
import javax.swing.border.Border;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import netscape.javascript.JSObject;

interface SetValue {
  public void setValue(String name, String value)
    throws TAMinationException;
}

public class TAMination extends JApplet {

  private static final long serialVersionUID = 1L;
  javax.swing.Timer timer;
  JSObject win;
  DanceFloor df;
  long starttime;
  double bps = 2.0;     // dance beats per second
  static int leadin = 2;  // beats to count before starting
  static int leadout = 2; // beats to count before looping
  double beat;
  double totalbeats = 10;
  boolean running=false;
  boolean frozen=false;
  boolean loop;
  boolean grid;
  int speed;
  JPanel panel;
  JButton playstopbutton;
  JButton forwardbutton;
  JButton reversebutton;
  JSlider positionslider;
  JSlider speedslider;
  Hashtable parts = new Hashtable();
  int currentpart;
  static Color tamgreen = Color.green.darker().darker().darker();
  static Color tamgray = Color.gray.brighter();
  private JLabel title;
  private String formation = "";
  private PlayStopButtonAction psba;

  public TAMination() { super(); }

  class PlayStopButtonAction implements ActionListener
  {
    public void actionPerformed(ActionEvent arg0)
    {
      if (running) {
        timer.stop();
        running = false;
        playstopbutton.setText("Play");
        forwardbutton.setEnabled(true);
        reversebutton.setEnabled(true);
      } else {
        if (beat > totalbeats)
          beat = 0;
        starttime = System.currentTimeMillis() -
          (long)((beat)*1000.0/bps);
        timer.start();
        running = true;
        playstopbutton.setText("Stop");
        forwardbutton.setEnabled(false);
        reversebutton.setEnabled(false);
        df.animate(beat);
      }
      frozen = false;  // just in case
    }

  }

  JButton setButtonColors(JButton j)
  {
    j.setForeground(Color.white);
    j.setBackground(tamgreen);
    Border rb = BorderFactory.createRaisedBevelBorder();
    j.setBorder(rb);    //    j.setPreferredSize(new Dimension(40,24));
    Dimension d = j.getMaximumSize();
    d.width = 100;
    j.setMaximumSize(d);
    return j;
  }

  JComponent setColors(JComponent j)
  {
    j.setForeground(Color.black);
    j.setBackground(tamgray);
    return j;
  }

  void buildUI(Container container, String error)
  {
    container.removeAll();
    container.setLayout(new BoxLayout(container,BoxLayout.Y_AXIS));
    container.setBackground(Color.white);
    title = new JLabel("");
    title.setForeground(Color.black);
    title.setFont(title.getFont().deriveFont(12.0f));
    container.add(title);
    if (error != null) {
      title.setText(error);
      return;
    }
    container.add(df);

    panel = new JPanel(new BorderLayout());
    panel.setBackground(tamgray);
    Dimension dim = panel.getMaximumSize();
    dim.height = 80;
    panel.setMaximumSize(dim);
    panel.setPreferredSize(dim);
    container.add(panel);

    loop = getParameter("loop") != null &&
           getParameter("loop").compareTo("true")==0;
    grid = getParameter("grid") != null &&
           getParameter("grid").compareTo("true")==0;
    df.showpath = getParameter("paths") != null &&
                  getParameter("paths").compareTo("true")==0;
    if (df.showpath)
      df.calculateDancerPaths();


    //  Speed slider sets bps*10
    JPanel speedpanel = new JPanel(new BorderLayout());
    setColors(speedpanel);
    panel.add(speedpanel,BorderLayout.WEST);
    if (getParameter("speed") != null)
      speed = Integer.parseInt(getParameter("speed"),10);
    else
      speed = 20;
    speed = Math.min(Math.max(speed,1),60);
    bps = (double)speed/10.0;
    speedslider = new JSlider(JSlider.VERTICAL,1,60,speed);
  // doesn't work  speedslider.setSize(new Dimension(20,50));
    setColors(speedslider);
    speedslider.addChangeListener(new ChangeListener() {
        public void stateChanged(ChangeEvent e) {
          speed = speedslider.getValue();
           try {
             if (win != null)
               win.eval("cookie.speed="+speed+";cookie.store();");
           } catch (Exception ex) { ex.printStackTrace(); }
          bps = (double)speed/10.0;
          starttime = System.currentTimeMillis() -
            (long)((beat)*1000.0/bps);
        }});
    speedpanel.add(speedslider,BorderLayout.EAST);
    JLabel fast = new JLabel("fast");
    setColors(fast);
    JLabel slow = new JLabel("slow");
    setColors(slow);
    JPanel speedlabelpanel = new JPanel(new BorderLayout());
    setColors(speedlabelpanel);
    speedlabelpanel.add(fast,BorderLayout.NORTH);
    speedlabelpanel.add(slow,BorderLayout.SOUTH);
    speedpanel.add(speedlabelpanel,BorderLayout.WEST);

    JPanel centerpanel = new JPanel();
    centerpanel.setLayout(new BoxLayout(centerpanel,BoxLayout.Y_AXIS));
    setColors(centerpanel);
    //    panel.add(centerpanel,BorderLayout.CENTER);
    positionslider = new JSlider(0,(int)(totalbeats*100.0),0);
    setColors(positionslider);
    positionslider.setMinorTickSpacing(100);
    positionslider.setLabelTable(parts);
    positionslider.setPaintTicks(true);
    positionslider.setPaintLabels(true);
    positionslider.addChangeListener(new ChangeListener() {
        public void stateChanged(ChangeEvent e) {
          frozen = positionslider.getValueIsAdjusting();
          if (frozen) {
            beat = (double)positionslider.getValue()/100.0;
            starttime = System.currentTimeMillis() -
              (long)((beat)*1000.0/bps);
            df.animate(beat);
          }
        }});
    panel.add(positionslider,BorderLayout.CENTER);

    JPanel buttonpanel = new JPanel();
    buttonpanel.setLayout(new BoxLayout(buttonpanel,BoxLayout.X_AXIS));
    panel.add(buttonpanel,BorderLayout.SOUTH);
    JButton gotostartbutton = new JButton("<<");
    setButtonColors(gotostartbutton);
    gotostartbutton.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e) {
          starttime = System.currentTimeMillis();
          df.animate(beat=0);
          positionslider.setValue(0);
        }});
    buttonpanel.add(gotostartbutton);

    JButton gotoprevbutton = new JButton("|<");
    setButtonColors(gotoprevbutton);
    gotoprevbutton.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent ee) {
          double bestbeat = 0;
          for (Enumeration e=parts.keys(); e.hasMoreElements();) {
            double b = ((Integer)e.nextElement()).doubleValue()/100.0;
            if (b < beat && b > bestbeat)
              bestbeat = b;
          }
          beat = bestbeat;
          if (running)
            starttime = System.currentTimeMillis() - (int)(1000*beat/bps);
          df.animate(beat);
          positionslider.setValue((int)(beat*100));
        }});
    buttonpanel.add(gotoprevbutton);

    reversebutton = new JButton(" < ");
    setButtonColors(reversebutton);
    reversebutton.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e) {
          if (!running && beat > 0) {
            beat = Math.min(beat,totalbeats-leadout);
            beat -= 0.1; df.animate(beat);
            positionslider.setValue((int)(beat*100));
          }}});
    buttonpanel.add(reversebutton);

    playstopbutton = new JButton("Play");
    setButtonColors(playstopbutton);
    psba = new PlayStopButtonAction();
    playstopbutton.addActionListener(psba);
    buttonpanel.add(playstopbutton);

    forwardbutton = new JButton(" > ");
    setButtonColors(forwardbutton);
    forwardbutton.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e)
        { if (!running && beat < totalbeats) {
          beat = Math.max(beat,leadin);
          beat += 0.1;
          df.animate(beat);
          positionslider.setValue((int)(beat*100));
        }}});
    buttonpanel.add(forwardbutton);

    JButton gotonextbutton = new JButton(">|");
    setButtonColors(gotonextbutton);
    gotonextbutton.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent ee) {
          double bestbeat = totalbeats;
          for (Enumeration e=parts.keys(); e.hasMoreElements();) {
            double b = ((Integer)e.nextElement()).doubleValue()/100.0;
            if (b > beat && b < bestbeat)
              bestbeat = b;
          }
          beat = bestbeat;
          if (running)
            starttime = System.currentTimeMillis() - (int)(1000*beat/bps);
          df.animate(beat);
          positionslider.setValue((int)(beat*100));
        }});
    buttonpanel.add(gotonextbutton);

    JButton gotoendbutton = new JButton(">>");
    setButtonColors(gotoendbutton);
    gotoendbutton.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e) {
          beat = Math.max(beat,totalbeats-leadout);
          if (running)
            starttime = System.currentTimeMillis() - (int)(1000*beat/bps);
          df.animate(beat);
          positionslider.setValue((int)(beat*100));
        }});
    buttonpanel.add(gotoendbutton);

    df.addMouseListener(new MouseAdapter() {
        public void mousePressed(MouseEvent e) {
          if (e.isPopupTrigger())
            df.processMouse(e);
        }
        public void mouseReleased(MouseEvent e) {
          if (e.isPopupTrigger())
            df.processMouse(e);
        }
      });

    //  Set up a timer that calls this object's action handler
    //delay = 10 ms
    timer = new javax.swing.Timer(10, new ActionListener() {
        public void actionPerformed(ActionEvent e) {
          //  Calculate current beat
          if (running && !frozen) {
            long now = System.currentTimeMillis();
            if (beat > totalbeats) {
              if (loop)
                starttime = now;
              else {
                timer.stop();
                running = false;
                playstopbutton.setText("Play");
                forwardbutton.setEnabled(true);
                reversebutton.setEnabled(true);
              }
            }
            beat = (now-starttime) * bps / 1000.0;
            df.animate(beat);
            positionslider.setValue((int)(beat*100));
          }
        }});
    timer.setInitialDelay(0);
    timer.setCoalesce(true);
    running = false;
    starttime = System.currentTimeMillis();
    df.animate(0);
  }

  //  Run a method in the Swing thread, and wait for it to return
  //  Any exceptions are dumped to the Java console
  private void invokeNow(Runnable doit)
  {
    if (SwingUtilities.isEventDispatchThread())
      doit.run();
    else try {
      SwingUtilities.invokeAndWait(doit);
    } catch (Exception e) {
      // Auto-generated catch block
      e.printStackTrace();
    }
  }

  //  Takes the value from <param parts="1;2;3"> and places the
  //  parts numbers on the slider.  If no parts, puts "Start" and "End".
  public void setParts(String instr)
  {
    final String pstr = instr == null ? "" : instr;
    invokeNow(new Runnable() {
      public void run() {
        StringTokenizer st = new StringTokenizer(pstr,";");
        int partnum = 1;
        int totalparts = st.countTokens()+1;
        double beatnum = leadin;
        parts.clear();
        while (st.hasMoreTokens()) {
          String b = st.nextToken().trim();
          // Default label is "m/n" using subscript and superscript and small font
          String lstr = "<html><font size=-2><sup>"+partnum+
          "</sup>/<sub>"+totalparts+
          "</sub></font></html>";
          // Use 1-character codes for 1/4, 1/2, 3/4
          if (partnum==1 && totalparts==2 ||
              partnum==2 && totalparts==4)
            lstr = "½";
          else if (partnum==1 && totalparts==4)
            lstr = "¼";
          else if (partnum==3 && totalparts==4)
            lstr = "¾";
          // If an explicit label was given, use that
          int i = b.indexOf("[");
          if (i > 0) {
            lstr = b.substring(i+1,b.indexOf("]"));
            b = b.substring(0,i).trim();
          }
          beatnum += Double.parseDouble(b);
          parts.put(new Integer((int)(beatnum*100)),
              setColors(new JLabel(lstr)));
          partnum++;
        }
        parts.put(new Integer(leadin*100),
            setColors(new JLabel("Start")));
        parts.put(new Integer((int)((df.maxbeats()-leadout)*100)),
            setColors(new JLabel("End")));
      }
    });
  }

  public void setFormation(String information)
  {
    formation = information;
    final TAMination tam = this;
    invokeNow(new Runnable() {
      public void run() {
        try {
          df = new DanceFloor(tam,Formation.get(formation));
          if (timer != null)
            timer.stop();
          running = false;
          df.animate(beat=0);
        } catch (FormationNotFoundException e) {
          title.setText(e.getMessage());
        }
      }
    });
  }

  public void addDancer(int ind, String inname)
  {
    final int d = ind;
    final String pname = inname;
    invokeNow(new Runnable() {
      public void run() {
        try {
          if (pname != null) {
            Path p = new Path();
            for (int i=0; i<leadin; i++) {
              //  Hack so static "hexagon" looks good
              if (formation.equals("Static Square")) {
                if (d % 2 == 0)
                  p.add(Path.get("Movement left 1 0 0 0 0 0 0"));
                else
                  p.add(Path.get("Movement right 1 0 0 0 0 0 0"));
              }
              else
                p.add(Path.get("Movement both 1 0 0 0 0 0 0"));
            }
            (new Path()).setValue("dance",pname);
            p.add(Path.get("dance"));
            for (int i=0; i<leadout; i++) {
//            This clobbers ending handholds for calls starting from a static square
//            if (getParameter("formation").equals("Static Square")) {
//            if (d % 2 == 0)
//            p.add(Path.get("final left"));
//            else
//            p.add(Path.get("final right"));
//            }
//            else
              p.add(Path.get("Movement gripboth 1 0 0 0 0 0 0"));
            }
            df.dancerPath(d,p);
            if (p.beats() > totalbeats)
              totalbeats = p.beats();
          }
        } catch (TAMinationException e) {
          title.setText(e.getMessage());
        }
      }
    });
  }

  //  Called only when this is run as an applet.
  public void init()
  {
    final TAMination tam = this;
    try {
      win = JSObject.getWindow(this);
    } catch (Throwable ex) {
      System.out.println(ex);
      ex.printStackTrace();
      win = null;
    }
    invokeNow(new Runnable() {
      public void run() {
        bps = 2.0;
        //String error = null;
        int width = Integer.parseInt(getParameter("appwidth"));
        int height = Integer.parseInt(getParameter("appheight"));
        int mysize = Math.min(width,height);
        if (mysize > 0)
          Dancer.size = mysize*2/25;
        try {
          df = new DanceFloor(tam,Formation.get(getParameter("formation")));
          for (int d = 1; d<=6; d++) {
            addDancer(d,getParameter("dance"+d));
          }
          totalbeats = df.maxbeats();
          setParts(getParameter("parts"));
        } catch (TAMinationException e) {
          System.out.println(e.getMessage());
        }
        rebuildUI();
        if (getParameter("phantoms") != null &&
            getParameter("phantoms").compareTo("true")==0)
          df.showphantoms = true;
        if (getParameter("hexagon") != null &&
            getParameter("hexagon").compareTo("true")==0)
          df.hma.actionPerformed(null);
        if (getParameter("play") != null &&
            getParameter("play").compareTo("true")==0)
          psba.actionPerformed(null);
        //  Tell JavaScript to set up
        //  the formation and paths
        //if (win != null)
        //  win.eval("SelectAnimation(callnumber)");
      }
    });
  }

  //  Some more applet routines
  public void stop()
  {
    frozen = true;
  }
  public void start()
  {
    frozen = false;
  }
  public void rebuildUI()
  {
    invokeNow(new Runnable() {
      public void run() {
        totalbeats = df.maxbeats();
        int width = Integer.parseInt(getParameter("appwidth"));
        int height = Integer.parseInt(getParameter("appheight"));
        int mysize = Math.min(width,height);
        if (mysize > 0)
          Dancer.size = mysize*2/25;
        buildUI(getContentPane(),null);
        getContentPane().validate();
        df.animate(0);
      }
    });
  }

  //  Called only when this is run as an application.
  public static void main(String[] args)
  {
    JFrame f = new JFrame("TAMination");
    f.addWindowListener(new WindowAdapter() {
        public void windowClosing(WindowEvent e) {
          System.exit(0);
        }
      });
    TAMination sq = new TAMination();

    String error = null;
    try {
      sq.df = new DanceFloor(sq,Formation.get(args[0]));
      for (int i=1; i<args.length; i++) {
        Path p = new Path();
        for (int j=0; j<leadin; j++)
          p.add(Path.get("Movement both 1 0 0 0 0 0 0"));
        (new Path()).setValue("dance",args[i]);
        p.add(Path.get("dance"));
        for (int j=0; j<leadout; j++)
          p.add(Path.get("Movement both 1 0 0 0 0 0 0"));
        sq.df.dancerPath(i,p);
      }
      sq.totalbeats = sq.df.maxbeats();
      sq.setParts("");
    } catch (TAMinationException e) {
      error = e.getMessage();
      if (sq.df == null)
        sq.df = new DanceFloor(sq);
    }
    sq.buildUI(f.getContentPane(),error);
    f.pack();
    f.setVisible(true);
  }

}

////////////////////////////////////////////////////////////////////////////////

class Handhold implements Comparable {

  Dancer d1,d2;
  int h1,h2;
  double score;
  private boolean isincenter = false;
  public static double dfactor0 = 1.0;

  public Handhold(Dancer dd1, Dancer dd2, int hh1, int hh2, double ss)
  {
    d1 = dd1;
    d2 = dd2;
    h1 = hh1;
    h2 = hh2;
    score = ss;
  }

  //  If two dancers can hold hands, create and return a handhold.
  //  Else return null.
  static public Handhold getHandhold(Dancer d1, Dancer d2)
  {
    //  Turn off grips if not specified in current movement
    if ((d1.hands & Movement.GRIPRIGHT) != Movement.GRIPRIGHT)
      d1.rightgrip = null;
    if ((d1.hands & Movement.GRIPLEFT) != Movement.GRIPLEFT)
      d1.leftgrip = null;
    if ((d2.hands & Movement.GRIPRIGHT) != Movement.GRIPRIGHT)
      d2.rightgrip = null;
    if ((d2.hands & Movement.GRIPLEFT) != Movement.GRIPLEFT)
      d2.leftgrip = null;

    if (d1.rightgrip == d2 && d2.rightgrip == d1)
      return new Handhold(d1,d2,Movement.RIGHTHAND,Movement.RIGHTHAND,0.0);
    if (d1.rightgrip == d2 && d2.leftgrip == d1)
      return new Handhold(d1,d2,Movement.RIGHTHAND,Movement.LEFTHAND,0.0);
    if (d1.leftgrip == d2 && d2.rightgrip == d1)
      return new Handhold(d1,d2,Movement.LEFTHAND,Movement.RIGHTHAND,0.0);
    if (d1.leftgrip == d2 && d2.leftgrip == d1)
      return new Handhold(d1,d2,Movement.LEFTHAND,Movement.LEFTHAND,0.0);


    //  Check distance
    if (d1.tx == null || d2.tx == null)
      return null;
    double x1 = d1.tx.getTranslateX();
    double y1 = d1.tx.getTranslateY();
    double x2 = d2.tx.getTranslateX();
    double y2 = d2.tx.getTranslateY();
    double dx = x2-x1;
    double dy = y2-y1;
    double dfactor1 = 0.1;  // for distance up to 2.0
    double dfactor2 = 2.0;  // for distance past 2.0
    double d = Math.sqrt(dx*dx+dy*dy)*dfactor0/Dancer.size;
    double score = d > 2.0 ? (d-2.0)*dfactor2+2*dfactor1 : d*dfactor1;
    //  Angle between dancers
    double a0 = Math.atan2(dy,dx);
    //  Angle each dancer is facing
    double a1 = Math.atan2(d1.tx.getScaleX(),d1.tx.getShearX());
    double a2 = Math.atan2(d2.tx.getScaleX(),d2.tx.getShearX());
    //    System.out.println("a0 = "+a0+"  a1 = "+a1+"  a2 = "+a2);
    //  For each dancer, try left and right hands
    int h1 = 0;
    int h2 = 0;
    double afactor1 = 0.2;
    double afactor2 = 1.0;
    //  Dancer 1
    double a = Math.abs(Math.IEEEremainder( Math.abs(a1-a0),Math.PI*2));
    double ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                                  : a*afactor1;
    //    System.out.println("1 score = "+score+"  ascore = "+ascore);
    if (score+ascore < 1.0 && (d1.hands & Movement.RIGHTHAND) != 0 &&
        d1.rightgrip==null || d1.rightgrip==d2) {
      score = d1.rightgrip==d2 ? 0.0 : score + ascore;
      h1 = Movement.RIGHTHAND;
    } else {
      a = Math.abs(Math.IEEEremainder(Math.abs(a1-a0+Math.PI),Math.PI*2));
      ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                             : a*afactor1;
      if (score+ascore < 1.0 && (d1.hands & Movement.LEFTHAND) != 0 &&
          d1.leftgrip==null || d1.leftgrip==d2) {
        score = d1.leftgrip==d2 ? 0.0 : score + ascore;
        h1 = Movement.LEFTHAND;
      } else
        return null;
    }
    if (score > 1.0)
      return null;
    //  Dancer 2
    a = Math.abs(Math.IEEEremainder(Math.abs(a2-a0+Math.PI),Math.PI*2));
    ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                           : a*afactor1;
    //    System.out.println("2 score = "+score+"  ascore = "+ascore);
    if (score+ascore < 1.0 && (d2.hands & Movement.RIGHTHAND) != 0 &&
        d2.rightgrip==null || d2.rightgrip==d1) {
      score = d2.rightgrip==d1 ? 0.0 : score + ascore;
      h2 = Movement.RIGHTHAND;
    } else {
      a = Math.abs(Math.IEEEremainder(Math.abs(a2-a0),Math.PI*2));
      ascore = a > Math.PI/6 ? (a-Math.PI/6)*afactor2+Math.PI/6*afactor1
                             : a*afactor1;
      if (score+ascore < 1.0 && (d2.hands & Movement.LEFTHAND) != 0 &&
          d2.leftgrip==null || d2.leftgrip==d1) {
        score = d2.leftgrip==d1 ? 0.0 : score + ascore;
        h2 = Movement.LEFTHAND;
      } else
        return null;
    }
    //    System.out.println("3 score = "+score+"  ascore = "+ascore);
    if (score > 1.0)
      return null;
    return new Handhold(d1,d2,h1,h2,score);
  }

  public int compareTo(Object o)
  {
    return (int)((score-((Handhold)o).score)*1000);
  }

  public boolean inCenter()
  {
    double x1 = d1.tx.getTranslateX();
    double y1 = d1.tx.getTranslateY();
    double x2 = d2.tx.getTranslateX();
    double y2 = d2.tx.getTranslateY();
    isincenter = Math.sqrt(x1*x1+y1*y1) < Dancer.size*1.1 &&
           Math.sqrt(x2*x2+y2*y2) < Dancer.size*1.1;
    return isincenter;
  }

  public void paint(Graphics g)
  {
    //    System.out.println("-- paint --");
    double x1 = d1.tx.getTranslateX();
    double y1 = d1.tx.getTranslateY();
    double x2 = d2.tx.getTranslateX();
    double y2 = d2.tx.getTranslateY();
    g.setColor(Color.ORANGE);
    //  If both dancers are close to the center, the handhold
    //  must be a center star.  Should always look the same for
    //  normal squares, but makes a 3-center handhold for hexagon squares.
    if (isincenter) {
      g.drawLine((int)x1,(int)y1,0,0);
      g.drawLine((int)x2,(int)y2,0,0);
      g.fillOval(-4,-4,9,9);
    } else {
      g.drawLine((int)x1,(int)y1,(int)x2,(int)y2);
      int xc = (int)(x1+x2)/2;
      int yc = (int)(y1+y2)/2;
      g.fillOval(xc-4,yc-4,9,9);
    }
  }

}

////////////////////////////////////////////////////////////////////////////////

class DanceFloor extends JPanel
{
  private static final long serialVersionUID = 1L;
  static int size = 350;
  TAMination controller;
  Dimension preferredsize = new Dimension(size,size);
  ArrayList dancer;
  ArrayList savedancer;  // for restoring after hexagon
  Dancer dhit;
  Dancer barstool;
  double bx0,by0;
  Dancer compass;
  double theta0;
  boolean enlarged;
  boolean hexagon;
  double prevbeat;  // for hexagon
  boolean hasphantoms = false;
  boolean showphantoms = false;
  boolean showpath = false;
  int currentPart = 0;
  HexagonMenuAction hma = new HexagonMenuAction();

  class HexagonMenuAction implements ActionListener
  {
    public void actionPerformed(ActionEvent ee) {
      if (hexagon) {
        //  Restore orignal dancers
        dancer = savedancer;
        hexagon = false;
      } else {
        //  Generate hexagon setup
        savedancer = new ArrayList();  // for restoring normal square later
        for (int j=0; j<dancer.size(); j++)
          savedancer.add(((Dancer)dancer.get(j)).clone());
        hexagon = true;
        //  Start by removing C2-generated dancers
        dancer.remove(1);
        dancer.remove(2);
        if (dancer.size() >= 6) {
          dancer.remove(3);
          dancer.remove(4);
        }
        if (dancer.size() >= 8) {
          dancer.remove(5);
          dancer.remove(6);
        }
        //  Adjust remaining dancers
        for (int ii=0; ii<dancer.size(); ii++)
          hexagonify((Dancer)dancer.get(ii));
        //  Now generate C3-symmetrical dancers
        addHexagonDancer((Dancer)dancer.get(0),120,Color.green);
        addHexagonDancer((Dancer)dancer.get(0),240,Color.magenta);
        addHexagonDancer((Dancer)dancer.get(1),120,Color.green);
        addHexagonDancer((Dancer)dancer.get(1),240,Color.magenta);
        if (dancer.size()>=8) {
          addHexagonDancer((Dancer)dancer.get(2),120,Color.blue);
          addHexagonDancer((Dancer)dancer.get(2),240,Color.cyan);
          addHexagonDancer((Dancer)dancer.get(3),120,Color.blue);
          addHexagonDancer((Dancer)dancer.get(3),240,Color.cyan);
        }
        if (dancer.size()>=14) {
          addHexagonDancer((Dancer)dancer.get(4),120,Color.lightGray);
          addHexagonDancer((Dancer)dancer.get(4),240,Color.lightGray);
          addHexagonDancer((Dancer)dancer.get(5),120,Color.lightGray);
          addHexagonDancer((Dancer)dancer.get(5),240,Color.lightGray);
        }
      }
      barstool = null;
      compass = null;
      animate(0.0);
      calculateDancerPaths();
      repaint();
    }
  }


  public DanceFloor(TAMination controller)
  {
    this.controller = controller;
    dancer = new ArrayList();
    size = Dancer.size*12;
    barstool = null;
    compass = null;
    bx0 = by0 = 0.0;
    prevbeat = 0.0;
  }

  public DanceFloor(TAMination controller, ArrayList dancerlist)
  {
    this.controller = controller;
    dancer = dancerlist;
    size = Dancer.size*12;
    barstool = null;
    compass = null;
    bx0 = by0 = 0.0;
    prevbeat = 0.0;
  }

  public Dimension getPreferredSize() {
    return preferredsize;
  }

  public void animate(double beat)
  {

    //  If a big jump from the last hexagon animation, calculate some
    //  intervening ones so the wrap works
    while (hexagon && Math.abs(beat-prevbeat) > 1.1)
      animate(prevbeat + (beat > prevbeat ? 1.0 : -1.0));
    prevbeat = beat;

    //  Compute path for each dance at this point in time
    for (ListIterator it = dancer.listIterator(); it.hasNext();) {
      Dancer d = (Dancer)it.next();
      if (beat == 0)
        d.rightgrip = d.leftgrip = null;
      d.animate(beat);
    }

    //  If hexagon, rotate relative to center
    if (hexagon) {
      for (ListIterator it3 = dancer.listIterator(); it3.hasNext();) {
        Dancer d = (Dancer)it3.next();
        double a0 = Math.atan2(-d.startx,-d.starty);  // hack
        double a1 = Math.atan2(d.tx.getTranslateY(),
                               d.tx.getTranslateX());
        //  Correct for wrapping around +/- pi
        if (beat <= 2.0)
          d.prevangle = a1;
        double wrap = Math.round((a1-d.prevangle)/(Math.PI*2));
        a1 -= wrap*Math.PI*2;
        double a2 = -(a1-a0)/3;
        d.concatenate(AffineTransform.getRotateInstance(a2));
        d.prevangle = a1;
      }
    }

    //  If compass, rotate each dancer relative to the compass dancer
    if (compass != null) {
      double theta = Math.atan2(compass.tx.getScaleX(),
                                compass.tx.getShearX());
      double cx = compass.tx.getTranslateX();
      double cy = compass.tx.getTranslateY();
      for (ListIterator it2 = dancer.listIterator(); it2.hasNext();) {
        Dancer d = (Dancer)it2.next();
        d.concatenate(AffineTransform.getTranslateInstance(-cx,-cy));
        d.concatenate(AffineTransform.getRotateInstance(theta0-theta));
        d.concatenate(AffineTransform.getTranslateInstance(cx,cy));
      }
      //  If no barstool, recenter after compass transform
      if (barstool == null) {
        cx = cy = 0.0;
        for (ListIterator it2 = dancer.listIterator();
             it2.hasNext();) {
          Dancer d = (Dancer)it2.next();
          cx += d.tx.getTranslateX();
          cy += d.tx.getTranslateY();
        }
        for (ListIterator it2 = dancer.listIterator();
             it2.hasNext();) {
          Dancer d = (Dancer)it2.next();
          d.concatenate(AffineTransform.getTranslateInstance(-cx/dancer.size(),
                                                          -cy/dancer.size()));
        }
      }
    }

    //  If barstool, move each dancer relative to the barstool dancer
    if (barstool != null) {
      double bx = barstool.tx.getTranslateX();
      double by = barstool.tx.getTranslateY();
      for (ListIterator it2 = dancer.listIterator();
           it2.hasNext();) {
        Dancer d = (Dancer)it2.next();
        d.concatenate(AffineTransform.getTranslateInstance(bx0-bx,by0-by));
      }
    }

    //  Pass up current part
    int thispart = 0;
    for (Enumeration e=controller.parts.keys(); e.hasMoreElements();) {
      double b = ((Integer)e.nextElement()).doubleValue()/100.0;
      if (b < beat)
        thispart++;
    }
    if (beat > controller.totalbeats-TAMination.leadout)
      thispart = 0;
    if (thispart != controller.currentpart && controller.win != null)
      try {
        controller.win.eval("setPart("+thispart+")");
      } catch (Exception e) {
        // Javascript error
        e.printStackTrace();
      }
    controller.currentpart = thispart;

    repaint();
  }

  public double maxbeats()
  {
    double b = 0;
    for (ListIterator it = dancer.listIterator();
         it.hasNext();) {
      Dancer d = ((Dancer)it.next());
      if (d.path != null)
        b = Math.max(b,d.path.beats());
    }
    return b;
  }

  public void dancerPath(int i, Path p)
  {
    Dancer d = (Dancer)dancer.get(i*2-2);
    if (d != null)
      d.path = p;
    d = (Dancer)dancer.get(i*2-1);
    if (d != null)
      d.path = p;
  }

  public void calculateDancerPaths()
  {
    double savebeat = controller.beat;
    for (double b=0.0; b<maxbeats(); b+=0.1) {
      animate(b);
      ListIterator it = dancer.listIterator();
      while (it.hasNext()) {
        Dancer d = (Dancer)it.next();
        if (showpath) {
          if (b==0.0) {
            d.pathpath = new GeneralPath();
            d.pathpath.moveTo((float)d.tx.getTranslateX(),
                              (float)d.tx.getTranslateY());
          } else {
            d.pathpath.lineTo((float)d.tx.getTranslateX(),
                              (float)d.tx.getTranslateY());
          }
        }
      }
    }
    animate(savebeat);
  }

  public void paintComponent(Graphics g) {
    Graphics2D g2 = (Graphics2D)g;
    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                        RenderingHints.VALUE_ANTIALIAS_ON);
    //  paint background
    super.paintComponent(g);

    //  Draw the floor
    g2.setColor(Color.decode("#ffffc0"));
    g2.fillRect(0,0,getWidth(),getHeight());
    g2.setColor(TAMination.tamgreen);
    g2.drawString("Copyright © 2010 Brad Christie ",
                  0,getHeight()-2);
    String topstr = "";
    if (hexagon)
      topstr = topstr.concat("Hexagon ");
    if (barstool != null)
      topstr = topstr.concat("Barstool ");
    if (compass != null)
      topstr = topstr.concat("Compass");
    g2.drawString(topstr,0,12);

    //  Draw grid if requested
    g2.translate((getWidth()/Dancer.size)*Dancer.size/2,
                 (getHeight()/Dancer.size)*Dancer.size/2);
    if (controller.grid) {
      g2.setColor(Color.gray.brighter());
      if (hexagon) {
        for (double x0=Dancer.size/2; x0<getWidth(); x0+=Dancer.size) {
          GeneralPath p = new GeneralPath();
          p.moveTo((float)0,(float)x0);
          for (double y0=Dancer.size/2; y0<getWidth(); y0+=Dancer.size/2) {
            double a = Math.atan2(y0,x0)*2/3;
            double r = Math.sqrt(x0*x0+y0*y0);
            double x = r*Math.sin(a);
            double y = r*Math.cos(a);
            p.lineTo((float)x,(float)y);
          }
          GeneralPath p2 = new GeneralPath(AffineTransform.getScaleInstance(-1,1)
                 .createTransformedShape(p));
          for (int j=0; j<6; j++) {
            g2.draw(p);
            g2.draw(p2);
            p = new GeneralPath(AffineTransform.getRotateInstance(Math.PI/3)
                 .createTransformedShape(p));
            p2 = new GeneralPath(AffineTransform.getRotateInstance(Math.PI/3)
                 .createTransformedShape(p2));
          }
        }
      }
      else {
        for (int i=Dancer.size/2; i<getWidth()/2; i+=Dancer.size) {
          g2.drawLine(i,-getHeight()/2,i,getHeight()/2);
          g2.drawLine(-i,-getHeight()/2,-i,getHeight()/2);
        }
        for (int i=Dancer.size/2; i<getHeight()/2; i+=Dancer.size) {
          g2.drawLine(-getWidth()/2,i,getWidth()/2,i);
          g2.drawLine(-getWidth()/2,-i,getWidth()/2,-i);
        }
      }
    }

    //  Draw dancer path as requested
    for (ListIterator it = dancer.listIterator(); it.hasNext();) {
      Dancer d = (Dancer)it.next();
      if (d.gender == Dancer.phantom && !showphantoms)
        continue;
      if (showpath && d.pathpath!=null) {
        g2.setColor(d.drawcolor);
        g2.draw(d.pathpath);
      }
    }

    //  Draw any handholds
    //   1. collect handholds in an ArrayList
    //   2. Sort using Collections.sort()
    //   3. Apply in order
    g2.setColor(Color.orange);
    g2.setStroke(new BasicStroke(3));
    Handhold.dfactor0 = hexagon ? 1.15 : 1.0;
    ArrayList hhlist = new ArrayList();
    for (int i0=0; i0<dancer.size(); i0++) {
      Dancer d0 = (Dancer)dancer.get(i0);
      d0.righthand = d0.lefthand = null;
    }
    for (int i1=0; i1<dancer.size()-1; i1++) {
      Dancer d1 = (Dancer)dancer.get(i1);
      if (d1.gender==Dancer.phantom && !showphantoms)
        continue;
      for (int i2=i1+1; i2<dancer.size(); i2++) {
        //        System.out.println("  "+i1+"  "+i2);
        Dancer d2 = (Dancer)dancer.get(i2);
        if (d2.gender==Dancer.phantom && !showphantoms)
          continue;
        Handhold hh = Handhold.getHandhold(d1,d2);
        if (hh != null)
          hhlist.add(hh);
      }
    }
    Collections.sort(hhlist);
    for (int h=0; h<hhlist.size(); h++) {
      Handhold hh = (Handhold)hhlist.get(h);
      //  Check that the hands aren't already used
      boolean incenter = hexagon && hh.inCenter();
      if (incenter ||
          (hh.h1 == Movement.RIGHTHAND && hh.d1.righthand == null ||
           hh.h1 == Movement.LEFTHAND && hh.d1.lefthand == null) &&
          (hh.h2 == Movement.RIGHTHAND && hh.d2.righthand == null ||
           hh.h2 == Movement.LEFTHAND && hh.d2.lefthand == null)) {
        hh.paint(g2);
        if (incenter)
          continue;
        if (hh.h1 == Movement.RIGHTHAND) {
          hh.d1.righthand = hh.d2;
          if ((hh.d1.hands & Movement.GRIPRIGHT) == Movement.GRIPRIGHT)
            hh.d1.rightgrip = hh.d2;
        } else {
          hh.d1.lefthand = hh.d2;
          if ((hh.d1.hands & Movement.GRIPLEFT) == Movement.GRIPLEFT)
            hh.d1.leftgrip = hh.d2;
        }
        if (hh.h2 == Movement.RIGHTHAND) {
          hh.d2.righthand = hh.d1;
          if ((hh.d2.hands & Movement.GRIPRIGHT) == Movement.GRIPRIGHT)
            hh.d2.rightgrip = hh.d1;
        } else {
          hh.d2.lefthand = hh.d1;
          if ((hh.d2.hands & Movement.GRIPLEFT) == Movement.GRIPLEFT)
            hh.d2.leftgrip = hh.d1;
        }
      }
    }
    g2.setStroke(new BasicStroke(1));

    //  Draw the dancers
    for (ListIterator it = dancer.listIterator();
         it.hasNext();) {
      Dancer d = (Dancer)it.next();
      if (d.gender==Dancer.phantom && !showphantoms)
        continue;
      d.paint(g2);
      //  Draw barstool pin
      if (d == barstool) {
        g2.setColor(Color.black);
        g2.fillOval((int)bx0-3,(int)by0-3,6,6);
      }
      //  Draw compass cross
      if (d == compass) {
        g2.setColor(Color.black);
        g2.setStroke(new BasicStroke(1));
        int cx = (int)d.tx.getTranslateX();
        int cy = (int)d.tx.getTranslateY();
        g2.drawLine(cx-6,cy,cx+6,cy);
        g2.drawLine(cx,cy-6,cx,cy+6);
      }
    }
  }

  void hexagonify(Dancer d)
  {
    //  Transform start position by rotating away from +x direction
    double x = d.startx;
    double y = d.starty;
    double r = Math.sqrt(x*x+y*y);
    double angle = Math.atan2(y,x);
    double dangle = 0.0;
    if (angle < 0)
      dangle = -(Math.PI+angle)/3;
    else
      dangle = (Math.PI-angle)/3;
    d.startx = r*Math.cos(angle+dangle);
    d.starty = r*Math.sin(angle+dangle);
    d.startangle += dangle*180/Math.PI;
    d.computeStart();
    d.recalculate();
  }

  void addHexagonDancer(Dancer d, double a, Color c)
  {
    double x = d.startx;
    double y = d.starty;
    double r = Math.sqrt(x*x+y*y);
    double angle = Math.atan2(y,x) + Math.PI*a/180;
    dancer.add(new Dancer(d.gender,
                          r*Math.cos(angle),
                          r*Math.sin(angle),
                          d.startangle + a,
                          c,
                          d.path));
  }

  public int processMouse(MouseEvent e)
  {
    ListIterator it = dancer.listIterator();
    int i = 0;
    dhit = null;
    hasphantoms = false;
    while (it.hasNext()) {
      Dancer d = (Dancer)it.next();
      if (d.body.contains(e.getX()-size/2,
                          e.getY()-size/2)) {
        dhit = d;
      }
      if (d.gender == Dancer.phantom)
        hasphantoms = true;
      i++;
    }

    JPopupMenu pop = new JPopupMenu();

    JMenuItem loopitem = new JCheckBoxMenuItem("Loop",controller.loop);
    loopitem.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent ee) {
          controller.loop = !controller.loop;
          if (controller.win != null)
            try {
              controller.win.eval("cookie.loop="+controller.loop+
              ";cookie.store();");
            } catch (Exception ex) { ex.printStackTrace(); }
        }
      });
    pop.add(loopitem);

    JMenuItem griditem = new JCheckBoxMenuItem("Grid",controller.grid);
    griditem.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent ee) {
          controller.grid = !controller.grid;
          if (controller.win != null)
            try {
              controller.win.eval("cookie.grid="+controller.grid+
                                  ";cookie.store();");
            } catch (Exception ex) { ex.printStackTrace(); }
          repaint();
        }
      });
    pop.add(griditem);

    if (hasphantoms) {
      JMenuItem showphantomitem = new JCheckBoxMenuItem("Show Phantoms",showphantoms);
      showphantomitem.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent ee) {
          showphantoms = !showphantoms;
          repaint();
        }
      });
      pop.add(showphantomitem);
    }


       JMenuItem showpathitem = new JCheckBoxMenuItem("Show Dancer Paths",
                                                      showpath);
       showpathitem.addActionListener(new ActionListener() {
           public void actionPerformed(ActionEvent ee) {
             showpath = !showpath;
             calculateDancerPaths();
             repaint();
           }
         });
       pop.add(showpathitem);

    if (dhit != null) {
      JMenuItem barstoolitem = new JCheckBoxMenuItem("Barstool Dancer",
                                                     dhit == barstool);
      barstoolitem.addActionListener(new ActionListener() {
          public void actionPerformed(ActionEvent ee) {
            if (dhit == barstool) {
              barstool = null;
              bx0 = by0 = 0.0;
            }
            else {
              barstool = dhit;
              barstool.animate(0.0);
              bx0 = barstool.tx.getTranslateX();
              by0 = barstool.tx.getTranslateY();
            }
            calculateDancerPaths();
            repaint();
          }
        });
      pop.add(barstoolitem);

      JMenuItem compassitem = new JCheckBoxMenuItem("Compass Dancer",
                                                    dhit == compass);
      compassitem.addActionListener(new ActionListener() {
          public void actionPerformed(ActionEvent ee) {
            if (dhit == compass) {
              compass = null;
            } else {
              compass = dhit;
            }
            Dancer savecom = compass;
            compass = null;
            animate(0.0);
            compass = savecom;
            if (compass != null)
              theta0 = Math.atan2(compass.tx.getScaleX(),
                                  compass.tx.getShearX());
            calculateDancerPaths();
            repaint();
          }
        });
      pop.add(compassitem);

    }
    JMenuItem hexagonitem = new JCheckBoxMenuItem("Hexagon",hexagon);
    hexagonitem.addActionListener(hma);
    pop.add(hexagonitem);
    /*JMenuItem enlargeitem = new JCheckBoxMenuItem("Enlarge Dance Floor",
                                                  enlarged);
    enlargeitem.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent ee) {
          if (enlarged) {
            //size = size * 2 / 3;
            Dancer.size = Dancer.size * 3 / 2;
          } else {
            //size = size * 3 / 2;
            Dancer.size = Dancer.size * 2 / 3;
          }
          enlarged = !enlarged;
          for (ListIterator it2 = dancer.listIterator();
               it2.hasNext();) {
            Dancer d = (Dancer)it2.next();
            d.computeStart();
            d.recalculate();
          }
          Dancer savebar = barstool;
          barstool = null;
          animate(0.0);
          barstool = savebar;
          if (barstool != null) {
            bx0 = barstool.tx.getTranslateX();
            by0 = barstool.tx.getTranslateY();
          }
          calculateDancerPaths();
          repaint();
        }
      });
    pop.add(enlargeitem);*/

    if (dhit != null && e.isAltDown() && e.isControlDown()) {
      pop.add(new JMenuItem("x = "+dhit.tx.getTranslateX()));
      pop.add(new JMenuItem("y = "+dhit.tx.getTranslateY()));
    }

    pop.show(this,e.getX(),e.getY());

    return -1;
  }

}

////////////////////////////////////////////////////////////////////////////////

class Path implements SetValue {

  //  Array of Movements, used to calculate animations
  ArrayList movelist;
  //  Array of transforms of each completed Movement
  //  for timesaver calculating animations past the first Movement
  ArrayList transformlist;
  //  Standard paths
  static Hashtable paths = new Hashtable();

  Path()
  {
    movelist = new ArrayList();
    transformlist = new ArrayList();
  }

  public void recalculate()
  {
    transformlist = new ArrayList();
    AffineTransform tx = new AffineTransform();
    for (ListIterator it = movelist.listIterator();
         it.hasNext();) {
      Movement m = (Movement)it.next();
      tx.concatenate(m.translate(999));
      tx.concatenate(m.rotate(999));
      transformlist.add(new AffineTransform(tx));
    }
  }

  //  Return total number of beats in path
  double beats()
  {
    double b = 0.0;
    if (movelist != null) {
      for (ListIterator it = movelist.listIterator(); it.hasNext();)
        b += ((Movement)it.next()).beats;
    }
    return b;
  }

  //  Make the path run slower or faster to complete in a given number of beats
  public void changebeats(double newbeats)
  {
    if (movelist != null) {
      double factor = newbeats/beats();
      for (ListIterator it = movelist.listIterator(); it.hasNext();) {
        Movement m = (Movement)it.next();
        m.beats *= factor;
      }
    }
  }

  //  Change hand usage
  public void changehands(int hands)  {
    if (movelist != null) {
      for (ListIterator it = movelist.listIterator(); it.hasNext();) {
        Movement m = (Movement)it.next();
        m.useHands(hands);
      }
    }
  }

  //  Change the path by scale factors
  public void scale(double x, double y) {
    if (movelist != null) {
      for (ListIterator it = movelist.listIterator(); it.hasNext();) {
        Movement m = (Movement)it.next();
        m.scale(x,y);
      }
    }
  }

  //  Skew the path by translating the destination point
  public void skew(double x, double y) {
    if (movelist != null) {
      for (ListIterator it = movelist.listIterator(); it.hasNext();) {
        Movement m = (Movement)it.next();
        m.skew(x,y);
      }
    }
  }

  //  Append one movement to the end of the Path
  Path add(Movement m)
  {
    movelist.add(m);
    recalculate();
    return this;
  }

  Path add(String name) throws PathNotFoundException
  {
    name = (new TAMstrip(name.toLowerCase())).toString();
    return add(get(name));
  }

  //  Append one path to another
  Path add(Path p)
  {
    movelist.addAll(p.movelist);
    recalculate();
    return this;
  }

  //  Reflect the path about the x-axis
  Path reflect()
  {
    for (ListIterator it = movelist.listIterator();
         it.hasNext();)
      ((Movement)it.next()).reflect();
    recalculate();
    return this;
  }

  //  Look up a path by name
  static Path get(String name) throws PathNotFoundException
  {
    name = name.toLowerCase();
    if (name.startsWith("movement ")) {
      (new Movement()).setValue("movement",name.substring(9));
      name = "movement";
    }
    Path p = (Path)paths.get(name);
    if (p == null)
      throw new PathNotFoundException("Path not found: "+name);
    Path r = new Path();
    for (ListIterator it = p.movelist.listIterator();
         it.hasNext();) {
      Movement m = (Movement)it.next();
      r.add((Movement)m.clone());
    }
    return r;
  }

  //  Draw the curves that make up the path
  public void paint(Graphics2D g2, AffineTransform start) {
    AffineTransform t1 = new AffineTransform();
    t1.scale(1,-1);
    t1.rotate(Math.toRadians(90));
    t1.concatenate(start);
    t1.scale(Dancer.size,Dancer.size);
    ListIterator itx = transformlist.listIterator();
    for (ListIterator it = movelist.listIterator();
         it.hasNext();) {
      Movement m = (Movement)it.next();
      g2.draw(t1.createTransformedShape(m.btranslate));
      t1 = new AffineTransform();  // (start)
      t1.scale(1,-1);
      t1.rotate(Math.toRadians(90));
      t1.concatenate(start);
      t1.concatenate((AffineTransform)itx.next());
      t1.scale(Dancer.size,Dancer.size);
    }
  }

  public void setValue(String name, String value)
      throws PathNotFoundException {
    name = (new TAMstrip(name.toLowerCase())).toString();
    StringTokenizer st = new StringTokenizer(value.toLowerCase(),";");
    Path p = new Path();
    while (st.hasMoreTokens()) {
      String pname = st.nextToken().trim();
      String options = "";
      int i = pname.indexOf("[");
      if (i > 0) {
        options = pname.substring(i+1);
        pname = pname.substring(0,i).trim();
      }
      Path p1;
      if (pname.startsWith("movement ")) {
        (new Movement()).setValue("movement",pname.substring(9));
        p1 = get("movement");
      }
      else
        p1 = get((new TAMstrip(pname)).toString());
      StringTokenizer st2 = new StringTokenizer(options,",]");
      int hands = Movement.NOHANDS;
      while (st2.hasMoreTokens()) {
        String option = st2.nextToken().trim();
        //  Should really check for ok numbers here
        if ("1234567890.-+".indexOf(option.substring(0,1)) >= 0) {
          StringTokenizer st3 = new StringTokenizer(option);
          if (st3.countTokens() == 1) {
            double beats = Double.parseDouble(st3.nextToken());
            p1.changebeats(beats);
          } else {
            double x = Double.parseDouble(st3.nextToken());
            double y = Double.parseDouble(st3.nextToken());
            if ("+-".indexOf(option.substring(0,1)) >= 0)
              p1.skew(x,y);
            else
              p1.scale(x,y);
          }
        }
        else if (option.startsWith("beats ")) {
          double beats = Double.parseDouble(option.substring(5).trim());
          p1.changebeats(beats);
        } else if (option.startsWith("scale ")) {
          StringTokenizer st3 = new StringTokenizer(option.substring(6));
          double xscale = Double.parseDouble(st3.nextToken());
          double yscale = Double.parseDouble(st3.nextToken());
          p1.scale(xscale,yscale);
        }
        else if (option.equals("reflect"))
          p1.reflect();
        else if (option.equals("nohands"))
          p1.changehands(hands = Movement.NOHANDS);
        else if (option.equals("lefthand"))
          p1.changehands(hands |= Movement.LEFTHAND);
        else if (option.equals("righthand"))
          p1.changehands(hands |= Movement.RIGHTHAND);
        else if (option.equals("bothhands"))
          p1.changehands(hands = Movement.BOTHHANDS);
        else if (option.equals("gripright"))
          p1.changehands(hands |= Movement.GRIPRIGHT);
        else if (option.equals("gripleft"))
          p1.changehands(hands |= Movement.GRIPLEFT);
        else if (option.equals("gripboth"))
          p1.changehands(hands = Movement.GRIPBOTH);
        else
          throw new PathNotFoundException("Option not found: "+option);
      }
      p.add(p1);
    }
    paths.put(name,p);
  }

}

////////////////////////////////////////////////////////////////////////////////

class Dancer implements Cloneable {

  static int size = 28;
  Color drawcolor;
  Color fillcolor;
  double startx,starty,startangle;
  AffineTransform start;
  AffineTransform tx;  // transform for current position
  Path path;
  Shape body;
  Shape head;
  int gender;
  int hands;  // hand usage at current position
  boolean showpath;
  GeneralPath pathpath;
  Dancer leftgrip;   // force handhold to this dancer
  Dancer rightgrip;
  Dancer lefthand;  // for handhold calc
  Dancer righthand;
  double prevangle;  // for hexagon calc

  static final int boy = 1;
  static final int girl = 2;
  static final int phantom = 3;

  Dancer(int sex, double x, double y, double angle, Color color, Path p)
  {
    fillcolor = color;
    drawcolor = color.darker();
    startx = x;
    starty = y;
    startangle = angle;
    computeStart();
    path = p;
    gender = sex;
    showpath = false;
    leftgrip = null;
    rightgrip = null;
    pathpath = null;
  }

  public Object clone()
  {
    Dancer d = null;
    try {
      d = (Dancer)super.clone();
    } catch (Exception ex) { ex.printStackTrace(); }
    return d;
  }

  public void computeStart()
  {
    start = new AffineTransform();
    start.translate(size*startx,size*starty);
    start.rotate(Math.toRadians(startangle));
  }

  public void recalculate()
  {
    path.recalculate();
  }

  //  Return distance from center
  public double distance()
  {
    double x = tx.getTranslateX();
    double y = tx.getTranslateY();
    return Math.sqrt(x*x+y*y);
  }

  public void animate(double beat)
  {
    //  Choose the shape
    if (gender == phantom)
      body = new RoundRectangle2D.Double(2-size/2,2-size/2,size-3,size-3,
                                         size/2,size/2);
    else if (gender == boy)
      body = new Rectangle2D.Double(2-size/2,2-size/2,size-3,size-3);
    else
      body = new Ellipse2D.Double(2-size/2,2-size/2,size-3,size-3);
    head = new Ellipse2D.Double(size/4,-size/4,size/2+1,size/2+1);
    //  Start to build transform
    tx = new AffineTransform();
    //  Invert y and set x to vertical
    tx.scale(1,-1);
    tx.rotate(Math.toRadians(90));
    //  Apply all completed movements
    AffineTransform tx2 = start;
    Movement m = null;
    if (path != null) {
      ListIterator itx = path.transformlist.listIterator();
      for (ListIterator it = path.movelist.listIterator();
           it.hasNext();) {
        m = (Movement)it.next();
        if (beat >= m.beats) {
          tx2 = new AffineTransform(start);
          tx2.concatenate((AffineTransform)itx.next());
          beat -= m.beats;
          m = null;
        } else
          break;
      }
    }
    tx.concatenate(tx2);
    //  Apply movement in progress
    if (m != null) {
      tx.concatenate(m.translate(beat));
      tx.concatenate(m.rotate(beat));
      hands = m.usehands;
      if ((m.usehands & Movement.GRIPLEFT) == 0)
        leftgrip = null;
      if ((m.usehands & Movement.GRIPRIGHT) == 0)
        rightgrip = null;
    }
    tx.scale(1,-1);
    body = tx.createTransformedShape(body);
    head = tx.createTransformedShape(head);
  }

  public void concatenate(AffineTransform tx2)
  {
    tx.preConcatenate(tx2);
    body = tx2.createTransformedShape(body);
    head = tx2.createTransformedShape(head);
  }

  public void paint(Graphics2D g2)
  {
    Graphics2D g3 = (Graphics2D)g2.create();
    g3.setColor(drawcolor);
//    if (showpath && path != null) {
//      g3.setStroke(new BasicStroke(1));
//      path.paint(g3,start);
//    }
    g3.fill(head);
    g3.setColor(fillcolor);
    g3.fill(body);
    g3.setColor(drawcolor);
    g3.setStroke(new BasicStroke(3));
    g3.draw(body);
  }

}

////////////////////////////////////////////////////////////////////////////////

//  A Movement describes one square dance move for one dancer
class Movement implements Cloneable, SetValue {

  Bezier btranslate;
  Bezier brotate;
  double beats;
  int usehands;

  static final int NOHANDS = 0;
  static final int LEFTHAND = 1;
  static final int RIGHTHAND = 2;
  static final int BOTHHANDS = 3;
  static final int GRIPLEFT = 5;
  static final int GRIPRIGHT = 6;
  static final int GRIPBOTH = 7;
  static final int ANYGRIP = 4;

  //  Dummy constructor for parsing input
  Movement() { }

  //  Constructor for movement always heading in direction of movement
  Movement(double b,
           double ctrlx1, double ctrly1,
           double ctrlx2, double ctrly2, double x2, double y2)
  {
    this(b,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2,ctrlx1,ctrly2,ctrlx2,ctrly2,x2,y2);
  }
  //  Constructor for independent heading and movement
  Movement(double b,
           double ctrlx1, double ctrly1,
           double ctrlx2, double ctrly2, double x2, double y2,
           double ctrlx3, double ctrly3,
           double ctrlx4, double ctrly4, double x4, double y4)
  {
    btranslate = new Bezier(0,0,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2);
    brotate = new Bezier(0,0,ctrlx3,ctrly3,ctrlx4,ctrly4,x4,y4);
    beats = b;
    usehands = NOHANDS;
  }
  //  Constructor for movement like another but faster or slower
  Movement(double b, Movement m)
  {
    beats = b;
    btranslate = m.btranslate;
    brotate = m.brotate;
    usehands = m.usehands;
  }
  //  Same for path for convenience
  Movement(double b, Path p)
  {
    beats = b;
    btranslate = ((Movement)p.movelist.get(0)).btranslate;
    brotate = ((Movement)p.movelist.get(0)).brotate;
    usehands = ((Movement)p.movelist.get(0)).usehands;
  }

  //  Set hand usage
  Movement useHands(int h)
  {
    usehands = h;
    return this;
  }

  public Object clone() {
    Movement m = new Movement(beats,
                        btranslate.ctrlx1,btranslate.ctrly1,
                        btranslate.ctrlx2,btranslate.ctrly2,
                        btranslate.x2,btranslate.y2,
                        brotate.ctrlx1,brotate.ctrly1,
                        brotate.ctrlx2,brotate.ctrly2,
                        brotate.x2,brotate.y2);
    m.usehands = usehands;
    return m;
  }

  public AffineTransform translate(double t) {
    t = Math.min(Math.max(0,t),beats);
    return btranslate.translate(t/beats);
  }

  public Movement reflect()
  {
    return scale(1,-1);
  }

  public AffineTransform rotate(double t) {
    t = Math.min(Math.max(0,t),beats);
    return brotate.rotate(t/beats);
  }

  public Movement scale(double x, double y) {
    btranslate = new Bezier(0,0,btranslate.ctrlx1*x,btranslate.ctrly1*y,
                            btranslate.ctrlx2*x,btranslate.ctrly2*y,
                            btranslate.x2*x,btranslate.y2*y);
    brotate = new Bezier(0,0,brotate.ctrlx1*x,brotate.ctrly1*y,
                         brotate.ctrlx2*x,brotate.ctrly2*y,
                         brotate.x2*x,brotate.y2*y);

    if (y < 0) {
      if (usehands == LEFTHAND)
        usehands = RIGHTHAND;
      else if (usehands == RIGHTHAND)
        usehands = LEFTHAND;
    }
    return this;
  }

  //  Skew the movement by translating the destination point
  public Movement skew(double x, double y) {
    btranslate = new Bezier(0,0,btranslate.ctrlx1,btranslate.ctrly1,
                            btranslate.ctrlx2+x,btranslate.ctrly2+y,
                            btranslate.x2+x,btranslate.y2+y);
    return this;
  }

  //  Parse an input value
  public void setValue(String name, String value) {
    StringTokenizer st = new StringTokenizer(value);
    String handstring = st.nextToken();
    int usemyhands = NOHANDS;
    if (handstring.equals("right"))
      usemyhands = RIGHTHAND;
    else if (handstring.equals("left"))
      usemyhands = LEFTHAND;
    else if (handstring.equals("both"))
      usemyhands = BOTHHANDS;
    else if (handstring.equals("gripleft"))
      usemyhands = GRIPLEFT;
    else if (handstring.equals("gripright"))
      usemyhands = GRIPRIGHT;
    else if (handstring.equals("gripboth"))
      usemyhands = GRIPBOTH;
    double mybeats = Double.parseDouble(st.nextToken());
    double ctrlx1 = Double.parseDouble(st.nextToken());
    double ctrly1 = Double.parseDouble(st.nextToken());
    double ctrlx2 = Double.parseDouble(st.nextToken());
    double ctrly2 = Double.parseDouble(st.nextToken());
    double x2 = Double.parseDouble(st.nextToken());
    double y2 = Double.parseDouble(st.nextToken());
    double ctrlx3 = ctrlx1;
    double ctrlx4 = ctrlx2;
    double ctrly4 = ctrly2;
    double x4 = x2;
    double y4 = y2;
    if (st.hasMoreTokens()) {
      ctrlx3 = Double.parseDouble(st.nextToken());
      ctrlx4 = Double.parseDouble(st.nextToken());
      ctrly4 = Double.parseDouble(st.nextToken());
      x4 = Double.parseDouble(st.nextToken());
      y4 = Double.parseDouble(st.nextToken());
    }
    Movement m = new Movement(mybeats,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2,
                              ctrlx3,0,ctrlx4,ctrly4,x4,y4);
    m.useHands(usemyhands);
    name = (new TAMstrip(name.toLowerCase())).toString();
    Path.paths.put(name,(new Path()).add(m));
  }

}

////////////////////////////////////////////////////////////////////////////////

class Bezier extends CubicCurve2D.Double
{
  private static final long serialVersionUID = 1L;
  //  These are the coefficients - the end and control points
  //  are inherited from CubicCurve2D.Double
  double ax,bx,cx,ay,by,cy;

  Bezier() {
    super();
    calculatecoefficients();
  }

  Bezier(double x1, double y1, double ctrlx1, double ctrly1,
         double ctrlx2, double ctrly2, double x2, double y2)
  {
    super(x1,y1,ctrlx1,ctrly1,ctrlx2,ctrly2,x2,y2);
    calculatecoefficients();
  }

  Bezier(Point2D.Double p1, Point2D.Double c1,
         Point2D.Double c2, Point2D.Double p2)
  {
    super(p1.x,p1.y,c1.x,c1.y,c2.x,c2.y,p2.x,p2.y);
    calculatecoefficients();
  }

  private void calculatecoefficients()
  {
    cx = 3.0*(ctrlx1-x1);
    bx = 3.0*(ctrlx2-ctrlx1) - cx;
    ax = x2 - x1 - cx - bx;

    cy = 3.0*(ctrly1-y1);
    by = 3.0*(ctrly2-ctrly1) - cy;
    ay = y2 - y1 - cy - by;
  }

  //  Return the movement along the curve given "t" between 0 and 1
  AffineTransform translate(double t)
  {
    double x = x1 + t*(cx + t*(bx + t*ax));
    double y = y1 + t*(cy + t*(by + t*ay));
    return AffineTransform.getTranslateInstance(Dancer.size*x,
                                                Dancer.size*y);
  }

  //  Return the angle of the derivative given "t" between 0 and 1
  AffineTransform rotate(double t)
  {
    double x = cx + t*(2.0*bx + t*3.0*ax);
    double y = cy + t*(2.0*by + t*3.0*ay);
    double theta = Math.atan2(y,x);
    return AffineTransform.getRotateInstance(theta);
  }

}

////////////////////////////////////////////////////////////////////////////////

class Formation implements SetValue{

  static Hashtable formations = new Hashtable();
  ArrayList dancers;

  //  Dummy constructor for parsing input
  Formation () { }

  static ArrayList get(String name) throws FormationNotFoundException
  {
    ArrayList retval = new ArrayList();
    if (name!=null) {
        String myname = (new TAMstrip(name.toLowerCase())).toString();
        if (myname.length() > 10 &&  myname.substring(0,9).equals("formation")) {
            (new Formation()).setValue("f",name.substring(10));
            return get("f");
        }
        Formation form = (Formation)formations.get(myname);
        if (form == null)
            throw new FormationNotFoundException("Formation not found: "+myname);
        //  Return a cloned list of clones, so hexagons, phantoms, etc
        //  don't mess up the original formation
        for (int i0=0; i0<form.dancers.size(); i0++)
            retval.add(((Dancer)form.dancers.get(i0)).clone());
    }
    return retval;
  }

  static Color rotateColor(Color c) {
    float[] hsb = Color.RGBtoHSB(c.getRed(),c.getGreen(),c.getBlue(),null);
    return Color.getHSBColor(hsb[0]+0.5f,hsb[1],hsb[2]);
  }

  //  Formation of just two dancers
  Formation(int sex1, double x1, double y1, double angle1, Color color1)
  {
    dancers = new ArrayList();
    dancers.add(new Dancer(sex1,x1,y1,angle1,color1,null));
    dancers.add(new Dancer(sex1,-x1,-y1,angle1+180,rotateColor(color1),null));
  }

  //  Formation of two couples
  Formation(int sex1, double x1, double y1, double angle1, Color c1,
            int sex2, double x2, double y2, double angle2, Color c2)
  {
    dancers = new ArrayList();
    dancers.add(new Dancer(sex1,x1,y1,angle1,c1,null));
    dancers.add(new Dancer(sex1,-x1,-y1,angle1+180,rotateColor(c1),null));
    dancers.add(new Dancer(sex2,x2,y2,angle2,c2,null));
    dancers.add(new Dancer(sex2,-x2,-y2,angle2+180,rotateColor(c2),null));
  }

  //  Formation of three couples
  Formation(int sex1, double x1, double y1, double angle1, Color c1,
            int sex2, double x2, double y2, double angle2, Color c2,
            int sex3, double x3, double y3, double angle3, Color c3)
  {
    dancers = new ArrayList();
    dancers.add(new Dancer(sex1,x1,y1,angle1,c1,null));
    dancers.add(new Dancer(sex1,-x1,-y1,angle1+180,rotateColor(c1),null));
    dancers.add(new Dancer(sex2,x2,y2,angle2,c2,null));
    dancers.add(new Dancer(sex2,-x2,-y2,angle2+180,rotateColor(c2),null));
    dancers.add(new Dancer(sex3,x3,y3,angle3,c3,null));
    dancers.add(new Dancer(sex3,-x3,-y3,angle3+180,rotateColor(c3),null));
  }

  //  Formation of four couples (complete square)
  Formation(int sex1, double x1, double y1, double angle1, Color c1,
            int sex2, double x2, double y2, double angle2, Color c2,
            int sex3, double x3, double y3, double angle3, Color c3,
            int sex4, double x4, double y4, double angle4, Color c4)
  {
    dancers = new ArrayList();
    dancers.add(new Dancer(sex1,x1,y1,angle1,c1,null));
    dancers.add(new Dancer(sex1,-x1,-y1,angle1+180,rotateColor(c1),null));
    dancers.add(new Dancer(sex2,x2,y2,angle2,c2,null));
    dancers.add(new Dancer(sex2,-x2,-y2,angle2+180,rotateColor(c2),null));
    dancers.add(new Dancer(sex3,x3,y3,angle3,c3,null));
    dancers.add(new Dancer(sex3,-x3,-y3,angle3+180,rotateColor(c3),null));
    dancers.add(new Dancer(sex4,x4,y4,angle4,c4,null));
    dancers.add(new Dancer(sex4,-x4,-y4,angle4+180,rotateColor(c4),null));
  }

  //  Formations with phantoms
  Formation(int sex1, double x1, double y1, double angle1, Color c1,
            int sex2, double x2, double y2, double angle2, Color c2,
            int sex3, double x3, double y3, double angle3, Color c3,
            int sex4, double x4, double y4, double angle4, Color c4,
            int sex5, double x5, double y5, double angle5, Color c5)
  {
    dancers = new ArrayList();
    dancers.add(new Dancer(sex1,x1,y1,angle1,c1,null));
    dancers.add(new Dancer(sex1,-x1,-y1,angle1+180,rotateColor(c1),null));
    dancers.add(new Dancer(sex2,x2,y2,angle2,c2,null));
    dancers.add(new Dancer(sex2,-x2,-y2,angle2+180,rotateColor(c2),null));
    dancers.add(new Dancer(sex3,x3,y3,angle3,c3,null));
    dancers.add(new Dancer(sex3,-x3,-y3,angle3+180,rotateColor(c3),null));
    dancers.add(new Dancer(sex4,x4,y4,angle4,c4,null));
    dancers.add(new Dancer(sex4,-x4,-y4,angle4+180,rotateColor(c4),null));
    dancers.add(new Dancer(sex5,x5,y5,angle5,c5,null));
    dancers.add(new Dancer(sex5,-x5,-y5,angle5+180,c5,null));
  }

  Formation(int sex1, double x1, double y1, double angle1, Color c1,
            int sex2, double x2, double y2, double angle2, Color c2,
            int sex3, double x3, double y3, double angle3, Color c3,
            int sex4, double x4, double y4, double angle4, Color c4,
            int sex5, double x5, double y5, double angle5, Color c5,
            int sex6, double x6, double y6, double angle6, Color c6)
  {
    dancers = new ArrayList();
    dancers.add(new Dancer(sex1,x1,y1,angle1,c1,null));
    dancers.add(new Dancer(sex1,-x1,-y1,angle1+180,rotateColor(c1),null));
    dancers.add(new Dancer(sex2,x2,y2,angle2,c2,null));
    dancers.add(new Dancer(sex2,-x2,-y2,angle2+180,rotateColor(c2),null));
    dancers.add(new Dancer(sex3,x3,y3,angle3,c3,null));
    dancers.add(new Dancer(sex3,-x3,-y3,angle3+180,rotateColor(c3),null));
    dancers.add(new Dancer(sex4,x4,y4,angle4,c4,null));
    dancers.add(new Dancer(sex4,-x4,-y4,angle4+180,rotateColor(c4),null));
    dancers.add(new Dancer(sex5,x5,y5,angle5,c5,null));
    dancers.add(new Dancer(sex5,-x5,-y5,angle5+180,c5,null));
    dancers.add(new Dancer(sex6,x6,y6,angle6,c6,null));
    dancers.add(new Dancer(sex6,-x6,-y6,angle6+180,c6,null));
  }

  public void setValue(String name, String value) {
    name = (new TAMstrip(name.toLowerCase())).toString();
    StringTokenizer st = new StringTokenizer(value);
    int i = st.countTokens();
    int d1,d2,d3,d4,d5,d6;
    d1 = d2 = d3 = d4 = Dancer.boy;
    d5 = d6 = Dancer.phantom;
    double x1,y1,a1,x2,y2,a2,x3,y3,a3,x4,y4,a4,x5,y5,a5,x6,y6,a6;
    x1 = y1 = a1 = x2 = y2 = a2 = x3 = y3 = a3 = x4 = y4 = a4 = 0;
    x5 = y5 = a5 = x6 = y6 = a6 = 0;
    d1 = st.nextToken().equals("boy") ? Dancer.boy : Dancer.girl;
    x1 = Double.parseDouble(st.nextToken());
    y1 = Double.parseDouble(st.nextToken());
    a1 = Double.parseDouble(st.nextToken());
    if (i >= 8) {
      d2 = st.nextToken().equals("boy") ? Dancer.boy : Dancer.girl;
      x2 = Double.parseDouble(st.nextToken());
      y2 = Double.parseDouble(st.nextToken());
      a2 = Double.parseDouble(st.nextToken());
    }
    if (i >= 12) {
      d3 = st.nextToken().equals("boy") ? Dancer.boy : Dancer.girl;
      x3 = Double.parseDouble(st.nextToken());
      y3 = Double.parseDouble(st.nextToken());
      a3 = Double.parseDouble(st.nextToken());
    }
    if (i >= 16) {
      d4 = st.nextToken().equals("boy") ? Dancer.boy : Dancer.girl;
      x4 = Double.parseDouble(st.nextToken());
      y4 = Double.parseDouble(st.nextToken());
      a4 = Double.parseDouble(st.nextToken());
    }
    if (i >= 20) {
      st.nextToken();  // 'phantom'
      d5 = Dancer.phantom;
      x5 = Double.parseDouble(st.nextToken());
      y5 = Double.parseDouble(st.nextToken());
      a5 = Double.parseDouble(st.nextToken());
    }
    if (i >= 24) {
      st.nextToken();  // 'phantom'
      d6 = Dancer.phantom;
      x6 = Double.parseDouble(st.nextToken());
      y6 = Double.parseDouble(st.nextToken());
      a6 = Double.parseDouble(st.nextToken());
    }
    if (i >= 24)
      formations.put(name,new Formation(d1,x1,y1,a1,Color.red,
                                        d2,x2,y2,a2,Color.red,
                                        d3,x3,y3,a3,Color.yellow,
                                        d4,x4,y4,a4,Color.yellow,
                                        d5,x5,y5,a5,Color.lightGray,
                                        d6,x6,y6,a6,Color.lightGray));
    else if (i >= 20)
      formations.put(name,new Formation(d1,x1,y1,a1,Color.red,
                                        d2,x2,y2,a2,Color.red,
                                        d3,x3,y3,a3,Color.yellow,
                                        d4,x4,y4,a4,Color.yellow,
                                        d5,x5,y5,a5,Color.lightGray));
    else if (i >= 16)
      formations.put(name,new Formation(d1,x1,y1,a1,Color.red,
                                        d2,x2,y2,a2,Color.red,
                                        d3,x3,y3,a3,Color.yellow,
                                        d4,x4,y4,a4,Color.yellow));
    else if (i >= 12)
      formations.put(name,new Formation(d1,x1,y1,a1,Color.red,
                                        d2,x2,y2,a2,Color.red,
                                        d3,x3,y3,a3,Color.blue));
    else if (i >= 8)
        formations.put(name,new Formation(d1,x1,y1,a1,Color.red,
                                          d2,x2,y2,a2,Color.red));
    else
      formations.put(name,new Formation(d1,x1,y1,a1,Color.red));
  }


}

class TAMstrip {
  String str;
  TAMstrip(String s) { str = s; }
  public String toString() {
    StringTokenizer st = new StringTokenizer(str);
    String retval = "";
    while (st.hasMoreTokens())
      retval += st.nextToken();
    return retval;
  }
}

class TAMinationException extends Exception
{
  private static final long serialVersionUID = 1L;
  TAMinationException(String message) { super(message); }
}
class FormationNotFoundException extends TAMinationException
{
  private static final long serialVersionUID = 1L;
  FormationNotFoundException(String message) { super(message); }
}
class PathNotFoundException extends TAMinationException
{
  private static final long serialVersionUID = 1L;
  PathNotFoundException(String message) { super(message); }
}
